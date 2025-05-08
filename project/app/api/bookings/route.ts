import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/db/connect';
import { Booking } from '@/lib/db/models/Booking';
import { Property } from '@/lib/db/models/Property';
import { User } from '@/lib/db/models/User';
import { Notification } from '@/lib/db/models/Notification';
import { pusherServer } from '@/lib/pusher';
import { CHANNELS, EVENTS } from '@/lib/pusher';

// GET /api/bookings - Get all bookings for the current user
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    
    await dbConnect();
    
    let query = {};
    
    // Filter bookings based on user role
    if (role === 'tenant') {
      query = { tenant: session.user.id };
    } else if (role === 'landlord') {
      query = { landlord: session.user.id };
    } else if (session.user.role === 'admin') {
      // Admin can see all bookings
    } else {
      // Default to tenant view for regular users
      query = { tenant: session.user.id };
    }
    
    const bookings = await Booking.find(query)
      .populate('property', 'title images price location')
      .populate('tenant', 'name email image')
      .populate('landlord', 'name email image')
      .sort({ createdAt: -1 });
    
    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/bookings - Create a new booking
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { propertyId, startDate, endDate, notes } = await request.json();
    
    if (!propertyId || !startDate || !endDate) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    await dbConnect();
    
    // Get property details
    const property = await Property.findById(propertyId).populate('landlord');
    
    if (!property) {
      return NextResponse.json(
        { message: 'Property not found' },
        { status: 404 }
      );
    }
    
    // Calculate total amount (simplified for demo)
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const totalAmount = property.price * days;
    
    // Create booking
    const booking = await Booking.create({
      property: propertyId,
      tenant: session.user.id,
      landlord: property.landlord,
      startDate,
      endDate,
      totalAmount,
      status: 'pending',
      paymentStatus: 'unpaid',
      notes
    });
    
    // Create notification for landlord
    await Notification.create({
      title: 'New Booking Request',
      message: `You have a new booking request for ${property.title}`,
      type: 'rental',
      recipient: property.landlord,
      sender: session.user.id,
      isRead: false,
      description: `Booking from ${start.toLocaleDateString()} to ${end.toLocaleDateString()}`,
      urgency: 'regular',
      relatedId: booking._id,
      onModel: 'Booking'
    });
    
    // Send real-time notification if Pusher is configured
    try {
      const landlordSocketId = property.landlord.toString();
      pusherServer.trigger(
        `${CHANNELS.NOTIFICATIONS}-${landlordSocketId}`,
        EVENTS.NEW_NOTIFICATION,
        {
          title: 'New Booking Request',
          message: `You have a new booking request for ${property.title}`
        }
      );
    } catch (error) {
      console.error('Error sending notification:', error);
    }
    
    return NextResponse.json(
      { 
        message: 'Booking created successfully',
        booking: {
          id: booking._id,
          property: {
            id: property._id,
            title: property.title
          },
          startDate,
          endDate,
          totalAmount,
          status: booking.status
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

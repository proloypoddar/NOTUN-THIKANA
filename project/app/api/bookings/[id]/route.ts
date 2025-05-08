import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/db/connect';
import { Booking } from '@/lib/db/models/Booking';
import { Notification } from '@/lib/db/models/Notification';
import { pusherServer } from '@/lib/pusher';
import { CHANNELS, EVENTS } from '@/lib/pusher';

// GET /api/bookings/[id] - Get a specific booking
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    await dbConnect();
    
    const booking = await Booking.findById(params.id)
      .populate('property', 'title images price location type bedrooms bathrooms area features')
      .populate('tenant', 'name email image phone')
      .populate('landlord', 'name email image phone')
      .populate('paymentId');
    
    if (!booking) {
      return NextResponse.json(
        { message: 'Booking not found' },
        { status: 404 }
      );
    }
    
    // Check if user has permission to view this booking
    const isAuthorized = 
      session.user.role === 'admin' || 
      booking.tenant._id.toString() === session.user.id || 
      booking.landlord._id.toString() === session.user.id;
    
    if (!isAuthorized) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    return NextResponse.json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/bookings/[id] - Update a booking status
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { status, notes } = await request.json();
    
    await dbConnect();
    
    const booking = await Booking.findById(params.id)
      .populate('property', 'title')
      .populate('tenant', 'name')
      .populate('landlord');
    
    if (!booking) {
      return NextResponse.json(
        { message: 'Booking not found' },
        { status: 404 }
      );
    }
    
    // Check if user has permission to update this booking
    const isLandlord = booking.landlord._id.toString() === session.user.id;
    const isAdmin = session.user.role === 'admin';
    
    if (!isLandlord && !isAdmin) {
      return NextResponse.json(
        { message: 'Unauthorized to update booking status' },
        { status: 403 }
      );
    }
    
    // Update booking
    booking.status = status || booking.status;
    if (notes) booking.notes = notes;
    booking.updatedAt = new Date();
    
    await booking.save();
    
    // Create notification for tenant
    await Notification.create({
      title: `Booking ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      message: `Your booking for ${booking.property.title} has been ${status}`,
      type: 'rental',
      recipient: booking.tenant._id,
      sender: session.user.id,
      isRead: false,
      description: `Booking status updated to ${status}`,
      urgency: status === 'cancelled' ? 'urgent' : 'regular',
      relatedId: booking._id,
      onModel: 'Booking'
    });
    
    // Send real-time notification
    try {
      const tenantSocketId = booking.tenant._id.toString();
      pusherServer.trigger(
        `${CHANNELS.NOTIFICATIONS}-${tenantSocketId}`,
        EVENTS.NEW_NOTIFICATION,
        {
          title: `Booking ${status.charAt(0).toUpperCase() + status.slice(1)}`,
          message: `Your booking for ${booking.property.title} has been ${status}`
        }
      );
    } catch (error) {
      console.error('Error sending notification:', error);
    }
    
    return NextResponse.json({
      message: `Booking ${status} successfully`,
      booking: {
        id: booking._id,
        status: booking.status,
        updatedAt: booking.updatedAt
      }
    });
  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/bookings/[id] - Cancel a booking
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    await dbConnect();
    
    const booking = await Booking.findById(params.id)
      .populate('property', 'title')
      .populate('tenant')
      .populate('landlord');
    
    if (!booking) {
      return NextResponse.json(
        { message: 'Booking not found' },
        { status: 404 }
      );
    }
    
    // Check if user has permission to cancel this booking
    const isTenant = booking.tenant._id.toString() === session.user.id;
    const isLandlord = booking.landlord._id.toString() === session.user.id;
    const isAdmin = session.user.role === 'admin';
    
    if (!isTenant && !isLandlord && !isAdmin) {
      return NextResponse.json(
        { message: 'Unauthorized to cancel booking' },
        { status: 403 }
      );
    }
    
    // Update booking status to cancelled
    booking.status = 'cancelled';
    booking.updatedAt = new Date();
    
    await booking.save();
    
    // Create notification for the other party
    const recipient = isTenant ? booking.landlord._id : booking.tenant._id;
    const recipientName = isTenant ? booking.landlord.name : booking.tenant.name;
    
    await Notification.create({
      title: 'Booking Cancelled',
      message: `Booking for ${booking.property.title} has been cancelled`,
      type: 'rental',
      recipient,
      sender: session.user.id,
      isRead: false,
      description: `Booking cancelled by ${session.user.name}`,
      urgency: 'urgent',
      relatedId: booking._id,
      onModel: 'Booking'
    });
    
    return NextResponse.json({
      message: 'Booking cancelled successfully'
    });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

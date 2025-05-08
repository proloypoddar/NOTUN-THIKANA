import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/db/connect';
import { LandlordRating } from '@/lib/db/models/LandlordRating';
import { User } from '@/lib/db/models/User';
import { Booking } from '@/lib/db/models/Booking';
import { Notification } from '@/lib/db/models/Notification';
import { pusherServer } from '@/lib/pusher';
import { CHANNELS, EVENTS } from '@/lib/pusher';

// GET /api/landlords/ratings - Get ratings for landlords
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const landlordId = searchParams.get('landlordId');
    const propertyId = searchParams.get('propertyId');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    await dbConnect();
    
    let query = {};
    
    if (landlordId) {
      query = { ...query, landlord: landlordId };
    }
    
    if (propertyId) {
      query = { ...query, property: propertyId };
    }
    
    const ratings = await LandlordRating.find(query)
      .populate('tenant', 'name image')
      .populate('property', 'title')
      .sort({ createdAt: -1 })
      .limit(limit);
    
    // Calculate average ratings
    const averageRating = await LandlordRating.aggregate([
      { $match: query },
      { 
        $group: { 
          _id: null, 
          average: { $avg: '$rating' },
          count: { $sum: 1 },
          cleanliness: { $avg: '$categories.cleanliness' },
          communication: { $avg: '$categories.communication' },
          value: { $avg: '$categories.value' },
          location: { $avg: '$categories.location' },
          accuracy: { $avg: '$categories.accuracy' }
        } 
      }
    ]);
    
    return NextResponse.json({
      ratings,
      stats: averageRating.length > 0 ? {
        average: parseFloat(averageRating[0].average.toFixed(1)),
        count: averageRating[0].count,
        categories: {
          cleanliness: parseFloat(averageRating[0].cleanliness?.toFixed(1) || '0'),
          communication: parseFloat(averageRating[0].communication?.toFixed(1) || '0'),
          value: parseFloat(averageRating[0].value?.toFixed(1) || '0'),
          location: parseFloat(averageRating[0].location?.toFixed(1) || '0'),
          accuracy: parseFloat(averageRating[0].accuracy?.toFixed(1) || '0')
        }
      } : {
        average: 0,
        count: 0,
        categories: {
          cleanliness: 0,
          communication: 0,
          value: 0,
          location: 0,
          accuracy: 0
        }
      }
    });
  } catch (error) {
    console.error('Error fetching landlord ratings:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/landlords/ratings - Create a new rating
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { landlordId, propertyId, bookingId, rating, review, categories } = await request.json();
    
    if (!landlordId || !propertyId || !rating) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    await dbConnect();
    
    // Verify the landlord exists
    const landlord = await User.findById(landlordId);
    if (!landlord || landlord.role !== 'landlord') {
      return NextResponse.json(
        { message: 'Landlord not found' },
        { status: 404 }
      );
    }
    
    // Check if the user has already rated this landlord for this property
    const existingRating = await LandlordRating.findOne({
      landlord: landlordId,
      tenant: session.user.id,
      property: propertyId
    });
    
    if (existingRating) {
      return NextResponse.json(
        { message: 'You have already rated this landlord for this property' },
        { status: 409 }
      );
    }
    
    // Create the rating
    const newRating = await LandlordRating.create({
      landlord: landlordId,
      tenant: session.user.id,
      property: propertyId,
      booking: bookingId,
      rating,
      review,
      categories,
      isVerified: !!bookingId // Verify if there's a booking associated
    });
    
    // Create notification for landlord
    await Notification.create({
      title: 'New Rating Received',
      message: `You have received a ${rating}-star rating`,
      type: 'rental',
      recipient: landlordId,
      sender: session.user.id,
      isRead: false,
      description: review ? `Review: ${review.substring(0, 50)}...` : 'No review provided',
      urgency: 'regular',
      relatedId: newRating._id,
      onModel: 'LandlordRating'
    });
    
    // Send real-time notification
    try {
      pusherServer.trigger(
        `${CHANNELS.NOTIFICATIONS}-${landlordId}`,
        EVENTS.NEW_NOTIFICATION,
        {
          title: 'New Rating Received',
          message: `You have received a ${rating}-star rating`
        }
      );
    } catch (error) {
      console.error('Error sending notification:', error);
    }
    
    return NextResponse.json(
      { 
        message: 'Rating submitted successfully',
        rating: newRating
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating rating:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

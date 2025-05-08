import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connect';
import { User } from '@/lib/db/models/User';
import { LandlordRating } from '@/lib/db/models/LandlordRating';
import { Property } from '@/lib/db/models/Property';
import { Booking } from '@/lib/db/models/Booking';

// GET /api/landlords/leaderboard - Get landlord leaderboard
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const sortBy = searchParams.get('sortBy') || 'rating'; // rating, properties, bookings
    
    await dbConnect();
    
    // Get all landlords
    const landlords = await User.find({ role: 'landlord' })
      .select('name email image phone createdAt');
    
    // Get ratings for each landlord
    const landlordStats = await Promise.all(
      landlords.map(async (landlord) => {
        // Get average rating
        const ratingStats = await LandlordRating.aggregate([
          { $match: { landlord: landlord._id } },
          { 
            $group: { 
              _id: null, 
              averageRating: { $avg: '$rating' },
              totalRatings: { $sum: 1 },
              // Category averages
              cleanliness: { $avg: '$categories.cleanliness' },
              communication: { $avg: '$categories.communication' },
              value: { $avg: '$categories.value' },
              location: { $avg: '$categories.location' },
              accuracy: { $avg: '$categories.accuracy' }
            } 
          }
        ]);
        
        // Get property count
        const propertyCount = await Property.countDocuments({ landlord: landlord._id });
        
        // Get booking stats
        const bookingStats = await Booking.aggregate([
          { $match: { landlord: landlord._id } },
          { 
            $group: { 
              _id: null, 
              totalBookings: { $sum: 1 },
              confirmedBookings: { 
                $sum: { 
                  $cond: [{ $eq: ['$status', 'confirmed'] }, 1, 0] 
                } 
              },
              completedBookings: { 
                $sum: { 
                  $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] 
                } 
              },
              totalRevenue: { 
                $sum: { 
                  $cond: [
                    { $in: ['$status', ['confirmed', 'completed']] }, 
                    '$totalAmount', 
                    0
                  ] 
                } 
              }
            } 
          }
        ]);
        
        return {
          id: landlord._id,
          name: landlord.name,
          email: landlord.email,
          image: landlord.image,
          phone: landlord.phone,
          createdAt: landlord.createdAt,
          rating: ratingStats.length > 0 ? parseFloat(ratingStats[0].averageRating.toFixed(1)) : 0,
          totalRatings: ratingStats.length > 0 ? ratingStats[0].totalRatings : 0,
          categories: ratingStats.length > 0 ? {
            cleanliness: parseFloat(ratingStats[0].cleanliness?.toFixed(1) || '0'),
            communication: parseFloat(ratingStats[0].communication?.toFixed(1) || '0'),
            value: parseFloat(ratingStats[0].value?.toFixed(1) || '0'),
            location: parseFloat(ratingStats[0].location?.toFixed(1) || '0'),
            accuracy: parseFloat(ratingStats[0].accuracy?.toFixed(1) || '0')
          } : {
            cleanliness: 0,
            communication: 0,
            value: 0,
            location: 0,
            accuracy: 0
          },
          propertyCount,
          bookings: bookingStats.length > 0 ? {
            total: bookingStats[0].totalBookings,
            confirmed: bookingStats[0].confirmedBookings,
            completed: bookingStats[0].completedBookings,
            revenue: bookingStats[0].totalRevenue
          } : {
            total: 0,
            confirmed: 0,
            completed: 0,
            revenue: 0
          }
        };
      })
    );
    
    // Sort landlords based on the requested criteria
    let sortedLandlords;
    
    switch (sortBy) {
      case 'properties':
        sortedLandlords = landlordStats.sort((a, b) => b.propertyCount - a.propertyCount);
        break;
      case 'bookings':
        sortedLandlords = landlordStats.sort((a, b) => b.bookings.total - a.bookings.total);
        break;
      case 'revenue':
        sortedLandlords = landlordStats.sort((a, b) => b.bookings.revenue - a.bookings.revenue);
        break;
      case 'rating':
      default:
        // Sort by rating first, then by number of ratings as a tiebreaker
        sortedLandlords = landlordStats.sort((a, b) => {
          if (b.rating === a.rating) {
            return b.totalRatings - a.totalRatings;
          }
          return b.rating - a.rating;
        });
    }
    
    // Limit the results
    const limitedResults = sortedLandlords.slice(0, limit);
    
    return NextResponse.json({
      leaderboard: limitedResults,
      totalLandlords: landlords.length
    });
  } catch (error) {
    console.error('Error fetching landlord leaderboard:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

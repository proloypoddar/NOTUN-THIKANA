import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/db/connect';
import { User } from '@/lib/db/models/User';
import { Property } from '@/lib/db/models/Property';
import { Booking } from '@/lib/db/models/Booking';
import { Payment } from '@/lib/db/models/Payment';
import { Notification } from '@/lib/db/models/Notification';

// GET /api/admin/users/[id] - Get a specific user (admin only)
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user is authenticated and is an admin
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Connect to the database
    await dbConnect();
    
    // Get the user
    const user = await User.findById(params.id).select('-password');
    
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }
    
    // Get additional user statistics
    let stats = {};
    
    if (user.role === 'landlord') {
      // Get property count
      const propertyCount = await Property.countDocuments({ landlord: user._id });
      
      // Get booking stats
      const bookingStats = await Booking.aggregate([
        { $match: { landlord: user._id } },
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
            }
          } 
        }
      ]);
      
      // Get payment stats
      const paymentStats = await Payment.aggregate([
        { $match: { receiver: user._id } },
        { 
          $group: { 
            _id: null, 
            totalAmount: { $sum: '$amount' },
            count: { $sum: 1 }
          } 
        }
      ]);
      
      stats = {
        properties: propertyCount,
        bookings: bookingStats.length > 0 ? {
          total: bookingStats[0].totalBookings,
          confirmed: bookingStats[0].confirmedBookings,
          completed: bookingStats[0].completedBookings
        } : {
          total: 0,
          confirmed: 0,
          completed: 0
        },
        payments: paymentStats.length > 0 ? {
          total: paymentStats[0].totalAmount,
          count: paymentStats[0].count
        } : {
          total: 0,
          count: 0
        }
      };
    } else if (user.role === 'user') {
      // Get booking stats
      const bookingStats = await Booking.aggregate([
        { $match: { tenant: user._id } },
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
            }
          } 
        }
      ]);
      
      // Get payment stats
      const paymentStats = await Payment.aggregate([
        { $match: { payer: user._id } },
        { 
          $group: { 
            _id: null, 
            totalAmount: { $sum: '$amount' },
            count: { $sum: 1 }
          } 
        }
      ]);
      
      stats = {
        bookings: bookingStats.length > 0 ? {
          total: bookingStats[0].totalBookings,
          confirmed: bookingStats[0].confirmedBookings,
          completed: bookingStats[0].completedBookings
        } : {
          total: 0,
          confirmed: 0,
          completed: 0
        },
        payments: paymentStats.length > 0 ? {
          total: paymentStats[0].totalAmount,
          count: paymentStats[0].count
        } : {
          total: 0,
          count: 0
        }
      };
    }
    
    return NextResponse.json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.verified ? 'active' : 'inactive',
        image: user.image,
        phone: user.phone,
        nid: user.nid,
        createdAt: user.createdAt,
        lastActive: user.lastActive
      },
      stats
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/users/[id] - Update a user (admin only)
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user is authenticated and is an admin
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { role, status, verified, name, phone } = await request.json();
    
    // Connect to the database
    await dbConnect();
    
    // Find the user
    const user = await User.findById(params.id);
    
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }
    
    // Update the user
    if (role) user.role = role;
    if (status !== undefined) user.verified = status === 'active';
    if (verified !== undefined) user.verified = verified;
    if (name) user.name = name;
    if (phone) user.phone = phone;
    
    await user.save();
    
    return NextResponse.json({
      message: 'User updated successfully',
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.verified ? 'active' : 'inactive',
        phone: user.phone
      }
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/users/[id] - Delete a user (admin only)
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user is authenticated and is an admin
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Connect to the database
    await dbConnect();
    
    // Find the user
    const user = await User.findById(params.id);
    
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }
    
    // Don't allow deleting the current admin
    if (user.email === session.user.email) {
      return NextResponse.json(
        { message: 'Cannot delete your own account' },
        { status: 400 }
      );
    }
    
    // Delete the user
    await User.findByIdAndDelete(params.id);
    
    // Delete related data (optional, could also just mark as deleted)
    // This is a simplified approach - in a real app, you might want to archive data instead
    if (user.role === 'landlord') {
      // Mark properties as unavailable instead of deleting
      await Property.updateMany(
        { landlord: user._id },
        { isApproved: false }
      );
    }
    
    return NextResponse.json({
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

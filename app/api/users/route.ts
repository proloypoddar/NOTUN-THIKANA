import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import dbConnect from '@/lib/db/connect';
import { User } from '@/lib/db/models/User';

// GET /api/users - Get all users for messaging
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get the query parameters
    const url = new URL(request.url);
    const search = url.searchParams.get('search') || '';
    
    await dbConnect();
    
    // Get the current user's ID
    const currentUserId = session.user.id;
    
    // Build the query
    let query: any = { 
      _id: { $ne: currentUserId } // Exclude the current user
    };
    
    // Add search filter if provided
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Get users from database
    const users = await User.find(query)
      .select('_id name email image role verified lastActive')
      .sort({ name: 1 })
      .limit(20);
    
    // Format the response
    const formattedUsers = users.map(user => ({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      image: user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`,
      role: user.role,
      verified: user.verified,
      lastActive: user.lastActive
    }));
    
    return NextResponse.json(formattedUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/db/connect';
import { User } from '@/lib/db/models/User';
import { Post } from '@/lib/db/models/Post';
import { Message } from '@/lib/db/models/Message';

// Get admin dashboard statistics
export async function GET() {
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
    
    // Get counts
    const userCount = await User.countDocuments({});
    const postCount = await Post.countDocuments({});
    const messageCount = await Message.countDocuments({});
    
    // Get user distribution by role
    const usersByRole = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Get recent users
    const recentUsers = await User.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email role createdAt');
    
    // Get recent posts
    const recentPosts = await Post.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('author', 'name')
      .select('title category createdAt');
    
    // Format the response
    const stats = {
      counts: {
        users: userCount,
        posts: postCount,
        messages: messageCount,
      },
      userDistribution: usersByRole.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      recentActivity: {
        users: recentUsers.map(user => ({
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
        })),
        posts: recentPosts.map(post => ({
          id: post._id.toString(),
          title: post.title,
          category: post.category,
          author: post.author ? post.author.name : 'Anonymous',
          createdAt: post.createdAt,
        })),
      }
    };
    
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

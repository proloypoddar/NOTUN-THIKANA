import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import dbConnect from '@/lib/db/connect';
import { Message } from '@/lib/db/models/Message';
import { User } from '@/lib/db/models/User';

// Get messages between current user and specified user
export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { userId } = params;
    
    await dbConnect();
    
    // Get the current user
    const currentUser = await User.findOne({ email: session.user.email });
    
    if (!currentUser) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }
    
    // Check if the other user exists
    const otherUser = await User.findById(userId);
    
    if (!otherUser) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }
    
    // Find all messages between the two users
    const messages = await Message.find({
      $or: [
        { sender: currentUser._id, receiver: otherUser._id },
        { sender: otherUser._id, receiver: currentUser._id }
      ]
    }).sort({ createdAt: 1 });
    
    // Mark unread messages as read
    await Message.updateMany(
      { sender: otherUser._id, receiver: currentUser._id, read: false },
      { read: true }
    );
    
    // Format messages for the client
    const formattedMessages = messages.map(msg => ({
      id: msg._id.toString(),
      content: msg.content,
      sender: msg.sender.toString() === currentUser._id.toString() ? 'currentUser' : userId,
      timestamp: msg.createdAt,
    }));
    
    return NextResponse.json(formattedMessages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Mark messages as read
export async function PATCH(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { userId } = params;
    
    await dbConnect();
    
    // Get the current user
    const currentUser = await User.findOne({ email: session.user.email });
    
    if (!currentUser) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }
    
    // Mark all messages from the other user as read
    const result = await Message.updateMany(
      { sender: userId, receiver: currentUser._id, read: false },
      { read: true }
    );
    
    return NextResponse.json({ 
      message: 'Messages marked as read',
      count: result.modifiedCount
    });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

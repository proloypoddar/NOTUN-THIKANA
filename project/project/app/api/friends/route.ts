import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/db/connect';
import { User } from '@/lib/db/models/User';
import { FriendRequest } from '@/lib/db/models/FriendRequest';
import { Notification } from '@/lib/db/models/Notification';
import { pusherServer } from '@/lib/pusher';
import { CHANNELS, EVENTS } from '@/lib/pusher';

// Get all users that can be added as friends
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    await dbConnect();
    
    // Get the current user's ID
    const currentUserId = session.user.id;
    
    // Get all users except the current user
    const users = await User.find({ _id: { $ne: currentUserId } })
      .select('_id name email image role verified lastActive')
      .sort({ name: 1 });
    
    // Get all friend requests sent by or received by the current user
    const friendRequests = await FriendRequest.find({
      $or: [
        { sender: currentUserId },
        { receiver: currentUserId }
      ]
    });
    
    // Format the response
    const formattedUsers = users.map(user => {
      // Check if there's a friend request between the current user and this user
      const sentRequest = friendRequests.find(
        req => req.sender.toString() === currentUserId && req.receiver.toString() === user._id.toString()
      );
      
      const receivedRequest = friendRequests.find(
        req => req.sender.toString() === user._id.toString() && req.receiver.toString() === currentUserId
      );
      
      // Determine the friendship status
      let friendshipStatus = 'none';
      if (sentRequest) {
        friendshipStatus = sentRequest.status;
      } else if (receivedRequest) {
        friendshipStatus = receivedRequest.status === 'accepted' ? 'accepted' : 'pending_received';
      }
      
      return {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role,
        verified: user.verified,
        lastActive: user.lastActive,
        friendshipStatus
      };
    });
    
    return NextResponse.json(formattedUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Send a friend request
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { receiverId } = await request.json();
    
    if (!receiverId) {
      return NextResponse.json(
        { message: 'Receiver ID is required' },
        { status: 400 }
      );
    }
    
    await dbConnect();
    
    // Get the current user's ID
    const senderId = session.user.id;
    
    // Check if the receiver exists
    const receiver = await User.findById(receiverId);
    
    if (!receiver) {
      return NextResponse.json(
        { message: 'Receiver not found' },
        { status: 404 }
      );
    }
    
    // Check if a friend request already exists
    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId }
      ]
    });
    
    if (existingRequest) {
      return NextResponse.json(
        { message: 'Friend request already exists', status: existingRequest.status },
        { status: 400 }
      );
    }
    
    // Create a new friend request
    const friendRequest = await FriendRequest.create({
      sender: senderId,
      receiver: receiverId,
      status: 'pending'
    });
    
    // Create a notification for the receiver
    const sender = await User.findById(senderId);
    
    const notification = await Notification.create({
      title: 'New Friend Request',
      message: `${sender.name} sent you a friend request`,
      type: 'friend_request',
      recipient: receiverId,
      sender: senderId,
      isRead: false,
      relatedId: friendRequest._id,
      onModel: 'FriendRequest',
      urgency: 'regular',
    });
    
    // Trigger a real-time notification using Pusher
    await pusherServer.trigger(
      `${CHANNELS.NOTIFICATIONS}-${receiverId}`,
      EVENTS.FRIEND_REQUEST,
      {
        id: notification._id.toString(),
        title: notification.title,
        message: notification.message,
        sender: {
          id: sender._id.toString(),
          name: sender.name,
          image: sender.image
        },
        createdAt: notification.createdAt
      }
    );
    
    return NextResponse.json({
      message: 'Friend request sent successfully',
      friendRequest: {
        id: friendRequest._id.toString(),
        status: friendRequest.status,
        createdAt: friendRequest.createdAt
      }
    });
  } catch (error) {
    console.error('Error sending friend request:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

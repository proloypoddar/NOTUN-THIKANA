import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/db/connect';
import { User } from '@/lib/db/models/User';
import { FriendRequest } from '@/lib/db/models/FriendRequest';
import { Notification } from '@/lib/db/models/Notification';
import { pusherServer } from '@/lib/pusher';
import { CHANNELS, EVENTS } from '@/lib/pusher';

// Update a friend request (accept or reject)
export async function PUT(
  request: Request,
  { params }: { params: { requestId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { status } = await request.json();

    if (!status || !['accepted', 'rejected'].includes(status)) {
      return NextResponse.json(
        { message: 'Invalid status' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Get the current user's ID
    const currentUserId = session.user.id;

    // Find the friend request
    const friendRequest = await FriendRequest.findById(params.requestId);

    if (!friendRequest) {
      return NextResponse.json(
        { message: 'Friend request not found' },
        { status: 404 }
      );
    }

    // Check if the current user is the receiver of the request
    if (friendRequest.receiver.toString() !== currentUserId) {
      return NextResponse.json(
        { message: 'You are not authorized to update this friend request' },
        { status: 403 }
      );
    }

    // Update the friend request
    friendRequest.status = status;
    friendRequest.updatedAt = new Date();
    await friendRequest.save();

    // If the request was accepted, create notifications for both users
    if (status === 'accepted') {
      // Get user details
      const sender = await User.findById(friendRequest.sender);
      const receiver = await User.findById(friendRequest.receiver);

      // Add each user to the other's friends list
      // Update sender's friends list
      await User.findByIdAndUpdate(
        friendRequest.sender,
        { $addToSet: { friends: friendRequest.receiver } }
      );

      // Update receiver's friends list
      await User.findByIdAndUpdate(
        friendRequest.receiver,
        { $addToSet: { friends: friendRequest.sender } }
      );

      // Create notification for the sender
      const senderNotification = await Notification.create({
        title: 'Friend Request Accepted',
        message: `${receiver.name} accepted your friend request`,
        type: 'friend_accepted',
        recipient: friendRequest.sender,
        sender: friendRequest.receiver,
        isRead: false,
        relatedId: friendRequest._id,
        onModel: 'FriendRequest',
        urgency: 'regular',
      });

      // Trigger a real-time notification using Pusher
      await pusherServer.trigger(
        `${CHANNELS.NOTIFICATIONS}-${friendRequest.sender}`,
        EVENTS.FRIEND_REQUEST_ACCEPTED,
        {
          id: senderNotification._id.toString(),
          title: senderNotification.title,
          message: senderNotification.message,
          sender: {
            id: receiver._id.toString(),
            name: receiver.name,
            image: receiver.image
          },
          createdAt: senderNotification.createdAt
        }
      );

      // Also trigger a friends list update event
      await pusherServer.trigger(
        `${CHANNELS.FRIENDS}-${friendRequest.sender}`,
        EVENTS.FRIEND_ADDED,
        {
          friend: {
            id: receiver._id.toString(),
            name: receiver.name,
            image: receiver.image
          }
        }
      );

      await pusherServer.trigger(
        `${CHANNELS.FRIENDS}-${friendRequest.receiver}`,
        EVENTS.FRIEND_ADDED,
        {
          friend: {
            id: sender._id.toString(),
            name: sender.name,
            image: sender.image
          }
        }
      );
    }

    return NextResponse.json({
      message: `Friend request ${status}`,
      friendRequest: {
        id: friendRequest._id.toString(),
        status: friendRequest.status,
        updatedAt: friendRequest.updatedAt
      }
    });
  } catch (error) {
    console.error('Error updating friend request:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Delete a friend request
export async function DELETE(
  request: Request,
  { params }: { params: { requestId: string } }
) {
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

    // Find the friend request
    const friendRequest = await FriendRequest.findById(params.requestId);

    if (!friendRequest) {
      return NextResponse.json(
        { message: 'Friend request not found' },
        { status: 404 }
      );
    }

    // Check if the current user is the sender or receiver of the request
    if (
      friendRequest.sender.toString() !== currentUserId &&
      friendRequest.receiver.toString() !== currentUserId
    ) {
      return NextResponse.json(
        { message: 'You are not authorized to delete this friend request' },
        { status: 403 }
      );
    }

    // Delete the friend request
    await FriendRequest.findByIdAndDelete(params.requestId);

    // Delete related notifications
    await Notification.deleteMany({
      relatedId: params.requestId,
      onModel: 'FriendRequest'
    });

    return NextResponse.json({
      message: 'Friend request deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting friend request:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import dbConnect from '@/lib/db/connect';
import { User } from '@/lib/db/models/User';
import { Message } from '@/lib/db/models/Message';
import { FriendRequest } from '@/lib/db/models/FriendRequest';
import { Notification } from '@/lib/db/models/Notification';
import { pusherServer } from '@/lib/pusher';
import { CHANNELS, EVENTS } from '@/lib/pusher';
import mongoose from 'mongoose';

// Get all conversations for the current user or messages for a specific conversation
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
    const conversationId = url.searchParams.get('conversationId');

    await dbConnect();

    // Get the current user's ID
    const currentUserId = session.user.id;

    if (conversationId) {
      // In our case, conversationId is actually the other user's ID
      const otherUserId = conversationId;

      // Get messages between the current user and the other user
      const messages = await Message.find({
        $or: [
          { sender: currentUserId, receiver: otherUserId },
          { sender: otherUserId, receiver: currentUserId }
        ]
      })
        .sort({ createdAt: 1 })
        .populate('sender', 'name image')
        .populate('receiver', 'name image');

      // Format the messages
      const formattedMessages = messages.map(message => ({
        id: message._id.toString(),
        content: message.content,
        timestamp: message.createdAt,
        read: message.read,
        sender: message.sender._id.toString() === currentUserId ? 'currentUser' : message.sender._id.toString(),
        senderDetails: {
          id: message.sender._id.toString(),
          name: message.sender.name,
          image: message.sender.image
        },
        receiverDetails: {
          id: message.receiver._id.toString(),
          name: message.receiver.name,
          image: message.receiver.image
        }
      }));

      // Mark unread messages as read
      await Message.updateMany(
        {
          sender: otherUserId,
          receiver: currentUserId,
          read: false
        },
        { read: true }
      );

      return NextResponse.json({ messages: formattedMessages });
    } else {
      // Get all conversations for the current user
      // First, get all messages where the current user is either sender or receiver
      const messages = await Message.aggregate([
        {
          $match: {
            $or: [
              { sender: new mongoose.Types.ObjectId(currentUserId) },
              { receiver: new mongoose.Types.ObjectId(currentUserId) }
            ]
          }
        },
        {
          $sort: { createdAt: -1 }
        },
        {
          $group: {
            _id: {
              $cond: [
                { $eq: ['$sender', new mongoose.Types.ObjectId(currentUserId)] },
                '$receiver',
                '$sender'
              ]
            },
            lastMessage: { $first: '$$ROOT' }
          }
        }
      ]);

      // Get user details for each conversation
      const conversationUserIds = messages.map(m => m._id);
      const conversationUsers = await User.find({
        _id: { $in: conversationUserIds }
      }).select('_id name email image role verified lastActive');

      // Count unread messages for each conversation
      const unreadCounts = await Message.aggregate([
        {
          $match: {
            receiver: new mongoose.Types.ObjectId(currentUserId),
            read: false
          }
        },
        {
          $group: {
            _id: '$sender',
            count: { $sum: 1 }
          }
        }
      ]);

      // Format the conversations
      const conversations = messages.map(message => {
        const otherUser = conversationUsers.find(
          user => user._id.toString() === message._id.toString()
        );

        if (!otherUser) return null;

        const unreadCount = unreadCounts.find(
          count => count._id.toString() === message._id.toString()
        );

        return {
          id: otherUser._id.toString(),
          user: {
            id: otherUser._id.toString(),
            name: otherUser.name,
            email: otherUser.email,
            image: otherUser.image,
            role: otherUser.role,
            verified: otherUser.verified,
            lastActive: otherUser.lastActive
          },
          lastMessage: {
            content: message.lastMessage.content,
            timestamp: message.lastMessage.createdAt
          },
          unread: unreadCount ? unreadCount.count : 0
        };
      }).filter(Boolean);

      return NextResponse.json(conversations);
    }
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Send a new message
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { receiverId, content } = await request.json();

    if (!receiverId || !content) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Get the current user's ID
    const senderId = session.user.id;

    // Check if receiver exists
    const receiver = await User.findById(receiverId);

    if (!receiver) {
      return NextResponse.json(
        { message: 'Receiver not found' },
        { status: 404 }
      );
    }

    // Check if users are friends or if this is the first message
    const areFriends = await FriendRequest.findOne({
      $or: [
        { sender: senderId, receiver: receiverId, status: 'accepted' },
        { sender: receiverId, receiver: senderId, status: 'accepted' }
      ]
    });

    const existingMessages = await Message.countDocuments({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId }
      ]
    });

    if (!areFriends && existingMessages === 0) {
      // Create a friend request automatically for the first message
      await FriendRequest.create({
        sender: senderId,
        receiver: receiverId,
        status: 'pending'
      });
    }

    // Create the message
    const message = await Message.create({
      sender: senderId,
      receiver: receiverId,
      content,
      read: false,
      createdAt: new Date()
    });

    // Get sender details
    const sender = await User.findById(senderId).select('name image');

    // Create a notification for the receiver
    const notification = await Notification.create({
      title: 'New Message',
      message: `${sender.name} sent you a message`,
      type: 'message',
      recipient: receiverId,
      sender: senderId,
      isRead: false,
      relatedId: message._id,
      onModel: 'Message',
      urgency: 'regular',
    });

    // Trigger real-time events using Pusher
    // 1. Message event
    await pusherServer.trigger(
      `${CHANNELS.MESSAGES}-${receiverId}`,
      EVENTS.NEW_MESSAGE,
      {
        id: message._id.toString(),
        content: message.content,
        timestamp: message.createdAt,
        sender: {
          id: sender._id.toString(),
          name: sender.name,
          image: sender.image
        }
      }
    );

    // 2. Notification event
    await pusherServer.trigger(
      `${CHANNELS.NOTIFICATIONS}-${receiverId}`,
      EVENTS.NEW_NOTIFICATION,
      {
        id: notification._id.toString(),
        title: notification.title,
        message: notification.message,
        type: notification.type,
        createdAt: notification.createdAt
      }
    );

    return NextResponse.json(
      {
        message: 'Message sent successfully',
        data: {
          id: message._id.toString(),
          content: message.content,
          timestamp: message.createdAt,
          read: message.read
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

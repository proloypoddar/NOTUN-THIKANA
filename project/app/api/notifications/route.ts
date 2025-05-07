import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { Notification } from '@/lib/db/models/Notification';
import dbConnect from '@/lib/db/connect';
import { pusherServer } from '@/lib/pusher';
import { CHANNELS, EVENTS } from '@/lib/pusher';

// GET /api/notifications - Get all notifications for a user
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    let userId = searchParams.get('userId');

    // If no userId is provided, try to get the current user from the session
    if (!userId) {
      const session = await getServerSession(authOptions);
      if (!session?.user?.id) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
      }
      userId = session.user.id;
    }

    await dbConnect();

    // Get notifications from the database
    const notifications = await Notification.find({
      $or: [
        { recipient: userId },
        { userId: userId } // For backward compatibility
      ]
    })
      .sort({ createdAt: -1 })
      .populate('sender', 'name image')
      .limit(50);

    // Format the response
    const formattedNotifications = notifications.map(notification => ({
      id: notification._id.toString(),
      _id: notification._id.toString(), // For backward compatibility
      title: notification.title,
      message: notification.message,
      type: notification.type,
      isRead: notification.isRead,
      createdAt: notification.createdAt,
      sender: notification.sender ? {
        id: notification.sender._id.toString(),
        name: notification.sender.name,
        image: notification.sender.image
      } : null,
      relatedId: notification.relatedId?.toString(),
      onModel: notification.onModel,
      urgency: notification.urgency,
      image: notification.image,
      actions: notification.actions,
      userId: notification.userId || notification.recipient // For backward compatibility
    }));

    return NextResponse.json(formattedNotifications);
  } catch (error: any) {
    console.error('Notification API error:', error);
    return NextResponse.json({ error: 'Failed to fetch notifications', details: error.message }, { status: 500 });
  }
}

// POST /api/notifications - Create a new notification
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, notification, recipient } = body;

    // Check if we have either userId or recipient
    if ((!userId && !recipient) || !notification) {
      return NextResponse.json({ message: 'Recipient and notification are required.' }, { status: 400 });
    }

    // Validate notification schema
    const { title, message, type } = notification;

    if (!title || !message || !type) {
      return NextResponse.json({ message: 'Each notification must have a title, message, and type.' }, { status: 400 });
    }

    await dbConnect();

    // Create a new notification in the database
    const newNotification = await Notification.create({
      ...notification,
      recipient: recipient || userId, // Use recipient if provided, otherwise use userId
      userId: userId, // For backward compatibility
      createdAt: new Date(),
      isRead: false
    });

    // Trigger a real-time notification using Pusher
    const recipientId = recipient || userId;
    await pusherServer.trigger(
      `${CHANNELS.NOTIFICATIONS}-${recipientId}`,
      EVENTS.NEW_NOTIFICATION,
      {
        id: newNotification._id.toString(),
        title: newNotification.title,
        message: newNotification.message,
        type: newNotification.type,
        createdAt: newNotification.createdAt
      }
    );

    return NextResponse.json({
      id: newNotification._id.toString(),
      _id: newNotification._id.toString(), // For backward compatibility
      ...newNotification.toObject(),
      createdAt: newNotification.createdAt
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json({ error: 'Failed to create notification' }, { status: 500 });
  }
}

// PUT /api/notifications - Mark notifications as read
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, markAllAsRead, userId, notificationIds } = body;

    // Get the current user's ID from the session if not provided
    let currentUserId = userId;
    if (!currentUserId) {
      const session = await getServerSession(authOptions);
      if (!session?.user?.id) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
      }
      currentUserId = session.user.id;
    }

    await dbConnect();

    if (markAllAsRead) {
      // Mark all notifications as read for a user
      await Notification.updateMany(
        {
          $or: [
            { recipient: currentUserId },
            { userId: currentUserId } // For backward compatibility
          ],
          isRead: false
        },
        { isRead: true }
      );
      return NextResponse.json({ message: 'All notifications marked as read' });
    } else if (notificationIds && notificationIds.length > 0) {
      // Mark multiple notifications as read
      await Notification.updateMany(
        {
          _id: { $in: notificationIds },
          $or: [
            { recipient: currentUserId },
            { userId: currentUserId } // For backward compatibility
          ]
        },
        { isRead: true }
      );

      return NextResponse.json({
        message: 'Notifications marked as read',
        count: notificationIds.length
      });
    } else if (id) {
      // Mark a single notification as read
      const notification = await Notification.findOneAndUpdate(
        {
          _id: id,
          $or: [
            { recipient: currentUserId },
            { userId: currentUserId } // For backward compatibility
          ]
        },
        { isRead: true },
        { new: true }
      );

      if (!notification) {
        return NextResponse.json({ message: 'Notification not found' }, { status: 404 });
      }

      return NextResponse.json({
        id: notification._id.toString(),
        _id: notification._id.toString(), // For backward compatibility
        ...notification.toObject(),
        isRead: true
      });
    } else {
      return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error updating notification:', error);
    return NextResponse.json({ error: 'Failed to update notification' }, { status: 500 });
  }
}

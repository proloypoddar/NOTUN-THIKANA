import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { Notification } from '@/lib/db/models/Notification';
import dbConnect from '@/lib/db/connect';
import { mockNotifications } from '@/lib/mock/notifications';

// GET /api/notifications - Get all notifications for a user
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    // If no userId is provided, try to get the current user from the session
    if (!userId) {
      const session = await getServerSession(authOptions);
      if (!session?.user?.id) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
      }
    }

    // Use mock data instead of connecting to the database
    // Sort by createdAt (newest first)
    const sortedNotifications = [...mockNotifications].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json(sortedNotifications);
  } catch (error: any) {
    console.error('Notification API error:', error);
    return NextResponse.json({ error: 'Failed to fetch notifications', details: error.message }, { status: 500 });
  }
}

// POST /api/notifications - Create a new notification
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, notification } = body;

    if (!userId || !notification) {
      return NextResponse.json({ message: 'User ID and notification are required.' }, { status: 400 });
    }

    // Validate notification schema
    const { title, message, type } = notification;

    if (!title || !message || !type) {
      return NextResponse.json({ message: 'Each notification must have a title, message, and type.' }, { status: 400 });
    }

    if (!['bid', 'rental', 'announcement', 'listing', 'message', 'forum', 'blog'].includes(type)) {
      return NextResponse.json({ message: `Invalid notification type: ${type}.` }, { status: 400 });
    }

    // Create a new notification in our mock data
    const newNotification = {
      _id: (mockNotifications.length + 1).toString(),
      ...notification,
      userId,
      createdAt: new Date(),
      isRead: false
    };

    // Add to our mock data
    mockNotifications.unshift(newNotification);

    return NextResponse.json(newNotification);
  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json({ error: 'Failed to create notification' }, { status: 500 });
  }
}

// PUT /api/notifications - Mark notifications as read
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, markAllAsRead, userId } = body;

    if (markAllAsRead && userId) {
      // Mark all notifications as read for a user
      mockNotifications.forEach(notification => {
        if (notification.userId.toString() === userId.toString()) {
          notification.isRead = true;
        }
      });
      return NextResponse.json({ message: 'All notifications marked as read' });
    } else if (id) {
      // Mark a single notification as read
      const notification = mockNotifications.find(n => n._id === id);

      if (!notification) {
        return NextResponse.json({ message: 'Notification not found' }, { status: 404 });
      }

      notification.isRead = true;
      return NextResponse.json(notification);
    } else {
      return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error updating notification:', error);
    return NextResponse.json({ error: 'Failed to update notification' }, { status: 500 });
  }
}

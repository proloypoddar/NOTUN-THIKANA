import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { pusherClient, CHANNELS, EVENTS } from '@/lib/pusher';

interface Message {
  id: string;
  content: string;
  timestamp: string;
  sender: {
    id: string;
    name: string;
    image: string;
  };
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  createdAt: string;
}

interface FriendRequest {
  id: string;
  status: string;
  sender: {
    id: string;
    name: string;
    image: string;
  };
}

interface UsePusherOptions {
  onNewMessage?: (message: Message) => void;
  onMessageRead?: (messageId: string) => void;
  onNewNotification?: (notification: Notification) => void;
  onFriendRequest?: (request: FriendRequest) => void;
  onFriendRequestAccepted?: (request: FriendRequest) => void;
}

export const usePusher = (options: UsePusherOptions = {}) => {
  const { data: session } = useSession();
  const [isConnected, setIsConnected] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);

  useEffect(() => {
    if (!session?.user?.id) return;

    const userId = session.user.id;

    // Subscribe to channels
    const messageChannel = pusherClient.subscribe(`${CHANNELS.MESSAGES}-${userId}`);
    const notificationChannel = pusherClient.subscribe(`${CHANNELS.NOTIFICATIONS}-${userId}`);
    const friendRequestChannel = pusherClient.subscribe(`${CHANNELS.FRIEND_REQUESTS}-${userId}`);

    setIsConnected(true);

    // Listen for new messages
    messageChannel.bind(EVENTS.NEW_MESSAGE, (message: Message) => {
      setUnreadMessages(prev => prev + 1);
      if (options.onNewMessage) {
        options.onNewMessage(message);
      }
    });

    // Listen for message read status
    messageChannel.bind(EVENTS.MESSAGE_READ, (data: { messageId: string }) => {
      if (options.onMessageRead) {
        options.onMessageRead(data.messageId);
      }
    });

    // Listen for new notifications
    notificationChannel.bind(EVENTS.NEW_NOTIFICATION, (notification: Notification) => {
      setUnreadNotifications(prev => prev + 1);
      if (options.onNewNotification) {
        options.onNewNotification(notification);
      }
    });

    // Listen for friend requests
    friendRequestChannel.bind(EVENTS.FRIEND_REQUEST, (request: FriendRequest) => {
      if (options.onFriendRequest) {
        options.onFriendRequest(request);
      }
    });

    // Listen for friend request accepted
    friendRequestChannel.bind(EVENTS.FRIEND_REQUEST_ACCEPTED, (request: FriendRequest) => {
      if (options.onFriendRequestAccepted) {
        options.onFriendRequestAccepted(request);
      }
    });

    // Clean up on unmount
    return () => {
      messageChannel.unbind_all();
      notificationChannel.unbind_all();
      friendRequestChannel.unbind_all();
      
      pusherClient.unsubscribe(`${CHANNELS.MESSAGES}-${userId}`);
      pusherClient.unsubscribe(`${CHANNELS.NOTIFICATIONS}-${userId}`);
      pusherClient.unsubscribe(`${CHANNELS.FRIEND_REQUESTS}-${userId}`);
      
      setIsConnected(false);
    };
  }, [session, options]);

  const resetUnreadCounts = () => {
    setUnreadNotifications(0);
    setUnreadMessages(0);
  };

  return {
    isConnected,
    unreadNotifications,
    unreadMessages,
    resetUnreadCounts,
  };
};

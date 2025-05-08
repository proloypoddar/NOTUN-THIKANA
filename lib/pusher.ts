import Pusher from 'pusher';
import PusherClient from 'pusher-js';

// For server-side
export const pusherServer = new Pusher({
  appId: process.env.PUSHER_APP_ID || 'app-id',
  key: process.env.PUSHER_KEY || 'key',
  secret: process.env.PUSHER_SECRET || 'secret',
  cluster: process.env.PUSHER_CLUSTER || 'eu',
  useTLS: true,
});

// For client-side
export const pusherClient = new PusherClient(
  process.env.NEXT_PUBLIC_PUSHER_KEY || 'key',
  {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'eu',
  }
);

// Channel and event names
export const CHANNELS = {
  MESSAGES: 'messages',
  NOTIFICATIONS: 'notifications',
  FRIEND_REQUESTS: 'friend-requests',
  FRIENDS: 'friends',
};

export const EVENTS = {
  NEW_MESSAGE: 'new-message',
  MESSAGE_READ: 'message-read',
  NEW_NOTIFICATION: 'new-notification',
  FRIEND_REQUEST: 'friend-request',
  FRIEND_REQUEST_ACCEPTED: 'friend-request-accepted',
  FRIEND_ADDED: 'friend-added',
};

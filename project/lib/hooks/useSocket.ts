import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSession } from 'next-auth/react';

export interface Message {
  id: string;
  sender: {
    id: string;
    name: string;
    image: string;
  };
  content: string;
  timestamp: string;
  read: boolean;
}

export interface UseSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  sendMessage: (receiverId: string, content: string) => void;
  markAsRead: (messageId: string) => void;
  onlineUsers: string[];
}

export const useSocket = (): UseSocketReturn => {
  const { data: session } = useSession();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  
  useEffect(() => {
    // Only initialize socket if user is authenticated
    if (!session?.user?.id) return;
    
    // Initialize socket connection
    const socketInstance = io(process.env.NEXT_PUBLIC_SOCKET_URL || window.location.origin, {
      path: '/api/socket',
    });
    
    // Set socket instance
    setSocket(socketInstance);
    
    // Socket event handlers
    socketInstance.on('connect', () => {
      console.log('Socket connected');
      setIsConnected(true);
      
      // Authenticate with user ID
      socketInstance.emit('authenticate', session.user.id);
    });
    
    socketInstance.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });
    
    socketInstance.on('active_users', (users: string[]) => {
      setOnlineUsers(users);
    });
    
    socketInstance.on('user_status_change', ({ userId, status }) => {
      if (status === 'online' && !onlineUsers.includes(userId)) {
        setOnlineUsers(prev => [...prev, userId]);
      } else if (status === 'offline') {
        setOnlineUsers(prev => prev.filter(id => id !== userId));
      }
    });
    
    // Clean up on unmount
    return () => {
      socketInstance.disconnect();
    };
  }, [session]);
  
  // Send a private message
  const sendMessage = (receiverId: string, content: string) => {
    if (!socket || !isConnected || !session?.user?.id) return;
    
    socket.emit('private_message', {
      senderId: session.user.id,
      receiverId,
      content,
    });
  };
  
  // Mark a message as read
  const markAsRead = (messageId: string) => {
    if (!socket || !isConnected || !session?.user?.id) return;
    
    socket.emit('mark_as_read', {
      messageId,
      userId: session.user.id,
    });
  };
  
  return {
    socket,
    isConnected,
    sendMessage,
    markAsRead,
    onlineUsers,
  };
};

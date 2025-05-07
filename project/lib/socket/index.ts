import { Server as NetServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { NextApiRequest } from 'next';
import { NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { Message } from '@/lib/db/models/Message';
import { User } from '@/lib/db/models/User';
import dbConnect from '@/lib/db/connect';

export type NextApiResponseWithSocket = NextApiResponse & {
  socket: {
    server: NetServer & {
      io?: SocketIOServer;
    };
  };
};

// Map to store active users and their socket IDs
const activeUsers = new Map<string, string>();

export const initSocketServer = (req: NextApiRequest, res: NextApiResponseWithSocket) => {
  if (!res.socket.server.io) {
    console.log('Initializing Socket.io server...');
    
    const io = new SocketIOServer(res.socket.server);
    res.socket.server.io = io;

    io.on('connection', async (socket) => {
      console.log('Client connected:', socket.id);
      
      // Authenticate user on connection
      socket.on('authenticate', async (userId: string) => {
        try {
          await dbConnect();
          const user = await User.findById(userId);
          
          if (user) {
            // Store user's socket ID
            activeUsers.set(userId, socket.id);
            console.log(`User ${userId} authenticated with socket ${socket.id}`);
            
            // Update user's online status
            await User.findByIdAndUpdate(userId, { lastActive: new Date() });
            
            // Notify other users that this user is online
            socket.broadcast.emit('user_status_change', { userId, status: 'online' });
            
            // Send the active users list to the newly connected user
            const activeUserIds = Array.from(activeUsers.keys());
            socket.emit('active_users', activeUserIds);
          }
        } catch (error) {
          console.error('Authentication error:', error);
        }
      });

      // Handle private messages
      socket.on('private_message', async (data: { 
        senderId: string; 
        receiverId: string; 
        content: string;
      }) => {
        try {
          await dbConnect();
          
          // Create and save the message to the database
          const newMessage = await Message.create({
            sender: data.senderId,
            receiver: data.receiverId,
            content: data.content,
            createdAt: new Date(),
            read: false
          });
          
          // Get sender information
          const sender = await User.findById(data.senderId);
          
          // Format the message for the client
          const messageToSend = {
            id: newMessage._id.toString(),
            sender: {
              id: sender._id.toString(),
              name: sender.name,
              image: sender.image
            },
            content: newMessage.content,
            timestamp: newMessage.createdAt,
            read: newMessage.read
          };
          
          // Send to the sender
          socket.emit('new_message', messageToSend);
          
          // Send to the receiver if they are online
          const receiverSocketId = activeUsers.get(data.receiverId);
          if (receiverSocketId) {
            io.to(receiverSocketId).emit('new_message', messageToSend);
          }
        } catch (error) {
          console.error('Error sending private message:', error);
        }
      });

      // Handle message read status
      socket.on('mark_as_read', async (data: { messageId: string; userId: string }) => {
        try {
          await dbConnect();
          
          // Update the message read status
          await Message.findByIdAndUpdate(data.messageId, { read: true });
          
          // Notify the sender that the message has been read
          const message = await Message.findById(data.messageId);
          if (message) {
            const senderSocketId = activeUsers.get(message.sender.toString());
            if (senderSocketId) {
              io.to(senderSocketId).emit('message_read', { messageId: data.messageId });
            }
          }
        } catch (error) {
          console.error('Error marking message as read:', error);
        }
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
        
        // Find and remove the user from active users
        for (const [userId, socketId] of activeUsers.entries()) {
          if (socketId === socket.id) {
            activeUsers.delete(userId);
            
            // Notify other users that this user is offline
            socket.broadcast.emit('user_status_change', { userId, status: 'offline' });
            break;
          }
        }
      });
    });
  }
  
  return res.socket.server.io;
};

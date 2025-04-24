import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import {
  findConversationsByParticipant,
  findMessagesByConversation,
  createMessage as createNewMessage,
  markMessagesAsRead,
  MessageType,
  findUserById,
  getUserSafeData
} from '@/database';

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

    if (conversationId) {
      // If conversationId is provided, get messages for that conversation
      const messages = findMessagesByConversation(conversationId);

      // Mark messages as read
      markMessagesAsRead(conversationId, session.user.id);

      return NextResponse.json({ messages });
    } else {
      // Otherwise, get all conversations for the user
      const conversations = findConversationsByParticipant(session.user.id);

      // Format conversations for the frontend
      const formattedConversations = conversations.map(conversation => {
        // Find the other participant in the conversation
        const otherParticipantId = conversation.participants.find(id => id !== session.user.id);
        const otherUser = otherParticipantId ? getUserSafeData(otherParticipantId) : null;

        return {
          id: conversation.id,
          user: otherUser ? {
            id: otherUser.id,
            name: otherUser.name,
            image: otherUser.image || '',
          } : {
            id: 'unknown',
            name: conversation.isGroup ? conversation.groupName || 'Group Chat' : 'Unknown User',
            image: conversation.isGroup ? conversation.groupImage : '',
          },
          lastMessage: conversation.lastMessageText ? {
            content: conversation.lastMessageText,
            timestamp: conversation.lastMessageTime,
          } : null,
          unread: conversation.unreadCount?.[session.user.id] || 0,
          isGroup: conversation.isGroup,
        };
      });

      return NextResponse.json(formattedConversations);
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

    const { receiverId, content, type = 'text' } = await request.json();

    if (!receiverId || !content) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if receiver exists
    const receiver = findUserById(receiverId);

    if (!receiver) {
      return NextResponse.json(
        { message: 'Receiver not found' },
        { status: 404 }
      );
    }

    // Create the message
    const message = createNewMessage(
      session.user.id,
      receiverId,
      content,
      type as MessageType
    );

    return NextResponse.json(
      { message: 'Message sent successfully', data: message },
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

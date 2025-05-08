import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';
import Conversation from '@/models/Conversation';
import User from '@/models/User';

// GET /api/conversations - Get all conversations for the current user
export async function GET(request: NextRequest) {
  try {
    // Get the current user from the session
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Connect to the database
    await dbConnect();

    // Find the user in the database
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get all conversations where the user is a participant
    const conversations = await Conversation.find({
      participants: user._id
    })
      .sort({ 'lastMessage.timestamp': -1 })
      .populate('participants', 'name email image')
      .populate('lastMessage.sender', 'name image');

    // Format the conversations for the response
    const formattedConversations = conversations.map(conversation => {
      // Find the other participant (not the current user)
      const otherParticipant = conversation.participants.find(
        participant => participant._id.toString() !== user._id.toString()
      );

      // Get the unread count for the current user
      const unreadCount = conversation.unreadCount?.[user._id.toString()] || 0;

      return {
        id: conversation._id,
        user: otherParticipant,
        lastMessage: {
          content: conversation.lastMessage.content,
          timestamp: conversation.lastMessage.timestamp,
          sender: conversation.lastMessage.sender
        },
        unread: unreadCount
      };
    });

    return NextResponse.json(formattedConversations);
  } catch (error) {
    console.error('Error getting conversations:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/conversations - Create a new conversation
export async function POST(request: NextRequest) {
  try {
    // Get the current user from the session
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Connect to the database
    await dbConnect();

    // Get the request body
    const { participantId } = await request.json();

    // Validate input
    if (!participantId) {
      return NextResponse.json(
        { message: 'Participant ID is required' },
        { status: 400 }
      );
    }

    // Find the user in the database
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Find the participant
    const participant = await User.findById(participantId);
    if (!participant) {
      return NextResponse.json(
        { message: 'Participant not found' },
        { status: 404 }
      );
    }

    // Generate the conversation ID
    const conversationId = [user._id.toString(), participantId].sort().join('_');

    // Check if the conversation already exists
    let conversation = await Conversation.findOne({ _id: conversationId });
    
    if (conversation) {
      // Conversation already exists, return it
      await conversation.populate('participants', 'name email image');
      
      return NextResponse.json(
        { message: 'Conversation already exists', data: conversation },
        { status: 200 }
      );
    }

    // Create a new conversation
    conversation = await Conversation.create({
      _id: conversationId,
      participants: [user._id, participant._id],
      lastMessage: {
        content: '',
        sender: user._id,
        timestamp: new Date(),
      },
      unreadCount: {},
    });

    // Populate the participants
    await conversation.populate('participants', 'name email image');

    return NextResponse.json(
      { message: 'Conversation created successfully', data: conversation },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating conversation:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

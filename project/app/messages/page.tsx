'use client';

<<<<<<< HEAD
import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { Send, Search, MoreVertical, Phone, Video, Info, UserPlus } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useSocket, Message as SocketMessage } from '@/lib/hooks/useSocket';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

// Types for our messages
interface User {
  id: string;
  name: string;
  image?: string;
}

interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: string;
}

interface Conversation {
  id: string;
  user: User;
  lastMessage: {
    content: string;
    timestamp: string;
  };
  unread: number;
}
=======
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Send, Plus } from 'lucide-react';
import ConversationList from '@/components/messaging/conversation-list';
import MessageList from '@/components/messaging/message-list';
import NewConversationDialog from '@/components/messaging/new-conversation-dialog';
>>>>>>> 74cd30c896a8e1e9599f3de47b7f74e6835a58ba

// Mock data for conversations
const mockConversations = [
  {
    id: '1',
    user: {
      id: 'user1',
      name: 'Sarah Johnson',
      image: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    lastMessage: {
      content: 'Hi there! I saw your post about the community event.',
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
    },
    unread: 2,
  },
  {
    id: '2',
    user: {
      id: 'user2',
      name: 'Michael Chen',
      image: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    lastMessage: {
      content: 'Thanks for the information about the neighborhood!',
      timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
    },
    unread: 0,
  },
  {
    id: '3',
    user: {
      id: 'user3',
      name: 'Aisha Patel',
      image: 'https://randomuser.me/api/portraits/women/68.jpg',
    },
    lastMessage: {
      content: 'Are you still looking for roommates?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
    },
    unread: 1,
  },
  {
    id: '4',
    user: {
      id: 'user4',
      name: 'David Wilson',
      image: 'https://randomuser.me/api/portraits/men/75.jpg',
    },
    lastMessage: {
      content: 'I can help you with the moving process.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    },
    unread: 0,
  },
  {
    id: '5',
    user: {
      id: 'user5',
      name: 'Elena Rodriguez',
      image: 'https://randomuser.me/api/portraits/women/90.jpg',
    },
    lastMessage: {
      content: 'The community garden event is this weekend!',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    },
    unread: 0,
  },
];

// Mock data for messages in a conversation
const mockMessages = {
  '1': [
    {
      id: 'm1',
      sender: 'user1',
      content: 'Hi there! I saw your post about the community event.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    },
    {
      id: 'm2',
      sender: 'currentUser',
      content: 'Yes, are you interested in attending?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23).toISOString(),
    },
    {
      id: 'm3',
      sender: 'user1',
      content: 'Definitely! What time does it start?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(),
    },
    {
      id: 'm4',
      sender: 'currentUser',
      content: 'It starts at 6 PM at the community center. There will be food and activities for everyone.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 21).toISOString(),
    },
    {
      id: 'm5',
      sender: 'user1',
<<<<<<< HEAD
      content: 'That sounds great! Can I bring my roommate along?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
    },
    {
      id: 'm6',
      sender: 'currentUser',
      content: 'Absolutely! The more the merrier. It\'s a community event after all.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 19).toISOString(),
    },
    {
      id: 'm7',
      sender: 'user1',
      content: 'Perfect! We\'ll see you there. Thanks for organizing this!',
=======
      content: 'Great! Should I bring anything?',
>>>>>>> 74cd30c896a8e1e9599f3de47b7f74e6835a58ba
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    },
  ],
  '2': [
    {
      id: 'm1',
      sender: 'user2',
<<<<<<< HEAD
      content: 'Hi, I\'m interested in learning more about the neighborhood you mentioned in your post.',
=======
      content: 'Hello, I just moved to the area and saw your post about the neighborhood.',
>>>>>>> 74cd30c896a8e1e9599f3de47b7f74e6835a58ba
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    },
    {
      id: 'm2',
      sender: 'currentUser',
<<<<<<< HEAD
      content: 'Of course! It\'s a great area with lots of parks and good public transportation.',
=======
      content: 'Welcome to the neighborhood! How can I help?',
>>>>>>> 74cd30c896a8e1e9599f3de47b7f74e6835a58ba
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 47).toISOString(),
    },
    {
      id: 'm3',
      sender: 'user2',
<<<<<<< HEAD
      content: 'That sounds perfect for me. Are there any good cafes or restaurants nearby?',
=======
      content: 'I was wondering if you could recommend any good local restaurants or cafes?',
>>>>>>> 74cd30c896a8e1e9599f3de47b7f74e6835a58ba
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 46).toISOString(),
    },
    {
      id: 'm4',
      sender: 'currentUser',
<<<<<<< HEAD
      content: 'Yes, there are several! My favorites are Cafe Bloom for coffee and The Local Spot for dinner. Both are within walking distance.',
=======
      content: 'Absolutely! There\'s a great cafe called Morning Brew on Oak Street, and if you like Thai food, Thai Delight on Main Street is excellent.',
>>>>>>> 74cd30c896a8e1e9599f3de47b7f74e6835a58ba
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 45).toISOString(),
    },
    {
      id: 'm5',
      sender: 'user2',
      content: 'Thanks for the information about the neighborhood!',
      timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    },
  ],
  '3': [
    {
      id: 'm1',
      sender: 'user3',
      content: 'Hi, I noticed your post about looking for roommates.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    },
    {
      id: 'm2',
      sender: 'currentUser',
      content: 'Yes, I\'m looking for someone to share my 2-bedroom apartment.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 71).toISOString(),
    },
    {
      id: 'm3',
      sender: 'user3',
      content: 'What\'s the rent and location?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 70).toISOString(),
    },
    {
      id: 'm4',
      sender: 'currentUser',
      content: 'It\'s $800 per month, utilities included. Located near the university, about 10 minutes walk to campus.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 69).toISOString(),
    },
    {
      id: 'm5',
      sender: 'user3',
<<<<<<< HEAD
      content: 'That sounds perfect! Are you still looking for roommates?',
=======
      content: 'Are you still looking for roommates?',
>>>>>>> 74cd30c896a8e1e9599f3de47b7f74e6835a58ba
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    },
  ],
};

<<<<<<< HEAD
function MessagesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize socket connection
  const { socket, isConnected, sendMessage, markAsRead, onlineUsers } = useSocket();

  // Create a default user for unauthenticated sessions
  useEffect(() => {
    // No redirect needed - allow unauthenticated users
    console.log('User status:', status);
  }, [status]);

  // Load conversations from the database
  useEffect(() => {
    const loadConversations = async () => {
      setLoading(true);
      try {
        if (session?.user?.id) {
          // Fetch real conversations from the API
          const response = await fetch(`/api/messages`);

          if (response.ok) {
            const data = await response.json();
            setConversations(data.conversations || []);
          } else {
            // Fallback to mock data if API fails
            console.warn('Failed to fetch conversations, using mock data');
            setConversations(mockConversations);
          }
        } else {
          // Use mock data for unauthenticated users
          setConversations(mockConversations);
        }
      } catch (error) {
        console.error('Error loading conversations:', error);
        toast({
          title: 'Error',
          description: 'Failed to load conversations. Please try again.',
          variant: 'destructive',
        });
        setConversations(mockConversations);
      } finally {
        setLoading(false);
      }
    };

    loadConversations();
  }, [session, toast]);

  // Load messages for active conversation from the database
  useEffect(() => {
    if (!activeConversation || !session?.user?.id) return;

    const loadMessages = async () => {
      try {
        // Fetch real messages from the API
        const response = await fetch(`/api/messages?conversationId=${activeConversation}`);

        if (response.ok) {
          const data = await response.json();
          setMessages(data.messages || []);
        } else {
          // Fallback to mock data if API fails
          console.warn('Failed to fetch messages, using mock data');
          // @ts-ignore - This is mock data
          const conversationMessages = mockMessages[activeConversation] || [];
          setMessages(conversationMessages);
        }

        // Mark conversation as read
        setConversations(prev =>
          prev.map(conv =>
            conv.id === activeConversation
              ? { ...conv, unread: 0 }
              : conv
          )
        );

        // Mark messages as read via socket
        if (isConnected) {
          const conversationDetails = conversations.find(conv => conv.id === activeConversation);
          if (conversationDetails) {
            // Mark all unread messages as read
            messages
              .filter(msg => msg.sender !== 'currentUser' && !msg.read)
              .forEach(msg => markAsRead(msg.id));
          }
        }
      } catch (error) {
        console.error('Error loading messages:', error);
        toast({
          title: 'Error',
          description: 'Failed to load messages. Please try again.',
          variant: 'destructive',
        });

        // Fallback to mock data
        // @ts-ignore - This is mock data
        const conversationMessages = mockMessages[activeConversation] || [];
        setMessages(conversationMessages);
      }
    };

    loadMessages();
  }, [activeConversation, session, toast, isConnected, conversations, messages, markAsRead]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Listen for new messages from socket
  useEffect(() => {
    if (!socket || !session?.user?.id) return;

    // Handle new messages
    const handleNewMessage = (message: SocketMessage) => {
      // Check if this message belongs to the active conversation
      const currentConversationDetails = activeConversation ?
        conversations.find(conv => conv.id === activeConversation) : null;

      const isActiveConversation =
        activeConversation &&
        currentConversationDetails &&
        (message.sender.id === currentConversationDetails.user.id ||
         message.sender.id === session.user.id);

      if (isActiveConversation) {
        // Add message to current conversation
        setMessages(prev => [
          ...prev,
          {
            id: message.id,
            sender: message.sender.id === session.user.id ? 'currentUser' : message.sender.id,
            content: message.content,
            timestamp: message.timestamp,
          }
        ]);

        // Mark as read if it's not from current user
        if (message.sender.id !== session.user.id) {
          markAsRead(message.id);
        }
      }

      // Update conversations list with new message
      setConversations(prev => {
        const conversationIndex = prev.findIndex(
          c => c.user.id === message.sender.id ||
               (message.sender.id === session.user.id && c.id === activeConversation)
        );

        if (conversationIndex >= 0) {
          // Update existing conversation
          const updatedConversations = [...prev];
          updatedConversations[conversationIndex] = {
            ...updatedConversations[conversationIndex],
            lastMessage: {
              content: message.content,
              timestamp: message.timestamp,
            },
            unread: isActiveConversation ? 0 : updatedConversations[conversationIndex].unread + 1,
          };
          return updatedConversations;
        } else if (message.sender.id !== session.user.id) {
          // Create new conversation for new sender
          return [
            {
              id: `new-${Date.now()}`,
              user: {
                id: message.sender.id,
                name: message.sender.name,
                image: message.sender.image,
              },
              lastMessage: {
                content: message.content,
                timestamp: message.timestamp,
              },
              unread: 1,
            },
            ...prev,
          ];
        }

        return prev;
      });
    };

    // Register socket event listeners
    socket.on('new_message', handleNewMessage);

    // Clean up
    return () => {
      socket.off('new_message', handleNewMessage);
    };
  }, [socket, session, activeConversation, conversations, markAsRead]);

  // Filter conversations based on search query
  const filteredConversations = conversations.filter(conv =>
    conv.user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get active conversation details
  const activeConversationDetails = activeConversation ? conversations.find(conv => conv.id === activeConversation) : null;

  // Handle sending a new message using Socket.io
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConversation || !activeConversationDetails || !session?.user?.id) return;

    // Create a temporary message for immediate display
    const tempId = `new-${Date.now()}`;
    const newMsg = {
      id: tempId,
=======
export default function MessagesPage() {
  const { data: session, status } = useSession();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [conversations, setConversations] = useState(mockConversations);
  const [messages, setMessages] = useState<any>(mockMessages);
  const [isNewConversationOpen, setIsNewConversationOpen] = useState(false);

  // Filter conversations based on search query
  const filteredConversations = conversations.filter(conversation =>
    conversation.user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle sending a new message
  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const newMessageObj = {
      id: `m${Date.now()}`,
>>>>>>> 74cd30c896a8e1e9599f3de47b7f74e6835a58ba
      sender: 'currentUser',
      content: newMessage,
      timestamp: new Date().toISOString(),
    };

<<<<<<< HEAD
    // Add message to the conversation
    setMessages(prev => [...prev, newMsg]);

    // Update last message in conversations list
    setConversations(prev =>
      prev.map(conv =>
        conv.id === activeConversation
=======
    // Update messages state
    setMessages(prev => ({
      ...prev,
      [selectedConversation]: [...(prev[selectedConversation] || []), newMessageObj],
    }));

    // Update last message in conversations
    setConversations(prev =>
      prev.map(conv =>
        conv.id === selectedConversation
>>>>>>> 74cd30c896a8e1e9599f3de47b7f74e6835a58ba
          ? {
              ...conv,
              lastMessage: {
                content: newMessage,
                timestamp: new Date().toISOString(),
<<<<<<< HEAD
              }
=======
              },
              unread: 0,
>>>>>>> 74cd30c896a8e1e9599f3de47b7f74e6835a58ba
            }
          : conv
      )
    );

    // Clear input
    setNewMessage('');
<<<<<<< HEAD

    // Send message via Socket.io
    if (isConnected) {
      sendMessage(activeConversationDetails.user.id, newMessage);

      // Show success notification
      toast({
        title: 'Message Sent',
        description: 'Your message has been sent successfully.',
      });
    } else {
      // Show error notification if socket is not connected
      toast({
        title: 'Connection Error',
        description: 'Unable to send message. Please check your connection.',
        variant: 'destructive',
      });
    }
  };

  // Format timestamp
  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return format(date, 'h:mm a'); // Today: 3:45 PM
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return format(date, 'EEEE'); // Day of week: Monday
    } else {
      return format(date, 'MMM d'); // Jan 5
    }
  };

  // Show loading state while fetching data
  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex h-[calc(100vh-200px)] rounded-lg border">
          <div className="w-1/3 border-r">
            <div className="p-4">
              <Skeleton className="h-10 w-full" />
            </div>
            <Separator />
            <div className="space-y-4 p-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-40" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex w-2/3 flex-col">
            <div className="flex-1">
              <div className="flex h-full items-center justify-center">
                <p className="text-muted-foreground">Select a conversation to start chatting</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-6 text-3xl font-bold">Messages</h1>

      <div className="flex h-[calc(100vh-200px)] overflow-hidden rounded-lg border">
        {/* Conversations List */}
        <div className="w-1/3 border-r">
          <div className="p-4">
            <div className="flex items-center gap-2">
=======
  };

  // Handle selecting a conversation
  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversation(conversationId);
    
    // Mark conversation as read
    setConversations(prev =>
      prev.map(conv =>
        conv.id === conversationId
          ? { ...conv, unread: 0 }
          : conv
      )
    );
  };

  // Handle creating a new conversation
  const handleCreateConversation = (userId: string, userName: string, userImage: string) => {
    const newConversationId = `new-${Date.now()}`;
    
    // Add new conversation to the list
    const newConversation = {
      id: newConversationId,
      user: {
        id: userId,
        name: userName,
        image: userImage,
      },
      lastMessage: {
        content: 'Start a new conversation',
        timestamp: new Date().toISOString(),
      },
      unread: 0,
    };

    setConversations(prev => [newConversation, ...prev]);
    setSelectedConversation(newConversationId);
    setIsNewConversationOpen(false);
  };

  return (
    <div className="container py-6">
      <h1 className="mb-6 text-3xl font-bold">Messages</h1>
      
      <div className="grid h-[calc(100vh-200px)] grid-cols-1 gap-4 md:grid-cols-3">
        {/* Conversations List */}
        <Card className="md:col-span-1">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-4">
>>>>>>> 74cd30c896a8e1e9599f3de47b7f74e6835a58ba
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
<<<<<<< HEAD
              <Button size="icon" onClick={() => setIsNewChatOpen(true)} title="New conversation">
                <UserPlus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Separator />
          <div className="h-[calc(100%-73px)] overflow-y-auto">
            {loading ? (
              <div className="space-y-4 p-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-40" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="flex h-full items-center justify-center p-4">
                <p className="text-center text-muted-foreground">No conversations found</p>
              </div>
            ) : (
              <div className="space-y-1 p-1">
                {filteredConversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    className={`flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-accent ${
                      activeConversation === conversation.id ? 'bg-accent' : ''
                    }`}
                    onClick={() => setActiveConversation(conversation.id)}
                  >
                    <div className="relative">
                      <Avatar>
                        <AvatarImage src={conversation.user.image} alt={conversation.user.name} />
                        <AvatarFallback>{conversation.user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {conversation.unread > 0 && (
                        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                          {conversation.unread}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{conversation.user.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatMessageTime(conversation.lastMessage.timestamp)}
                        </p>
                      </div>
                      <p className="truncate text-sm text-muted-foreground">
                        {conversation.lastMessage.content}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex w-2/3 flex-col">
          {activeConversation && activeConversationDetails ? (
            <>
              {/* Conversation Header */}
              <div className="flex items-center justify-between border-b p-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={activeConversationDetails.user.image} alt={activeConversationDetails.user.name} />
                    <AvatarFallback>{activeConversationDetails.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{activeConversationDetails.user.name}</p>
                    <p className="text-xs text-muted-foreground">Active now</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" title="Voice call">
                    <Phone className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" title="Video call">
                    <Video className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" title="Info">
                    <Info className="h-5 w-5" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Mark as unread</DropdownMenuItem>
                      <DropdownMenuItem>Mute notifications</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Block user</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                  {messages.map((message) => {
                    const isCurrentUser = message.sender === 'currentUser';
                    return (
                      <div
                        key={message.id}
                        className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            isCurrentUser
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <p>{message.content}</p>
                          <p className={`mt-1 text-right text-xs ${
                            isCurrentUser ? 'text-primary-foreground/80' : 'text-muted-foreground'
                          }`}>
                            {formatMessageTime(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Message Input */}
              <div className="border-t p-4">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" disabled={!newMessage.trim()}>
                    <Send className="mr-2 h-4 w-4" />
                    Send
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex h-full flex-col items-center justify-center p-4">
              <div className="mb-4 rounded-full bg-muted p-4">
                <Send className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Your Messages</h3>
              <p className="mb-4 text-center text-muted-foreground">
                Select a conversation from the list to start chatting
              </p>
            </div>
          )}
        </div>
      </div>

      {/* New Conversation Dialog */}
      <Dialog open={isNewChatOpen} onOpenChange={setIsNewChatOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>New Conversation</DialogTitle>
            <DialogDescription>
              Select a user to start a new conversation.
            </DialogDescription>
          </DialogHeader>

          <div className="relative mb-4">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="max-h-[300px] overflow-y-auto">
            {/* Mock users for demo - in a real app, these would come from the API */}
            {[
              { id: 'user1', name: 'Sarah Johnson', image: 'https://randomuser.me/api/portraits/women/44.jpg' },
              { id: 'user2', name: 'Michael Chen', image: 'https://randomuser.me/api/portraits/men/32.jpg' },
              { id: 'user3', name: 'Aisha Patel', image: 'https://randomuser.me/api/portraits/women/68.jpg' },
              { id: 'user4', name: 'David Wilson', image: 'https://randomuser.me/api/portraits/men/75.jpg' },
              { id: 'user5', name: 'Elena Rodriguez', image: 'https://randomuser.me/api/portraits/women/90.jpg' },
            ]
              .filter(user => user.name.toLowerCase().includes(searchQuery.toLowerCase()))
              .map(user => (
                <button
                  key={user.id}
                  className="flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-accent"
                  onClick={() => {
                    // Create a new conversation
                    const newConvId = `new-${Date.now()}`;
                    const newConversation = {
                      id: newConvId,
                      user: {
                        id: user.id,
                        name: user.name,
                        image: user.image,
                      },
                      lastMessage: {
                        content: 'Start a new conversation',
                        timestamp: new Date().toISOString(),
                      },
                      unread: 0,
                    };

                    setConversations(prev => [newConversation, ...prev]);
                    setActiveConversation(newConvId);
                    setIsNewChatOpen(false);
                    setSearchQuery('');
                  }}
                >
                  <Avatar>
                    <AvatarImage src={user.image} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{user.name}</p>
                  </div>
                </button>
              ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Import ErrorBoundary
import ErrorBoundary from '@/components/error-boundary';

// Export the component wrapped in ErrorBoundary
export default function MessagesPageWithErrorBoundary() {
  return (
    <ErrorBoundary>
      <MessagesPage />
    </ErrorBoundary>
  );
}
=======
              <Button size="icon" onClick={() => setIsNewConversationOpen(true)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <ConversationList
              conversations={filteredConversations}
              selectedId={selectedConversation}
              onSelect={handleSelectConversation}
            />
          </CardContent>
        </Card>
        
        {/* Message Area */}
        <Card className="md:col-span-2">
          <CardContent className="p-0">
            {selectedConversation ? (
              <div className="flex h-full flex-col">
                {/* Conversation Header */}
                <div className="border-b p-4">
                  {conversations.find(c => c.id === selectedConversation) && (
                    <div className="flex items-center gap-2">
                      <Avatar>
                        <AvatarImage 
                          src={conversations.find(c => c.id === selectedConversation)?.user.image} 
                          alt={conversations.find(c => c.id === selectedConversation)?.user.name} 
                        />
                        <AvatarFallback>
                          {conversations.find(c => c.id === selectedConversation)?.user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">
                          {conversations.find(c => c.id === selectedConversation)?.user.name}
                        </h3>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4">
                  <MessageList 
                    messages={messages[selectedConversation] || []} 
                    currentUserId="currentUser"
                  />
                </div>
                
                {/* Message Input */}
                <div className="border-t p-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button size="icon" onClick={handleSendMessage}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center p-4">
                <div className="text-center">
                  <h3 className="mb-2 text-lg font-semibold">No conversation selected</h3>
                  <p className="text-muted-foreground">
                    Select a conversation from the list or start a new one
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <NewConversationDialog
        open={isNewConversationOpen}
        onOpenChange={setIsNewConversationOpen}
        onCreateConversation={handleCreateConversation}
      />
    </div>
  );
}
>>>>>>> 74cd30c896a8e1e9599f3de47b7f74e6835a58ba

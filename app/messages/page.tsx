'use client';

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
      content: 'Great! Should I bring anything?',
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    },
  ],
  '2': [
    {
      id: 'm1',
      sender: 'user2',
      content: 'Hello, I just moved to the area and saw your post about the neighborhood.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    },
    {
      id: 'm2',
      sender: 'currentUser',
      content: 'Welcome to the neighborhood! How can I help?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 47).toISOString(),
    },
    {
      id: 'm3',
      sender: 'user2',
      content: 'I was wondering if you could recommend any good local restaurants or cafes?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 46).toISOString(),
    },
    {
      id: 'm4',
      sender: 'currentUser',
      content: 'Absolutely! There\'s a great cafe called Morning Brew on Oak Street, and if you like Thai food, Thai Delight on Main Street is excellent.',
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
      content: 'Are you still looking for roommates?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    },
  ],
};

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
      sender: 'currentUser',
      content: newMessage,
      timestamp: new Date().toISOString(),
    };

    // Update messages state
    setMessages(prev => ({
      ...prev,
      [selectedConversation]: [...(prev[selectedConversation] || []), newMessageObj],
    }));

    // Update last message in conversations
    setConversations(prev =>
      prev.map(conv =>
        conv.id === selectedConversation
          ? {
              ...conv,
              lastMessage: {
                content: newMessage,
                timestamp: new Date().toISOString(),
              },
              unread: 0,
            }
          : conv
      )
    );

    // Clear input
    setNewMessage('');
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
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
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

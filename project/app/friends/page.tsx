'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Search, UserPlus, UserCheck, UserX, MessageSquare, Clock, CheckCircle, XCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface User {
  id: string;
  name: string;
  email: string;
  image: string;
  role: string;
  verified: boolean;
  lastActive: string;
  friendshipStatus: 'none' | 'pending' | 'pending_received' | 'accepted' | 'rejected';
}

export default function FriendsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/friends');
    }
  }, [status, router]);

  // Fetch users
  useEffect(() => {
    if (status === 'authenticated') {
      fetchUsers();
    }
  }, [status]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/friends');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to load users',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error',
        description: 'Failed to load users',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const sendFriendRequest = async (userId: string) => {
    try {
      const response = await fetch('/api/friends', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ receiverId: userId }),
      });

      if (response.ok) {
        // Update the user's friendship status
        setUsers(prev =>
          prev.map(user =>
            user.id === userId
              ? { ...user, friendshipStatus: 'pending' }
              : user
          )
        );

        toast({
          title: 'Friend Request Sent',
          description: 'Your friend request has been sent successfully',
        });
      } else {
        const error = await response.json();
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Error sending friend request:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to send friend request',
        variant: 'destructive',
      });
    }
  };

  const respondToFriendRequest = async (userId: string, status: 'accepted' | 'rejected') => {
    try {
      // Find the friend request
      const user = users.find(u => u.id === userId);
      if (!user) return;

      // Find the request ID (this is a simplification, in a real app you'd store the request ID)
      const requestId = `${userId}-${session?.user?.id}`;

      const response = await fetch(`/api/friends/${requestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        // Update the user's friendship status
        setUsers(prev =>
          prev.map(user =>
            user.id === userId
              ? { ...user, friendshipStatus: status }
              : user
          )
        );

        toast({
          title: status === 'accepted' ? 'Friend Request Accepted' : 'Friend Request Rejected',
          description: status === 'accepted'
            ? 'You are now friends'
            : 'Friend request has been rejected',
        });
      } else {
        const error = await response.json();
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Error responding to friend request:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to respond to friend request',
        variant: 'destructive',
      });
    }
  };

  const startConversation = (userId: string) => {
    router.push(`/messages?conversationId=${userId}`);
  };

  // Filter users based on search query and active tab
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'friends') return matchesSearch && user.friendshipStatus === 'accepted';
    if (activeTab === 'pending') {
      return matchesSearch && (user.friendshipStatus === 'pending' || user.friendshipStatus === 'pending_received');
    }
    return matchesSearch;
  });

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Friends</h1>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <TabsList>
            <TabsTrigger value="all">All Users</TabsTrigger>
            <TabsTrigger value="friends">Friends</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
          </TabsList>

          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              className="pl-8 w-full sm:w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <TabsContent value="all" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUsers.map((user) => (
              <Card key={user.id}>
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={user.image} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{user.name}</CardTitle>
                    <CardDescription>{user.email}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Badge variant={user.role === 'admin' ? 'destructive' : user.role === 'landlord' ? 'outline' : 'secondary'}>
                      {user.role}
                    </Badge>
                    {user.lastActive && (
                      <span>
                        Active {formatDistanceToNow(new Date(user.lastActive), { addSuffix: true })}
                      </span>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  {user.friendshipStatus === 'none' && (
                    <Button onClick={() => sendFriendRequest(user.id)}>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Add Friend
                    </Button>
                  )}
                  {user.friendshipStatus === 'pending' && (
                    <Button variant="outline" disabled>
                      <Clock className="mr-2 h-4 w-4" />
                      Request Sent
                    </Button>
                  )}
                  {user.friendshipStatus === 'pending_received' && (
                    <div className="flex gap-2">
                      <Button onClick={() => respondToFriendRequest(user.id, 'accepted')} size="sm">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Accept
                      </Button>
                      <Button onClick={() => respondToFriendRequest(user.id, 'rejected')} variant="outline" size="sm">
                        <XCircle className="mr-2 h-4 w-4" />
                        Reject
                      </Button>
                    </div>
                  )}
                  {user.friendshipStatus === 'accepted' && (
                    <div className="flex gap-2">
                      <Button onClick={() => startConversation(user.id)} variant="outline">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Message
                      </Button>
                    </div>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="friends" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUsers.map((user) => (
              <Card key={user.id}>
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={user.image} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{user.name}</CardTitle>
                    <CardDescription>{user.email}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Badge variant={user.role === 'admin' ? 'destructive' : user.role === 'landlord' ? 'outline' : 'secondary'}>
                      {user.role}
                    </Badge>
                    {user.lastActive && (
                      <span>
                        Active {formatDistanceToNow(new Date(user.lastActive), { addSuffix: true })}
                      </span>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => startConversation(user.id)} variant="outline">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Message
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pending" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUsers.map((user) => (
              <Card key={user.id}>
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={user.image} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{user.name}</CardTitle>
                    <CardDescription>{user.email}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Badge variant={user.friendshipStatus === 'pending' ? 'outline' : 'secondary'}>
                      {user.friendshipStatus === 'pending' ? 'Outgoing Request' : 'Incoming Request'}
                    </Badge>
                  </div>
                </CardContent>
                <CardFooter>
                  {user.friendshipStatus === 'pending' && (
                    <Button variant="outline" disabled>
                      <Clock className="mr-2 h-4 w-4" />
                      Request Sent
                    </Button>
                  )}
                  {user.friendshipStatus === 'pending_received' && (
                    <div className="flex gap-2">
                      <Button onClick={() => respondToFriendRequest(user.id, 'accepted')} size="sm">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Accept
                      </Button>
                      <Button onClick={() => respondToFriendRequest(user.id, 'rejected')} variant="outline" size="sm">
                        <XCircle className="mr-2 h-4 w-4" />
                        Reject
                      </Button>
                    </div>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

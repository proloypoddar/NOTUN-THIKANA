'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import {
  Users,
  MessageSquare,
  Calendar,
  Home,
  Shield,
  Search,
  RefreshCw,
  CheckCircle,
  XCircle,
  BarChart3,
  PieChart,
  Activity,
  TrendingUp,
  Save
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data for demonstration
const mockUsers = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'user', status: 'active', joined: '2025-01-15' },
  { id: '2', name: 'Sarah Johnson', email: 'sarah@example.com', role: 'user', status: 'active', joined: '2025-02-03' },
  { id: '3', name: 'Michael Chen', email: 'michael@example.com', role: 'landlord', status: 'active', joined: '2025-01-22' },
  { id: '4', name: 'Admin User', email: 'admin@example.com', role: 'admin', status: 'active', joined: '2025-01-01' },
  { id: '5', name: 'Aisha Patel', email: 'aisha@example.com', role: 'user', status: 'inactive', joined: '2025-02-15' },
];

const mockPosts = [
  { id: '1', title: 'Best areas for newcomers?', author: 'Sarah K.', category: 'housing', status: 'published', date: '2025-04-10', reports: 0 },
  { id: '2', title: 'Looking for language exchange partners', author: 'Michael C.', category: 'education', status: 'published', date: '2025-04-08', reports: 0 },
  { id: '3', title: 'Safety concerns in downtown area', author: 'Anonymous', category: 'safety', status: 'flagged', date: '2025-04-05', reports: 3 },
  { id: '4', title: 'Community garden initiative', author: 'John D.', category: 'lifestyle', status: 'published', date: '2025-04-02', reports: 0 },
  { id: '5', title: 'Noise complaints in Riverside apartments', author: 'Anonymous', category: 'housing', status: 'flagged', date: '2025-03-28', reports: 2 },
];

const mockEvents = [
  { id: '1', title: 'Community Cleanup Day', organizer: 'John D.', date: '2025-05-15', attendees: 45, status: 'upcoming' },
  { id: '2', title: 'Neighborhood Watch Meeting', organizer: 'Sarah K.', date: '2025-05-10', attendees: 28, status: 'upcoming' },
  { id: '3', title: 'Cultural Food Festival', organizer: 'Michael C.', date: '2025-05-22', attendees: 120, status: 'upcoming' },
  { id: '4', title: 'Language Exchange Meetup', organizer: 'Aisha P.', date: '2025-04-30', attendees: 15, status: 'completed' },
  { id: '5', title: 'Housing Rights Workshop', organizer: 'Admin User', date: '2025-04-25', attendees: 32, status: 'completed' },
];

const mockProperties = [
  { id: '1', title: 'Modern Apartment in City Center', landlord: 'Michael C.', price: 25000, status: 'approved', listed: '2025-03-15' },
  { id: '2', title: 'Cozy Studio near University', landlord: 'Michael C.', price: 15000, status: 'approved', listed: '2025-03-20' },
  { id: '3', title: 'Spacious 3BR Family Home', landlord: 'Sarah K.', price: 35000, status: 'pending', listed: '2025-04-05' },
  { id: '4', title: 'Luxury Penthouse with City Views', landlord: 'John D.', price: 50000, status: 'approved', listed: '2025-03-10' },
  { id: '5', title: 'Single Room in Shared Apartment', landlord: 'Aisha P.', price: 8000, status: 'pending', listed: '2025-04-12' },
];

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState(mockUsers);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [stats, setStats] = useState({
    counts: {
      users: 0,
      posts: 0,
      messages: 0,
    },
    userDistribution: {},
    recentActivity: {
      users: [],
      posts: [],
    }
  });

  // Check if user is admin
  useEffect(() => {
    if (status === 'authenticated') {
      if (session?.user.role !== 'admin') {
        toast({
          title: 'Access Denied',
          description: 'You do not have permission to access the admin dashboard.',
          variant: 'destructive',
        });
        router.push('/');
      } else {
        // Load users data and stats
        fetchUsers();
        fetchStats();
      }
    } else if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/admin');
    }
  }, [status, session, router, toast]);

  // Fetch users from the API
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/users');

      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        console.error('Failed to fetch users');
        toast({
          title: 'Error',
          description: 'Failed to load users. Using mock data instead.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error',
        description: 'Failed to load users. Using mock data instead.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch dashboard statistics
  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        console.error('Failed to fetch stats');
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSeedDatabase = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/seed');
      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Database Seeded',
          description: `${data.message} - Created ${data.counts?.users || 0} users, ${data.counts?.posts || 0} posts, and ${data.counts?.messages || 0} messages.`,
        });

        // Refresh data
        fetchUsers();
        fetchStats();
      } else {
        throw new Error(data.message || 'Failed to seed database');
      }
    } catch (error) {
      console.error('Error seeding database:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to seed database. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveProperty = (id: string) => {
    toast({
      title: 'Property Approved',
      description: `Property ID: ${id} has been approved.`,
    });
  };

  const handleRejectProperty = (id: string) => {
    toast({
      title: 'Property Rejected',
      description: `Property ID: ${id} has been rejected.`,
    });
  };

  const handleRemovePost = (id: string) => {
    toast({
      title: 'Post Removed',
      description: `Post ID: ${id} has been removed.`,
    });
  };

  // Handle updating a user
  const handleUpdateUser = async (userData: any) => {
    setIsLoading(true);
    try {
      console.log('Updating user with data:', userData);

      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: userData.id,
          role: userData.role,
          status: userData.status
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('User update response:', data);

        // Update the user in the local state
        setUsers(prev =>
          prev.map(user =>
            user.id === userData.id
              ? {
                  ...user,
                  role: userData.role || user.role,
                  status: userData.status || user.status
                }
              : user
          )
        );

        toast({
          title: 'User Updated',
          description: data.message,
        });

        // Create a notification for the user
        try {
          await fetch('/api/notifications', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              recipient: userData.id,
              notification: {
                title: 'Account Updated',
                message: `Your account has been updated by an administrator. Role: ${userData.role}, Status: ${userData.status}`,
                type: 'system',
                urgency: 'regular',
              }
            }),
          });
        } catch (notifError) {
          console.error('Error sending notification:', notifError);
        }

        setIsEditUserDialogOpen(false);
      } else {
        throw new Error(data.message || 'Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update user',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading' || (status === 'authenticated' && session?.user.role !== 'admin')) {
    return (
      <div className="container flex h-screen items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <span className="ml-2">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage your community platform</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="properties">Properties</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.counts.users || 0}</div>
                <p className="text-xs text-muted-foreground">Total registered users</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Posts</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.counts.posts || 0}</div>
                <p className="text-xs text-muted-foreground">Total posts created</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
                <p className="text-xs text-muted-foreground">Scheduled events</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
                <Home className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.counts.messages || 0}</div>
                <p className="text-xs text-muted-foreground">Total messages sent</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Activity Overview</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[300px] flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <BarChart3 className="h-16 w-16" />
                    <p>Activity chart would appear here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>User Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <PieChart className="h-16 w-16" />
                    <p>User distribution chart would appear here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest actions across the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.recentActivity?.users?.slice(0, 2).map((user: any, index: number) => (
                    <div key={user.id || index} className="flex items-center gap-4">
                      <div className="rounded-full bg-primary/10 p-2">
                        <Users className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">New user registered</p>
                        <p className="text-xs text-muted-foreground">
                          {user.name} - {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}

                  {stats.recentActivity?.posts?.slice(0, 2).map((post: any, index: number) => (
                    <div key={post.id || index} className="flex items-center gap-4">
                      <div className="rounded-full bg-primary/10 p-2">
                        <MessageSquare className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">New post created</p>
                        <p className="text-xs text-muted-foreground">
                          {post.title} - {post.author}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Platform Health</CardTitle>
                <CardDescription>System status and metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <Label>Server Load</Label>
                      <span className="text-xs text-muted-foreground">24%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div className="h-full w-[24%] rounded-full bg-primary"></div>
                    </div>
                  </div>
                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <Label>Database Usage</Label>
                      <span className="text-xs text-muted-foreground">42%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div className="h-full w-[42%] rounded-full bg-primary"></div>
                    </div>
                  </div>
                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <Label>API Requests</Label>
                      <span className="text-xs text-muted-foreground">1.2k/min</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-green-500" />
                      <span className="text-xs text-green-500">Healthy</span>
                    </div>
                  </div>
                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <Label>User Growth</Label>
                      <span className="text-xs text-muted-foreground">+12%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-xs text-green-500">Increasing</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>View and manage user accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    className="pl-8"
                    value={userSearchQuery}
                    onChange={(e) => setUserSearchQuery(e.target.value)}
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchUsers}
                  disabled={isLoading}
                >
                  <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users
                      .filter(user =>
                        user.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
                        user.email.toLowerCase().includes(userSearchQuery.toLowerCase())
                      )
                      .map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge variant={user.role === 'admin' ? 'destructive' : user.role === 'landlord' ? 'outline' : 'secondary'}>
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                              {user.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{user.joined}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedUser(user);
                                setIsEditUserDialogOpen(true);
                              }}
                            >
                              Edit
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Content Moderation</CardTitle>
              <CardDescription>Manage forum posts and comments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search content..." className="pl-8" />
                </div>
                <Button variant="outline" size="sm">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh
                </Button>
              </div>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Reports</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockPosts.map((post) => (
                      <TableRow key={post.id}>
                        <TableCell className="font-medium">{post.title}</TableCell>
                        <TableCell>{post.author}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{post.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={post.status === 'flagged' ? 'destructive' : 'default'}>
                            {post.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{post.date}</TableCell>
                        <TableCell>{post.reports}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive"
                            onClick={() => handleRemovePost(post.id)}
                          >
                            Remove
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Events Management</CardTitle>
              <CardDescription>Manage community events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Organizer</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Attendees</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockEvents.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell className="font-medium">{event.title}</TableCell>
                        <TableCell>{event.organizer}</TableCell>
                        <TableCell>{event.date}</TableCell>
                        <TableCell>{event.attendees}</TableCell>
                        <TableCell>
                          <Badge variant={event.status === 'upcoming' ? 'default' : 'secondary'}>
                            {event.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">Edit</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Properties Tab */}
        <TabsContent value="properties" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Property Listings</CardTitle>
              <CardDescription>Manage and approve property listings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search properties..." className="pl-8" />
                </div>
                <Button variant="outline" size="sm">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh
                </Button>
              </div>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Landlord</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Listed</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockProperties.map((property) => (
                      <TableRow key={property.id}>
                        <TableCell className="font-medium">{property.title}</TableCell>
                        <TableCell>{property.landlord}</TableCell>
                        <TableCell>৳{property.price}</TableCell>
                        <TableCell>
                          <Badge variant={property.status === 'approved' ? 'default' : 'secondary'}>
                            {property.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{property.listed}</TableCell>
                        <TableCell className="text-right">
                          {property.status === 'pending' ? (
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-green-600"
                                onClick={() => handleApproveProperty(property.id)}
                              >
                                <CheckCircle className="mr-1 h-4 w-4" />
                                Approve
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-destructive"
                                onClick={() => handleRejectProperty(property.id)}
                              >
                                <XCircle className="mr-1 h-4 w-4" />
                                Reject
                              </Button>
                            </div>
                          ) : (
                            <Button variant="ghost" size="sm">View</Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>Manage application settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="site-name">Site Name</Label>
                <Input id="site-name" defaultValue="Notun Thikana" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="site-description">Site Description</Label>
                <Input id="site-description" defaultValue="Your Urban Community Hub" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-email">Contact Email</Label>
                <Input id="contact-email" defaultValue="admin@notunthikana.com" />
              </div>
              <div className="pt-4">
                <Button onClick={handleSeedDatabase} disabled={isLoading}>
                  {isLoading ? 'Seeding Database...' : 'Seed Database with Test Data'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit User Dialog */}
      <Dialog open={isEditUserDialogOpen} onOpenChange={setIsEditUserDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user role and status.
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={selectedUser.name}
                  className="col-span-3"
                  disabled
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  value={selectedUser.email}
                  className="col-span-3"
                  disabled
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  Role
                </Label>
                <Select
                  value={selectedUser.role}
                  onValueChange={(value) => setSelectedUser({...selectedUser, role: value})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="landlord">Landlord</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select
                  value={selectedUser.status}
                  onValueChange={(value) => setSelectedUser({...selectedUser, status: value})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              type="submit"
              onClick={() => handleUpdateUser(selectedUser)}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save changes
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

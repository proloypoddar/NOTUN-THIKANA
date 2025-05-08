'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { Heart, MessageCircle, Share, MoreHorizontal, Plus, Filter } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';

// Types for our posts
interface User {
  id: string;
  name: string;
  image?: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  authorImage?: string;
  category: string;
  createdAt: string;
  likes: string[];
  commentCount: number;
  isAnonymous: boolean;
}

function PostsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: 'general',
    isAnonymous: false,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Sample posts data for better performance
  const samplePosts = [
    {
      id: '1',
      title: 'Welcome to our community!',
      content: 'This is a great place to connect with neighbors and share information about our area.',
      authorId: 'user1',
      authorName: 'Sarah Johnson',
      authorImage: 'https://randomuser.me/api/portraits/women/44.jpg',
      category: 'general',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      likes: ['user2', 'user3'],
      commentCount: 5,
      isAnonymous: false,
    },
    {
      id: '2',
      title: 'Looking for recommendations on local restaurants',
      content: 'I just moved to the area and would love to know what restaurants people recommend!',
      authorId: 'user2',
      authorName: 'Michael Chen',
      authorImage: 'https://randomuser.me/api/portraits/men/32.jpg',
      category: 'question',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      likes: ['user1', 'user4', 'user5'],
      commentCount: 8,
      isAnonymous: false,
    },
    {
      id: '3',
      title: 'Community garden event this weekend',
      content: 'We\'re having a community garden cleanup this Saturday from 10am-2pm. Everyone is welcome! Refreshments will be provided.',
      authorId: 'user3',
      authorName: 'Aisha Patel',
      authorImage: 'https://randomuser.me/api/portraits/women/68.jpg',
      category: 'event',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      likes: ['user1', 'user2', 'user4', 'user5', 'user6'],
      commentCount: 12,
      isAnonymous: false,
    },
    {
      id: '4',
      title: 'Property for rent near downtown',
      content: 'I have a 2-bedroom apartment available for rent starting next month. Great location, pet-friendly. DM for details.',
      authorId: 'user4',
      authorName: 'David Wilson',
      authorImage: 'https://randomuser.me/api/portraits/men/75.jpg',
      category: 'property',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
      likes: ['user2', 'user7'],
      commentCount: 3,
      isAnonymous: false,
    },
    {
      id: '5',
      title: 'Thoughts on the new park development?',
      content: 'What does everyone think about the plans for the new park? I think it looks great but I\'m concerned about parking.',
      authorId: 'user5',
      authorName: 'Elena Rodriguez',
      authorImage: 'https://randomuser.me/api/portraits/women/90.jpg',
      category: 'discussion',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
      likes: ['user1', 'user3', 'user6'],
      commentCount: 15,
      isAnonymous: false,
    },
  ];

  // Load posts - using sample data for better performance
  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      try {
        // Simulate API call with sample data
        setTimeout(() => {
          if (activeCategory === 'all') {
            setPosts(samplePosts);
          } else {
            const filteredPosts = samplePosts.filter(post => post.category === activeCategory);
            setPosts(filteredPosts);
          }
          setLoading(false);
        }, 300);
      } catch (error) {
        console.error('Error loading posts:', error);
        toast({
          title: 'Error',
          description: 'Failed to load posts. Please try again.',
          variant: 'destructive',
        });
        // Set empty posts array
        setPosts([]);
        setLoading(false);
      }
    };

    loadPosts();
  }, [activeCategory, toast]);

  // Handle creating a new post - simplified for better performance
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPost.title.trim() || !newPost.content.trim()) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Create a default user ID if not authenticated
      const userId = session?.user?.id || 'guest-user';
      const userName = session?.user?.name || 'Guest User';

      // Create a new post directly
      const newPostData = {
        id: `new-${Date.now()}`,
        title: newPost.title,
        content: newPost.content,
        category: newPost.category,
        authorId: userId,
        authorName: userName,
        authorImage: session?.user?.image || 'https://randomuser.me/api/portraits/lego/1.jpg',
        createdAt: new Date().toISOString(),
        likes: [],
        commentCount: 0,
        isAnonymous: newPost.isAnonymous,
      };

      // Add the new post to the list
      setPosts(prev => [newPostData, ...prev]);

      // Reset form and close dialog
      setNewPost({
        title: '',
        content: '',
        category: 'general',
        isAnonymous: false,
      });
      setIsDialogOpen(false);

      // Show success message
      toast({
        title: 'Success',
        description: 'Your post has been created successfully.',
      });
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: 'Error',
        description: 'Failed to create post. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Handle liking a post - simplified for better performance
  const handleLikePost = (postId: string) => {
    // Create a default user ID if not authenticated
    const userId = session?.user?.id || 'guest-user';

    // Update UI directly
    setPosts(prev =>
      prev.map(post => {
        if (post.id === postId) {
          const userLiked = post.likes.includes(userId);
          return {
            ...post,
            likes: userLiked
              ? post.likes.filter(id => id !== userId)
              : [...post.likes, userId],
          };
        }
        return post;
      })
    );

    // Show success toast
    toast({
      title: userHasLiked(postId) ? 'Post unliked' : 'Post liked',
      description: userHasLiked(postId) ? 'You have unliked this post' : 'You have liked this post',
    });
  };

  // Helper function to check if user has liked a post
  const userHasLiked = (postId: string) => {
    const userId = session?.user?.id || 'guest-user';
    const post = posts.find(p => p.id === postId);
    return post ? post.likes.includes(userId) : false;
  };

  // Format date
  const formatPostDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) {
      return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    } else {
      return format(date, 'MMM d, yyyy');
    }
  };

  // Get category label
  const getCategoryLabel = (category: string) => {
    const categories: Record<string, string> = {
      general: 'General',
      announcement: 'Announcement',
      question: 'Question',
      discussion: 'Discussion',
      event: 'Event',
      news: 'News',
      property: 'Property',
      review: 'Review',
    };

    return categories[category] || 'General';
  };

  // Get category color
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      general: 'bg-gray-100 text-gray-800',
      announcement: 'bg-blue-100 text-blue-800',
      question: 'bg-purple-100 text-purple-800',
      discussion: 'bg-green-100 text-green-800',
      event: 'bg-yellow-100 text-yellow-800',
      news: 'bg-orange-100 text-orange-800',
      property: 'bg-red-100 text-red-800',
      review: 'bg-pink-100 text-pink-800',
    };

    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Community Posts</h1>
          <p className="text-muted-foreground">Connect with your community</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Post
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Create a New Post</DialogTitle>
              <DialogDescription>
                Share your thoughts, questions, or announcements with the community.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreatePost}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter a title for your post"
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    placeholder="What's on your mind?"
                    rows={5}
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={newPost.category}
                    onValueChange={(value) => setNewPost({ ...newPost, category: value })}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="question">Question</SelectItem>
                      <SelectItem value="discussion">Discussion</SelectItem>
                      <SelectItem value="property">Property</SelectItem>
                      <SelectItem value="event">Event</SelectItem>
                      <SelectItem value="announcement">Announcement</SelectItem>
                      <SelectItem value="news">News</SelectItem>
                      <SelectItem value="review">Review</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="anonymous"
                    checked={newPost.isAnonymous}
                    onCheckedChange={(checked) =>
                      setNewPost({ ...newPost, isAnonymous: checked === true })
                    }
                  />
                  <Label htmlFor="anonymous">Post anonymously</Label>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Post</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-6">
        <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory}>
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="question">Questions</TabsTrigger>
              <TabsTrigger value="property">Properties</TabsTrigger>
              <TabsTrigger value="discussion">Discussions</TabsTrigger>
            </TabsList>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
        </Tabs>
      </div>

      <div className="space-y-6">
        {loading ? (
          // Loading skeletons
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex w-full justify-between">
                  <div className="flex gap-4">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                  <Skeleton className="h-8 w-8" />
                </div>
              </CardFooter>
            </Card>
          ))
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
            <div className="mb-4 rounded-full bg-muted p-4">
              <MessageCircle className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">No Posts Found</h3>
            <p className="mb-6 text-muted-foreground">
              {activeCategory === 'all'
                ? "There are no posts yet. Be the first to post!"
                : `There are no posts in the ${getCategoryLabel(activeCategory)} category yet.`}
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create a Post
            </Button>
          </div>
        ) : (
          // Posts list
          posts.map((post) => (
            <Card key={post.id} className="overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={post.authorImage} alt={post.authorName} />
                      <AvatarFallback>{post.authorName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{post.authorName}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatPostDate(post.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-2 py-1 text-xs ${getCategoryColor(post.category)}`}>
                      {getCategoryLabel(post.category)}
                    </span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Save post</DropdownMenuItem>
                        <DropdownMenuItem>Report</DropdownMenuItem>
                        {session?.user?.id === post.authorId && (
                          <>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-4">
                <h3 className="mb-2 text-xl font-semibold">{post.title}</h3>
                <p className="whitespace-pre-line">{post.content}</p>
              </CardContent>
              <CardFooter>
                <div className="flex w-full justify-between">
                  <div className="flex gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => handleLikePost(post.id)}
                    >
                      <Heart
                        className={`h-5 w-5 ${
                          session?.user?.id && post.likes.includes(session.user.id)
                            ? 'fill-red-500 text-red-500'
                            : ''
                        }`}
                      />
                      <span>{post.likes.length}</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => router.push(`/posts/${post.id}`)}
                    >
                      <MessageCircle className="h-5 w-5" />
                      <span>{post.commentCount}</span>
                    </Button>
                  </div>
                  <Button variant="ghost" size="sm" className="flex items-center gap-1">
                    <Share className="h-5 w-5" />
                    <span>Share</span>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

// Import ErrorBoundary
import ErrorBoundary from '@/components/error-boundary';

// Export the component wrapped in ErrorBoundary
export default function PostsPageWithErrorBoundary() {
  return (
    <ErrorBoundary>
      <PostsPage />
    </ErrorBoundary>
  );
}

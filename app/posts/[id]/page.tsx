'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { Heart, MessageCircle, Share, MoreHorizontal, ArrowLeft, Send } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { Textarea } from '@/components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

// Types
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

interface Comment {
  id: string;
  postId: string;
  content: string;
  authorId: string;
  authorName: string;
  authorImage?: string;
  createdAt: string;
  likes: string[];
  isAnonymous: boolean;
}

function PostDetailPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentContent, setCommentContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);

  // Sample post data for better performance
  const samplePosts = {
    '1': {
      id: '1',
      title: 'Welcome to our community!',
      content: 'This is a great place to connect with neighbors and share information about our area. We hope you\'ll find this platform useful for staying connected and building relationships with those around you.\n\nFeel free to share your thoughts, ask questions, and participate in discussions. Together, we can make our community stronger!',
      authorId: 'user1',
      authorName: 'Sarah Johnson',
      authorImage: 'https://randomuser.me/api/portraits/women/44.jpg',
      category: 'general',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      likes: ['user2', 'user3'],
      commentCount: 5,
      isAnonymous: false,
    },
    '2': {
      id: '2',
      title: 'Looking for recommendations on local restaurants',
      content: 'I just moved to the area and would love to know what restaurants people recommend! I enjoy all types of cuisine but particularly love Thai and Italian food. Any suggestions for places with good vegetarian options would also be appreciated.\n\nAlso, are there any regular community dining events or food festivals I should know about?',
      authorId: 'user2',
      authorName: 'Michael Chen',
      authorImage: 'https://randomuser.me/api/portraits/men/32.jpg',
      category: 'question',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      likes: ['user1', 'user4', 'user5'],
      commentCount: 8,
      isAnonymous: false,
    },
    '3': {
      id: '3',
      title: 'Community garden event this weekend',
      content: 'We\'re having a community garden cleanup this Saturday from 10am-2pm. Everyone is welcome! Refreshments will be provided.\n\nPlease bring your own gardening gloves if you have them, though we\'ll have extras available. This is a great opportunity to meet your neighbors and help beautify our shared spaces.\n\nIn case of rain, we\'ll reschedule for the following weekend.',
      authorId: 'user3',
      authorName: 'Aisha Patel',
      authorImage: 'https://randomuser.me/api/portraits/women/68.jpg',
      category: 'event',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      likes: ['user1', 'user2', 'user4', 'user5', 'user6'],
      commentCount: 12,
      isAnonymous: false,
    },
    '4': {
      id: '4',
      title: 'Property for rent near downtown',
      content: 'I have a 2-bedroom apartment available for rent starting next month. Great location, pet-friendly. DM for details.\n\nThe apartment features hardwood floors, updated appliances, and a spacious balcony. It\'s within walking distance to public transportation, grocery stores, and restaurants.\n\nRent is $1,200/month including water and trash. Electricity and internet are separate.',
      authorId: 'user4',
      authorName: 'David Wilson',
      authorImage: 'https://randomuser.me/api/portraits/men/75.jpg',
      category: 'property',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
      likes: ['user2', 'user7'],
      commentCount: 3,
      isAnonymous: false,
    },
    '5': {
      id: '5',
      title: 'Thoughts on the new park development?',
      content: 'What does everyone think about the plans for the new park? I think it looks great but I\'m concerned about parking.\n\nThe proposed design includes a playground, walking trails, and a small amphitheater for community events. While these amenities sound wonderful, the current plan only allocates space for 30 parking spots.\n\nDo you think this will be sufficient? How might this affect street parking in the surrounding neighborhoods?',
      authorId: 'user5',
      authorName: 'Elena Rodriguez',
      authorImage: 'https://randomuser.me/api/portraits/women/90.jpg',
      category: 'discussion',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
      likes: ['user1', 'user3', 'user6'],
      commentCount: 15,
      isAnonymous: false,
    },
  };

  // Sample comments data
  const sampleComments = {
    '1': [
      {
        id: 'c1',
        postId: '1',
        content: 'Welcome to the community! Looking forward to connecting with everyone.',
        authorId: 'user2',
        authorName: 'Michael Chen',
        authorImage: 'https://randomuser.me/api/portraits/men/32.jpg',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(),
        likes: ['user1', 'user3'],
        isAnonymous: false,
      },
      {
        id: 'c2',
        postId: '1',
        content: 'This is exactly what our neighborhood needed! Thanks for setting this up.',
        authorId: 'user3',
        authorName: 'Aisha Patel',
        authorImage: 'https://randomuser.me/api/portraits/women/68.jpg',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 1.5).toISOString(),
        likes: ['user1'],
        isAnonymous: false,
      },
      {
        id: 'c3',
        postId: '1',
        content: 'I\'ve been looking for a way to get more involved locally. This is perfect!',
        authorId: 'user4',
        authorName: 'David Wilson',
        authorImage: 'https://randomuser.me/api/portraits/men/75.jpg',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 1.8).toISOString(),
        likes: [],
        isAnonymous: false,
      },
    ],
    '2': [
      {
        id: 'c4',
        postId: '2',
        content: 'You should try Bella Italia on Main Street. They have amazing pasta and plenty of vegetarian options!',
        authorId: 'user1',
        authorName: 'Sarah Johnson',
        authorImage: 'https://randomuser.me/api/portraits/women/44.jpg',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
        likes: ['user2', 'user5'],
        isAnonymous: false,
      },
      {
        id: 'c5',
        postId: '2',
        content: 'Thai Spice on Oak Avenue is my go-to for Thai food. Their pad thai is incredible!',
        authorId: 'user3',
        authorName: 'Aisha Patel',
        authorImage: 'https://randomuser.me/api/portraits/women/68.jpg',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4.5).toISOString(),
        likes: ['user2'],
        isAnonymous: false,
      },
    ],
    '3': [
      {
        id: 'c6',
        postId: '3',
        content: 'I\'ll be there! Looking forward to helping out.',
        authorId: 'user1',
        authorName: 'Sarah Johnson',
        authorImage: 'https://randomuser.me/api/portraits/women/44.jpg',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 23).toISOString(),
        likes: ['user3'],
        isAnonymous: false,
      },
      {
        id: 'c7',
        postId: '3',
        content: 'This is a great initiative! I\'ll bring some extra tools.',
        authorId: 'user2',
        authorName: 'Michael Chen',
        authorImage: 'https://randomuser.me/api/portraits/men/32.jpg',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(),
        likes: ['user3', 'user1'],
        isAnonymous: false,
      },
    ],
    '4': [
      {
        id: 'c8',
        postId: '4',
        content: 'Is the apartment still available? I\'m interested!',
        authorId: 'user5',
        authorName: 'Elena Rodriguez',
        authorImage: 'https://randomuser.me/api/portraits/women/90.jpg',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 47).toISOString(),
        likes: [],
        isAnonymous: false,
      },
    ],
    '5': [
      {
        id: 'c9',
        postId: '5',
        content: 'I agree that parking could be an issue. Maybe they should consider adding a small parking garage?',
        authorId: 'user1',
        authorName: 'Sarah Johnson',
        authorImage: 'https://randomuser.me/api/portraits/women/44.jpg',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 71).toISOString(),
        likes: ['user5', 'user3'],
        isAnonymous: false,
      },
      {
        id: 'c10',
        postId: '5',
        content: 'I\'m more concerned about the maintenance budget. Who will keep the park clean and safe?',
        authorId: 'user3',
        authorName: 'Aisha Patel',
        authorImage: 'https://randomuser.me/api/portraits/women/68.jpg',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 70).toISOString(),
        likes: ['user5'],
        isAnonymous: false,
      },
    ],
  };

  // Load post and comments - using sample data for better performance
  useEffect(() => {
    const loadPostAndComments = async () => {
      setLoading(true);
      try {
        // Simulate API call with sample data
        setTimeout(() => {
          // @ts-ignore - This is sample data
          const postData = samplePosts[params.id];
          if (postData) {
            setPost(postData);
            // @ts-ignore - This is sample data
            setComments(sampleComments[params.id] || []);
          }
          setLoading(false);
        }, 300);
      } catch (error) {
        console.error('Error loading post:', error);
        toast({
          title: 'Error',
          description: 'Failed to load post. Please try again.',
          variant: 'destructive',
        });
        setLoading(false);
      }
    };

    loadPostAndComments();
  }, [params.id, toast]);

  // Handle liking a post - simplified for better performance
  const handleLikePost = () => {
    if (!post) return;

    // Create a default user ID if not authenticated
    const userId = session?.user?.id || 'guest-user';

    // Update UI directly
    setPost(prev => {
      if (!prev) return prev;

      const userLiked = prev.likes.includes(userId);
      return {
        ...prev,
        likes: userLiked
          ? prev.likes.filter(id => id !== userId)
          : [...prev.likes, userId],
      };
    });

    // Show success toast
    toast({
      title: userHasLikedPost() ? 'Post unliked' : 'Post liked',
      description: userHasLikedPost() ? 'You have unliked this post' : 'You have liked this post',
    });
  };

  // Helper function to check if user has liked the post
  const userHasLikedPost = () => {
    if (!post) return false;
    const userId = session?.user?.id || 'guest-user';
    return post.likes.includes(userId);
  };

  // Handle submitting a comment - simplified for better performance
  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();

    if (!commentContent.trim() || !post) {
      toast({
        title: 'Error',
        description: 'Please enter a comment.',
        variant: 'destructive',
      });
      return;
    }

    setSubmittingComment(true);

    // Create a default user ID if not authenticated
    const userId = session?.user?.id || 'guest-user';
    const userName = session?.user?.name || 'Guest User';
    const userImage = session?.user?.image || 'https://randomuser.me/api/portraits/lego/1.jpg';

    // Create a new comment directly
    const newComment = {
      id: `new-${Date.now()}`,
      postId: post.id,
      content: commentContent,
      authorId: userId,
      authorName: userName,
      authorImage: userImage,
      createdAt: new Date().toISOString(),
      likes: [],
      isAnonymous,
    };

    // Simulate a delay for better UX
    setTimeout(() => {
      // Add the new comment to the list
      setComments(prev => [newComment, ...prev]);

      // Update post comment count
      setPost(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          commentCount: prev.commentCount + 1,
        };
      });

      // Reset form
      setCommentContent('');
      setIsAnonymous(false);
      setSubmittingComment(false);

      // Show success message
      toast({
        title: 'Success',
        description: 'Your comment has been posted.',
      });
    }, 500);
  };

  // Handle liking a comment - simplified for better performance
  const handleLikeComment = (commentId: string) => {
    // Create a default user ID if not authenticated
    const userId = session?.user?.id || 'guest-user';

    // Update UI directly
    setComments(prev =>
      prev.map(comment => {
        if (comment.id === commentId) {
          const userLiked = comment.likes.includes(userId);
          return {
            ...comment,
            likes: userLiked
              ? comment.likes.filter(id => id !== userId)
              : [...comment.likes, userId],
          };
        }
        return comment;
      })
    );

    // Show success toast
    const comment = comments.find(c => c.id === commentId);
    const userLiked = comment ? comment.likes.includes(userId) : false;

    toast({
      title: userLiked ? 'Comment unliked' : 'Comment liked',
      description: userLiked ? 'You have unliked this comment' : 'You have liked this comment',
    });
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'MMM d, yyyy h:mm a');
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

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="mt-2 h-4 w-1/4" />
        </div>

        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </CardContent>
        </Card>

        <div className="mb-6">
          <Skeleton className="h-6 w-40" />
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>

        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="mt-2 h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <div className="mb-4 rounded-full bg-muted p-4">
            <MessageCircle className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="mb-2 text-xl font-semibold">Post Not Found</h3>
          <p className="mb-6 text-muted-foreground">
            The post you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => router.push('/posts')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Posts
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Posts
        </Button>
        <h1 className="text-3xl font-bold">{post.title}</h1>
        <div className="mt-2 flex items-center gap-2">
          <span className={`rounded-full px-2 py-1 text-xs ${getCategoryColor(post.category)}`}>
            {getCategoryLabel(post.category)}
          </span>
          <span className="text-sm text-muted-foreground">
            {formatDate(post.createdAt)}
          </span>
        </div>
      </div>

      <Card className="mb-8">
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
                  {post.isAnonymous ? 'Posted anonymously' : 'Community Member'}
                </p>
              </div>
            </div>
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
        </CardHeader>
        <CardContent className="pb-4">
          <p className="whitespace-pre-line">{post.content}</p>
        </CardContent>
        <CardFooter>
          <div className="flex w-full justify-between">
            <div className="flex gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1"
                onClick={handleLikePost}
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

      <div className="mb-6">
        <h2 className="text-xl font-semibold">Comments ({post.commentCount})</h2>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmitComment}>
            <Textarea
              placeholder="Write a comment..."
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              className="mb-4 min-h-24"
              required
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="anonymous-comment"
                  checked={isAnonymous}
                  onCheckedChange={(checked) => setIsAnonymous(checked === true)}
                />
                <Label htmlFor="anonymous-comment">Comment anonymously</Label>
              </div>
              <Button type="submit" disabled={submittingComment || !commentContent.trim()}>
                {submittingComment ? (
                  <>Posting...</>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Post Comment
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {comments.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="text-muted-foreground">No comments yet. Be the first to comment!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <Card key={comment.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={comment.authorImage} alt={comment.authorName} />
                      <AvatarFallback>{comment.authorName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{comment.authorName}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(comment.createdAt)}
                      </p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Report</DropdownMenuItem>
                      {session?.user?.id === comment.authorId && (
                        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <p>{comment.content}</p>
              </CardContent>
              <CardFooter>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => handleLikeComment(comment.id)}
                >
                  <Heart
                    className={`h-4 w-4 ${
                      session?.user?.id && comment.likes.includes(session.user.id)
                        ? 'fill-red-500 text-red-500'
                        : ''
                    }`}
                  />
                  <span className="text-sm">{comment.likes.length}</span>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// Import ErrorBoundary
import ErrorBoundary from '@/components/error-boundary';

// Export the component wrapped in ErrorBoundary
export default function PostDetailPageWithErrorBoundary({ params }: { params: { id: string } }) {
  return (
    <ErrorBoundary>
      <PostDetailPage params={params} />
    </ErrorBoundary>
  );
}

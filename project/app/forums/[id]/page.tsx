'use client';

<<<<<<< HEAD
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThumbsUp, MessageSquare, Flag, ArrowLeft, Send } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';



export default function PostDetailPage({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [postLikes, setPostLikes] = useState(0);
  const [commentLikes, setCommentLikes] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPostDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/forums/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch post details');
        }

        const data = await response.json();
        setPost(data);
        setPostLikes(data.likes || 0);

        if (data.comments && data.comments.length > 0) {
          setComments(data.comments);
          const likesObj = data.comments.reduce((acc: any, comment: any) => {
            return { ...acc, [comment.id]: comment.likes || 0 };
          }, {});
          setCommentLikes(likesObj);
        }
      } catch (err) {
        console.error('Error fetching post details:', err);
        setError('Failed to load post details. Please try again later.');

        // Fallback data
        setPost({
          id: params.id,
          title: 'Sample Post',
          content: 'This is a sample post content.',
          author: 'User',
          date: new Date().toISOString().split('T')[0],
          category: 'general',
          likes: 0,
          views: 0,
          isAnonymous: false,
          tags: ['sample']
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPostDetails();
  }, [params.id]);

  const handleLikePost = async () => {
    try {
      const response = await fetch(`/api/forums/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to like post');
      }

      const data = await response.json();
      setPostLikes(data.likes);

      toast({
        title: data.liked ? 'Post liked' : 'Like removed',
        description: data.liked ? 'You liked this post' : 'You removed your like from this post',
      });
    } catch (error) {
      console.error('Error liking post:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to like post. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleLikeComment = (commentId: number) => {
    setCommentLikes({
      ...commentLikes,
      [commentId]: (commentLikes[commentId] || 0) + 1,
    });
    toast({
      title: 'Comment liked',
      description: 'You liked this comment',
    });
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await fetch(`/api/forums/${params.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newComment,
          isAnonymous,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to post comment');
      }

      const newCommentData = await response.json();

      // Add the new comment to the list
      setComments([...comments, newCommentData]);

      // Reset form
      setNewComment('');
      setIsAnonymous(false);

      toast({
        title: 'Reply posted',
        description: 'Your reply has been posted successfully',
      });
    } catch (error) {
      console.error('Error posting comment:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to post comment. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="container flex h-96 items-center justify-center py-8">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <span className="ml-2">Loading post details...</span>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container py-8">
        <Link href="/forums" className="mb-4 flex items-center text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to forums
        </Link>
        <div className="mt-8 text-center text-red-500">
          <p>{error || 'Post not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <Link href="/forums" className="mb-4 flex items-center text-muted-foreground hover:text-foreground">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to forums
      </Link>

      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="mb-2 text-2xl">{post.title}</CardTitle>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
=======
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { ThumbsUp, MessageSquare, Flag, Share2, Edit, Trash2, ArrowLeft } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

// Mock post data
const mockPost = {
  id: '1',
  title: 'Best areas for newcomers?',
  content: 'I\'m moving to the city next month for a new job. Which areas would you recommend for young professionals? I\'m looking for a safe neighborhood with good public transportation and some nice cafes or restaurants nearby. My budget is around $1200 for rent. Any advice would be greatly appreciated!',
  author: {
    id: 'user1',
    name: 'Sarah K.',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  date: '2025-04-10',
  category: 'housing',
  isAnonymous: false,
  tags: ['newcomer', 'housing', 'advice'],
  likes: 45,
  views: 234,
};

// Mock comments data
const mockComments = [
  {
    id: 'c1',
    content: 'I would recommend the Riverside district. It\'s safe, has great public transport connections, and there are lots of cafes and restaurants. Rent for a 1-bedroom is around $1000-1200.',
    author: {
      id: 'user2',
      name: 'Michael Chen',
      image: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    date: '2025-04-10',
    likes: 12,
    isAnonymous: false,
  },
  {
    id: 'c2',
    content: 'Downtown is great if you want to be close to everything, but it might be a bit above your budget. The University District is more affordable and has a young crowd.',
    author: {
      id: 'user3',
      name: 'Anonymous',
      image: '',
    },
    date: '2025-04-11',
    likes: 8,
    isAnonymous: true,
  },
  {
    id: 'c3',
    content: 'I moved here last year and chose Greenwood. It\'s a bit further out but very affordable and has a nice community feel. There\'s a direct bus to downtown that takes about 20 minutes.',
    author: {
      id: 'user4',
      name: 'Elena Rodriguez',
      image: 'https://randomuser.me/api/portraits/women/90.jpg',
    },
    date: '2025-04-11',
    likes: 15,
    isAnonymous: false,
  },
];

export default function ForumPostPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [comments, setComments] = useState(mockComments);
  const [newComment, setNewComment] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const newCommentObj = {
      id: `c${Date.now()}`,
      content: newComment,
      author: {
        id: 'currentUser',
        name: isAnonymous ? 'Anonymous' : 'Current User',
        image: isAnonymous ? '' : 'https://randomuser.me/api/portraits/men/88.jpg',
      },
      date: new Date().toISOString().split('T')[0],
      likes: 0,
      isAnonymous,
    };

    setComments([...comments, newCommentObj]);
    setNewComment('');
    setIsAnonymous(false);
  };

  const handleLikeComment = (commentId: string) => {
    setComments(
      comments.map((comment) =>
        comment.id === commentId
          ? { ...comment, likes: comment.likes + 1 }
          : comment
      )
    );
  };

  return (
    <div className="container py-8">
      <Button variant="ghost" className="mb-4" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Forums
      </Button>

      <Card className="mb-8">
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <CardTitle className="text-2xl">{mockPost.title}</CardTitle>
              <div className="mt-2 flex flex-wrap gap-2">
                {mockPost.tags.map((tag) => (
>>>>>>> 74cd30c896a8e1e9599f3de47b7f74e6835a58ba
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
<<<<<<< HEAD
            <Badge variant="outline" className="capitalize">
              {post.category}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <p className="mb-4 whitespace-pre-line">{post.content}</p>
          </div>
          <div className="flex items-center gap-4">
            <Avatar>
              {post.isAnonymous ? (
                <AvatarFallback>A</AvatarFallback>
              ) : (
                <>
                  <AvatarImage src={post.authorImage} alt={post.author} />
                  <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                </>
              )}
            </Avatar>
            <div>
              <p className="font-medium">{post.author}</p>
              <p className="text-sm text-muted-foreground">Posted on {post.date}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t px-6 py-4">
          <div className="flex gap-6">
            <Button variant="ghost" size="sm" onClick={handleLikePost} className="gap-2">
              <ThumbsUp className="h-4 w-4" />
              <span>{postLikes} likes</span>
            </Button>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MessageSquare className="h-4 w-4" />
              <span>{comments.length} replies</span>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="gap-2">
            <Flag className="h-4 w-4" />
            <span>Report</span>
          </Button>
        </CardFooter>
      </Card>

      <div className="mb-8">
        <h2 className="mb-4 text-xl font-bold">Replies ({comments.length})</h2>
        {comments.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-2 text-lg font-medium">No replies yet</p>
              <p className="text-muted-foreground">Be the first to reply to this post</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <Card key={comment.id} className="border-l-4 border-l-primary">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar>
                      {comment.isAnonymous ? (
                        <AvatarFallback>A</AvatarFallback>
                      ) : (
                        <>
                          <AvatarImage src={comment.authorImage} alt={comment.author} />
                          <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
                        </>
                      )}
                    </Avatar>
                    <div>
                      <p className="font-medium">{comment.author}</p>
                      <p className="text-sm text-muted-foreground">Replied on {comment.date}</p>
                    </div>
                  </div>
                  <div className="mb-4 pl-12">
                    <p className="mb-4 whitespace-pre-line">{comment.content}</p>
                  </div>
                  <div className="flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLikeComment(comment.id)}
                      className="gap-2"
                    >
                      <ThumbsUp className="h-4 w-4" />
                      <span>{commentLikes[comment.id] || 0}</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="mb-4 text-xl font-bold">Leave a reply</h2>
        <form onSubmit={handleSubmitComment}>
          <Textarea
            placeholder="Write your reply here..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="mb-4 min-h-32"
          />
          <div className="mb-4 rounded-lg border p-4 bg-muted/50">
            <div className="flex items-center space-x-2 mb-2">
              <Checkbox
                id="anonymous"
                checked={isAnonymous}
                onCheckedChange={(checked) => setIsAnonymous(checked === true)}
              />
              <Label htmlFor="anonymous" className="font-medium">Post anonymously</Label>
            </div>
            <p className="text-sm text-muted-foreground ml-6">
              When you post anonymously, your name and profile information will not be visible to other users.
              This can be helpful when discussing sensitive topics or asking personal questions.
            </p>
          </div>
          <Button type="submit" className="gap-2">
            <Send className="h-4 w-4" />
            Post Reply
          </Button>
        </form>
=======
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Flag className="mr-2 h-4 w-4" />
                Report
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="mb-6 whitespace-pre-line">{mockPost.content}</p>
          <div className="flex items-center gap-4">
            {!mockPost.isAnonymous ? (
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src={mockPost.author.image} alt={mockPost.author.name} />
                  <AvatarFallback>{mockPost.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{mockPost.author.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Posted {formatDistanceToNow(new Date(mockPost.date), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarFallback>A</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">Anonymous</p>
                  <p className="text-xs text-muted-foreground">
                    Posted {formatDistanceToNow(new Date(mockPost.date), { addSuffix: true })}
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t p-4">
          <div className="flex gap-4">
            <Button variant="ghost" size="sm" className="gap-2">
              <ThumbsUp className="h-4 w-4" />
              <span>{mockPost.likes}</span>
            </Button>
            <Button variant="ghost" size="sm" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              <span>{comments.length}</span>
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm">
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>

      <h2 className="mb-4 text-xl font-bold">Comments ({comments.length})</h2>

      <Card className="mb-8">
        <CardContent className="p-4">
          <Textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="mb-4"
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="anonymous"
                checked={isAnonymous}
                onChange={() => setIsAnonymous(!isAnonymous)}
                className="h-4 w-4 rounded border-gray-300"
              />
              <label htmlFor="anonymous" className="text-sm">
                Post anonymously
              </label>
            </div>
            <Button onClick={handleAddComment}>Post Comment</Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {comments.map((comment) => (
          <Card key={comment.id}>
            <CardContent className="p-4">
              <p className="mb-4">{comment.content}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {!comment.isAnonymous ? (
                    <>
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={comment.author.image} alt={comment.author.name} />
                        <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{comment.author.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(comment.date), { addSuffix: true })}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>A</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">Anonymous</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(comment.date), { addSuffix: true })}
                        </p>
                      </div>
                    </>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2"
                  onClick={() => handleLikeComment(comment.id)}
                >
                  <ThumbsUp className="h-4 w-4" />
                  <span>{comment.likes}</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
>>>>>>> 74cd30c896a8e1e9599f3de47b7f74e6835a58ba
      </div>
    </div>
  );
}

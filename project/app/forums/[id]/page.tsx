'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThumbsUp, MessageSquare, Flag, ArrowLeft, Send, Share2, Edit, Trash2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { formatDistanceToNow } from 'date-fns';

// Mock post data for fallback
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

export default function PostDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [postLikes, setPostLikes] = useState(0);
  const [commentLikes, setCommentLikes] = useState<Record<string, number>>({});
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
        setPost(mockPost);
        setPostLikes(mockPost.likes);
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

  const handleLikeComment = (commentId: string) => {
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
      <Button variant="ghost" className="mb-4" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Forums
      </Button>

      <Card className="mb-8">
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <CardTitle className="text-2xl">{post.title}</CardTitle>
              <div className="mt-2 flex flex-wrap gap-2">
                {post.tags.map((tag: string) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
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
          <p className="mb-6 whitespace-pre-line">{post.content}</p>
          <div className="flex items-center gap-4">
            {!post.isAnonymous ? (
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src={post.author.image} alt={post.author.name} />
                  <AvatarFallback>{post.author.name?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{post.author.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Posted {formatDistanceToNow(new Date(post.date), { addSuffix: true })}
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
                    Posted {formatDistanceToNow(new Date(post.date), { addSuffix: true })}
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t p-4">
          <div className="flex gap-4">
            <Button variant="ghost" size="sm" className="gap-2" onClick={handleLikePost}>
              <ThumbsUp className="h-4 w-4" />
              <span>{postLikes}</span>
            </Button>
            <Button variant="ghost" size="sm" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              <span>{comments.length}</span>
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
              <Checkbox
                id="anonymous"
                checked={isAnonymous}
                onCheckedChange={(checked) => setIsAnonymous(checked === true)}
              />
              <Label htmlFor="anonymous">Post anonymously</Label>
            </div>
            <Button onClick={handleSubmitComment}>Post Comment</Button>
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
                        <AvatarFallback>{comment.author.name?.charAt(0) || 'U'}</AvatarFallback>
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
                  <span>{commentLikes[comment.id] || comment.likes || 0}</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

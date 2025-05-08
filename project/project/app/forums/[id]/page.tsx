'use client';

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
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
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
      </div>
    </div>
  );
}

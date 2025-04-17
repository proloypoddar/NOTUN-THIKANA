'use client';

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
      </div>
    </div>
  );
}

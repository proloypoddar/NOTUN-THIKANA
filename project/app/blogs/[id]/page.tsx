'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Heart, Share2, Calendar, Clock, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useSession } from 'next-auth/react';
import { useToast } from '@/hooks/use-toast';

interface BlogDetail {
  _id: string;
  image: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  date: string;
  readTime: string;
  likes: number;
  tags?: string[];
}

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const { toast } = useToast();
  const [blog, setBlog] = useState<BlogDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);

  useEffect(() => {
    const fetchBlogDetail = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/blogs/${params.id}`);
        
        if (!res.ok) {
          throw new Error('Failed to fetch blog');
        }
        
        const data = await res.json();
        setBlog(data);
        setLikeCount(data.likes);
        
        // Fetch related posts (same category)
        const relatedRes = await fetch(`/api/blogs?category=${data.category}&limit=3`);
        if (relatedRes.ok) {
          const relatedData = await relatedRes.json();
          // Filter out the current blog
          setRelatedPosts(relatedData.filter((post: any) => post._id !== data._id).slice(0, 3));
        }
      } catch (error) {
        console.error('Error fetching blog:', error);
        toast({
          title: "Error",
          description: "Failed to load blog post. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchBlogDetail();
    }
  }, [params.id, toast]);

  const handleLike = async () => {
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to like posts",
        variant: "destructive",
      });
      return;
    }

    try {
      const increment = isLiked ? -1 : 1;
      const response = await fetch(`/api/blogs/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ increment }),
      });

      if (response.ok) {
        setLikeCount(prev => prev + increment);
        setIsLiked(!isLiked);
      } else {
        throw new Error('Failed to update like');
      }
    } catch (error) {
      console.error('Error updating like:', error);
      toast({
        title: "Error",
        description: "Failed to update like. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: blog?.title,
        text: blog?.excerpt,
        url: window.location.href,
      })
      .catch((error) => console.error('Error sharing:', error));
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "Blog post link copied to clipboard",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="h-8 bg-muted rounded w-24 mb-8 animate-pulse" />
          <div className="h-12 bg-muted rounded w-3/4 mb-6 animate-pulse" />
          <div className="h-6 bg-muted rounded w-1/2 mb-8 animate-pulse" />
          <div className="h-[400px] bg-muted rounded-lg mb-8 animate-pulse" />
          <div className="space-y-4">
            <div className="h-4 bg-muted rounded w-full animate-pulse" />
            <div className="h-4 bg-muted rounded w-full animate-pulse" />
            <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Blog post not found</h1>
        <p className="mb-6">The blog post you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link href="/blogs">Back to Blogs</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          className="mb-6" 
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Blogs
        </Button>

        {/* Category */}
        <div className="mb-4">
          <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
            {blog.category}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{blog.title}</h1>

        {/* Author and Meta */}
        <div className="flex flex-wrap items-center gap-6 mb-8">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={blog.author.avatar} alt={blog.author.name} />
              <AvatarFallback>{blog.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-sm">{blog.author.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-muted-foreground text-sm">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{new Date(blog.date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{blog.readTime}</span>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="relative h-[400px] w-full mb-8 rounded-lg overflow-hidden">
          <Image
            src={blog.image}
            alt={blog.title}
            fill
            className="object-cover"
          />
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none mb-8">
          <p className="text-lg font-medium mb-4">{blog.excerpt}</p>
          <div dangerouslySetInnerHTML={{ __html: blog.content }} />
        </div>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {blog.tags.map((tag, index) => (
              <div key={index} className="flex items-center gap-1 bg-muted px-3 py-1 rounded-full text-sm">
                <Tag className="h-3 w-3" />
                <span>{tag}</span>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between border-t border-b py-4 mb-8">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleLike}
            className="flex items-center gap-2"
          >
            <Heart className={`h-5 w-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
            <span>{likeCount} likes</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleShare}
            className="flex items-center gap-2"
          >
            <Share2 className="h-5 w-5" />
            <span>Share</span>
          </Button>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((post) => (
                <Card key={post._id} className="overflow-hidden">
                  <div className="relative h-40 w-full">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="pt-4">
                    <Link href={`/blogs/${post._id}`}>
                      <h3 className="font-semibold line-clamp-2 hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                    </Link>
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                      {post.excerpt}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import { useToast } from '@/hooks/use-toast';

interface BlogCardProps {
  _id: string;
  image: string;
  title: string;
  category: string;
  excerpt: string;
  author: {
    name: string;
    avatar: string;
  };
  likes: number;
}

const BlogCard: React.FC<BlogCardProps> = ({ 
  _id, 
  image, 
  title, 
  category, 
  excerpt, 
  author, 
  likes 
}) => {
  const [likeCount, setLikeCount] = useState<number>(likes);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const { data: session } = useSession();
  const { toast } = useToast();

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
      const response = await fetch(`/api/blogs/${_id}`, {
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

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative h-48 w-full">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
        />
        <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 text-xs rounded">
          {category}
        </div>
      </div>
      <CardContent className="pt-4 flex-grow">
        <Link href={`/blogs/${_id}`}>
          <h3 className="text-lg font-semibold line-clamp-2 hover:text-primary transition-colors">
            {title}
          </h3>
        </Link>
        <p className="text-muted-foreground text-sm mt-2 line-clamp-3">
          {excerpt}
        </p>
        <div className="flex items-center mt-4 gap-2">
          <Image
            src={author.avatar}
            alt={author.name}
            width={24}
            height={24}
            className="rounded-full"
          />
          <span className="text-sm">{author.name}</span>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4 flex justify-between">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleLike}
          className="flex items-center gap-1"
        >
          <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
          <span>{likeCount}</span>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link href={`/blogs/${_id}`}>
            Read More
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BlogCard;

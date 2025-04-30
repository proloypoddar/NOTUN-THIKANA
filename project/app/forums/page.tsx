'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  Search,
  Filter,
  MessageSquare,
  Heart,
  Clock,
  Plus,
  Layers,
  Home,
  Lightbulb,
  Users,
  Gavel,
  Star,
  Truck,
  ThumbsUp,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from "@/components/ui/badge";
import { useSession } from 'next-auth/react';
import { useToast } from '@/hooks/use-toast';

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  authorImage?: string;
  date: string;
  category: string;
  replies: number;
  views: number;
  likes: number;
  isAnonymous: boolean;
  tags: string[];
}

export default function ForumsPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("latest");
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // New post form state
  const [showPostDialog, setShowPostDialog] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');

  const categories = [
    {
      id: "all",
      name: "All Topics",
      icon: Layers,
      count: 927,
    },
    {
      id: "housing",
      name: "Housing",
      icon: Home,
      count: 245,
    },
    {
      id: "education",
      name: "Education",
      icon: Lightbulb,
      count: 189,
    },
    {
      id: "lifestyle",
      name: "Lifestyle",
      icon: Users,
      count: 132,
    },
    {
      id: "safety",
      name: "Safety",
      icon: Gavel,
      count: 98,
    },
  ];

  const trendingTopics = [
    "Newcomer advice",
    "Housing recommendations",
    "Language classes",
    "Community events",
    "Safety tips",
  ];

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/forums');
        if (!response.ok) {
          throw new Error('Failed to fetch forum posts');
        }

        const data = await response.json();
        setPosts(data);
      } catch (err) {
        console.error('Error fetching forum posts:', err);
        setError('Failed to load forum posts. Please try again later.');
        // Use sample data as fallback
        setPosts([
          {
            id: "1",
            title: "Best areas for newcomers?",
            content: "I'm moving to the city next month. Which areas would you recommend for young professionals?",
            author: "Sarah K.",
            authorImage: "https://randomuser.me/api/portraits/women/44.jpg",
            date: "2025-04-10",
            category: "housing",
            replies: 3,
            views: 234,
            likes: 45,
            isAnonymous: false,
            tags: ["newcomer", "housing", "advice"]
          },
          {
            id: "2",
            title: "Affordable language classes?",
            content: "I recently moved here and I'm looking for affordable language classes to improve my English.",
            author: "Carlos M.",
            authorImage: "https://randomuser.me/api/portraits/men/32.jpg",
            date: "2025-04-08",
            category: "education",
            replies: 2,
            views: 156,
            likes: 32,
            isAnonymous: false,
            tags: ["language", "education", "english"]
          },
          {
            id: "3",
            title: "Safety concerns in Eastern District",
            content: "I've noticed some suspicious activity in the Eastern District lately. Has anyone else experienced this? What are the local authorities doing about it?",
            author: "Ahmed J.",
            authorImage: "https://randomuser.me/api/portraits/men/67.jpg",
            date: "2025-04-07",
            category: "safety",
            replies: 8,
            views: 312,
            likes: 67,
            isAnonymous: false,
            tags: ["safety", "eastern district", "community"]
          },
          {
            id: "4",
            title: "Weekend cultural activities",
            content: "Looking for recommendations on cultural activities to do this weekend. Any interesting exhibitions, performances or community events?",
            author: "Maria L.",
            authorImage: "https://randomuser.me/api/portraits/women/22.jpg",
            date: "2025-04-05",
            category: "lifestyle",
            replies: 5,
            views: 178,
            likes: 29,
            isAnonymous: false,
            tags: ["culture", "weekend", "events"]
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    // Filter posts based on search query and active category
    let filtered = [...posts];

    // Filter by category
    if (activeCategory !== "all") {
      filtered = filtered.filter(post => post.category === activeCategory);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query) ||
        post.tags.some((tag: string) => tag.toLowerCase().includes(query))
      );
    }

    // Sort posts
    if (sortBy === "latest") {
      filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (sortBy === "popular") {
      filtered.sort((a, b) => b.likes - a.likes);
    } else if (sortBy === "most_replies") {
      filtered.sort((a, b) => b.replies - a.replies);
    }

    setFilteredPosts(filtered);
  }, [searchQuery, activeCategory, sortBy, posts]);

  const handleCreatePost = async () => {
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create a post",
        variant: "destructive",
      });
      return;
    }

    if (!title.trim() || !content.trim() || !category) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      // In a real app, you would send this to your API
      // const res = await fetch('/api/forums', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     title,
      //     content,
      //     category,
      //     tags: tags.split(',').map(tag => tag.trim()),
      //     author: session.user.name,
      //     authorImage: session.user.image || '',
      //   }),
      // });

      // Mock successful post creation
      const newPost: Post = {
        id: Date.now().toString(),
        title,
        content,
        category,
        author: session.user?.name || 'Anonymous',
        authorImage: session.user?.image || 'https://randomuser.me/api/portraits/lego/1.jpg',
        date: new Date().toISOString().split('T')[0],
        replies: 0,
        views: 0,
        likes: 0,
        isAnonymous: false,
        tags: tags.split(',').map(tag => tag.trim()),
      };

      setPosts([newPost, ...posts]);

      toast({
        title: "Post created",
        description: "Your post has been published successfully",
      });

      setShowPostDialog(false);
      setTitle('');
      setContent('');
      setCategory('');
      setTags('');
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container py-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Community Forums</h1>
          <p className="text-muted-foreground">Join the conversation</p>
        </div>
        <Dialog open={showPostDialog} onOpenChange={setShowPostDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Post
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create a New Post</DialogTitle>
              <DialogDescription>
                Share your thoughts, questions, or experiences with the community.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter a descriptive title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.slice(1).map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  placeholder="Write your post content here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="resize-none"
                  rows={6}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  placeholder="housing, advice, newcomer"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowPostDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreatePost}>
                Publish Post
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="lg:w-8/12">
          <div className="mb-8 flex flex-col gap-4 md:flex-row">
            <div className="relative md:max-w-xs w-full">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search discussions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">Latest</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="most_replies">Most Replies</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Tabs defaultValue="all" className="mb-8" value={activeCategory} onValueChange={setActiveCategory}>
            <TabsList>
              <TabsTrigger value="all">All Topics</TabsTrigger>
              <TabsTrigger value="housing">Housing</TabsTrigger>
              <TabsTrigger value="safety">Safety</TabsTrigger>
              <TabsTrigger value="lifestyle">Lifestyle</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
            </TabsList>
          </Tabs>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 rounded-full bg-muted" />
                      <div className="space-y-2">
                        <div className="h-4 w-24 bg-muted rounded" />
                        <div className="h-3 w-16 bg-muted rounded" />
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="h-5 w-3/4 bg-muted rounded" />
                      <div className="h-4 w-full bg-muted rounded" />
                      <div className="h-4 w-full bg-muted rounded" />
                      <div className="h-4 w-2/3 bg-muted rounded" />
                    </div>
                    <div className="flex justify-between">
                      <div className="h-4 w-20 bg-muted rounded" />
                      <div className="h-4 w-20 bg-muted rounded" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="mt-16 text-center">
              <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg font-medium">No posts found</p>
              <p className="text-muted-foreground mb-6">
                {searchQuery
                  ? "No posts match your search criteria"
                  : "Be the first to start a discussion in this category"}
              </p>
              <Button onClick={() => setShowPostDialog(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Post
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPosts.map((post) => (
                <Card key={post.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        {post.authorImage ? (
                          <Avatar>
                            <AvatarImage src={post.authorImage} alt={post.author} />
                            <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                          </Avatar>
                        ) : (
                          <Avatar>
                            <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                          </Avatar>
                        )}
                        <div>
                          <CardTitle className="mb-1">
                            <Link href={`/forums/${post.id}`} className="hover:text-primary transition-colors">
                              {post.title}
                            </Link>
                          </CardTitle>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{post.isAnonymous ? 'Anonymous' : post.author}</span>
                            <span>•</span>
                            <span>{new Date(post.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        {categories.find(cat => cat.id === post.category)?.name || post.category}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">{post.content}</p>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => setSearchQuery(tag)}>
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="flex gap-6">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MessageSquare className="h-4 w-4" />
                        <span>{post.replies} replies</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Eye className="h-4 w-4" />
                        <span>{post.views} views</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <ThumbsUp className="h-4 w-4" />
                        <span>{post.likes} likes</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/forums/${post.id}`}>Reply</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:w-4/12 space-y-6">
          {/* Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-2">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-left hover:bg-muted transition-colors ${
                        activeCategory === category.id ? "bg-primary/10 text-primary" : ""
                      }`}
                      onClick={() => setActiveCategory(category.id)}
                    >
                      <div className="flex items-center">
                        <Icon className="mr-3 h-4 w-4" />
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <span className="text-xs bg-muted px-2 py-1 rounded-full">
                        {category.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Trending Topics */}
          <Card>
            <CardHeader>
              <CardTitle>Trending Topics</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-2">
                {trendingTopics.map((topic, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-2 hover:bg-muted rounded-lg cursor-pointer"
                    onClick={() => setSearchQuery(topic)}
                  >
                    <div className="flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary text-xs">
                      {index + 1}
                    </div>
                    <span className="text-sm">{topic}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Community Guidelines */}
          <Card>
            <CardHeader>
              <CardTitle>Community Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-1" />
                  <span>Be respectful and considerate of others</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-1" />
                  <span>Stay on topic and provide relevant information</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-1" />
                  <span>No spam, advertising, or self-promotion</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-1" />
                  <span>Protect personal information and privacy</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-1" />
                  <span>Report inappropriate content to moderators</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
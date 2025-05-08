'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BlogCard from '@/components/blog/BlogCard';

interface Blog {
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
  date: string;
  readTime: string;
}

interface FeaturedPost {
  image: string;
  title: string;
  author: string;
  date: string;
  readTime: string;
  excerpt: string;
  _id: string;
}

export default function BlogsPage() {
  const router = useRouter();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [featuredPost, setFeaturedPost] = useState<FeaturedPost | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'Interior Design', name: 'Interior Design' },
    { id: 'Real Estate', name: 'Real Estate' },
    { id: 'Architecture', name: 'Architecture' },
    { id: 'Home Improvement', name: 'Home Improvement' },
    { id: 'Urban Living', name: 'Urban Living' },
  ];

  const popularPosts = [
    {
      title: 'Top 10 Neighborhoods for Young Professionals in 2025',
      image: 'https://public.readdy.ai/ai/img_res/0d9cfa6e61ab7947d7b458d211381d2e.jpg',
      views: '15.2K',
    },
    {
      title: 'How to Negotiate Rent in a Competitive Market',
      image: 'https://public.readdy.ai/ai/img_res/3a9d0e5f8c7b6d2a1e4f5c8d7a9b3c6.jpg',
      views: '12.8K',
    },
    {
      title: 'Sustainable Living: Eco-Friendly Apartment Upgrades',
      image: 'https://public.readdy.ai/ai/img_res/7c8b9a6d5e4f3c2b1a0d9e8f7c6b5a4.jpg',
      views: '10.5K',
    },
  ];

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setIsLoading(true);
        // Fetch featured post
        const featuredRes = await fetch('/api/blogs?featured=true&limit=1');
        if (featuredRes.ok) {
          const featuredData = await featuredRes.json();
          if (featuredData.length > 0) {
            setFeaturedPost(featuredData[0]);
          }
        }

        // Fetch all blogs
        const res = await fetch('/api/blogs');
        if (!res.ok) {
          throw new Error('Failed to fetch blogs');
        }
        const data = await res.json();
        setBlogs(data);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // If no featured post is found, use the first blog post as featured
  useEffect(() => {
    if (!featuredPost && blogs.length > 0) {
      const firstBlog = blogs[0];
      setFeaturedPost({
        _id: firstBlog._id,
        image: firstBlog.image,
        title: firstBlog.title,
        author: firstBlog.author.name,
        date: new Date(firstBlog.date).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
        readTime: firstBlog.readTime,
        excerpt: firstBlog.excerpt
      });
    }
  }, [blogs, featuredPost]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Filter blogs by search query
    // This would typically be handled by the API, but we're doing it client-side for simplicity
  };

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = searchQuery 
      ? blog.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    
    const matchesCategory = activeCategory === 'all' || blog.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 pt-8 pb-16">
        {/* Search Bar */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
            <Input
              type="text"
              placeholder="Search blog posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </form>
        </div>

        {/* Featured Post */}
        {featuredPost && (
          <div className="mb-12 bg-card rounded-xl overflow-hidden shadow-md">
            <div className="relative h-[400px]">
              <Image
                src={featuredPost.image}
                alt={featuredPost.title}
                fill
                className="object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-8">
                <div className="text-white">
                  <h1 className="text-3xl md:text-4xl font-bold mb-4">
                    {featuredPost.title}
                  </h1>
                  <div className="flex items-center space-x-4 mb-2">
                    <span>{featuredPost.author}</span>
                    <span>•</span>
                    <span>{featuredPost.date}</span>
                    <span>•</span>
                    <span>{featuredPost.readTime}</span>
                  </div>
                  <p className="text-gray-200 mb-4 line-clamp-2">{featuredPost.excerpt}</p>
                  <Button 
                    variant="secondary" 
                    onClick={() => router.push(`/blogs/${featuredPost._id}`)}
                  >
                    Read More
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="lg:w-2/3">
            <Tabs defaultValue="all" onValueChange={setActiveCategory}>
              <TabsList className="mb-6">
                {categories.map(category => (
                  <TabsTrigger key={category.id} value={category.id}>
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              <TabsContent value={activeCategory}>
                {isLoading ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                      <Card key={i} className="h-[350px] animate-pulse">
                        <div className="h-48 bg-muted rounded-t-lg" />
                        <CardContent className="pt-4">
                          <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                          <div className="h-4 bg-muted rounded w-1/2 mb-4" />
                          <div className="h-4 bg-muted rounded w-full mb-2" />
                          <div className="h-4 bg-muted rounded w-full mb-2" />
                          <div className="h-4 bg-muted rounded w-2/3" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : filteredBlogs.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredBlogs.map((blog) => (
                      <BlogCard
                        key={blog._id}
                        _id={blog._id}
                        image={blog.image}
                        title={blog.title}
                        category={blog.category}
                        excerpt={blog.excerpt}
                        author={blog.author}
                        likes={blog.likes}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <h3 className="text-xl font-semibold mb-2">No blog posts found</h3>
                    <p className="text-muted-foreground">
                      Try adjusting your search or filter criteria
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3 space-y-8">
            {/* Popular Posts */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-4">Popular Posts</h3>
                <div className="space-y-4">
                  {popularPosts.map((post, index) => (
                    <div key={index} className="flex gap-3 group cursor-pointer">
                      <div className="relative h-16 w-16 flex-shrink-0">
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-2">
                          {post.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {post.views} views
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Categories */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories.slice(1).map((category) => (
                    <div 
                      key={category.id}
                      className="flex justify-between items-center p-2 hover:bg-muted rounded-md cursor-pointer"
                      onClick={() => setActiveCategory(category.id)}
                    >
                      <span>{category.name}</span>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        {blogs.filter(blog => blog.category === category.id).length}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Subscribe */}
            <Card className="bg-primary text-primary-foreground">
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-2">Subscribe to Our Newsletter</h3>
                <p className="text-primary-foreground/80 mb-4">
                  Get the latest posts and updates delivered to your inbox.
                </p>
                <form className="space-y-2">
                  <Input 
                    type="email" 
                    placeholder="Your email address" 
                    className="bg-primary-foreground text-foreground"
                  />
                  <Button className="w-full bg-background text-foreground hover:bg-background/90">
                    Subscribe
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

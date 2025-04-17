import { NextResponse } from 'next/server';
import { getForumPosts } from '@/lib/mock';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    
    let posts = getForumPosts();
    
    // Filter by category if provided
    if (category && category !== 'all') {
      posts = posts.filter(post => post.category === category);
    }
    
    // Search by title or content if provided
    if (search) {
      const searchLower = search.toLowerCase();
      posts = posts.filter(post => 
        post.title.toLowerCase().includes(searchLower) || 
        post.content.toLowerCase().includes(searchLower)
      );
    }
    
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching forum posts:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

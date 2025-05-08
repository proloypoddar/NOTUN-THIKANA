import { NextResponse } from 'next/server';
import { mockBlogs } from '@/lib/mock/blogs';

// GET /api/mock-blogs - Get all blogs or a specific blog
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const category = searchParams.get('category');
    const featured = searchParams.get('featured') === 'true';
    const limit = parseInt(searchParams.get('limit') || '10');

    // If ID is provided, return a specific blog
    if (id) {
      const blog = mockBlogs.find(blog => blog._id === id);
      if (!blog) {
        return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
      }
      return NextResponse.json(blog);
    }

    // Filter blogs based on query parameters
    let filteredBlogs = [...mockBlogs];

    if (category && category !== 'all') {
      filteredBlogs = filteredBlogs.filter(blog => blog.category === category);
    }

    if (featured) {
      filteredBlogs = filteredBlogs.filter(blog => blog.featured);
    }

    // Sort by date (newest first)
    filteredBlogs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Apply limit
    if (limit && limit > 0) {
      filteredBlogs = filteredBlogs.slice(0, limit);
    }

    return NextResponse.json(filteredBlogs);
  } catch (error) {
    console.error('Error fetching mock blogs:', error);
    return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
  }
}

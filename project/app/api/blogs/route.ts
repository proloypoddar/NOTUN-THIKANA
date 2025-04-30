import { NextResponse } from 'next/server';
import { Blog } from '@/lib/db/models/Blog';
import dbConnect from '@/lib/db/connect';
import { mockBlogs } from '@/lib/mock/blogs';

// GET /api/blogs - Get all blogs or a specific blog
export async function GET(req: Request) {
  try {
    // Use mock data instead of connecting to the database
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

    if (category) {
      filteredBlogs = filteredBlogs.filter(blog => blog.category.toLowerCase() === category.toLowerCase());
    }

    if (featured) {
      filteredBlogs = filteredBlogs.filter(blog => blog.featured === true);
    }

    // Sort by date (newest first)
    filteredBlogs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Apply limit
    const limitedBlogs = filteredBlogs.slice(0, limit);

    return NextResponse.json(limitedBlogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
  }
}

// POST /api/blogs - Create a new blog
export async function POST(req: Request) {
  try {
    await dbConnect();

    const data = await req.json();

    // Validate required fields
    const { title, image, category, excerpt, content, author, readTime } = data;

    if (!title || !image || !category || !excerpt || !content || !author || !readTime) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newBlog = await Blog.create(data);
    return NextResponse.json(newBlog, { status: 201 });
  } catch (error) {
    console.error('Error creating blog:', error);
    return NextResponse.json({ error: 'Failed to create blog' }, { status: 500 });
  }
}

// PUT /api/blogs - Update a blog
export async function PUT(req: Request) {
  try {
    await dbConnect();

    const { id, ...updateData } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'Blog ID is required' }, { status: 400 });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedBlog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    return NextResponse.json(updatedBlog);
  } catch (error) {
    console.error('Error updating blog:', error);
    return NextResponse.json({ error: 'Failed to update blog' }, { status: 500 });
  }
}

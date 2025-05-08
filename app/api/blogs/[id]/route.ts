import { NextResponse } from 'next/server';
import { Blog } from '@/lib/db/models/Blog';
import dbConnect from '@/lib/db/connect';
import mongoose from 'mongoose';
import { mockBlogs } from '@/lib/mock/blogs';

// GET /api/blogs/[id] - Get a specific blog
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    // Use mock data instead of connecting to the database
    const blog = mockBlogs.find(blog => blog._id === id);

    if (!blog) {
      return new NextResponse("Blog not found", { status: 404 });
    }

    return NextResponse.json(blog);
  } catch (error) {
    console.error("Error fetching blog data:", error);
    return new NextResponse("Server Error", { status: 500 });
  }
}

// PATCH /api/blogs/[id] - Update likes for a blog
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const { increment } = await request.json();

    // Find the blog in our mock data
    const blogIndex = mockBlogs.findIndex(blog => blog._id === id);

    if (blogIndex === -1) {
      return new NextResponse("Blog not found", { status: 404 });
    }

    // Update the likes count
    mockBlogs[blogIndex].likes += increment;

    // Return the updated blog
    return NextResponse.json(mockBlogs[blogIndex]);
  } catch (error) {
    console.error("Error updating blog:", error);
    return new NextResponse("Failed to update blog", { status: 500 });
  }
}

// DELETE /api/blogs/[id] - Delete a blog
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    // Find the blog in our mock data
    const blogIndex = mockBlogs.findIndex(blog => blog._id === id);

    if (blogIndex === -1) {
      return new NextResponse("Blog not found", { status: 404 });
    }

    // Remove the blog from our mock data
    mockBlogs.splice(blogIndex, 1);

    return new NextResponse("Blog deleted successfully", { status: 200 });
  } catch (error) {
    console.error("Error deleting blog:", error);
    return new NextResponse("Failed to delete blog", { status: 500 });
  }
}

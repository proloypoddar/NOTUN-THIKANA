import { NextResponse } from 'next/server';
import { getForumPostById } from '@/lib/mock';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    const post = getForumPostById(id);
    
    if (!post) {
      return NextResponse.json(
        { message: 'Forum post not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching forum post details:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

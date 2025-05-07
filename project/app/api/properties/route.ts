import { NextResponse } from 'next/server';
import { getProperties } from '@/lib/mock';

// Make this route static for Vercel deployment
export const dynamic = 'force-static';

export async function GET() {
  try {
    // Return all properties without filtering
    const properties = getProperties();
    return NextResponse.json(properties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

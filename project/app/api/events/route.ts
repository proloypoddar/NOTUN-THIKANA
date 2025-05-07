import { NextResponse } from 'next/server';
import { getEvents } from '@/lib/mock';

// Make this route static for Vercel deployment
export const dynamic = 'force-static';

export async function GET() {
  try {
    // Return all events without filtering
    const events = getEvents();
    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { getEvents } from '@/lib/mock';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    
    let events = getEvents();
    
    // Filter by category if provided
    if (category && category !== 'all') {
      events = events.filter(event => event.category === category);
    }
    
    // Search by title or description if provided
    if (search) {
      const searchLower = search.toLowerCase();
      events = events.filter(event => 
        event.title.toLowerCase().includes(searchLower) || 
        event.description.toLowerCase().includes(searchLower) ||
        event.location.toLowerCase().includes(searchLower)
      );
    }
    
    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

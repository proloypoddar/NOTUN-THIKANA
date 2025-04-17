import { NextResponse } from 'next/server';
import { getServices } from '@/lib/mock';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    let services = getServices();

    // Filter by category if provided
    if (category && category !== 'all') {
      services = services.filter(service => service.category === category);
    }

    // Search by name or description if provided
    if (search) {
      const searchLower = search.toLowerCase();
      services = services.filter(service =>
        service.name.toLowerCase().includes(searchLower) ||
        service.description.toLowerCase().includes(searchLower)
      );
    }

    return NextResponse.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { getServicesByCategory } from '@/lib/mock';

export async function GET(
  request: Request,
  { params }: { params: { category: string } }
) {
  try {
    const category = params.category;
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');

    let services = getServicesByCategory(category);

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
    console.error('Error fetching services by category:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

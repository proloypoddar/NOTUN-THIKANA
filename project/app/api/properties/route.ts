import { NextResponse } from 'next/server';
import { getProperties } from '@/lib/mock';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const bedrooms = searchParams.get('bedrooms');
    const search = searchParams.get('search');
    
    let properties = getProperties();
    
    // Filter by type if provided
    if (type && type !== 'all') {
      properties = properties.filter(property => property.type === type);
    }
    
    // Filter by price range if provided
    if (minPrice) {
      properties = properties.filter(property => property.price >= parseInt(minPrice));
    }
    
    if (maxPrice) {
      properties = properties.filter(property => property.price <= parseInt(maxPrice));
    }
    
    // Filter by bedrooms if provided
    if (bedrooms) {
      properties = properties.filter(property => property.bedrooms >= parseInt(bedrooms));
    }
    
    // Search by title, description, or address if provided
    if (search) {
      const searchLower = search.toLowerCase();
      properties = properties.filter(property => 
        property.title.toLowerCase().includes(searchLower) || 
        property.description.toLowerCase().includes(searchLower) ||
        property.address.toLowerCase().includes(searchLower)
      );
    }
    
    return NextResponse.json(properties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

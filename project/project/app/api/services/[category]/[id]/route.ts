import { NextResponse } from 'next/server';
import { getServiceById } from '@/lib/mock';

export async function GET(
  request: Request,
  { params }: { params: { category: string; id: string } }
) {
  try {
    const { id } = params;

    const service = getServiceById(id);

    if (!service) {
      return NextResponse.json(
        { message: 'Service not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(service);
  } catch (error) {
    console.error('Error fetching service details:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simplified middleware for public access
export async function middleware(request: NextRequest) {
  // Allow all requests to pass through
  return NextResponse.next();
}

// Empty matcher to avoid blocking any routes
export const config = {
  matcher: [],
};
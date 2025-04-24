import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // For deployment testing, we'll make authentication optional
  try {
    const token = await getToken({ req: request });
    const isAuthenticated = !!token;

    // Add paths that require authentication
    const protectedPaths = [
      '/messages',
      '/events/create',
      '/housing/create',
      '/forums/create',
    ];

    const isProtectedPath = protectedPaths.some(path =>
      request.nextUrl.pathname.startsWith(path)
    );

    if (isProtectedPath && !isAuthenticated) {
      // During initial deployment, we'll just continue instead of redirecting
      // to avoid potential redirect loops
      console.log('Protected path accessed without authentication');
      // Uncomment this when authentication is fully set up
      // const redirectUrl = new URL('/auth/signin', request.url);
      // redirectUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
      // return NextResponse.redirect(redirectUrl);
    }
  } catch (error) {
    console.error('Middleware error:', error);
    // Continue the request even if there's an error
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/messages/:path*',
    '/events/create',
    '/housing/create',
    '/forums/create',
  ],
};
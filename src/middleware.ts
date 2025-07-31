
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  // If token is missing, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL('/', request.url)); // Redirect to home/login page
  }

  return NextResponse.next(); // Allow access
}

// Apply this middleware only to /dashboard and nested routes
export const config = {
  matcher: ['/dashboard/:path*'],
};

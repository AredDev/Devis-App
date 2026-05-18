import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if requesting admin dashboard pages
  if (pathname.startsWith('/admin')) {
    // Exclude the login page itself to avoid redirect loops
    if (pathname === '/admin/login') {
      return NextResponse.next();
    }

    const adminSession = request.cookies.get('admin_session')?.value;

    // If not logged in, redirect to the custom login panel
    if (adminSession !== 'authenticated') {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// Intercept only admin dashboard paths
export const config = {
  matcher: ['/admin/:path*'],
};

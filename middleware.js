import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // Protected dashboard routes
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/profile') || pathname.startsWith('/settings')) {
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = '/auth/login';
      url.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(url);
    }

    // Admin-only routes
    if (pathname.startsWith('/dashboard/admin') && token.role !== 'ADMIN') {
      const url = req.nextUrl.clone();
      url.pathname = token.role === 'RIDER' ? '/dashboard/rider' : '/dashboard/traveler';
      return NextResponse.redirect(url);
    }

    // Rider-only routes
    if (pathname.startsWith('/dashboard/rider') && token.role === 'TRAVELER') {
      const url = req.nextUrl.clone();
      url.pathname = '/dashboard/traveler';
      return NextResponse.redirect(url);
    }
  }

  // Redirect logged-in users away from auth pages
  if ((pathname.startsWith('/auth/login') || pathname.startsWith('/auth/register')) && token) {
    const url = req.nextUrl.clone();
    if (token.role === 'ADMIN') url.pathname = '/dashboard/admin';
    else if (token.role === 'RIDER') url.pathname = '/dashboard/rider';
    else url.pathname = '/dashboard/traveler';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/settings/:path*',
    '/auth/login',
    '/auth/register',
  ],
};

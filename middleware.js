import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { getDashboardPath, normalizeRole } from './lib/auth-redirects';

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;
  const role = normalizeRole(token?.role);

  if (pathname.startsWith('/dashboard') || pathname.startsWith('/profile') || pathname.startsWith('/settings')) {
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = '/auth/login';
      url.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(url);
    }

    if (pathname.startsWith('/dashboard/admin') && role !== 'ADMIN') {
      const url = req.nextUrl.clone();
      url.pathname = '/forbidden';
      return NextResponse.redirect(url);
    }

    if (pathname.startsWith('/dashboard/rider') && role !== 'RIDER') {
      const url = req.nextUrl.clone();
      url.pathname = '/forbidden';
      return NextResponse.redirect(url);
    }

    if ((pathname.startsWith('/dashboard/traveler') || pathname.startsWith('/dashboard/user')) && role !== 'TRAVELER') {
      const url = req.nextUrl.clone();
      url.pathname = '/forbidden';
      return NextResponse.redirect(url);
    }
  }

  if ((pathname.startsWith('/auth/login') || pathname.startsWith('/auth/register')) && token) {
    return NextResponse.redirect(new URL(getDashboardPath(role), req.url));
  }

  if (pathname === '/dashboard' && token) {
    return NextResponse.redirect(new URL(getDashboardPath(role), req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard',
    '/dashboard/:path*',
    '/profile/:path*',
    '/settings/:path*',
    '/auth/login',
    '/auth/register',
  ],
};

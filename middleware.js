import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { getDashboardPath, normalizeRole } from './lib/auth-redirects';
import { verifyAdminToken, ADMIN_COOKIE_NAME } from './lib/admin-token';

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // 1. Dedicated Admin Route Protection (Environment-authenticated session)
  if (pathname.startsWith('/admin')) {
    const adminCookie = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const adminSession = adminCookie ? await verifyAdminToken(adminCookie) : null;

    if (pathname === '/admin/login') {
      if (adminSession) {
        return NextResponse.redirect(new URL('/admin/dashboard', req.url));
      }
      return NextResponse.next();
    }

    if (pathname === '/admin' || pathname === '/admin/') {
      if (adminSession) {
        return NextResponse.redirect(new URL('/admin/dashboard', req.url));
      }
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }

    if (!adminSession) {
      const loginUrl = new URL('/admin/login', req.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const role = normalizeRole(token?.role);

  if (pathname.startsWith('/dashboard') || pathname.startsWith('/profile') || pathname.startsWith('/settings')) {
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = '/login';
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

  if ((pathname === '/login' || pathname === '/register') && token) {
    return NextResponse.redirect(new URL(getDashboardPath(role), req.url));
  }

  if (pathname === '/dashboard' && token) {
    return NextResponse.redirect(new URL(getDashboardPath(role), req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin',
    '/admin/:path*',
    '/dashboard',
    '/dashboard/:path*',
    '/profile/:path*',
    '/settings/:path*',
    '/login',
    '/register',
  ],
};

import { NextResponse } from 'next/server';
import {
  verifyAdminCredentials,
  normalizeEmail,
  createAdminToken,
  ADMIN_COOKIE_NAME,
  TOKEN_EXPIRY_SECONDS,
  logAdminActivity,
} from '@/lib/admin-auth';
import { checkRateLimit, recordFailedAttempt, resetRateLimit } from '@/lib/rate-limit';

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, password } = body || {};

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Admin email and password are required' },
        { status: 400 }
      );
    }

    const normalized = normalizeEmail(email);

    // 1. Rate limiting check (max 5 attempts per 15 minutes)
    const rateStatus = checkRateLimit(`admin-login:${normalized}`, 5, 15 * 60 * 1000);
    if (!rateStatus.allowed) {
      return NextResponse.json(
        {
          message: `Too many login attempts. Please try again after ${rateStatus.retryAfterSeconds} seconds.`,
          retryAfter: rateStatus.retryAfterSeconds,
        },
        { status: 429 }
      );
    }

    // 2. Timing-safe verification against environment variables
    const result = verifyAdminCredentials(normalized, password);

    if (!result.success) {
      recordFailedAttempt(`admin-login:${normalized}`, 15 * 60 * 1000);
      return NextResponse.json(
        { message: 'Invalid administrator credentials' },
        { status: 401 }
      );
    }

    // 3. Reset rate limit on success
    resetRateLimit(`admin-login:${normalized}`);

    // 4. Create signed admin session token
    const token = await createAdminToken({ email: normalized });

    // 5. Audit log
    await logAdminActivity({
      adminEmail: normalized,
      action: 'ADMIN_LOGIN',
      targetType: 'SYSTEM',
      details: { timestamp: new Date().toISOString() },
      req,
    });

    // 6. Set HttpOnly session cookie
    const isProduction = process.env.NODE_ENV === 'production';
    const response = NextResponse.json({
      success: true,
      message: 'Authenticated successfully',
      redirectUrl: '/admin/dashboard',
    });

    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/',
      maxAge: TOKEN_EXPIRY_SECONDS,
    });

    return response;
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { message: 'Authentication failed due to server error' },
      { status: 500 }
    );
  }
}


import { NextResponse } from 'next/server';
import {
  ADMIN_COOKIE_NAME,
  getAdminSessionFromRequest,
  logAdminActivity,
} from '@/lib/admin-auth';

export async function POST(req) {
  try {
    const adminSession = await getAdminSessionFromRequest(req);

    if (adminSession) {
      await logAdminActivity({
        adminEmail: adminSession.email,
        action: 'ADMIN_LOGOUT',
        targetType: 'SYSTEM',
        req,
      });
    }

    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    });

    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
      expires: new Date(0),
    });

    return response;
  } catch (error) {
    console.error('Admin logout error:', error);
    return NextResponse.json(
      { message: 'Logout failed due to server error' },
      { status: 500 }
    );
  }
}


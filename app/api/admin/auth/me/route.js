import { NextResponse } from 'next/server';
import { getAdminSessionFromRequest } from '@/lib/admin-auth';

export async function GET(req) {
  try {
    const adminSession = await getAdminSessionFromRequest(req);

    if (!adminSession) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        email: adminSession.email,
        role: 'ADMIN',
      },
    });
  } catch (error) {
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}


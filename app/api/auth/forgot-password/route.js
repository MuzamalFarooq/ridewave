import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma, connectPrisma } from '@/lib/prisma';
import { sendPasswordResetEmail } from '@/lib/email';
import { nanoid } from 'nanoid';

export async function POST(request) {
  try {
    const { email } = await request.json();
    const safeEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    if (!safeEmail) {
      console.error('[auth/forgot-password] Invalid input: missing email');
      return NextResponse.json({ message: 'Email required' }, { status: 400 });
    }

    await connectPrisma();

    const user = await prisma.user.findUnique({ where: { email: safeEmail } });
    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({ message: 'If that email exists, a reset link has been sent.' });
    }

    // Delete existing tokens
    await prisma.verificationToken.deleteMany({ where: { identifier: `reset:${safeEmail}` } });

    const token = nanoid(32);
    await prisma.verificationToken.create({
      data: {
        identifier: `reset:${safeEmail}`,
        token,
        expires: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      },
    });

    sendPasswordResetEmail(safeEmail, token).catch((emailError) => {
      console.error('[auth/forgot-password] reset email send failed', emailError);
    });

    return NextResponse.json({ message: 'If that email exists, a reset link has been sent.' });
  } catch (error) {
    console.error('[auth/forgot-password] Unexpected error', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

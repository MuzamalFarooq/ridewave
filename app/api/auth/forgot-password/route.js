import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { sendPasswordResetEmail } from '@/lib/email';
import { nanoid } from 'nanoid';

export async function POST(request) {
  try {
    const { email } = await request.json();
    if (!email) return NextResponse.json({ message: 'Email required' }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({ message: 'If that email exists, a reset link has been sent.' });
    }

    // Delete existing tokens
    await prisma.verificationToken.deleteMany({ where: { identifier: `reset:${email.toLowerCase()}` } });

    const token = nanoid(32);
    await prisma.verificationToken.create({
      data: {
        identifier: `reset:${email.toLowerCase()}`,
        token,
        expires: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      },
    });

    sendPasswordResetEmail(email, token).catch(console.error);

    return NextResponse.json({ message: 'If that email exists, a reset link has been sent.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

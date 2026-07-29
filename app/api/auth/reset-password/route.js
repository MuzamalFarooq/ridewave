import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma, connectPrisma } from '@/lib/prisma';

export async function POST(request) {
  try {
    const { token, password } = await request.json();
    const safePassword = typeof password === 'string' ? password : '';
    if (!token || !safePassword || safePassword.length < 8) {
      console.error('[auth/reset-password] Invalid input: missing token or password');
      return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
    }

    await connectPrisma();

    const record = await prisma.verificationToken.findFirst({
      where: { token, identifier: { startsWith: 'reset:' }, expires: { gt: new Date() } },
    });

    if (!record) {
      return NextResponse.json({ message: 'Reset link is invalid or has expired' }, { status: 400 });
    }

    const email = record.identifier.replace('reset:', '');
    const hashedPassword = await bcrypt.hash(safePassword, 12);

    await prisma.user.update({ where: { email }, data: { password: hashedPassword } });
    await prisma.verificationToken.delete({ where: { id: record.id } });

    return NextResponse.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('[auth/reset-password] Unexpected error', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

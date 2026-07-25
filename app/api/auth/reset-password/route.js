import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(request) {
  try {
    const { token, password } = await request.json();
    if (!token || !password || password.length < 8) {
      return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
    }

    const record = await prisma.verificationToken.findFirst({
      where: { token, identifier: { startsWith: 'reset:' }, expires: { gt: new Date() } },
    });

    if (!record) {
      return NextResponse.json({ message: 'Reset link is invalid or has expired' }, { status: 400 });
    }

    const email = record.identifier.replace('reset:', '');
    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.user.update({ where: { email }, data: { password: hashedPassword } });
    await prisma.verificationToken.delete({ where: { id: record.id } });

    return NextResponse.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

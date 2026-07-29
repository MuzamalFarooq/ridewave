import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma, connectPrisma } from '@/lib/prisma';
import { sendVerificationEmail } from '@/lib/email';
import { nanoid } from 'nanoid';
import { normalizeRole } from '@/lib/auth-redirects';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, password, role, referralCode } = body || {};

    const safeName = typeof name === 'string' ? name.trim() : '';
    const safeEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    const safePassword = typeof password === 'string' ? password : '';

    if (!safeName || !safeEmail || !safePassword) {
      console.error('[auth/register] Invalid input: missing required fields', { safeName, safeEmail, hasPassword: Boolean(safePassword) });
      return NextResponse.json({ message: 'Name, email and password are required' }, { status: 400 });
    }

    if (safePassword.length < 8) {
      console.error('[auth/register] Invalid input: password too short', { email: safeEmail });
      return NextResponse.json({ message: 'Password must be at least 8 characters' }, { status: 400 });
    }

    if (!/\S+@\S+\.\S+/.test(safeEmail)) {
      console.error('[auth/register] Invalid input: malformed email', { email: safeEmail });
      return NextResponse.json({ message: 'Invalid email address' }, { status: 400 });
    }

    await connectPrisma();

    const existingUser = await prisma.user.findUnique({ where: { email: safeEmail } });
    if (existingUser) {
      console.error('[auth/register] Duplicate email detected', { email: safeEmail });
      return NextResponse.json({ message: 'An account with this email already exists' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(safePassword, 12);

    let referredById = null;
    if (referralCode) {
      const referrer = await prisma.user.findUnique({ where: { referralCode: String(referralCode).trim().toUpperCase() } });
      if (referrer) {
        referredById = referrer.id;
        await prisma.user.update({
          where: { id: referrer.id },
          data: { loyaltyPoints: { increment: 100 } },
        });
      }
    }

    const normalizedRole = normalizeRole(role);
    const user = await prisma.user.create({
      data: {
        name: safeName,
        email: safeEmail,
        phone: typeof phone === 'string' && phone.trim() ? phone.trim() : null,
        password: hashedPassword,
        role: normalizedRole,
        referralCode: nanoid(8).toUpperCase(),
        referredBy: referredById,
        profile: {
          create: {},
        },
      },
    });

    const verificationToken = nanoid(32);
    await prisma.verificationToken.create({
      data: {
        identifier: safeEmail,
        token: verificationToken,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    sendVerificationEmail(safeEmail, verificationToken).catch((emailError) => {
      console.error('[auth/register] verification email send failed', emailError);
    });

    return NextResponse.json(
      { message: 'Account created successfully', userId: user.id },
      { status: 201 }
    );
  } catch (error) {
    console.error('[auth/register] Unexpected registration error', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

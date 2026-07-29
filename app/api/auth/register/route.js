import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { sendVerificationEmail } from '@/lib/email';
import { nanoid } from 'nanoid';
import { normalizeRole } from '@/lib/auth-redirects';

export async function POST(request) {
  try {
    const { name, email, phone, password, role, referralCode } = await request.json();

    // Validate inputs
    if (!name || !email || !password) {
      return NextResponse.json({ message: 'Name, email and password are required' }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ message: 'Password must be at least 8 characters' }, { status: 400 });
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json({ message: 'Invalid email address' }, { status: 400 });
    }

    // Check existing user
    const existingUser = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existingUser) {
      return NextResponse.json({ message: 'An account with this email already exists' }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Handle referral
    let referredById = null;
    if (referralCode) {
      const referrer = await prisma.user.findUnique({ where: { referralCode } });
      if (referrer) {
        referredById = referrer.id;
        // Reward referrer with loyalty points
        await prisma.user.update({
          where: { id: referrer.id },
          data: { loyaltyPoints: { increment: 100 } },
        });
      }
    }

    const normalizedRole = normalizeRole(role);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        phone: phone || null,
        password: hashedPassword,
        role: normalizedRole,
        referralCode: nanoid(8).toUpperCase(),
        referredBy: referredById,
        profile: {
          create: {},
        },
      },
    });

    // Send verification email
    const verificationToken = nanoid(32);
    await prisma.verificationToken.create({
      data: {
        identifier: email.toLowerCase(),
        token: verificationToken,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      },
    });

    // Fire and forget email
    sendVerificationEmail(email, verificationToken).catch(console.error);

    return NextResponse.json(
      { message: 'Account created successfully', userId: user.id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

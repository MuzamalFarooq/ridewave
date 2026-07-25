import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request) {
  try {
    const { name, email, subject, message, type } = await request.json();
    if (!name || !email || !message) {
      return NextResponse.json({ message: 'Name, email, and message are required' }, { status: 400 });
    }

    // Store in database or send email notification
    const session = await auth();
    await prisma.supportTicket.create({
      data: {
        userId: session?.user?.id || null,
        name, email, subject: subject || 'General Inquiry',
        message, type: type || 'GENERAL',
        status: 'OPEN',
      },
    });

    return NextResponse.json({ success: true, message: 'Support ticket created successfully' }, { status: 201 });
  } catch (error) {
    console.error('POST /api/contact error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

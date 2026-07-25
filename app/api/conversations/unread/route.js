import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ count: 0 });
    const count = await prisma.conversation.count({
      where: {
        participants: { has: session.user.id },
        messages: { some: { isRead: false, senderId: { not: session.user.id } } },
      },
    });
    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}

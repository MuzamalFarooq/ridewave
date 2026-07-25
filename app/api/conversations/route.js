import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/conversations — List user's conversations
export async function GET(request) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const conversations = await prisma.conversation.findMany({
      where: {
        participants: { some: { userId: session.user.id } },
      },
      include: {
        participants: {
          include: { user: { select: { id: true, name: true, image: true } } },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        booking: {
          include: {
            ride: { select: { pickupAddress: true, destinationAddress: true } },
          },
        },
      },
      orderBy: { lastMessageAt: 'desc' },
    });

    // Add unread count for current user
    const withUnread = await Promise.all(
      conversations.map(async (conv) => {
        const participant = conv.participants.find((p) => p.userId === session.user.id);
        return { ...conv, unreadCount: participant?.unreadCount || 0 };
      })
    );

    return NextResponse.json({ conversations: withUnread });
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { notifyNewMessage } from '@/lib/notifications';

// GET /api/conversations/[id]/messages
export async function GET(request, { params }) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = 30;

    // Verify participant
    const participant = await prisma.conversationParticipant.findFirst({
      where: { conversationId: id, userId: session.user.id },
    });
    if (!participant) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

    const [messages, total] = await Promise.all([
      prisma.message.findMany({
        where: { conversationId: id, isDeleted: false },
        include: { sender: { select: { id: true, name: true, image: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.message.count({ where: { conversationId: id, isDeleted: false } }),
    ]);

    // Mark as read
    await prisma.conversationParticipant.updateMany({
      where: { conversationId: id, userId: session.user.id },
      data: { unreadCount: 0, lastReadAt: new Date() },
    });

    return NextResponse.json({ messages: messages.reverse(), total, page });
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/conversations/[id]/messages — Send message
export async function POST(request, { params }) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const { id } = await params;
    const { content, messageType = 'TEXT', mediaUrl, fileName } = await request.json();

    // Verify participant
    const participant = await prisma.conversationParticipant.findFirst({
      where: { conversationId: id, userId: session.user.id },
    });
    if (!participant) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

    const message = await prisma.message.create({
      data: {
        conversationId: id,
        senderId: session.user.id,
        content,
        messageType,
        mediaUrl,
        fileName,
      },
      include: { sender: { select: { id: true, name: true, image: true } } },
    });

    // Update conversation last message
    await prisma.conversation.update({
      where: { id },
      data: { lastMessage: content || `[${messageType}]`, lastMessageAt: new Date() },
    });

    // Increment unread for other participants
    await prisma.conversationParticipant.updateMany({
      where: { conversationId: id, userId: { not: session.user.id } },
      data: { unreadCount: { increment: 1 } },
    });

    // Emit via Socket.IO
    if (global.io) {
      global.io.to(`conversation:${id}`).emit('message:received', message);
    }

    // Notify other participants
    const otherParticipants = await prisma.conversationParticipant.findMany({
      where: { conversationId: id, userId: { not: session.user.id } },
    });
    for (const p of otherParticipants) {
      notifyNewMessage(p.userId, session.user.name || 'Someone', id).catch(console.error);
    }

    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

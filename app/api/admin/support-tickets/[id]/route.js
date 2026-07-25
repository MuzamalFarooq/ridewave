import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createNotification } from '@/lib/notifications';

export async function PATCH(request, { params }) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'ADMIN')
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

    const { id } = await params;
    const { status, adminReply } = await request.json();

    if (!id)
      return NextResponse.json({ message: 'Ticket ID is required' }, { status: 400 });

    const data = {};
    if (status     !== undefined) {
      data.status = status;
      if (status === 'RESOLVED') data.resolvedAt = new Date();
    }
    if (adminReply !== undefined) data.adminNotes = adminReply;

    const ticket = await prisma.supportTicket.update({
      where: { id },
      data,
      include: { user: { select: { id: true, name: true } } },
    });

    // Notify the user
    const statusMessages = {
      IN_PROGRESS: 'Your support ticket is being reviewed by our team.',
      RESOLVED:    'Your support ticket has been resolved. Check the reply for details.',
      CLOSED:      'Your support ticket has been closed.',
    };
    const notifyBody = statusMessages[status] || 'Your support ticket has been updated.';

    await createNotification({
      userId:    ticket.user.id,
      type:      'SYSTEM',
      title:     `🎫 Support Ticket Update — ${ticket.subject}`,
      body:      notifyBody,
      data:      { ticketId: ticket.id },
      actionUrl: '/dashboard/support',
    });

    return NextResponse.json({ ticket });
  } catch (error) {
    console.error('Admin support ticket PATCH error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

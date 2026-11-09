import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createNotification } from '@/lib/notifications';
import { verifyAdminRequest, logAdminActivity } from '@/lib/admin-auth';

export async function PATCH(request, { params }) {
  try {
    const admin = await verifyAdminRequest(request);
    if (!admin.authenticated) {
      return NextResponse.json({ message: 'Unauthorized. Admin access required.' }, { status: 401 });
    }

    const { id } = await params;
    const { status, adminNotes, adminReply, priority } = await request.json();

    if (!id) {
      return NextResponse.json({ message: 'Ticket ID is required' }, { status: 400 });
    }

    const existingTicket = await prisma.supportTicket.findUnique({
      where: { id },
      include: { user: { select: { id: true, name: true, email: true } } },
    });

    if (!existingTicket) {
      return NextResponse.json({ message: 'Ticket not found' }, { status: 404 });
    }

    const data = {};
    if (status !== undefined) {
      data.status = status;
      if (status === 'RESOLVED') data.resolvedAt = new Date();
    }
    if (adminNotes !== undefined || adminReply !== undefined) {
      data.adminNotes = adminNotes !== undefined ? adminNotes : adminReply;
    }
    if (priority !== undefined) {
      data.priority = priority;
    }

    const ticket = await prisma.supportTicket.update({
      where: { id },
      data,
      include: { user: { select: { id: true, name: true, email: true } } },
    });

    // Notify user if ticket status was updated
    if (status && status !== existingTicket.status) {
      const statusMessages = {
        IN_PROGRESS: 'Your support ticket is being reviewed by our administration team.',
        RESOLVED: 'Your support ticket has been resolved. Check administrator notes for details.',
        CLOSED: 'Your support ticket has been marked as closed.',
      };
      const notifyBody = statusMessages[status] || `Your support ticket status is now ${status}.`;

      try {
        await createNotification({
          userId: ticket.user.id,
          type: 'SYSTEM',
          title: `🎫 Support Ticket Update — ${ticket.subject}`,
          body: notifyBody,
          data: { ticketId: ticket.id },
          actionUrl: '/dashboard/support',
        });
      } catch (err) {
        console.error('Failed to send user notification on ticket update:', err?.message);
      }
    }

    await logAdminActivity({
      adminEmail: admin.email,
      action: 'TICKET_UPDATED',
      targetType: 'TICKET',
      targetId: id,
      details: {
        previousStatus: existingTicket.status,
        newStatus: status || existingTicket.status,
        adminNotes: data.adminNotes,
      },
      req: request,
    });

    return NextResponse.json({ success: true, ticket });
  } catch (error) {
    console.error('PATCH /api/admin/support-tickets/[id] error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

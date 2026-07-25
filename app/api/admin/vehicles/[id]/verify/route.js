import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(request, { params }) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'ADMIN') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    const { id } = await params;
    const { decision, notes } = await request.json();

    const vehicle = await prisma.vehicle.update({
      where: { id },
      data: { verificationStatus: decision, verificationNotes: notes || null },
      include: { owner: true },
    });

    // Notify rider
    await prisma.notification.create({
      data: {
        userId: vehicle.ownerId,
        type: 'VERIFICATION',
        title: decision === 'APPROVED' ? '✅ Vehicle Approved!' : '❌ Vehicle Rejected',
        body: decision === 'APPROVED'
          ? `Your ${vehicle.brand} ${vehicle.model} has been verified. You can now publish rides!`
          : `Your ${vehicle.brand} ${vehicle.model} was rejected. Reason: ${notes || 'Documents incomplete'}. Please resubmit.`,
      },
    });

    // If approved, update rider's verification status
    if (decision === 'APPROVED') {
      await prisma.profile.update({
        where: { userId: vehicle.ownerId },
        data: { isRiderVerified: true },
      });
    }

    return NextResponse.json({ vehicle });
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

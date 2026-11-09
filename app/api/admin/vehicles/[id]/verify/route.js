import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminRequest, logAdminActivity } from '@/lib/admin-auth';

export async function PATCH(request, { params }) {
  try {
    const admin = await verifyAdminRequest(request);
    if (!admin.authenticated) {
      return NextResponse.json({ message: 'Unauthorized. Admin access required.' }, { status: 401 });
    }

    const { id } = await params;
    const { decision, notes } = await request.json();

    if (!['APPROVED', 'REJECTED', 'PENDING'].includes(decision)) {
      return NextResponse.json({ message: 'Valid decision (APPROVED/REJECTED/PENDING) is required' }, { status: 400 });
    }

    const vehicle = await prisma.vehicle.update({
      where: { id },
      data: {
        verificationStatus: decision,
        isVerified: decision === 'APPROVED',
      },
      include: { owner: true },
    });

    // Notify rider
    try {
      await prisma.notification.create({
        data: {
          userId: vehicle.ownerId,
          type: decision === 'APPROVED' ? 'VERIFICATION_APPROVED' : 'VERIFICATION_REJECTED',
          title: decision === 'APPROVED' ? '✅ Vehicle Approved!' : '❌ Vehicle Rejected',
          body:
            decision === 'APPROVED'
              ? `Your ${vehicle.brand} ${vehicle.model} (${vehicle.registrationNumber}) has been approved. You can now publish rides!`
              : `Your ${vehicle.brand} ${vehicle.model} was not approved. Reason: ${notes || 'Documents incomplete'}. Please update details.`,
        },
      });
    } catch (notifErr) {
      console.warn('Vehicle notification error:', notifErr?.message);
    }

    // If approved, update rider's profile verification status
    if (decision === 'APPROVED') {
      await prisma.profile.updateMany({
        where: { userId: vehicle.ownerId },
        data: { isRiderVerified: true },
      });
    }

    await logAdminActivity({
      adminEmail: admin.email,
      action: `VEHICLE_${decision}`,
      targetType: 'VEHICLE',
      targetId: id,
      details: { vehicle: `${vehicle.brand} ${vehicle.model}`, registration: vehicle.registrationNumber, notes },
      req: request,
    });

    return NextResponse.json({ success: true, vehicle });
  } catch (error) {
    console.error('PATCH /api/admin/vehicles/[id]/verify error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

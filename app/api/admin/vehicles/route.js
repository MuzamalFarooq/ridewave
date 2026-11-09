import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminRequest } from '@/lib/admin-auth';

export async function GET(request) {
  try {
    const admin = await verifyAdminRequest(request);
    if (!admin.authenticated) {
      return NextResponse.json({ message: 'Unauthorized. Admin access required.' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'PENDING';

    const vehicles = await prisma.vehicle.findMany({
      where: status !== 'ALL' ? { verificationStatus: status } : {},
      include: { owner: { select: { name: true, email: true, phone: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ vehicles });
  } catch (error) {
    console.error('GET /api/admin/vehicles error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

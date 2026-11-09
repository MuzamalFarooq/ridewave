import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminRequest, logAdminActivity } from '@/lib/admin-auth';

// GET /api/admin/payments — List payments and transactions
export async function GET(request) {
  try {
    const admin = await verifyAdminRequest(request);
    if (!admin.authenticated) {
      return NextResponse.json({ message: 'Unauthorized. Admin access required.' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
    const search = searchParams.get('search')?.trim() || '';
    const status = searchParams.get('status'); // COMPLETED | PENDING | PROCESSING | FAILED | REFUNDED | ALL
    const method = searchParams.get('method'); // STRIPE | CASH | WALLET | ALL

    const where = {
      ...(status && status !== 'ALL' ? { status } : {}),
      ...(method && method !== 'ALL' ? { method } : {}),
      ...(search
        ? {
            OR: [
              { stripePaymentIntentId: { contains: search, mode: 'insensitive' } },
              { stripeChargeId: { contains: search, mode: 'insensitive' } },
              { booking: { bookingRef: { contains: search, mode: 'insensitive' } } },
              { user: { name: { contains: search, mode: 'insensitive' } } },
              { user: { email: { contains: search, mode: 'insensitive' } } },
            ],
          }
        : {}),
    };

    const [payments, total, totalStats] = await Promise.all([
      prisma.payment.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
          booking: {
            select: {
              id: true,
              bookingRef: true,
              seatsBooked: true,
              status: true,
              ride: {
                select: {
                  pickupAddress: true,
                  destinationAddress: true,
                  departureDate: true,
                  rider: { select: { name: true, email: true } },
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.payment.count({ where }),
      prisma.payment.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { amount: true, refundedAmount: true },
        _count: { id: true },
      }),
    ]);

    return NextResponse.json({
      payments,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      summary: {
        totalCompletedAmount: totalStats._sum.amount || 0,
        totalRefundedAmount: totalStats._sum.refundedAmount || 0,
        completedCount: totalStats._count.id || 0,
      },
    });
  } catch (error) {
    console.error('GET /api/admin/payments error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// PATCH /api/admin/payments — Update payment status or record refund
export async function PATCH(request) {
  try {
    const admin = await verifyAdminRequest(request);
    if (!admin.authenticated) {
      return NextResponse.json({ message: 'Unauthorized. Admin access required.' }, { status: 401 });
    }

    const body = await request.json();
    const { paymentId, status, refundReason, refundAmount } = body;

    if (!paymentId || !status) {
      return NextResponse.json({ message: 'paymentId and status are required' }, { status: 400 });
    }

    const existingPayment = await prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!existingPayment) {
      return NextResponse.json({ message: 'Payment record not found' }, { status: 404 });
    }

    let updateData = { status };
    if (status === 'REFUNDED') {
      updateData.refundedAt = new Date();
      updateData.refundReason = refundReason || 'Refund processed by administrator';
      updateData.refundedAmount = refundAmount ? parseFloat(refundAmount) : existingPayment.amount;
    }

    const updated = await prisma.payment.update({
      where: { id: paymentId },
      data: updateData,
    });

    await logAdminActivity({
      adminEmail: admin.email,
      action: `PAYMENT_${status}`,
      targetType: 'PAYMENT',
      targetId: paymentId,
      details: { previousStatus: existingPayment.status, newStatus: status, refundReason },
      req: request,
    });

    return NextResponse.json({ success: true, payment: updated });
  } catch (error) {
    console.error('PATCH /api/admin/payments error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}


import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminRequest, logAdminActivity } from '@/lib/admin-auth';

// GET /api/admin/users/[id] — Retrieve user details & history
export async function GET(request, { params }) {
  try {
    const admin = await verifyAdminRequest(request);
    if (!admin.authenticated) {
      return NextResponse.json({ message: 'Unauthorized. Admin access required.' }, { status: 401 });
    }

    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
        vehicles: true,
        verification: true,
        bookingsAsTraveler: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            ride: {
              select: {
                id: true,
                pickupAddress: true,
                destinationAddress: true,
                departureDate: true,
                pricePerSeat: true,
                status: true,
                rider: { select: { name: true, email: true } },
              },
            },
            payment: true,
          },
        },
        ridesAsRider: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            vehicle: true,
            _count: { select: { bookings: true } },
          },
        },
        supportTickets: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: {
            ridesAsRider: true,
            bookingsAsTraveler: true,
            reviews: true,
            vehicles: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Exclude password hash
    const { password: _, ...userSafe } = user;

    return NextResponse.json({ user: userSafe });
  } catch (error) {
    console.error('GET /api/admin/users/[id] error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// PATCH /api/admin/users/[id] — Block, Unblock, or update role
export async function PATCH(request, { params }) {
  try {
    const admin = await verifyAdminRequest(request);
    if (!admin.authenticated) {
      return NextResponse.json({ message: 'Unauthorized. Admin access required.' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { action, reason, role } = body;

    const existingUser = await prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, name: true, role: true, isBanned: true, isActive: true },
    });

    if (!existingUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    let updateData = {};
    let auditAction = '';
    let auditDetails = {};

    if (action === 'BLOCK') {
      updateData = {
        isBanned: true,
        isActive: false,
        blockedAt: new Date(),
        blockedReason: reason || 'Blocked by administrator',
        blockedBy: admin.email,
      };
      auditAction = existingUser.role === 'RIDER' ? 'RIDER_BLOCKED' : 'USER_BLOCKED';
      auditDetails = { reason: reason || 'Blocked by administrator' };
    } else if (action === 'UNBLOCK') {
      updateData = {
        isBanned: false,
        isActive: true,
        blockedAt: null,
        blockedReason: null,
        blockedBy: null,
      };
      auditAction = existingUser.role === 'RIDER' ? 'RIDER_UNBLOCKED' : 'USER_UNBLOCKED';
      auditDetails = { previousReason: existingUser.blockedReason };
    } else if (role) {
      updateData = { role };
      auditAction = 'USER_ROLE_UPDATED';
      auditDetails = { oldRole: existingUser.role, newRole: role };
    } else {
      return NextResponse.json({ message: 'Valid action (BLOCK/UNBLOCK) or role is required' }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        isBanned: true,
        blockedAt: true,
        blockedReason: true,
        blockedBy: true,
      },
    });

    await logAdminActivity({
      adminEmail: admin.email,
      action: auditAction,
      targetType: existingUser.role === 'RIDER' ? 'RIDER' : 'USER',
      targetId: id,
      details: auditDetails,
      req: request,
    });

    return NextResponse.json({
      success: true,
      user: updatedUser,
      message: `User successfully ${action === 'BLOCK' ? 'blocked' : action === 'UNBLOCK' ? 'unblocked' : 'updated'}`,
    });
  } catch (error) {
    console.error('PATCH /api/admin/users/[id] error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/admin/users/[id]
export async function DELETE(request, { params }) {
  try {
    const admin = await verifyAdminRequest(request);
    if (!admin.authenticated) {
      return NextResponse.json({ message: 'Unauthorized. Admin access required.' }, { status: 401 });
    }

    const { id } = await params;
    const existing = await prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, name: true, role: true },
    });

    if (!existing) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Instead of hard-deleting foreign key relations, ban and deactivate
    await prisma.user.update({
      where: { id },
      data: {
        isBanned: true,
        isActive: false,
        blockedAt: new Date(),
        blockedReason: 'Deactivated by administrator',
        blockedBy: admin.email,
      },
    });

    await logAdminActivity({
      adminEmail: admin.email,
      action: 'USER_DEACTIVATED',
      targetType: 'USER',
      targetId: id,
      details: { email: existing.email },
      req: request,
    });

    return NextResponse.json({ success: true, message: 'User account deactivated successfully' });
  } catch (error) {
    console.error('DELETE /api/admin/users/[id] error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

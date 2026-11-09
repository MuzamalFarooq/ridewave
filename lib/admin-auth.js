import { auth } from './auth';
import { verifyAdminCredentials, normalizeEmail, getAdminUser } from './auth-security';
import { prisma } from './prisma';
import {
  ADMIN_COOKIE_NAME,
  TOKEN_EXPIRY_SECONDS,
  createAdminToken,
  verifyAdminToken,
} from './admin-token';

export {
  ADMIN_COOKIE_NAME,
  TOKEN_EXPIRY_SECONDS,
  createAdminToken,
  verifyAdminToken,
  verifyAdminCredentials,
  normalizeEmail,
  getAdminUser,
};

/**
 * Retrieves the admin session from Next.js request or headers.
 */
export async function getAdminSessionFromRequest(req) {
  let token = null;

  if (req?.cookies?.get) {
    token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  } else if (req?.headers?.get) {
    const cookieHeader = req.headers.get('cookie') || '';
    const match = cookieHeader.match(new RegExp(`(?:^|; )${ADMIN_COOKIE_NAME}=([^;]*)`));
    if (match) token = decodeURIComponent(match[1]);
  }

  if (!token) return null;
  return await verifyAdminToken(token);
}

/**
 * Verifies if the request is from an authenticated admin.
 * Accepts either the dedicated environment admin_session cookie OR an authenticated NextAuth session with role 'ADMIN'.
 */
export async function verifyAdminRequest(req) {
  // 1. Check dedicated admin_session cookie
  const envAdmin = await getAdminSessionFromRequest(req);
  if (envAdmin && envAdmin.role === 'ADMIN') {
    return { authenticated: true, email: envAdmin.email, type: 'ENV_ADMIN' };
  }

  // 2. Fallback to NextAuth ADMIN session
  try {
    const session = await auth();
    if (session?.user?.role === 'ADMIN') {
      return { authenticated: true, email: session.user.email, type: 'DB_ADMIN' };
    }
  } catch (err) {
    // ignore
  }

  return { authenticated: false };
}

/**
 * Logs an administrative action to the immutable AdminLog table.
 */
export async function logAdminActivity({
  adminEmail,
  action,
  targetType,
  targetId = null,
  details = null,
  req = null,
}) {
  try {
    let ipAddress = 'unknown';
    if (req?.headers?.get) {
      ipAddress =
        req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
        req.headers.get('x-real-ip') ||
        'unknown';
    }

    await prisma.adminLog.create({
      data: {
        adminEmail: adminEmail || 'admin@ridewave.local',
        action,
        targetType,
        targetId: targetId ? String(targetId) : null,
        details: typeof details === 'object' ? JSON.stringify(details) : details,
        ipAddress,
      },
    });
  } catch (err) {
    console.error('[AdminLog] Failed to record admin activity:', err?.message);
  }
}

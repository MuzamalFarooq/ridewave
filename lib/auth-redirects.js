export function normalizeRole(role) {
  const value = String(role || '').trim().toUpperCase();

  if (value === 'ADMIN') return 'ADMIN';
  if (value === 'RIDER') return 'RIDER';
  if (['USER', 'TRAVELER', 'CUSTOMER'].includes(value)) return 'TRAVELER';

  return 'TRAVELER';
}

export function getDashboardPath(role) {
  const normalizedRole = normalizeRole(role);

  if (normalizedRole === 'ADMIN') return '/dashboard/admin';
  if (normalizedRole === 'RIDER') return '/dashboard/rider';
  return '/dashboard/traveler';
}

export function isAuthorizedForPath(role, pathname = '') {
  const normalizedRole = normalizeRole(role);

  if (pathname.startsWith('/dashboard/admin')) return normalizedRole === 'ADMIN';
  if (pathname.startsWith('/dashboard/rider')) return normalizedRole === 'RIDER';
  if (pathname.startsWith('/dashboard/traveler') || pathname.startsWith('/dashboard/user')) return normalizedRole === 'TRAVELER';

  return true;
}

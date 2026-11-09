import { cookies } from 'next/headers';
import { verifyAdminToken, ADMIN_COOKIE_NAME } from '@/lib/admin-token';
import AdminLayoutClient from '@/components/admin/AdminLayoutClient';

export const metadata = {
  title: 'Admin Control Center — RideWave',
  description: 'RideWave Production Administrative Control Panel',
};

export default async function AdminLayout({ children }) {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  const session = token ? await verifyAdminToken(token) : null;

  return (
    <AdminLayoutClient adminEmail={session?.email || 'admin@ridewave.local'}>
      {children}
    </AdminLayoutClient>
  );
}


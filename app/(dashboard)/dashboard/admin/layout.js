import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Admin Dashboard — RideWave',
};

export default async function AdminDashboardLayout({ children }) {
  const session = await auth();

  // If not authenticated, redirect to login with callback
  if (!session) {
    redirect('/login?callbackUrl=/dashboard/admin');
  }

  // If authenticated but not an admin, deny access immediately
  if (session.user?.role !== 'ADMIN') {
    redirect('/forbidden');
  }

  return children;
}

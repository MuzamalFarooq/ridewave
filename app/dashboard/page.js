import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getDashboardPath } from '@/lib/auth-redirects';

export default async function DashboardIndexPage() {
  const session = await auth();

  if (!session) redirect('/login');
  redirect(getDashboardPath(session.user?.role));
}

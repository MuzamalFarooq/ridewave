import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function UserDashboardAliasPage() {
  const session = await auth();

  if (!session) redirect('/login');
  if (session.user.role !== 'TRAVELER') redirect('/forbidden');

  redirect('/dashboard/traveler');
}

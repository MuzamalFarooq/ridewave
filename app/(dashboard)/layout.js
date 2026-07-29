import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import DashboardSidebar from '@/components/shared/DashboardSidebar';

export default async function DashboardLayout({ children }) {
  const session = await auth();
  if (!session) redirect('/login');

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--bg-base)' }}>
      <DashboardSidebar user={session.user} />
      <main className="flex-1 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}

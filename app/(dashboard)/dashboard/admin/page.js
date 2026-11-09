import { redirect } from 'next/navigation';

export const metadata = { title: 'Admin Dashboard — RideWave' };

export default async function AdminDashboardPage() {
  redirect('/admin/dashboard');
}

import Link from 'next/link';

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: 'var(--bg-base)' }}>
      <div className="max-w-md text-center">
        <div className="text-6xl font-bold mb-4" style={{ color: 'var(--primary)' }}>403</div>
        <h1 className="text-2xl font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Access denied</h1>
        <p className="mb-6" style={{ color: 'var(--text-muted)' }}>
          You do not have permission to view this dashboard.
        </p>
        <Link href="/" className="btn-primary">
          Go home
        </Link>
      </div>
    </div>
  );
}

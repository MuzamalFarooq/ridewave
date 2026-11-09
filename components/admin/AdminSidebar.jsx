'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Car,
  CalendarCheck,
  CreditCard,
  MessageSquareWarning,
  FileText,
  Settings,
  LogOut,
  Shield,
  ExternalLink,
  ChevronRight,
  X,
} from 'lucide-react';

const NAV_ITEMS = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'User Management', href: '/admin/users', icon: Users },
  { name: 'Rider Management', href: '/admin/riders', icon: Car },
  { name: 'Ride Bookings', href: '/admin/bookings', icon: CalendarCheck },
  { name: 'Payments & Revenue', href: '/admin/payments', icon: CreditCard },
  { name: 'Complaints & Support', href: '/admin/complaints', icon: MessageSquareWarning },
  { name: 'Audit Logs', href: '/admin/logs', icon: FileText },
  { name: 'System Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminSidebar({ isOpen, onClose, adminEmail }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = React.useState(false);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await fetch('/api/admin/auth/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-72 flex-col bg-[#0d2620] border-r border-emerald-900/40 text-slate-200 transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-18 items-center justify-between px-6 border-b border-emerald-900/30">
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-[#173F35] to-[#C6A76B] text-white shadow-md shadow-black/20">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-outfit text-lg font-bold tracking-tight text-white">RideWave</span>
              <span className="text-[11px] font-medium tracking-wider uppercase text-[#C6A76B]">Admin Control</span>
            </div>
          </Link>

          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-emerald-900/40"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-4 py-5 space-y-1.5 custom-scrollbar">
          <div className="px-3 pb-2 text-[10px] font-bold tracking-wider uppercase text-emerald-400/80">
            Control Center
          </div>

          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  if (window.innerWidth < 1024 && onClose) onClose();
                }}
                className={`group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-600/30 to-[#C6A76B]/20 text-white font-semibold shadow-inner border border-emerald-500/30'
                    : 'text-slate-300 hover:bg-emerald-950/50 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`h-4.5 w-4.5 transition-colors ${
                      isActive ? 'text-[#C6A76B]' : 'text-slate-400 group-hover:text-emerald-300'
                    }`}
                  />
                  <span>{item.name}</span>
                </div>
                {isActive && <ChevronRight className="h-4 w-4 text-[#C6A76B]" />}
              </Link>
            );
          })}

          <div className="pt-6 px-3 pb-2 text-[10px] font-bold tracking-wider uppercase text-emerald-400/80">
            Quick Links
          </div>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-300 hover:bg-emerald-950/50 hover:text-white transition-all"
          >
            <div className="flex items-center gap-3">
              <ExternalLink className="h-4.5 w-4.5 text-slate-400" />
              <span>Public Platform</span>
            </div>
          </a>
        </nav>

        {/* Admin User Footer & Logout */}
        <div className="p-4 border-t border-emerald-900/30 bg-[#0a1f1a]">
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-2.5 truncate">
              <div className="h-8 w-8 rounded-full bg-emerald-800/80 border border-[#C6A76B]/40 flex items-center justify-center text-xs font-bold text-white shrink-0">
                A
              </div>
              <div className="flex flex-col truncate">
                <span className="text-xs font-semibold text-white truncate">Administrator</span>
                <span className="text-[11px] text-slate-400 truncate">{adminEmail || 'admin@ridewave.local'}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-rose-500/10 border border-rose-500/20 py-2 px-3 text-xs font-semibold text-rose-300 hover:bg-rose-500/20 hover:text-rose-200 transition-colors disabled:opacity-50"
          >
            <LogOut className="h-4 w-4" />
            <span>{loggingOut ? 'Signing out...' : 'Sign Out'}</span>
          </button>
        </div>
      </aside>
    </>
  );
}


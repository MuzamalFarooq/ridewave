'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { signOut } from 'next-auth/react';
import {
  LayoutDashboard, Car, Calendar, CreditCard, Star, Bell,
  Settings, LogOut, User, MessageSquare, Heart, BarChart2,
  Shield, Users, FileText, Tag, ChevronLeft, ChevronRight,
  Bike, MapPin, Menu, X, Navigation
} from 'lucide-react';
import { useSocket } from '@/contexts/SocketContext';
import { normalizeRole } from '@/lib/auth-redirects';

const navConfig = {
  TRAVELER: [
    { href: '/dashboard/traveler', label: 'Overview', icon: LayoutDashboard },
    { href: '/dashboard/traveler/bookings', label: 'My Bookings', icon: Car },
    { href: '/dashboard/traveler/favorites', label: 'Favorites', icon: Heart },
    { href: '/dashboard/messages', label: 'Messages', icon: MessageSquare },
    { href: '/dashboard/traveler/payments', label: 'Payments', icon: CreditCard },
    { href: '/dashboard/traveler/reviews', label: 'Reviews', icon: Star },
    { href: '/dashboard/notifications', label: 'Notifications', icon: Bell },
    { href: '/profile', label: 'Profile', icon: User },
    { href: '/settings', label: 'Settings', icon: Settings },
  ],
  RIDER: [
    { href: '/dashboard/rider', label: 'Overview', icon: LayoutDashboard },
    { href: '/dashboard/rider/rides', label: 'My Rides', icon: Navigation },
    { href: '/dashboard/rider/bookings', label: 'Bookings', icon: Calendar },
    { href: '/dashboard/rider/vehicles', label: 'Vehicles', icon: Car },
    { href: '/dashboard/rider/earnings', label: 'Earnings', icon: BarChart2 },
    { href: '/dashboard/messages', label: 'Messages', icon: MessageSquare },
    { href: '/dashboard/rider/reviews', label: 'Reviews', icon: Star },
    { href: '/dashboard/notifications', label: 'Notifications', icon: Bell },
    { href: '/profile', label: 'Profile', icon: User },
    { href: '/settings', label: 'Settings', icon: Settings },
  ],
  ADMIN: [
    { href: '/dashboard/admin', label: 'Analytics', icon: BarChart2 },
    { href: '/dashboard/admin/users', label: 'Users', icon: Users },
    { href: '/dashboard/admin/rides', label: 'Rides', icon: Navigation },
    { href: '/dashboard/admin/bookings', label: 'Bookings', icon: Calendar },
    { href: '/dashboard/admin/vehicles', label: 'Vehicles', icon: Car },
    { href: '/dashboard/admin/verification', label: 'Verification', icon: Shield },
    { href: '/dashboard/admin/payments', label: 'Payments', icon: CreditCard },
    { href: '/dashboard/admin/reviews', label: 'Reviews', icon: Star },
    { href: '/dashboard/admin/coupons', label: 'Coupons', icon: Tag },
    { href: '/dashboard/admin/support', label: 'Support', icon: MessageSquare },
    { href: '/dashboard/admin/reports', label: 'Reports', icon: FileText },
    { href: '/dashboard/admin/settings', label: 'Settings', icon: Settings },
  ],
};

export default function DashboardSidebar({ user }) {
  const pathname = usePathname();
  const { unreadCount } = useSocket();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const role = normalizeRole(user?.role || 'TRAVELER');
  const navItems = navConfig[role] || navConfig.TRAVELER;

  const roleColors = { TRAVELER: 'from-violet-500 to-purple-600', RIDER: 'from-blue-500 to-indigo-600', ADMIN: 'from-red-500 to-rose-600' };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
            <Car className="w-4 h-4 text-white" />
          </div>
          {!collapsed && <span className="font-outfit font-bold text-lg gradient-text">RideWave</span>}
        </Link>
      </div>

      {/* User Card */}
      <div className="p-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${roleColors[role]} flex items-center justify-center text-white font-bold flex-shrink-0 overflow-hidden`}>
            {user?.image
              ? <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
              : user?.name?.[0] || 'U'
            }
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <div className="font-semibold text-sm truncate">{user?.name}</div>
              <span className="badge" style={{ fontSize: 9, background: `rgba(99,102,241,0.1)`, color: 'var(--primary)' }}>
                {role}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 p-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/dashboard/traveler' && item.href !== '/dashboard/rider' && item.href !== '/dashboard/admin' && pathname.startsWith(item.href));
          const hasNotif = item.href.includes('messages') || item.href.includes('notifications');

          return (
            <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}>
              <motion.div
                whileHover={{ x: 2 }}
                className={`sidebar-item ${isActive ? 'active' : ''} relative`}
              >
                <Icon className="w-4.5 h-4.5 flex-shrink-0" />
                {!collapsed && <span className="flex-1">{item.label}</span>}
                {hasNotif && unreadCount > 0 && !collapsed && (
                  <span className="ml-auto text-xs px-1.5 py-0.5 rounded-full font-bold" style={{ background: 'var(--danger)', color: 'white' }}>
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
                {hasNotif && unreadCount > 0 && collapsed && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ background: 'var(--danger)' }} />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-2 border-t" style={{ borderColor: 'var(--border)' }}>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="sidebar-item w-full text-left"
          style={{ color: 'var(--danger)' }}
        >
          <LogOut className="w-4 h-4" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 lg:hidden btn-ghost w-10 h-10 p-0 rounded-xl border"
        style={{ borderColor: 'var(--border)', background: 'var(--bg-elevated)' }}
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
            style={{ background: 'rgba(0,0,0,0.5)' }}
            onClick={() => setMobileOpen(false)}
          >
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              onClick={(e) => e.stopPropagation()}
              className="sidebar w-64"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 btn-ghost w-8 h-8 p-0 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
              <SidebarContent />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <motion.div
        animate={{ width: collapsed ? 64 : 240 }}
        className="sidebar hidden lg:flex flex-col flex-shrink-0 transition-all"
      >
        <div className="absolute top-1/2 -right-3 z-10">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-6 h-6 rounded-full flex items-center justify-center border shadow-sm"
            style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)' }}
          >
            {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
          </button>
        </div>
        <SidebarContent />
      </motion.div>
    </>
  );
}

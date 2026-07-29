'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/components/shared/ThemeProvider';
import { useSocket } from '@/contexts/SocketContext';
import { getDashboardPath, normalizeRole } from '@/lib/auth-redirects';
import {
  Car, Bell, User, Menu, X, Sun, Moon, ChevronDown,
  Search, MapPin, LogOut, Settings, BarChart2, Shield,
  MessageSquare, Star, CreditCard, Heart, Home, Bike, Globe
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const { theme, toggleTheme } = useTheme();
  const { unreadCount, notifications } = useSocket();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const profileRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const getDashboardLink = () => {
    if (!session) return '/login';
    return getDashboardPath(session.user?.role);
  };

  const navLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/find-ride', label: 'Find Ride', icon: Search },
    { href: '/become-rider', label: 'Become Rider', icon: Car },
    { href: '/about', label: 'About', icon: Shield },
    { href: '/pricing', label: 'Pricing', icon: CreditCard },
    { href: '/contact', label: 'Contact', icon: MessageSquare },
  ];

  const normalizedRole = normalizeRole(session?.user?.role);

  const profileMenuItems = normalizedRole === 'ADMIN' ? [
    { href: '/dashboard/admin', label: 'Admin Dashboard', icon: Shield },
    { href: '/dashboard/admin/users', label: 'Manage Users', icon: User },
    { href: '/profile', label: 'Profile', icon: User },
    { href: '/settings', label: 'Settings', icon: Settings },
  ] : normalizedRole === 'RIDER' ? [
    { href: '/dashboard/rider', label: 'Rider Dashboard', icon: BarChart2 },
    { href: '/dashboard/rider/rides', label: 'My Rides', icon: Car },
    { href: '/dashboard/rider/earnings', label: 'Earnings', icon: CreditCard },
    { href: '/dashboard/messages', label: 'Messages', icon: MessageSquare },
    { href: '/profile', label: 'Profile', icon: User },
    { href: '/settings', label: 'Settings', icon: Settings },
  ] : [
    { href: '/dashboard/traveler', label: 'My Dashboard', icon: BarChart2 },
    { href: '/dashboard/traveler/bookings', label: 'My Bookings', icon: Car },
    { href: '/dashboard/traveler/favorites', label: 'Favorites', icon: Heart },
    { href: '/dashboard/messages', label: 'Messages', icon: MessageSquare },
    { href: '/profile', label: 'Profile', icon: User },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

  const isHomePage = pathname === '/';

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled || !isHomePage
            ? 'glass border-b border-[var(--glass-border)] shadow-lg'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                <Car className="w-5 h-5 text-white" />
              </div>
              <span className="font-outfit font-bold text-xl gradient-text">RideWave</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`nav-link ${pathname === link.href ? 'active' : ''}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Theme Toggle */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={toggleTheme}
                className="btn-ghost w-9 h-9 p-0 rounded-full"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </motion.button>

              {session ? (
                <>
                  {/* Notification Bell */}
                  <div className="relative" ref={notifRef}>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
                      className="btn-ghost w-9 h-9 p-0 rounded-full relative"
                      aria-label="Notifications"
                    >
                      <Bell className="w-4 h-4" />
                      {unreadCount > 0 && (
                        <span className="notification-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
                      )}
                    </motion.button>

                    <AnimatePresence>
                      {notifOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 top-12 w-80 glass-card p-2 z-50"
                        >
                          <div className="flex items-center justify-between px-3 py-2 mb-1">
                            <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Notifications</h3>
                            <Link
                              href="/notifications"
                              className="text-xs font-medium"
                              style={{ color: 'var(--primary)' }}
                              onClick={() => setNotifOpen(false)}
                            >
                              View all
                            </Link>
                          </div>
                          {notifications.length === 0 ? (
                            <div className="text-center py-8">
                              <Bell className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--text-muted)' }} />
                              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No notifications yet</p>
                            </div>
                          ) : (
                            <div className="max-h-64 overflow-y-auto space-y-1">
                              {notifications.slice(0, 5).map((n, i) => (
                                <div
                                  key={i}
                                  className="px-3 py-2 rounded-lg hover:bg-[var(--bg-surface)] transition-colors cursor-pointer"
                                  style={{ borderLeft: n.isRead ? 'none' : '3px solid var(--primary)' }}
                                >
                                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{n.title}</p>
                                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{n.body}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Profile Dropdown */}
                  <div className="relative" ref={profileRef}>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
                      className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full hover:bg-[var(--bg-surface)] border border-[var(--border)] transition-all"
                    >
                      <div className="w-7 h-7 rounded-full overflow-hidden gradient-primary flex items-center justify-center">
                        {session.user?.image ? (
                          <img src={session.user.image} alt={session.user.name} className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <span className="text-sm font-medium hidden sm:block" style={{ color: 'var(--text-primary)', maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {session.user?.name?.split(' ')[0] || 'Account'}
                      </span>
                      <ChevronDown className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)', transform: profileOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                    </motion.button>

                    <AnimatePresence>
                      {profileOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 top-12 w-56 glass-card p-2 z-50"
                        >
                          {/* User Info */}
                          <div className="px-3 py-2 mb-1 border-b border-[var(--border)]">
                            <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{session.user?.name}</p>
                            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{session.user?.email}</p>
                            <span className="badge badge-primary mt-1" style={{ fontSize: 10 }}>{session.user?.role}</span>
                          </div>

                          {/* Menu Items */}
                          {profileMenuItems.map((item) => {
                            const Icon = item.icon;
                            return (
                              <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setProfileOpen(false)}
                                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors hover:bg-[var(--bg-surface)]"
                                style={{ color: 'var(--text-secondary)' }}
                              >
                                <Icon className="w-4 h-4" />
                                {item.label}
                              </Link>
                            );
                          })}

                          {/* Sign Out */}
                          <div className="border-t border-[var(--border)] mt-1 pt-1">
                            <button
                              onClick={() => signOut({ callbackUrl: '/' })}
                              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm w-full text-left transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"
                              style={{ color: 'var(--danger)' }}
                            >
                              <LogOut className="w-4 h-4" />
                              Sign Out
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/login" className="btn-ghost text-sm py-2 px-4 hidden sm:flex">
                    Login
                  </Link>
                  <Link href="/register" className="btn-primary text-sm py-2 px-5">
                    Get Started
                  </Link>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="btn-ghost w-9 h-9 p-0 rounded-full lg:hidden"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-[var(--glass-border)] glass"
            >
              <div className="px-4 py-4 space-y-1">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                        pathname === link.href
                          ? 'bg-[var(--primary)] text-white'
                          : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface)]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {link.label}
                    </Link>
                  );
                })}
                {!session && (
                  <div className="flex gap-2 pt-2">
                    <Link href="/login" onClick={() => setMobileOpen(false)} className="btn-secondary flex-1 text-sm py-2.5 text-center">
                      Login
                    </Link>
                    <Link href="/register" onClick={() => setMobileOpen(false)} className="btn-primary flex-1 text-sm py-2.5 text-center">
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}

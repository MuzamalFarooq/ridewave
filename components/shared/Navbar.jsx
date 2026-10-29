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
  Search, Shield, MessageSquare, Heart, Home, Bike,
  BarChart2, Settings, LogOut, Compass, ArrowRight
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
    const handleScroll = () => setIsScrolled(window.scrollY > 15);
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
    { href: '/#how-it-works', label: 'How It Works', icon: Shield },
    { href: '/find-ride', label: 'Explore Rides', icon: Search },
    { href: '/#vehicles', label: 'Vehicles', icon: Car },
    { href: '/become-rider', label: 'Become a Driver', icon: Bike },
    { href: '/help', label: 'Help & Support', icon: MessageSquare },
  ];

  const normalizedRole = normalizeRole(session?.user?.role);

  const profileMenuItems = normalizedRole === 'ADMIN' ? [
    { href: '/dashboard/admin', label: 'Admin Dashboard', icon: Shield },
    { href: '/dashboard/admin/users', label: 'Manage Users', icon: User },
    { href: '/profile', label: 'My Profile', icon: User },
    { href: '/settings', label: 'Settings', icon: Settings },
  ] : normalizedRole === 'RIDER' ? [
    { href: '/dashboard/rider', label: 'Driver Dashboard', icon: BarChart2 },
    { href: '/dashboard/rider/rides', label: 'My Posted Rides', icon: Car },
    { href: '/dashboard/rider/earnings', label: 'Earnings', icon: BarChart2 },
    { href: '/dashboard/messages', label: 'Messages', icon: MessageSquare },
    { href: '/profile', label: 'My Profile', icon: User },
    { href: '/settings', label: 'Settings', icon: Settings },
  ] : [
    { href: '/dashboard/traveler', label: 'Traveller Dashboard', icon: BarChart2 },
    { href: '/dashboard/traveler/bookings', label: 'My Bookings', icon: Car },
    { href: '/dashboard/traveler/favorites', label: 'Saved Rides', icon: Heart },
    { href: '/dashboard/messages', label: 'Messages', icon: MessageSquare },
    { href: '/profile', label: 'My Profile', icon: User },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

  const isHomePage = pathname === '/';

  return (
    <>
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled || !isHomePage
            ? 'bg-[#F8F6F0]/95 dark:bg-[#102F28]/95 backdrop-blur-md border-b border-[#E7E5DD] dark:border-[#23584B] shadow-sm'
            : 'bg-[#F8F6F0]/80 dark:bg-[#102F28]/80 backdrop-blur-sm border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#173F35] rounded-lg">
              <div className="w-10 h-10 rounded-xl bg-[#173F35] text-white flex items-center justify-center shadow-md group-hover:bg-[#102F28] transition-colors relative overflow-hidden">
                <Compass className="w-5 h-5 text-[#C6A76B] transition-transform duration-300 group-hover:rotate-45" />
              </div>
              <div className="flex flex-col">
                <span className="font-outfit font-bold text-xl text-[#173F35] dark:text-[#F8F6F0] tracking-tight leading-none flex items-center gap-1">
                  RideWave
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C6A76B]" />
                </span>
                <span className="text-[10px] font-semibold tracking-widest uppercase text-[#2C322B] dark:text-[#DCE7DF] mt-0.5">
                  Premium Mobility
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-1 bg-white/70 dark:bg-[#173F35]/60 border border-[#E7E5DD] dark:border-[#23584B] px-3 py-1.5 rounded-full shadow-sm">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm font-semibold px-3.5 py-1.5 rounded-full transition-all duration-200 ${
                      isActive
                        ? 'bg-[#173F35] text-white shadow-xs'
                        : 'text-[#242824] dark:text-[#F8F6F0] hover:text-[#173F35] dark:hover:text-[#C6A76B] hover:bg-[#DCE7DF]/40 dark:hover:bg-[#19463B]'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="w-9 h-9 flex items-center justify-center rounded-full text-[#242824] dark:text-[#F8F6F0] hover:bg-[#DCE7DF]/50 dark:hover:bg-[#173F35] border border-transparent hover:border-[#E7E5DD] dark:hover:border-[#23584B] transition-colors focus:outline-none"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-[#C6A76B]" />
                ) : (
                  <Moon className="w-4 h-4 text-[#173F35]" />
                )}
              </button>

              {session ? (
                <>
                  {/* Notifications */}
                  <div className="relative" ref={notifRef}>
                    <button
                      onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
                      className="w-9 h-9 flex items-center justify-center rounded-full text-[#242824] dark:text-[#F8F6F0] hover:bg-[#DCE7DF]/50 dark:hover:bg-[#173F35] border border-transparent hover:border-[#E7E5DD] dark:hover:border-[#23584B] transition-colors relative focus:outline-none"
                      aria-label="Notifications"
                    >
                      <Bell className="w-4 h-4" />
                      {unreadCount > 0 && (
                        <span className="notification-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
                      )}
                    </button>

                    <AnimatePresence>
                      {notifOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.96 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 top-12 w-80 bg-white dark:bg-[#173F35] border border-[#E7E5DD] dark:border-[#23584B] rounded-2xl shadow-xl p-3 z-50"
                        >
                          <div className="flex items-center justify-between px-2 py-1 mb-2 border-b border-[#E7E5DD] dark:border-[#23584B]">
                            <h3 className="font-semibold text-sm text-[#242824] dark:text-[#F8F6F0]">Notifications</h3>
                            <Link
                              href="/notifications"
                              className="text-xs font-semibold text-[#173F35] dark:text-[#C6A76B] hover:underline"
                              onClick={() => setNotifOpen(false)}
                            >
                              View all
                            </Link>
                          </div>
                          {notifications.length === 0 ? (
                            <div className="text-center py-6 text-[#4E554B] dark:text-[#DCE7DF]">
                              <Bell className="w-6 h-6 mx-auto mb-1.5 opacity-60" />
                              <p className="text-xs font-medium">No new notifications</p>
                            </div>
                          ) : (
                            <div className="max-h-60 overflow-y-auto space-y-1.5">
                              {notifications.slice(0, 5).map((n, i) => (
                                <div
                                  key={i}
                                  className="p-2.5 rounded-xl hover:bg-[#F8F6F0] dark:hover:bg-[#102F28] transition-colors cursor-pointer text-xs"
                                  style={{ borderLeft: n.isRead ? 'none' : '3px solid #173F35' }}
                                >
                                  <p className="font-semibold text-[#242824] dark:text-[#F8F6F0]">{n.title}</p>
                                  <p className="text-[#3D443B] dark:text-[#DCE7DF] mt-0.5">{n.body}</p>
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
                    <button
                      onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
                      className="flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-full bg-white dark:bg-[#173F35] border border-[#E7E5DD] dark:border-[#23584B] hover:border-[#173F35] dark:hover:border-[#C6A76B] transition-all focus:outline-none"
                    >
                      <div className="w-7 h-7 rounded-full overflow-hidden bg-[#173F35] text-white flex items-center justify-center font-semibold text-xs">
                        {session.user?.image ? (
                          <img src={session.user.image} alt={session.user.name || 'User'} className="w-full h-full object-cover" />
                        ) : (
                          (session.user?.name?.[0] || 'U').toUpperCase()
                        )}
                      </div>
                      <span className="text-xs font-semibold text-[#242824] dark:text-[#F8F6F0] hidden sm:block max-w-[90px] truncate">
                        {session.user?.name?.split(' ')[0] || 'Account'}
                      </span>
                      <ChevronDown className="w-3.5 h-3.5 text-[#242824] dark:text-[#F8F6F0] transition-transform duration-200" style={{ transform: profileOpen ? 'rotate(180deg)' : 'none' }} />
                    </button>

                    <AnimatePresence>
                      {profileOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.96 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 top-12 w-60 bg-white dark:bg-[#173F35] border border-[#E7E5DD] dark:border-[#23584B] rounded-2xl shadow-xl p-2 z-50"
                        >
                          <div className="px-3 py-2.5 mb-1 border-b border-[#E7E5DD] dark:border-[#23584B]">
                            <p className="text-sm font-semibold text-[#242824] dark:text-[#F8F6F0] truncate">{session.user?.name}</p>
                            <p className="text-xs text-[#3D443B] dark:text-[#DCE7DF] truncate">{session.user?.email}</p>
                            <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#DCE7DF] dark:bg-[#102F28] text-[#173F35] dark:text-[#C6A76B]">
                              {session.user?.role}
                            </span>
                          </div>

                          <div className="space-y-0.5">
                            {profileMenuItems.map((item) => {
                              const Icon = item.icon;
                              return (
                                <Link
                                  key={item.href}
                                  href={item.href}
                                  onClick={() => setProfileOpen(false)}
                                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#242824] dark:text-[#F8F6F0] hover:bg-[#F8F6F0] dark:hover:bg-[#102F28] hover:text-[#173F35] dark:hover:text-[#C6A76B] transition-colors"
                                >
                                  <Icon className="w-4 h-4 text-[#173F35] dark:text-[#C6A76B]" />
                                  {item.label}
                                </Link>
                              );
                            })}
                          </div>

                          <div className="border-t border-[#E7E5DD] dark:border-[#23584B] mt-1.5 pt-1.5">
                            <button
                              onClick={() => signOut({ callbackUrl: '/' })}
                              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium w-full text-left text-[#B42318] hover:bg-[#B42318]/10 transition-colors"
                            >
                              <LogOut className="w-4 h-4" />
                              Sign Out
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <Link
                    href="/find-ride"
                    className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-[#173F35] text-white hover:bg-[#102F28] transition-all shadow-xs"
                  >
                    <span>Book a Ride</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </>
              ) : (
                <div className="flex items-center gap-2 sm:gap-3">
                  <Link
                    href="/login"
                    className="text-xs sm:text-sm font-semibold text-[#242824] dark:text-[#F8F6F0] hover:text-[#173F35] dark:hover:text-[#C6A76B] px-3 py-2 rounded-full hover:bg-[#DCE7DF]/40 dark:hover:bg-[#173F35] transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/find-ride"
                    className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold bg-[#173F35] text-white hover:bg-[#102F28] transition-all shadow-sm active:scale-95"
                  >
                    <span>Book a Ride</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-[#173F35] border border-[#E7E5DD] dark:border-[#23584B] text-[#242824] dark:text-[#F8F6F0] lg:hidden transition-colors focus:outline-none"
                aria-label="Toggle navigation menu"
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden border-t border-[#E7E5DD] dark:border-[#23584B] bg-[#F8F6F0] dark:bg-[#102F28] px-4 pt-3 pb-6 shadow-xl"
            >
              <div className="space-y-1">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                        isActive
                          ? 'bg-[#173F35] text-white'
                          : 'text-[#242824] dark:text-[#F8F6F0] hover:bg-[#DCE7DF]/60 dark:hover:bg-[#173F35]'
                      }`}
                    >
                      <Icon className="w-4 h-4 text-[#C6A76B]" />
                      {link.label}
                    </Link>
                  );
                })}
              </div>

              {!session ? (
                <div className="mt-4 pt-4 border-t border-[#E7E5DD] dark:border-[#23584B] flex flex-col gap-2">
                  <Link
                    href="/find-ride"
                    onClick={() => setMobileOpen(false)}
                    className="w-full text-center py-2.5 rounded-xl font-bold text-sm bg-[#173F35] text-white hover:bg-[#102F28] shadow-sm transition-colors"
                  >
                    Book a Ride
                  </Link>
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="w-full text-center py-2.5 rounded-xl font-semibold text-sm bg-white dark:bg-[#173F35] border border-[#E7E5DD] dark:border-[#23584B] text-[#242824] dark:text-[#F8F6F0] hover:bg-[#F8F6F0] transition-colors"
                  >
                    Sign In to Account
                  </Link>
                </div>
              ) : (
                <div className="mt-4 pt-4 border-t border-[#E7E5DD] dark:border-[#23584B] flex flex-col gap-2">
                  <Link
                    href={getDashboardLink()}
                    onClick={() => setMobileOpen(false)}
                    className="w-full text-center py-2.5 rounded-xl font-bold text-sm bg-[#173F35] text-white hover:bg-[#102F28] shadow-sm transition-colors"
                  >
                    Go to My Dashboard
                  </Link>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}

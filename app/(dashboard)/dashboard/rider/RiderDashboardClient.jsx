'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { format } from 'date-fns';
import {
  Car, DollarSign, Navigation, Star, Clock, CheckCircle, XCircle,
  ArrowRight, TrendingUp, Calendar, Plus, BarChart2, Users, Bell
} from 'lucide-react';

const statusColors = {
  PENDING: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  CONFIRMED: { color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
  COMPLETED: { color: '#6366f1', bg: 'rgba(99,102,241,0.1)' },
  CANCELLED: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
  REJECTED: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
};

export default function RiderDashboardClient({ user, recentBookings, vehicles, notifications, stats }) {
  const statCards = [
    { label: 'Total Earnings', value: `$${stats.totalEarnings.toFixed(0)}`, sub: `$${stats.thisMonthEarnings.toFixed(0)} this month`, icon: DollarSign, color: '#10b981' },
    { label: 'Total Rides', value: stats.totalRides, sub: `${stats.completedRides} completed`, icon: Navigation, color: '#6366f1' },
    { label: 'Avg Rating', value: stats.avgRating > 0 ? stats.avgRating.toFixed(1) : '—', sub: 'Based on reviews', icon: Star, color: '#f59e0b' },
    { label: 'Pending', value: stats.pendingBookings, sub: 'Requests waiting', icon: Clock, color: '#8b5cf6' },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-outfit font-bold">
            Rider Dashboard — <span className="gradient-text">{user?.name?.split(' ')[0]}</span>
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Manage your rides and track your earnings</p>
        </div>
        <Link href="/dashboard/rider/rides/new" className="btn-primary py-2.5 px-5 text-sm">
          <Plus className="w-4 h-4" /> Publish Ride
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map(({ label, value, sub, icon: Icon, color }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -4 }}
            className="card-premium p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: `${color}20` }}>
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <TrendingUp className="w-4 h-4" style={{ color: 'var(--success)' }} />
            </div>
            <div className="text-2xl font-bold font-outfit gradient-text">{value}</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{sub}</div>
            <div className="text-xs mt-1 font-medium" style={{ color: 'var(--text-secondary)' }}>{label}</div>
          </motion.div>
        ))}
      </div>

      {/* Earnings Banner */}
      <div className="rounded-3xl p-6 mb-8 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1a1a2e, #0f3460)' }}>
        <div className="absolute right-0 top-0 w-48 h-full opacity-5" style={{ background: 'radial-gradient(circle, var(--primary), transparent)' }} />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div>
            <p className="text-sm mb-1" style={{ color: 'rgba(255,255,255,0.6)' }}>This Month's Earnings</p>
            <div className="text-4xl font-bold font-outfit text-white">${stats.thisMonthEarnings.toFixed(2)}</div>
            <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.6)' }}>Lifetime: ${stats.totalEarnings.toFixed(2)}</p>
          </div>
          <Link href="/dashboard/rider/earnings" className="btn-primary py-2.5 px-5 text-sm">
            <BarChart2 className="w-4 h-4" /> View Analytics
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Bookings */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Bookings</h2>
            <Link href="/dashboard/rider/bookings" className="text-sm font-medium flex items-center gap-1" style={{ color: 'var(--primary)' }}>
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentBookings.length === 0 ? (
              <div className="card-premium p-8 text-center">
                <Calendar className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
                <h3 className="font-medium mb-2">No bookings yet</h3>
                <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>Publish a ride to start accepting passengers!</p>
                <Link href="/dashboard/rider/rides/new" className="btn-primary text-sm py-2 px-5">Publish First Ride</Link>
              </div>
            ) : recentBookings.map((booking, i) => {
              const s = statusColors[booking.status] || statusColors.PENDING;
              return (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="card-premium p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl gradient-primary flex items-center justify-center text-white font-bold overflow-hidden flex-shrink-0">
                      {booking.traveler?.image
                        ? <img src={booking.traveler.image} alt="" className="w-full h-full object-cover" />
                        : booking.traveler?.name?.[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="font-semibold text-sm truncate">{booking.traveler?.name}</div>
                        <span
                          className="text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0"
                          style={{ background: s.bg, color: s.color }}
                        >
                          {booking.status}
                        </span>
                      </div>
                      <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                        {booking.ride?.pickupAddress} → {booking.ride?.destinationAddress}
                      </div>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                          {booking.ride?.departureDate ? format(new Date(booking.ride.departureDate), 'MMM d') : '—'}
                        </span>
                        <span className="text-sm font-bold gradient-text">${booking.payment?.amount?.toFixed(2) || '—'}</span>
                      </div>
                    </div>
                  </div>

                  {booking.status === 'PENDING' && (
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={async () => {
                          await fetch(`/api/bookings/${booking.id}`, {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ action: 'ACCEPT' }),
                          });
                          window.location.reload();
                        }}
                        className="flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1"
                        style={{ background: 'rgba(16,185,129,0.15)', color: 'var(--success)' }}
                      >
                        <CheckCircle className="w-3 h-3" /> Accept
                      </button>
                      <button
                        onClick={async () => {
                          await fetch(`/api/bookings/${booking.id}`, {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ action: 'REJECT', reason: 'Rider declined' }),
                          });
                          window.location.reload();
                        }}
                        className="flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1"
                        style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--danger)' }}
                      >
                        <XCircle className="w-3 h-3" /> Decline
                      </button>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-5">
          {/* Quick Actions */}
          <div className="card-premium p-5">
            <h3 className="font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              {[
                { href: '/dashboard/rider/rides/new', label: '+ Publish New Ride', primary: true },
                { href: '/dashboard/rider/rides', label: 'Manage Rides' },
                { href: '/dashboard/rider/vehicles', label: 'My Vehicles' },
                { href: '/dashboard/rider/earnings', label: 'Earnings Analytics' },
              ].map(({ href, label, primary }) => (
                <Link key={href} href={href}>
                  <motion.button
                    whileHover={{ x: 4 }}
                    className={`w-full text-sm py-2.5 px-4 rounded-xl text-left font-medium transition-all ${primary ? 'btn-primary' : 'flex items-center justify-between'}`}
                    style={!primary ? { color: 'var(--text-secondary)', background: 'var(--bg-surface)' } : {}}
                  >
                    {label}
                    {!primary && <ArrowRight className="w-3.5 h-3.5" />}
                  </motion.button>
                </Link>
              ))}
            </div>
          </div>

          {/* Vehicles */}
          <div className="card-premium p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">My Vehicles</h3>
              <Link href="/dashboard/rider/vehicles" className="text-xs" style={{ color: 'var(--primary)' }}>Manage</Link>
            </div>
            {vehicles.length === 0 ? (
              <div className="text-center py-4">
                <Car className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--text-muted)' }} />
                <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>No vehicles yet</p>
                <Link href="/dashboard/rider/vehicles/new" className="btn-primary text-xs py-1.5 px-4">Add Vehicle</Link>
              </div>
            ) : vehicles.map((v) => (
              <div key={v.id} className="flex items-center gap-3 py-2 border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(99,102,241,0.1)' }}>
                  <Car className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                </div>
                <div>
                  <div className="text-sm font-medium">{v.brand} {v.model} ({v.year})</div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {v.vehicleType} • {v.registrationNumber}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Notifications */}
          {notifications.length > 0 && (
            <div className="card-premium p-5">
              <h3 className="font-semibold mb-3">Notifications</h3>
              {notifications.map((n) => (
                <div key={n.id} className="flex gap-2 p-2 rounded-lg mb-2 last:mb-0" style={{ background: 'var(--bg-surface)' }}>
                  <Bell className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: 'var(--primary)' }} />
                  <div>
                    <p className="text-xs font-medium">{n.title}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{n.body}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

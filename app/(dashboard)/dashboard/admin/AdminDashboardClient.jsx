'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { format } from 'date-fns';
import {
  Users, Car, Calendar, DollarSign, TrendingUp, TrendingDown,
  ArrowRight, Shield, BarChart2, AlertCircle, CheckCircle, Clock
} from 'lucide-react';

export default function AdminDashboardClient({ stats, recentUsers, recentRides, recentBookings }) {
  const statCards = [
    { label: 'Total Users', value: stats.totalUsers.toLocaleString(), sub: `+${stats.newUsersThisMonth} this month`, icon: Users, color: '#6366f1', trend: 'up' },
    { label: 'Total Rides', value: stats.totalRides.toLocaleString(), sub: `${stats.activeRides} active now`, icon: Car, color: '#8b5cf6', trend: 'up' },
    { label: 'Total Revenue', value: `$${stats.totalRevenue.toFixed(0)}`, sub: `$${stats.monthRevenue.toFixed(0)} this month`, icon: DollarSign, color: '#10b981', trend: stats.revenueGrowth >= 0 ? 'up' : 'down' },
    { label: 'Bookings', value: stats.totalBookings.toLocaleString(), sub: `${stats.completedBookings} completed`, icon: Calendar, color: '#f59e0b', trend: 'up' },
    { label: 'Revenue Growth', value: `${stats.revenueGrowth > 0 ? '+' : ''}${stats.revenueGrowth}%`, sub: 'vs last month', icon: BarChart2, color: stats.revenueGrowth >= 0 ? '#10b981' : '#ef4444', trend: stats.revenueGrowth >= 0 ? 'up' : 'down' },
    { label: 'Pending Verification', value: stats.pendingVerifications, sub: 'Vehicles awaiting review', icon: Shield, color: '#f59e0b', trend: 'neutral', href: '/dashboard/admin/verification' },
  ];

  const bookingStatusColors = {
    PENDING: '#f59e0b', CONFIRMED: '#10b981', COMPLETED: '#6366f1',
    CANCELLED: '#ef4444', REJECTED: '#ef4444',
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-outfit font-bold">Admin <span className="gradient-text">Control Panel</span></h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Platform overview for {format(new Date(), 'MMMM yyyy')}</p>
        </div>
        {stats.pendingVerifications > 0 && (
          <Link href="/dashboard/admin/verification">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl animate-pulse" style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)' }}>
              <AlertCircle className="w-4 h-4" style={{ color: '#f59e0b' }} />
              <span className="text-sm font-semibold" style={{ color: '#f59e0b' }}>
                {stats.pendingVerifications} pending verification{stats.pendingVerifications !== 1 ? 's' : ''}
              </span>
            </div>
          </Link>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {statCards.map(({ label, value, sub, icon: Icon, color, trend, href }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ y: -4 }}
            className="card-premium p-5 cursor-default"
          >
            {href ? (
              <Link href={href} className="block">
                <StatCardContent Icon={Icon} color={color} value={value} sub={sub} label={label} trend={trend} />
              </Link>
            ) : (
              <StatCardContent Icon={Icon} color={color} value={value} sub={sub} label={label} trend={trend} />
            )}
          </motion.div>
        ))}
      </div>

      {/* Revenue Banner */}
      <div className="rounded-3xl p-6 mb-8 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)' }}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative z-10">
          {[
            { label: 'Total Platform Revenue', value: `$${stats.totalRevenue.toFixed(2)}`, icon: DollarSign },
            { label: 'This Month', value: `$${stats.monthRevenue.toFixed(2)}`, icon: Calendar },
            { label: 'MoM Growth', value: `${stats.revenueGrowth > 0 ? '+' : ''}${stats.revenueGrowth}%`, icon: stats.revenueGrowth >= 0 ? TrendingUp : TrendingDown },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="text-center text-white">
              <Icon className="w-6 h-6 mx-auto mb-2 opacity-75" />
              <div className="text-3xl font-bold font-outfit">{value}</div>
              <div className="text-sm opacity-60 mt-1">{label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Recent Users */}
        <div className="card-premium p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Recent Users</h3>
            <Link href="/dashboard/admin/users" className="text-xs flex items-center gap-1" style={{ color: 'var(--primary)' }}>
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {recentUsers.map((u) => (
              <div key={u.id} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-white text-sm font-bold overflow-hidden flex-shrink-0">
                  {u.image ? <img src={u.image} alt="" className="w-full h-full object-cover" /> : u.name?.[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{u.name}</div>
                  <div className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{u.email}</div>
                </div>
                <span className="badge" style={{ fontSize: 9, background: u.role === 'RIDER' ? 'rgba(99,102,241,0.1)' : 'rgba(16,185,129,0.1)', color: u.role === 'RIDER' ? 'var(--primary)' : 'var(--success)' }}>
                  {u.role}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Rides */}
        <div className="card-premium p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Recent Rides</h3>
            <Link href="/dashboard/admin/rides" className="text-xs flex items-center gap-1" style={{ color: 'var(--primary)' }}>
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {recentRides.map((ride) => (
              <div key={ride.id} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(99,102,241,0.1)' }}>
                  <Car className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{ride.pickupAddress} → {ride.destinationAddress}</div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {ride.rider?.name} • {ride.vehicle?.vehicleType} • ${ride.pricePerSeat}
                  </div>
                </div>
                <span
                  className="text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0"
                  style={{
                    background: ride.status === 'PUBLISHED' ? 'rgba(16,185,129,0.1)' : 'rgba(107,114,128,0.1)',
                    color: ride.status === 'PUBLISHED' ? 'var(--success)' : 'var(--text-muted)',
                  }}
                >
                  {ride.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="card-premium p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Recent Bookings</h3>
          <Link href="/dashboard/admin/bookings" className="text-xs flex items-center gap-1" style={{ color: 'var(--primary)' }}>
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Traveler', 'Route', 'Amount', 'Status', 'Date'].map((h) => (
                  <th key={h} className="text-left py-2 pr-4 text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((b) => (
                <tr key={b.id} className="border-b transition-colors hover:bg-[var(--bg-surface)]" style={{ borderColor: 'var(--border)' }}>
                  <td className="py-3 pr-4 font-medium">{b.traveler?.name}</td>
                  <td className="py-3 pr-4 text-xs" style={{ color: 'var(--text-muted)', maxWidth: 160 }}>
                    <span className="truncate block">{b.ride?.pickupAddress} → {b.ride?.destinationAddress}</span>
                  </td>
                  <td className="py-3 pr-4 font-semibold" style={{ color: 'var(--success)' }}>
                    ${b.payment?.amount?.toFixed(2) || '—'}
                  </td>
                  <td className="py-3 pr-4">
                    <span
                      className="text-xs font-medium px-2 py-0.5 rounded-full"
                      style={{ background: `${bookingStatusColors[b.status]}20`, color: bookingStatusColors[b.status] }}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="py-3 text-xs" style={{ color: 'var(--text-muted)' }}>
                    {format(new Date(b.createdAt), 'MMM d, HH:mm')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCardContent({ Icon, color, value, sub, label, trend }) {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : null;
  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: `${color}20` }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        {TrendIcon && <TrendIcon className="w-4 h-4" style={{ color: trend === 'up' ? 'var(--success)' : 'var(--danger)' }} />}
      </div>
      <div className="text-2xl font-bold font-outfit gradient-text">{value}</div>
      <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{sub}</div>
      <div className="text-xs mt-1 font-medium" style={{ color: 'var(--text-secondary)' }}>{label}</div>
    </>
  );
}

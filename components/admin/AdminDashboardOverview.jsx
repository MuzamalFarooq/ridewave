'use client';

import React from 'react';
import Link from 'next/link';
import {
  Users,
  Car,
  CalendarCheck,
  CreditCard,
  TrendingUp,
  AlertTriangle,
  UserCheck,
  UserX,
  Clock,
  ShieldAlert,
  ArrowUpRight,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export default function AdminDashboardOverview({ data }) {
  const { metrics, revenueChart, rideDistribution, bookingDistribution, recentUsers, recentBookings, recentLogs } = data;

  const statCards = [
    {
      title: 'Total Revenue',
      value: `$${(metrics.revenue.total || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      subtitle: `${metrics.revenue.growthRate >= 0 ? '+' : ''}${metrics.revenue.growthRate}% vs last month`,
      icon: CreditCard,
      color: 'from-amber-500/20 to-amber-600/10 border-amber-500/30 text-amber-400',
      href: '/admin/payments',
    },
    {
      title: 'Total Users',
      value: (metrics.users.total || 0).toLocaleString(),
      subtitle: `${metrics.users.active} active • ${metrics.users.blocked} blocked`,
      icon: Users,
      color: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30 text-emerald-400',
      href: '/admin/users',
    },
    {
      title: 'Registered Riders',
      value: (metrics.riders.total || 0).toLocaleString(),
      subtitle: `${metrics.riders.active} active • ${metrics.riders.pendingVerifications} pending verification`,
      icon: Car,
      color: 'from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-400',
      href: '/admin/riders',
    },
    {
      title: 'Total Bookings',
      value: (metrics.bookings.total || 0).toLocaleString(),
      subtitle: `${metrics.bookings.confirmed} confirmed • ${metrics.bookings.completed} completed`,
      icon: CalendarCheck,
      color: 'from-purple-500/20 to-purple-600/10 border-purple-500/30 text-purple-400',
      href: '/admin/bookings',
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-3xl bg-gradient-to-r from-[#0d2620] via-[#12362e] to-[#173F35] p-6 lg:p-8 border border-emerald-900/50 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 border border-emerald-400/30 px-3 py-1 text-xs font-semibold text-emerald-300 mb-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            System Live & Operating
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-outfit text-white">RideWave Executive Control Panel</h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-300">
            Real-time infrastructure analytics, ride operations, user safety enforcement, and financial metrics.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/users"
            className="flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 px-4 py-2.5 text-xs font-semibold text-white transition-colors"
          >
            <UserCheck className="h-4 w-4" />
            <span>Manage Users</span>
          </Link>
          <Link
            href="/admin/complaints"
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-[#C6A76B] hover:opacity-95 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-emerald-950 transition-all"
          >
            <AlertTriangle className="h-4 w-4" />
            <span>Support Tickets ({metrics.support.open})</span>
          </Link>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link
              key={idx}
              href={card.href}
              className={`group relative overflow-hidden rounded-2xl border bg-gradient-to-br ${card.color} p-5 backdrop-blur-md shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl dark:bg-[#0c241e]/90`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-300">
                  {card.title}
                </span>
                <div className="p-2 rounded-xl bg-black/20 text-white group-hover:scale-110 transition-transform">
                  <Icon className="h-4.5 w-4.5" />
                </div>
              </div>
              <div className="mt-3">
                <p className="text-2xl sm:text-3xl font-bold font-outfit text-slate-900 dark:text-white">
                  {card.value}
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 truncate">
                  {card.subtitle}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 30-Day Revenue Trend (2 Columns) */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-md dark:border-emerald-950/60 dark:bg-[#0c241e]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="h-4.5 w-4.5 text-emerald-500" />
                <span>Revenue Performance (Last 30 Days)</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Gross processed ride payments through Stripe & confirmed settlements
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold text-emerald-600 dark:text-[#C6A76B]">
                This Month: ${(metrics.revenue.month || 0).toLocaleString()}
              </span>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueChart} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickFormatter={(val) => `$${val}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0d2620',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                  formatter={(value) => [`$${value}`, 'Revenue']}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10B981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#revenueGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Ride Status Distribution (1 Column) */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md dark:border-emerald-950/60 dark:bg-[#0c241e] flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-1">
              <Car className="h-4.5 w-4.5 text-[#C6A76B]" />
              <span>Ride Lifecycle Overview</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Distribution of rides by operational state
            </p>

            <div className="h-48 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={rideDistribution}
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {rideDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0d2620',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-4 border-t border-slate-100 dark:border-emerald-950/60">
            {rideDistribution.map((r, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: r.color }} />
                <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                  {r.name}: <strong className="text-slate-900 dark:text-white">{r.value}</strong>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Grid: Recent Bookings & Audit Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md dark:border-emerald-950/60 dark:bg-[#0c241e]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CalendarCheck className="h-4.5 w-4.5 text-purple-400" />
              <span>Recent Bookings</span>
            </h2>
            <Link
              href="/admin/bookings"
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 dark:text-[#C6A76B] flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-emerald-950/40">
            {recentBookings && recentBookings.length > 0 ? (
              recentBookings.map((b) => (
                <div key={b.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                  <div className="truncate">
                    <p className="font-semibold text-slate-800 dark:text-slate-100 truncate">
                      {b.traveler?.name || 'Traveler'}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {b.ride?.pickupAddress} → {b.ride?.destinationAddress}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-semibold text-slate-900 dark:text-white">
                      ${b.totalAmount}
                    </p>
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium ${
                        b.status === 'CONFIRMED' || b.status === 'COMPLETED'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300'
                          : b.status === 'CANCELLED'
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300'
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="py-6 text-center text-xs text-slate-500">No bookings recorded yet.</p>
            )}
          </div>
        </div>

        {/* Recent Admin Audit Logs */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md dark:border-emerald-950/60 dark:bg-[#0c241e]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldAlert className="h-4.5 w-4.5 text-emerald-400" />
              <span>Admin Activity Audit Trail</span>
            </h2>
            <Link
              href="/admin/logs"
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 dark:text-[#C6A76B] flex items-center gap-1"
            >
              <span>Full Log</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-emerald-950/40">
            {recentLogs && recentLogs.length > 0 ? (
              recentLogs.map((log) => (
                <div key={log.id} className="py-3 flex items-start justify-between gap-3 text-xs">
                  <div>
                    <span className="font-mono text-[11px] font-semibold text-emerald-600 dark:text-[#C6A76B]">
                      {log.action}
                    </span>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      By {log.adminEmail} • Target: {log.targetType} {log.targetId ? `(${log.targetId.slice(-6)})` : ''}
                    </p>
                  </div>
                  <span className="shrink-0 text-[10px] text-slate-400">
                    {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))
            ) : (
              <p className="py-6 text-center text-xs text-slate-500">No recent audit logs.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


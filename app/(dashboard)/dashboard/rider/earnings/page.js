'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart2, TrendingUp, DollarSign, Car, ArrowUp, ArrowDown, Calendar, Download } from 'lucide-react';
import { format, subDays, eachDayOfInterval, startOfMonth } from 'date-fns';
import toast from 'react-hot-toast';

export default function EarningsPage() {
  const [data, setData] = useState(null);
  const [period, setPeriod] = useState('month');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/rider/earnings?period=${period}`)
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(() => toast.error('Failed to load earnings'))
      .finally(() => setLoading(false));
  }, [period]);

  // Generate chart bars from data
  const chartData = data?.dailyEarnings || Array.from({ length: 30 }, (_, i) => ({
    date: format(subDays(new Date(), 29 - i), 'MMM d'),
    amount: Math.random() * 50 + 5,
  }));
  const maxAmount = Math.max(...chartData.map((d) => d.amount), 1);

  const stats = [
    { label: 'This Month', value: `$${(data?.thisMonth || 0).toFixed(2)}`, icon: Calendar, color: '#6366f1', change: data?.monthGrowth || 0 },
    { label: 'Total Earnings', value: `$${(data?.total || 0).toFixed(2)}`, icon: DollarSign, color: '#10b981' },
    { label: 'Completed Rides', value: data?.completedRides || 0, icon: Car, color: '#8b5cf6' },
    { label: 'Avg per Ride', value: `$${(data?.avgPerRide || 0).toFixed(2)}`, icon: TrendingUp, color: '#f59e0b' },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-outfit font-bold">Earnings <span className="gradient-text">Analytics</span></h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Track your income and performance</p>
        </div>
        <div className="flex gap-2">
          {['week', 'month', 'year'].map((p) => (
            <button key={p} onClick={() => setPeriod(p)}
              className="px-4 py-2 rounded-xl text-xs font-medium border transition-all capitalize"
              style={{ borderColor: period === p ? 'var(--primary)' : 'var(--border)', background: period === p ? 'rgba(99,102,241,0.1)' : 'transparent', color: period === p ? 'var(--primary)' : 'var(--text-secondary)' }}>
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color, change }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="card-premium p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: `${color}20` }}>
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              {change !== undefined && (
                <span className="flex items-center gap-0.5 text-xs font-medium" style={{ color: change >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                  {change >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                  {Math.abs(change).toFixed(1)}%
                </span>
              )}
            </div>
            <div className="text-2xl font-bold font-outfit gradient-text">{value}</div>
            <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{label}</div>
          </motion.div>
        ))}
      </div>

      {/* Earnings Chart */}
      <div className="card-premium p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-lg">Earnings Over Time</h3>
          <button className="btn-ghost text-xs py-2 px-4 border flex items-center gap-2" style={{ borderColor: 'var(--border)' }}>
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
        </div>
        <div className="flex items-end gap-1 h-40">
          {chartData.slice(-30).map((d, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${(d.amount / maxAmount) * 100}%` }}
              transition={{ delay: i * 0.02, duration: 0.4 }}
              className="flex-1 rounded-t-lg cursor-pointer group relative"
              style={{ background: `linear-gradient(180deg, var(--primary), var(--secondary))`, minWidth: 4 }}
              title={`${d.date}: $${d.amount?.toFixed(2)}`}
            >
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-10 transition-opacity">
                ${d.amount?.toFixed(2)}
              </div>
            </motion.div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
          <span>{chartData[0]?.date}</span>
          <span>{chartData[Math.floor(chartData.length / 2)]?.date}</span>
          <span>{chartData[chartData.length - 1]?.date}</span>
        </div>
      </div>

      {/* Recent Payouts */}
      <div className="card-premium p-6">
        <h3 className="font-semibold text-lg mb-4">Recent Payouts</h3>
        {(data?.recentPayouts || []).length === 0 ? (
          <div className="text-center py-8">
            <DollarSign className="w-10 h-10 mx-auto mb-2" style={{ color: 'var(--text-muted)' }} />
            <p style={{ color: 'var(--text-muted)' }}>No payouts yet. Complete rides to earn!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {(data?.recentPayouts || []).map((p, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
                <div>
                  <div className="text-sm font-medium">{p.description}</div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{format(new Date(p.date), 'MMM d, yyyy')}</div>
                </div>
                <div className="text-base font-bold" style={{ color: 'var(--success)' }}>+${p.amount?.toFixed(2)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

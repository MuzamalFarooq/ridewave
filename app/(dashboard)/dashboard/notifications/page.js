'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCheck, Car, CreditCard, Star, MessageSquare, Shield, AlertCircle, Info, Check } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

const iconMap = {
  BOOKING: Car, PAYMENT: CreditCard, REVIEW: Star, MESSAGE: MessageSquare,
  SYSTEM: Info, ALERT: AlertCircle, VERIFICATION: Shield,
};

const colorMap = {
  BOOKING: '#6366f1', PAYMENT: '#10b981', REVIEW: '#f59e0b',
  MESSAGE: '#8b5cf6', SYSTEM: '#64748b', ALERT: '#ef4444', VERIFICATION: '#10b981',
};

export default function NotificationsPage() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    fetch('/api/notifications')
      .then((r) => r.json())
      .then((d) => setNotifications(d.notifications || []))
      .finally(() => setLoading(false));
  }, []);

  const markAllRead = async () => {
    await fetch('/api/notifications', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ markAll: true }) });
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    toast.success('All notifications marked as read');
  };

  const markRead = async (id) => {
    await fetch(`/api/notifications/${id}`, { method: 'PATCH' });
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, isRead: true } : n));
  };

  const filters = ['ALL', 'UNREAD', 'BOOKING', 'PAYMENT', 'MESSAGE', 'SYSTEM'];
  const filtered = notifications.filter((n) => {
    if (filter === 'ALL') return true;
    if (filter === 'UNREAD') return !n.isRead;
    return n.type === filter;
  });
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-outfit font-bold">Notifications</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={markAllRead}
            className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl border"
            style={{ borderColor: 'var(--border)', color: 'var(--primary)' }}
          >
            <CheckCheck className="w-4 h-4" /> Mark all read
          </motion.button>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap mb-6">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-3 py-1.5 rounded-full text-xs font-medium border transition-all"
            style={{
              borderColor: filter === f ? 'var(--primary)' : 'var(--border)',
              background: filter === f ? 'rgba(99,102,241,0.1)' : 'transparent',
              color: filter === f ? 'var(--primary)' : 'var(--text-secondary)',
            }}
          >
            {f}
            {f === 'UNREAD' && unreadCount > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-white font-bold" style={{ background: 'var(--danger)', fontSize: 9 }}>
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Notifications */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="card-premium p-4 flex gap-3">
              <div className="skeleton w-10 h-10 rounded-2xl flex-shrink-0" />
              <div className="flex-1">
                <div className="skeleton h-4 rounded mb-2" style={{ width: '40%' }} />
                <div className="skeleton h-3 rounded" style={{ width: '70%' }} />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <Bell className="w-14 h-14 mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
          <h3 className="font-semibold text-lg mb-1">No notifications</h3>
          <p style={{ color: 'var(--text-muted)' }}>You're all caught up! 🎉</p>
        </div>
      ) : (
        <AnimatePresence>
          <div className="space-y-2">
            {filtered.map((n, i) => {
              const Icon = iconMap[n.type] || Bell;
              const color = colorMap[n.type] || 'var(--primary)';
              return (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => !n.isRead && markRead(n.id)}
                  className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all hover:shadow-md ${!n.isRead ? 'border-[var(--primary)] border-opacity-30' : ''}`}
                  style={{
                    background: !n.isRead ? 'rgba(99,102,241,0.04)' : 'var(--bg-elevated)',
                    borderColor: !n.isRead ? 'rgba(99,102,241,0.2)' : 'var(--border)',
                  }}
                >
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}15` }}>
                    <Icon className="w-5 h-5" style={{ color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-semibold text-sm">{n.title}</div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                          {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                        </span>
                        {!n.isRead && <div className="w-2 h-2 rounded-full" style={{ background: 'var(--primary)' }} />}
                        {n.isRead && <Check className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />}
                      </div>
                    </div>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{n.body}</p>
                    {n.link && (
                      <a href={n.link} className="text-xs font-medium mt-1.5 inline-block" style={{ color: 'var(--primary)' }}>
                        View details →
                      </a>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </AnimatePresence>
      )}
    </div>
  );
}

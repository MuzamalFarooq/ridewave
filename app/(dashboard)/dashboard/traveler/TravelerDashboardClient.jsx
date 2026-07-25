'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { format } from 'date-fns';
import {
  Car, MapPin, Star, CreditCard, Award, Bell, ArrowRight,
  Calendar, CheckCircle, Clock, XCircle, Navigation, TrendingUp
} from 'lucide-react';

const statusConfig = {
  PENDING: { label: 'Pending', color: 'var(--warning)', bg: 'rgba(245,158,11,0.1)', icon: Clock },
  CONFIRMED: { label: 'Confirmed', color: 'var(--success)', bg: 'rgba(16,185,129,0.1)', icon: CheckCircle },
  REJECTED: { label: 'Rejected', color: 'var(--danger)', bg: 'rgba(239,68,68,0.1)', icon: XCircle },
  CANCELLED: { label: 'Cancelled', color: 'var(--danger)', bg: 'rgba(239,68,68,0.1)', icon: XCircle },
  COMPLETED: { label: 'Completed', color: 'var(--primary)', bg: 'rgba(99,102,241,0.1)', icon: CheckCircle },
};

export default function TravelerDashboardClient({ user, bookings, notifications, recentRides, stats, profile }) {
  const statCards = [
    { label: 'Total Bookings', value: stats.totalBookings, icon: Car, color: '#6366f1', suffix: '' },
    { label: 'Rides Completed', value: stats.completedRides, icon: CheckCircle, color: '#10b981', suffix: '' },
    { label: 'Total Spent', value: `$${stats.totalSpent.toFixed(0)}`, icon: CreditCard, color: '#8b5cf6', suffix: '' },
    { label: 'Loyalty Points', value: stats.loyaltyPoints, icon: Award, color: '#f59e0b', suffix: ' pts' },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-outfit font-bold">
            Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0]}! 👋</span>
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            {profile?.city ? `${profile.city} • ` : ''}
            Member since {profile?.joinedAt ? format(new Date(profile.joinedAt), 'MMMM yyyy') : 'recently'}
          </p>
        </div>
        <Link href="/find-ride" className="btn-primary py-2.5 px-5 text-sm">
          <Navigation className="w-4 h-4" /> Find a Ride
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map(({ label, value, icon: Icon, color, suffix }, i) => (
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
            <div className="text-2xl font-bold font-outfit gradient-text">{value}{suffix}</div>
            <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Bookings */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Bookings</h2>
            <Link href="/dashboard/traveler/bookings" className="text-sm font-medium flex items-center gap-1" style={{ color: 'var(--primary)' }}>
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {bookings.length === 0 ? (
              <div className="card-premium p-8 text-center">
                <Car className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
                <h3 className="font-medium mb-2">No bookings yet</h3>
                <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>Start exploring rides near you!</p>
                <Link href="/find-ride" className="btn-primary text-sm py-2 px-5">Find a Ride</Link>
              </div>
            ) : bookings.map((booking, i) => {
              const s = statusConfig[booking.status] || statusConfig.PENDING;
              const StatusIcon = s.icon;
              return (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="card-premium p-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-2xl gradient-primary flex items-center justify-center text-white font-bold flex-shrink-0 overflow-hidden">
                      {booking.ride?.rider?.image
                        ? <img src={booking.ride.rider.image} alt="" className="w-full h-full object-cover" />
                        : booking.ride?.rider?.name?.[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="text-sm font-semibold truncate">
                            {booking.ride?.pickupAddress} → {booking.ride?.destinationAddress}
                          </div>
                          <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                            {booking.ride?.departureDate ? format(new Date(booking.ride.departureDate), 'EEE, MMM d') : '—'} •{' '}
                            {booking.seatsBooked} seat{booking.seatsBooked > 1 ? 's' : ''} •{' '}
                            #{booking.bookingRef}
                          </div>
                        </div>
                        <span
                          className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full flex-shrink-0"
                          style={{ background: s.bg, color: s.color }}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {s.label}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                        <Car className="w-3 h-3" />
                        {booking.ride?.vehicle?.brand} {booking.ride?.vehicle?.model}
                      </div>
                      <div className="text-xs font-semibold gradient-text">
                        ${booking.totalAmount.toFixed(2)}
                      </div>
                    </div>
                    <Link href={`/dashboard/traveler/bookings/${booking.id}`}>
                      <button className="text-xs font-medium px-3 py-1.5 rounded-lg transition-colors hover:bg-[var(--bg-surface)]" style={{ color: 'var(--primary)' }}>
                        View Details
                      </button>
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="card-premium p-5">
            <h3 className="font-semibold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { href: '/find-ride', label: 'Find Ride', icon: Navigation, color: '#6366f1' },
                { href: '/dashboard/traveler/bookings', label: 'Bookings', icon: Calendar, color: '#10b981' },
                { href: '/dashboard/messages', label: 'Messages', icon: MapPin, color: '#8b5cf6' },
                { href: '/dashboard/traveler/favorites', label: 'Favorites', icon: Star, color: '#f59e0b' },
              ].map(({ href, label, icon: Icon, color }) => (
                <Link key={href} href={href}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-3 rounded-xl text-center cursor-pointer transition-all"
                    style={{ background: `${color}10`, border: `1px solid ${color}20` }}
                  >
                    <Icon className="w-5 h-5 mx-auto mb-1" style={{ color }} />
                    <span className="text-xs font-medium" style={{ color }}>{label}</span>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div className="card-premium p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Notifications</h3>
              {notifications.length > 0 && (
                <span className="badge badge-danger" style={{ fontSize: 10 }}>{notifications.length} new</span>
              )}
            </div>
            {notifications.length === 0 ? (
              <div className="text-center py-4">
                <Bell className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--text-muted)' }} />
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>All caught up!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {notifications.map((n) => (
                  <div key={n.id} className="flex gap-2 p-2 rounded-lg" style={{ background: 'var(--bg-surface)' }}>
                    <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: 'var(--primary)' }} />
                    <div>
                      <p className="text-xs font-medium">{n.title}</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{n.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Loyalty Points */}
          <div className="card-premium p-5" style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.1), rgba(251,191,36,0.05))' }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(245,158,11,0.2)' }}>
                <Award className="w-5 h-5" style={{ color: '#f59e0b' }} />
              </div>
              <div>
                <div className="text-lg font-bold" style={{ color: '#f59e0b' }}>{stats.loyaltyPoints} pts</div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Loyalty Rewards</div>
              </div>
            </div>
            <div className="w-full rounded-full h-2 mb-2" style={{ background: 'var(--border)' }}>
              <div
                className="h-2 rounded-full"
                style={{ background: 'linear-gradient(90deg, #f59e0b, #fbbf24)', width: `${Math.min((stats.loyaltyPoints % 500) / 5, 100)}%` }}
              />
            </div>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {500 - (stats.loyaltyPoints % 500)} pts to next reward level
            </p>
          </div>
        </div>
      </div>

      {/* Suggested Rides */}
      {recentRides.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Suggested Rides for You</h2>
            <Link href="/find-ride" className="text-sm font-medium flex items-center gap-1" style={{ color: 'var(--primary)' }}>
              Browse all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentRides.map((ride) => (
              <motion.div key={ride.id} whileHover={{ y: -4 }} className="card-premium p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="text-sm font-semibold">{ride.pickupAddress} → {ride.destinationAddress}</div>
                  <div className="text-base font-bold gradient-text flex-shrink-0 ml-2">${ride.pricePerSeat}</div>
                </div>
                <div className="flex items-center gap-2 text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
                  <Calendar className="w-3 h-3" />
                  {format(new Date(ride.departureDate), 'MMM d')} at {ride.departureTime}
                </div>
                <Link href={`/rides/${ride.id}`}>
                  <button className="btn-primary w-full text-xs py-2">Book Now</button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

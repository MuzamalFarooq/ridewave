'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { format } from 'date-fns';
import {
  Car, Calendar, MapPin, Clock, CheckCircle, XCircle, AlertCircle,
  Loader2, ArrowRight, Filter, Search, QrCode, Star, RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';

const STATUS_CONFIG = {
  PENDING:   { label: 'Pending',   color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',   icon: Clock },
  CONFIRMED: { label: 'Confirmed', color: '#10b981', bg: 'rgba(16,185,129,0.1)',   icon: CheckCircle },
  COMPLETED: { label: 'Completed', color: '#6366f1', bg: 'rgba(99,102,241,0.1)',   icon: CheckCircle },
  CANCELLED: { label: 'Cancelled', color: '#ef4444', bg: 'rgba(239,68,68,0.1)',    icon: XCircle },
  REJECTED:  { label: 'Rejected',  color: '#ef4444', bg: 'rgba(239,68,68,0.1)',    icon: XCircle },
};

function BookingCard({ booking, onCancel, onReview, userRole }) {
  const s = STATUS_CONFIG[booking.status] || STATUS_CONFIG.PENDING;
  const StatusIcon = s.icon;
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="card-premium overflow-hidden"
    >
      {/* Status stripe */}
      <div className="h-1" style={{ background: s.color }} />

      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl gradient-primary flex items-center justify-center text-white font-bold overflow-hidden flex-shrink-0">
              {userRole === 'TRAVELER'
                ? (booking.ride?.rider?.image ? <img src={booking.ride.rider.image} alt="" className="w-full h-full object-cover" /> : booking.ride?.rider?.name?.[0])
                : (booking.traveler?.image ? <img src={booking.traveler.image} alt="" className="w-full h-full object-cover" /> : booking.traveler?.name?.[0])
              }
            </div>
            <div>
              <div className="font-semibold text-sm">
                {userRole === 'TRAVELER' ? booking.ride?.rider?.name : booking.traveler?.name}
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <Star className="w-3 h-3" style={{ color: '#fbbf24', fill: '#fbbf24' }} />
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {booking.ride?.rider?.profile?.averageRating?.toFixed(1) || '4.8'}
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <span className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: s.bg, color: s.color }}>
              <StatusIcon className="w-3 h-3" /> {s.label}
            </span>
            <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>#{booking.bookingRef}</div>
          </div>
        </div>

        {/* Route */}
        <div className="p-3 rounded-xl mb-3" style={{ background: 'var(--bg-surface)' }}>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#10b981' }} />
            <span className="text-sm font-medium truncate">{booking.ride?.pickupAddress}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#ec4899' }} />
            <span className="text-sm font-medium truncate">{booking.ride?.destinationAddress}</span>
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-wrap gap-3 text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {booking.ride?.departureDate ? format(new Date(booking.ride.departureDate), 'EEE, MMM d') : '—'}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" /> {booking.ride?.departureTime || '—'}
          </span>
          <span className="flex items-center gap-1">
            <Car className="w-3 h-3" />
            {booking.ride?.vehicle?.brand} {booking.ride?.vehicle?.model}
          </span>
          <span className="font-semibold gradient-text">${booking.totalAmount?.toFixed(2)}</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 flex-wrap">
          {booking.status === 'CONFIRMED' && (
            <Link href={`/dashboard/traveler/bookings/${booking.id}`}>
              <button className="btn-primary text-xs py-2 px-4">Track Ride</button>
            </Link>
          )}
          {booking.status === 'COMPLETED' && !booking.review && userRole === 'TRAVELER' && (
            <button
              onClick={() => onReview(booking)}
              className="text-xs py-2 px-4 rounded-xl font-semibold"
              style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}
            >
              <Star className="w-3 h-3 inline mr-1" /> Leave Review
            </button>
          )}
          {['PENDING', 'CONFIRMED'].includes(booking.status) && (
            <button
              onClick={() => onCancel(booking.id)}
              className="text-xs py-2 px-4 rounded-xl font-semibold"
              style={{ background: 'rgba(239,68,68,0.08)', color: 'var(--danger)' }}
            >
              Cancel
            </button>
          )}
          <button
            onClick={() => setExpanded(!expanded)}
            className="btn-ghost text-xs py-2 px-3 ml-auto"
          >
            {expanded ? 'Less' : 'Details'} <ArrowRight className={`w-3 h-3 transition-transform ${expanded ? 'rotate-90' : ''}`} />
          </button>
        </div>

        {/* Expanded */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-4 mt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div><span style={{ color: 'var(--text-muted)' }}>Seats:</span> <span className="font-medium">{booking.seatsBooked}</span></div>
                  <div><span style={{ color: 'var(--text-muted)' }}>Payment:</span> <span className="font-medium">{booking.payment?.method || 'Cash'}</span></div>
                  <div><span style={{ color: 'var(--text-muted)' }}>Status:</span> <span className="font-medium" style={{ color: booking.payment?.status === 'COMPLETED' ? 'var(--success)' : 'var(--warning)' }}>{booking.payment?.status || 'Pending'}</span></div>
                  <div><span style={{ color: 'var(--text-muted)' }}>Booked:</span> <span className="font-medium">{format(new Date(booking.createdAt), 'MMM d, HH:mm')}</span></div>
                </div>
                {booking.passengerNotes && (
                  <div className="mt-3 p-3 rounded-xl text-xs" style={{ background: 'var(--bg-surface)' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Notes: </span>{booking.passengerNotes}
                  </div>
                )}
                {booking.qrCode && (
                  <div className="mt-3 text-center">
                    <img src={booking.qrCode} alt="QR Code" className="w-24 h-24 mx-auto rounded-xl" />
                    <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Booking QR Code</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function ReviewModal({ booking, onClose, onSubmit }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId: booking.id, rideId: booking.rideId, rating, comment }),
      });
      if (!res.ok) throw new Error();
      toast.success('Review submitted! Thank you.');
      onSubmit();
      onClose();
    } catch {
      toast.error('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}>
      <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="card-premium p-6 w-full max-w-md">
        <h3 className="font-bold text-lg mb-2">Rate Your Ride</h3>
        <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
          {booking.ride?.pickupAddress} → {booking.ride?.destinationAddress}
        </p>
        <div className="flex justify-center gap-2 mb-6">
          {[1, 2, 3, 4, 5].map((s) => (
            <button key={s} onClick={() => setRating(s)}>
              <Star className="w-10 h-10 transition-all" style={{ color: s <= rating ? '#fbbf24' : 'var(--border)', fill: s <= rating ? '#fbbf24' : 'none', transform: s <= rating ? 'scale(1.1)' : 'scale(1)' }} />
            </button>
          ))}
        </div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience (optional)..."
          rows={3}
          className="input-field w-full mb-4 text-sm"
        />
        <div className="flex gap-3">
          <button onClick={onClose} className="btn-ghost flex-1 py-3">Cancel</button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={submitting}
            className="btn-primary flex-1 py-3"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit Review'}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

export default function BookingsPage() {
  const { data: session } = useSession();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [reviewTarget, setReviewTarget] = useState(null);

  const userRole = session?.user?.role || 'TRAVELER';
  const apiRole = userRole === 'RIDER' ? 'rider' : 'traveler';

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/bookings?role=${apiRole}${statusFilter !== 'ALL' ? `&status=${statusFilter}` : ''}`);
      const data = await res.json();
      setBookings(data.bookings || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, [statusFilter]);

  const handleCancel = async (bookingId) => {
    if (!confirm('Cancel this booking?')) return;
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'CANCEL', reason: 'Cancelled by user' }),
      });
      if (!res.ok) throw new Error();
      toast.success('Booking cancelled');
      fetchBookings();
    } catch {
      toast.error('Failed to cancel booking');
    }
  };

  const filtered = bookings.filter((b) =>
    b.ride?.pickupAddress?.toLowerCase().includes(search.toLowerCase()) ||
    b.ride?.destinationAddress?.toLowerCase().includes(search.toLowerCase()) ||
    b.bookingRef?.toLowerCase().includes(search.toLowerCase())
  );

  const statuses = ['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-outfit font-bold">My Bookings</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{filtered.length} booking{filtered.length !== 1 ? 's' : ''} found</p>
        </div>
        <button onClick={fetchBookings} className="btn-ghost w-9 h-9 p-0 rounded-full">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search by route or reference..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9 text-sm"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className="px-3 py-2 rounded-xl text-xs font-medium border transition-all"
              style={{
                borderColor: statusFilter === s ? 'var(--primary)' : 'var(--border)',
                background: statusFilter === s ? 'rgba(99,102,241,0.1)' : 'transparent',
                color: statusFilter === s ? 'var(--primary)' : 'var(--text-secondary)',
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card-premium p-5">
              <div className="skeleton h-4 rounded mb-3" style={{ width: '40%' }} />
              <div className="skeleton h-16 rounded-xl mb-3" />
              <div className="skeleton h-10 rounded-xl" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <Car className="w-14 h-14 mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
          <h3 className="text-lg font-semibold mb-2">No bookings found</h3>
          <p className="mb-6" style={{ color: 'var(--text-muted)' }}>
            {statusFilter !== 'ALL' ? 'Try a different filter' : userRole === 'TRAVELER' ? 'Book your first ride today!' : 'Publish a ride to receive bookings'}
          </p>
          <Link href={userRole === 'TRAVELER' ? '/find-ride' : '/dashboard/rider/rides/new'} className="btn-primary">
            {userRole === 'TRAVELER' ? 'Find a Ride' : 'Publish a Ride'}
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onCancel={handleCancel}
              onReview={setReviewTarget}
              userRole={userRole}
            />
          ))}
        </div>
      )}

      <AnimatePresence>
        {reviewTarget && (
          <ReviewModal
            booking={reviewTarget}
            onClose={() => setReviewTarget(null)}
            onSubmit={fetchBookings}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { format } from 'date-fns';
import {
  ArrowLeft, Car, MapPin, Calendar, Clock, Users, CheckCircle, XCircle, Phone,
  MessageSquare, QrCode, Star, Loader2, Navigation, Shield
} from 'lucide-react';
import LiveTracker from '@/components/maps/LiveTracker';
import CallModal from '@/components/shared/CallModal';
import toast from 'react-hot-toast';
import QRCode from 'qrcode';

const STATUS_STYLES = {
  PENDING:   { label: 'Pending Approval', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  CONFIRMED: { label: 'Confirmed', color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
  ONGOING:   { label: 'Ride in Progress', color: '#6366f1', bg: 'rgba(99,102,241,0.1)' },
  COMPLETED: { label: 'Completed', color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
  CANCELLED: { label: 'Cancelled', color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
  REJECTED:  { label: 'Rejected', color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
};

export default function BookingDetailPage({ params }) {
  const { id } = use(params);
  const { data: session } = useSession();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [showCall, setShowCall] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetch(`/api/bookings/${id}`)
      .then((r) => r.json())
      .then(async (d) => {
        setBooking(d.booking);
        // Generate QR code image
        if (d.booking?.bookingRef) {
          try {
            const url = await QRCode.toDataURL(
              JSON.stringify({ ref: d.booking.bookingRef, seats: d.booking.seatsBooked }),
              { width: 200, margin: 2, color: { dark: '#1a1a2e', light: '#ffffff' } }
            );
            setQrDataUrl(url);
          } catch {}
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleCancel = async () => {
    if (!confirm('Cancel this booking? This action cannot be undone.')) return;
    setCancelling(true);
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'CANCEL', reason: 'Cancelled by traveler' }),
      });
      if (!res.ok) throw new Error();
      toast.success('Booking cancelled');
      setBooking((b) => ({ ...b, status: 'CANCELLED' }));
    } catch {
      toast.error('Failed to cancel booking');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--primary)' }} />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p>Booking not found.</p>
        <Link href="/dashboard/traveler/bookings" className="btn-primary">Back to Bookings</Link>
      </div>
    );
  }

  const s = STATUS_STYLES[booking.status] || STATUS_STYLES.PENDING;
  const otherUser = booking.ride?.rider;
  const isActive = ['CONFIRMED', 'ONGOING'].includes(booking.status);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <Link href="/dashboard/traveler/bookings" className="inline-flex items-center gap-2 mb-6 text-sm" style={{ color: 'var(--text-muted)' }}>
        <ArrowLeft className="w-4 h-4" /> Back to Bookings
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-5">
          {/* Status Card */}
          <div className="card-premium p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-xl font-bold">Booking #{booking.bookingRef}</h1>
                <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  Booked {format(new Date(booking.createdAt), 'MMM d, yyyy')}
                </p>
              </div>
              <span className="flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-full"
                style={{ background: s.bg, color: s.color }}>
                {s.label}
              </span>
            </div>

            {/* Route */}
            <div className="p-4 rounded-2xl mb-4" style={{ background: 'var(--bg-surface)' }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-3 h-3 rounded-full" style={{ background: '#10b981' }} />
                <span className="font-semibold">{booking.ride?.pickupAddress}</span>
              </div>
              <div className="ml-1.5 pl-4 border-l border-dashed py-1" style={{ borderColor: 'var(--border)' }}>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {booking.ride?.departureDate ? format(new Date(booking.ride.departureDate), 'EEEE, MMMM d') : ''} at {booking.ride?.departureTime}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ background: '#ec4899' }} />
                <span className="font-semibold">{booking.ride?.destinationAddress}</span>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: Users, label: 'Seats', value: booking.seatsBooked },
                { icon: Car, label: 'Vehicle', value: `${booking.ride?.vehicle?.brand} ${booking.ride?.vehicle?.model}` },
                { icon: Clock, label: 'Payment', value: booking.payment?.method || 'Cash' },
                { icon: CheckCircle, label: 'Amount', value: `$${booking.totalAmount?.toFixed(2)}` },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="text-center p-3 rounded-xl" style={{ background: 'var(--bg-surface)' }}>
                  <Icon className="w-5 h-5 mx-auto mb-1" style={{ color: 'var(--primary)' }} />
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</div>
                  <div className="text-sm font-semibold mt-0.5 truncate">{String(value)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Live Tracking (if active) */}
          {isActive && (
            <div className="card-premium p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#10b981' }} />
                <h3 className="font-semibold">Live Tracking</h3>
              </div>
              <LiveTracker
                rideId={booking.rideId}
                riderId={booking.ride?.riderId}
                isRider={false}
                pickupCoords={booking.ride?.pickupLat ? { lat: booking.ride.pickupLat, lng: booking.ride.pickupLng } : null}
                destinationCoords={booking.ride?.destinationLat ? { lat: booking.ride.destinationLat, lng: booking.ride.destinationLng } : null}
              />
            </div>
          )}

          {/* Driver Info */}
          <div className="card-premium p-5">
            <h3 className="font-semibold mb-4">Driver Information</h3>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center text-white font-bold text-xl overflow-hidden">
                {otherUser?.image ? <img src={otherUser.image} alt="" className="w-full h-full object-cover" /> : otherUser?.name?.[0]}
              </div>
              <div className="flex-1">
                <div className="font-bold">{otherUser?.name}</div>
                <div className="flex items-center gap-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <Star className="w-3.5 h-3.5" style={{ fill: '#fbbf24', color: '#fbbf24' }} />
                  {otherUser?.profile?.averageRating?.toFixed(1) || 'New'}
                </div>
              </div>
              {isActive && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowCall(true)}
                    className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center"
                  >
                    <Phone className="w-4 h-4 text-white" />
                  </button>
                  <Link href="/dashboard/messages">
                    <button className="w-10 h-10 rounded-full flex items-center justify-center border" style={{ borderColor: 'var(--border)' }}>
                      <MessageSquare className="w-4 h-4" />
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar: QR + Actions */}
        <div className="space-y-5">
          {/* QR Code Ticket */}
          <div className="card-premium p-5 text-center">
            <h3 className="font-semibold mb-4 flex items-center justify-center gap-2">
              <QrCode className="w-4 h-4" style={{ color: 'var(--primary)' }} /> Digital Ticket
            </h3>
            {qrDataUrl ? (
              <div className="p-3 rounded-xl inline-block mb-3" style={{ background: 'white' }}>
                <img src={qrDataUrl} alt="Booking QR" className="w-40 h-40 mx-auto" />
              </div>
            ) : (
              <div className="w-40 h-40 mx-auto rounded-xl mb-3 flex items-center justify-center" style={{ background: 'var(--bg-surface)' }}>
                <QrCode className="w-10 h-10" style={{ color: 'var(--text-muted)' }} />
              </div>
            )}
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Show this to your driver to verify your booking</p>
            <div className="mt-3 font-mono font-bold text-lg gradient-text">{booking.bookingRef}</div>
          </div>

          {/* Payment Status */}
          <div className="card-premium p-5">
            <h3 className="font-semibold mb-3">Payment</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-muted)' }}>Base fare</span>
                <span>${(booking.totalAmount - booking.platformFee).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-muted)' }}>Platform fee</span>
                <span>${booking.platformFee?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
                <span>Total</span>
                <span className="gradient-text">${booking.totalAmount?.toFixed(2)}</span>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs" style={{ color: booking.payment?.status === 'COMPLETED' ? 'var(--success)' : 'var(--warning)' }}>
              {booking.payment?.status === 'COMPLETED' ? <CheckCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
              {booking.payment?.status || 'Pending'}
            </div>
          </div>

          {/* Actions */}
          {['PENDING', 'CONFIRMED'].includes(booking.status) && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCancel}
              disabled={cancelling}
              className="w-full py-3 rounded-2xl font-semibold text-sm"
              style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--danger)' }}
            >
              {cancelling ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : '✕ Cancel Booking'}
            </motion.button>
          )}

          {booking.status === 'COMPLETED' && !booking.review && (
            <Link href="/dashboard/traveler/bookings">
              <button className="w-full btn-primary py-3 text-sm">
                <Star className="w-4 h-4" /> Leave Review
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* Call Modal */}
      {showCall && (
        <CallModal
          targetUserId={otherUser?.id}
          targetUserName={otherUser?.name}
          targetUserImage={otherUser?.image}
          rideId={booking.rideId}
          onClose={() => setShowCall(false)}
        />
      )}
    </div>
  );
}

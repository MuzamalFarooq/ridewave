'use client';

import { useState, useEffect, use } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  MapPin, Navigation, Calendar, Clock, Users, Star, Shield, Car,
  MessageSquare, ArrowLeft, Zap, CheckCircle, AlertCircle, Loader2,
  ChevronRight, CreditCard, Lock, Package, Cigarette, Dog, UserCheck,
  Phone, Info, X, QrCode
} from 'lucide-react';
import { format } from 'date-fns';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import toast from 'react-hot-toast';
import { calculateFareEstimate } from '@/lib/ai';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

// ========================
// Stripe Payment Form
// ========================
function StripePayForm({ clientSecret, onSuccess, amount }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handlePay = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: { return_url: `${window.location.origin}/dashboard/traveler/bookings` },
        redirect: 'if_required',
      });
      if (error) {
        toast.error(error.message);
      } else if (paymentIntent?.status === 'succeeded') {
        toast.success('Payment successful!');
        onSuccess();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handlePay}>
      <PaymentElement className="mb-4" />
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={loading || !stripe}
        className="btn-primary w-full py-3"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : `Pay PKR ${(amount * 280).toLocaleString()}`}
      </motion.button>
    </form>
  );
}

// ========================
// Main Ride Detail Page
// ========================
export default function RideDetailPage({ params }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const { data: session } = useSession();
  const router = useRouter();

  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [seatsBooked, setSeatsBooked] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [couponCode, setCouponCode] = useState('');
  const [passengerNotes, setPassengerNotes] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [booking, setBooking] = useState(null);
  const [fareEstimate, setFareEstimate] = useState(null);

  useEffect(() => {
    const fetchRide = async () => {
      try {
        const res = await fetch(`/api/rides/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setRide(data.ride);

        // Calculate fare estimate
        if (data.ride.distanceKm && data.ride.vehicle) {
          const estimate = calculateFareEstimate({
            distanceKm: data.ride.distanceKm,
            durationMinutes: data.ride.durationMinutes,
            vehicleType: data.ride.vehicle.vehicleType,
            fuelType: data.ride.vehicle.fuelType,
            seats: data.ride.availableSeats,
            isInstant: data.ride.instantBooking,
          });
          setFareEstimate(estimate);
        }
      } catch (err) {
        toast.error('Failed to load ride details');
      } finally {
        setLoading(false);
      }
    };
    fetchRide();
  }, [id]);

  const totalAmount = ride ? ride.pricePerSeat * seatsBooked : 0;

  const handleBook = async () => {
    if (!session) { router.push('/auth/login'); return; }
    setBookingLoading(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rideId: ride.id, seatsBooked, paymentMethod,
          couponCode: couponCode || null, passengerNotes,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setBooking(data.booking);
      if (paymentMethod === 'STRIPE' && data.clientSecret) {
        setClientSecret(data.clientSecret);
      } else {
        toast.success('🎉 Booking confirmed!');
        router.push(`/dashboard/traveler/bookings/${data.booking.id}`);
      }
    } catch (err) {
      toast.error(err.message || 'Booking failed');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4" style={{ color: 'var(--primary)' }} />
          <p style={{ color: 'var(--text-muted)' }}>Loading ride details...</p>
        </div>
      </div>
    );
  }

  if (!ride) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-xl font-semibold mb-2">Ride Not Found</h2>
          <Link href="/find-ride" className="btn-primary mt-4">Back to Search</Link>
        </div>
      </div>
    );
  }

  const bookedSeats = ride.bookedSeats || 0;
  const availableNow = ride.availableSeats - bookedSeats;

  return (
    <div className="min-h-screen pt-20" style={{ background: 'var(--bg-base)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back */}
        <Link href="/find-ride" className="inline-flex items-center gap-2 mb-6 text-sm transition-colors hover:text-[var(--primary)]" style={{ color: 'var(--text-muted)' }}>
          <ArrowLeft className="w-4 h-4" /> Back to Search
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Route Card */}
            <div className="card-premium p-6">
              <div className="flex items-center gap-2 mb-6">
                {ride.isFeatured && <span className="badge badge-warning">⭐ Featured</span>}
                {ride.instantBooking && <span className="badge badge-success"><Zap className="w-3 h-3" /> Instant Book</span>}
                {ride.womenOnly && <span className="badge badge-primary">👩 Women Only</span>}
              </div>

              {/* Route Display */}
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center gap-1 pt-1">
                  <div className="w-4 h-4 rounded-full border-3" style={{ borderColor: 'var(--success)', borderWidth: 3 }} />
                  <div className="w-0.5 flex-1 min-h-12 border-l-2 border-dashed" style={{ borderColor: 'var(--border)' }} />
                  {ride.stops?.length > 0 && ride.stops.map((stop, i) => (
                    <div key={i} className="w-3 h-3 rounded-full" style={{ background: 'var(--warning)' }} />
                  ))}
                  <div className="w-4 h-4 rounded-full" style={{ background: 'var(--accent)' }} />
                </div>

                <div className="flex-1">
                  <div className="mb-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-bold">{ride.pickupAddress}</h2>
                        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{ride.departureTime} departure</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{ride.departureDate ? format(new Date(ride.departureDate), 'EEE, MMM d, yyyy') : 'TBD'}</p>
                      </div>
                    </div>
                  </div>

                  {ride.stops?.map((stop, i) => (
                    <div key={i} className="mb-6">
                      <h3 className="font-medium text-sm">{stop.address}</h3>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Stop {i + 1}</p>
                    </div>
                  ))}

                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold">{ride.destinationAddress}</h2>
                      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                        {ride.estimatedArrival || `~${ride.durationMinutes ? Math.round(ride.durationMinutes / 60) + 'h' : 'ETA TBD'}`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
                {[
                  { label: 'Distance', value: ride.distanceKm ? `${ride.distanceKm.toFixed(0)} km` : '—' },
                  { label: 'Duration', value: ride.durationMinutes ? `${Math.floor(ride.durationMinutes/60)}h ${ride.durationMinutes%60}m` : '—' },
                  { label: 'Available', value: `${availableNow} seat${availableNow !== 1 ? 's' : ''}` },
                ].map(({ label, value }) => (
                  <div key={label} className="text-center">
                    <div className="text-lg font-bold gradient-text">{value}</div>
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Map placeholder */}
            <div className="card-premium overflow-hidden">
              <div className="h-64 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #1a1a2e, #0f3460)' }}>
                <div className="text-center text-white">
                  <MapPin className="w-12 h-12 mx-auto mb-3 animate-bounce-subtle" style={{ color: 'var(--primary-light)' }} />
                  <p className="text-sm opacity-75">Interactive map loads with Google Maps API key</p>
                  <p className="text-xs mt-1 opacity-50">{ride.pickupAddress} → {ride.destinationAddress}</p>
                </div>
              </div>
            </div>

            {/* Driver Info */}
            <div className="card-premium p-6">
              <h3 className="font-semibold text-lg mb-4">Your Driver</h3>
              <div className="flex items-start gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
                    {ride.rider?.image
                      ? <img src={ride.rider.image} alt={ride.rider.name} className="w-full h-full object-cover" />
                      : ride.rider?.name?.[0]}
                  </div>
                  {ride.rider?.profile?.isRiderVerified && (
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center" style={{ background: 'var(--success)' }}>
                      <Shield className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-bold text-lg">{ride.rider?.name}</h4>
                    {ride.rider?.profile?.isIdVerified && <span className="badge badge-success" style={{ fontSize: 10 }}>ID Verified</span>}
                  </div>
                  <div className="flex items-center gap-3 mt-1 mb-3">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4" style={{
                          color: '#fbbf24',
                          fill: i < Math.round(ride.rider?.profile?.averageRating || 0) ? '#fbbf24' : 'none'
                        }} />
                      ))}
                      <span className="text-sm font-semibold ml-1">{ride.rider?.profile?.averageRating?.toFixed(1) || '—'}</span>
                    </div>
                    <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                      {ride.rider?.profile?.totalTrips || 0} trips
                    </span>
                  </div>
                  {ride.rider?.profile?.bio && (
                    <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>{ride.rider.profile.bio}</p>
                  )}
                  <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                    <Clock className="w-3.5 h-3.5" />
                    Member since {ride.rider?.profile?.joinedAt ? format(new Date(ride.rider.profile.joinedAt), 'MMM yyyy') : '—'}
                  </div>
                </div>
              </div>
            </div>

            {/* Vehicle Info */}
            <div className="card-premium p-6">
              <h3 className="font-semibold text-lg mb-4">Vehicle</h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(99,102,241,0.1)' }}>
                  <Car className="w-8 h-8" style={{ color: 'var(--primary)' }} />
                </div>
                <div>
                  <div className="font-bold">{ride.vehicle?.brand} {ride.vehicle?.model} {ride.vehicle?.year}</div>
                  <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    {ride.vehicle?.vehicleType} • {ride.vehicle?.fuelType} • {ride.vehicle?.transmission}
                  </div>
                </div>
              </div>
              {ride.vehicle?.amenities?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {ride.vehicle.amenities.map((a) => (
                    <span key={a} className="badge" style={{ background: 'var(--bg-surface)', color: 'var(--text-secondary)' }}>
                      {a}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Ride Rules */}
            <div className="card-premium p-6">
              <h3 className="font-semibold text-lg mb-4">Ride Rules & Preferences</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Package, label: 'Luggage', allowed: ride.luggageAllowed },
                  { icon: Cigarette, label: 'Smoking', allowed: ride.smokingAllowed },
                  { icon: Dog, label: 'Pets', allowed: ride.petsAllowed },
                  { icon: UserCheck, label: 'Women Only', allowed: ride.womenOnly, info: true },
                ].map(({ icon: Icon, label, allowed, info }) => (
                  <div key={label} className={`flex items-center gap-3 p-3 rounded-xl ${info && allowed ? 'border' : ''}`}
                    style={{ background: 'var(--bg-surface)', borderColor: info && allowed ? 'var(--primary)' : 'transparent' }}
                  >
                    <Icon className="w-5 h-5" style={{ color: allowed ? 'var(--success)' : 'var(--danger)' }} />
                    <span className="text-sm">{label}</span>
                    {allowed
                      ? <CheckCircle className="w-4 h-4 ml-auto" style={{ color: 'var(--success)' }} />
                      : <X className="w-4 h-4 ml-auto" style={{ color: 'var(--danger)' }} />
                    }
                  </div>
                ))}
              </div>
              {ride.rules && (
                <div className="mt-4 p-4 rounded-xl text-sm" style={{ background: 'var(--bg-surface)', color: 'var(--text-secondary)' }}>
                  <p className="font-medium mb-1" style={{ color: 'var(--text-primary)' }}>Additional Rules:</p>
                  <p>{ride.rules}</p>
                </div>
              )}
            </div>

            {/* Reviews */}
            {ride.reviews?.length > 0 && (
              <div className="card-premium p-6">
                <h3 className="font-semibold text-lg mb-4">Recent Reviews ({ride._count?.reviews || 0})</h3>
                <div className="space-y-4">
                  {ride.reviews.slice(0, 3).map((review) => (
                    <div key={review.id} className="flex gap-3 pb-4 border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
                      <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        {review.author?.name?.[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold">{review.author?.name}</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-3 h-3" style={{ color: '#fbbf24', fill: i < review.rating ? '#fbbf24' : 'none' }} />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{review.comment}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <div className="card-premium p-6">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold gradient-text">PKR {(ride.pricePerSeat * 280).toLocaleString()}</div>
                  <div className="text-sm" style={{ color: 'var(--text-muted)' }}>per seat</div>
                </div>

                {fareEstimate && fareEstimate.isSurge && (
                  <div className="flex items-center gap-2 p-3 rounded-xl mb-4" style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}>
                    <Zap className="w-4 h-4" style={{ color: 'var(--warning)' }} />
                    <span className="text-xs" style={{ color: 'var(--warning)' }}>Surge pricing active ({fareEstimate.surgeMultiplier}x)</span>
                  </div>
                )}

                {/* Seat Selector */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Seats to book</label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSeatsBooked((s) => Math.max(1, s - 1))}
                      className="w-10 h-10 rounded-xl border flex items-center justify-center font-bold text-lg transition-all hover:border-[var(--primary)]"
                      style={{ borderColor: 'var(--border)' }}
                    >−</button>
                    <div className="flex-1 text-center text-2xl font-bold gradient-text">{seatsBooked}</div>
                    <button
                      onClick={() => setSeatsBooked((s) => Math.min(availableNow, s + 1))}
                      disabled={seatsBooked >= availableNow}
                      className="w-10 h-10 rounded-xl border flex items-center justify-center font-bold text-lg transition-all hover:border-[var(--primary)] disabled:opacity-40"
                      style={{ borderColor: 'var(--border)' }}
                    >+</button>
                  </div>
                  <p className="text-xs text-center mt-2" style={{ color: 'var(--text-muted)' }}>{availableNow} seats available</p>
                </div>

                {/* Coupon */}
                <div className="mb-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Promo code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      className="input-field text-sm flex-1"
                    />
                    <button className="btn-ghost text-sm px-3 border" style={{ borderColor: 'var(--border)' }}>Apply</button>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Payment</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: 'CASH', label: '💵 Cash' },
                      { value: 'STRIPE', label: '💳 Card' },
                      { value: 'JAZZCASH', label: '📱 Jazz' },
                    ].map(({ value, label }) => (
                      <button
                        key={value}
                        onClick={() => setPaymentMethod(value)}
                        className="py-2 px-2 rounded-xl text-xs font-medium border transition-all"
                        style={{
                          borderColor: paymentMethod === value ? 'var(--primary)' : 'var(--border)',
                          background: paymentMethod === value ? 'rgba(99,102,241,0.1)' : 'transparent',
                          color: paymentMethod === value ? 'var(--primary)' : 'var(--text-secondary)',
                        }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Total */}
                <div className="p-4 rounded-xl mb-4" style={{ background: 'var(--bg-surface)' }}>
                  <div className="flex justify-between text-sm mb-1">
                    <span style={{ color: 'var(--text-muted)' }}>PKR {(ride.pricePerSeat * 280).toLocaleString()} × {seatsBooked} seat{seatsBooked > 1 ? 's' : ''}</span>
                    <span>PKR {(ride.pricePerSeat * 280 * seatsBooked).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                    <span style={{ color: 'var(--text-muted)' }}>Platform fee</span>
                    <span>PKR {Math.round(ride.pricePerSeat * 280 * seatsBooked * 0.08).toLocaleString()}</span>
                  </div>
                  <div className="border-t pt-2 mt-2 flex justify-between font-bold" style={{ borderColor: 'var(--border)' }}>
                    <span>Total</span>
                    <span className="gradient-text">PKR {Math.round(ride.pricePerSeat * 280 * seatsBooked * 1.08).toLocaleString()}</span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleBook}
                  disabled={bookingLoading || availableNow === 0}
                  className="btn-primary w-full py-3 text-base"
                >
                  {bookingLoading
                    ? <Loader2 className="w-5 h-5 animate-spin" />
                    : availableNow === 0
                    ? 'Fully Booked'
                    : ride.instantBooking ? '⚡ Book Instantly' : 'Request Booking'
                  }
                </motion.button>

                <div className="flex items-center gap-2 justify-center mt-3 text-xs" style={{ color: 'var(--text-muted)' }}>
                  <Lock className="w-3 h-3" />
                  Secure booking with full refund protection
                </div>
              </div>

              {/* AI Fare Estimate */}
              {fareEstimate && (
                <div className="card-premium p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-lg gradient-primary flex items-center justify-center">
                      <Zap className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-sm font-semibold">AI Fare Analysis</span>
                  </div>
                  <div className="space-y-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                    <div className="flex justify-between">
                      <span>Market range</span>
                      <span>PKR {(fareEstimate.suggestedMin * 280).toFixed(0)}–{(fareEstimate.suggestedMax * 280).toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>This ride</span>
                      <span className={totalAmount * 280 <= fareEstimate.suggestedMax * 280 ? 'text-green-500' : 'text-yellow-500'}>
                        {totalAmount * 280 <= fareEstimate.suggestedMin * 280 * seatsBooked ? '✅ Great deal!' : '📊 Fair price'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stripe Payment Modal */}
      <AnimatePresence>
        {clientSecret && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="card-premium p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg">Complete Payment</h3>
                <button onClick={() => setClientSecret('')} className="btn-ghost w-8 h-8 p-0 rounded-full">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <StripePayForm
                  clientSecret={clientSecret}
                  amount={totalAmount}
                  onSuccess={() => {
                    setClientSecret('');
                    router.push(`/dashboard/traveler/bookings`);
                  }}
                />
              </Elements>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

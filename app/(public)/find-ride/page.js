'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Search, MapPin, Navigation, Calendar, Users, Filter, X,
  Star, Car, Bike, Zap, Clock, ChevronDown, SlidersHorizontal,
  Shield, ArrowRight, Loader2, AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';

function RideCard({ ride }) {
  const amenityIcons = { 'AC': '❄️', 'WiFi': '📶', 'Music': '🎵', 'Luggage': '🧳' };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, boxShadow: 'var(--shadow-lg)' }}
      className="card-premium overflow-hidden"
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-white font-bold text-lg overflow-hidden">
                {ride.rider?.image
                  ? <img src={ride.rider.image} alt={ride.rider.name} className="w-full h-full object-cover" />
                  : ride.rider?.name?.[0] || 'R'}
              </div>
              {ride.rider?.profile?.isRiderVerified && (
                <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: 'var(--success)' }}>
                  <Shield className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
            <div>
              <div className="font-semibold text-sm">{ride.rider?.name || 'Verified Rider'}</div>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3" style={{ color: '#fbbf24', fill: '#fbbf24' }} />
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {ride.rider?.profile?.averageRating?.toFixed(1) || '4.8'} ({ride.rider?.profile?.totalReviews || 0} reviews)
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold gradient-text">
              PKR {(ride.pricePerSeat * 280).toLocaleString()}
            </div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>per seat</div>
          </div>
        </div>

        {/* Route */}
        <div className="flex items-start gap-3 mb-4">
          <div className="flex flex-col items-center gap-1 mt-1">
            <div className="w-3 h-3 rounded-full border-2" style={{ borderColor: 'var(--success)', background: 'transparent' }} />
            <div className="w-0.5 h-8 border-l-2 border-dashed" style={{ borderColor: 'var(--border)' }} />
            <div className="w-3 h-3 rounded-full" style={{ background: 'var(--accent)' }} />
          </div>
          <div className="flex-1">
            <div className="mb-3">
              <div className="font-semibold text-sm">{ride.pickupAddress}</div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{ride.departureTime}</div>
            </div>
            <div>
              <div className="font-semibold text-sm">{ride.destinationAddress}</div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {ride.estimatedArrival || '~' + (ride.durationMinutes ? Math.round(ride.durationMinutes / 60) + 'h' : 'ETA TBD')}
              </div>
            </div>
          </div>
        </div>

        {/* Info Strip */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full" style={{ background: 'var(--bg-surface)' }}>
            <Calendar className="w-3 h-3" style={{ color: 'var(--primary)' }} />
            {ride.departureDate ? format(new Date(ride.departureDate), 'EEE, MMM d') : 'Today'}
          </span>
          <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full" style={{ background: 'var(--bg-surface)' }}>
            <Users className="w-3 h-3" style={{ color: 'var(--primary)' }} />
            {ride.availableSeats} seat{ride.availableSeats !== 1 ? 's' : ''} left
          </span>
          <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full" style={{ background: 'var(--bg-surface)' }}>
            <Car className="w-3 h-3" style={{ color: 'var(--primary)' }} />
            {ride.vehicle?.brand} {ride.vehicle?.model}
          </span>
          {ride.distanceKm && (
            <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'var(--bg-surface)', color: 'var(--text-muted)' }}>
              📍 {ride.distanceKm.toFixed(0)} km
            </span>
          )}
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {ride.instantBooking && <span className="badge badge-success" style={{ fontSize: 10 }}><Zap className="w-2.5 h-2.5" /> Instant</span>}
          {ride.womenOnly && <span className="badge badge-primary" style={{ fontSize: 10 }}>👩 Women Only</span>}
          {ride.luggageAllowed && <span className="badge" style={{ fontSize: 10, background: 'var(--bg-surface)', color: 'var(--text-muted)' }}>🧳 Luggage</span>}
          {ride.petsAllowed && <span className="badge" style={{ fontSize: 10, background: 'var(--bg-surface)', color: 'var(--text-muted)' }}>🐾 Pets OK</span>}
          {ride.vehicle?.amenities?.map((a) => (
            <span key={a} className="badge" style={{ fontSize: 10, background: 'var(--bg-surface)', color: 'var(--text-muted)' }}>
              {amenityIcons[a] || '•'} {a}
            </span>
          ))}
        </div>

        {/* Action */}
        <div className="flex gap-3">
          <Link href={`/rides/${ride.id}`} className="flex-1">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary w-full py-2.5 text-sm"
            >
              Book Now <ArrowRight className="w-4 h-4" />
            </motion.button>
          </Link>
          <Link href={`/rides/${ride.id}`}>
            <button className="btn-ghost px-4 py-2.5 text-sm border" style={{ borderColor: 'var(--border)' }}>
              Details
            </button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

function FilterPanel({ filters, setFilters, onClose }) {
  const vehicleTypes = ['CAR', 'BIKE', 'VAN', 'BUS'];
  const ratings = [4.5, 4.0, 3.5, 3.0];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="card-premium p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5" style={{ color: 'var(--primary)' }} />
          Filters
        </h3>
        <button onClick={onClose} className="btn-ghost w-8 h-8 p-0 rounded-full lg:hidden">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-6">
        {/* Vehicle Type */}
        <div>
          <label className="block text-sm font-semibold mb-3">Vehicle Type</label>
          <div className="grid grid-cols-2 gap-2">
            {vehicleTypes.map((type) => (
              <button
                key={type}
                onClick={() => setFilters((f) => ({ ...f, vehicleType: f.vehicleType === type ? '' : type }))}
                className="py-2 px-3 rounded-xl text-xs font-medium border transition-all"
                style={{
                  borderColor: filters.vehicleType === type ? 'var(--primary)' : 'var(--border)',
                  background: filters.vehicleType === type ? 'rgba(99,102,241,0.1)' : 'var(--bg-surface)',
                  color: filters.vehicleType === type ? 'var(--primary)' : 'var(--text-secondary)',
                }}
              >
                {type === 'CAR' ? '🚗' : type === 'BIKE' ? '🏍️' : type === 'VAN' ? '🚐' : '🚌'} {type}
              </button>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-semibold mb-3">Max Price (PKR)</label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="0"
              max="5000"
              step="100"
              value={filters.maxPrice || 5000}
              onChange={(e) => setFilters((f) => ({ ...f, maxPrice: e.target.value }))}
              className="flex-1"
              style={{ accentColor: 'var(--primary)' }}
            />
            <span className="text-sm font-semibold w-16 text-right" style={{ color: 'var(--primary)' }}>
              {Number(filters.maxPrice || 5000).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Min Rating */}
        <div>
          <label className="block text-sm font-semibold mb-3">Minimum Rating</label>
          <div className="space-y-2">
            {ratings.map((r) => (
              <button
                key={r}
                onClick={() => setFilters((f) => ({ ...f, minRating: f.minRating === r ? null : r }))}
                className="w-full flex items-center gap-2 py-2 px-3 rounded-xl text-sm border transition-all"
                style={{
                  borderColor: filters.minRating === r ? 'var(--primary)' : 'var(--border)',
                  background: filters.minRating === r ? 'rgba(99,102,241,0.1)' : 'transparent',
                }}
              >
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5" style={{ color: i < r ? '#fbbf24' : 'var(--border)', fill: i < r ? '#fbbf24' : 'none' }} />
                  ))}
                </div>
                <span style={{ color: 'var(--text-secondary)' }}>{r}+ stars</span>
              </button>
            ))}
          </div>
        </div>

        {/* Toggles */}
        <div>
          <label className="block text-sm font-semibold mb-3">Preferences</label>
          <div className="space-y-3">
            {[
              { key: 'instantBooking', label: '⚡ Instant Booking' },
              { key: 'womenOnly', label: '👩 Women Only' },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center justify-between cursor-pointer">
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{label}</span>
                <div
                  onClick={() => setFilters((f) => ({ ...f, [key]: !f[key] }))}
                  className="w-10 h-5 rounded-full transition-all cursor-pointer relative"
                  style={{ background: filters[key] ? 'var(--primary)' : 'var(--border)' }}
                >
                  <div
                    className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all"
                    style={{ left: filters[key] ? '22px' : '2px' }}
                  />
                </div>
              </label>
            ))}
          </div>
        </div>

        <button
          onClick={() => setFilters({ vehicleType: '', maxPrice: '', minRating: null, instantBooking: false, womenOnly: false })}
          className="btn-ghost w-full text-sm"
          style={{ color: 'var(--danger)' }}
        >
          Clear All Filters
        </button>
      </div>
    </motion.div>
  );
}

function FindRideContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState({
    pickup: searchParams.get('pickup') || '',
    destination: searchParams.get('destination') || '',
    date: searchParams.get('date') || format(new Date(), 'yyyy-MM-dd'),
    seats: searchParams.get('seats') || '1',
  });
  const [filters, setFilters] = useState({ vehicleType: '', maxPrice: '', minRating: null, instantBooking: false, womenOnly: false });
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [showFilters, setShowFilters] = useState(false);

  const fetchRides = useCallback(async (page = 1) => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({
        ...search,
        ...Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== '' && v !== null && v !== false)),
        page: String(page),
        limit: '12',
      });

      const res = await fetch(`/api/rides?${params}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.message);
      setRides(page === 1 ? data.rides : (prev) => [...prev, ...data.rides]);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.message || 'Failed to load rides');
    } finally {
      setLoading(false);
    }
  }, [search, filters]);

  useEffect(() => { fetchRides(1); }, [fetchRides]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchRides(1);
  };

  return (
    <div className="min-h-screen pt-20" style={{ background: 'var(--bg-base)' }}>
      {/* Search Bar */}
      <div className="sticky top-16 z-30 border-b" style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <form onSubmit={handleSearch} className="flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-40">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--primary)' }} />
                <input
                  type="text"
                  placeholder="From"
                  value={search.pickup}
                  onChange={(e) => setSearch((s) => ({ ...s, pickup: e.target.value }))}
                  className="input-field pl-9 text-sm"
                />
              </div>
            </div>
            <div className="flex-1 min-w-40">
              <div className="relative">
                <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--accent)' }} />
                <input
                  type="text"
                  placeholder="To"
                  value={search.destination}
                  onChange={(e) => setSearch((s) => ({ ...s, destination: e.target.value }))}
                  className="input-field pl-9 text-sm"
                />
              </div>
            </div>
            <div>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--primary)' }} />
                <input
                  type="date"
                  value={search.date}
                  onChange={(e) => setSearch((s) => ({ ...s, date: e.target.value }))}
                  className="input-field pl-9 text-sm"
                  style={{ minWidth: 140 }}
                />
              </div>
            </div>
            <div>
              <select
                value={search.seats}
                onChange={(e) => setSearch((s) => ({ ...s, seats: e.target.value }))}
                className="input-field text-sm"
                style={{ minWidth: 100 }}
              >
                {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} seat{n>1?'s':''}</option>)}
              </select>
            </div>
            <button type="submit" className="btn-primary py-3 px-6 text-sm">
              <Search className="w-4 h-4" /> Search
            </button>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="btn-ghost py-3 px-4 text-sm border relative"
              style={{ borderColor: 'var(--border)' }}
            >
              <Filter className="w-4 h-4" />
              {Object.values(filters).some((v) => v && v !== '' && v !== false) && (
                <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full" style={{ background: 'var(--primary)' }} />
              )}
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          {/* Sidebar Filters */}
          <div className="hidden lg:block w-72 flex-shrink-0">
            <FilterPanel filters={filters} setFilters={setFilters} onClose={() => {}} />
          </div>

          {/* Mobile filter overlay */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 lg:hidden"
                style={{ background: 'rgba(0,0,0,0.5)' }}
                onClick={() => setShowFilters(false)}
              >
                <motion.div
                  initial={{ x: -300 }}
                  animate={{ x: 0 }}
                  exit={{ x: -300 }}
                  onClick={(e) => e.stopPropagation()}
                  className="w-80 h-full overflow-y-auto p-4"
                  style={{ background: 'var(--bg-elevated)' }}
                >
                  <FilterPanel filters={filters} setFilters={setFilters} onClose={() => setShowFilters(false)} />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results */}
          <div className="flex-1 min-w-0">
            {/* Results header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-xl font-semibold">
                  {loading && rides.length === 0 ? 'Searching...' : `${pagination.total} rides found`}
                </h1>
                {(search.pickup || search.destination) && (
                  <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    {search.pickup && `From: ${search.pickup}`}
                    {search.pickup && search.destination && ' → '}
                    {search.destination && `To: ${search.destination}`}
                  </p>
                )}
              </div>
              <select className="input-field text-sm" style={{ width: 'auto', padding: '8px 12px' }}>
                <option>Sort: Departure</option>
                <option>Sort: Price ↑</option>
                <option>Sort: Price ↓</option>
                <option>Sort: Rating</option>
              </select>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-3 p-4 rounded-xl mb-6" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                <AlertCircle className="w-5 h-5" style={{ color: 'var(--danger)' }} />
                <p className="text-sm" style={{ color: 'var(--danger)' }}>{error}</p>
              </div>
            )}

            {/* Loading skeleton */}
            {loading && rides.length === 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="card-premium p-5">
                    <div className="flex gap-3 mb-4">
                      <div className="skeleton w-12 h-12 rounded-full" />
                      <div className="flex-1">
                        <div className="skeleton h-4 rounded mb-2" style={{ width: '60%' }} />
                        <div className="skeleton h-3 rounded" style={{ width: '40%' }} />
                      </div>
                    </div>
                    <div className="skeleton h-16 rounded-xl mb-4" />
                    <div className="skeleton h-10 rounded-xl" />
                  </div>
                ))}
              </div>
            )}

            {/* Empty state */}
            {!loading && rides.length === 0 && !error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
              >
                <div className="text-6xl mb-4">🗺️</div>
                <h3 className="text-xl font-semibold mb-2">No rides found</h3>
                <p className="mb-6" style={{ color: 'var(--text-muted)' }}>
                  Try adjusting your search or check back later for new rides.
                </p>
                <button
                  onClick={() => { setSearch({ pickup: '', destination: '', date: format(new Date(), 'yyyy-MM-dd'), seats: '1' }); fetchRides(1); }}
                  className="btn-primary"
                >
                  Clear & Browse All
                </button>
              </motion.div>
            )}

            {/* Ride Grid */}
            {rides.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {rides.map((ride) => <RideCard key={ride.id} ride={ride} />)}
              </div>
            )}

            {/* Load more */}
            {pagination.page < pagination.pages && (
              <div className="text-center mt-10">
                <button
                  onClick={() => fetchRides(pagination.page + 1)}
                  disabled={loading}
                  className="btn-secondary"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Load More Rides'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FindRidePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--primary)' }} /></div>}>
      <FindRideContent />
    </Suspense>
  );
}

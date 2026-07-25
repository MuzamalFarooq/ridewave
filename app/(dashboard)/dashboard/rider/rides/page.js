'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { format } from 'date-fns';
import { Plus, Car, Bike, CheckCircle, Clock, XCircle, Edit, Trash2, Eye, MoreVertical, Search, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
  DRAFT: { color: '#64748b', bg: 'rgba(100,116,139,0.1)' },
  PUBLISHED: { color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
  ONGOING: { color: '#6366f1', bg: 'rgba(99,102,241,0.1)' },
  COMPLETED: { color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
  CANCELLED: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
  FULL: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
};

export default function RiderRidesPage() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const fetchRides = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/rider/rides');
      const data = await res.json();
      setRides(data.rides || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRides(); }, []);

  const cancelRide = async (id) => {
    if (!confirm('Cancel this ride? All confirmed bookings will be cancelled.')) return;
    try {
      const res = await fetch(`/api/rides/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      toast.success('Ride cancelled');
      fetchRides();
    } catch {
      toast.error('Failed to cancel ride');
    }
  };

  const filtered = rides.filter((r) => {
    const matchStatus = statusFilter === 'ALL' || r.status === statusFilter;
    const matchSearch = r.pickupAddress?.toLowerCase().includes(search.toLowerCase()) ||
      r.destinationAddress?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-outfit font-bold">My Rides</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{filtered.length} ride{filtered.length !== 1 ? 's' : ''}</p>
        </div>
        <Link href="/dashboard/rider/rides/new" className="btn-primary py-2.5 px-5 text-sm">
          <Plus className="w-4 h-4" /> Publish New Ride
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
          <input type="text" placeholder="Search rides..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-9 text-sm" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['ALL', 'PUBLISHED', 'ONGOING', 'COMPLETED', 'CANCELLED'].map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className="px-3 py-2 rounded-xl text-xs font-medium border transition-all"
              style={{ borderColor: statusFilter === s ? 'var(--primary)' : 'var(--border)', background: statusFilter === s ? 'rgba(99,102,241,0.1)' : 'transparent', color: statusFilter === s ? 'var(--primary)' : 'var(--text-secondary)' }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => <div key={i} className="card-premium p-5 h-32 skeleton" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <Car className="w-14 h-14 mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
          <h3 className="text-lg font-semibold mb-2">No rides yet</h3>
          <p className="mb-6" style={{ color: 'var(--text-muted)' }}>Publish your first ride to start earning!</p>
          <Link href="/dashboard/rider/rides/new" className="btn-primary">Publish First Ride</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((ride, i) => {
            const s = STATUS_COLORS[ride.status] || STATUS_COLORS.DRAFT;
            const bookedSeats = ride._count?.bookings || 0;
            return (
              <motion.div
                key={ride.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="card-premium overflow-hidden"
              >
                <div className="h-1" style={{ background: s.color }} />
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="font-bold text-base">{ride.pickupAddress} → {ride.destinationAddress}</div>
                      <div className="flex flex-wrap items-center gap-3 mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                        <span>{ride.departureDate ? format(new Date(ride.departureDate), 'EEE, MMM d') : '—'} at {ride.departureTime}</span>
                        <span>•</span>
                        <span>{ride.availableSeats} seats total</span>
                        <span>•</span>
                        <span className="font-semibold gradient-text">${ride.pricePerSeat}/seat</span>
                      </div>
                    </div>
                    <span className="flex-shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: s.bg, color: s.color }}>
                      {ride.status}
                    </span>
                  </div>

                  {/* Seat capacity bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
                      <span>{bookedSeats} / {ride.availableSeats} seats booked</span>
                      <span>{Math.round((bookedSeats / Math.max(ride.availableSeats, 1)) * 100)}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full" style={{ background: 'var(--border)' }}>
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{
                          width: `${(bookedSeats / Math.max(ride.availableSeats, 1)) * 100}%`,
                          background: bookedSeats >= ride.availableSeats ? 'var(--success)' : 'var(--primary)',
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    <Link href={`/rides/${ride.id}`}><button className="btn-ghost text-xs py-2 px-4 border" style={{ borderColor: 'var(--border)' }}><Eye className="w-3 h-3" /> View</button></Link>
                    <Link href={`/dashboard/rider/rides/${ride.id}/edit`}><button className="btn-ghost text-xs py-2 px-4 border" style={{ borderColor: 'var(--border)' }}><Edit className="w-3 h-3" /> Edit</button></Link>
                    <Link href={`/dashboard/rider/bookings?rideId=${ride.id}`}><button className="btn-ghost text-xs py-2 px-4 border" style={{ borderColor: 'var(--border)' }}>Bookings ({bookedSeats})</button></Link>
                    {['PUBLISHED', 'DRAFT'].includes(ride.status) && (
                      <button onClick={() => cancelRide(ride.id)} className="text-xs py-2 px-4 rounded-xl" style={{ background: 'rgba(239,68,68,0.08)', color: 'var(--danger)' }}>
                        <Trash2 className="w-3 h-3 inline mr-1" /> Cancel
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

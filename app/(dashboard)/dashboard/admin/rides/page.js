'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import {
  Car, MapPin, Users, DollarSign, Search, Filter,
  ChevronLeft, ChevronRight, Star, X, Ban, Loader2,
} from 'lucide-react';

const STATUS_TABS = ['ALL', 'DRAFT', 'PUBLISHED', 'ONGOING', 'COMPLETED', 'CANCELLED'];

const STATUS_COLORS = {
  DRAFT:     { bg: 'rgba(100,116,139,0.12)', color: '#64748b' },
  PUBLISHED: { bg: 'rgba(16,185,129,0.12)',  color: '#10b981' },
  ONGOING:   { bg: 'rgba(99,102,241,0.12)',  color: '#6366f1' },
  COMPLETED: { bg: 'rgba(139,92,246,0.12)',  color: '#8b5cf6' },
  CANCELLED: { bg: 'rgba(239,68,68,0.12)',   color: '#ef4444' },
};

export default function AdminRidesPage() {
  const [rides, setRides]       = useState([]);
  const [total, setTotal]       = useState(0);
  const [page, setPage]         = useState(1);
  const [status, setStatus]     = useState('ALL');
  const [search, setSearch]     = useState('');
  const [query, setQuery]       = useState('');
  const [loading, setLoading]   = useState(true);
  const [acting, setActing]     = useState(null); // rideId being patched

  const limit = 20;

  const fetchRides = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit });
      if (status !== 'ALL') params.set('status', status);
      if (query) params.set('search', query);
      const res = await fetch(`/api/admin/rides?${params}`);
      if (res.ok) {
        const data = await res.json();
        setRides(data.rides);
        setTotal(data.total);
      }
    } catch {/* ignore */} finally {
      setLoading(false);
    }
  }, [page, status, query]);

  useEffect(() => { fetchRides(); }, [fetchRides]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setQuery(search);
  };

  const handleTab = (tab) => {
    setStatus(tab);
    setPage(1);
  };

  const patchRide = async (rideId, body) => {
    setActing(rideId);
    try {
      const res = await fetch(`/api/admin/rides`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rideId, ...body }),
      });
      if (res.ok) fetchRides();
    } finally {
      setActing(null);
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-outfit font-bold">
            Rides <span className="gradient-text">Management</span>
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            {total.toLocaleString()} rides total
          </p>
        </div>
        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
            <input
              className="input-field pl-10 py-2.5 text-sm"
              placeholder="Search by pickup or destination…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-primary py-2.5 px-4 text-sm">
            <Filter className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-1 p-1 rounded-2xl mb-6 overflow-x-auto" style={{ background: 'var(--bg-surface)' }}>
        {STATUS_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => handleTab(tab)}
            className="flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
            style={{
              background: status === tab ? 'var(--bg-elevated)' : 'transparent',
              color: status === tab ? 'var(--primary)' : 'var(--text-muted)',
              boxShadow: status === tab ? 'var(--shadow-sm)' : 'none',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="card-premium overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-surface)' }}>
                {['Route', 'Rider', 'Date & Time', 'Seats', 'Price', 'Bookings', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="wait">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-20 text-center">
                      <Loader2 className="w-8 h-8 mx-auto animate-spin" style={{ color: 'var(--primary)' }} />
                    </td>
                  </tr>
                ) : rides.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-20 text-center">
                      <Car className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
                      <p className="font-medium" style={{ color: 'var(--text-muted)' }}>No rides found</p>
                    </td>
                  </tr>
                ) : (
                  rides.map((ride, i) => {
                    const sc = STATUS_COLORS[ride.status] || {};
                    return (
                      <motion.tr
                        key={ride.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className="border-b transition-colors hover:bg-[var(--bg-surface)]"
                        style={{ borderColor: 'var(--border)' }}
                      >
                        {/* Route */}
                        <td className="px-4 py-3">
                          <div className="flex items-start gap-2">
                            <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: 'var(--primary)' }} />
                            <div className="min-w-0">
                              <div className="text-xs font-medium truncate max-w-[180px]">{ride.pickupAddress}</div>
                              <div className="text-xs mt-0.5 truncate max-w-[180px]" style={{ color: 'var(--text-muted)' }}>
                                → {ride.destinationAddress}
                              </div>
                            </div>
                          </div>
                        </td>
                        {/* Rider */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold overflow-hidden flex-shrink-0">
                              {ride.rider?.image
                                ? <img src={ride.rider.image} alt="" className="w-full h-full object-cover" />
                                : ride.rider?.name?.[0]}
                            </div>
                            <span className="text-xs font-medium whitespace-nowrap">{ride.rider?.name || '—'}</span>
                          </div>
                        </td>
                        {/* Date/Time */}
                        <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: 'var(--text-secondary)' }}>
                          <div>{format(new Date(ride.departureDate), 'MMM d, yyyy')}</div>
                          <div style={{ color: 'var(--text-muted)' }}>{ride.departureTime}</div>
                        </td>
                        {/* Seats */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 text-xs">
                            <Users className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
                            <span>{ride.availableSeats}/{ride.maxPassengers}</span>
                          </div>
                        </td>
                        {/* Price */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 text-xs font-semibold" style={{ color: 'var(--success)' }}>
                            <DollarSign className="w-3.5 h-3.5" />
                            {ride.pricePerSeat?.toFixed(2)}
                          </div>
                        </td>
                        {/* Bookings */}
                        <td className="px-4 py-3 text-xs text-center font-semibold" style={{ color: 'var(--primary)' }}>
                          {ride._count?.bookings ?? 0}
                        </td>
                        {/* Status */}
                        <td className="px-4 py-3">
                          <span
                            className="text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap"
                            style={{ background: sc.bg, color: sc.color }}
                          >
                            {ride.status}
                          </span>
                          {ride.isFeatured && (
                            <span className="ml-1 text-xs font-semibold px-1.5 py-0.5 rounded-full"
                              style={{ background: 'rgba(245,158,11,0.12)', color: '#f59e0b' }}>
                              ★
                            </span>
                          )}
                        </td>
                        {/* Actions */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => patchRide(ride.id, { isFeatured: !ride.isFeatured })}
                              disabled={acting === ride.id}
                              title={ride.isFeatured ? 'Unfeature' : 'Feature'}
                              className="p-1.5 rounded-lg transition-all hover:scale-110"
                              style={{ background: ride.isFeatured ? 'rgba(245,158,11,0.1)' : 'var(--bg-surface)', color: '#f59e0b' }}
                            >
                              {acting === ride.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Star className="w-3.5 h-3.5" />}
                            </button>
                            {ride.status !== 'CANCELLED' && ride.status !== 'COMPLETED' && (
                              <button
                                onClick={() => patchRide(ride.id, { status: 'CANCELLED' })}
                                disabled={acting === ride.id}
                                title="Cancel ride"
                                className="p-1.5 rounded-lg transition-all hover:scale-110"
                                style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}
                              >
                                <Ban className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3" style={{ borderTop: '1px solid var(--border)' }}>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Page {page} of {totalPages} · {total} rides
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-lg transition-all"
                style={{ background: 'var(--bg-surface)', opacity: page === 1 ? 0.4 : 1 }}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 rounded-lg transition-all"
                style={{ background: 'var(--bg-surface)', opacity: page === totalPages ? 0.4 : 1 }}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

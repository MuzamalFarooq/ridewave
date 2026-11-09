'use client';

import React, { useState, useEffect } from 'react';
import {
  CalendarCheck,
  Search,
  Filter,
  Eye,
  Loader2,
  X,
  Ban,
  CheckCircle,
  MapPin,
  User,
  CreditCard,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export default function AdminBookingsClient({ initialBookings, totalBookings, totalPages, initialPage }) {
  const [bookings, setBookings] = useState(initialBookings || []);
  const [page, setPage] = useState(initialPage || 1);
  const [pages, setPages] = useState(totalPages || 1);
  const [total, setTotal] = useState(totalBookings || 0);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(false);

  // Selected booking for Details
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Status Change Dialog
  const [statusModalBooking, setStatusModalBooking] = useState(null);
  const [targetStatus, setTargetStatus] = useState('');
  const [cancelReason, setCancelReason] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const fetchBookings = async (targetPage = 1) => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: targetPage,
        limit: 15,
        ...(search.trim() ? { search: search.trim() } : {}),
        ...(statusFilter !== 'ALL' ? { status: statusFilter } : {}),
      });

      const res = await fetch(`/api/admin/bookings?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setBookings(data.bookings || []);
        setTotal(data.total || 0);
        setPages(data.totalPages || 1);
        setPage(targetPage);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBookings(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, statusFilter]);

  const handleUpdateStatus = async () => {
    if (!statusModalBooking || !targetStatus) return;

    try {
      setIsUpdatingStatus(true);
      const res = await fetch('/api/admin/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: statusModalBooking.id,
          status: targetStatus,
          cancellationReason: cancelReason.trim() || undefined,
        }),
      });

      if (res.ok) {
        setStatusModalBooking(null);
        setCancelReason('');
        fetchBookings(page);
      }
    } catch (err) {
      console.error('Failed to update booking status:', err);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-outfit text-slate-900 dark:text-white flex items-center gap-2.5">
            <CalendarCheck className="h-6 w-6 text-purple-500" />
            <span>Ride Booking Management</span>
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Monitor real-time passenger reservations, inspect trip lifecycle states, and handle administrative interventions.
          </p>
        </div>
        <div>
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300">
            Total Bookings: {total}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center gap-3 bg-white dark:bg-[#0c241e] p-4 rounded-2xl border border-slate-200 dark:border-emerald-950/60 shadow-xs">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search bookings by booking reference, passenger, pickup, or destination..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-800 focus:border-purple-600 focus:bg-white focus:outline-hidden dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-slate-100 dark:focus:border-[#C6A76B]"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs sm:text-sm text-slate-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-slate-200 focus:outline-hidden"
          >
            <option value="ALL">All Statuses</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="PENDING">Pending</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-md dark:border-emerald-950/60 dark:bg-[#0c241e]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-emerald-950/60 bg-slate-50/80 dark:bg-emerald-950/30 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Booking Ref</th>
                <th className="py-3.5 px-4">Traveler</th>
                <th className="py-3.5 px-4">Route & Rider</th>
                <th className="py-3.5 px-4">Seats & Fare</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-emerald-950/40 text-slate-700 dark:text-slate-300">
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-purple-500" />
                    <span>Loading bookings...</span>
                  </td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-500">
                    No bookings found matching filters.
                  </td>
                </tr>
              ) : (
                bookings.map((b) => (
                  <tr
                    key={b.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-emerald-950/30 transition-colors"
                  >
                    {/* Booking Reference */}
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-slate-900 dark:text-white">
                        {b.bookingRef}
                      </span>
                    </td>

                    {/* Traveler */}
                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-900 dark:text-white truncate">
                        {b.passengerName || b.traveler?.name || 'Traveler'}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">{b.traveler?.email}</p>
                    </td>

                    {/* Route & Rider */}
                    <td className="py-3 px-4 max-w-xs">
                      <p className="font-medium text-slate-800 dark:text-slate-200 truncate">
                        {b.ride?.pickupAddress} → {b.ride?.destinationAddress}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Rider: {b.ride?.rider?.name || 'Driver'} ({b.ride?.vehicle?.brand || 'Vehicle'})
                      </p>
                    </td>

                    {/* Seats & Fare */}
                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-900 dark:text-white">${b.totalAmount}</p>
                      <p className="text-[11px] text-slate-400">{b.seatsBooked} {b.seatsBooked > 1 ? 'seats' : 'seat'}</p>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                          b.status === 'CONFIRMED' || b.status === 'COMPLETED'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                            : b.status === 'CANCELLED' || b.status === 'REJECTED'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-3 px-4 text-slate-500 text-[11px]">
                      {new Date(b.createdAt).toLocaleDateString()}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedBooking(b)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-purple-600 hover:bg-slate-100 dark:hover:bg-emerald-950/80 dark:text-slate-400"
                          title="View Booking Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {b.status !== 'CANCELLED' && b.status !== 'COMPLETED' && (
                          <button
                            onClick={() => {
                              setStatusModalBooking(b);
                              setTargetStatus('CANCELLED');
                              setCancelReason('');
                            }}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/80"
                            title="Cancel Booking"
                          >
                            <Ban className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-slate-200 dark:border-emerald-950/60 bg-slate-50/50 dark:bg-emerald-950/20 text-xs text-slate-500">
            <span>
              Page {page} of {pages} ({total} bookings)
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1 || isLoading}
                onClick={() => fetchBookings(page - 1)}
                className="flex items-center gap-1 rounded-xl border border-slate-200 dark:border-emerald-900/60 px-3 py-1.5 text-xs font-medium hover:bg-white dark:hover:bg-emerald-950 disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Prev</span>
              </button>
              <button
                disabled={page >= pages || isLoading}
                onClick={() => fetchBookings(page + 1)}
                className="flex items-center gap-1 rounded-xl border border-slate-200 dark:border-emerald-900/60 px-3 py-1.5 text-xs font-medium hover:bg-white dark:hover:bg-emerald-950 disabled:opacity-40"
              >
                <span>Next</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-emerald-900/60 dark:bg-[#0c241e]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-emerald-950/60">
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-mono">
                Booking #{selectedBooking.bookingRef}
              </h3>
              <button onClick={() => setSelectedBooking(null)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-emerald-950/40 border border-slate-100 dark:border-emerald-900/40">
                <p className="font-semibold text-slate-900 dark:text-white mb-1">Route</p>
                <p className="text-slate-600 dark:text-slate-300">From: {selectedBooking.ride?.pickupAddress}</p>
                <p className="text-slate-600 dark:text-slate-300">To: {selectedBooking.ride?.destinationAddress}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-emerald-950/40">
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Traveler</span>
                  <p className="font-semibold text-slate-900 dark:text-white mt-0.5">
                    {selectedBooking.passengerName || selectedBooking.traveler?.name}
                  </p>
                  <p className="text-slate-500 text-[11px]">{selectedBooking.traveler?.email}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-emerald-950/40">
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Rider / Driver</span>
                  <p className="font-semibold text-slate-900 dark:text-white mt-0.5">
                    {selectedBooking.ride?.rider?.name || 'Driver'}
                  </p>
                  <p className="text-slate-500 text-[11px]">{selectedBooking.ride?.rider?.email}</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-emerald-950/40 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Total Fare</span>
                  <p className="text-base font-bold text-slate-900 dark:text-white">${selectedBooking.totalAmount}</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                  {selectedBooking.status}
                </span>
              </div>

              {selectedBooking.cancellationReason && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-500/30 text-rose-700 dark:text-rose-300">
                  <p className="font-semibold">Cancellation Reason:</p>
                  <p className="mt-0.5">{selectedBooking.cancellationReason}</p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-emerald-950/60 flex justify-end">
              <button
                onClick={() => setSelectedBooking(null)}
                className="rounded-xl bg-purple-600 px-4 py-2 text-xs font-semibold text-white hover:bg-purple-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {statusModalBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-emerald-900/60 dark:bg-[#0c241e]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Ban className="h-5 w-5 text-rose-500" />
                <span>Cancel Booking</span>
              </h3>
              <button onClick={() => setStatusModalBooking(null)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 mb-4">
              Are you sure you want to cancel booking <strong className="font-mono">{statusModalBooking.bookingRef}</strong>?
            </p>

            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Reason for cancellation *
              </label>
              <textarea
                rows="2"
                placeholder="e.g. Driver emergency, passenger request..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-slate-100 focus:outline-hidden"
              />
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setStatusModalBooking(null)}
                className="rounded-xl border border-slate-200 dark:border-emerald-900/60 px-3 py-2 text-xs font-semibold text-slate-300"
              >
                Close
              </button>
              <button
                disabled={isUpdatingStatus}
                onClick={handleUpdateStatus}
                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-500 disabled:opacity-50"
              >
                {isUpdatingStatus ? 'Cancelling...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


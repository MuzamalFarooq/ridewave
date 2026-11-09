'use client';

import React, { useState, useEffect } from 'react';
import {
  Car,
  Search,
  CheckCircle,
  Ban,
  Clock,
  Shield,
  Eye,
  Loader2,
  X,
  ChevronLeft,
  ChevronRight,
  FileCheck,
  AlertCircle,
} from 'lucide-react';

export default function AdminRidersClient({ initialRiders, totalRiders, totalPages, initialPage }) {
  const [riders, setRiders] = useState(initialRiders || []);
  const [page, setPage] = useState(initialPage || 1);
  const [pages, setPages] = useState(totalPages || 1);
  const [total, setTotal] = useState(totalRiders || 0);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [verificationFilter, setVerificationFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(false);

  // Selected Rider for Vehicle Verification Modal
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [vehicleNotes, setVehicleNotes] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Block/Unblock modal
  const [blockModalUser, setBlockModalUser] = useState(null);
  const [blockReason, setBlockReason] = useState('');
  const [isSubmittingBlock, setIsSubmittingBlock] = useState(false);

  const fetchRiders = async (targetPage = 1) => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: targetPage,
        limit: 15,
        ...(search.trim() ? { search: search.trim() } : {}),
        ...(statusFilter !== 'ALL' ? { status: statusFilter } : {}),
        ...(verificationFilter !== 'ALL' ? { verificationStatus: verificationFilter } : {}),
      });

      const res = await fetch(`/api/admin/riders?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setRiders(data.riders || []);
        setTotal(data.total || 0);
        setPages(data.totalPages || 1);
        setPage(targetPage);
      }
    } catch (err) {
      console.error('Error fetching riders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRiders(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, statusFilter, verificationFilter]);

  // Handle vehicle verification decision
  const handleVehicleDecision = async (decision) => {
    if (!selectedVehicle) return;
    try {
      setIsVerifying(true);
      const res = await fetch(`/api/admin/vehicles/${selectedVehicle.id}/verify`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          decision,
          notes: vehicleNotes.trim(),
        }),
      });

      if (res.ok) {
        setSelectedVehicle(null);
        setVehicleNotes('');
        fetchRiders(page);
      }
    } catch (err) {
      console.error('Failed to verify vehicle:', err);
    } finally {
      setIsVerifying(false);
    }
  };

  // Handle Rider Block / Unblock
  const handleToggleBlock = async () => {
    if (!blockModalUser) return;
    const isCurrentlyBlocked = blockModalUser.isBanned || blockModalUser.isActive === false;
    const nextAction = isCurrentlyBlocked ? 'UNBLOCK' : 'BLOCK';

    try {
      setIsSubmittingBlock(true);
      const res = await fetch(`/api/admin/users/${blockModalUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: nextAction,
          reason: blockReason.trim() || 'Suspended by admin',
        }),
      });

      if (res.ok) {
        setBlockModalUser(null);
        setBlockReason('');
        fetchRiders(page);
      }
    } catch (err) {
      console.error('Failed to toggle block on rider:', err);
    } finally {
      setIsSubmittingBlock(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-outfit text-slate-900 dark:text-white flex items-center gap-2.5">
            <Car className="h-6 w-6 text-[#C6A76B]" />
            <span>Rider & Vehicle Management</span>
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Inspect drivers, verify vehicle registrations, check licenses, and enforce driver compliance.
          </p>
        </div>
        <div>
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300">
            Total Drivers: {total}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center gap-3 bg-white dark:bg-[#0c241e] p-4 rounded-2xl border border-slate-200 dark:border-emerald-950/60 shadow-xs">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search riders by name, email, phone, or vehicle plate number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-800 focus:border-emerald-600 focus:bg-white focus:outline-hidden dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-slate-100 dark:focus:border-[#C6A76B]"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={verificationFilter}
            onChange={(e) => setVerificationFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs sm:text-sm text-slate-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-slate-200 focus:outline-hidden"
          >
            <option value="ALL">All Verifications</option>
            <option value="APPROVED">Approved</option>
            <option value="PENDING">Pending Review</option>
            <option value="REJECTED">Rejected</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs sm:text-sm text-slate-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-slate-200 focus:outline-hidden"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="BLOCKED">Blocked</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-md dark:border-emerald-950/60 dark:bg-[#0c241e]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-emerald-950/60 bg-slate-50/80 dark:bg-emerald-950/30 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Driver</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Registered Vehicle</th>
                <th className="py-3.5 px-4">Driver Verification</th>
                <th className="py-3.5 px-4">Account Status</th>
                <th className="py-3.5 px-4">Rides Published</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-emerald-950/40 text-slate-700 dark:text-slate-300">
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-emerald-500" />
                    <span>Loading riders...</span>
                  </td>
                </tr>
              ) : riders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-500">
                    No riders found matching filters.
                  </td>
                </tr>
              ) : (
                riders.map((r) => {
                  const isBlocked = r.isBanned || r.isActive === false;
                  const primaryVehicle = r.vehicles?.[0];

                  return (
                    <tr
                      key={r.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-emerald-950/30 transition-colors"
                    >
                      {/* Driver */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-[#173F35] border border-[#C6A76B]/40 flex items-center justify-center font-bold text-white text-xs shrink-0 overflow-hidden">
                            {(r.name?.[0] || 'R').toUpperCase()}
                          </div>
                          <div className="truncate">
                            <p className="font-semibold text-slate-900 dark:text-white truncate">
                              {r.name || 'Unnamed Rider'}
                            </p>
                            <p className="text-[11px] text-slate-400 font-mono truncate">{r.id.slice(-8)}</p>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="py-3 px-4">
                        <p className="font-medium text-slate-800 dark:text-slate-200 truncate">{r.email}</p>
                        <p className="text-[11px] text-slate-400">{r.phone || 'No phone'}</p>
                      </td>

                      {/* Vehicle */}
                      <td className="py-3 px-4">
                        {primaryVehicle ? (
                          <div className="flex flex-col">
                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                              {primaryVehicle.brand} {primaryVehicle.model} ({primaryVehicle.year})
                            </span>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="font-mono text-[10px] px-1.5 py-0.2 rounded-md bg-slate-100 text-slate-700 dark:bg-emerald-950/80 dark:text-emerald-300">
                                {primaryVehicle.registrationNumber}
                              </span>
                              <button
                                onClick={() => setSelectedVehicle(primaryVehicle)}
                                className={`text-[10px] font-semibold underline ${
                                  primaryVehicle.verificationStatus === 'APPROVED'
                                    ? 'text-emerald-600 dark:text-emerald-400'
                                    : primaryVehicle.verificationStatus === 'PENDING'
                                    ? 'text-amber-600 dark:text-amber-400'
                                    : 'text-rose-600 dark:text-rose-400'
                                }`}
                              >
                                {primaryVehicle.verificationStatus}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">No vehicle added</span>
                        )}
                      </td>

                      {/* Driver Verification */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                            r.profile?.isRiderVerified || r.verification?.status === 'APPROVED'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
                          }`}
                        >
                          <FileCheck className="h-3 w-3" />
                          <span>
                            {r.profile?.isRiderVerified || r.verification?.status === 'APPROVED'
                              ? 'Verified'
                              : 'Unverified'}
                          </span>
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        {isBlocked ? (
                          <span className="inline-flex items-center gap-1 font-semibold text-rose-600 dark:text-rose-400">
                            <Ban className="h-3.5 w-3.5" />
                            <span>Blocked</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                            <CheckCircle className="h-3.5 w-3.5" />
                            <span>Active</span>
                          </span>
                        )}
                      </td>

                      {/* Rides Count */}
                      <td className="py-3 px-4 text-slate-800 dark:text-slate-200 font-semibold">
                        {r._count?.ridesAsRider || 0}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {primaryVehicle && (
                            <button
                              onClick={() => setSelectedVehicle(primaryVehicle)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-emerald-950/80 dark:text-slate-400"
                              title="Review Vehicle Documents"
                            >
                              <Car className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setBlockModalUser(r);
                              setBlockReason(r.blockedReason || '');
                            }}
                            className={`p-1.5 rounded-lg transition-colors ${
                              isBlocked
                                ? 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/80 dark:text-emerald-400'
                                : 'text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/80 dark:text-rose-400'
                            }`}
                            title={isBlocked ? 'Unblock Rider' : 'Block Rider'}
                          >
                            {isBlocked ? <CheckCircle className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-slate-200 dark:border-emerald-950/60 bg-slate-50/50 dark:bg-emerald-950/20 text-xs text-slate-500">
            <span>
              Page {page} of {pages} ({total} riders)
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1 || isLoading}
                onClick={() => fetchRiders(page - 1)}
                className="flex items-center gap-1 rounded-xl border border-slate-200 dark:border-emerald-900/60 px-3 py-1.5 text-xs font-medium hover:bg-white dark:hover:bg-emerald-950 disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Prev</span>
              </button>
              <button
                disabled={page >= pages || isLoading}
                onClick={() => fetchRiders(page + 1)}
                className="flex items-center gap-1 rounded-xl border border-slate-200 dark:border-emerald-900/60 px-3 py-1.5 text-xs font-medium hover:bg-white dark:hover:bg-emerald-950 disabled:opacity-40"
              >
                <span>Next</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Vehicle Verification Modal */}
      {selectedVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-emerald-900/60 dark:bg-[#0c241e]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Car className="h-5 w-5 text-[#C6A76B]" />
                <span>Vehicle Review</span>
              </h3>
              <button
                onClick={() => setSelectedVehicle(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs mb-5">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-emerald-950/40 border border-slate-100 dark:border-emerald-900/40">
                <p className="font-bold text-slate-900 dark:text-white text-sm">
                  {selectedVehicle.brand} {selectedVehicle.model} ({selectedVehicle.year})
                </p>
                <p className="text-slate-500 mt-1">Plate: <strong className="font-mono text-slate-800 dark:text-slate-200">{selectedVehicle.registrationNumber}</strong></p>
                <p className="text-slate-500">Seats: {selectedVehicle.seatCapacity} • Type: {selectedVehicle.vehicleType}</p>
                <p className="text-slate-500">Current Status: <strong className="text-emerald-600 dark:text-[#C6A76B]">{selectedVehicle.verificationStatus}</strong></p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Administrator Notes / Reason
                </label>
                <textarea
                  rows="2"
                  placeholder="Notes for rider regarding approval or rejection..."
                  value={vehicleNotes}
                  onChange={(e) => setVehicleNotes(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-slate-100 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedVehicle(null)}
                className="rounded-xl border border-slate-200 dark:border-emerald-900/60 px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isVerifying}
                onClick={() => handleVehicleDecision('REJECTED')}
                className="rounded-xl bg-rose-600 px-3 py-2 text-xs font-semibold text-white hover:bg-rose-500 disabled:opacity-50"
              >
                Reject Vehicle
              </button>
              <button
                type="button"
                disabled={isVerifying}
                onClick={() => handleVehicleDecision('APPROVED')}
                className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-500 disabled:opacity-50"
              >
                Approve Vehicle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Block Confirmation Modal */}
      {blockModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-emerald-900/60 dark:bg-[#0c241e]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                {blockModalUser.isBanned || blockModalUser.isActive === false ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-emerald-500" />
                    <span>Unblock Rider</span>
                  </>
                ) : (
                  <>
                    <Ban className="h-5 w-5 text-rose-500" />
                    <span>Block Rider</span>
                  </>
                )}
              </h3>
              <button onClick={() => setBlockModalUser(null)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 mb-4">
              {blockModalUser.isBanned || blockModalUser.isActive === false
                ? `Restore publishing and driving privileges for ${blockModalUser.name || blockModalUser.email}?`
                : `Blocking ${blockModalUser.name || blockModalUser.email} prevents them from publishing new rides and going online.`}
            </p>

            {!(blockModalUser.isBanned || blockModalUser.isActive === false) && (
              <div className="mb-4">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Reason for blocking *
                </label>
                <textarea
                  rows="2"
                  placeholder="e.g. Invalid license, dangerous driving complaint..."
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-slate-100"
                />
              </div>
            )}

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setBlockModalUser(null)}
                className="rounded-xl border border-slate-200 dark:border-emerald-900/60 px-3 py-2 text-xs font-semibold text-slate-300"
              >
                Cancel
              </button>
              <button
                disabled={isSubmittingBlock}
                onClick={handleToggleBlock}
                className={`rounded-xl px-4 py-2 text-xs font-semibold text-white ${
                  blockModalUser.isBanned || blockModalUser.isActive === false
                    ? 'bg-emerald-600 hover:bg-emerald-500'
                    : 'bg-rose-600 hover:bg-rose-500'
                }`}
              >
                {blockModalUser.isBanned || blockModalUser.isActive === false ? 'Unblock' : 'Block Rider'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


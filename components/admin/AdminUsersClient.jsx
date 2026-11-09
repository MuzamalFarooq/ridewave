'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  ShieldCheck,
  Ban,
  CheckCircle,
  Eye,
  Loader2,
  AlertCircle,
  X,
  Phone,
  Mail,
  Calendar,
  Wallet,
  Car,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export default function AdminUsersClient({ initialUsers, totalUsers, totalPages, initialPage }) {
  const [users, setUsers] = useState(initialUsers || []);
  const [page, setPage] = useState(initialPage || 1);
  const [pages, setPages] = useState(totalPages || 1);
  const [total, setTotal] = useState(totalUsers || 0);

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(false);

  // Selected User for Details Modal
  const [detailUser, setDetailUser] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Block/Unblock Action Modal
  const [blockModalUser, setBlockModalUser] = useState(null);
  const [blockReason, setBlockReason] = useState('');
  const [isSubmittingBlock, setIsSubmittingBlock] = useState(false);
  const [actionError, setActionError] = useState('');

  // Fetch users with filters
  const fetchUsers = async (targetPage = 1) => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: targetPage,
        limit: 15,
        ...(search.trim() ? { search: search.trim() } : {}),
        ...(roleFilter !== 'ALL' ? { role: roleFilter } : {}),
        ...(statusFilter !== 'ALL' ? { status: statusFilter } : {}),
      });

      const res = await fetch(`/api/admin/users?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
        setTotal(data.total || 0);
        setPages(data.totalPages || 1);
        setPage(targetPage);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, roleFilter, statusFilter]);

  // Open details modal
  const handleViewDetails = async (userId) => {
    try {
      setLoadingDetails(true);
      setDetailUser(null);
      const res = await fetch(`/api/admin/users/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setDetailUser(data.user);
      }
    } catch (err) {
      console.error('Failed to load user details:', err);
    } finally {
      setLoadingDetails(false);
    }
  };

  // Handle Block / Unblock submit
  const handleToggleBlock = async () => {
    if (!blockModalUser) return;
    const isCurrentlyBlocked = blockModalUser.isBanned || blockModalUser.isActive === false;
    const nextAction = isCurrentlyBlocked ? 'UNBLOCK' : 'BLOCK';

    if (nextAction === 'BLOCK' && !blockReason.trim()) {
      setActionError('Please provide a reason for blocking this user.');
      return;
    }

    try {
      setIsSubmittingBlock(true);
      setActionError('');
      const res = await fetch(`/api/admin/users/${blockModalUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: nextAction,
          reason: blockReason.trim(),
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        setActionError(err.message || 'Operation failed');
        return;
      }

      // Refresh list
      setBlockModalUser(null);
      setBlockReason('');
      fetchUsers(page);
    } catch (err) {
      console.error('Block toggle error:', err);
      setActionError('Failed to execute blocking action.');
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
            <Users className="h-6 w-6 text-emerald-500" />
            <span>User Management</span>
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Audit registered travelers and riders, review activity histories, and enforce account restrictions.
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
            Total Users: {total}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center gap-3 bg-white dark:bg-[#0c241e] p-4 rounded-2xl border border-slate-200 dark:border-emerald-950/60 shadow-xs">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email, or phone number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-800 focus:border-emerald-600 focus:bg-white focus:outline-hidden dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-slate-100 dark:focus:border-[#C6A76B]"
          />
        </div>

        {/* Role Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs sm:text-sm text-slate-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-slate-200 focus:outline-hidden"
          >
            <option value="ALL">All Roles</option>
            <option value="TRAVELER">Traveler</option>
            <option value="RIDER">Rider</option>
            <option value="ADMIN">Admin</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs sm:text-sm text-slate-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-slate-200 focus:outline-hidden"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active Only</option>
            <option value="BLOCKED">Blocked Only</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-md dark:border-emerald-950/60 dark:bg-[#0c241e]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-emerald-950/60 bg-slate-50/80 dark:bg-emerald-950/30 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Activity</th>
                <th className="py-3.5 px-4">Joined</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-emerald-950/40 text-slate-700 dark:text-slate-300">
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-emerald-500" />
                    <span>Loading users from database...</span>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-500">
                    No users found matching your filters.
                  </td>
                </tr>
              ) : (
                users.map((u) => {
                  const isBlocked = u.isBanned || u.isActive === false;
                  return (
                    <tr
                      key={u.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-emerald-950/30 transition-colors"
                    >
                      {/* User Avatar & Name */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-emerald-800/80 border border-emerald-600/30 flex items-center justify-center font-bold text-white text-xs shrink-0 overflow-hidden">
                            {u.image ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={u.image} alt={u.name || 'User'} className="h-full w-full object-cover" />
                            ) : (
                              (u.name?.[0] || 'U').toUpperCase()
                            )}
                          </div>
                          <div className="truncate">
                            <p className="font-semibold text-slate-900 dark:text-white truncate">
                              {u.name || 'Unnamed'}
                            </p>
                            <p className="text-[11px] text-slate-400 font-mono truncate">{u.id.slice(-8)}</p>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="py-3 px-4">
                        <p className="font-medium text-slate-800 dark:text-slate-200 truncate">{u.email}</p>
                        <p className="text-[11px] text-slate-400">{u.phone || 'No phone'}</p>
                      </td>

                      {/* Role */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide ${
                            u.role === 'ADMIN'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
                              : u.role === 'RIDER'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300'
                              : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        {isBlocked ? (
                          <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-semibold">
                            <Ban className="h-3.5 w-3.5" />
                            <span>Blocked</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                            <CheckCircle className="h-3.5 w-3.5" />
                            <span>Active</span>
                          </div>
                        )}
                        {u.blockedReason && (
                          <p className="text-[10px] text-rose-400/80 truncate max-w-xs">{u.blockedReason}</p>
                        )}
                      </td>

                      {/* Activity Stats */}
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                        <div className="flex flex-col text-[11px]">
                          <span>Trips: {u.profile?.totalTrips || 0}</span>
                          <span>Rating: {u.profile?.averageRating ? `${u.profile.averageRating.toFixed(1)} ★` : 'N/A'}</span>
                        </div>
                      </td>

                      {/* Joined Date */}
                      <td className="py-3 px-4 text-slate-500 text-[11px]">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleViewDetails(u.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-emerald-950/80 dark:text-slate-400 dark:hover:text-emerald-300 transition-colors"
                            title="View Profile & Booking History"
                          >
                            <Eye className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() => {
                              setBlockModalUser(u);
                              setBlockReason(u.blockedReason || '');
                              setActionError('');
                            }}
                            className={`p-1.5 rounded-lg transition-colors ${
                              isBlocked
                                ? 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/80 dark:text-emerald-400'
                                : 'text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/80 dark:text-rose-400'
                            }`}
                            title={isBlocked ? 'Unblock User' : 'Block User'}
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
              Page {page} of {pages} ({total} users)
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1 || isLoading}
                onClick={() => fetchUsers(page - 1)}
                className="flex items-center gap-1 rounded-xl border border-slate-200 dark:border-emerald-900/60 px-3 py-1.5 text-xs font-medium hover:bg-white dark:hover:bg-emerald-950 disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Prev</span>
              </button>
              <button
                disabled={page >= pages || isLoading}
                onClick={() => fetchUsers(page + 1)}
                className="flex items-center gap-1 rounded-xl border border-slate-200 dark:border-emerald-900/60 px-3 py-1.5 text-xs font-medium hover:bg-white dark:hover:bg-emerald-950 disabled:opacity-40"
              >
                <span>Next</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Block / Unblock Confirmation Modal */}
      {blockModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-emerald-900/60 dark:bg-[#0c241e]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                {blockModalUser.isBanned || blockModalUser.isActive === false ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-emerald-500" />
                    <span>Unblock User</span>
                  </>
                ) : (
                  <>
                    <Ban className="h-5 w-5 text-rose-500" />
                    <span>Block User Account</span>
                  </>
                )}
              </h3>
              <button
                onClick={() => setBlockModalUser(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {actionError && (
              <div className="mb-4 rounded-xl border border-rose-500/30 bg-rose-50 dark:bg-rose-950/40 p-3 text-xs text-rose-600 dark:text-rose-300">
                {actionError}
              </div>
            )}

            <p className="text-xs text-slate-600 dark:text-slate-300 mb-4">
              {blockModalUser.isBanned || blockModalUser.isActive === false ? (
                <>
                  Are you sure you want to lift the suspension for{' '}
                  <strong className="text-slate-900 dark:text-white">{blockModalUser.name || blockModalUser.email}</strong>? They will regain access to booking and publishing rides.
                </>
              ) : (
                <>
                  Blocking <strong className="text-slate-900 dark:text-white">{blockModalUser.name || blockModalUser.email}</strong> will immediately disable login, ride reservations, and ride publishing.
                </>
              )}
            </p>

            {!(blockModalUser.isBanned || blockModalUser.isActive === false) && (
              <div className="mb-4">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Reason for blocking (audit recorded) *
                </label>
                <textarea
                  rows="3"
                  required
                  placeholder="e.g. Terms violation, fraudulent booking activity, chargeback..."
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-slate-100 focus:outline-hidden focus:border-rose-500"
                />
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setBlockModalUser(null)}
                className="rounded-xl border border-slate-200 dark:border-emerald-900/60 px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-emerald-950"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSubmittingBlock}
                onClick={handleToggleBlock}
                className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold text-white shadow-md transition-all ${
                  blockModalUser.isBanned || blockModalUser.isActive === false
                    ? 'bg-emerald-600 hover:bg-emerald-500'
                    : 'bg-rose-600 hover:bg-rose-500'
                } disabled:opacity-50`}
              >
                {isSubmittingBlock && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                <span>
                  {blockModalUser.isBanned || blockModalUser.isActive === false
                    ? 'Confirm Unblock'
                    : 'Confirm Block'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Details Slide-over / Modal */}
      {detailUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-emerald-900/60 dark:bg-[#0c241e] custom-scrollbar">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-emerald-950/60">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-emerald-800 text-white font-bold flex items-center justify-center">
                  {(detailUser.name?.[0] || 'U').toUpperCase()}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {detailUser.name || 'Unnamed User'}
                  </h3>
                  <p className="text-xs text-slate-500">{detailUser.email}</p>
                </div>
              </div>
              <button
                onClick={() => setDetailUser(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="py-4 space-y-6 text-xs">
              {/* Profile Overview */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-emerald-950/40 border border-slate-100 dark:border-emerald-900/40">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Role</span>
                  <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">{detailUser.role}</p>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-emerald-950/40 border border-slate-100 dark:border-emerald-900/40">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Wallet</span>
                  <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">${detailUser.walletBalance || 0}</p>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-emerald-950/40 border border-slate-100 dark:border-emerald-900/40">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Trips</span>
                  <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">{detailUser.profile?.totalTrips || 0}</p>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-emerald-950/40 border border-slate-100 dark:border-emerald-900/40">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Rating</span>
                  <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                    {detailUser.profile?.averageRating ? `${detailUser.profile.averageRating.toFixed(1)} ★` : 'N/A'}
                  </p>
                </div>
              </div>

              {/* Block Status Banner */}
              {(detailUser.isBanned || detailUser.isActive === false) && (
                <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-500/30 text-rose-700 dark:text-rose-300">
                  <p className="font-semibold flex items-center gap-1.5">
                    <Ban className="h-4 w-4" />
                    <span>Account Suspended</span>
                  </p>
                  <p className="mt-1 text-xs">Reason: {detailUser.blockedReason || 'No reason specified'}</p>
                  <p className="text-[11px] text-rose-500 mt-1">Blocked by: {detailUser.blockedBy || 'Admin'}</p>
                </div>
              )}

              {/* Bookings History */}
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-2 uppercase text-[11px] tracking-wider text-emerald-600 dark:text-[#C6A76B]">
                  Recent Bookings ({detailUser.bookingsAsTraveler?.length || 0})
                </h4>
                {detailUser.bookingsAsTraveler && detailUser.bookingsAsTraveler.length > 0 ? (
                  <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                    {detailUser.bookingsAsTraveler.map((b) => (
                      <div
                        key={b.id}
                        className="p-3 rounded-xl bg-slate-50 dark:bg-emerald-950/30 border border-slate-100 dark:border-emerald-900/30 flex items-center justify-between"
                      >
                        <div>
                          <p className="font-semibold text-slate-800 dark:text-slate-100">
                            {b.ride?.pickupAddress} → {b.ride?.destinationAddress}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {new Date(b.createdAt).toLocaleDateString()} • Ref: {b.bookingRef}
                          </p>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                          {b.status}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 py-2">No bookings recorded.</p>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-emerald-950/60 flex justify-end">
              <button
                onClick={() => setDetailUser(null)}
                className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

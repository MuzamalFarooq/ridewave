'use client';

import React, { useState, useEffect } from 'react';
import {
  FileText,
  Search,
  Filter,
  ShieldAlert,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export default function AdminLogsClient({ initialLogs, totalLogs, totalPages }) {
  const [logs, setLogs] = useState(initialLogs || []);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(totalPages || 1);
  const [total, setTotal] = useState(totalLogs || 0);

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(false);

  const fetchLogs = async (targetPage = 1) => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: targetPage,
        limit: 20,
        ...(search.trim() ? { search: search.trim() } : {}),
        ...(typeFilter !== 'ALL' ? { targetType: typeFilter } : {}),
      });

      const res = await fetch(`/api/admin/logs?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
        setTotal(data.total || 0);
        setPages(data.totalPages || 1);
        setPage(targetPage);
      }
    } catch (err) {
      console.error('Error fetching logs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLogs(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, typeFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-outfit text-slate-900 dark:text-white flex items-center gap-2.5">
            <FileText className="h-6 w-6 text-emerald-500" />
            <span>Immutable Audit Logs</span>
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Comprehensive audit trail tracking every administrator action, security event, and state modification.
          </p>
        </div>
        <div>
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
            Recorded Events: {total}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center gap-3 bg-white dark:bg-[#0c241e] p-4 rounded-2xl border border-slate-200 dark:border-emerald-950/60 shadow-xs">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search audit events by action, admin email, target ID, or detail..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-800 focus:border-emerald-600 focus:bg-white focus:outline-hidden dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-slate-100 dark:focus:border-[#C6A76B]"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs sm:text-sm text-slate-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-slate-200 focus:outline-hidden"
          >
            <option value="ALL">All Categories</option>
            <option value="USER">User Actions</option>
            <option value="RIDER">Rider Actions</option>
            <option value="VEHICLE">Vehicle Actions</option>
            <option value="BOOKING">Booking Actions</option>
            <option value="PAYMENT">Payment Actions</option>
            <option value="TICKET">Ticket Actions</option>
            <option value="SYSTEM">System & Auth</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-md dark:border-emerald-950/60 dark:bg-[#0c241e]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-emerald-950/60 bg-slate-50/80 dark:bg-emerald-950/30 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4">Admin Email</th>
                <th className="py-3.5 px-4">Action</th>
                <th className="py-3.5 px-4">Target Type</th>
                <th className="py-3.5 px-4">Target ID</th>
                <th className="py-3.5 px-4">Details</th>
                <th className="py-3.5 px-4 text-right">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-emerald-950/40 text-slate-700 dark:text-slate-300 font-mono text-[11px]">
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-emerald-500" />
                    <span>Loading audit records...</span>
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-500 font-sans">
                    No audit records found matching your filters.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-emerald-950/30 transition-colors"
                  >
                    {/* Timestamp */}
                    <td className="py-3 px-4 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>

                    {/* Admin */}
                    <td className="py-3 px-4 text-slate-900 dark:text-slate-200 font-sans font-semibold">
                      {log.adminEmail}
                    </td>

                    {/* Action */}
                    <td className="py-3 px-4">
                      <span className="font-bold text-emerald-600 dark:text-[#C6A76B]">
                        {log.action}
                      </span>
                    </td>

                    {/* Target Type */}
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 dark:bg-emerald-950/80 dark:text-emerald-300 font-semibold text-[10px]">
                        {log.targetType}
                      </span>
                    </td>

                    {/* Target ID */}
                    <td className="py-3 px-4 text-slate-400">
                      {log.targetId ? log.targetId.slice(-8) : '—'}
                    </td>

                    {/* Details */}
                    <td className="py-3 px-4 max-w-xs truncate text-slate-600 dark:text-slate-400">
                      {log.details || '—'}
                    </td>

                    {/* IP */}
                    <td className="py-3 px-4 text-right text-slate-400">
                      {log.ipAddress || 'unknown'}
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
              Page {page} of {pages} ({total} events)
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1 || isLoading}
                onClick={() => fetchLogs(page - 1)}
                className="flex items-center gap-1 rounded-xl border border-slate-200 dark:border-emerald-900/60 px-3 py-1.5 text-xs font-medium hover:bg-white dark:hover:bg-emerald-950 disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Prev</span>
              </button>
              <button
                disabled={page >= pages || isLoading}
                onClick={() => fetchLogs(page + 1)}
                className="flex items-center gap-1 rounded-xl border border-slate-200 dark:border-emerald-900/60 px-3 py-1.5 text-xs font-medium hover:bg-white dark:hover:bg-emerald-950 disabled:opacity-40"
              >
                <span>Next</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


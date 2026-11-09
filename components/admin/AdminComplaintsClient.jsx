'use client';

import React, { useState, useEffect } from 'react';
import {
  MessageSquareWarning,
  Search,
  CheckCircle,
  Clock,
  AlertTriangle,
  Loader2,
  X,
  ChevronLeft,
  ChevronRight,
  Send,
  User,
} from 'lucide-react';

export default function AdminComplaintsClient({ initialTickets, totalTickets, totalPages, statusCounts }) {
  const [tickets, setTickets] = useState(initialTickets || []);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(totalPages || 1);
  const [total, setTotal] = useState(totalTickets || 0);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(false);

  // Active Ticket Reply Modal
  const [activeTicket, setActiveTicket] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [ticketStatus, setTicketStatus] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchTickets = async (targetPage = 1) => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: targetPage,
        limit: 15,
        ...(search.trim() ? { search: search.trim() } : {}),
        ...(statusFilter !== 'ALL' ? { status: statusFilter } : {}),
        ...(priorityFilter !== 'ALL' ? { priority: priorityFilter } : {}),
      });

      const res = await fetch(`/api/admin/support-tickets?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setTickets(data.tickets || []);
        setTotal(data.total || 0);
        setPages(data.totalPages || 1);
        setPage(targetPage);
      }
    } catch (err) {
      console.error('Error fetching tickets:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTickets(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, statusFilter, priorityFilter]);

  const handleUpdateTicket = async () => {
    if (!activeTicket) return;

    try {
      setIsUpdating(true);
      const res = await fetch(`/api/admin/support-tickets/${activeTicket.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: ticketStatus,
          adminNotes: adminNotes.trim(),
        }),
      });

      if (res.ok) {
        setActiveTicket(null);
        setAdminNotes('');
        fetchTickets(page);
      }
    } catch (err) {
      console.error('Failed to update ticket:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-outfit text-slate-900 dark:text-white flex items-center gap-2.5">
            <MessageSquareWarning className="h-6 w-6 text-amber-500" />
            <span>Complaints & Support Tickets</span>
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Review submitted inquiries, passenger grievances, driver reports, and issue official administrative resolutions.
          </p>
        </div>
        <div>
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300">
            Total Tickets: {total}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center gap-3 bg-white dark:bg-[#0c241e] p-4 rounded-2xl border border-slate-200 dark:border-emerald-950/60 shadow-xs">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search tickets by subject, description, user name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-800 focus:border-amber-600 focus:bg-white focus:outline-hidden dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-slate-100 dark:focus:border-[#C6A76B]"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs sm:text-sm text-slate-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-slate-200 focus:outline-hidden"
          >
            <option value="ALL">All Status</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs sm:text-sm text-slate-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-slate-200 focus:outline-hidden"
          >
            <option value="ALL">All Priorities</option>
            <option value="URGENT">Urgent</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-md dark:border-emerald-950/60 dark:bg-[#0c241e]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-emerald-950/60 bg-slate-50/80 dark:bg-emerald-950/30 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Subject & Category</th>
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Priority</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Submitted</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-emerald-950/40 text-slate-700 dark:text-slate-300">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-amber-500" />
                    <span>Loading tickets...</span>
                  </td>
                </tr>
              ) : tickets.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-500">
                    No support tickets found.
                  </td>
                </tr>
              ) : (
                tickets.map((t) => (
                  <tr
                    key={t.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-emerald-950/30 transition-colors"
                  >
                    {/* Subject */}
                    <td className="py-3 px-4 max-w-sm">
                      <p className="font-semibold text-slate-900 dark:text-white truncate">
                        {t.subject}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {t.description}
                      </p>
                      <span className="inline-block mt-1 text-[10px] font-mono px-1.5 py-0.2 rounded-sm bg-slate-100 text-slate-600 dark:bg-emerald-950/80 dark:text-emerald-300">
                        {t.category}
                      </span>
                    </td>

                    {/* User */}
                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-900 dark:text-white">{t.user?.name || 'User'}</p>
                      <p className="text-[11px] text-slate-400 truncate">{t.user?.email}</p>
                    </td>

                    {/* Priority */}
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          t.priority === 'URGENT'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300'
                            : t.priority === 'HIGH'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
                            : 'bg-slate-100 text-slate-700 dark:bg-emerald-950/80 dark:text-slate-300'
                        }`}
                      >
                        {t.priority}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                          t.status === 'RESOLVED' || t.status === 'CLOSED'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                            : t.status === 'IN_PROGRESS'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-3 px-4 text-slate-500 text-[11px]">
                      {new Date(t.createdAt).toLocaleDateString()}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          setActiveTicket(t);
                          setAdminNotes(t.adminNotes || '');
                          setTicketStatus(t.status);
                        }}
                        className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-emerald-900/60 dark:bg-emerald-950/60 dark:text-slate-200 dark:hover:bg-emerald-950"
                      >
                        Manage Ticket
                      </button>
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
              Page {page} of {pages} ({total} tickets)
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1 || isLoading}
                onClick={() => fetchTickets(page - 1)}
                className="flex items-center gap-1 rounded-xl border border-slate-200 dark:border-emerald-900/60 px-3 py-1.5 text-xs font-medium hover:bg-white dark:hover:bg-emerald-950 disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Prev</span>
              </button>
              <button
                disabled={page >= pages || isLoading}
                onClick={() => fetchTickets(page + 1)}
                className="flex items-center gap-1 rounded-xl border border-slate-200 dark:border-emerald-900/60 px-3 py-1.5 text-xs font-medium hover:bg-white dark:hover:bg-emerald-950 disabled:opacity-40"
              >
                <span>Next</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Ticket Response Modal */}
      {activeTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-emerald-900/60 dark:bg-[#0c241e]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-emerald-950/60">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Ticket: {activeTicket.subject}
              </h3>
              <button onClick={() => setActiveTicket(null)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-emerald-950/40 border border-slate-100 dark:border-emerald-900/40">
                <p className="font-semibold text-slate-500 uppercase text-[10px] mb-1">User Description</p>
                <p className="text-slate-800 dark:text-slate-200 leading-relaxed">{activeTicket.description}</p>
                <p className="text-slate-400 text-[11px] mt-2">
                  From: {activeTicket.user?.name} ({activeTicket.user?.email})
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Update Ticket Status
                </label>
                <select
                  value={ticketStatus}
                  onChange={(e) => setTicketStatus(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-800 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-slate-100 focus:outline-hidden"
                >
                  <option value="OPEN">OPEN</option>
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                  <option value="RESOLVED">RESOLVED</option>
                  <option value="CLOSED">CLOSED</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Administrator Notes & Response to User
                </label>
                <textarea
                  rows="3"
                  placeholder="Enter resolution notes or response to notify user..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-slate-100 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-emerald-950/60">
              <button
                onClick={() => setActiveTicket(null)}
                className="rounded-xl border border-slate-200 dark:border-emerald-900/60 px-3 py-2 text-xs font-semibold text-slate-300"
              >
                Cancel
              </button>
              <button
                disabled={isUpdating}
                onClick={handleUpdateTicket}
                className="rounded-xl bg-amber-600 hover:bg-amber-500 px-4 py-2 text-xs font-semibold text-white disabled:opacity-50 flex items-center gap-1.5"
              >
                {isUpdating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                <span>Save & Notify User</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


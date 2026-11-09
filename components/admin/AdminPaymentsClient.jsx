'use client';

import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Search,
  Filter,
  CheckCircle,
  Clock,
  AlertCircle,
  RotateCcw,
  Loader2,
  X,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  TrendingUp,
} from 'lucide-react';

export default function AdminPaymentsClient({ initialPayments, totalPayments, totalPages, summary }) {
  const [payments, setPayments] = useState(initialPayments || []);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(totalPages || 1);
  const [total, setTotal] = useState(totalPayments || 0);
  const [currentSummary, setCurrentSummary] = useState(summary || {});

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [methodFilter, setMethodFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(false);

  // Refund Modal State
  const [refundModalPayment, setRefundModalPayment] = useState(null);
  const [refundReason, setRefundReason] = useState('');
  const [isRefunding, setIsRefunding] = useState(false);

  const fetchPayments = async (targetPage = 1) => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: targetPage,
        limit: 15,
        ...(search.trim() ? { search: search.trim() } : {}),
        ...(statusFilter !== 'ALL' ? { status: statusFilter } : {}),
        ...(methodFilter !== 'ALL' ? { method: methodFilter } : {}),
      });

      const res = await fetch(`/api/admin/payments?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setPayments(data.payments || []);
        setTotal(data.total || 0);
        setPages(data.totalPages || 1);
        if (data.summary) setCurrentSummary(data.summary);
        setPage(targetPage);
      }
    } catch (err) {
      console.error('Error fetching payments:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPayments(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, statusFilter, methodFilter]);

  const handleProcessRefund = async () => {
    if (!refundModalPayment) return;

    try {
      setIsRefunding(true);
      const res = await fetch('/api/admin/payments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentId: refundModalPayment.id,
          status: 'REFUNDED',
          refundReason: refundReason.trim() || 'Refunded by administrator',
        }),
      });

      if (res.ok) {
        setRefundModalPayment(null);
        setRefundReason('');
        fetchPayments(page);
      }
    } catch (err) {
      console.error('Failed to process refund:', err);
    } finally {
      setIsRefunding(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-outfit text-slate-900 dark:text-white flex items-center gap-2.5">
            <CreditCard className="h-6 w-6 text-emerald-500" />
            <span>Payments & Financial Ledger</span>
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Audit payment gateway settlements, platform commission deductions, and issue refunds.
          </p>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-emerald-950/60 bg-white dark:bg-[#0c241e] shadow-xs">
          <span className="text-xs font-semibold text-slate-400 uppercase">Total Settled Volume</span>
          <p className="text-2xl font-bold font-outfit text-slate-900 dark:text-white mt-1">
            ${(currentSummary.totalCompletedAmount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <span className="text-[11px] text-emerald-500 font-medium">
            {currentSummary.completedCount || 0} Successful Transactions
          </span>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-emerald-950/60 bg-white dark:bg-[#0c241e] shadow-xs">
          <span className="text-xs font-semibold text-slate-400 uppercase">Refunds Processed</span>
          <p className="text-2xl font-bold font-outfit text-rose-600 dark:text-rose-400 mt-1">
            ${(currentSummary.totalRefundedAmount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <span className="text-[11px] text-slate-400 font-medium">Reversals & chargebacks</span>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-emerald-950/60 bg-white dark:bg-[#0c241e] shadow-xs">
          <span className="text-xs font-semibold text-slate-400 uppercase">Estimated Platform Net</span>
          <p className="text-2xl font-bold font-outfit text-[#C6A76B] mt-1">
            ${((currentSummary.totalCompletedAmount || 0) * 0.08).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <span className="text-[11px] text-slate-400 font-medium">Standard 8% commission</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center gap-3 bg-white dark:bg-[#0c241e] p-4 rounded-2xl border border-slate-200 dark:border-emerald-950/60 shadow-xs">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search payments by Stripe intent ID, booking ref, customer name/email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-800 focus:border-emerald-600 focus:bg-white focus:outline-hidden dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-slate-100 dark:focus:border-[#C6A76B]"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs sm:text-sm text-slate-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-slate-200 focus:outline-hidden"
          >
            <option value="ALL">All Methods</option>
            <option value="STRIPE">Stripe</option>
            <option value="CASH">Cash</option>
            <option value="WALLET">Wallet</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs sm:text-sm text-slate-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-slate-200 focus:outline-hidden"
          >
            <option value="ALL">All Status</option>
            <option value="COMPLETED">Completed</option>
            <option value="PENDING">Pending</option>
            <option value="FAILED">Failed</option>
            <option value="REFUNDED">Refunded</option>
          </select>
        </div>
      </div>

      {/* Payments Table */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-md dark:border-emerald-950/60 dark:bg-[#0c241e]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-emerald-950/60 bg-slate-50/80 dark:bg-emerald-950/30 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Transaction / Intent</th>
                <th className="py-3.5 px-4">Booking</th>
                <th className="py-3.5 px-4">Payer</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Method</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-emerald-950/40 text-slate-700 dark:text-slate-300">
              {isLoading ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-400">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-emerald-500" />
                    <span>Loading financial records...</span>
                  </td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-500">
                    No payment records found.
                  </td>
                </tr>
              ) : (
                payments.map((p) => (
                  <tr
                    key={p.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-emerald-950/30 transition-colors"
                  >
                    {/* Transaction Intent */}
                    <td className="py-3 px-4">
                      <p className="font-mono font-bold text-slate-900 dark:text-white truncate max-w-xs">
                        {p.stripePaymentIntentId || p.id}
                      </p>
                    </td>

                    {/* Booking Ref */}
                    <td className="py-3 px-4">
                      <span className="font-mono text-emerald-600 dark:text-[#C6A76B] font-semibold">
                        {p.booking?.bookingRef || 'Direct'}
                      </span>
                    </td>

                    {/* Payer */}
                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-900 dark:text-white truncate">
                        {p.user?.name || 'Customer'}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">{p.user?.email}</p>
                    </td>

                    {/* Amount */}
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900 dark:text-white text-sm">
                        ${p.amount.toFixed(2)}
                      </span>
                      {p.refundedAmount > 0 && (
                        <p className="text-[10px] text-rose-500">Refunded: ${p.refundedAmount.toFixed(2)}</p>
                      )}
                    </td>

                    {/* Method */}
                    <td className="py-3 px-4">
                      <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 dark:bg-emerald-950/80 dark:text-emerald-300 font-semibold text-[10px]">
                        {p.method}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                          p.status === 'COMPLETED'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                            : p.status === 'REFUNDED'
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300'
                            : p.status === 'FAILED'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-3 px-4 text-slate-500 text-[11px]">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      {p.status === 'COMPLETED' && (
                        <button
                          onClick={() => {
                            setRefundModalPayment(p);
                            setRefundReason('');
                          }}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/80 transition-colors"
                          title="Issue Refund"
                        >
                          <RotateCcw className="h-4 w-4" />
                        </button>
                      )}
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
              Page {page} of {pages} ({total} payments)
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1 || isLoading}
                onClick={() => fetchPayments(page - 1)}
                className="flex items-center gap-1 rounded-xl border border-slate-200 dark:border-emerald-900/60 px-3 py-1.5 text-xs font-medium hover:bg-white dark:hover:bg-emerald-950 disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Prev</span>
              </button>
              <button
                disabled={page >= pages || isLoading}
                onClick={() => fetchPayments(page + 1)}
                className="flex items-center gap-1 rounded-xl border border-slate-200 dark:border-emerald-900/60 px-3 py-1.5 text-xs font-medium hover:bg-white dark:hover:bg-emerald-950 disabled:opacity-40"
              >
                <span>Next</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Refund Confirmation Modal */}
      {refundModalPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-emerald-900/60 dark:bg-[#0c241e]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <RotateCcw className="h-5 w-5 text-rose-500" />
                <span>Process Payment Refund</span>
              </h3>
              <button onClick={() => setRefundModalPayment(null)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 mb-4">
              Refund payment of <strong className="text-slate-900 dark:text-white">${refundModalPayment.amount.toFixed(2)}</strong> for booking <strong className="font-mono">{refundModalPayment.booking?.bookingRef}</strong>?
            </p>

            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Refund Reason *
              </label>
              <textarea
                rows="2"
                placeholder="e.g. Passenger trip cancelled, driver did not show..."
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-slate-100 focus:outline-hidden"
              />
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setRefundModalPayment(null)}
                className="rounded-xl border border-slate-200 dark:border-emerald-900/60 px-3 py-2 text-xs font-semibold text-slate-300"
              >
                Cancel
              </button>
              <button
                disabled={isRefunding}
                onClick={handleProcessRefund}
                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-500 disabled:opacity-50"
              >
                {isRefunding ? 'Processing...' : 'Confirm Refund'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


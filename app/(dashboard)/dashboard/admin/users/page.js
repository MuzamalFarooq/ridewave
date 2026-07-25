'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Shield, Trash2, Edit, Eye, Filter } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const PER_PAGE = 20;

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: PER_PAGE });
      if (search) params.set('search', search);
      if (roleFilter !== 'ALL') params.set('role', roleFilter);
      const res = await fetch(`/api/admin/users?${params}`);
      const data = await res.json();
      setUsers(data.users || []);
      setTotal(data.total || 0);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, [search, roleFilter, page]);

  const toggleBan = async (userId, currentStatus) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isBanned: !currentStatus }),
      });
      if (!res.ok) throw new Error();
      toast.success(currentStatus ? 'User unbanned' : 'User banned');
      fetchUsers();
    } catch { toast.error('Action failed'); }
  };

  const changeRole = async (userId, newRole) => {
    try {
      await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });
      toast.success('Role updated');
      fetchUsers();
    } catch { toast.error('Failed to change role'); }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-outfit font-bold">User <span className="gradient-text">Management</span></h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{total} total users</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
          <input type="text" placeholder="Search by name or email..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="input-field pl-9 text-sm" />
        </div>
        <div className="flex gap-2">
          {['ALL', 'TRAVELER', 'RIDER', 'ADMIN'].map((r) => (
            <button key={r} onClick={() => { setRoleFilter(r); setPage(1); }}
              className="px-3 py-2 rounded-xl text-xs font-medium border transition-all"
              style={{ borderColor: roleFilter === r ? 'var(--primary)' : 'var(--border)', background: roleFilter === r ? 'rgba(99,102,241,0.1)' : 'transparent', color: roleFilter === r ? 'var(--primary)' : 'var(--text-secondary)' }}>
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card-premium overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)' }}>
              <tr>
                {['User', 'Role', 'Joined', 'Rides', 'Rating', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading
                ? [...Array(8)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(7)].map((_, j) => (
                      <td key={j} className="px-4 py-3"><div className="skeleton h-4 rounded" style={{ width: j === 0 ? 120 : 60 }} /></td>
                    ))}
                  </tr>
                ))
                : users.map((u) => (
                  <tr key={u.id} className="border-b transition-colors hover:bg-[var(--bg-surface)]" style={{ borderColor: 'var(--border)' }}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold flex-shrink-0 overflow-hidden">
                          {u.image ? <img src={u.image} alt="" className="w-full h-full object-cover" /> : u.name?.[0]}
                        </div>
                        <div>
                          <div className="font-medium text-sm">{u.name}</div>
                          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <select value={u.role} onChange={(e) => changeRole(u.id, e.target.value)}
                        className="text-xs px-2 py-1 rounded-lg border"
                        style={{ borderColor: 'var(--border)', background: 'var(--bg-surface)', color: 'var(--text-primary)' }}>
                        <option>TRAVELER</option><option>RIDER</option><option>ADMIN</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-muted)' }}>{format(new Date(u.createdAt), 'MMM d, yyyy')}</td>
                    <td className="px-4 py-3 text-xs text-center">{u._count?.ridesAsRider || 0}</td>
                    <td className="px-4 py-3 text-xs text-center">{u.profile?.averageRating?.toFixed(1) || '—'}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: u.isBanned ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)', color: u.isBanned ? 'var(--danger)' : 'var(--success)' }}>
                        {u.isBanned ? 'Banned' : 'Active'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => toggleBan(u.id, u.isBanned)}
                          className="text-xs px-2 py-1 rounded-lg transition-all"
                          style={{ background: u.isBanned ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: u.isBanned ? 'var(--success)' : 'var(--danger)' }}>
                          {u.isBanned ? 'Unban' : 'Ban'}
                        </button>
                        <a href={`/profile/${u.id}`} className="text-xs px-2 py-1 rounded-lg" style={{ background: 'var(--bg-surface)', color: 'var(--primary)' }}>
                          <Eye className="w-3 h-3" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t" style={{ borderColor: 'var(--border)' }}>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Showing {Math.min((page - 1) * PER_PAGE + 1, total)}–{Math.min(page * PER_PAGE, total)} of {total}
          </span>
          <div className="flex gap-2">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="btn-ghost text-xs py-1.5 px-3 border" style={{ borderColor: 'var(--border)' }}>← Previous</button>
            <button onClick={() => setPage((p) => p + 1)} disabled={page * PER_PAGE >= total} className="btn-ghost text-xs py-1.5 px-3 border" style={{ borderColor: 'var(--border)' }}>Next →</button>
          </div>
        </div>
      </div>
    </div>
  );
}

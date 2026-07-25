'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, CheckCircle, XCircle, Eye, Car, Clock } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export default function AdminVerificationPage() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('PENDING');
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/vehicles?status=${filter}`);
      const data = await res.json();
      setVehicles(data.vehicles || []);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchVehicles(); }, [filter]);

  const handleVerify = async (vehicleId, decision, notes) => {
    try {
      const res = await fetch(`/api/admin/vehicles/${vehicleId}/verify`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision, notes }),
      });
      if (!res.ok) throw new Error();
      toast.success(`Vehicle ${decision === 'APPROVED' ? 'approved' : 'rejected'}`);
      setSelectedVehicle(null);
      fetchVehicles();
    } catch { toast.error('Action failed'); }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-2xl gradient-primary flex items-center justify-center">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-outfit font-bold">Vehicle <span className="gradient-text">Verification</span></h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Review and approve vehicle registrations</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {['PENDING', 'APPROVED', 'REJECTED'].map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className="px-4 py-2 rounded-xl text-sm font-medium border transition-all"
            style={{ borderColor: filter === s ? 'var(--primary)' : 'var(--border)', background: filter === s ? 'rgba(99,102,241,0.1)' : 'transparent', color: filter === s ? 'var(--primary)' : 'var(--text-secondary)' }}>
            {s === 'PENDING' ? '⏳' : s === 'APPROVED' ? '✅' : '❌'} {s}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {loading ? [...Array(4)].map((_, i) => <div key={i} className="card-premium h-40 skeleton" />)
          : vehicles.length === 0 ? (
            <div className="col-span-2 text-center py-16">
              <Shield className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
              <p style={{ color: 'var(--text-muted)' }}>No {filter.toLowerCase()} vehicles</p>
            </div>
          ) : vehicles.map((v, i) => (
            <motion.div key={v.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card-premium overflow-hidden">
              {v.photos?.[0] && <div className="h-24 overflow-hidden"><img src={v.photos[0]} alt="" className="w-full h-full object-cover" /></div>}
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-bold">{v.brand} {v.model} ({v.year})</div>
                    <div className="text-sm" style={{ color: 'var(--text-muted)' }}>{v.registrationNumber} • {v.vehicleType}</div>
                    <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Owner: {v.owner?.name} • {v.owner?.email}</div>
                  </div>
                  <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                    <Clock className="w-3 h-3" />
                    {format(new Date(v.createdAt), 'MMM d')}
                  </div>
                </div>

                {filter === 'PENDING' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleVerify(v.id, 'APPROVED', '')}
                      className="flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1"
                      style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--success)' }}
                    >
                      <CheckCircle className="w-3.5 h-3.5" /> Approve
                    </button>
                    <button
                      onClick={() => handleVerify(v.id, 'REJECTED', 'Documents unclear')}
                      className="flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1"
                      style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--danger)' }}
                    >
                      <XCircle className="w-3.5 h-3.5" /> Reject
                    </button>
                    <button
                      onClick={() => setSelectedVehicle(v)}
                      className="py-2 px-3 rounded-xl text-xs border"
                      style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
                {filter !== 'PENDING' && (
                  <span
                    className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full"
                    style={{ background: filter === 'APPROVED' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: filter === 'APPROVED' ? 'var(--success)' : 'var(--danger)' }}
                  >
                    {filter === 'APPROVED' ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    {filter === 'APPROVED' ? 'Verified & Active' : 'Rejected'}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
      </div>

      {/* Detail Modal */}
      {selectedVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="card-premium p-6 w-full max-w-lg">
            <h3 className="font-bold text-xl mb-4">{selectedVehicle.brand} {selectedVehicle.model}</h3>
            <div className="grid grid-cols-2 gap-3 text-sm mb-4">
              {[
                ['Brand', selectedVehicle.brand], ['Model', selectedVehicle.model],
                ['Year', selectedVehicle.year], ['Type', selectedVehicle.vehicleType],
                ['Fuel', selectedVehicle.fuelType], ['Seats', selectedVehicle.seatCapacity],
                ['Reg #', selectedVehicle.registrationNumber], ['Color', selectedVehicle.color],
                ['Insurance', selectedVehicle.insuranceNumber || '—'], ['Transmission', selectedVehicle.transmission],
              ].map(([k, v]) => (
                <div key={k}>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{k}</div>
                  <div className="font-medium">{String(v)}</div>
                </div>
              ))}
            </div>
            {selectedVehicle.photos?.length > 0 && (
              <div className="flex gap-2 mb-4">
                {selectedVehicle.photos.map((p, i) => (
                  <img key={i} src={p} alt="" className="w-20 h-20 rounded-xl object-cover" />
                ))}
              </div>
            )}
            <div className="flex gap-3">
              <button onClick={() => setSelectedVehicle(null)} className="btn-ghost flex-1 py-2.5">Close</button>
              <button onClick={() => handleVerify(selectedVehicle.id, 'APPROVED', '')}
                className="flex-1 py-2.5 rounded-xl font-semibold" style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--success)' }}>
                Approve
              </button>
              <button onClick={() => handleVerify(selectedVehicle.id, 'REJECTED', 'Invalid documents')}
                className="flex-1 py-2.5 rounded-xl font-semibold" style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--danger)' }}>
                Reject
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Car, Bike, Plus, CheckCircle, Clock, AlertCircle,
  Upload, Trash2, Edit, ChevronRight, Shield
} from 'lucide-react';
import toast from 'react-hot-toast';

const VEHICLE_TYPES = ['CAR', 'BIKE', 'VAN', 'BUS', 'TRUCK'];
const FUEL_TYPES = ['PETROL', 'DIESEL', 'ELECTRIC', 'HYBRID', 'CNG'];
const TRANSMISSIONS = ['MANUAL', 'AUTOMATIC'];
const AMENITIES = ['AC', 'WiFi', 'Music', 'USB Charging', 'Tinted Windows', 'Luggage Space', 'First Aid Kit'];

const VERIFICATION_COLORS = {
  PENDING: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', label: 'Pending Review', icon: Clock },
  APPROVED: { color: '#10b981', bg: 'rgba(16,185,129,0.1)', label: 'Verified', icon: CheckCircle },
  REJECTED: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)', label: 'Rejected', icon: AlertCircle },
};

function AddVehicleModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: '', brand: '', model: '', year: new Date().getFullYear(),
    registrationNumber: '', vehicleType: 'CAR', fuelType: 'PETROL',
    transmission: 'MANUAL', seatCapacity: 4, color: '',
    insuranceNumber: '', amenities: [], photos: [],
  });
  const [loading, setLoading] = useState(false);
  const [photoUploading, setPhotoUploading] = useState(false);

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files);
    setPhotoUploading(true);
    try {
      const urls = await Promise.all(files.map(async (file) => {
        const fd = new FormData();
        fd.append('file', file);
        fd.append('folder', 'ridewave/vehicles');
        const r = await fetch('/api/upload', { method: 'POST', body: fd });
        const d = await r.json();
        return d.url;
      }));
      update('photos', [...form.photos, ...urls]);
    } catch { toast.error('Photo upload failed'); }
    finally { setPhotoUploading(false); }
  };

  const handleSubmit = async () => {
    if (!form.brand || !form.model || !form.registrationNumber) {
      toast.error('Brand, model, and registration are required');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success('Vehicle added! Awaiting verification.');
      onSuccess();
    } catch (err) {
      toast.error(err.message || 'Failed to add vehicle');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
      <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="card-premium p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="font-bold text-xl mb-6">Register New Vehicle</h3>

        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Vehicle Type */}
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-2">Vehicle Type</label>
            <div className="flex gap-2 flex-wrap">
              {VEHICLE_TYPES.map((t) => (
                <button key={t} type="button" onClick={() => update('vehicleType', t)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-all"
                  style={{ borderColor: form.vehicleType === t ? 'var(--primary)' : 'var(--border)', background: form.vehicleType === t ? 'rgba(99,102,241,0.1)' : 'transparent', color: form.vehicleType === t ? 'var(--primary)' : 'var(--text-secondary)' }}>
                  {t === 'CAR' ? '🚗' : t === 'BIKE' ? '🏍️' : t === 'VAN' ? '🚐' : t === 'BUS' ? '🚌' : '🚛'} {t}
                </button>
              ))}
            </div>
          </div>

          <div><label className="block text-sm font-medium mb-1.5">Brand *</label>
            <input type="text" placeholder="Toyota" value={form.brand} onChange={(e) => update('brand', e.target.value)} className="input-field text-sm" /></div>

          <div><label className="block text-sm font-medium mb-1.5">Model *</label>
            <input type="text" placeholder="Corolla" value={form.model} onChange={(e) => update('model', e.target.value)} className="input-field text-sm" /></div>

          <div><label className="block text-sm font-medium mb-1.5">Year *</label>
            <input type="number" value={form.year} min="2000" max={new Date().getFullYear()} onChange={(e) => update('year', e.target.value)} className="input-field text-sm" /></div>

          <div><label className="block text-sm font-medium mb-1.5">Color</label>
            <input type="text" placeholder="White" value={form.color} onChange={(e) => update('color', e.target.value)} className="input-field text-sm" /></div>

          <div><label className="block text-sm font-medium mb-1.5">Registration Number *</label>
            <input type="text" placeholder="ABC-1234" value={form.registrationNumber} onChange={(e) => update('registrationNumber', e.target.value.toUpperCase())} className="input-field text-sm uppercase" /></div>

          <div><label className="block text-sm font-medium mb-1.5">Insurance Number</label>
            <input type="text" placeholder="INS-XXXXX" value={form.insuranceNumber} onChange={(e) => update('insuranceNumber', e.target.value)} className="input-field text-sm" /></div>

          <div><label className="block text-sm font-medium mb-1.5">Fuel Type</label>
            <select value={form.fuelType} onChange={(e) => update('fuelType', e.target.value)} className="input-field text-sm">
              {FUEL_TYPES.map((f) => <option key={f}>{f}</option>)}
            </select></div>

          <div><label className="block text-sm font-medium mb-1.5">Transmission</label>
            <select value={form.transmission} onChange={(e) => update('transmission', e.target.value)} className="input-field text-sm">
              {TRANSMISSIONS.map((t) => <option key={t}>{t}</option>)}
            </select></div>

          <div><label className="block text-sm font-medium mb-1.5">Seat Capacity</label>
            <input type="number" value={form.seatCapacity} min="1" max="60" onChange={(e) => update('seatCapacity', parseInt(e.target.value))} className="input-field text-sm" /></div>
        </div>

        {/* Amenities */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Amenities</label>
          <div className="flex gap-2 flex-wrap">
            {AMENITIES.map((a) => (
              <button key={a} type="button"
                onClick={() => update('amenities', form.amenities.includes(a) ? form.amenities.filter((x) => x !== a) : [...form.amenities, a])}
                className="px-3 py-1.5 rounded-lg text-xs border transition-all"
                style={{ borderColor: form.amenities.includes(a) ? 'var(--primary)' : 'var(--border)', background: form.amenities.includes(a) ? 'rgba(99,102,241,0.1)' : 'transparent', color: form.amenities.includes(a) ? 'var(--primary)' : 'var(--text-secondary)' }}>
                {a}
              </button>
            ))}
          </div>
        </div>

        {/* Photo Upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Vehicle Photos</label>
          <label className="flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed cursor-pointer transition-all hover:border-[var(--primary)]" style={{ borderColor: 'var(--border)' }}>
            <input type="file" multiple accept="image/*" className="hidden" onChange={handlePhotoUpload} />
            <Upload className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{photoUploading ? 'Uploading...' : 'Upload photos (up to 5)'}</span>
          </label>
          {form.photos.length > 0 && (
            <div className="flex gap-2 mt-2 flex-wrap">
              {form.photos.map((url, i) => (
                <div key={i} className="relative w-16 h-16 rounded-xl overflow-hidden">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button onClick={() => update('photos', form.photos.filter((_, j) => j !== i))}
                    className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-xs">×</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="btn-ghost flex-1 py-3">Cancel</button>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSubmit} disabled={loading} className="btn-primary flex-1 py-3">
            {loading ? 'Adding...' : 'Register Vehicle'}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const fetchVehicles = () => {
    setLoading(true);
    fetch('/api/vehicles').then((r) => r.json()).then((d) => setVehicles(d.vehicles || [])).finally(() => setLoading(false));
  };

  useEffect(() => { fetchVehicles(); }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-outfit font-bold">My <span className="gradient-text">Vehicles</span></h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Manage your registered vehicles</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary py-2.5 px-5 text-sm">
          <Plus className="w-4 h-4" /> Add Vehicle
        </button>
      </div>

      {/* Verification banner */}
      <div className="p-4 rounded-2xl mb-6 flex items-start gap-3" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
        <Shield className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#f59e0b' }} />
        <div>
          <p className="text-sm font-semibold" style={{ color: '#f59e0b' }}>Vehicle Verification</p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            All vehicles are reviewed within 24-48 hours. Verified vehicles can start accepting ride bookings immediately.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(3)].map((_, i) => <div key={i} className="card-premium h-48 skeleton" />)}
        </div>
      ) : vehicles.length === 0 ? (
        <div className="text-center py-20">
          <Car className="w-14 h-14 mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
          <h3 className="font-semibold text-lg mb-2">No vehicles yet</h3>
          <p className="mb-6" style={{ color: 'var(--text-muted)' }}>Register your first vehicle to start publishing rides!</p>
          <button onClick={() => setShowModal(true)} className="btn-primary">Register a Vehicle</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vehicles.map((v, i) => {
            const vs = VERIFICATION_COLORS[v.verificationStatus] || VERIFICATION_COLORS.PENDING;
            const VIcon = vs.icon;
            return (
              <motion.div key={v.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className="card-premium overflow-hidden">
                {v.photos?.[0] ? (
                  <div className="h-32 overflow-hidden">
                    <img src={v.photos[0]} alt={v.name} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="h-32 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.1))' }}>
                    {v.vehicleType === 'BIKE' ? <Bike className="w-12 h-12" style={{ color: 'var(--primary)' }} /> : <Car className="w-12 h-12" style={{ color: 'var(--primary)' }} />}
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-bold">{v.brand} {v.model} ({v.year})</div>
                      <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{v.registrationNumber} • {v.color} • {v.transmission}</div>
                    </div>
                    <span className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full flex-shrink-0" style={{ background: vs.bg, color: vs.color }}>
                      <VIcon className="w-3 h-3" /> {vs.label}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {v.amenities?.slice(0, 4).map((a) => (
                      <span key={a} className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--bg-surface)', color: 'var(--text-muted)' }}>{a}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-xs" style={{ color: 'var(--text-muted)' }}>
                    <span>{v.seatCapacity} seats • {v.fuelType} • {v._count?.rides || 0} rides</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <AnimatePresence>
        {showModal && <AddVehicleModal onClose={() => setShowModal(false)} onSuccess={() => { setShowModal(false); fetchVehicles(); }} />}
      </AnimatePresence>
    </div>
  );
}

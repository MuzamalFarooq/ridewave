'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  MapPin, Navigation, Calendar, Clock, Users, DollarSign,
  Car, Bike, Zap, Info, ChevronRight, Loader2, Plus, AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

const STEPS = ['Route & Date', 'Vehicle & Seats', 'Pricing & Rules', 'Review & Publish'];

export default function PublishRidePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fareEstimate, setFareEstimate] = useState(null);

  const [form, setForm] = useState({
    pickupAddress: '', pickupLat: '', pickupLng: '',
    destinationAddress: '', destinationLat: '', destinationLng: '',
    departureDate: '', departureTime: '',
    vehicleId: '',
    availableSeats: 3,
    pricePerSeat: '',
    instantBooking: true,
    luggageAllowed: true,
    smokingAllowed: false,
    petsAllowed: false,
    womenOnly: false,
    description: '',
    rules: '',
    isRecurring: false,
    recurringDays: [],
  });

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  useEffect(() => {
    fetch('/api/vehicles').then((r) => r.json()).then((d) => setVehicles(d.vehicles || []));
  }, []);

  const handlePublish = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/rides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success('🎉 Ride published successfully!');
      router.push('/dashboard/rider/rides');
    } catch (err) {
      toast.error(err.message || 'Failed to publish ride');
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    if (step === 0) {
      if (!form.pickupAddress || !form.destinationAddress) return 'Enter pickup and destination';
      if (!form.departureDate) return 'Select a departure date';
      if (!form.departureTime) return 'Select a departure time';
    }
    if (step === 1 && !form.vehicleId) return 'Select a vehicle';
    if (step === 2 && (!form.pricePerSeat || parseFloat(form.pricePerSeat) <= 0)) return 'Enter a valid price';
    return null;
  };

  const next = () => {
    const err = validate();
    if (err) { toast.error(err); return; }
    setStep((s) => Math.min(s + 1, 3));
  };

  const amenities = [
    { key: 'luggageAllowed', label: '🧳 Luggage Allowed' },
    { key: 'smokingAllowed', label: '🚬 Smoking Allowed' },
    { key: 'petsAllowed', label: '🐾 Pets Allowed' },
    { key: 'womenOnly', label: '👩 Women Only' },
    { key: 'instantBooking', label: '⚡ Instant Booking' },
  ];

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-outfit font-bold mb-2">Publish a <span className="gradient-text">New Ride</span></h1>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Share your journey and start earning</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center mb-8 overflow-x-auto pb-2">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center flex-shrink-0">
            <div
              onClick={() => i < step && setStep(i)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${i < step ? 'cursor-pointer' : ''}`}
              style={{
                background: i === step ? 'rgba(99,102,241,0.1)' : 'transparent',
                border: `2px solid ${i <= step ? 'var(--primary)' : 'var(--border)'}`,
                borderRadius: 12,
              }}
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{ background: i <= step ? 'var(--primary)' : 'var(--border)', color: i <= step ? 'white' : 'var(--text-muted)' }}
              >
                {i < step ? '✓' : i + 1}
              </div>
              <span className="text-xs font-medium whitespace-nowrap" style={{ color: i === step ? 'var(--primary)' : 'var(--text-muted)' }}>{s}</span>
            </div>
            {i < STEPS.length - 1 && <div className="w-6 h-0.5 flex-shrink-0 mx-1" style={{ background: i < step ? 'var(--primary)' : 'var(--border)' }} />}
          </div>
        ))}
      </div>

      <div className="card-premium p-6 sm:p-8 mb-6">
        {/* Step 0 — Route */}
        {step === 0 && (
          <div className="space-y-4">
            <h2 className="font-semibold text-lg mb-4">Route & Schedule</h2>
            <div>
              <label className="block text-sm font-medium mb-1.5">Pickup Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--success)' }} />
                <input
                  type="text"
                  placeholder="Enter pickup city or address"
                  value={form.pickupAddress}
                  onChange={(e) => update('pickupAddress', e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Destination</label>
              <div className="relative">
                <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--accent)' }} />
                <input
                  type="text"
                  placeholder="Enter destination city or address"
                  value={form.destinationAddress}
                  onChange={(e) => update('destinationAddress', e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Departure Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                  <input
                    type="date"
                    value={form.departureDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => update('departureDate', e.target.value)}
                    className="input-field pl-10"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Departure Time</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                  <input
                    type="time"
                    value={form.departureTime}
                    onChange={(e) => update('departureTime', e.target.value)}
                    className="input-field pl-10"
                  />
                </div>
              </div>
            </div>

            {/* Recurring */}
            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  onClick={() => update('isRecurring', !form.isRecurring)}
                  className="w-10 h-5 rounded-full transition-all relative"
                  style={{ background: form.isRecurring ? 'var(--primary)' : 'var(--border)' }}
                >
                  <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all" style={{ left: form.isRecurring ? '22px' : '2px' }} />
                </div>
                <span className="text-sm font-medium">Recurring Ride</span>
              </label>
              {form.isRecurring && (
                <div className="flex gap-2 mt-3 flex-wrap">
                  {days.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => update('recurringDays', form.recurringDays.includes(d) ? form.recurringDays.filter((x) => x !== d) : [...form.recurringDays, d])}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-all"
                      style={{
                        borderColor: form.recurringDays.includes(d) ? 'var(--primary)' : 'var(--border)',
                        background: form.recurringDays.includes(d) ? 'rgba(99,102,241,0.15)' : 'transparent',
                        color: form.recurringDays.includes(d) ? 'var(--primary)' : 'var(--text-secondary)',
                      }}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 1 — Vehicle */}
        {step === 1 && (
          <div>
            <h2 className="font-semibold text-lg mb-4">Vehicle & Seats</h2>
            {vehicles.length === 0 ? (
              <div className="text-center py-8">
                <Car className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
                <h3 className="font-medium mb-2">No vehicles registered</h3>
                <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>Add a vehicle first before publishing a ride.</p>
                <a href="/dashboard/rider/vehicles/new" className="btn-primary text-sm">Add Vehicle</a>
              </div>
            ) : (
              <div className="space-y-3 mb-6">
                {vehicles.map((v) => (
                  <div
                    key={v.id}
                    onClick={() => update('vehicleId', v.id)}
                    className="flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all"
                    style={{
                      borderColor: form.vehicleId === v.id ? 'var(--primary)' : 'var(--border)',
                      background: form.vehicleId === v.id ? 'rgba(99,102,241,0.06)' : 'transparent',
                    }}
                  >
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(99,102,241,0.1)' }}>
                      {v.vehicleType === 'BIKE' ? <Bike className="w-6 h-6" style={{ color: 'var(--primary)' }} /> : <Car className="w-6 h-6" style={{ color: 'var(--primary)' }} />}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">{v.brand} {v.model} ({v.year})</div>
                      <div className="text-sm" style={{ color: 'var(--text-muted)' }}>{v.registrationNumber} • {v.seatCapacity} seats • {v.vehicleType}</div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${form.vehicleId === v.id ? 'gradient-primary border-transparent' : ''}`} style={{ borderColor: form.vehicleId === v.id ? 'transparent' : 'var(--border)' }}>
                      {form.vehicleId === v.id && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1.5">Available Seats for Booking</label>
              <div className="flex items-center gap-4">
                <button type="button" onClick={() => update('availableSeats', Math.max(1, form.availableSeats - 1))}
                  className="w-10 h-10 rounded-xl border flex items-center justify-center font-bold text-lg" style={{ borderColor: 'var(--border)' }}>−</button>
                <div className="text-2xl font-bold gradient-text w-12 text-center">{form.availableSeats}</div>
                <button type="button" onClick={() => update('availableSeats', Math.min(8, form.availableSeats + 1))}
                  className="w-10 h-10 rounded-xl border flex items-center justify-center font-bold text-lg" style={{ borderColor: 'var(--border)' }}>+</button>
                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>seats available</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 2 — Pricing & Rules */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="font-semibold text-lg">Pricing & Preferences</h2>
            <div>
              <label className="block text-sm font-medium mb-1.5">Price per Seat (USD)</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                <input
                  type="number"
                  placeholder="e.g. 15.00"
                  value={form.pricePerSeat}
                  onChange={(e) => update('pricePerSeat', e.target.value)}
                  min="0"
                  step="0.5"
                  className="input-field pl-10"
                />
              </div>
              <p className="text-xs mt-1.5" style={{ color: 'var(--text-muted)' }}>
                You'll receive ~{((parseFloat(form.pricePerSeat) || 0) * 0.92).toFixed(2)} after 8% platform fee per seat
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-3">Ride Preferences</label>
              <div className="grid grid-cols-2 gap-3">
                {amenities.map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all"
                    style={{ borderColor: form[key] ? 'var(--primary)' : 'var(--border)', background: form[key] ? 'rgba(99,102,241,0.06)' : 'transparent' }}>
                    <input type="checkbox" checked={form[key]} onChange={(e) => update(key, e.target.checked)} className="hidden" />
                    <div className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0" style={{ background: form[key] ? 'var(--primary)' : 'var(--border)' }}>
                      {form[key] && <span className="text-white text-xs">✓</span>}
                    </div>
                    <span className="text-sm">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Ride Description (optional)</label>
              <textarea
                value={form.description}
                onChange={(e) => update('description', e.target.value)}
                placeholder="Tell passengers about your journey, stops, or anything relevant..."
                rows={3}
                className="input-field w-full text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Rules (optional)</label>
              <textarea
                value={form.rules}
                onChange={(e) => update('rules', e.target.value)}
                placeholder="Any specific rules for passengers..."
                rows={2}
                className="input-field w-full text-sm"
              />
            </div>
          </div>
        )}

        {/* Step 3 — Review */}
        {step === 3 && (
          <div>
            <h2 className="font-semibold text-lg mb-6">Review & Publish</h2>
            <div className="space-y-4">
              {[
                { label: 'Route', value: `${form.pickupAddress} → ${form.destinationAddress}` },
                { label: 'Departure', value: `${form.departureDate} at ${form.departureTime}` },
                { label: 'Vehicle', value: vehicles.find((v) => v.id === form.vehicleId)?.brand + ' ' + vehicles.find((v) => v.id === form.vehicleId)?.model || '—' },
                { label: 'Available Seats', value: form.availableSeats },
                { label: 'Price per Seat', value: `$${form.pricePerSeat}` },
                { label: 'Instant Booking', value: form.instantBooking ? 'Yes ⚡' : 'No (Manual approval)' },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-start justify-between py-3 border-b" style={{ borderColor: 'var(--border)' }}>
                  <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{label}</span>
                  <span className="text-sm font-semibold text-right ml-4">{String(value)}</span>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-2xl mt-6" style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.2)' }}>
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'var(--primary)' }} />
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  By publishing, you agree to our rider guidelines and terms. Travelers can book immediately if instant booking is enabled. You'll receive 92% of each fare, paid daily to your registered bank account.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        {step > 0 && (
          <button onClick={() => setStep((s) => s - 1)} className="btn-ghost py-3 px-6">← Back</button>
        )}
        {step < 3 ? (
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={next} className="btn-primary flex-1 py-3">
            Continue <ChevronRight className="w-4 h-4" />
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handlePublish}
            disabled={loading}
            className="btn-primary flex-1 py-3"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : '🚀 Publish Ride'}
          </motion.button>
        )}
      </div>
    </div>
  );
}

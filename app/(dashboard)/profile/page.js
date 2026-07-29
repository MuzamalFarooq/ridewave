'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Camera, Save, User, Phone, MapPin, Globe, Calendar, Shield, Edit2, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [avatarUploading, setAvatarUploading] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    fetch('/api/profile')
      .then((r) => r.json())
      .then((d) => {
        setProfile(d.user);
        setForm({
          name: d.user?.name || '',
          phone: d.user?.phone || '',
          bio: d.user?.profile?.bio || '',
          city: d.user?.profile?.city || '',
          gender: d.user?.profile?.gender || '',
          preferredLanguage: d.user?.profile?.preferredLanguage || 'en',
          dateOfBirth: d.user?.profile?.dateOfBirth ? d.user.profile.dateOfBirth.split('T')[0] : '',
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('folder', 'ridewave/avatars');
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const { url } = await res.json();
      await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: url }),
      });
      setProfile((p) => ({ ...p, image: url }));
      await update({ image: url });
      toast.success('Profile photo updated!');
    } catch { toast.error('Photo upload failed'); }
    finally { setAvatarUploading(false); }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      await update({ name: form.name });
      toast.success('Profile updated successfully!');
      setEditing(false);
      setProfile((p) => ({ ...p, ...form, profile: { ...p?.profile, ...form } }));
    } catch { toast.error('Failed to save profile'); }
    finally { setSaving(false); }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--primary)' }} />
      </div>
    );
  }

  const avgRating = profile?.profile?.averageRating;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-outfit font-bold">My <span className="gradient-text">Profile</span></h1>
        <button
          onClick={() => editing ? handleSave() : setEditing(true)}
          disabled={saving}
          className="btn-primary py-2.5 px-5 text-sm flex items-center gap-2"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : editing ? <><Save className="w-4 h-4" /> Save Changes</> : <><Edit2 className="w-4 h-4" /> Edit Profile</>}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — Avatar & Stats */}
        <div className="space-y-4">
          {/* Avatar */}
          <div className="card-premium p-6 text-center">
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 rounded-3xl gradient-primary flex items-center justify-center text-white text-3xl font-bold mx-auto overflow-hidden">
                {profile?.image ? <img src={profile.image} alt="" className="w-full h-full object-cover" /> : profile?.name?.[0] || 'U'}
              </div>
              {profile?.profile?.isRiderVerified && (
                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'var(--success)' }}>
                  <Shield className="w-4 h-4 text-white" />
                </div>
              )}
              <label className="absolute inset-0 flex items-center justify-center cursor-pointer rounded-3xl transition-all" style={{ background: 'rgba(0,0,0,0)' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.4)'} onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0)'}>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                <Camera className="w-5 h-5 text-white opacity-0 hover:opacity-100 transition-opacity" />
              </label>
              {avatarUploading && (
                <div className="absolute inset-0 flex items-center justify-center rounded-3xl" style={{ background: 'rgba(0,0,0,0.5)' }}>
                  <Loader2 className="w-6 h-6 text-white animate-spin" />
                </div>
              )}
            </div>
            <h2 className="font-bold text-lg">{profile?.name}</h2>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{profile?.email}</p>
            <span className="inline-block mt-2 badge" style={{ background: 'rgba(99,102,241,0.1)', color: 'var(--primary)' }}>
              {profile?.role}
            </span>
          </div>

          {/* Stats */}
          <div className="card-premium p-5">
            <h3 className="font-semibold mb-4">Stats</h3>
            <div className="space-y-3">
              {[
                { label: 'Rating', value: avgRating ? `⭐ ${avgRating.toFixed(1)}` : 'No ratings yet' },
                { label: 'Total Reviews', value: profile?.profile?.totalReviews || 0 },
                { label: profile?.role === 'RIDER' ? 'Rides Given' : 'Rides Taken', value: profile?.role === 'RIDER' ? profile?._count?.ridesAsRider || 0 : profile?._count?.bookingsAsPassenger || 0 },
                { label: 'Loyalty Points', value: `${profile?.loyaltyPoints || 0} pts` },
                { label: 'Member Since', value: profile?.profile?.joinedAt ? new Date(profile.profile.joinedAt).toLocaleDateString('en', { month: 'long', year: 'numeric' }) : '—' },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-sm">
                  <span style={{ color: 'var(--text-muted)' }}>{label}</span>
                  <span className="font-medium">{String(value)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Verification */}
          <div className="card-premium p-5">
            <h3 className="font-semibold mb-4">Verification</h3>
            <div className="space-y-2">
              {[
                { label: 'Email', verified: !!profile?.emailVerified },
                { label: 'Phone', verified: !!profile?.phone },
                { label: 'ID', verified: !!profile?.profile?.isIdVerified },
                { label: 'Rider', verified: !!profile?.profile?.isRiderVerified },
              ].map(({ label, verified }) => (
                <div key={label} className="flex items-center justify-between text-sm">
                  <span>{label} Verified</span>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: verified ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.08)', color: verified ? 'var(--success)' : 'var(--danger)' }}>
                    {verified ? '✓ Yes' : '✗ No'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — Edit Form */}
        <div className="lg:col-span-2 space-y-4">
          <div className="card-premium p-6">
            <h3 className="font-semibold text-lg mb-5">Personal Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                  <input type="text" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} disabled={!editing} className="input-field pl-10" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                  <input type="tel" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} disabled={!editing} className="input-field pl-10" placeholder="+92 300 0000000" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">City</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                  <input type="text" value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))} disabled={!editing} className="input-field pl-10" placeholder="Lahore" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Date of Birth</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                  <input type="date" value={form.dateOfBirth} onChange={(e) => setForm((f) => ({ ...f, dateOfBirth: e.target.value }))} disabled={!editing} className="input-field pl-10" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Gender</label>
                <select value={form.gender} onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value }))} disabled={!editing} className="input-field">
                  <option value="">Prefer not to say</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Language</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                  <select value={form.preferredLanguage} onChange={(e) => setForm((f) => ({ ...f, preferredLanguage: e.target.value }))} disabled={!editing} className="input-field pl-10">
                    <option value="en">English</option>
                    <option value="ur">Urdu</option>
                    <option value="ar">Arabic</option>
                  </select>
                </div>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium mb-1.5">Bio</label>
                <textarea value={form.bio} onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))} disabled={!editing} rows={3} className="input-field w-full" placeholder="Tell others about yourself..." maxLength={300} />
                <p className="text-xs mt-1 text-right" style={{ color: 'var(--text-muted)' }}>{form.bio?.length || 0}/300</p>
              </div>
            </div>
            {editing && (
              <div className="flex gap-3 mt-6">
                <button onClick={() => setEditing(false)} className="btn-ghost py-2.5 px-6 flex-1">Cancel</button>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSave} disabled={saving} className="btn-primary py-2.5 px-6 flex-1">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Changes'}
                </motion.button>
              </div>
            )}
          </div>

          {/* Account email display (non-editable) */}
          <div className="card-premium p-6">
            <h3 className="font-semibold mb-4">Account Security</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b" style={{ borderColor: 'var(--border)' }}>
                <div><div className="text-sm font-medium">Email Address</div><div className="text-xs" style={{ color: 'var(--text-muted)' }}>{profile?.email}</div></div>
                <span className="text-xs badge badge-success">Verified</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <div><div className="text-sm font-medium">Password</div><div className="text-xs" style={{ color: 'var(--text-muted)' }}>Last changed: never</div></div>
                <a href="/forgot-password" className="text-xs font-medium" style={{ color: 'var(--primary)' }}>Change →</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

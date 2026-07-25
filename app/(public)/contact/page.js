'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, MessageSquare, Send, Loader2, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const CONTACT_INFO = [
  { icon: Mail, label: 'Email', value: 'support@ridewave.com', href: 'mailto:support@ridewave.com' },
  { icon: Phone, label: 'Phone', value: '+92 300 123 4567', href: 'tel:+923001234567' },
  { icon: MessageSquare, label: 'WhatsApp', value: '+92 311 987 6543', href: 'https://wa.me/923119876543' },
  { icon: MapPin, label: 'Office', value: 'Gulberg III, Lahore, Pakistan', href: '#' },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '', type: 'GENERAL' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      toast.success('Message sent! We\'ll get back to you within 24 hours.');
      setForm({ name: '', email: '', subject: '', message: '', type: 'GENERAL' });
    } catch {
      toast.error('Failed to send message. Please try emailing us directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20" style={{ background: 'var(--bg-base)' }}>
      {/* Hero */}
      <div className="animated-bg py-20 text-center">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-outfit font-bold text-white mb-4">
          Get in <span className="gradient-text" style={{ backgroundImage: 'linear-gradient(135deg, #a78bfa, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Touch</span>
        </motion.h1>
        <p style={{ color: 'rgba(255,255,255,0.7)' }}>We're here to help. Our support team responds within 24 hours.</p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Contact Info */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-2">Contact Information</h2>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Reach out via any channel below or fill in the form.</p>
            </div>

            {CONTACT_INFO.map(({ icon: Icon, label, value, href }) => (
              <a key={label} href={href} className="flex items-center gap-4 p-4 rounded-2xl transition-all hover:shadow-md group" style={{ background: 'var(--bg-surface)' }}>
                <div className="w-10 h-10 rounded-2xl gradient-primary flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{label}</div>
                  <div className="text-sm font-semibold group-hover:text-[var(--primary)] transition-colors">{value}</div>
                </div>
              </a>
            ))}

            <div className="p-4 rounded-2xl" style={{ background: 'var(--bg-surface)' }}>
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                <span className="text-sm font-semibold">Support Hours</span>
              </div>
              <div className="text-xs space-y-1" style={{ color: 'var(--text-muted)' }}>
                <div className="flex justify-between"><span>Monday – Friday</span><span>8 AM – 10 PM</span></div>
                <div className="flex justify-between"><span>Saturday</span><span>9 AM – 8 PM</span></div>
                <div className="flex justify-between"><span>Sunday</span><span>Emergency only</span></div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <div className="card-premium p-8">
              <h2 className="text-xl font-bold mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Full Name *</label>
                    <input type="text" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="input-field" placeholder="Ahmad Khan" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Email Address *</label>
                    <input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="input-field" placeholder="you@email.com" required />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">Inquiry Type</label>
                  <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))} className="input-field">
                    {['GENERAL', 'BOOKING', 'PAYMENT', 'SAFETY', 'TECHNICAL', 'RIDER', 'PARTNERSHIP', 'OTHER'].map((t) => (
                      <option key={t} value={t}>{t.charAt(0) + t.slice(1).toLowerCase()}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">Subject *</label>
                  <input type="text" value={form.subject} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))} className="input-field" placeholder="How can we help?" required />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">Message *</label>
                  <textarea value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} rows={5} className="input-field w-full" placeholder="Describe your issue or question in detail..." required />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-3.5"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-4 h-4" /> Send Message</>}
                </motion.button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

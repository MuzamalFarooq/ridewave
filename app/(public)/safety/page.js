'use client';

import { motion } from 'framer-motion';
import { Shield, Star, CheckCircle, Lock, Phone, Eye, Heart, Users, Award, Zap } from 'lucide-react';

const SAFETY_FEATURES = [
  { icon: Shield, title: 'ID Verification', desc: 'Every rider must submit a valid CNIC and driver\'s license before being approved. Our team manually reviews all documents within 48 hours.', color: '#6366f1' },
  { icon: Eye, title: 'Vehicle Inspection', desc: 'All vehicles are photo-verified and must pass our safety checklist. Vehicles older than 15 years or with expired registration are not allowed.', color: '#10b981' },
  { icon: Lock, title: 'Secure Payments', desc: 'All digital payments are processed through Stripe, PCI DSS Level 1 certified. We never store raw card numbers.', color: '#f59e0b' },
  { icon: Phone, title: 'Emergency SOS', desc: 'One tap sends your live location and ride details to your emergency contacts and our 24/7 safety team simultaneously.', color: '#ef4444' },
  { icon: Eye, title: 'Live Tracking', desc: 'Share your real-time journey map with family or friends. Our servers log every GPS coordinate for 30 days.', color: '#8b5cf6' },
  { icon: Star, title: '5-Star Rating System', desc: 'Every completed ride is rated. Riders with patterns of poor ratings or safety issues are permanently removed from the platform.', color: '#ec4899' },
  { icon: Heart, title: 'Women-Only Rides', desc: 'Female travelers can filter for female-only rides with verified female drivers for added comfort and safety.', color: '#e879f9' },
  { icon: Award, title: 'Safety Score', desc: 'Each driver has a visible Safety Score based on reviews, trip completion rate, and incident history. Only drivers with 80+ scores appear in search.', color: '#38bdf8' },
];

const TIPS = [
  { title: 'Before the Ride', tips: ['Verify the driver\'s photo and name before entering the vehicle', 'Share your trip details with a trusted contact', 'Check the vehicle registration plate matches the app', 'Confirm the destination before the ride starts'] },
  { title: 'During the Ride', tips: ['Keep your phone charged and accessible at all times', 'Use in-app messaging instead of sharing personal numbers', 'Press SOS immediately if you feel unsafe', 'Stay on the agreed route — use the live map to track'] },
  { title: 'After the Ride', tips: ['Rate your driver honestly — it helps other travelers', 'Report any safety concern via the app immediately', 'Check you have all your belongings before exiting', 'Lost something? Contact driver via app within 24 hours'] },
];

export default function SafetyPage() {
  return (
    <div className="min-h-screen pt-20" style={{ background: 'var(--bg-base)' }}>
      {/* Hero */}
      <div className="animated-bg py-24 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <div className="w-20 h-20 rounded-3xl gradient-primary flex items-center justify-center mx-auto mb-6">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-outfit font-bold text-white mb-4">
            Safety is Our<br />
            <span style={{ background: 'linear-gradient(135deg, #a78bfa, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              #1 Priority
            </span>
          </h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.7)' }}>
            We've built multiple layers of protection so every journey on RideWave is safe, transparent, and trustworthy.
          </p>
        </motion.div>
      </div>

      {/* Safety Stats */}
      <div className="py-12" style={{ background: 'var(--bg-surface)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { value: '100%', label: 'ID-verified riders', color: '#6366f1' },
              { value: '< 2min', label: 'SOS response time', color: '#10b981' },
              { value: '4.8★', label: 'Average safety rating', color: '#f59e0b' },
              { value: '0', label: 'Unresolved incidents (2026)', color: '#ec4899' },
            ].map(({ value, label, color }, i) => (
              <motion.div key={label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                <div className="text-3xl font-outfit font-bold mb-1" style={{ color }}>{value}</div>
                <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>{label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Safety Features */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-outfit font-bold mb-4">How We Keep You <span className="gradient-text">Protected</span></h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {SAFETY_FEATURES.map(({ icon: Icon, title, desc, color }, i) => (
              <motion.div key={title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} whileHover={{ y: -6 }} className="card-premium p-5">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ background: `${color}15` }}>
                  <Icon className="w-6 h-6" style={{ color }} />
                </div>
                <h3 className="font-bold mb-2">{title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety Tips */}
      <section className="py-20" style={{ background: 'var(--bg-surface)' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-outfit font-bold mb-4">Safety <span className="gradient-text">Tips</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TIPS.map(({ title, tips }, i) => (
              <motion.div key={title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="card-premium p-6">
                <h3 className="font-bold text-lg mb-4 gradient-text">{title}</h3>
                <ul className="space-y-2">
                  {tips.map((tip) => (
                    <li key={tip} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#10b981' }} />
                      <span style={{ color: 'var(--text-secondary)' }}>{tip}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency CTA */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="card-premium p-10">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(239,68,68,0.1)' }}>
              <Phone className="w-8 h-8" style={{ color: '#ef4444' }} />
            </div>
            <h3 className="text-2xl font-bold mb-3">24/7 Emergency Line</h3>
            <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
              Our dedicated safety team is always available for urgent matters.<br />Use the SOS button in-app for instant alerts.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href="tel:+923001234567" className="btn-primary px-8 py-3"><Phone className="w-4 h-4" /> +92 300 123 4567</a>
              <a href="mailto:safety@ridewave.com" className="btn-ghost px-8 py-3 border" style={{ borderColor: 'var(--border)' }}>Email Safety Team</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

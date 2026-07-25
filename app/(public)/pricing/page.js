'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { CheckCircle, Zap, Star, Building2, ArrowRight } from 'lucide-react';

const PLANS = [
  {
    name: 'Free Traveler',
    price: 0,
    desc: 'Perfect for occasional riders looking to book seats',
    features: ['Search & browse all rides', 'Book up to 5 rides/month', 'In-app chat with driver', 'Star-rated reviews', 'Email booking confirmations', 'Basic customer support'],
    cta: 'Get Started Free',
    href: '/auth/register',
    highlight: false,
    badge: null,
  },
  {
    name: 'RideWave Plus',
    price: 499,
    period: '/month',
    desc: 'For frequent travelers who want the best experience',
    features: ['Unlimited ride bookings', 'Priority booking confirmation', 'Seat preference lock', '10% discount on all rides', 'Exclusive members-only deals', 'AI-powered trip recommendations', 'Loyalty points 2× multiplier', '24/7 premium support'],
    cta: 'Start Plus Plan',
    href: '/auth/register?plan=plus',
    highlight: true,
    badge: 'Most Popular',
  },
  {
    name: 'Rider Pro',
    price: 999,
    period: '/month',
    desc: 'For professional riders who want to maximize earnings',
    features: ['Featured listing in search', 'Zero commission on 1st 5 rides/month (save 8%)', 'Dedicated account manager', 'Advanced analytics dashboard', 'Priority verification (6 hours)', 'Custom ride branding', 'Bulk ride scheduling', 'API access for integrations'],
    cta: 'Upgrade to Pro',
    href: '/auth/register?role=RIDER&plan=pro',
    highlight: false,
    badge: '🚗 Riders',
  },
];

const COMPARE = [
  { feature: 'Monthly Bookings', free: '5', plus: 'Unlimited', pro: 'Unlimited' },
  { feature: 'Ride Discounts', free: '—', plus: '10% off', pro: '15% off' },
  { feature: 'Loyalty Points', free: '1×', plus: '2×', pro: '3×' },
  { feature: 'Support', free: 'Email only', plus: 'Priority chat', pro: 'Dedicated manager' },
  { feature: 'Analytics', free: 'Basic', plus: 'Standard', pro: 'Advanced' },
  { feature: 'Featured in Search', free: '—', plus: '—', pro: '✓' },
  { feature: 'Commission Waiver', free: '—', plus: '—', pro: '5 rides free' },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen pt-20" style={{ background: 'var(--bg-base)' }}>
      {/* Hero */}
      <div className="animated-bg py-20 text-center">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl sm:text-5xl font-outfit font-bold text-white mb-4">
          Simple, Transparent <span style={{ background: 'linear-gradient(135deg, #a78bfa, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Pricing</span>
        </motion.h1>
        <p className="text-lg" style={{ color: 'rgba(255,255,255,0.7)' }}>No hidden fees. Cancel anytime.</p>
      </div>

      {/* Plans */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {PLANS.map(({ name, price, period, desc, features, cta, href, highlight, badge }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className={`card-premium p-7 flex flex-col relative ${highlight ? 'ring-2 ring-[var(--primary)]' : ''}`}
            >
              {badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold" style={{ background: highlight ? 'var(--primary)' : 'var(--bg-surface)', color: highlight ? 'white' : 'var(--text-primary)', border: '1px solid var(--border)' }}>
                  {badge}
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-outfit font-bold mb-1">{name}</h3>
                <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>{desc}</p>
                <div className="flex items-end gap-1">
                  <span className="text-5xl font-outfit font-bold gradient-text">PKR {price.toLocaleString()}</span>
                  {period && <span className="text-sm mb-2" style={{ color: 'var(--text-muted)' }}>{period}</span>}
                </div>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: highlight ? 'var(--primary)' : '#10b981' }} />
                    <span style={{ color: 'var(--text-secondary)' }}>{f}</span>
                  </li>
                ))}
              </ul>

              <Link href={href}>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`w-full py-3.5 rounded-2xl font-semibold text-sm ${highlight ? 'btn-primary' : 'btn-ghost border'}`}
                  style={!highlight ? { borderColor: 'var(--border)' } : {}}
                >
                  {cta} <ArrowRight className="w-4 h-4 inline" />
                </motion.button>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Platform Fee Note */}
        <div className="p-6 rounded-2xl mb-12" style={{ background: 'var(--bg-surface)' }}>
          <h3 className="font-bold mb-2 flex items-center gap-2"><Building2 className="w-5 h-5" style={{ color: 'var(--primary)' }} /> Platform Fee for Riders</h3>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            RideWave charges an <strong>8% platform fee</strong> on every completed ride. This covers insurance, payment processing, 24/7 support, and platform maintenance. With Rider Pro, your first 5 rides each month are commission-free.
          </p>
        </div>

        {/* Comparison Table */}
        <h2 className="text-2xl font-outfit font-bold text-center mb-6">Compare Plans</h2>
        <div className="card-premium overflow-hidden">
          <table className="w-full text-sm">
            <thead style={{ background: 'var(--bg-surface)' }}>
              <tr>
                <th className="text-left px-5 py-4 font-semibold" style={{ color: 'var(--text-muted)' }}>Feature</th>
                {['Free', 'Plus', 'Pro'].map((h) => <th key={h} className="px-5 py-4 font-semibold text-center" style={{ color: h === 'Plus' ? 'var(--primary)' : 'var(--text-secondary)' }}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {COMPARE.map(({ feature, free, plus, pro }, i) => (
                <tr key={feature} className="border-t" style={{ borderColor: 'var(--border)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)' }}>
                  <td className="px-5 py-3.5">{feature}</td>
                  <td className="px-5 py-3.5 text-center" style={{ color: 'var(--text-muted)' }}>{free}</td>
                  <td className="px-5 py-3.5 text-center font-medium" style={{ color: 'var(--primary)' }}>{plus}</td>
                  <td className="px-5 py-3.5 text-center font-medium" style={{ color: 'var(--text-secondary)' }}>{pro}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

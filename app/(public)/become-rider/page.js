'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Car, CheckCircle, DollarSign, Star, Shield, Clock, Users, ArrowRight,
  ChevronDown, ChevronUp, Bike, Zap, TrendingUp, MessageSquare, BarChart2
} from 'lucide-react';

const STEPS = [
  { step: '01', title: 'Create Your Account', desc: 'Sign up as a Rider and complete your profile with your personal information.', icon: Users },
  { step: '02', title: 'Register Your Vehicle', desc: 'Add your car or bike details. Our team verifies documents within 24 hours.', icon: Car },
  { step: '03', title: 'Publish Your First Ride', desc: 'Set your route, date, price, and available seats. Go live in minutes.', icon: Zap },
  { step: '04', title: 'Accept Bookings & Earn', desc: 'Travelers book your seats. Accept requests and get paid after every ride.', icon: DollarSign },
];

const BENEFITS = [
  { icon: DollarSign, title: 'Earn PKR 30K–80K/month', desc: 'Full-time riders on RideWave earn consistently. Your earning potential grows with more rides and better ratings.', color: '#10b981' },
  { icon: Clock, title: 'Complete Flexibility', desc: 'Set your own schedule. Drive when you want, take the routes you choose, and take days off whenever you need.', color: '#6366f1' },
  { icon: Shield, title: 'Fully Protected', desc: "RideWave's insurance covers all rides. Traveler identities are verified before they can book your vehicle.", color: '#f59e0b' },
  { icon: Star, title: 'Build Your Reputation', desc: 'Earn 5-star reviews to unlock Featured Rider status with priority placement and higher fares.', color: '#ec4899' },
  { icon: BarChart2, title: 'Real-time Analytics', desc: 'Track your earnings, acceptance rate, ratings, and performance through your dedicated rider dashboard.', color: '#8b5cf6' },
  { icon: MessageSquare, title: 'Dedicated Support', desc: '24/7 rider support via in-app chat, phone, and WhatsApp. We are always here for you.', color: '#3b82f6' },
];

const FAQS = [
  { q: 'What vehicles are eligible?', a: 'Any privately owned car, van, or motorbike (2010 or newer) with valid registration and insurance. The vehicle must pass our photo verification.' },
  { q: 'How do I get paid?', a: 'Earnings are processed daily to your registered bank account (JazzCash, EasyPaisa, or any Pakistan bank). You keep 92% of every fare.' },
  { q: 'What if a passenger cancels?', a: "If they cancel more than 2 hours before departure, you receive a 50% cancellation fee. Within 2 hours, you receive 100% of the fare." },
  { q: 'Can I choose my passengers?', a: 'Yes! With manual approval mode, you review every booking request before accepting. With instant booking, passengers auto-confirm.' },
  { q: 'Is there a registration fee?', a: 'Zero fees to join RideWave. No monthly subscription, no registration cost. We only take 8% from each completed ride.' },
];

export default function BecomeRiderPage() {
  const { data: session } = useSession();
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div style={{ background: 'var(--bg-base)' }}>
      {/* Hero */}
      <section className="animated-bg min-h-[70vh] flex items-center pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-white">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6" style={{ background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(255,255,255,0.15)' }}>
                <TrendingUp className="w-4 h-4" style={{ color: '#fbbf24' }} /> PKR 80,000+ earning potential
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-outfit font-bold mb-6 leading-tight">
                Drive. Earn.<br />
                <span style={{ background: 'linear-gradient(135deg, #a78bfa, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Live Better.
                </span>
              </h1>
              <p className="text-lg mb-8 leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>
                Turn your daily commutes into a source of income. Join 12,000+ verified riders on Pakistan's most trusted ride-sharing platform and earn on your own terms.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href={session ? '/dashboard/rider' : '/register?role=RIDER'}>
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(99,102,241,0.4)' }}
                    whileTap={{ scale: 0.97 }}
                    className="btn-primary text-lg px-8 py-4"
                  >
                    Start Earning Today <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </Link>
                <a href="#how-it-works">
                  <button className="px-8 py-4 rounded-full border-2 font-semibold transition-all text-lg" style={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white', background: 'rgba(255,255,255,0.08)' }}>
                    Learn More
                  </button>
                </a>
              </div>
              <div className="flex flex-wrap gap-6 mt-8">
                {['No monthly fees', '92% earnings kept', '24h payouts'].map((t) => (
                  <div key={t} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" style={{ color: '#10b981' }} />
                    <span className="text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>{t}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Earnings Calculator */}
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <EarningsCalculator />
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-outfit font-bold mb-4">Start Earning in <span className="gradient-text">4 Simple Steps</span></h2>
            <p style={{ color: 'var(--text-secondary)' }}>Get verified and publish your first ride in under 30 minutes</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map(({ step, title, desc, icon: Icon }, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="card-premium p-6 text-center relative"
              >
                <div className="absolute top-4 right-4 text-5xl font-bold font-outfit opacity-5">{step}</div>
                <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4"><Icon className="w-7 h-7 text-white" /></div>
                <h3 className="font-semibold text-lg mb-2">{title}</h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20" style={{ background: 'var(--bg-surface)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-outfit font-bold mb-4">Why Riders <span className="gradient-text">Choose RideWave</span></h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {BENEFITS.map(({ icon: Icon, title, desc, color }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -6 }}
                className="glass-card p-6 flex gap-4"
              >
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: `${color}15` }}>
                  <Icon className="w-6 h-6" style={{ color }} />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{title}</h3>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-outfit font-bold mb-4">Common <span className="gradient-text">Questions</span></h2>
          </div>
          <div className="space-y-3">
            {FAQS.map(({ q, a }, i) => (
              <div key={i} className="card-premium overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="font-medium">{q}</span>
                  {openFaq === i ? <ChevronUp className="w-4 h-4 shrink-0" style={{ color: 'var(--primary)' }} /> : <ChevronDown className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />}
                </button>
                {openFaq === i && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} className="px-5 pb-5">
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{a}</p>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20" style={{ background: 'var(--bg-surface)' }}>
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-outfit font-bold mb-4">
            Ready to <span className="gradient-text">Start Earning?</span>
          </h2>
          <p className="mb-8 text-lg" style={{ color: 'var(--text-secondary)' }}>
            Join 12,000+ riders. It only takes 5 minutes to get started.
          </p>
          <Link href={session ? '/dashboard/rider' : '/register?role=RIDER'}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="btn-primary text-lg px-10 py-4"
            >
              Create Rider Account — It's Free <ArrowRight className="w-5 h-5" />
            </motion.button>
          </Link>
        </div>
      </section>
    </div>
  );
}

function EarningsCalculator() {
  const [ridesPerWeek, setRidesPerWeek] = useState(5);
  const [pricePerSeat, setPricePerSeat] = useState(1200);
  const [avgPassengers, setAvgPassengers] = useState(2);

  const weeklyGross = ridesPerWeek * pricePerSeat * avgPassengers;
  const weeklyNet = weeklyGross * 0.92;
  const monthlyNet = weeklyNet * 4;

  return (
    <div className="glass-card p-6 rounded-3xl text-white">
      <h3 className="font-bold text-xl mb-6">💰 Earnings Calculator</h3>
      <div className="space-y-4 mb-6">
        {[
          { label: 'Rides per week', value: ridesPerWeek, set: setRidesPerWeek, min: 1, max: 14 },
          { label: 'Price per seat (PKR)', value: pricePerSeat, set: setPricePerSeat, min: 500, max: 5000, step: 100 },
          { label: 'Avg passengers per ride', value: avgPassengers, set: setAvgPassengers, min: 1, max: 6 },
        ].map(({ label, value, set, min, max, step = 1 }) => (
          <div key={label}>
            <div className="flex justify-between text-sm mb-1">
              <span style={{ color: 'rgba(255,255,255,0.7)' }}>{label}</span>
              <span className="font-semibold">{value.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={value}
              onChange={(e) => set(Number(e.target.value))}
              className="w-full"
              style={{ accentColor: '#a78bfa' }}
            />
          </div>
        ))}
      </div>
      <div className="border-t pt-4" style={{ borderColor: 'rgba(255,255,255,0.15)' }}>
        <div className="flex justify-between text-sm mb-2">
          <span style={{ color: 'rgba(255,255,255,0.6)' }}>Weekly earnings</span>
          <span className="font-semibold">PKR {weeklyNet.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold" style={{ color: 'rgba(255,255,255,0.8)' }}>Monthly earnings</span>
          <span className="text-2xl font-bold" style={{ color: '#a78bfa' }}>PKR {monthlyNet.toLocaleString()}</span>
        </div>
        <p className="text-xs mt-2" style={{ color: 'rgba(255,255,255,0.4)' }}>After 8% platform fee. Actual earnings vary.</p>
      </div>
    </div>
  );
}

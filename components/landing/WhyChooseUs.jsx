'use client';

import { motion } from 'framer-motion';
import {
  Navigation,
  MapPin,
  ShieldCheck,
  UserCheck,
  Zap,
  MessageSquare,
  PhoneCall,
  Clock,
  Star,
  Banknote,
  CheckCircle2,
  Lock,
  Sparkles
} from 'lucide-react';

export default function WhyChooseUs() {
  const features = [
    { title: 'Real-time ride tracking', icon: Navigation, desc: 'Live GPS trajectory & telemetry stream.' },
    { title: 'Google Maps integration', icon: MapPin, desc: 'Turn-by-turn route optimization & ETA.' },
    { title: 'Secure online payments', icon: Lock, desc: 'Stripe, Cards, JazzCash & EasyPaisa escrow.' },
    { title: 'Verified riders', icon: UserCheck, desc: 'Government ID, CNIC & Driving License checked.' },
    { title: 'Instant booking', icon: Zap, desc: 'Book a seat in under 30 seconds with instant lock.' },
    { title: 'In-app messaging', icon: MessageSquare, desc: 'Direct encrypted chat between driver & rider.' },
    { title: 'Voice & video calling', icon: PhoneCall, desc: 'Free WebRTC in-app calls without sharing phone #' },
    { title: 'Ride history', icon: Clock, desc: 'Digital tax invoices & complete travel log.' },
    { title: 'Reviews & ratings', icon: Star, desc: 'Transparent double-blind rating system.' },
    { title: 'Affordable prices', icon: Banknote, desc: 'Up to 70% cheaper than traditional cabs.' },
  ];

  return (
    <section className="py-24 bg-slate-950 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Heading & Feature Grid */}
          <div className="lg:col-span-7">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xs font-bold uppercase tracking-widest text-indigo-400 px-3 py-1 bg-indigo-500/10 rounded-full border border-indigo-500/20"
            >
              Unmatched Value
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-4 text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-outfit"
            >
              Why Millions Choose <span className="gradient-text">RideWave</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-4 text-base sm:text-lg text-slate-400 font-light leading-relaxed"
            >
              RideWave bridges cutting-edge mobile telemetry with rigorous safety protocols, giving drivers max earnings and passengers total peace of mind.
            </motion.p>

            {/* 10 Feature List Items */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                    className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/40 transition-colors"
                  >
                    <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 shrink-0 mt-0.5">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white flex items-center gap-1.5">
                        {item.title}
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5 font-light">{item.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Premium Visual Card & Telemetry Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-2xl shadow-2xl">
              {/* Illustration Image */}
              <div className="relative h-72 sm:h-80 rounded-2xl overflow-hidden mb-6">
                <img
                  src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1000&q=80"
                  alt="Driver inside modern luxury vehicle with digital navigation dashboard"
                  className="w-full h-full object-cover filter brightness-75 hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />

                {/* Floating GPS Telemetry Overlay */}
                <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-slate-900/90 border border-slate-700/80 backdrop-blur-md flex items-center justify-between text-xs text-white">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="font-semibold text-emerald-400">Live GPS Stream</span>
                  </div>
                  <span className="text-slate-300 font-mono">33.6844° N, 73.0479° E</span>
                </div>
              </div>

              {/* Stat Highlight Card */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
                  <p className="text-2xl font-bold text-indigo-400 font-outfit">4.9 / 5.0</p>
                  <p className="text-xs text-slate-400 mt-1">Average Rider Rating</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
                  <p className="text-2xl font-bold text-emerald-400 font-outfit">99.9%</p>
                  <p className="text-xs text-slate-400 mt-1">On-Time Arrival Rate</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

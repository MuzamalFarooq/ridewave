'use client';

import { motion } from 'framer-motion';
import { Search, UserCheck, ShieldCheck, ArrowRight } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      step: '01',
      title: 'Search Your Destination',
      description: 'Enter your departure city, destination, travel date, and number of seats. Explore available rides or create a ride alert.',
      icon: Search,
      color: 'from-blue-500 to-indigo-500',
      tag: 'Instant Search',
    },
    {
      step: '02',
      title: 'Choose Your Preferred Rider',
      description: 'Filter verified drivers by ratings, vehicle comfort, luggage space, passenger reviews, and exact pick-up locations.',
      icon: UserCheck,
      color: 'from-purple-500 to-indigo-500',
      tag: 'Verified Matches',
    },
    {
      step: '03',
      title: 'Book Instantly & Travel Safely',
      description: 'Confirm your seat with safe cashless payment or cash. Enjoy real-time GPS telemetry, emergency SOS, and smooth journeys.',
      icon: ShieldCheck,
      color: 'from-emerald-500 to-teal-500',
      tag: 'Peace of Mind',
    },
  ];

  return (
    <section className="py-24 bg-slate-900 border-t border-slate-800/80 relative overflow-hidden">
      {/* Glow background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-bold uppercase tracking-widest text-indigo-400 px-3 py-1 bg-indigo-500/10 rounded-full border border-indigo-500/20"
          >
            Simple 3-Step Process
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-outfit"
          >
            How RideWave Works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-base sm:text-lg text-slate-400 font-light"
          >
            Booking a safe, comfortable ride or sharing your car takes less than two minutes.
          </motion.p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting Line across Desktop Steps */}
          <div className="hidden md:block absolute top-1/2 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-indigo-500/40 via-purple-500/40 to-emerald-500/40 -translate-y-12 z-0" />

          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative z-10 flex flex-col items-center text-center p-8 rounded-3xl bg-slate-950/70 border border-slate-800 hover:border-indigo-500/50 backdrop-blur-xl shadow-xl hover:-translate-y-2 transition-all duration-300 group"
              >
                {/* Step Badge Number */}
                <div className="absolute -top-5 px-4 py-1 rounded-full bg-slate-900 border border-slate-700 text-xs font-bold text-indigo-400 shadow-md">
                  STEP {item.step}
                </div>

                {/* Animated Icon Circle */}
                <div className={`mt-3 mb-6 p-5 rounded-2xl bg-gradient-to-br ${item.color} text-white shadow-xl shadow-indigo-500/20 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-8 h-8" />
                </div>

                <span className="text-xs font-semibold text-indigo-400 mb-1">{item.tag}</span>
                <h3 className="text-xl font-bold text-white mb-3 font-outfit group-hover:text-indigo-200 transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed font-light">
                  {item.description}
                </p>

                {/* Arrow indicator for non-last steps on desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 text-slate-600 group-hover:text-indigo-400 transition-colors">
                    <ArrowRight className="w-6 h-6 animate-pulse" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

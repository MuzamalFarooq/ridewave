'use client';

import { motion } from 'framer-motion';
import { Navigation, Bell, PhoneCall, ShieldCheck, CheckCircle2, Apple, Smartphone, Sparkles } from 'lucide-react';

export default function AppPromotion() {
  const appFeatures = [
    { title: 'Live Ride Tracking', icon: Navigation, desc: 'Share sub-second telemetry with your trusted contacts.' },
    { title: 'Instant Notifications', icon: Bell, desc: 'Real-time alerts for booking confirmation & driver arrival.' },
    { title: 'Voice & Video Chat', icon: PhoneCall, desc: 'In-app encrypted calls without revealing phone numbers.' },
    { title: 'Secure Booking', icon: ShieldCheck, desc: 'Cashless single-tap reservation with escrow protection.' },
  ];

  return (
    <section className="py-24 bg-slate-950 border-t border-slate-800/80 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Mobile App Frame Mockup */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 flex justify-center"
          >
            <div className="relative w-full max-w-sm">
              {/* Glowing ring behind mockup */}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-[48px] blur-2xl opacity-30 animate-pulse-glow" />

              {/* iPhone-style Device Frame */}
              <div className="relative rounded-[48px] border-8 border-slate-800 bg-slate-950 p-4 shadow-2xl overflow-hidden">
                {/* Dynamic Island Notch */}
                <div className="w-32 h-5 bg-slate-900 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-slate-950 mr-2" />
                  <div className="w-2 h-2 rounded-full bg-indigo-500/80" />
                </div>

                {/* Inner Screen Content */}
                <div className="bg-slate-900 rounded-[36px] p-4 text-white space-y-4">
                  {/* Top Bar */}
                  <div className="flex items-center justify-between text-xs font-semibold border-b border-slate-800 pb-2">
                    <span className="text-indigo-400 font-outfit">RideWave Mobile</span>
                    <span className="text-emerald-400 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> Live GPS
                    </span>
                  </div>

                  {/* Mock Ride Status Card */}
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">Islamabad ➔ Lahore</span>
                      <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full font-semibold">
                        CONFIRMED
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Honda Civic • Capt. Usman</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full w-3/4 animate-pulse" />
                    </div>
                    <p className="text-[10px] text-slate-400 text-right">ETA: 45 minutes</p>
                  </div>

                  {/* App Map Preview Image */}
                  <div className="relative h-44 rounded-2xl overflow-hidden border border-slate-800">
                    <img
                      src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=600&q=80"
                      alt="Mobile map tracking application preview"
                      className="w-full h-full object-cover filter brightness-90"
                    />
                    <div className="absolute inset-0 bg-slate-950/20" />
                    <div className="absolute top-2 left-2 px-2.5 py-1 rounded-full bg-slate-950/90 text-[10px] text-white backdrop-blur-md">
                      Route 220 km • M-2 Highway
                    </div>
                  </div>

                  {/* Call Action Button */}
                  <div className="p-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-center font-semibold text-xs text-white">
                    In-App Voice Call Active 📞
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Content & Features */}
          <div className="lg:col-span-6">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xs font-bold uppercase tracking-widest text-indigo-400 px-3 py-1 bg-indigo-500/10 rounded-full border border-indigo-500/20"
            >
              Pocket Companion
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-4 text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-outfit"
            >
              Download the <span className="gradient-text">RideWave App</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-4 text-base sm:text-lg text-slate-400 font-light leading-relaxed"
            >
              Experience seamless booking, live driver telemetry, instant SOS triggers, and zero-fee wallet transfers right on your iOS or Android smartphone.
            </motion.p>

            {/* App Features List */}
            <div className="mt-8 space-y-4">
              {appFeatures.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                    className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 transition-colors"
                  >
                    <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                        {item.title}
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5 font-light">{item.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Download Badges */}
            <div className="mt-10 pt-6 border-t border-slate-800 flex flex-wrap items-center gap-4">
              <a
                href="#"
                className="flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-slate-900 border border-slate-700 hover:border-indigo-500 hover:bg-slate-800 text-white transition-all shadow-lg group"
              >
                <Apple className="w-7 h-7 text-indigo-400 group-hover:scale-110 transition-transform" />
                <div className="text-left">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider">Download on the</p>
                  <p className="text-sm font-bold font-outfit">Apple App Store</p>
                </div>
              </a>

              <a
                href="#"
                className="flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-slate-900 border border-slate-700 hover:border-indigo-500 hover:bg-slate-800 text-white transition-all shadow-lg group"
              >
                <Smartphone className="w-7 h-7 text-emerald-400 group-hover:scale-110 transition-transform" />
                <div className="text-left">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider">Get it on</p>
                  <p className="text-sm font-bold font-outfit">Google Play</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

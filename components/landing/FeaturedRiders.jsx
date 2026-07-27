'use client';

import { motion } from 'framer-motion';
import { Star, ShieldCheck, Award, Car, Clock, CheckCircle2, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export default function FeaturedRiders() {
  const riders = [
    {
      name: 'Capt. Usman Malik',
      role: 'Super Captain & Executive Driver',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      rating: 4.95,
      reviewsCount: 340,
      completedRides: '1,480+',
      vehicle: 'Honda Civic Oriel (2024)',
      vehicleType: 'Sedan • AC • Leather Seats',
      experience: '5+ Years on RideWave',
      verified: true,
      bio: 'Punctual, non-smoker, clean luxury sedan with complementary high-speed Wi-Fi & chargers.',
    },
    {
      name: 'Sarah Ahmed',
      role: 'Top-Rated Intercity Driver',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
      rating: 4.98,
      reviewsCount: 290,
      completedRides: '1,120+',
      vehicle: 'Toyota Corolla Grande (2023)',
      vehicleType: 'Sedan • Women Preferred Rides',
      experience: '4+ Years on RideWave',
      verified: true,
      bio: 'Specialized in comfortable weekend intercity carpool routes with strict safety compliance.',
    },
    {
      name: 'Hamza Farooq',
      role: 'City Bike & Car Express',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      rating: 4.90,
      reviewsCount: 185,
      completedRides: '890+',
      vehicle: 'Hyundai Elantra (2023) & Yamaha YBR',
      vehicleType: 'Executive Sedan & Bike',
      experience: '3+ Years on RideWave',
      verified: true,
      bio: 'Daily commuter between Islamabad F-7 and Lahore Gulberg. Smooth driving & polite ambiance.',
    },
  ];

  return (
    <section className="py-24 bg-slate-950 border-t border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-bold uppercase tracking-widest text-indigo-400 px-3 py-1 bg-indigo-500/10 rounded-full border border-indigo-500/20"
          >
            Verified Captains
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-outfit"
          >
            Top-Rated RideWave Drivers
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-base sm:text-lg text-slate-400 font-light"
          >
            Every rider is background-verified, identity-checked, and rated continuously by real travelers.
          </motion.p>
        </div>

        {/* Rider Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {riders.map((rider, idx) => (
            <motion.div
              key={rider.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="group relative rounded-3xl bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/50 p-6 backdrop-blur-xl shadow-xl transition-all duration-500 hover:-translate-y-2 flex flex-col justify-between"
            >
              <div>
                {/* Rider Header */}
                <div className="flex items-center gap-4 mb-5">
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-indigo-500/30 shrink-0">
                    <img src={rider.avatar} alt={rider.name} className="w-full h-full object-cover" />
                    {rider.verified && (
                      <span className="absolute bottom-1 right-1 p-0.5 rounded-full bg-emerald-500 text-slate-950 shadow-md">
                        <CheckCircle2 className="w-3.5 h-3.5 fill-emerald-500 text-white" />
                      </span>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors font-outfit">
                        {rider.name}
                      </h3>
                      {rider.verified && (
                        <ShieldCheck className="w-4 h-4 text-indigo-400" title="Verified Driver" />
                      )}
                    </div>
                    <p className="text-xs text-slate-400 font-medium">{rider.role}</p>

                    {/* Star Rating */}
                    <div className="flex items-center gap-1 mt-1 text-xs text-amber-400 font-semibold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{rider.rating}</span>
                      <span className="text-slate-500">({rider.reviewsCount} reviews)</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-300 bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 mb-5 font-light leading-relaxed italic">
                  "{rider.bio}"
                </p>

                {/* Details List */}
                <div className="space-y-2.5 text-xs text-slate-300">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/50">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Car className="w-3.5 h-3.5 text-indigo-400" /> Vehicle
                    </span>
                    <span className="font-semibold text-white">{rider.vehicle}</span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/50">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-purple-400" /> Completed Rides
                    </span>
                    <span className="font-semibold text-emerald-400">{rider.completedRides}</span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/50">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-pink-400" /> Platform Exp.
                    </span>
                    <span className="font-semibold text-white">{rider.experience}</span>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="mt-6 pt-4 border-t border-slate-800/80">
                <Link
                  href="/find-ride"
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-indigo-600 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 group/btn"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-indigo-400 group-hover/btn:text-white" />
                  <span>Book with {rider.name.split(' ')[1] || rider.name}</span>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

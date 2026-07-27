'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  MapPin,
  Calendar,
  Users,
  Search,
  ShieldCheck,
  CreditCard,
  Navigation,
  Headphones,
  Car,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  Star
} from 'lucide-react';

export default function HeroSection() {
  const router = useRouter();
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [passengers, setPassengers] = useState('1');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    setIsSearching(true);
    const params = new URLSearchParams();
    if (pickup) params.set('from', pickup);
    if (destination) params.set('to', destination);
    if (date) params.set('date', date);
    if (passengers) params.set('seats', passengers);

    setTimeout(() => {
      router.push(`/find-ride?${params.toString()}`);
    }, 400);
  };

  const trustBadges = [
    { icon: ShieldCheck, title: 'Verified Riders', subtitle: '100% ID & License Checked', color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    { icon: CreditCard, title: 'Secure Payments', subtitle: 'Encrypted & Guaranteed', color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { icon: Navigation, title: 'Live GPS Tracking', subtitle: 'Real-time Trip Monitor', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { icon: Headphones, title: '24/7 Support', subtitle: 'Always Here for You', color: 'text-amber-400', bg: 'bg-amber-500/10' },
  ];

  return (
    <section className="relative min-h-screen pt-24 pb-16 flex items-center justify-center overflow-hidden bg-slate-950">
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=2000&q=80"
          alt="City skyline highway background"
          className="w-full h-full object-cover object-center scale-105 filter brightness-50 opacity-40 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/70 to-slate-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.25),rgba(255,255,255,0))]" />
      </div>

      {/* Animated Floating Light Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          x: [0, 30, 0],
          y: [0, -30, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/4 left-10 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none z-0"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
          x: [0, -40, 0],
          y: [0, 40, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute bottom-1/4 right-10 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none z-0"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="text-center max-w-4xl mx-auto pt-6">
          {/* Top Pill Announcement */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 backdrop-blur-md mb-8"
          >
            <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
            <span className="text-xs sm:text-sm font-medium text-indigo-200">
              The Next Generation of Ride-Sharing & Intercity Travel
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 text-xs bg-indigo-500 text-white px-2 py-0.5 rounded-full font-semibold">
              NEW
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.1] font-outfit"
          >
            Travel Smarter with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              RideWave
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto font-light leading-relaxed"
          >
            Book trusted rides or earn money by sharing your car or bike. Safe, affordable, and available anytime.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/find-ride"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-base hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:-translate-y-0.5 active:translate-y-0 group"
            >
              <span>Find a Ride</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/become-rider"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full border border-slate-700 bg-slate-900/60 text-slate-200 font-semibold text-base hover:bg-slate-800 hover:border-slate-600 hover:text-white transition-all duration-300 backdrop-blur-md hover:-translate-y-0.5 active:translate-y-0"
            >
              <Car className="w-5 h-5 text-indigo-400" />
              <span>Become a Rider</span>
            </Link>
          </motion.div>
        </div>

        {/* Hero Glassmorphism Search Box */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-12 max-w-5xl mx-auto"
        >
          <div className="relative rounded-3xl border border-slate-800/80 bg-slate-900/70 p-4 sm:p-6 backdrop-blur-2xl shadow-2xl shadow-indigo-950/40">
            {/* Header Tabs */}
            <div className="flex items-center gap-3 mb-4 border-b border-slate-800 pb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 rounded-full border border-indigo-500/20">
                <Car className="w-3.5 h-3.5" /> Intercity & City Rides
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Instant Confirmation
              </span>
            </div>

            <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
              {/* Pickup Location */}
              <div className="lg:col-span-3 relative group">
                <label className="block text-xs font-medium text-slate-400 mb-1 pl-1">Pickup Location</label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-indigo-400">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                    placeholder="e.g. Islamabad, F-7"
                    className="w-full pl-10 pr-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                </div>
              </div>

              {/* Destination */}
              <div className="lg:col-span-3 relative group">
                <label className="block text-xs font-medium text-slate-400 mb-1 pl-1">Destination</label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-purple-400">
                    <Navigation className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="e.g. Lahore, Gulberg"
                    className="w-full pl-10 pr-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                  />
                </div>
              </div>

              {/* Date */}
              <div className="lg:col-span-3 relative group">
                <label className="block text-xs font-medium text-slate-400 mb-1 pl-1">Travel Date</label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-pink-400">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-400 transition-all"
                  />
                </div>
              </div>

              {/* Passengers */}
              <div className="lg:col-span-1 relative group">
                <label className="block text-xs font-medium text-slate-400 mb-1 pl-1">Seats</label>
                <div className="relative flex items-center">
                  <div className="absolute left-3 text-emerald-400">
                    <Users className="w-4 h-4" />
                  </div>
                  <select
                    value={passengers}
                    onChange={(e) => setPassengers(e.target.value)}
                    className="w-full pl-8 pr-2 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all appearance-none cursor-pointer"
                  >
                    <option value="1" className="bg-slate-900">1</option>
                    <option value="2" className="bg-slate-900">2</option>
                    <option value="3" className="bg-slate-900">3</option>
                    <option value="4" className="bg-slate-900">4+</option>
                  </select>
                </div>
              </div>

              {/* Search Button */}
              <div className="lg:col-span-2 pt-5 sm:pt-0">
                <button
                  type="submit"
                  disabled={isSearching}
                  className="w-full py-3.5 px-6 rounded-xl bg-linear-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white font-semibold text-sm hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 group disabled:opacity-75"
                >
                  <Search className={`w-4 h-4 ${isSearching ? 'animate-spin' : 'group-hover:scale-110'} transition-transform`} />
                  <span>{isSearching ? 'Searching...' : 'Search Ride'}</span>
                </button>
              </div>
            </form>
          </div>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto"
        >
          {trustBadges.map((badge, idx) => {
            const Icon = badge.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-3.5 p-4 rounded-2xl border border-slate-800/60 bg-slate-900/40 backdrop-blur-md hover:border-indigo-500/40 hover:bg-slate-900/70 transition-all duration-300 group"
              >
                <div className={`p-2.5 rounded-xl ${badge.bg} ${badge.color} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white group-hover:text-indigo-200 transition-colors">
                    {badge.title}
                  </h4>
                  <p className="text-xs text-slate-400">{badge.subtitle}</p>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

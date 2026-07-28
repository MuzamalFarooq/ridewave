'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  MapPin, Calendar, Search, Car, Bike, Star, Shield, Zap,
  Users, Globe, Award, ArrowRight, ChevronRight, Play,
  CheckCircle, MessageSquare, CreditCard, Navigation,
  TrendingUp, Clock, Wifi, Lock, Heart, Smartphone
} from 'lucide-react';
import { format } from 'date-fns';

// ========================
// Animated Counter
// ========================
function AnimatedCounter({ end, suffix = '', prefix = '', duration = 2 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const step = end / (duration * 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [isInView, end, duration]);

  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

// ========================
// Section Wrapper
// ========================
function Section({ children, className = '', id }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.section
      id={id}
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

// ========================
// Hero Search Box
// ========================
function HeroSearch() {
  const router = useRouter();
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [seats, setSeats] = useState(1);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams({ pickup, destination, date, seats });
    router.push(`/find-ride?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="hero-search">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pickup */}
        <div className="relative">
          <label className="block text-xs font-semibold mb-1.5" style={{ color: 'rgba(255,255,255,0.8)' }}>
            From
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--primary-light)' }} />
            <input
              type="text"
              placeholder="Pickup location"
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              className="input-field pl-10"
              style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white' }}
              required
            />
          </div>
        </div>

        {/* Destination */}
        <div className="relative">
          <label className="block text-xs font-semibold mb-1.5" style={{ color: 'rgba(255,255,255,0.8)' }}>
            To
          </label>
          <div className="relative">
            <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--accent)' }} />
            <input
              type="text"
              placeholder="Destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="input-field pl-10"
              style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white' }}
              required
            />
          </div>
        </div>

        {/* Date */}
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: 'rgba(255,255,255,0.8)' }}>
            Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--primary-light)' }} />
            <input
              type="date"
              value={date}
              min={format(new Date(), 'yyyy-MM-dd')}
              onChange={(e) => setDate(e.target.value)}
              className="input-field pl-10"
              style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', colorScheme: 'dark' }}
            />
          </div>
        </div>

        {/* Seats + Search */}
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: 'rgba(255,255,255,0.8)' }}>
            Seats
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--primary-light)' }} />
              <select
                value={seats}
                onChange={(e) => setSeats(e.target.value)}
                className="input-field pl-10 appearance-none"
                style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white' }}
              >
                {[1,2,3,4,5,6].map(n => (
                  <option key={n} value={n} style={{ background: '#1a1a2e' }}>{n} seat{n > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="btn-primary px-5 py-3 text-sm rounded-xl"
              style={{ flexShrink: 0 }}
            >
              <Search className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-[rgba(255,255,255,0.1)]">
        {['🚗 Cars Only', '🏍️ Bikes Only', '⚡ Instant Book', '👩 Women Only', '🐾 Pets OK'].map((tag) => (
          <button
            key={tag}
            type="button"
            className="px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:scale-105 border"
            style={{ borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.8)', background: 'rgba(255,255,255,0.08)' }}
          >
            {tag}
          </button>
        ))}
      </div>
    </form>
  );
}

// ========================
// Ride Card
// ========================
function RideCard({ ride }) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      className="card-premium overflow-hidden"
    >
      {/* Map Preview placeholder */}
      <div className="h-36 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1a1a2e, #0f3460)' }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <Navigation className="w-8 h-8 mx-auto mb-1 animate-bounce-subtle" style={{ color: 'var(--primary-light)' }} />
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>{ride.distanceKm?.toFixed(0) || '—'} km route</span>
          </div>
        </div>
        {/* Route dots */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center gap-1">
          <div className="w-2 h-2 rounded-full" style={{ background: 'var(--success)' }} />
          <div className="flex-1 h-px border-t border-dashed" style={{ borderColor: 'rgba(255,255,255,0.2)' }} />
          <div className="w-2 h-2 rounded-full" style={{ background: 'var(--accent)' }} />
        </div>
        {ride.isFeatured && (
          <div className="absolute top-2 right-2">
            <span className="badge badge-warning" style={{ fontSize: 10 }}>⭐ Featured</span>
          </div>
        )}
      </div>

      <div className="p-4">
        {/* Route */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 mb-0.5">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--success)' }} />
              <span className="text-xs font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                {ride.pickupAddress || 'Pickup Location'}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent)' }} />
              <span className="text-xs font-medium truncate" style={{ color: 'var(--text-secondary)' }}>
                {ride.destinationAddress || 'Destination'}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold gradient-text">${ride.pricePerSeat || '15'}</div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>per seat</div>
          </div>
        </div>

        {/* Info Row */}
        <div className="flex items-center gap-3 text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {ride.departureDate ? format(new Date(ride.departureDate), 'MMM d') : 'Upcoming'}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {ride.departureTime || '09:00'}
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            {ride.availableSeats || 3} seats
          </span>
        </div>

        {/* Driver */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center text-xs text-white font-bold">
              {ride.rider?.name?.[0] || 'R'}
            </div>
            <div>
              <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                {ride.rider?.name || 'Verified Driver'}
              </div>
              <div className="flex items-center gap-0.5">
                <Star className="w-3 h-3" style={{ color: '#fbbf24', fill: '#fbbf24' }} />
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {ride.rider?.profile?.averageRating?.toFixed(1) || '4.8'}
                </span>
              </div>
            </div>
          </div>
          <Link href={`/rides/${ride.id || 'preview'}`}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary text-xs py-2 px-4"
            >
              Book Now
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

// ========================
// Main Homepage
// ========================
export default function HomePage() {
  const stats = [
    { value: 50000, suffix: '+', label: 'Rides Completed', icon: Car },
    { value: 12000, suffix: '+', label: 'Verified Riders', icon: Shield },
    { value: 85000, suffix: '+', label: 'Happy Travelers', icon: Heart },
    { value: 45, suffix: '+', label: 'Cities Covered', icon: Globe },
  ];

  const howItWorks = [
    {
      step: '01',
      title: 'Search a Ride',
      desc: 'Enter your pickup, destination, and travel date. Our AI finds the best matches instantly.',
      icon: Search,
      color: '#6366f1',
    },
    {
      step: '02',
      title: 'Book & Pay Securely',
      desc: 'Select your seat, review the driver profile, and pay securely via card, wallet, or cash.',
      icon: CreditCard,
      color: '#8b5cf6',
    },
    {
      step: '03',
      title: 'Track & Travel',
      desc: 'Track your driver in real time on the map, chat directly, and travel safely with peace of mind.',
      icon: Navigation,
      color: '#ec4899',
    },
  ];

  const destinations = [
    { city: 'Lahore', country: 'Pakistan', rides: 1240, emoji: '🏙️', gradient: 'from-violet-500 to-purple-600' },
    { city: 'Karachi', country: 'Pakistan', rides: 2100, emoji: '🌊', gradient: 'from-blue-500 to-cyan-600' },
    { city: 'Islamabad', country: 'Pakistan', rides: 890, emoji: '🏛️', gradient: 'from-emerald-500 to-teal-600' },
    { city: 'Peshawar', country: 'Pakistan', rides: 560, emoji: '🏔️', gradient: 'from-orange-500 to-red-600' },
    { city: 'Multan', country: 'Pakistan', rides: 430, emoji: '☀️', gradient: 'from-yellow-500 to-orange-600' },
    { city: 'Quetta', country: 'Pakistan', rides: 320, emoji: '🌿', gradient: 'from-green-500 to-emerald-600' },
  ];

  const testimonials = [
    {
      name: 'Aisha Raza',
      role: 'Regular Traveler',
      content: "RideWave changed how I commute. The real-time tracking and verified drivers give me complete peace of mind. 10/10 recommend!",
      rating: 5,
      avatar: 'A',
      gradient: 'from-violet-500 to-purple-600',
    },
    {
      name: 'Ahmed Khan',
      role: 'Rider — PKR 45K/month',
      content: "I've been earning consistently through RideWave. The platform is fair, transparent, and the support team is excellent.",
      rating: 5,
      avatar: 'A',
      gradient: 'from-blue-500 to-indigo-600',
    },
    {
      name: 'Sara Malik',
      role: 'Monthly Commuter',
      content: "The women-only ride filter and safety features give me confidence to travel anywhere. The app is beautiful and so easy to use.",
      rating: 5,
      avatar: 'S',
      gradient: 'from-pink-500 to-rose-600',
    },
    {
      name: 'Bilal Hassan',
      role: 'Business Traveler',
      content: "I use RideWave for all my city-to-city business travel. Comfortable cars, professional drivers, and always on time.",
      rating: 5,
      avatar: 'B',
      gradient: 'from-emerald-500 to-teal-600',
    },
  ];

  const safetyFeatures = [
    { icon: Shield, title: 'Verified Drivers', desc: 'All riders undergo identity & license verification before they can accept rides.' },
    { icon: Navigation, title: 'Live GPS Tracking', desc: 'Share your live trip location with family and friends anytime.' },
    { icon: MessageSquare, title: 'In-App Communication', desc: 'Chat and call without sharing personal contact details.' },
    { icon: Zap, title: 'Emergency SOS', desc: 'One tap SOS button that immediately alerts your emergency contacts.' },
    { icon: Star, title: 'Two-Way Reviews', desc: 'Mutual rating system ensures accountability for both riders and travelers.' },
    { icon: Lock, title: 'Secure Payments', desc: 'PCI-compliant payment processing with full refund protection.' },
  ];

  // Sample rides for featured section
  const featuredRides = [
    {
      id: '1', pickupAddress: 'Lahore', destinationAddress: 'Islamabad',
      pricePerSeat: 1200, availableSeats: 3, departureDate: new Date(),
      departureTime: '08:00', distanceKm: 380,
      rider: { name: 'Ahmad Raza', profile: { averageRating: 4.9 } }
    },
    {
      id: '2', pickupAddress: 'Karachi', destinationAddress: 'Hyderabad',
      pricePerSeat: 800, availableSeats: 2, departureDate: new Date(),
      departureTime: '10:30', distanceKm: 160,
      rider: { name: 'Sarah Ali', profile: { averageRating: 4.7 } },
      isFeatured: true,
    },
    {
      id: '3', pickupAddress: 'Islamabad', destinationAddress: 'Peshawar',
      pricePerSeat: 700, availableSeats: 4, departureDate: new Date(),
      departureTime: '14:00', distanceKm: 175,
      rider: { name: 'Hassan Khan', profile: { averageRating: 4.8 } }
    },
  ];

  return (
    <div>
      {/* ========================
          HERO SECTION
      ======================== */}
      <section className="animated-bg min-h-screen flex flex-col items-center justify-center relative pt-16 pb-8 overflow-hidden">
        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-10"
            style={{
              width: Math.random() * 200 + 50,
              height: Math.random() * 200 + 50,
              background: i % 2 === 0 ? 'var(--primary)' : 'var(--secondary)',
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, 15, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 5 + i * 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
          {/* Hero Content */}
          <div className="text-center mb-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 border"
              style={{ borderColor: 'rgba(255,255,255,0.15)', background: 'rgba(99,102,241,0.15)', color: 'rgba(255,255,255,0.9)' }}
            >
              <Zap className="w-4 h-4" style={{ color: '#fbbf24' }} />
              <span className="text-sm font-medium">AI-Powered Ride Matching</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-7xl font-outfit font-bold text-white mb-6 leading-tight"
            >
              Travel Smarter,{' '}
              <span className="relative">
                <span className="gradient-text" style={{ WebkitTextFillColor: 'transparent', backgroundImage: 'linear-gradient(135deg, #a78bfa, #ec4899)' }}>
                  Arrive Safer
                </span>
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl max-w-2xl mx-auto mb-8"
              style={{ color: 'rgba(255,255,255,0.75)' }}
            >
              Join 85,000+ travelers on Pakistan's most trusted ride-sharing platform. 
              Verified drivers, real-time GPS tracking, and instant AI-powered fare estimates.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-3 justify-center mb-12"
            >
              <Link href="/find-ride">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 16px 40px rgba(99,102,241,0.5)' }}
                  whileTap={{ scale: 0.97 }}
                  className="btn-primary text-base px-8 py-4"
                >
                  <Search className="w-5 h-5" />
                  Find a Ride
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
              <Link href="/become-rider">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-8 py-4 rounded-full border-2 font-semibold text-base transition-all"
                  style={{ borderColor: 'rgba(255,255,255,0.4)', color: 'white', background: 'rgba(255,255,255,0.1)' }}
                >
                  <Car className="w-5 h-5" />
                  Become a Rider
                </motion.button>
              </Link>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap justify-center gap-6 mb-10"
            >
              {[
                { icon: Shield, label: 'Verified Drivers' },
                { icon: Lock, label: 'Secure Payments' },
                { icon: Star, label: '4.9 Avg Rating' },
                { icon: Navigation, label: 'Live Tracking' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  <Icon className="w-4 h-4" style={{ color: '#a78bfa' }} />
                  <span className="text-sm">{label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Search Box */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="max-w-4xl mx-auto"
          >
            <HeroSearch />
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="w-6 h-10 rounded-full border-2 flex items-start justify-center pt-2" style={{ borderColor: 'rgba(255,255,255,0.3)' }}>
            <div className="w-1 h-3 rounded-full" style={{ background: 'rgba(255,255,255,0.6)' }} />
          </div>
        </motion.div>
      </section>

      {/* ========================
          STATS
      ======================== */}
      <Section className="py-16" style={{ background: 'var(--bg-surface)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map(({ value, suffix, label, icon: Icon }) => (
              <motion.div
                key={label}
                whileHover={{ y: -4 }}
                className="glass-card p-6 text-center"
              >
                <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold font-outfit mb-1 gradient-text">
                  <AnimatedCounter end={value} suffix={suffix} />
                </div>
                <div className="text-sm" style={{ color: 'var(--text-muted)' }}>{label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ========================
          HOW IT WORKS
      ======================== */}
      <Section id="how-it-works" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="badge badge-primary mb-4">Simple Process</span>
            <h2 className="text-3xl sm:text-4xl font-outfit font-bold mb-4">
              How <span className="gradient-text">RideWave</span> Works
            </h2>
            <p className="text-lg max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              Book your ride in under 2 minutes with our streamlined 3-step process.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connection line */}
            <div className="hidden md:block absolute top-16 left-1/4 right-1/4 h-px" style={{ background: 'linear-gradient(90deg, transparent, var(--border), transparent)' }} />

            {howItWorks.map(({ step, title, desc, icon: Icon, color }, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                whileHover={{ y: -6 }}
                className="card-premium p-8 text-center relative"
              >
                {/* Step number */}
                <div
                  className="absolute top-4 right-4 text-5xl font-bold font-outfit opacity-5"
                  style={{ color }}
                >
                  {step}
                </div>

                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
                  style={{ background: `${color}20`, border: `2px solid ${color}30` }}
                >
                  <Icon className="w-8 h-8" style={{ color }} />
                </div>

                <h3 className="text-xl font-semibold mb-3">{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{desc}</p>

                {i < howItWorks.length - 1 && (
                  <div className="md:hidden mt-6 flex justify-center">
                    <ChevronRight className="w-5 h-5 rotate-90" style={{ color: 'var(--text-muted)' }} />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ========================
          FEATURED RIDES
      ======================== */}
      <Section className="py-20" style={{ background: 'var(--bg-surface)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="badge badge-purple mb-3">Live Rides</span>
              <h2 className="text-3xl sm:text-4xl font-outfit font-bold">
                Featured <span className="gradient-text">Rides</span>
              </h2>
            </div>
            <Link href="/find-ride" className="btn-ghost hidden sm:flex items-center gap-2">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredRides.map((ride) => (
              <RideCard key={ride.id} ride={ride} />
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/find-ride" className="btn-secondary">
              Browse All Rides <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </Section>

      {/* ========================
          POPULAR DESTINATIONS
      ======================== */}
      <Section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="badge badge-success mb-4">Popular Routes</span>
            <h2 className="text-3xl sm:text-4xl font-outfit font-bold mb-4">
              Popular <span className="gradient-text">Destinations</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>Thousands of rides available to top destinations across Pakistan</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {destinations.map(({ city, country, rides, emoji, gradient }, i) => (
              <motion.div
                key={city}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <Link href={`/find-ride?destination=${city}`}>
                  <div
                    className="rounded-2xl overflow-hidden cursor-pointer h-36 relative flex flex-col items-center justify-center text-white"
                    style={{ background: `linear-gradient(135deg, ${gradient.replace('from-', '').replace(/-\d+/, '').replace(' to-', ', ')})` }}
                  >
                    <div className="text-4xl mb-2">{emoji}</div>
                    <div className="font-bold text-sm">{city}</div>
                    <div className="text-xs opacity-75">{rides.toLocaleString()} rides</div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ========================
          BECOME A RIDER CTA
      ======================== */}
      <Section className="py-20" style={{ background: 'var(--bg-surface)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl overflow-hidden relative" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10" style={{ background: 'var(--primary)', transform: 'translate(30%, -30%)' }} />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-10" style={{ background: 'var(--secondary)', transform: 'translate(-30%, 30%)' }} />

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 p-8 lg:p-16 items-center">
              <div>
                <span className="badge mb-4" style={{ background: 'rgba(99,102,241,0.2)', color: '#a78bfa' }}>💰 Earn with RideWave</span>
                <h2 className="text-3xl sm:text-4xl font-outfit font-bold text-white mb-4">
                  Turn Your Car Into<br />
                  <span style={{ background: 'linear-gradient(135deg, #a78bfa, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    A Revenue Machine
                  </span>
                </h2>
                <p className="mb-8" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  Join 12,000+ riders earning PKR 30,000–80,000/month. Set your own schedule, 
                  choose your passengers, and keep 92% of every fare.
                </p>

                <div className="grid grid-cols-3 gap-4 mb-8">
                  {[
                    { value: '92%', label: 'Fare you keep' },
                    { value: '24h', label: 'Payout speed' },
                    { value: '0', label: 'Monthly fees' },
                  ].map(({ value, label }) => (
                    <div key={label} className="text-center">
                      <div className="text-2xl font-bold text-white">{value}</div>
                      <div className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>{label}</div>
                    </div>
                  ))}
                </div>

                <Link href="/become-rider">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    className="btn-primary text-base px-8 py-4"
                  >
                    Start Earning Today <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Car, title: 'Register Vehicle', desc: 'Cars & Bikes welcome' },
                  { icon: Calendar, title: 'Set Schedule', desc: 'Your time, your rules' },
                  { icon: Users, title: 'Accept Bookings', desc: 'Instant or manual' },
                  { icon: CreditCard, title: 'Get Paid Fast', desc: 'Daily payouts available' },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <Icon className="w-6 h-6 mb-2" style={{ color: '#a78bfa' }} />
                    <div className="text-sm font-semibold text-white">{title}</div>
                    <div className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>{desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ========================
          SAFETY SECTION
      ======================== */}
      <Section id="safety" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="badge badge-success mb-4">🛡️ Your Safety First</span>
            <h2 className="text-3xl sm:text-4xl font-outfit font-bold mb-4">
              Safety at Every <span className="gradient-text">Touchpoint</span>
            </h2>
            <p className="max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              Our multi-layered safety system ensures every journey is secure, from booking to arrival.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {safetyFeatures.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="glass-card p-6 flex gap-4"
              >
                <div className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.1)' }}>
                  <Icon className="w-6 h-6" style={{ color: 'var(--success)' }} />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{title}</h3>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ========================
          TESTIMONIALS
      ======================== */}
      <Section className="py-20" style={{ background: 'var(--bg-surface)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="badge badge-warning mb-4">⭐ User Stories</span>
            <h2 className="text-3xl sm:text-4xl font-outfit font-bold mb-4">
              What Our <span className="gradient-text">Community</span> Says
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map(({ name, role, content, rating, avatar, gradient }, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="card-premium p-6"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0 bg-gradient-to-br ${gradient}`}
                  >
                    {avatar}
                  </div>
                  <div>
                    <div className="font-semibold">{name}</div>
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{role}</div>
                    <div className="flex mt-1">
                      {[...Array(rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5" style={{ color: '#fbbf24', fill: '#fbbf24' }} />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  "{content}"
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ========================
          MOBILE APP
      ======================== */}
      <Section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card p-8 lg:p-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <span className="badge badge-primary mb-4">📱 Available Now</span>
                <h2 className="text-3xl sm:text-4xl font-outfit font-bold mb-4">
                  Travel Anywhere with the{' '}
                  <span className="gradient-text">RideWave App</span>
                </h2>
                <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
                  Get the full RideWave experience on your mobile. Real-time tracking, 
                  instant notifications, offline support, and one-tap booking.
                </p>

                {[
                  'Real-time GPS tracking & live sharing',
                  'Instant ride booking & chat',
                  'Offline support for saved rides',
                  'Push notifications for all updates',
                  'One-tap SOS emergency button',
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 shrink-0" style={{ color: 'var(--success)' }} />
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{feature}</span>
                  </div>
                ))}

                <div className="flex gap-3 mt-8">
                  {['App Store', 'Google Play'].map((store) => (
                    <motion.a
                      key={store}
                      href="#"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-3 px-6 py-3 rounded-2xl transition-all"
                      style={{ background: 'var(--text-primary)', color: 'var(--bg-base)' }}
                    >
                      <span className="text-xl">{store === 'App Store' ? '🍎' : '🤖'}</span>
                      <div>
                        <p style={{ fontSize: 9 }}>Download on</p>
                        <p className="text-sm font-bold">{store}</p>
                      </div>
                    </motion.a>
                  ))}
                </div>
              </div>

              <div className="flex justify-center">
                <div className="relative">
                  {/* Phone mockup */}
                  <div
                    className="w-56 h-96 rounded-3xl relative overflow-hidden shadow-2xl"
                    style={{ background: 'linear-gradient(135deg, #1a1a2e, #0f3460)', border: '3px solid rgba(255,255,255,0.1)' }}
                  >
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 rounded-b-2xl" style={{ background: 'rgba(0,0,0,0.5)' }} />
                    
                    {/* Mock app screen */}
                    <div className="mt-10 px-4">
                      <div className="rounded-2xl p-3 mb-3" style={{ background: 'rgba(99,102,241,0.2)' }}>
                        <div className="text-white text-xs font-semibold mb-1">🚗 Ride in Progress</div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#10b981' }} />
                          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>ETA: 12 min</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        {['Lahore → Islamabad', 'Karachi → Hyderabad', 'ISB → Peshawar'].map((r, i) => (
                          <div key={r} className="rounded-xl p-2.5 flex items-center gap-2" style={{ background: 'rgba(255,255,255,0.05)' }}>
                            <div className="w-6 h-6 rounded-lg gradient-primary flex items-center justify-center">
                              <Car className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-xs text-white">{r}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Floating notification */}
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ repeat: Infinity, duration: 3 }}
                      className="absolute bottom-12 left-3 right-3 rounded-xl p-2 text-white"
                      style={{ background: 'rgba(99,102,241,0.9)', backdropFilter: 'blur(10px)' }}
                    >
                      <div className="text-xs font-semibold">🎉 Ride Confirmed!</div>
                      <div className="text-xs opacity-75">Driver is 3 min away</div>
                    </motion.div>
                  </div>

                  {/* Floating badges */}
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ repeat: Infinity, duration: 4, delay: 1 }}
                    className="absolute -right-8 top-16 rounded-xl p-3 shadow-lg"
                    style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}
                  >
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4" style={{ color: '#fbbf24', fill: '#fbbf24' }} />
                      <span className="text-sm font-bold">4.9</span>
                    </div>
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Rating</div>
                  </motion.div>

                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ repeat: Infinity, duration: 4, delay: 2 }}
                    className="absolute -left-8 bottom-20 rounded-xl p-3 shadow-lg"
                    style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#10b981' }} />
                      <span className="text-xs font-semibold" style={{ color: 'var(--success)' }}>Live Track</span>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ========================
          NEWSLETTER
      ======================== */}
      <Section className="py-20" style={{ background: 'var(--bg-surface)' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="badge badge-primary mb-4">📬 Stay Updated</span>
          <h2 className="text-3xl font-outfit font-bold mb-4">
            Get Exclusive <span className="gradient-text">Travel Deals</span>
          </h2>
          <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>
            Subscribe to get promo codes, new route announcements, and safety updates delivered to your inbox.
          </p>

          <form
            onSubmit={(e) => { e.preventDefault(); }}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              placeholder="Enter your email address"
              className="input-field flex-1"
              required
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="btn-primary px-6 py-3 whitespace-nowrap"
            >
              Subscribe Free
            </motion.button>
          </form>

          <p className="text-xs mt-4" style={{ color: 'var(--text-muted)' }}>
            No spam, ever. Unsubscribe anytime. We respect your privacy.
          </p>
        </div>
      </Section>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUserLocation } from '@/contexts/LocationContext';
import LocationPickerModal from '@/components/maps/LocationPickerModal';
import {
  MapPin, Calendar, Users, Search, ShieldCheck,
  Navigation, Car, Compass, ArrowRight, CheckCircle2,
  Bike, Bus, Sparkles
} from 'lucide-react';
import { format } from 'date-fns';

export default function HeroSection() {
  const router = useRouter();
  const { userLocation, pickerModal, openPicker, closePicker } = useUserLocation();

  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [vehicleType, setVehicleType] = useState('ALL');
  const [seats, setSeats] = useState('1');
  const [isSearching, setIsSearching] = useState(false);

  // Auto-fill pickup location when detected from user geolocation
  useEffect(() => {
    if (userLocation?.address && !pickup) {
      setPickup(userLocation.address);
    }
  }, [userLocation?.address]);

  const handleSearch = (e) => {
    e.preventDefault();
    setIsSearching(true);
    const params = new URLSearchParams();
    if (pickup) params.set('from', pickup);
    if (destination) params.set('to', destination);
    if (date) params.set('date', date);
    if (vehicleType && vehicleType !== 'ALL') params.set('vehicleType', vehicleType);
    if (seats) params.set('seats', seats);

    setTimeout(() => {
      router.push(`/find-ride?${params.toString()}`);
    }, 250);
  };

  const vehicleOptions = [
    { id: 'ALL', label: 'All Vehicles', icon: Car },
    { id: 'CAR', label: 'Car', icon: Car },
    { id: 'BIKE', label: 'Bike', icon: Bike },
    { id: 'VAN', label: 'Van', icon: Bus },
    { id: 'BUS', label: 'Bus', icon: Bus },
  ];

  return (
    <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 bg-[#F8F6F0] dark:bg-[#102F28] overflow-hidden">
      {/* Location Picker Modal */}
      <LocationPickerModal
        isOpen={pickerModal.isOpen}
        onClose={closePicker}
        title={pickerModal.fieldType === 'from' ? 'Select Pickup Location' : 'Select Destination Location'}
        initialAddress={pickerModal.initialAddress}
        fieldType={pickerModal.fieldType}
        onSelectLocation={(loc) => {
          if (pickerModal.onSelect) pickerModal.onSelect(loc);
        }}
      />

      {/* Subtle organic background decoration */}
      <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-[#DCE7DF]/40 dark:bg-[#173F35]/30 rounded-full blur-3xl pointer-events-none -mr-32 -mt-32" />
      <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-[#C6A76B]/10 dark:bg-[#C6A76B]/5 rounded-full blur-3xl pointer-events-none -ml-24 -mb-24" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headlines & Call to Actions */}
          <div className="lg:col-span-7 space-y-6">
            {/* Tagline Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#173F35]/10 dark:bg-[#173F35] border border-[#173F35]/20 dark:border-[#23584B] text-[#173F35] dark:text-[#C6A76B] text-xs font-semibold tracking-wide"
            >
              <span className="w-2 h-2 rounded-full bg-[#C6A76B] animate-pulse" />
              <span>Verified Ride-Sharing & Intercity Travel</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-outfit font-extrabold text-4xl sm:text-5xl lg:text-6xl text-[#102F28] dark:text-[#FFFFFF] tracking-tight leading-[1.12]"
            >
              Your Journey. <br />
              <span className="text-[#173F35] dark:text-[#C6A76B]">Your Way.</span>
            </motion.h1>

            {/* Supporting Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg text-[#242824] dark:text-[#F8F6F0] font-normal leading-relaxed max-w-xl"
            >
              Discover a better way to travel with comfortable rides, trusted drivers, and a booking experience designed around you. Connect directly with verified drivers for transparent, scheduled trips.
            </motion.p>

            {/* Key Service Highlights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="flex flex-wrap gap-y-2 gap-x-6 pt-1 text-xs sm:text-sm font-semibold text-[#102F28] dark:text-[#F8F6F0]"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#26734D] shrink-0" />
                <span>Verified Drivers & Vehicles</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#26734D] shrink-0" />
                <span>Live GPS Trip Monitoring</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#26734D] shrink-0" />
                <span>Transparent Seat Pricing</span>
              </div>
            </motion.div>

            {/* Primary Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <Link
                href="/find-ride"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-base font-bold bg-[#173F35] text-white hover:bg-[#102F28] transition-all shadow-md hover:shadow-lg active:scale-95"
              >
                <span>Book a Ride</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-base font-semibold border-2 border-[#173F35] dark:border-[#C6A76B] text-[#173F35] dark:text-[#C6A76B] hover:bg-[#173F35] hover:text-white dark:hover:bg-[#C6A76B] dark:hover:text-[#102F28] transition-all active:scale-95"
              >
                <span>Explore How It Works</span>
              </a>
            </motion.div>
          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative mx-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-[#23584B] bg-white dark:bg-[#173F35]"
            >
              <img
                src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80"
                alt="Premium transportation vehicle on scenic urban roadway"
                className="w-full h-80 sm:h-96 object-cover object-center filter brightness-95 hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#102F28]/80 via-transparent to-transparent" />
              
              <div className="absolute bottom-5 left-5 right-5 text-white p-4 rounded-2xl bg-[#102F28]/85 backdrop-blur-md border border-white/15">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#C6A76B] text-[#102F28] flex items-center justify-center font-bold">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#FFFFFF]">RideWave Verified</p>
                      <p className="text-[11px] text-[#F8F6F0] font-medium">ID & vehicle roadworthiness checked</p>
                    </div>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-[#173F35] text-[#C6A76B] font-bold border border-[#23584B]">
                    Active
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* C. Quick Ride Booking Panel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-12 lg:mt-16 bg-white dark:bg-[#173F35] rounded-3xl p-6 sm:p-8 shadow-xl border border-[#E7E5DD] dark:border-[#23584B]"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-[#E7E5DD] dark:border-[#23584B] gap-4">
            <div>
              <h2 className="text-xl font-bold font-outfit text-[#102F28] dark:text-[#FFFFFF] flex items-center gap-2">
                <span>Quick Ride Search</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#DCE7DF] dark:bg-[#102F28] text-[#173F35] dark:text-[#C6A76B]">
                  Real-Time
                </span>
              </h2>
              <p className="text-xs font-medium text-[#2C322B] dark:text-[#F8F6F0] mt-0.5">
                Find shared journeys, reserve verified seats, or schedule intercity transit.
              </p>
            </div>

            {/* Vehicle Category Selector Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {vehicleOptions.map((opt) => {
                const Icon = opt.icon;
                const isSelected = vehicleType === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setVehicleType(opt.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                      isSelected
                        ? 'bg-[#173F35] text-white shadow-xs'
                        : 'bg-[#F8F6F0] dark:bg-[#102F28] text-[#242824] dark:text-[#FFFFFF] hover:bg-[#DCE7DF] dark:hover:bg-[#19463B]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 items-end">
            {/* 1. Pickup Location */}
            <div className="lg:col-span-3 space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-[#173F35] dark:text-[#C6A76B]">
                  Pickup Point
                </label>
                <button
                  type="button"
                  onClick={() => openPicker('from', pickup, (loc) => setPickup(loc.address))}
                  className="text-[11px] font-bold text-[#173F35] dark:text-[#C6A76B] hover:underline inline-flex items-center gap-1"
                >
                  <Compass className="w-3 h-3" /> Map
                </button>
              </div>
              <div className="relative">
                <button
                  type="button"
                  title="Pick on map"
                  onClick={() => openPicker('from', pickup, (loc) => setPickup(loc.address))}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#173F35] dark:text-[#C6A76B] hover:scale-110 transition-transform"
                >
                  <MapPin className="w-4 h-4" />
                </button>
                <input
                  type="text"
                  placeholder="e.g. Lahore / Islamabad"
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  className="input-field pl-10 pr-4 text-sm font-semibold text-[#171A17] dark:text-[#FFFFFF]"
                  required
                />
              </div>
            </div>

            {/* 2. Destination Location */}
            <div className="lg:col-span-3 space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-[#173F35] dark:text-[#C6A76B]">
                  Destination
                </label>
                <button
                  type="button"
                  onClick={() => openPicker('to', destination, (loc) => setDestination(loc.address))}
                  className="text-[11px] font-bold text-[#173F35] dark:text-[#C6A76B] hover:underline inline-flex items-center gap-1"
                >
                  <Compass className="w-3 h-3" /> Map
                </button>
              </div>
              <div className="relative">
                <button
                  type="button"
                  title="Pick on map"
                  onClick={() => openPicker('to', destination, (loc) => setDestination(loc.address))}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#C6A76B] hover:scale-110 transition-transform"
                >
                  <Navigation className="w-4 h-4" />
                </button>
                <input
                  type="text"
                  placeholder="e.g. Rawalpindi / Multan"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="input-field pl-10 pr-4 text-sm font-semibold text-[#171A17] dark:text-[#FFFFFF]"
                  required
                />
              </div>
            </div>

            {/* 3. Travel Date */}
            <div className="lg:col-span-2 space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#173F35] dark:text-[#C6A76B]">
                Date
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#173F35] dark:text-[#C6A76B]" />
                <input
                  type="date"
                  value={date}
                  min={format(new Date(), 'yyyy-MM-dd')}
                  onChange={(e) => setDate(e.target.value)}
                  className="input-field pl-10 pr-3 text-sm font-semibold text-[#171A17] dark:text-[#FFFFFF]"
                  required
                />
              </div>
            </div>

            {/* 4. Passengers / Seats */}
            <div className="lg:col-span-2 space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#173F35] dark:text-[#C6A76B]">
                Passengers
              </label>
              <div className="relative">
                <Users className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#173F35] dark:text-[#C6A76B]" />
                <select
                  value={seats}
                  onChange={(e) => setSeats(e.target.value)}
                  className="input-field pl-10 pr-4 text-sm font-semibold text-[#171A17] dark:text-[#FFFFFF] appearance-none cursor-pointer"
                >
                  <option value="1">1 Passenger</option>
                  <option value="2">2 Passengers</option>
                  <option value="3">3 Passengers</option>
                  <option value="4">4+ Passengers</option>
                </select>
              </div>
            </div>

            {/* 5. Search Action Button */}
            <div className="lg:col-span-2">
              <button
                type="submit"
                disabled={isSearching}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl font-bold text-sm bg-[#173F35] text-white hover:bg-[#102F28] transition-all shadow-md active:scale-95 disabled:opacity-70 cursor-pointer"
              >
                {isSearching ? (
                  <span>Searching...</span>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Find Rides</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}

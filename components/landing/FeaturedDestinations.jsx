'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { MapPin, ArrowRight, Car, Star } from 'lucide-react';

export default function FeaturedDestinations() {
  const destinations = [
    {
      name: 'Islamabad ↔ Lahore',
      tagline: 'M-2 Motorway Highway Express',
      price: '$12',
      pkPrice: 'PKR 1,500',
      rides: '34+ Daily Rides',
      rating: '4.9',
      image: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Karachi ↔ Hyderabad',
      tagline: 'M-9 Super Highway Corridor',
      price: '$8',
      pkPrice: 'PKR 950',
      rides: '28+ Daily Rides',
      rating: '4.8',
      image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Rawalpindi ↔ Murree',
      tagline: 'Scenic Hill Station Route',
      price: '$6',
      pkPrice: 'PKR 700',
      rides: '45+ Daily Rides',
      rating: '4.9',
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Lahore ↔ Faisalabad',
      tagline: 'M-3 Industrial Corridor',
      price: '$7',
      pkPrice: 'PKR 850',
      rides: '22+ Daily Rides',
      rating: '4.7',
      image: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Islamabad ↔ Peshawar',
      tagline: 'M-1 Northern Highway',
      price: '$9',
      pkPrice: 'PKR 1,100',
      rides: '18+ Daily Rides',
      rating: '4.8',
      image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Islamabad ↔ Skardu',
      tagline: 'Karakoram Mountain Highway',
      price: '$25',
      pkPrice: 'PKR 4,500',
      rides: '12+ Daily Rides',
      rating: '5.0',
      image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    },
  ];

  return (
    <section className="py-24 bg-slate-900 border-t border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xs font-bold uppercase tracking-widest text-indigo-400 px-3 py-1 bg-indigo-500/10 rounded-full border border-indigo-500/20"
            >
              Popular Routes
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-4 text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-outfit"
            >
              Featured Destinations
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-2 text-base text-slate-400 font-light"
            >
              Top intercity carpooling corridors with highest frequency and top-rated drivers.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Link
              href="/find-ride"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-800 border border-slate-700 text-white font-semibold text-sm hover:bg-slate-700 hover:border-indigo-500 transition-all"
            >
              <span>Explore All Routes</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>

        {/* Destination Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((dest, idx) => (
            <motion.div
              key={dest.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group relative rounded-3xl overflow-hidden bg-slate-950/70 border border-slate-800 hover:border-indigo-500/50 shadow-xl transition-all duration-500 hover:-translate-y-2 flex flex-col justify-between"
            >
              {/* Image with Zoom effect */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover filter brightness-90 group-hover:scale-110 group-hover:brightness-100 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                {/* Top Badges */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-xs font-bold text-white border border-slate-700/60 flex items-center gap-1">
                    <Car className="w-3.5 h-3.5 text-indigo-400" />
                    {dest.rides}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-amber-500/90 text-slate-950 text-xs font-extrabold flex items-center gap-1 shadow-md">
                    <Star className="w-3.5 h-3.5 fill-slate-950" />
                    {dest.rating}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6">
                <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-semibold mb-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{dest.tagline}</span>
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors font-outfit">
                  {dest.name}
                </h3>

                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400">Starting from</span>
                    <p className="text-xl font-extrabold text-white font-outfit">
                      {dest.price} <span className="text-xs font-normal text-slate-400">({dest.pkPrice})</span>
                    </p>
                  </div>

                  <Link
                    href={`/find-ride?route=${encodeURIComponent(dest.name)}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-xs hover:from-indigo-500 hover:to-purple-500 shadow-md transition-all group/btn"
                  >
                    <span>View Rides</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

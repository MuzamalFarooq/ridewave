'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Car, Bike, Bus, Users, Luggage, ArrowRight, ShieldCheck } from 'lucide-react';

const vehicles = [
  {
    type: 'CAR',
    name: 'Comfort Car',
    category: 'Sedans & Compacts',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
    description: 'Ideal for city commuting, airport transfers, and intercity trips with maximum personal comfort.',
    specs: {
      capacity: '3 – 4 Passengers',
      luggage: '2 – 3 Standard Bags',
      comfort: 'Air Conditioned',
    },
    pricingGuidance: 'Driver-set transparent seat fares based on shared travel distance',
    href: '/find-ride?vehicleType=CAR',
  },
  {
    type: 'BIKE',
    name: 'Solo Bike',
    category: 'Motorcycles & Scooters',
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80',
    description: 'Fast, budget-conscious transit designed for quick urban trips and bypassing rush hour delays.',
    specs: {
      capacity: '1 Passenger',
      luggage: '1 Backpack',
      comfort: 'Helmet Required',
    },
    pricingGuidance: 'Economical city-wide fares for rapid single-commuter journeys',
    href: '/find-ride?vehicleType=BIKE',
  },
  {
    type: 'VAN',
    name: 'Spacious Van',
    category: 'Vans & Multi-Purpose Vehicles',
    image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80',
    description: 'Spacious seating and generous luggage capacity suited for families, teams, and group travel.',
    specs: {
      capacity: '6 – 12 Passengers',
      luggage: '6+ Large Suitcases',
      comfort: 'Climate Controlled',
    },
    pricingGuidance: 'Shared group pricing with significant per-seat savings',
    href: '/find-ride?vehicleType=VAN',
  },
  {
    type: 'BUS',
    name: 'Executive Bus',
    category: 'Coasters & Mini-Buses',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    description: 'Reliable group transit on fixed scheduled intercity routes with verified commercial drivers.',
    specs: {
      capacity: '14 – 30 Passengers',
      luggage: 'Dedicated Cargo Bay',
      comfort: 'High-Capacity Transit',
    },
    pricingGuidance: 'Scheduled fixed-seat fares along designated highway routes',
    href: '/find-ride?vehicleType=BUS',
  },
];

export default function VehicleCategories() {
  return (
    <section id="vehicles" className="py-20 md:py-28 bg-white dark:bg-[#102F28] border-t border-[#E7E5DD] dark:border-[#23584B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#173F35] dark:text-[#C6A76B] px-3.5 py-1.5 bg-[#DCE7DF]/60 dark:bg-[#173F35] rounded-full border border-[#E7E5DD] dark:border-[#23584B]">
            Fleet Options
          </span>
          <h2 className="font-outfit font-extrabold text-3xl sm:text-4xl text-[#102F28] dark:text-[#FFFFFF] tracking-tight">
            Supported Vehicle Categories
          </h2>
          <p className="text-sm sm:text-base text-[#242824] dark:text-[#F8F6F0] font-normal leading-relaxed">
            Choose the category that matches your schedule, group size, and travel requirements.
          </p>
        </div>

        {/* Vehicles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {vehicles.map((v, index) => (
            <motion.div
              key={v.type}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.1 }}
              className="flex flex-col rounded-3xl bg-[#F8F6F0] dark:bg-[#173F35] border border-[#E7E5DD] dark:border-[#23584B] overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 group"
            >
              {/* Image Container with Consistent Ratio */}
              <div className="relative h-48 w-full overflow-hidden bg-[#DCE7DF] dark:bg-[#102F28]">
                <img
                  src={v.image}
                  alt={v.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 right-3 text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#102F28]/90 text-[#FFFFFF] backdrop-blur-xs border border-white/10">
                  {v.category}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="font-outfit font-bold text-xl text-[#102F28] dark:text-[#FFFFFF]">
                    {v.name}
                  </h3>
                  <p className="text-xs text-[#2C322B] dark:text-[#F8F6F0] leading-relaxed font-normal">
                    {v.description}
                  </p>
                </div>

                {/* Specs List */}
                <div className="pt-3 border-t border-[#E7E5DD] dark:border-[#23584B] space-y-2 text-xs text-[#242824] dark:text-[#F8F6F0]">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-[#3D443B] dark:text-[#DCE7DF] font-medium">
                      <Users className="w-3.5 h-3.5" /> Capacity
                    </span>
                    <span className="font-bold text-[#102F28] dark:text-[#FFFFFF]">{v.specs.capacity}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-[#3D443B] dark:text-[#DCE7DF] font-medium">
                      <Luggage className="w-3.5 h-3.5" /> Luggage
                    </span>
                    <span className="font-bold text-[#102F28] dark:text-[#FFFFFF]">{v.specs.luggage}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-[#3D443B] dark:text-[#DCE7DF] font-medium">
                      <ShieldCheck className="w-3.5 h-3.5" /> Comfort
                    </span>
                    <span className="font-bold text-[#102F28] dark:text-[#FFFFFF]">{v.specs.comfort}</span>
                  </div>
                </div>

                {/* Pricing Note */}
                <div className="p-2.5 rounded-xl bg-white dark:bg-[#102F28] border border-[#E7E5DD] dark:border-[#23584B] text-[11px] text-[#242824] dark:text-[#F8F6F0] leading-tight font-medium">
                  <span className="font-bold text-[#173F35] dark:text-[#C6A76B]">Pricing guidance: </span>
                  {v.pricingGuidance}
                </div>

                {/* Card CTA Link */}
                <Link
                  href={v.href}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold bg-[#173F35] text-white hover:bg-[#102F28] transition-colors shadow-xs"
                >
                  <span>Explore {v.name} Rides</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

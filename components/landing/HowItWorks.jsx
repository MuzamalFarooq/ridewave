'use client';

import { motion } from 'framer-motion';
import { Search, UserCheck, Navigation, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Choose Pickup & Destination',
      description: 'Enter your departure hub, final destination, preferred travel date, and number of required seats to view available scheduled rides.',
      icon: Search,
    },
    {
      num: '02',
      title: 'Select Ride & Confirm Booking',
      description: 'Review verified driver profiles, vehicle categories, luggage allowances, and exact route timing. Lock your seat with instant reservation.',
      icon: UserCheck,
    },
    {
      num: '03',
      title: 'Follow Your Ride & Travel',
      description: 'Meet your driver at the confirmed pickup point, monitor your trip progression via live GPS telemetry, and arrive safely with complete peace of mind.',
      icon: Navigation,
    },
  ];

  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-[#F8F6F0] dark:bg-[#102F28] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#173F35] dark:text-[#C6A76B] px-3.5 py-1.5 bg-[#DCE7DF]/60 dark:bg-[#173F35] rounded-full border border-[#E7E5DD] dark:border-[#23584B]">
            Simple Journey
          </span>
          <h2 className="font-outfit font-extrabold text-3xl sm:text-4xl text-[#102F28] dark:text-[#FFFFFF] tracking-tight">
            How RideWave Works
          </h2>
          <p className="text-sm sm:text-base text-[#242824] dark:text-[#F8F6F0] font-normal leading-relaxed">
            Booking a safe, comfortable ride takes less than two minutes. Here is the seamless journey from search to destination.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.num}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.12 }}
                className="relative flex flex-col p-8 rounded-3xl bg-white dark:bg-[#173F35] border border-[#E7E5DD] dark:border-[#23584B] shadow-sm hover:shadow-md transition-shadow group"
              >
                {/* Step Number Top Badge */}
                <div className="flex items-center justify-between mb-6">
                  <span className="font-outfit font-extrabold text-2xl text-[#C6A76B] dark:text-[#E2CF9F] tracking-tight">
                    {item.num}
                  </span>
                  <div className="w-11 h-11 rounded-xl bg-[#173F35] dark:bg-[#102F28] text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5 text-[#C6A76B]" />
                  </div>
                </div>

                <h3 className="font-outfit font-bold text-xl text-[#102F28] dark:text-[#FFFFFF] mb-3">
                  {item.title}
                </h3>
                <p className="text-sm text-[#2C322B] dark:text-[#F8F6F0] font-normal leading-relaxed mb-6 flex-1">
                  {item.description}
                </p>

                <div className="pt-4 border-t border-[#E7E5DD] dark:border-[#23584B]">
                  <Link
                    href="/find-ride"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#173F35] dark:text-[#C6A76B] hover:underline"
                  >
                    <span>Search journeys</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

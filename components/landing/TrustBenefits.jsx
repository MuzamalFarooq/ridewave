'use client';

import { motion } from 'framer-motion';
import {
  CalendarCheck2, ShieldCheck, Navigation,
  MessageSquare, CreditCard, LifeBuoy
} from 'lucide-react';

const benefits = [
  {
    icon: CalendarCheck2,
    title: 'Convenient Ride Booking',
    description: 'Search hundreds of daily scheduled routes across cities or local hubs. Filter by departure time, seat availability, and travel comfort.',
  },
  {
    icon: ShieldCheck,
    title: 'Verified Drivers & Vehicles',
    description: 'Every driver undergoes strict identity verification, driving license inspection, and vehicle registration vetting before taking passengers.',
  },
  {
    icon: Navigation,
    title: 'Live GPS Tracking',
    description: 'Track your trip progression on interactive Google Maps in real time. Share live location links with loved ones for continuous peace of mind.',
  },
  {
    icon: MessageSquare,
    title: 'In-App Communication',
    description: 'Coordinate pickup details and arrival points seamlessly using our real-time in-app chat, without exposing private phone numbers.',
  },
  {
    icon: CreditCard,
    title: 'Flexible, Transparent Fares',
    description: 'Pay securely via Stripe card checkout, local mobile wallets (JazzCash, EasyPaisa), or straightforward cash upon trip completion.',
  },
  {
    icon: LifeBuoy,
    title: 'Dedicated Trip Assistance',
    description: 'Travel with confidence knowing dedicated support ticketing, emergency SOS alerts, and responsive issue resolution are always active.',
  },
];

export default function TrustBenefits() {
  return (
    <section className="py-20 bg-white dark:bg-[#102F28] border-t border-b border-[#E7E5DD] dark:border-[#23584B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#173F35] dark:text-[#C6A76B] px-3.5 py-1.5 bg-[#DCE7DF]/60 dark:bg-[#173F35] rounded-full border border-[#E7E5DD] dark:border-[#23584B]">
            Platform Standards
          </span>
          <h2 className="font-outfit font-extrabold text-3xl sm:text-4xl text-[#102F28] dark:text-[#FFFFFF] tracking-tight">
            Engineered for Trust, Comfort, and Reliability
          </h2>
          <p className="text-sm sm:text-base text-[#242824] dark:text-[#F8F6F0] font-normal leading-relaxed">
            Every feature on RideWave is built to eliminate travel friction, ensuring every passenger and driver experiences safe and predictable journeys.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="p-7 rounded-2xl bg-[#F8F6F0] dark:bg-[#173F35] border border-[#E7E5DD] dark:border-[#23584B] hover:border-[#C6A76B] dark:hover:border-[#C6A76B] transition-all duration-300 group shadow-xs hover:shadow-md"
              >
                <div className="w-12 h-12 rounded-xl bg-[#173F35] dark:bg-[#102F28] text-[#C6A76B] flex items-center justify-center mb-5 shadow-xs group-hover:scale-105 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-outfit font-bold text-lg text-[#102F28] dark:text-[#FFFFFF] mb-2 group-hover:text-[#173F35] dark:group-hover:text-[#C6A76B] transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-[#2C322B] dark:text-[#F8F6F0] font-normal leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

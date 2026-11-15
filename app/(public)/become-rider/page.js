'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Car, CheckCircle2, DollarSign, Star, Shield, Clock, Users, ArrowRight,
  ChevronDown, ChevronUp, Bike, Zap, TrendingUp, MessageSquare, BarChart2,
  Sparkles
} from 'lucide-react';

const STEPS = [
  { step: '01', title: 'Create Driver Account', desc: 'Sign up with your CNIC, contact information, and verified email address.', icon: Users },
  { step: '02', title: 'Register Your Vehicle', desc: 'Submit vehicle registration book and license photos. Our safety team verifies docs in 24 hours.', icon: Car },
  { step: '03', title: 'Publish Scheduled Rides', desc: 'Define your origin, destination, departure schedule, luggage space, and fair seat price.', icon: Zap },
  { step: '04', title: 'Accept Bookings & Earn', desc: 'Receive instant passenger reservations, pick up travellers along your route, and receive direct payouts.', icon: DollarSign },
];

const BENEFITS = [
  { icon: DollarSign, title: 'Earn PKR 30,000 – 80,000 / month', desc: 'Full-time drivers and frequent commuters generate steady revenue offsetting fuel and maintenance costs.' },
  { icon: Clock, title: 'Complete Schedule Autonomy', desc: 'Drive strictly when you commute. Pick routes that fit your personal schedule with zero minimum trip quotas.' },
  { icon: Shield, title: 'Identity-Verified Passengers', desc: 'Every booking passenger verifies their CNIC or phone number, ensuring safety and accountability on every trip.' },
  { icon: Star, title: 'Build Your Driver Rating', desc: 'Maintain excellent 5-star passenger ratings to achieve Verified Driver status with priority search ranking.' },
  { icon: BarChart2, title: 'Live Performance Analytics', desc: 'Track your trip history, completed bookings, upcoming pickups, and daily payouts via your driver portal.' },
  { icon: MessageSquare, title: '24/7 Priority Support', desc: 'Direct in-app messaging, WhatsApp helpline, and emergency roadside guidance whenever you are on the road.' },
];

const FAQS = [
  { q: 'What vehicles are eligible on RideWave?', a: 'Any roadworthy passenger car (sedan, hatchback, SUV), van, or motorbike (2010 or newer) with a valid registration book, current fitness inspection, and licensed driver.' },
  { q: 'How and when do I receive payouts?', a: 'Earnings are transferred directly to your registered bank account, JazzCash, or EasyPaisa wallet. You keep 92% of all collected passenger fares.' },
  { q: 'What happens if a passenger cancels?', a: 'If a traveler cancels more than 2 hours before departure, you receive a 50% inconvenience credit. Cancellations within 2 hours grant you 100% of the seat fare.' },
  { q: 'Can I approve or decline booking requests?', a: 'Yes. You can switch between Instant Booking (auto-confirms verified travelers) and Manual Review (allows you to inspect traveler profiles before accepting).' },
  { q: 'Are there any upfront or monthly fees?', a: 'Zero registration costs and zero monthly subscriptions. RideWave retains only an 8% platform fee from completed trips to maintain tracking and support infrastructure.' },
];

export default function BecomeRiderPage() {
  const { data: session } = useSession();
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="w-full">
      {/* 1. Hero Section */}
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 bg-gradient-to-br from-[#102F28] via-[#173F35] to-[#0B211C] text-white overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#C6A76B]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#23584B]/40 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Heading & Value Proposition */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="lg:col-span-7 space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#102F28]/90 border border-[#23584B] text-xs font-semibold text-[#C6A76B] shadow-sm">
                <TrendingUp className="w-4 h-4 text-[#C6A76B]" />
                <span>PKR 80,000+ Monthly Earning Potential</span>
              </div>

              <h1 className="font-outfit font-extrabold text-4xl sm:text-5xl lg:text-6xl text-[#F8F6F0] tracking-tight leading-[1.15]">
                Drive. Share Seats.<br />
                <span className="bg-gradient-to-r from-[#C6A76B] via-[#E2CE9B] to-[#C6A76B] bg-clip-text text-transparent">
                  Earn on Your Terms.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-[#DCE7DF] font-normal leading-relaxed max-w-xl">
                Turn empty car seats into dependable earnings along your daily routes. Join 12,000+ verified drivers across Pakistan on RideWave&apos;s trusted mobility network.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link href={session ? '/dashboard/rider' : '/register?role=RIDER'}>
                  <button className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm sm:text-base bg-[#C6A76B] text-[#102F28] hover:bg-[#B59556] transition-all shadow-md active:scale-95">
                    <span>Start Earning Today</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
                <a href="#how-it-works">
                  <button className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm sm:text-base border border-[#DCE7DF]/40 text-[#F8F6F0] hover:bg-white/10 transition-all">
                    <span>How It Works</span>
                  </button>
                </a>
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-[#23584B]/80">
                {['No registration fees', 'Keep 92% of fares', 'Daily automated payouts'].map((perk) => (
                  <div key={perk} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#C6A76B] shrink-0" />
                    <span className="text-xs sm:text-sm text-[#DCE7DF] font-medium">{perk}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right Column: Earnings Calculator */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="lg:col-span-5"
            >
              <EarningsCalculator />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. How It Works (4 Steps) */}
      <section id="how-it-works" className="py-20 md:py-28 bg-[#F8F6F0] dark:bg-[#102F28]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#173F35] dark:text-[#C6A76B] px-3.5 py-1.5 bg-[#DCE7DF]/60 dark:bg-[#173F35] rounded-full border border-[#E7E5DD] dark:border-[#23584B]">
              Driver Onboarding
            </span>
            <h2 className="font-outfit font-extrabold text-3xl sm:text-4xl text-[#102F28] dark:text-[#FFFFFF] tracking-tight">
              Start Earning in <span className="text-[#C6A76B]">4 Simple Steps</span>
            </h2>
            <p className="text-sm sm:text-base text-[#4E554B] dark:text-[#DCE7DF] font-normal leading-relaxed">
              From document verification to your first passenger pickup in under 30 minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map(({ step, title, desc, icon: Icon }, idx) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white dark:bg-[#173F35] border border-[#E7E5DD] dark:border-[#23584B] rounded-2xl p-6 relative overflow-hidden shadow-sm hover:shadow-md transition-shadow text-center flex flex-col items-center"
              >
                <div className="absolute top-3 right-4 text-5xl font-black font-outfit text-[#102F28]/5 dark:text-white/5 select-none pointer-events-none">
                  {step}
                </div>
                <div className="w-14 h-14 rounded-2xl bg-[#102F28] dark:bg-[#23584B] border border-[#23584B] dark:border-[#C6A76B]/30 flex items-center justify-center text-[#C6A76B] mb-5 shadow-xs">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-outfit font-bold text-lg text-[#102F28] dark:text-[#F8F6F0] mb-2">
                  {title}
                </h3>
                <p className="text-xs sm:text-sm text-[#4E554B] dark:text-[#DCE7DF] leading-relaxed">
                  {desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Driver Benefits */}
      <section className="py-20 md:py-28 bg-white dark:bg-[#0E2923] border-y border-[#E7E5DD] dark:border-[#23584B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#173F35] dark:text-[#C6A76B] px-3.5 py-1.5 bg-[#DCE7DF]/60 dark:bg-[#173F35] rounded-full border border-[#E7E5DD] dark:border-[#23584B]">
              Driver Advantages
            </span>
            <h2 className="font-outfit font-extrabold text-3xl sm:text-4xl text-[#102F28] dark:text-[#FFFFFF] tracking-tight">
              Why Drivers <span className="text-[#C6A76B]">Choose RideWave</span>
            </h2>
            <p className="text-sm sm:text-base text-[#4E554B] dark:text-[#DCE7DF] font-normal leading-relaxed">
              Designed around driver profitability, personal flexibility, and comprehensive journey safety.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {BENEFITS.map(({ icon: Icon, title, desc }, idx) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="bg-[#F8F6F0] dark:bg-[#173F35] border border-[#E7E5DD] dark:border-[#23584B] rounded-2xl p-6 flex gap-4 hover:border-[#C6A76B]/60 transition-colors shadow-sm"
              >
                <div className="w-12 h-12 rounded-xl bg-[#102F28] text-[#C6A76B] flex items-center justify-center shrink-0 border border-[#23584B] shadow-xs">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-outfit font-bold text-base sm:text-lg text-[#102F28] dark:text-[#F8F6F0]">
                    {title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#4E554B] dark:text-[#DCE7DF] leading-relaxed">
                    {desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Common Questions */}
      <section className="py-20 md:py-28 bg-[#F8F6F0] dark:bg-[#102F28]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#173F35] dark:text-[#C6A76B] px-3.5 py-1.5 bg-[#DCE7DF]/60 dark:bg-[#173F35] rounded-full border border-[#E7E5DD] dark:border-[#23584B]">
              Driver FAQ
            </span>
            <h2 className="font-outfit font-extrabold text-3xl sm:text-4xl text-[#102F28] dark:text-[#FFFFFF] tracking-tight">
              Frequently Asked <span className="text-[#C6A76B]">Driver Questions</span>
            </h2>
            <p className="text-sm sm:text-base text-[#4E554B] dark:text-[#DCE7DF] font-normal leading-relaxed">
              Clear answers regarding payments, safety protocols, passenger verification, and vehicle standards.
            </p>
          </div>

          <div className="space-y-4">
            {FAQS.map(({ q, a }, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white dark:bg-[#173F35] border border-[#E7E5DD] dark:border-[#23584B] rounded-2xl overflow-hidden shadow-xs transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-5 sm:p-6 text-left focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <span className="font-outfit font-bold text-base sm:text-lg text-[#102F28] dark:text-[#F8F6F0] pr-4">
                      {q}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-[#F8F6F0] dark:bg-[#102F28] flex items-center justify-center shrink-0 text-[#173F35] dark:text-[#C6A76B] border border-[#E7E5DD] dark:border-[#23584B]">
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="px-5 pb-5 sm:px-6 sm:pb-6 text-sm text-[#4E554B] dark:text-[#DCE7DF] leading-relaxed border-t border-[#E7E5DD]/60 dark:border-[#23584B]/60 pt-4"
                      >
                        {a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Closing CTA */}
      <section className="py-16 md:py-24 bg-white dark:bg-[#0E2923]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#102F28] via-[#173F35] to-[#0B211C] border border-[#23584B] p-8 sm:p-14 text-center text-white shadow-xl">
            <div className="absolute top-0 right-10 w-72 h-72 bg-[#C6A76B]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#102F28]/80 border border-[#23584B] text-xs font-semibold text-[#C6A76B]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Join RideWave Community</span>
              </div>
              <h2 className="font-outfit font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#F8F6F0] tracking-tight leading-tight">
                Ready to <span className="bg-gradient-to-r from-[#C6A76B] via-[#E2CE9B] to-[#C6A76B] bg-clip-text text-transparent">Start Earning?</span>
              </h2>
              <p className="text-base sm:text-lg text-[#DCE7DF] font-normal leading-relaxed">
                Join over 12,000 verified drivers across Pakistan. Driver registration and document verification takes less than 24 hours.
              </p>
              <div className="pt-2">
                <Link href={session ? '/dashboard/rider' : '/register?role=RIDER'}>
                  <button className="inline-flex items-center gap-2 px-9 py-4 rounded-full font-bold text-base bg-[#C6A76B] text-[#102F28] hover:bg-[#B59556] transition-all shadow-lg active:scale-95">
                    <span>Create Driver Account — It&apos;s Free</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function EarningsCalculator() {
  const [ridesPerWeek, setRidesPerWeek] = useState(5);
  const [pricePerSeat, setPricePerSeat] = useState(1200);
  const [avgPassengers, setAvgPassengers] = useState(2);

  const weeklyGross = ridesPerWeek * pricePerSeat * avgPassengers;
  const weeklyNet = weeklyGross * 0.92;
  const monthlyNet = weeklyNet * 4;

  return (
    <div className="bg-[#102F28]/95 dark:bg-[#0E2923] border border-[#23584B] rounded-3xl p-6 sm:p-8 text-white shadow-xl backdrop-blur-md">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-[#173F35] border border-[#C6A76B]/40 flex items-center justify-center text-[#C6A76B]">
          <DollarSign className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-outfit font-bold text-lg sm:text-xl text-[#F8F6F0] leading-tight">
            Earnings Calculator
          </h3>
          <p className="text-xs text-[#DCE7DF]">Estimate your monthly commute revenue</p>
        </div>
      </div>

      <div className="space-y-4 my-6">
        {[
          { label: 'Rides per week', value: ridesPerWeek, set: setRidesPerWeek, min: 1, max: 14, unit: 'trips' },
          { label: 'Price per seat (PKR)', value: pricePerSeat, set: setPricePerSeat, min: 500, max: 5000, step: 100, unit: 'PKR' },
          { label: 'Avg passengers per ride', value: avgPassengers, set: setAvgPassengers, min: 1, max: 6, unit: 'seats' },
        ].map(({ label, value, set, min, max, step = 1, unit }) => (
          <div key={label} className="space-y-1.5">
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-[#DCE7DF] font-medium">{label}</span>
              <span className="font-outfit font-bold text-[#C6A76B]">
                {value.toLocaleString()} {unit === 'PKR' ? '' : unit}
              </span>
            </div>
            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={value}
              onChange={(e) => set(Number(e.target.value))}
              className="w-full h-2 rounded-lg bg-[#173F35] accent-[#C6A76B] cursor-pointer"
            />
          </div>
        ))}
      </div>

      <div className="border-t border-[#23584B] pt-4 space-y-2">
        <div className="flex justify-between items-center text-xs sm:text-sm">
          <span className="text-[#DCE7DF]">Estimated Weekly Net</span>
          <span className="font-outfit font-bold text-white">PKR {Math.round(weeklyNet).toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center pt-1">
          <span className="font-semibold text-sm sm:text-base text-[#DCE7DF]">Estimated Monthly Net</span>
          <span className="font-outfit font-extrabold text-2xl sm:text-3xl text-[#C6A76B]">
            PKR {Math.round(monthlyNet).toLocaleString()}
          </span>
        </div>
        <p className="text-[11px] text-[#A0B2A6] pt-1 leading-normal">
          After 8% platform fee. Actual revenue varies with route distance and traveler volume.
        </p>
      </div>
    </div>
  );
}

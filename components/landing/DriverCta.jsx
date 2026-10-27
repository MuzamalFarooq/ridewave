'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Car, ShieldCheck, DollarSign, CalendarCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function DriverCta() {
  const driverPerks = [
    'Keep up to 90% of your collected passenger fares',
    'Set your departure time, route, and stopover points',
    'Accept or decline passengers based on verified profiles',
    'Direct in-app route telemetry and emergency support',
  ];

  return (
    <section className="py-20 md:py-28 bg-[#102F28] text-white relative overflow-hidden">
      {/* Decorative subtle ambient glows */}
      <div className="absolute top-1/2 -left-20 w-80 h-80 bg-[#173F35] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 right-10 w-96 h-96 bg-[#C6A76B]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Offer Details */}
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C6A76B] px-3.5 py-1.5 bg-[#173F35] rounded-full border border-[#23584B]">
              Driver Community
            </span>

            <h2 className="font-outfit font-extrabold text-3xl sm:text-5xl text-[#F8F6F0] tracking-tight leading-tight">
              Share Your Empty Seats. <br />
              <span className="text-[#C6A76B]">Offset Your Fuel Costs.</span>
            </h2>

            <p className="text-base text-[#F8F6F0] font-normal leading-relaxed max-w-xl">
              Turn your regular daily commute or scheduled intercity trips into steady extra income. List your route, pick up verified co-travelers heading the same way, and travel affordably.
            </p>

            {/* Feature Checkmarks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {driverPerks.map((perk) => (
                <div key={perk} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#F8F6F0]">
                  <CheckCircle2 className="w-4 h-4 text-[#C6A76B] shrink-0 mt-0.5" />
                  <span>{perk}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                href="/become-rider"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-bold bg-[#C6A76B] text-[#102F28] hover:bg-[#b39355] transition-all shadow-md active:scale-95"
              >
                <span>Register as a Driver</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/safety"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-sm font-semibold border border-[#23584B] text-[#F8F6F0] hover:bg-[#173F35] transition-colors"
              >
                <span>Verification Standards</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Visual Feature Showcase */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl p-8 bg-[#173F35] border border-[#23584B] shadow-2xl space-y-6">
              <div className="flex items-center gap-4 pb-6 border-b border-[#23584B]">
                <div className="w-12 h-12 rounded-2xl bg-[#102F28] text-[#C6A76B] flex items-center justify-center font-bold">
                  <Car className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-outfit font-bold text-lg text-[#F8F6F0]">Driver Verification</h3>
                  <p className="text-xs text-[#DCE7DF]">Simple 3-step onboarding approval</p>
                </div>
              </div>

              <div className="space-y-4 text-xs text-[#F8F6F0]">
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#102F28]/60 border border-[#23584B]">
                  <span className="font-medium">1. National Identity & License</span>
                  <span className="text-[#C6A76B] font-semibold">Required</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#102F28]/60 border border-[#23584B]">
                  <span className="font-medium">2. Vehicle Registration Book</span>
                  <span className="text-[#C6A76B] font-semibold">Required</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#102F28]/60 border border-[#23584B]">
                  <span className="font-medium">3. Admin Review & Verification</span>
                  <span className="text-[#4EBE85] font-semibold">Within 24 Hours</span>
                </div>
              </div>

              <p className="text-[11px] text-[#DCE7DF] text-center pt-2">
                All drivers are verified by RideWave safety administrators prior to ride activation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

'use client';

import Link from 'next/link';
import { ArrowRight, Compass, ShieldCheck } from 'lucide-react';

export default function PublicCta() {
  return (
    <section className="py-20 md:py-24 bg-[#173F35] text-white relative overflow-hidden">
      {/* Subtle background ornamentation */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#C6A76B]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#102F28] rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#102F28] border border-[#23584B] text-[#C6A76B] text-xs font-semibold tracking-wide">
          <Compass className="w-3.5 h-3.5" />
          <span>Start Your Journey With RideWave</span>
        </div>

        <h2 className="font-outfit font-extrabold text-3xl sm:text-5xl text-[#F8F6F0] tracking-tight leading-tight">
          Ready for a Better Way to Travel?
        </h2>

        <p className="text-base sm:text-lg text-[#F8F6F0] font-normal leading-relaxed max-w-2xl mx-auto">
          Experience comfortable rides, verified drivers, live GPS tracking, and transparent seat booking designed for everyday commutes and long journeys.
        </p>

        <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/find-ride"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-base font-bold bg-[#C6A76B] text-[#102F28] hover:bg-[#b59556] transition-all shadow-md active:scale-95"
          >
            <span>Book Your Ride</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-base font-semibold border border-[#DCE7DF]/40 text-[#F8F6F0] hover:bg-[#102F28] transition-colors"
          >
            <span>Sign In to Account</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

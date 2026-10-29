'use client';

import { ShieldAlert, PhoneCall, AlertTriangle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function EmergencySafetyNotice() {
  return (
    <section aria-labelledby="emergency-notice-heading" className="w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 dark:border-amber-400/20 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent dark:from-amber-400/10 dark:via-amber-400/5 p-6 sm:p-8 backdrop-blur-sm shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 dark:bg-amber-400/20 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0 border border-amber-500/30">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div className="space-y-1.5 max-w-3xl">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/20 dark:bg-amber-400/20 text-amber-800 dark:text-amber-200">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Immediate Emergency Guidance
                  </span>
                </div>
                <h2 id="emergency-notice-heading" className="font-outfit font-bold text-lg sm:text-xl text-[#171A17] dark:text-[#F8F6F0]">
                  In an Immediate Emergency, Call Local Authorities First
                </h2>
                <p className="text-sm text-[#4E554B] dark:text-[#D0DBD3] leading-relaxed">
                  If you, your co-passengers, or your driver are in immediate physical danger, experiencing a medical crisis, or involved in a serious roadside collision, <strong>do not wait for a support ticket reply</strong>. Dial local emergency responders (such as <strong>15 / 911 / 1122</strong>) immediately. RideWave customer support is not an emergency dispatch provider.
                </p>
              </div>
            </div>

            <div className="flex sm:flex-col items-center sm:items-stretch gap-3 shrink-0 w-full sm:w-auto">
              <a
                href="tel:15"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-medium text-sm transition-all duration-200 shadow-sm hover:shadow"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Call Emergency (15)</span>
              </a>
              <Link
                href="#contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl border border-[#E7E5DD] dark:border-[#23584B] bg-white/80 dark:bg-[#173F35]/80 text-xs font-semibold text-[#171A17] dark:text-[#F8F6F0] hover:text-[#C6A76B] transition-colors"
              >
                <span>Report Non-Urgent Incident</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


'use client';

import { Mail, Clock, ShieldCheck, MessageSquare, ExternalLink } from 'lucide-react';
import Link from 'next/link';

// Verified project configuration point for support contacts
export const SUPPORT_CONTACT_CONFIG = {
  email: 'support@ridewave.muzamal.site',
  operatingHours: 'Monday – Sunday, 8:00 AM – 10:00 PM PKT',
  responseTime: '2 to 4 hours average response time',
  inAppChatAvailable: true,
};

export default function DirectChannels() {
  return (
    <section aria-labelledby="direct-channels-heading" className="w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Official Email */}
          <div className="rounded-2xl border border-[#E7E5DD] dark:border-[#23584B] bg-white dark:bg-[#173F35] p-6 shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#DCE7DF]/60 dark:bg-[#102F28] text-[#173F35] dark:text-[#C6A76B] flex items-center justify-center border border-[#E7E5DD] dark:border-[#23584B]">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="font-outfit font-bold text-base text-[#171A17] dark:text-[#F8F6F0]">
                Email Assistance
              </h3>
              <p className="text-xs text-[#4E554B] dark:text-[#D0DBD3] leading-relaxed">
                Direct inquiry queue for account recoveries, billing audits, and booking adjustments.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-[#E7E5DD]/70 dark:border-[#23584B]/70">
              <a
                href={`mailto:${SUPPORT_CONTACT_CONFIG.email}`}
                className="text-xs font-bold text-[#173F35] dark:text-[#C6A76B] hover:underline break-all inline-flex items-center gap-1"
              >
                <span>{SUPPORT_CONTACT_CONFIG.email}</span>
                <ExternalLink className="w-3 h-3 shrink-0" />
              </a>
            </div>
          </div>

          {/* Card 2: Operating Hours */}
          <div className="rounded-2xl border border-[#E7E5DD] dark:border-[#23584B] bg-white dark:bg-[#173F35] p-6 shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#DCE7DF]/60 dark:bg-[#102F28] text-[#173F35] dark:text-[#C6A76B] flex items-center justify-center border border-[#E7E5DD] dark:border-[#23584B]">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-outfit font-bold text-base text-[#171A17] dark:text-[#F8F6F0]">
                Operating Hours
              </h3>
              <p className="text-xs text-[#4E554B] dark:text-[#D0DBD3] leading-relaxed">
                Our support team actively investigates tickets seven days a week.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-[#E7E5DD]/70 dark:border-[#23584B]/70">
              <span className="text-xs font-semibold text-[#171A17] dark:text-[#F8F6F0]">
                {SUPPORT_CONTACT_CONFIG.operatingHours}
              </span>
            </div>
          </div>

          {/* Card 3: In-App Trip Messaging */}
          <div className="rounded-2xl border border-[#E7E5DD] dark:border-[#23584B] bg-white dark:bg-[#173F35] p-6 shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#DCE7DF]/60 dark:bg-[#102F28] text-[#173F35] dark:text-[#C6A76B] flex items-center justify-center border border-[#E7E5DD] dark:border-[#23584B]">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="font-outfit font-bold text-base text-[#171A17] dark:text-[#F8F6F0]">
                In-App Ride Chat
              </h3>
              <p className="text-xs text-[#4E554B] dark:text-[#D0DBD3] leading-relaxed">
                Coordinate pickup points and arrival timings directly with your confirmed driver or passengers.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-[#E7E5DD]/70 dark:border-[#23584B]/70">
              <Link
                href="/dashboard/messages"
                className="text-xs font-bold text-[#173F35] dark:text-[#C6A76B] hover:underline inline-flex items-center gap-1"
              >
                <span>Open Messages Dashboard</span>
                <ExternalLink className="w-3 h-3 shrink-0" />
              </Link>
            </div>
          </div>

          {/* Card 4: Safety & Verification Desk */}
          <div className="rounded-2xl border border-[#E7E5DD] dark:border-[#23584B] bg-white dark:bg-[#173F35] p-6 shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#DCE7DF]/60 dark:bg-[#102F28] text-[#173F35] dark:text-[#C6A76B] flex items-center justify-center border border-[#E7E5DD] dark:border-[#23584B]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-outfit font-bold text-base text-[#171A17] dark:text-[#F8F6F0]">
                Trust & Verification
              </h3>
              <p className="text-xs text-[#4E554B] dark:text-[#D0DBD3] leading-relaxed">
                Rigorous driver license checks, national ID approvals, and vehicle roadworthiness audit.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-[#E7E5DD]/70 dark:border-[#23584B]/70">
              <Link
                href="/safety"
                className="text-xs font-bold text-[#173F35] dark:text-[#C6A76B] hover:underline inline-flex items-center gap-1"
              >
                <span>Read Verification Standards</span>
                <ExternalLink className="w-3 h-3 shrink-0" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


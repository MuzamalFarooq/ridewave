'use client';

import Link from 'next/link';
import { Compass, Mail, MapPin, ShieldCheck, ArrowUpRight, CheckCircle2 } from 'lucide-react';

const footerNav = {
  Explore: [
    { label: 'Find a Ride', href: '/find-ride' },
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'Supported Vehicles', href: '/#vehicles' },
    { label: 'Safety & Verification', href: '/safety' },
  ],
  Drivers: [
    { label: 'Become a Driver', href: '/become-rider' },
    { label: 'Driver Requirements', href: '/safety' },
    { label: 'Transparent Pricing', href: '/pricing' },
    { label: 'Support & Assistance', href: '/help' },
  ],
  Company: [
    { label: 'About RideWave', href: '/about' },
    { label: 'Help Centre', href: '/help' },
    { label: 'Contact Support', href: '/contact' },
    { label: 'Platform Terms', href: '/about' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Data Protection Notice', href: '/privacy-policy' },
    { label: 'Safety Guidelines', href: '/safety' },
    { label: 'Report a Problem', href: '/help#contact' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[#102F28] text-[#F8F6F0] border-t border-[#173F35] relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#173F35]/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#C6A76B]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-8 pb-12 border-b border-[#23584B]">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-[#173F35] text-[#C6A76B] flex items-center justify-center border border-[#23584B] shadow-sm">
                <Compass className="w-5 h-5 transition-transform duration-300 group-hover:rotate-45" />
              </div>
              <span className="font-outfit font-bold text-2xl text-[#F8F6F0] tracking-tight flex items-center gap-1.5">
                RideWave
                <span className="w-2 h-2 rounded-full bg-[#C6A76B]" />
              </span>
            </Link>

            <p className="text-sm text-[#F8F6F0] leading-relaxed font-normal pr-4 max-w-sm">
              RideWave is a modern ride-booking and shared intercity mobility service connecting travelers with verified drivers for comfortable, transparent, and secure journeys.
            </p>

            <div className="pt-2 space-y-2 text-xs text-[#DCE7DF]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#C6A76B] shrink-0" />
                <span>Verified identity & vehicle documentation</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#C6A76B] shrink-0" />
                <span>Real-time GPS route telemetry & SOS safety</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#C6A76B] shrink-0" />
                <span>Nationwide intercity & urban routes</span>
              </div>
            </div>
          </div>

          {/* Navigation Columns */}
          {Object.entries(footerNav).map(([category, links]) => (
            <div key={category} className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#C6A76B] font-outfit">
                {category}
              </h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-[#F8F6F0] hover:text-[#C6A76B] transition-colors duration-150 inline-flex items-center gap-1 group font-medium"
                    >
                      <span>{link.label}</span>
                      <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#C6A76B]" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar: Copyright & Payment Trust */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#DCE7DF]">
          <p>
            © {new Date().getFullYear()} RideWave Mobility. All rights reserved. Built with precision and care.
          </p>

          <div className="flex items-center gap-4">
            <span className="text-[#C6A76B] font-semibold text-[11px] tracking-wide uppercase">
              Supported Payment Methods:
            </span>
            <div className="flex items-center gap-2 text-[#F8F6F0] font-semibold">
              <span className="px-2 py-0.5 rounded bg-[#173F35] border border-[#23584B]">Stripe</span>
              <span className="px-2 py-0.5 rounded bg-[#173F35] border border-[#23584B]">JazzCash</span>
              <span className="px-2 py-0.5 rounded bg-[#173F35] border border-[#23584B]">EasyPaisa</span>
              <span className="px-2 py-0.5 rounded bg-[#173F35] border border-[#23584B]">Cash</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

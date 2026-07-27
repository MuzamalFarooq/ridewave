'use client';

import Link from 'next/link';
import { Car, Mail, Phone, MapPin, Globe, Share2, MessageCircle } from 'lucide-react';

// Custom Brand Icon Components
const FacebookIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const TwitterIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const InstagramIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const LinkedinIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
);

const YoutubeIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const footerLinks = {
  Company: [
    { label: 'About Us', href: '/about' },
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'Safety', href: '/safety' },
    { label: 'Blog', href: '/blog' },
    { label: 'Careers', href: '/careers' },
    { label: 'Press', href: '/press' },
  ],
  Riders: [
    { label: 'Become a Rider', href: '/become-rider' },
    { label: 'Rider Dashboard', href: '/dashboard/rider' },
    { label: 'Earnings', href: '/dashboard/rider/earnings' },
    { label: 'Vehicle Registration', href: '/dashboard/rider/vehicles' },
    { label: 'Rider Support', href: '/contact' },
  ],
  Travelers: [
    { label: 'Find a Ride', href: '/find-ride' },
    { label: 'My Bookings', href: '/dashboard/traveler/bookings' },
    { label: 'Track Ride', href: '/dashboard/traveler' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Promotions', href: '/promotions' },
  ],
  Support: [
    { label: 'Help Center', href: '/faq' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Safety Guidelines', href: '/safety' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
  ],
};

const socials = [
  { icon: FacebookIcon, href: 'https://www.facebook.com/tigerstyle786.M', label: 'Facebook' },
  { icon: TwitterIcon, href: '#', label: 'Twitter' },
  { icon: InstagramIcon, href: 'https://www.instagram.com/tigerstyle786', label: 'Instagram' },
  { icon: LinkedinIcon, href: 'https://www.linkedin.com/in/muzamal-farooq-1232693a9', label: 'LinkedIn' },
  { icon: YoutubeIcon, href: '#', label: 'YouTube' },
];

const paymentIcons = ['visa', 'mastercard', 'stripe', 'jazzcash', 'easypaisa'];

export default function Footer() {
  return (
    <footer style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border)' }}>
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
                <Car className="w-5 h-5 text-white" />
              </div>
              <span className="font-outfit font-bold text-xl gradient-text">RideWave</span>
            </Link>
            <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--text-secondary)' }}>
              Your premium AI-powered ride-sharing platform. Connect with verified drivers, 
              travel safely, and explore the world — one ride at a time.
            </p>

            {/* Contact Info */}
            <div className="space-y-2 mb-6">
              {[
                { icon: Mail, text: 'muzamalfarooq111@gmail.com' },
                { icon: Phone, text: '+92 306 7774327' },
                { icon: MapPin, text: 'Lahore, Pakistan' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <Icon className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                  {text}
                </div>
              ))}
            </div>

            {/* Socials */}
            <div className="flex gap-2">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                  style={{ background: 'var(--border)', color: 'var(--text-secondary)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--primary)';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'var(--border)';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold text-sm mb-4" style={{ color: 'var(--text-primary)' }}>{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm transition-colors hover:text-[var(--primary)]"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* App Store Buttons */}
        <div className="mt-12 pt-8 border-t border-[var(--border)]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Download Our App</p>
              <div className="flex gap-3">
                {['App Store', 'Google Play'].map((store) => (
                  <a
                    key={store}
                    href="#"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border transition-all hover:border-[var(--primary)] hover:shadow-md"
                    style={{ borderColor: 'var(--border)', color: 'var(--text-primary)', background: 'var(--bg-elevated)' }}
                  >
                    <span className="text-lg">{store === 'App Store' ? '🍎' : '🤖'}</span>
                    <div>
                      <p style={{ fontSize: 9, color: 'var(--text-muted)' }}>Download on</p>
                      <p className="text-xs font-semibold">{store}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Payment Methods */}
            <div>
              <p className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>We Accept</p>
              <div className="flex gap-2 flex-wrap">
                {['💳 Visa', '💳 Mastercard', '⚡ Stripe', '📱 JazzCash', '📱 EasyPaisa', '💵 Cash'].map((m) => (
                  <span
                    key={m}
                    className="px-2 py-1 rounded-md text-xs font-medium border"
                    style={{ borderColor: 'var(--border)', color: 'var(--text-muted)', background: 'var(--bg-elevated)' }}
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-elevated)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              © 2025 RideWave Technologies. All rights reserved.
            </p>
            <div className="flex gap-4">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
                <Link
                  key={item}
                  href={`/${item.toLowerCase().replace(/ /g, '-')}`}
                  className="text-xs transition-colors hover:text-[var(--primary)]"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

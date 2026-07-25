import Link from 'next/link';
import { Car, Facebook, Twitter, Instagram, Linkedin, Youtube, Mail, Phone, MapPin } from 'lucide-react';

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
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Youtube, href: '#', label: 'YouTube' },
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
                { icon: Mail, text: 'support@ridewave.com' },
                { icon: Phone, text: '+92 300 123 4567' },
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

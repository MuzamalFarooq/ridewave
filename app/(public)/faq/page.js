'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, Search, Car, CreditCard, Shield, MessageSquare, Star, Users } from 'lucide-react';

const FAQS = [
  {
    category: 'Booking',
    icon: Car,
    color: '#6366f1',
    items: [
      { q: 'How do I book a ride?', a: 'Search for your route on our Find Ride page, select a ride that matches your schedule, choose the number of seats, and click "Book Now". You\'ll receive confirmation immediately if instant booking is enabled, or within a few hours if manual approval.' },
      { q: 'Can I cancel my booking?', a: 'Yes! Cancellations are allowed up to 2 hours before departure for a full refund. Within 2 hours, a 50% fee applies. You can cancel directly from your Bookings page.' },
      { q: 'What if my driver cancels?', a: 'If your driver cancels, you\'ll receive a full refund immediately and be notified via app and email. We\'ll also suggest alternative rides on the same route.' },
      { q: 'Can I book for someone else?', a: 'Absolutely! During booking, you can enter a different passenger name and phone number. The QR code will be generated for the stated passenger.' },
    ],
  },
  {
    category: 'Payments',
    icon: CreditCard,
    color: '#10b981',
    items: [
      { q: 'What payment methods are accepted?', a: 'We accept Visa/Mastercard, JazzCash, EasyPaisa, bank transfer, and cash. Cash is settled directly with the driver on boarding.' },
      { q: 'Is my payment information secure?', a: 'All card payments are processed through Stripe, which is PCI DSS Level 1 compliant — the highest level of payment security certification.' },
      { q: 'How do refunds work?', a: 'Digital payments are refunded to your original payment method within 3–5 business days. Cash refunds can be applied as wallet credits for your next ride.' },
      { q: 'Are there hidden fees?', a: 'Never. The price shown includes our platform fee (8%). You always see the exact amount before confirming your booking.' },
    ],
  },
  {
    category: 'Safety',
    icon: Shield,
    color: '#f59e0b',
    items: [
      { q: 'How are drivers verified?', a: 'Every rider must submit their CNIC, driver\'s license, and vehicle documents. Our team manually reviews all submissions, and verification takes 24–48 hours.' },
      { q: 'What is the SOS feature?', a: 'The SOS button in the app sends your live location and trip details to your pre-set emergency contacts via SMS instantly.' },
      { q: 'Is there live tracking?', a: 'Yes! Once your ride starts, you and your emergency contacts can track the vehicle on a live map in real time.' },
      { q: 'What if I feel unsafe during a ride?', a: 'Press the SOS button, which alerts your contacts and our safety team simultaneously. We have a 24/7 safety response team.' },
    ],
  },
  {
    category: 'Reviews',
    icon: Star,
    color: '#ec4899',
    items: [
      { q: 'How does the rating system work?', a: 'Both travelers and riders rate each other after every completed ride on a 1–5 star scale. Ratings are averaged and displayed publicly.' },
      { q: 'Can I see my rating?', a: 'Yes, your rating is visible on your profile. Travelers can see driver ratings before booking. Riders can see passenger ratings before accepting.' },
      { q: 'What happens if a rider has a low rating?', a: 'Riders with a rating below 3.5 stars will have their rides temporarily hidden. Consistent low ratings result in account suspension.' },
    ],
  },
  {
    category: 'Account',
    icon: Users,
    color: '#8b5cf6',
    items: [
      { q: 'Can I have both a Traveler and Rider account?', a: 'Yes! You can switch between Traveler and Rider modes from your profile settings. One account supports both roles.' },
      { q: 'How do I delete my account?', a: 'Contact our support team at support@ridewave.com or use the "Delete Account" option in Settings. All your data will be permanently removed within 30 days.' },
      { q: 'Is my personal data shared with drivers?', a: 'Only your first name and rating are shared with drivers. Your phone number is shared only after booking confirmation for trip coordination.' },
    ],
  },
];

export default function FAQPage() {
  const [search, setSearch] = useState('');
  const [openItem, setOpenItem] = useState(null);
  const [activeCategory, setActiveCategory] = useState('ALL');

  const allItems = FAQS.flatMap((cat) => cat.items.map((item) => ({ ...item, category: cat.category, icon: cat.icon, color: cat.color })));

  const filtered = allItems.filter((item) => {
    const matchCat = activeCategory === 'ALL' || item.category === activeCategory;
    const matchSearch = !search || item.q.toLowerCase().includes(search.toLowerCase()) || item.a.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen pt-20" style={{ background: 'var(--bg-base)' }}>
      {/* Hero */}
      <div className="animated-bg py-20 text-center">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-outfit font-bold text-white mb-4">
          Help Center & <span style={{ background: 'linear-gradient(135deg,#a78bfa,#ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>FAQ</span>
        </motion.h1>
        <p className="text-lg mb-8" style={{ color: 'rgba(255,255,255,0.7)' }}>Find answers to common questions about RideWave</p>
        <div className="max-w-xl mx-auto px-4 relative">
          <Search className="absolute left-7 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'rgba(255,255,255,0.5)' }} />
          <input
            type="text"
            placeholder="Search your question..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-2xl text-sm"
            style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white' }}
          />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Filters */}
        <div className="flex gap-2 flex-wrap justify-center mb-8">
          <button
            onClick={() => setActiveCategory('ALL')}
            className="px-4 py-2 rounded-full text-sm font-medium border transition-all"
            style={{ borderColor: activeCategory === 'ALL' ? 'var(--primary)' : 'var(--border)', background: activeCategory === 'ALL' ? 'rgba(99,102,241,0.1)' : 'transparent', color: activeCategory === 'ALL' ? 'var(--primary)' : 'var(--text-secondary)' }}
          >
            All
          </button>
          {FAQS.map(({ category, icon: Icon, color }) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all"
              style={{
                borderColor: activeCategory === category ? color : 'var(--border)',
                background: activeCategory === category ? `${color}15` : 'transparent',
                color: activeCategory === category ? color : 'var(--text-secondary)',
              }}
            >
              <Icon className="w-3.5 h-3.5" /> {category}
            </button>
          ))}
        </div>

        {/* FAQ Items */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <Search className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
              <h3 className="font-semibold mb-2">No results found</h3>
              <p style={{ color: 'var(--text-muted)' }}>Try a different search term or contact our support team</p>
            </div>
          ) : filtered.map(({ q, a, category, icon: Icon, color }, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="card-premium overflow-hidden">
              <button
                onClick={() => setOpenItem(openItem === i ? null : i)}
                className="w-full flex items-center gap-4 p-5 text-left"
              >
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}15` }}>
                  <Icon className="w-4 h-4" style={{ color }} />
                </div>
                <span className="flex-1 font-medium text-sm sm:text-base">{q}</span>
                {openItem === i
                  ? <ChevronUp className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--primary)' }} />
                  : <ChevronDown className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
                }
              </button>
              {openItem === i && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="px-5 pb-5 pl-17">
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)', paddingLeft: 48 }}>{a}</p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center p-8 rounded-3xl" style={{ background: 'var(--bg-surface)' }}>
          <MessageSquare className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--primary)' }} />
          <h3 className="font-bold text-xl mb-2">Still have questions?</h3>
          <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>Our support team is available 24/7 to help you.</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <a href="/contact" className="btn-primary py-2.5 px-6 text-sm">Contact Support</a>
            <a href="mailto:support@ridewave.com" className="btn-ghost py-2.5 px-6 text-sm border" style={{ borderColor: 'var(--border)' }}>Email Us</a>
          </div>
        </div>
      </div>
    </div>
  );
}

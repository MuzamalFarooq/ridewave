'use client';

import { motion } from 'framer-motion';
import { Users, Car, Star, Award, Globe, Heart, Target, Zap } from 'lucide-react';

const TEAM = [
  {
    name: 'Muzamal Farooq',
    role: 'CEO & Co-Founder',
    bio: '10+ years in mobility tech. Ex-Careem.',
    color: '#6366f1',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Hira Rehman',
    role: 'CTO & Co-Founder',
    bio: 'Full-stack engineer. Built BlaBlaCar Pakistan ops.',
    color: '#ec4899',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Bilal Hussain',
    role: 'Head of Safety',
    bio: 'Former law enforcement. Passionate about safe travel.',
    color: '#10b981',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Ayesha Khan',
    role: 'Head of Design',
    bio: 'UX designer. Crafting premium digital experiences.',
    color: '#f59e0b',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
  },
];

const VALUES = [
  { icon: Heart, title: 'People First', desc: 'Every feature we build starts with a real traveler or rider need.', color: '#ef4444' },
  { icon: Globe, title: 'Built for Pakistan', desc: 'Designed specifically for Pakistan\'s roads, culture, and people.', color: '#10b981' },
  { icon: Target, title: 'Trust & Transparency', desc: 'We\'re honest about pricing, data, and how our platform works.', color: '#6366f1' },
  { icon: Zap, title: 'Continuous Innovation', desc: 'We ship improvements every week, driven by community feedback.', color: '#f59e0b' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-20" style={{ background: 'var(--bg-base)' }}>
      {/* Hero */}
      <div className="animated-bg py-28 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl sm:text-6xl font-outfit font-bold text-white mb-6">
            The Story Behind<br />
            <span style={{ background: 'linear-gradient(135deg, #a78bfa, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              RideWave
            </span>
          </h1>
          <p className="text-lg max-w-3xl mx-auto leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>
            We started RideWave in 2024 with a simple belief: travel in Pakistan should be safe, affordable, and sustainable. By connecting vehicle owners with daily commuters, we're reducing road congestion, lowering travel costs, and creating income opportunities for everyday Pakistanis.
          </p>
        </motion.div>
      </div>

      {/* Stats */}
      <div className="py-14" style={{ background: 'var(--bg-surface)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: '500K+', label: 'Rides Completed', icon: Car, color: '#6366f1' },
              { value: '12,000+', label: 'Verified Riders', icon: Users, color: '#10b981' },
              { value: '35+', label: 'Cities Covered', icon: Globe, color: '#f59e0b' },
              { value: '4.9★', label: 'Average Rating', icon: Star, color: '#ec4899' },
            ].map(({ value, label, icon: Icon, color }, i) => (
              <motion.div key={label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ background: `${color}15` }}>
                  <Icon className="w-7 h-7" style={{ color }} />
                </div>
                <div className="text-3xl font-outfit font-bold gradient-text">{value}</div>
                <div className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-outfit font-bold mb-6">Our <span className="gradient-text">Mission</span></h2>
          <p className="text-lg leading-relaxed mb-10" style={{ color: 'var(--text-secondary)' }}>
            To democratize transportation in Pakistan by building a trusted, technology-driven marketplace that empowers everyday Pakistanis to move smarter, earn more, and travel safely. We believe in a future where every empty car seat is a shared opportunity.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="py-20" style={{ background: 'var(--bg-surface)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-outfit font-bold text-center mb-10">Our <span className="gradient-text">Values</span></h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {VALUES.map(({ icon: Icon, title, desc, color }, i) => (
              <motion.div key={title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} whileHover={{ y: -6 }} className="card-premium p-6">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ background: `${color}15` }}>
                  <Icon className="w-6 h-6" style={{ color }} />
                </div>
                <h3 className="font-bold mb-2">{title}</h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-outfit font-bold text-center mb-10">Meet the <span className="gradient-text">Team</span></h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {TEAM.map(({ name, role, bio, color, image }, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                className="card-premium p-6 text-center group"
              >
                <div className="w-20 h-20 rounded-3xl overflow-hidden mx-auto mb-4 p-1 border border-slate-700/50 bg-slate-900/60 shadow-lg relative">
                  {image ? (
                    <img
                      src={image}
                      alt={name}
                      className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div
                      className="w-full h-full rounded-2xl flex items-center justify-center text-white text-2xl font-bold"
                      style={{ background: `linear-gradient(135deg, ${color}, ${color}99)` }}
                    >
                      {name[0]}
                    </div>
                  )}
                </div>
                <h3 className="font-bold text-base">{name}</h3>
                <p className="text-xs font-medium mb-2" style={{ color }}>{role}</p>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Search, Car, Navigation, ShieldCheck, ArrowRight, Check } from 'lucide-react';

export default function FeaturedServices() {
  const services = [
    {
      title: 'Book a Ride',
      subtitle: 'Find affordable rides instantly',
      description: 'Search hundreds of daily routes across cities or within your local area. Filter by comfort, price, and departure time with instant booking.',
      icon: Search,
      gradient: 'from-blue-600 to-indigo-600',
      badge: 'Passengers',
      href: '/find-ride',
      features: ['Real-time seat availability', 'Instant seat lock', 'Flexible pick-up points'],
    },
    {
      title: 'Become a Rider',
      subtitle: 'Earn money using your car or bike',
      description: 'Turn empty seats into extra income. Set your route, choose your passengers, and cover your daily commute or intercity fuel costs effortlessly.',
      icon: Car,
      gradient: 'from-indigo-600 to-purple-600',
      badge: 'Drivers & Bikers',
      href: '/become-rider',
      features: ['Keep up to 90% earnings', 'Automated fare calculation', 'Flexible routine scheduling'],
    },
    {
      title: 'Live GPS Tracking',
      subtitle: 'Track every ride in real time',
      description: 'Share your trip progress with loved ones in real time. Precise live telemetry, estimated time of arrival, and route monitoring for ultimate peace of mind.',
      icon: Navigation,
      gradient: 'from-purple-600 to-pink-600',
      badge: 'Safety Tech',
      href: '/safety',
      features: ['Live location sharing', 'Route deviation alerts', 'Emergency SOS button'],
    },
    {
      title: 'Safe Travel',
      subtitle: 'Verified drivers and secure payments',
      description: 'All riders undergo multi-step identity, license, and background verification. Payments are held in secure escrow until trip completion.',
      icon: ShieldCheck,
      gradient: 'from-emerald-600 to-teal-600',
      badge: 'Guaranteed',
      href: '/safety',
      features: ['CNIC & License verified', 'Cashless Escrow payouts', '24/7 Safety Incident Team'],
    },
  ];

  return (
    <section className="py-24 bg-slate-950 relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-bold uppercase tracking-widest text-indigo-400 px-3 py-1 bg-indigo-500/10 rounded-full border border-indigo-500/20"
          >
            Core Ecosystem
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-outfit"
          >
            Premium Mobility Solutions
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-base sm:text-lg text-slate-400 font-light"
          >
            Whether you want a daily commute, an intercity journey, or passive income from your vehicle, RideWave offers world-class tools.
          </motion.p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative flex flex-col justify-between p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/40 transition-all duration-500 backdrop-blur-xl shadow-xl hover:shadow-2xl hover:shadow-indigo-950/50 hover:-translate-y-2"
              >
                {/* Top Badge & Icon */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className={`p-4 rounded-2xl bg-gradient-to-br ${service.gradient} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-semibold text-slate-400 px-3 py-1 bg-slate-800/80 rounded-full border border-slate-700">
                      {service.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors font-outfit">
                    {service.title}
                  </h3>
                  <p className="text-xs font-semibold text-indigo-400 mt-0.5">{service.subtitle}</p>

                  <p className="text-sm text-slate-400 mt-4 leading-relaxed font-light">
                    {service.description}
                  </p>

                  <ul className="mt-6 space-y-2.5">
                    {service.features.map((feat) => (
                      <li key={feat} className="flex items-center gap-2 text-xs text-slate-300">
                        <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottom Action Button */}
                <div className="mt-8 pt-6 border-t border-slate-800/80">
                  <Link
                    href={service.href}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors group/btn"
                  >
                    <span>Explore Feature</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

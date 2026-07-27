'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Users, Car, MapPin, Award, Shield, Sparkles } from 'lucide-react';

function Counter({ end, suffix = '', duration = 2 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const target = parseInt(end.toString().replace(/,/g, ''), 10);
    const stepTime = Math.abs(Math.floor((duration * 1000) / (target / 100)));
    let current = 0;
    const increment = Math.ceil(target / (duration * 60));

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [isInView, end, duration]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function StatsSection() {
  const stats = [
    {
      label: 'Happy Travelers',
      value: 25000,
      suffix: '+',
      icon: Users,
      color: 'from-blue-500 to-indigo-500',
      description: 'Satisfied passengers across regions',
    },
    {
      label: 'Verified Riders',
      value: 5000,
      suffix: '+',
      icon: Car,
      color: 'from-indigo-500 to-purple-500',
      description: 'Strictly vetted background-checked drivers',
    },
    {
      label: 'Cities Covered',
      value: 120,
      suffix: '+',
      icon: MapPin,
      color: 'from-purple-500 to-pink-500',
      description: 'Connected urban & intercity routes',
    },
    {
      label: 'Successful Trips',
      value: 100000,
      suffix: '+',
      icon: Award,
      color: 'from-emerald-500 to-teal-500',
      description: 'Safe & comfortable journeys completed',
    },
  ];

  return (
    <section className="py-20 bg-slate-900 border-y border-slate-800/80 relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.08),transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative group p-6 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-indigo-500/40 transition-all duration-300 backdrop-blur-xl shadow-xl hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} text-white shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    Verified Metric
                  </span>
                </div>

                <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-outfit">
                  <Counter end={stat.value} suffix={stat.suffix} />
                </h3>
                <p className="text-base font-semibold text-slate-200 mt-1">{stat.label}</p>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{stat.description}</p>

                {/* Decorative Bottom Bar */}
                <div className={`h-1 w-0 group-hover:w-full bg-gradient-to-r ${stat.color} rounded-full transition-all duration-500 mt-4`} />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

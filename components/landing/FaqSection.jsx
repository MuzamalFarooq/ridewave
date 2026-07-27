'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, ShieldCheck, CreditCard, RefreshCw, Car, UserCheck } from 'lucide-react';

export default function FaqSection() {
  const faqs = [
    {
      question: 'How do I search and book a ride on RideWave?',
      answer: 'Simply enter your departure location, destination city, travel date, and required number of seats into the search bar. Browse verified driver profiles, select your preferred ride, and tap "Book Seat". You will receive instant SMS & in-app confirmation.',
      category: 'Booking',
      icon: Car,
    },
    {
      question: 'What payment methods are supported for ride fares?',
      answer: 'RideWave supports instant cashless payments via Credit/Debit Cards, Stripe, JazzCash, and EasyPaisa wallet transfers, as well as direct cash payouts to the driver upon ride completion.',
      category: 'Payments',
      icon: CreditCard,
    },
    {
      question: 'What is the cancellation & refund policy?',
      answer: 'You can cancel any booking free of charge up to 6 hours before departure. Cancellations within 6 hours receive an 80% refund. If a driver cancels a ride, you receive a 100% immediate wallet refund plus a ride credit voucher.',
      category: 'Cancellation',
      icon: RefreshCw,
    },
    {
      question: 'How does RideWave ensure safety for travelers and drivers?',
      answer: 'All drivers pass identity (CNIC), driving license, and vehicle registration verification. We offer real-time GPS telemetry sharing, an in-app emergency SOS button, and 24/7 incident response monitoring.',
      category: 'Safety',
      icon: ShieldCheck,
    },
    {
      question: 'How do I register as a driver and offer seats on my car/bike?',
      answer: 'Click on "Become a Rider" in the top navbar, fill in your personal details, upload your driving license, vehicle registration papers, and CNIC copy. Our team verifies your profile within 2 to 4 business hours.',
      category: 'Rider Registration',
      icon: UserCheck,
    },
  ];

  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="py-24 bg-slate-900 border-t border-slate-800/80 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-bold uppercase tracking-widest text-indigo-400 px-3 py-1 bg-indigo-500/10 rounded-full border border-indigo-500/20"
          >
            Got Questions?
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-outfit"
          >
            Frequently Asked Questions
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-base sm:text-lg text-slate-400 font-light"
          >
            Everything you need to know about booking rides, driver verification, safety, and payments.
          </motion.p>
        </div>

        {/* Animated Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            const Icon = faq.icon;
            return (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="rounded-2xl border border-slate-800 bg-slate-950/70 overflow-hidden transition-all duration-300 shadow-md"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 focus:outline-none hover:bg-slate-900/60 transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 block mb-0.5">
                        {faq.category}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-white font-outfit">
                        {faq.question}
                      </h3>
                    </div>
                  </div>

                  <div className={`p-2 rounded-full bg-slate-900 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-indigo-400' : ''}`}>
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-6 pb-6 pt-2 border-t border-slate-800/60 text-sm text-slate-300 font-light leading-relaxed pl-16">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, ShieldCheck, CreditCard, RefreshCw, Car, UserCheck } from 'lucide-react';

export default function FaqSection() {
  const faqs = [
    {
      question: 'How do I search and book a ride on RideWave?',
      answer: 'Enter your departure location, destination, travel date, and required number of seats into the search bar. Browse verified driver routes, select your preferred ride, and confirm your seat. You will receive immediate in-app and email confirmation.',
      category: 'Booking',
      icon: Car,
    },
    {
      question: 'What payment methods are supported on RideWave?',
      answer: 'RideWave supports instant card checkout via Stripe, Pakistani mobile wallets (JazzCash and EasyPaisa), as well as transparent direct cash payment to your driver upon trip completion.',
      category: 'Payments',
      icon: CreditCard,
    },
    {
      question: 'How does RideWave verify drivers and vehicles?',
      answer: 'All registered drivers submit national identity (CNIC), an active driving license, and official vehicle registration documents. Our administrative verification team reviews and approves each profile before rides can be listed.',
      category: 'Safety',
      icon: ShieldCheck,
    },
    {
      question: 'Can I cancel my ride booking if my plans change?',
      answer: 'Yes. Travelers can cancel bookings through their Traveller Dashboard. Cancellations made well in advance free up your reserved seat for other co-travelers and follow the platform refund rules.',
      category: 'Cancellation',
      icon: RefreshCw,
    },
    {
      question: 'How does real-time tracking and in-app chat work?',
      answer: 'Once your booking is confirmed, you gain access to direct in-app messaging with your driver. During active trips, you can follow your vehicle on interactive Google Maps with live telemetry.',
      category: 'Telemetry',
      icon: UserCheck,
    },
  ];

  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="py-20 md:py-28 bg-[#F8F6F0] dark:bg-[#102F28] border-t border-[#E7E5DD] dark:border-[#23584B]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#173F35] dark:text-[#C6A76B] px-3.5 py-1.5 bg-[#DCE7DF]/60 dark:bg-[#173F35] rounded-full border border-[#E7E5DD] dark:border-[#23584B]">
            Help Center
          </span>
          <h2 className="font-outfit font-extrabold text-3xl sm:text-4xl text-[#102F28] dark:text-[#F8F6F0] tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-base text-[#242824] dark:text-[#F8F6F0] font-normal leading-relaxed">
            Everything you need to know about booking rides, driver standards, and traveling with RideWave.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            const Icon = faq.icon;
            return (
              <div
                key={faq.question}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'bg-white dark:bg-[#173F35] border-[#173F35]/30 dark:border-[#C6A76B]/40 shadow-sm'
                    : 'bg-white/70 dark:bg-[#173F35]/60 border-[#E7E5DD] dark:border-[#23584B] hover:border-[#173F35]/20'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                      isOpen
                        ? 'bg-[#173F35] text-[#C6A76B]'
                        : 'bg-[#DCE7DF]/60 dark:bg-[#102F28] text-[#173F35] dark:text-[#DCE7DF]'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="font-outfit font-bold text-base sm:text-lg text-[#102F28] dark:text-[#F8F6F0]">
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-[#2C322B] dark:text-[#DCE7DF] transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180 text-[#173F35] dark:text-[#C6A76B]' : ''
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-6 sm:px-6 sm:pb-6 text-sm text-[#242824] dark:text-[#F8F6F0] leading-relaxed font-normal border-t border-[#E7E5DD]/60 dark:border-[#23584B]/60 pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

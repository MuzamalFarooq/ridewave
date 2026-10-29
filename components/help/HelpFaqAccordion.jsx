'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  HelpCircle,
  ThumbsUp,
  ThumbsDown,
  CheckCircle2,
  Filter,
} from 'lucide-react';
import { FAQS } from './helpData';

export default function HelpFaqAccordion({ searchQuery, selectedCategory, onSelectCategory }) {
  const [openId, setOpenId] = useState('faq-1');
  const [feedbackGiven, setFeedbackGiven] = useState({});

  const categories = [
    'All Questions',
    'Booking & Rides',
    'Payments & Pricing',
    'Safety & Security',
    'Driver Support',
    'Account & Profile',
    'Technical Issues',
  ];

  const currentCategory = selectedCategory || 'All Questions';
  const query = (searchQuery || '').trim().toLowerCase();

  // Filter FAQS by category and search query
  const filteredFaqs = FAQS.filter((faq) => {
    const matchesCategory =
      currentCategory === 'All Questions' || faq.category === currentCategory;

    const matchesQuery =
      !query ||
      faq.question.toLowerCase().includes(query) ||
      faq.answer.toLowerCase().includes(query) ||
      faq.category.toLowerCase().includes(query);

    return matchesCategory && matchesQuery;
  });

  const handleFeedback = (faqId, isHelpful) => {
    setFeedbackGiven((prev) => ({
      ...prev,
      [faqId]: isHelpful ? 'helpful' : 'not-helpful',
    }));
  };

  return (
    <section id="faqs" aria-labelledby="faqs-heading" className="w-full">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#DCE7DF]/60 dark:bg-[#173F35] text-[#173F35] dark:text-[#C6A76B] text-xs font-bold uppercase tracking-widest border border-[#E7E5DD] dark:border-[#23584B]">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Interactive Answers</span>
          </div>
          <h2 id="faqs-heading" className="font-outfit font-extrabold text-2xl sm:text-4xl text-[#171A17] dark:text-[#F8F6F0]">
            Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-base text-[#4E554B] dark:text-[#D0DBD3]">
            Verified guidelines and quick answers regarding RideWave policies, driver standards, and journey management.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {categories.map((cat) => {
            const isActive = currentCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => onSelectCategory && onSelectCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-[#173F35] text-[#F8F6F0] dark:bg-[#C6A76B] dark:text-[#102F28] shadow-sm'
                    : 'bg-white dark:bg-[#173F35]/70 text-[#4E554B] dark:text-[#D0DBD3] border border-[#E7E5DD] dark:border-[#23584B] hover:border-[#173F35]/40'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* FAQ Accordion List */}
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-12 px-6 rounded-2xl border border-dashed border-[#E7E5DD] dark:border-[#23584B] bg-white/60 dark:bg-[#173F35]/40">
            <HelpCircle className="w-8 h-8 text-[#4E554B] dark:text-[#D0DBD3] mx-auto mb-2 opacity-50" />
            <h3 className="font-outfit font-bold text-lg text-[#171A17] dark:text-[#F8F6F0]">
              No questions found
            </h3>
            <p className="text-xs text-[#4E554B] dark:text-[#D0DBD3] mt-1 max-w-sm mx-auto">
              We couldn&apos;t find any FAQs matching your query. Please scroll down to submit a support request.
            </p>
          </div>
        ) : (
          <div className="space-y-3.5">
            {filteredFaqs.map((faq) => {
              const isOpen = openId === faq.id;
              const feedback = feedbackGiven[faq.id];

              return (
                <div
                  key={faq.id}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? 'bg-white dark:bg-[#173F35] border-[#173F35]/30 dark:border-[#C6A76B]/40 shadow-sm'
                      : 'bg-white/80 dark:bg-[#173F35]/60 border-[#E7E5DD] dark:border-[#23584B] hover:border-[#173F35]/30'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenId(isOpen ? null : faq.id)}
                    className="w-full text-left p-5 sm:p-6 flex items-start sm:items-center justify-between gap-4 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#173F35] rounded-2xl"
                    aria-expanded={isOpen}
                  >
                    <div className="space-y-1 pr-2">
                      <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-[#C6A76B] dark:text-[#C6A76B] px-2 py-0.5 rounded bg-[#102F28]/5 dark:bg-[#102F28] border border-[#E7E5DD]/60 dark:border-[#23584B]/60">
                        {faq.category}
                      </span>
                      <h3 className="font-outfit font-bold text-base sm:text-lg text-[#171A17] dark:text-[#F8F6F0] leading-snug">
                        {faq.question}
                      </h3>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-[#4E554B] dark:text-[#D0DBD3] transition-transform duration-300 shrink-0 mt-1 sm:mt-0 ${
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
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                      >
                        <div className="px-5 pb-6 sm:px-6 pt-1 text-sm text-[#4E554B] dark:text-[#D0DBD3] leading-relaxed border-t border-[#E7E5DD]/50 dark:border-[#23584B]/50">
                          <p className="pt-3">{faq.answer}</p>

                          {/* Was this answer helpful? */}
                          <div className="mt-5 pt-3 border-t border-[#E7E5DD]/60 dark:border-[#23584B]/60 flex items-center justify-between text-xs">
                            <span className="text-[#4E554B] dark:text-[#D0DBD3] font-medium">
                              Was this answer helpful?
                            </span>
                            {feedback ? (
                              <span className="inline-flex items-center gap-1.5 text-xs text-[#26734D] font-semibold">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Thanks for your feedback!
                              </span>
                            ) : (
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleFeedback(faq.id, true)}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-[#E7E5DD] dark:border-[#23584B] hover:bg-[#F8F6F0] dark:hover:bg-[#102F28] text-[#171A17] dark:text-[#F8F6F0] transition-colors"
                                  aria-label="Mark answer as helpful"
                                >
                                  <ThumbsUp className="w-3 h-3 text-[#26734D]" />
                                  <span>Yes</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleFeedback(faq.id, false)}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-[#E7E5DD] dark:border-[#23584B] hover:bg-[#F8F6F0] dark:hover:bg-[#102F28] text-[#171A17] dark:text-[#F8F6F0] transition-colors"
                                  aria-label="Mark answer as not helpful"
                                >
                                  <ThumbsDown className="w-3 h-3 text-[#B42318]" />
                                  <span>No</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}


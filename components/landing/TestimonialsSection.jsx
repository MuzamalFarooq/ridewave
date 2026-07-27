'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight, MapPin, CheckCircle2 } from 'lucide-react';

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Ali Raza',
      role: 'Frequent Intercity Passenger',
      location: 'Islamabad, Pakistan',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      rating: 5,
      text: 'RideWave transformed my weekly commute between Islamabad and Lahore! The drivers are courteous, cars are immaculate, and live GPS tracking gives my family complete peace of mind.',
    },
    {
      name: 'Fatima Noor',
      role: 'University Student',
      location: 'Lahore, Pakistan',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
      rating: 5,
      text: 'As a woman traveling alone intercity, safety is my top priority. RideWave verified drivers and instant emergency features make me feel 100% safe every single trip.',
    },
    {
      name: 'Kamran Khan',
      role: 'Verified Carpool Rider',
      location: 'Karachi, Pakistan',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
      rating: 5,
      text: 'I earn over 40,000 PKR every month just by offering my empty passenger seats during my daily commute to work! Simple app, automated payouts, and great passenger community.',
    },
    {
      name: 'Dr. Zoya Malik',
      role: 'Medical Consultant',
      location: 'Peshawar, Pakistan',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
      rating: 5,
      text: 'The in-app WebRTC call and instant booking features are incredible. I booked a comfortable ride to Murree within 60 seconds with no price surge surprises.',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <section className="py-24 bg-slate-900 border-t border-slate-800/80 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-bold uppercase tracking-widest text-indigo-400 px-3 py-1 bg-indigo-500/10 rounded-full border border-indigo-500/20"
          >
            Community Voices
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-outfit"
          >
            Loved by Travelers & Drivers
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-base sm:text-lg text-slate-400 font-light"
          >
            Read genuine feedback from thousands of travelers who rely on RideWave every day.
          </motion.p>
        </div>

        {/* Testimonial Card Slider */}
        <div className="relative max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="p-8 sm:p-12 rounded-3xl bg-slate-950/80 border border-slate-800 backdrop-blur-2xl shadow-2xl relative"
            >
              <Quote className="absolute top-8 right-8 w-16 h-16 text-indigo-500/10 pointer-events-none" />

              {/* Rating */}
              <div className="flex items-center gap-1 text-amber-400 mb-6">
                {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400" />
                ))}
              </div>

              {/* Review Text */}
              <blockquote className="text-lg sm:text-xl text-slate-200 font-light leading-relaxed italic mb-8">
                "{testimonials[currentIndex].text}"
              </blockquote>

              {/* Author Footer */}
              <div className="flex items-center justify-between border-t border-slate-800/80 pt-6">
                <div className="flex items-center gap-4">
                  <img
                    src={testimonials[currentIndex].avatar}
                    alt={testimonials[currentIndex].name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-indigo-500/40"
                  />
                  <div>
                    <h4 className="text-base font-bold text-white font-outfit flex items-center gap-1.5">
                      {testimonials[currentIndex].name}
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    </h4>
                    <p className="text-xs text-indigo-400">{testimonials[currentIndex].role}</p>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      {testimonials[currentIndex].location}
                    </p>
                  </div>
                </div>

                {/* Slider Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrev}
                    aria-label="Previous testimonial"
                    className="p-3 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNext}
                    aria-label="Next testimonial"
                    className="p-3 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Dots Indicator */}
          <div className="flex items-center justify-center gap-2 mt-8">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  currentIndex === idx ? 'w-8 bg-indigo-500' : 'w-2.5 bg-slate-800 hover:bg-slate-700'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

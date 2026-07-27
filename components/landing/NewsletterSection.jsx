'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, CheckCircle2, Sparkles, Shield } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubscribed(true);
      toast.success('Thank you for subscribing to RideWave updates!');
    }, 800);
  };

  return (
    <section className="py-20 bg-slate-950 border-t border-slate-800/80 relative overflow-hidden">
      {/* Background Glow Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-r from-indigo-600/15 via-purple-600/15 to-pink-600/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl border border-slate-800/80 bg-slate-900/80 p-8 sm:p-14 backdrop-blur-2xl shadow-2xl overflow-hidden text-center"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>Stay in the Loop</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-outfit max-w-2xl mx-auto">
            Get Exclusive Travel Discounts & Route Updates
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
            Subscribe to our weekly newsletter for zero-fee promo codes, new intercity route announcements, and driver tips.
          </p>

          {isSubscribed ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mt-8 p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 max-w-lg mx-auto flex items-center justify-center gap-3 text-emerald-300 font-semibold"
            >
              <CheckCircle2 className="w-6 h-6 shrink-0" />
              <span>You're officially subscribed! Check your inbox for your welcome voucher.</span>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 max-w-md mx-auto flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  required
                  className="w-full pl-12 pr-4 py-4 bg-slate-950/90 border border-slate-800 rounded-2xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-inner"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="py-4 px-8 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white font-semibold text-sm hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 shrink-0 disabled:opacity-70 group"
              >
                <span>{isSubmitting ? 'Subscribing...' : 'Subscribe Now'}</span>
                <Send className={`w-4 h-4 ${isSubmitting ? 'animate-spin' : 'group-hover:translate-x-1'} transition-transform`} />
              </button>
            </form>
          )}

          <p className="mt-4 text-xs text-slate-500 flex items-center justify-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-slate-600" />
            <span>We value your privacy. Zero spam, unsubscribe anytime.</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowLeft, Send, CheckCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Please enter your email address.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong.');
      }

      setIsSuccess(true);
    } catch (err) {
      toast.error(err.message || 'Failed to send reset email. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forgot-root">
      {/* Animated gradient background */}
      <div className="animated-bg" aria-hidden="true">
        <div className="animated-bg__blob animated-bg__blob--1" />
        <div className="animated-bg__blob animated-bg__blob--2" />
        <div className="animated-bg__blob animated-bg__blob--3" />
      </div>

      <div className="forgot-container">
        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.div
              key="form"
              className="forgot-card glass-card"
              initial={{ opacity: 0, y: 32, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -24, scale: 0.97 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Icon badge */}
              <motion.div
                className="icon-badge"
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.15, type: 'spring', stiffness: 260, damping: 18 }}
              >
                <Lock size={28} className="icon-badge__icon" />
              </motion.div>

              <motion.h1
                className="forgot-title"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Forgot Password?
              </motion.h1>
              <motion.p
                className="forgot-subtitle"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                No worries! Enter your email and we&apos;ll send you a reset link.
              </motion.p>

              <motion.form
                onSubmit={handleSubmit}
                className="forgot-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="input-group">
                  <label htmlFor="fp-email" className="input-label">
                    Email Address
                  </label>
                  <div className="input-wrapper">
                    <Mail size={18} className="input-icon" />
                    <input
                      id="fp-email"
                      type="email"
                      className="form-input"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                    />
                  </div>
                </div>

                <motion.button
                  type="submit"
                  className="btn-primary"
                  disabled={isLoading}
                  whileHover={{ scale: isLoading ? 1 : 1.02 }}
                  whileTap={{ scale: isLoading ? 1 : 0.97 }}
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={18} className="btn-spinner" />
                      Sending Reset Link…
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Send Reset Link
                    </>
                  )}
                </motion.button>
              </motion.form>

              <motion.div
                className="back-link"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Link href="/auth/login" className="back-anchor">
                  <ArrowLeft size={16} />
                  Back to Login
                </Link>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              className="forgot-card glass-card success-card"
              initial={{ opacity: 0, y: 32, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div
                className="icon-badge icon-badge--success"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 16 }}
              >
                <CheckCircle size={32} className="icon-badge__icon icon-badge__icon--success" />
              </motion.div>

              <motion.h2
                className="forgot-title"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                Check Your Email
              </motion.h2>

              <motion.p
                className="forgot-subtitle"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.22 }}
              >
                We&apos;ve sent a password reset link to{' '}
                <strong className="highlight-email">{email}</strong>. Check your inbox and
                follow the instructions.
              </motion.p>

              <motion.p
                className="forgot-hint"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
              >
                Didn&apos;t receive it? Check your spam folder or{' '}
                <button
                  type="button"
                  className="resend-btn"
                  onClick={() => setIsSuccess(false)}
                >
                  try again
                </button>
                .
              </motion.p>

              <motion.div
                className="back-link"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
              >
                <Link href="/auth/login" className="back-anchor">
                  <ArrowLeft size={16} />
                  Back to Login
                </Link>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx global>{`
        .forgot-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          background: #0a0a14;
          font-family: 'Inter', 'Segoe UI', sans-serif;
        }

        /* ── Animated gradient background ── */
        .animated-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
        }
        .animated-bg__blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.35;
          animation: blobFloat 12s ease-in-out infinite alternate;
        }
        .animated-bg__blob--1 {
          width: 520px; height: 520px;
          background: radial-gradient(circle, #6c3de8 0%, #3b1f8c 100%);
          top: -120px; left: -100px;
          animation-duration: 14s;
        }
        .animated-bg__blob--2 {
          width: 420px; height: 420px;
          background: radial-gradient(circle, #e83d8c 0%, #8c1f5a 100%);
          bottom: -100px; right: -80px;
          animation-duration: 11s;
          animation-delay: -4s;
        }
        .animated-bg__blob--3 {
          width: 300px; height: 300px;
          background: radial-gradient(circle, #3dc6e8 0%, #1a6080 100%);
          top: 40%; left: 55%;
          animation-duration: 16s;
          animation-delay: -8s;
        }
        @keyframes blobFloat {
          0%   { transform: translate(0, 0) scale(1); }
          50%  { transform: translate(30px, -30px) scale(1.07); }
          100% { transform: translate(-20px, 20px) scale(0.95); }
        }

        /* ── Card ── */
        .forgot-container {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 460px;
          padding: 24px 16px;
        }
        .glass-card {
          background: rgba(255,255,255,0.06);
          backdrop-filter: blur(24px) saturate(1.6);
          -webkit-backdrop-filter: blur(24px) saturate(1.6);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 24px;
          padding: 48px 40px 40px;
          box-shadow:
            0 24px 64px rgba(0,0,0,0.5),
            0 0 0 1px rgba(255,255,255,0.05) inset;
        }

        /* ── Icon badge ── */
        .icon-badge {
          width: 64px; height: 64px;
          border-radius: 18px;
          background: linear-gradient(135deg, #6c3de8 0%, #a855f7 100%);
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 24px;
          box-shadow: 0 8px 24px rgba(108,61,232,0.45);
        }
        .icon-badge--success {
          background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%);
          box-shadow: 0 8px 24px rgba(22,163,74,0.45);
        }
        .icon-badge__icon { color: #fff; }

        /* ── Typography ── */
        .forgot-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: #f0f0ff;
          text-align: center;
          margin: 0 0 10px;
          letter-spacing: -0.02em;
        }
        .forgot-subtitle {
          font-size: 0.95rem;
          color: rgba(200,200,230,0.75);
          text-align: center;
          margin: 0 0 32px;
          line-height: 1.6;
        }
        .highlight-email {
          color: #a78bfa;
          font-weight: 600;
        }
        .forgot-hint {
          font-size: 0.875rem;
          color: rgba(200,200,230,0.6);
          text-align: center;
          margin: 0 0 24px;
        }
        .resend-btn {
          background: none; border: none; cursor: pointer;
          color: #a78bfa; font-size: inherit; text-decoration: underline;
          padding: 0;
        }
        .resend-btn:hover { color: #c4b5fd; }

        /* ── Form ── */
        .forgot-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-bottom: 24px;
        }
        .input-group { display: flex; flex-direction: column; gap: 8px; }
        .input-label {
          font-size: 0.875rem;
          font-weight: 500;
          color: rgba(210,210,240,0.8);
        }
        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        .input-icon {
          position: absolute;
          left: 14px;
          color: rgba(167,139,250,0.7);
          pointer-events: none;
        }
        .form-input {
          width: 100%;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.14);
          border-radius: 12px;
          padding: 13px 14px 13px 44px;
          color: #f0f0ff;
          font-size: 0.95rem;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
        }
        .form-input::placeholder { color: rgba(180,180,210,0.4); }
        .form-input:focus {
          border-color: rgba(167,139,250,0.6);
          box-shadow: 0 0 0 3px rgba(167,139,250,0.15);
        }

        /* ── Button ── */
        .btn-primary {
          display: flex; align-items: center; justify-content: center;
          gap: 8px;
          background: linear-gradient(135deg, #6c3de8 0%, #a855f7 100%);
          color: #fff;
          border: none;
          border-radius: 12px;
          padding: 14px 24px;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.2s, box-shadow 0.2s;
          box-shadow: 0 6px 20px rgba(108,61,232,0.4);
          width: 100%;
        }
        .btn-primary:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .btn-primary:not(:disabled):hover {
          box-shadow: 0 8px 28px rgba(108,61,232,0.55);
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .btn-spinner { animation: spin 0.8s linear infinite; }

        /* ── Back link ── */
        .back-link { text-align: center; }
        .back-anchor {
          display: inline-flex; align-items: center; gap: 6px;
          color: rgba(180,180,210,0.7);
          text-decoration: none;
          font-size: 0.875rem;
          transition: color 0.2s;
        }
        .back-anchor:hover { color: #a78bfa; }
      `}</style>
    </div>
  );
}

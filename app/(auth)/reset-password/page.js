'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle,
  Loader2,
  ArrowLeft,
  KeyRound,
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [tokenMissing, setTokenMissing] = useState(false);

  useEffect(() => {
    if (!token) setTokenMissing(true);
  }, [token]);

  const getPasswordStrength = (pwd) => {
    if (pwd.length === 0) return { label: '', color: 'transparent', width: '0%' };
    if (pwd.length < 6) return { label: 'Weak', color: '#ef4444', width: '25%' };
    if (pwd.length < 10) return { label: 'Fair', color: '#f59e0b', width: '55%' };
    if (/[A-Z]/.test(pwd) && /[0-9]/.test(pwd) && /[^A-Za-z0-9]/.test(pwd))
      return { label: 'Strong', color: '#22c55e', width: '100%' };
    return { label: 'Good', color: '#3b82f6', width: '75%' };
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to reset password.');
      }

      setIsSuccess(true);
      toast.success('Password reset successfully!');

      setTimeout(() => {
        router.push('/login');
      }, 2500);
    } catch (err) {
      toast.error(err.message || 'Something went wrong. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rp-root">
      {/* Animated gradient background */}
      <div className="animated-bg" aria-hidden="true">
        <div className="animated-bg__blob animated-bg__blob--1" />
        <div className="animated-bg__blob animated-bg__blob--2" />
        <div className="animated-bg__blob animated-bg__blob--3" />
      </div>

      <div className="rp-container">
        <AnimatePresence mode="wait">
          {tokenMissing ? (
            <motion.div
              key="missing"
              className="rp-card glass-card"
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="icon-badge icon-badge--warn">
                <ShieldCheck size={28} className="icon-badge__icon" />
              </div>
              <h1 className="rp-title">Invalid Reset Link</h1>
              <p className="rp-subtitle">
                This password reset link is missing or invalid. Please request a new one.
              </p>
              <Link href="/forgot-password" className="btn-primary-link">
                Request New Link
              </Link>
              <div className="back-link">
                <Link href="/login" className="back-anchor">
                  <ArrowLeft size={16} />
                  Back to Login
                </Link>
              </div>
            </motion.div>
          ) : !isSuccess ? (
            <motion.div
              key="form"
              className="rp-card glass-card"
              initial={{ opacity: 0, y: 32, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -24, scale: 0.97 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div
                className="icon-badge"
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.15, type: 'spring', stiffness: 260, damping: 18 }}
              >
                <KeyRound size={28} className="icon-badge__icon" />
              </motion.div>

              <motion.h1
                className="rp-title"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Reset Your Password
              </motion.h1>
              <motion.p
                className="rp-subtitle"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                Choose a strong, unique password for your account.
              </motion.p>

              <motion.form
                onSubmit={handleSubmit}
                className="rp-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {/* New Password */}
                <div className="input-group">
                  <label htmlFor="rp-password" className="input-label">
                    New Password
                  </label>
                  <div className="input-wrapper">
                    <Lock size={18} className="input-icon" />
                    <input
                      id="rp-password"
                      type={showPassword ? 'text' : 'password'}
                      className="form-input"
                      placeholder="Min 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      className="eye-btn"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>

                  {/* Strength bar */}
                  {password.length > 0 && (
                    <div className="strength-bar-wrap">
                      <div className="strength-bar-bg">
                        <motion.div
                          className="strength-bar-fill"
                          style={{ background: strength.color }}
                          animate={{ width: strength.width }}
                          transition={{ duration: 0.4 }}
                        />
                      </div>
                      <span className="strength-label" style={{ color: strength.color }}>
                        {strength.label}
                      </span>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="input-group">
                  <label htmlFor="rp-confirm" className="input-label">
                    Confirm Password
                  </label>
                  <div className="input-wrapper">
                    <Lock size={18} className="input-icon" />
                    <input
                      id="rp-confirm"
                      type={showConfirm ? 'text' : 'password'}
                      className={`form-input ${
                        confirmPassword && confirmPassword !== password
                          ? 'form-input--error'
                          : confirmPassword && confirmPassword === password
                          ? 'form-input--success'
                          : ''
                      }`}
                      placeholder="Re-enter your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      className="eye-btn"
                      onClick={() => setShowConfirm((v) => !v)}
                      aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
                    >
                      {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                  {confirmPassword && confirmPassword !== password && (
                    <p className="field-error">Passwords do not match</p>
                  )}
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
                      Resetting Password…
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={18} />
                      Reset Password
                    </>
                  )}
                </motion.button>
              </motion.form>

              <div className="back-link">
                <Link href="/login" className="back-anchor">
                  <ArrowLeft size={16} />
                  Back to Login
                </Link>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              className="rp-card glass-card"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div
                className="icon-badge icon-badge--success"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 16 }}
              >
                <CheckCircle size={32} className="icon-badge__icon" />
              </motion.div>

              <motion.h2
                className="rp-title"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                Password Reset!
              </motion.h2>
              <motion.p
                className="rp-subtitle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
              >
                Your password has been reset successfully. Redirecting you to login…
              </motion.p>

              <motion.div
                className="redirect-progress-wrap"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
              >
                <div className="redirect-bar-bg">
                  <motion.div
                    className="redirect-bar-fill"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 2.5, ease: 'linear' }}
                  />
                </div>
                <p className="redirect-hint">Redirecting to login…</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx global>{`
        .rp-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          background: #0a0a14;
          font-family: 'Inter', 'Segoe UI', sans-serif;
        }
        .animated-bg {
          position: absolute; inset: 0; z-index: 0;
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
          background: radial-gradient(circle, #1e40af 0%, #0d1e5c 100%);
          top: -120px; left: -100px;
          animation-duration: 14s;
        }
        .animated-bg__blob--2 {
          width: 420px; height: 420px;
          background: radial-gradient(circle, #6c3de8 0%, #3b1f8c 100%);
          bottom: -100px; right: -80px;
          animation-duration: 11s;
          animation-delay: -4s;
        }
        .animated-bg__blob--3 {
          width: 300px; height: 300px;
          background: radial-gradient(circle, #0ea5e9 0%, #065f88 100%);
          top: 40%; left: 55%;
          animation-duration: 16s;
          animation-delay: -8s;
        }
        @keyframes blobFloat {
          0%   { transform: translate(0, 0) scale(1); }
          50%  { transform: translate(30px, -30px) scale(1.07); }
          100% { transform: translate(-20px, 20px) scale(0.95); }
        }
        .rp-container {
          position: relative; z-index: 1;
          width: 100%; max-width: 460px;
          padding: 24px 16px;
        }
        .glass-card {
          background: rgba(255,255,255,0.06);
          backdrop-filter: blur(24px) saturate(1.6);
          -webkit-backdrop-filter: blur(24px) saturate(1.6);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 24px;
          padding: 48px 40px 40px;
          box-shadow: 0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05) inset;
        }
        .icon-badge {
          width: 64px; height: 64px;
          border-radius: 18px;
          background: linear-gradient(135deg, #1e40af 0%, #6c3de8 100%);
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 24px;
          box-shadow: 0 8px 24px rgba(30,64,175,0.45);
        }
        .icon-badge--success {
          background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%);
          box-shadow: 0 8px 24px rgba(22,163,74,0.45);
        }
        .icon-badge--warn {
          background: linear-gradient(135deg, #b45309 0%, #f59e0b 100%);
          box-shadow: 0 8px 24px rgba(180,83,9,0.45);
        }
        .icon-badge__icon { color: #fff; }
        .rp-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: #f0f0ff;
          text-align: center;
          margin: 0 0 10px;
          letter-spacing: -0.02em;
        }
        .rp-subtitle {
          font-size: 0.95rem;
          color: rgba(200,200,230,0.75);
          text-align: center;
          margin: 0 0 32px;
          line-height: 1.6;
        }
        .rp-form {
          display: flex; flex-direction: column; gap: 20px;
          margin-bottom: 24px;
        }
        .input-group { display: flex; flex-direction: column; gap: 8px; }
        .input-label {
          font-size: 0.875rem; font-weight: 500;
          color: rgba(210,210,240,0.8);
        }
        .input-wrapper {
          position: relative; display: flex; align-items: center;
        }
        .input-icon {
          position: absolute; left: 14px;
          color: rgba(99,179,237,0.7);
          pointer-events: none;
        }
        .form-input {
          width: 100%;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.14);
          border-radius: 12px;
          padding: 13px 44px 13px 44px;
          color: #f0f0ff;
          font-size: 0.95rem;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
        }
        .form-input::placeholder { color: rgba(180,180,210,0.4); }
        .form-input:focus {
          border-color: rgba(99,179,237,0.6);
          box-shadow: 0 0 0 3px rgba(99,179,237,0.15);
        }
        .form-input--error {
          border-color: rgba(239,68,68,0.7) !important;
          box-shadow: 0 0 0 3px rgba(239,68,68,0.15) !important;
        }
        .form-input--success {
          border-color: rgba(34,197,94,0.7) !important;
          box-shadow: 0 0 0 3px rgba(34,197,94,0.12) !important;
        }
        .eye-btn {
          position: absolute; right: 14px;
          background: none; border: none; cursor: pointer;
          color: rgba(180,180,210,0.5);
          display: flex; align-items: center;
          transition: color 0.2s;
          padding: 0;
        }
        .eye-btn:hover { color: rgba(180,180,210,0.9); }
        .field-error {
          font-size: 0.8rem; color: #ef4444; margin: 0;
        }
        .strength-bar-wrap {
          display: flex; align-items: center; gap: 10px; margin-top: 4px;
        }
        .strength-bar-bg {
          flex: 1; height: 4px;
          background: rgba(255,255,255,0.1);
          border-radius: 4px; overflow: hidden;
        }
        .strength-bar-fill {
          height: 100%; border-radius: 4px;
        }
        .strength-label {
          font-size: 0.78rem; font-weight: 600; min-width: 40px;
          text-align: right;
        }
        .btn-primary {
          display: flex; align-items: center; justify-content: center;
          gap: 8px;
          background: linear-gradient(135deg, #1e40af 0%, #6c3de8 100%);
          color: #fff; border: none; border-radius: 12px;
          padding: 14px 24px; font-size: 0.95rem; font-weight: 600;
          cursor: pointer; width: 100%;
          box-shadow: 0 6px 20px rgba(30,64,175,0.4);
          transition: opacity 0.2s, box-shadow 0.2s;
        }
        .btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }
        .btn-primary:not(:disabled):hover {
          box-shadow: 0 8px 28px rgba(30,64,175,0.55);
        }
        .btn-primary-link {
          display: flex; align-items: center; justify-content: center;
          background: linear-gradient(135deg, #b45309 0%, #f59e0b 100%);
          color: #fff; border-radius: 12px;
          padding: 14px 24px; font-size: 0.95rem; font-weight: 600;
          text-decoration: none; margin-bottom: 20px;
          box-shadow: 0 6px 20px rgba(180,83,9,0.35);
          transition: box-shadow 0.2s;
        }
        .btn-primary-link:hover {
          box-shadow: 0 8px 28px rgba(180,83,9,0.5);
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .btn-spinner { animation: spin 0.8s linear infinite; }
        .back-link { text-align: center; margin-top: 4px; }
        .back-anchor {
          display: inline-flex; align-items: center; gap: 6px;
          color: rgba(180,180,210,0.7); text-decoration: none;
          font-size: 0.875rem; transition: color 0.2s;
        }
        .back-anchor:hover { color: #93c5fd; }
        .redirect-progress-wrap { text-align: center; }
        .redirect-bar-bg {
          height: 4px; background: rgba(255,255,255,0.1);
          border-radius: 4px; overflow: hidden; margin-bottom: 12px;
        }
        .redirect-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #22c55e, #86efac);
          border-radius: 4px;
        }
        .redirect-hint {
          font-size: 0.875rem; color: rgba(200,200,230,0.6); margin: 0;
        }
      `}</style>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a14', color: '#fff' }}>
        Loading…
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}

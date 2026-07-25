'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Car, Bike, Mail, Lock, User, Phone, Eye, EyeOff,
  ArrowRight, ArrowLeft, Chrome, CheckCircle, Shield
} from 'lucide-react';
import { signIn } from 'next-auth/react';
import toast from 'react-hot-toast';

const STEPS = ['Account Type', 'Personal Info', 'Security'];

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    role: 'TRAVELER',
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
    referralCode: '',
  });

  const update = (key, value) => setFormData((prev) => ({ ...prev, [key]: value }));

  const validateStep = () => {
    if (step === 0 && !formData.role) return 'Please select account type';
    if (step === 1) {
      if (!formData.name.trim()) return 'Full name required';
      if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) return 'Valid email required';
    }
    if (step === 2) {
      if (!formData.password || formData.password.length < 8) return 'Password must be at least 8 characters';
      if (formData.password !== formData.confirmPassword) return 'Passwords do not match';
      if (!formData.agreeTerms) return 'Please accept the terms of service';
    }
    return null;
  };

  const handleNext = () => {
    const error = validateStep();
    if (error) { toast.error(error); return; }
    setStep((s) => s + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validateStep();
    if (error) { toast.error(error); return; }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || 'Registration failed');
        return;
      }

      toast.success('Account created! Signing you in...');

      await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      router.push(formData.role === 'RIDER' ? '/dashboard/rider' : '/dashboard/traveler');
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => signIn('google', { callbackUrl: '/dashboard/traveler' });

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--bg-base)' }}>
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl gradient-primary flex items-center justify-center">
              <Car className="w-5 h-5 text-white" />
            </div>
            <span className="font-outfit font-bold text-2xl gradient-text">RideWave</span>
          </Link>
          <h2 className="text-xl font-semibold mt-4 mb-1">Create your account</h2>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Already have one?{' '}
            <Link href="/auth/login" style={{ color: 'var(--primary)' }} className="font-medium">
              Sign in
            </Link>
          </p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all flex-shrink-0"
                style={{
                  background: i <= step ? 'var(--primary)' : 'var(--bg-surface)',
                  color: i <= step ? 'white' : 'var(--text-muted)',
                  border: `2px solid ${i <= step ? 'var(--primary)' : 'var(--border)'}`,
                }}
              >
                {i < step ? <CheckCircle className="w-4 h-4" /> : i + 1}
              </div>
              <span className="text-xs font-medium hidden sm:block" style={{ color: i === step ? 'var(--primary)' : 'var(--text-muted)' }}>
                {s}
              </span>
              {i < STEPS.length - 1 && (
                <div className="flex-1 h-px" style={{ background: i < step ? 'var(--primary)' : 'var(--border)' }} />
              )}
            </div>
          ))}
        </div>

        <div className="card-premium p-6 sm:p-8">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="step0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h3 className="text-lg font-semibold mb-6">How will you use RideWave?</h3>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {[
                    { value: 'TRAVELER', label: 'Traveler', icon: User, desc: 'Search and book rides', color: '#6366f1' },
                    { value: 'RIDER', label: 'Rider', icon: Car, desc: 'Share rides & earn money', color: '#8b5cf6' },
                  ].map(({ value, label, icon: Icon, desc, color }) => (
                    <motion.button
                      key={value}
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => update('role', value)}
                      className="p-6 rounded-2xl border-2 text-left transition-all"
                      style={{
                        borderColor: formData.role === value ? color : 'var(--border)',
                        background: formData.role === value ? `${color}10` : 'var(--bg-surface)',
                      }}
                    >
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
                        style={{ background: `${color}20` }}
                      >
                        <Icon className="w-6 h-6" style={{ color }} />
                      </div>
                      <div className="font-semibold">{label}</div>
                      <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{desc}</div>
                    </motion.button>
                  ))}
                </div>

                {/* Google Signup */}
                <button
                  type="button"
                  onClick={handleGoogleSignup}
                  className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border font-medium text-sm mb-4 transition-all hover:shadow-md"
                  style={{ borderColor: 'var(--border)', color: 'var(--text-primary)', background: 'var(--bg-elevated)' }}
                >
                  <Chrome className="w-5 h-5" style={{ color: '#4285F4' }} />
                  Sign up with Google
                </button>

                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>or with email</span>
                  <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={handleNext}
                  className="btn-primary w-full py-3"
                >
                  Continue with Email <ArrowRight className="w-4 h-4" />
                </motion.button>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h3 className="text-lg font-semibold mb-6">Personal Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                      <input
                        id="reg-name"
                        type="text"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => update('name', e.target.value)}
                        className="input-field pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                      <input
                        id="reg-email"
                        type="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) => update('email', e.target.value)}
                        className="input-field pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Phone Number <span style={{ color: 'var(--text-muted)' }}>(optional)</span></label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                      <input
                        type="tel"
                        placeholder="+92 300 000 0000"
                        value={formData.phone}
                        onChange={(e) => update('phone', e.target.value)}
                        className="input-field pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Referral Code <span style={{ color: 'var(--text-muted)' }}>(optional)</span></label>
                    <input
                      type="text"
                      placeholder="Enter referral code"
                      value={formData.referralCode}
                      onChange={(e) => update('referralCode', e.target.value.toUpperCase())}
                      className="input-field"
                      maxLength={8}
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button type="button" onClick={() => setStep(0)} className="btn-ghost flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={handleNext}
                    className="btn-primary flex-1 py-3"
                  >
                    Continue <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h3 className="text-lg font-semibold mb-6">Create Password</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                      <input
                        id="reg-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Min 8 characters"
                        value={formData.password}
                        onChange={(e) => update('password', e.target.value)}
                        className="input-field pl-10 pr-10"
                        required
                        minLength={8}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {/* Password strength */}
                    {formData.password && (
                      <div className="flex gap-1 mt-2">
                        {[...Array(4)].map((_, i) => (
                          <div
                            key={i}
                            className="flex-1 h-1 rounded-full transition-all"
                            style={{
                              background: formData.password.length > i * 3
                                ? ['#ef4444','#f59e0b','#10b981','#6366f1'][Math.min(Math.floor(formData.password.length / 3) - 1, 3)]
                                : 'var(--border)'
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                      <input
                        type="password"
                        placeholder="Repeat password"
                        value={formData.confirmPassword}
                        onChange={(e) => update('confirmPassword', e.target.value)}
                        className="input-field pl-10"
                        required
                      />
                      {formData.confirmPassword && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          {formData.password === formData.confirmPassword
                            ? <CheckCircle className="w-4 h-4" style={{ color: 'var(--success)' }} />
                            : <div className="w-4 h-4 rounded-full" style={{ background: 'var(--danger)' }} />
                          }
                        </div>
                      )}
                    </div>
                  </div>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.agreeTerms}
                      onChange={(e) => update('agreeTerms', e.target.checked)}
                      className="mt-1"
                    />
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      I agree to the{' '}
                      <Link href="/terms" style={{ color: 'var(--primary)' }}>Terms of Service</Link>
                      {' '}and{' '}
                      <Link href="/privacy" style={{ color: 'var(--primary)' }}>Privacy Policy</Link>
                    </span>
                  </label>

                  <div className="flex gap-3 mt-6">
                    <button type="button" onClick={() => setStep(1)} className="btn-ghost flex items-center gap-2">
                      <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={loading}
                      className="btn-primary flex-1 py-3"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Creating account...
                        </span>
                      ) : (
                        <>Create Account <Shield className="w-4 h-4" /></>
                      )}
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

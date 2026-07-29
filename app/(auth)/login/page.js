'use client';

import { useState, Suspense } from 'react';
import { getSession, signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Car, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { getDashboardPath, isAuthorizedForPath, normalizeRole } from '@/lib/auth-redirects';

const GoogleIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
  </svg>
);

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedCallback = searchParams.get('callbackUrl');
  const callbackUrl = requestedCallback && (requestedCallback.startsWith('/dashboard') || requestedCallback.startsWith('/profile') || requestedCallback.startsWith('/settings'))
    ? requestedCallback
    : null;

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error(result.error);
      } else {
        const session = await getSession();
        const role = normalizeRole(session?.user?.role);
        const targetPath = callbackUrl && isAuthorizedForPath(role, callbackUrl)
          ? callbackUrl
          : getDashboardPath(role);

        toast.success('Welcome back!');
        router.push(targetPath);
        router.refresh();
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      await signIn('google', { callbackUrl: '/dashboard' });
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-1/2 animated-bg items-center justify-center p-12 relative overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-10"
            style={{
              width: 100 + i * 80,
              height: 100 + i * 80,
              border: '1px solid var(--primary)',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 10 + i * 5, repeat: Infinity, ease: 'linear' }}
          />
        ))}

        <div className="text-center text-white z-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.8 }}
            className="w-20 h-20 rounded-3xl gradient-primary flex items-center justify-center mx-auto mb-8 shadow-2xl"
          >
            <Car className="w-10 h-10 text-white" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-outfit font-bold mb-4"
          >
            Welcome to RideWave
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{ color: 'rgba(255,255,255,0.7)' }}
            className="text-lg max-w-xs mx-auto"
          >
            Your premium AI-powered ride-sharing platform. Travel smarter, arrive safer.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="grid grid-cols-3 gap-6 mt-12"
          >
            {[
              { value: '85K+', label: 'Travelers' },
              { value: '4.9★', label: 'Rating' },
              { value: '50K+', label: 'Rides' },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-2xl font-bold">{value}</div>
                <div className="text-xs opacity-60">{label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6" style={{ background: 'var(--bg-base)' }}>
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Logo (mobile) */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
              <Car className="w-5 h-5 text-white" />
            </div>
            <span className="font-outfit font-bold text-xl gradient-text">RideWave</span>
          </div>

          <h2 className="text-2xl font-outfit font-bold mb-2">Sign in to your account</h2>
          <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
            Don't have an account?{' '}
            <Link href="/register" className="font-medium" style={{ color: 'var(--primary)' }}>
              Create one free
            </Link>
          </p>

          {/* Google Login */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border font-medium text-sm mb-6 transition-all hover:shadow-md"
            style={{ borderColor: 'var(--border)', color: 'var(--text-primary)', background: 'var(--bg-elevated)' }}
          >
            <Chrome className="w-5 h-5" style={{ color: '#4285F4' }} />
            {googleLoading ? 'Connecting...' : 'Continue with Google'}
          </motion.button>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
            <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>OR</span>
            <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                <input
                  id="login-email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-field pl-10"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Password</label>
                <Link href="/forgot-password" className="text-xs" style={{ color: 'var(--primary)' }}>
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="input-field pl-10 pr-10"
                  required
                  autoComplete="current-password"
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
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-base"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                <>Sign In <ArrowRight className="w-4 h-4" /></>
              )}
            </motion.button>
          </form>

          {/* Demo accounts hint */}
          <div className="mt-6 p-4 rounded-xl text-xs" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
            <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>🔑 Demo Accounts:</p>
            <p style={{ color: 'var(--text-muted)' }}>Traveler: traveler@demo.com / Password123</p>
            <p style={{ color: 'var(--text-muted)' }}>Rider: rider@demo.com / Password123</p>
            <p style={{ color: 'var(--text-muted)' }}>Admin: admin@demo.com / Password123</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-200">
        <div className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}

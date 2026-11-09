'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Shield, Lock, Mail, Eye, EyeOff, AlertCircle, Loader2, ArrowRight } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/admin/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [rateLimitSeconds, setRateLimitSeconds] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password) {
      setErrorMessage('Please enter both admin email and password.');
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 429) {
          setRateLimitSeconds(data.retryAfter || 60);
          setErrorMessage(data.message || 'Rate limit exceeded. Please wait.');
        } else {
          setErrorMessage(data.message || 'Invalid administrator credentials');
        }
        return;
      }

      // Success -> navigate to dashboard
      router.push(callbackUrl);
      router.refresh();
    } catch (err) {
      console.error('Login error:', err);
      setErrorMessage('Network connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#071713] relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-emerald-600/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-[#C6A76B]/10 blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="rounded-3xl border border-emerald-900/60 bg-[#0c241e]/90 p-8 shadow-2xl backdrop-blur-xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#173F35] to-[#C6A76B] text-white shadow-lg shadow-black/40 mb-4 border border-[#C6A76B]/30">
              <Shield className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold font-outfit text-white tracking-tight">RideWave Control Center</h1>
            <p className="mt-1 text-xs text-slate-400">Restricted Administrator Authentication Gateway</p>
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-rose-500/30 bg-rose-950/40 p-4 text-xs text-rose-200 animate-fadeIn">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold">{errorMessage}</p>
                {rateLimitSeconds > 0 && (
                  <p className="mt-1 text-rose-300">Wait {rateLimitSeconds}s before retrying.</p>
                )}
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Administrator Email
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  type="email"
                  required
                  autoFocus
                  autoComplete="username"
                  placeholder="admin@ridewave.local"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-emerald-900/60 bg-[#071713]/80 pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 transition-all focus:border-[#C6A76B] focus:bg-[#071713] focus:outline-hidden focus:ring-2 focus:ring-[#C6A76B]/20"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-emerald-900/60 bg-[#071713]/80 pl-10 pr-11 py-2.5 text-sm text-slate-100 placeholder-slate-500 transition-all focus:border-[#C6A76B] focus:bg-[#071713] focus:outline-hidden focus:ring-2 focus:ring-[#C6A76B]/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 p-1 text-slate-400 hover:text-slate-200 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || rateLimitSeconds > 0}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-[#C6A76B] py-3 px-4 text-sm font-semibold text-white shadow-lg shadow-emerald-900/40 hover:from-emerald-500 hover:to-[#d4b579] focus:outline-hidden focus:ring-2 focus:ring-[#C6A76B]/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Authenticate Session</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer note */}
          <div className="mt-8 pt-6 border-t border-emerald-900/40 text-center">
            <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
              <span>Environment Security Enforced</span>
              <span>•</span>
              <Link href="/" className="text-emerald-400 hover:underline">
                Back to RideWave
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


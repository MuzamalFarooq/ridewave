import React from 'react';
import {
  Settings,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  Server,
  Lock,
  Database,
  Key,
} from 'lucide-react';
import { getAdminConfig } from '@/lib/auth-security';

export const metadata = {
  title: 'System Settings & Security — RideWave Admin',
};

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  const { isConfigured } = getAdminConfig();

  // Safely check presence of env configuration without reading secret values
  const envStatuses = [
    {
      name: 'ADMIN_EMAIL',
      description: 'Environment administrator identifier',
      configured: Boolean(process.env.ADMIN_EMAIL),
      critical: true,
    },
    {
      name: 'ADMIN_PASSWORD',
      description: 'Environment administrator credential',
      configured: Boolean(process.env.ADMIN_PASSWORD),
      critical: true,
    },
    {
      name: 'ADMIN_JWT_SECRET / AUTH_SECRET',
      description: 'Cryptographic HMAC signing key for sessions',
      configured: Boolean(process.env.ADMIN_JWT_SECRET || process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET),
      critical: true,
    },
    {
      name: 'DATABASE_URL',
      description: 'MongoDB database connection string',
      configured: Boolean(process.env.DATABASE_URL),
      critical: true,
    },
    {
      name: 'STRIPE_SECRET_KEY',
      description: 'Stripe payment processor integration',
      configured: Boolean(process.env.STRIPE_SECRET_KEY),
      critical: false,
    },
    {
      name: 'NEXT_PUBLIC_GOOGLE_MAPS_API_KEY',
      description: 'Google Maps JavaScript API key for location tracking',
      configured: Boolean(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY),
      critical: false,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-outfit text-slate-900 dark:text-white flex items-center gap-2.5">
          <Settings className="h-6 w-6 text-emerald-500" />
          <span>System Settings & Security Diagnostics</span>
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Verify runtime environment credentials, inspect security boundaries, and monitor cryptographic policies.
        </p>
      </div>

      {/* Security Health Summary */}
      <div className="rounded-3xl border border-slate-200 dark:border-emerald-950/60 bg-white dark:bg-[#0c241e] p-6 shadow-md">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Admin Security Status</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isConfigured
                ? 'Environment administrator credentials are fully provisioned and protected.'
                : 'Warning: Environment credentials need configuration.'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-emerald-950/40 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-emerald-950/40">
            <span className="font-semibold text-slate-400 uppercase text-[10px]">Session Token Protocol</span>
            <p className="font-bold text-slate-900 dark:text-white mt-1">HMAC-SHA256 (Web Crypto)</p>
            <p className="text-[11px] text-slate-500 mt-0.5">8-Hour Sliding Expiry • HttpOnly • Lax</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-emerald-950/40">
            <span className="font-semibold text-slate-400 uppercase text-[10px]">Brute-Force Protection</span>
            <p className="font-bold text-emerald-600 dark:text-emerald-400 mt-1">Sliding Window Active</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Max 5 attempts / 15 minutes</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-emerald-950/40">
            <span className="font-semibold text-slate-400 uppercase text-[10px]">Password Comparison</span>
            <p className="font-bold text-emerald-600 dark:text-emerald-400 mt-1">Constant-Time Safe</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Zero length leak & timing-safe</p>
          </div>
        </div>
      </div>

      {/* Environment Variable Audit Table */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-md dark:border-emerald-950/60 dark:bg-[#0c241e]">
        <div className="p-6 border-b border-slate-100 dark:border-emerald-950/60">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Key className="h-4.5 w-4.5 text-[#C6A76B]" />
            <span>Environment Variables Provisioning Health</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Values are kept strictly confidential. Only boolean configuration presence is displayed.
          </p>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-emerald-950/40 text-xs">
          {envStatuses.map((item, idx) => (
            <div key={idx} className="p-4 flex items-center justify-between gap-4">
              <div>
                <p className="font-mono font-bold text-slate-900 dark:text-white">{item.name}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{item.description}</p>
              </div>
              <div className="flex items-center gap-2">
                {item.configured ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
                    <CheckCircle className="h-3.5 w-3.5" />
                    <span>Configured</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    <span>{item.critical ? 'Missing (Required)' : 'Unset'}</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


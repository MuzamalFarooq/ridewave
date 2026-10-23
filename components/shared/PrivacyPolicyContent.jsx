'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Shield, Lock, MapPin, Users, CreditCard, FileText, CheckCircle2,
  AlertCircle, Eye, Trash2, Mail, Phone, Calendar, ArrowRight,
  ExternalLink, Sparkles, Database, Server, Smartphone, Globe
} from 'lucide-react';

const SECTIONS = [
  { id: 'introduction', title: '1. Introduction & Services', icon: Shield },
  { id: 'data-collected', title: '2. Information We Collect', icon: FileText },
  { id: 'authentication', title: '3. Registration & Authentication', icon: Lock },
  { id: 'google-data', title: '4. Google Sign-In & User Data', icon: Globe },
  { id: 'location-maps', title: '5. GPS Location & Google Maps', icon: MapPin },
  { id: 'rides-vehicles', title: '6. Rider, Vehicle & Booking Data', icon: Users },
  { id: 'data-usage-security', title: '7. Data Usage & Security', icon: Server },
  { id: 'third-parties', title: '8. Third-Party Service Providers', icon: Database },
  { id: 'retention-deletion', title: '9. Retention & Account Deletion', icon: Trash2 },
  { id: 'privacy-rights', title: '10. Your Privacy Rights', icon: CheckCircle2 },
  { id: 'children-privacy', title: '11. Children\'s Privacy', icon: AlertCircle },
  { id: 'updates-contact', title: '12. Updates & Contact Info', icon: Mail },
];

export default function PrivacyPolicyContent() {
  const [activeSection, setActiveSection] = useState('introduction');

  const scrollTo = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -90;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">
      {/* Hero Header */}
      <div className="relative overflow-hidden py-20 sm:py-24 border-b border-[var(--border)] bg-[var(--bg-surface)]">
        <div className="absolute inset-0 bg-gradient-to-b from-teal-500/5 via-indigo-500/5 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-600 dark:text-teal-400 text-xs font-semibold mb-6">
            <Shield className="w-3.5 h-3.5" />
            <span>Official Legal & Privacy Transparency Notice</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-outfit font-extrabold tracking-tight text-[var(--text-primary)] mb-6">
            RideWave <span className="gradient-text">Privacy Policy</span>
          </h1>
          <p className="max-w-3xl mx-auto text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed mb-6">
            Your trust and privacy are paramount to RideWave. This comprehensive policy explains how we collect, use,
            protect, share, retain, and delete your personal information across our ride-sharing and carpooling platform.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm text-[var(--text-muted)]">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-teal-500" />
              Effective Date: <strong>January 1, 2025</strong>
            </span>
            <span className="text-slate-400">•</span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              Last Updated: <strong>October 24, 2026</strong>
            </span>
            <span className="text-slate-400">•</span>
            <span className="flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-emerald-500" />
              Canonical URL: <strong>https://ridewave.muzamal.site/app/privacy</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Main Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-4 xl:col-span-3">
            <div className="sticky top-24 space-y-4">
              <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)] shadow-sm">
                <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-3 px-2">
                  Table of Contents
                </h2>
                <nav className="space-y-1">
                  {SECTIONS.map(({ id, title, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => scrollTo(id)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-xl text-left transition-all ${
                        activeSection === id
                          ? 'bg-teal-500 text-white shadow-md'
                          : 'text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="truncate">{title}</span>
                    </button>
                  ))}
                </nav>
              </div>

              {/* Quick Contact Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-teal-500/10 via-transparent to-indigo-500/10 border border-teal-500/20 text-xs text-[var(--text-secondary)] space-y-2">
                <p className="font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-teal-500" /> Need Privacy Support?
                </p>
                <p>Have questions about your data or wish to submit an erasure request?</p>
                <a
                  href="mailto:muzamalfarooq111@gmail.com"
                  className="inline-flex items-center gap-1 text-teal-600 dark:text-teal-400 font-semibold hover:underline"
                >
                  muzamalfarooq111@gmail.com <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </aside>

          {/* Content Column */}
          <main className="lg:col-span-8 xl:col-span-9 space-y-12">

            {/* 1. Introduction */}
            <section id="introduction" className="p-6 sm:p-8 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)] scroll-mt-24 space-y-4 shadow-sm">
              <div className="flex items-center gap-3 border-b border-[var(--border)] pb-4">
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">Section 1</span>
                  <h2 className="text-2xl font-outfit font-bold text-[var(--text-primary)]">Introduction and RideWave Services</h2>
                </div>
              </div>
              <p className="leading-relaxed text-[var(--text-secondary)]">
                Welcome to <strong>RideWave</strong> (accessible at <a href="https://ridewave.muzamal.site" className="text-teal-600 dark:text-teal-400 underline">https://ridewave.muzamal.site</a>), operated by <strong>RideWave Technologies</strong> (&ldquo;RideWave&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;). RideWave is an AI-powered ride-booking, intercity carpooling, and urban mobility marketplace connecting independent drivers (&ldquo;Riders&rdquo; or &ldquo;Captains&rdquo;) who have empty vehicle seats with verified travelers (&ldquo;Travelers&rdquo; or &ldquo;Passengers&rdquo;) traveling along matching routes.
              </p>
              <p className="leading-relaxed text-[var(--text-secondary)]">
                This Privacy Policy describes our practices regarding the collection, storage, use, disclosure, retention, and deletion of personal data when you access or interact with our web application, APIs, customer support, and related mobility services (collectively, the &ldquo;Platform&rdquo;).
              </p>
              <div className="p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)]">
                <p className="text-sm font-semibold text-[var(--text-primary)] mb-1">Our Core Commitment:</p>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
                  We believe in complete transparency. We never sell your personal data or Google account information to data brokers or third-party advertising networks. Data collected is strictly used to deliver, secure, and improve your transportation experience.
                </p>
              </div>
            </section>

            {/* 2. Personal Information Collected */}
            <section id="data-collected" className="p-6 sm:p-8 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)] scroll-mt-24 space-y-4 shadow-sm">
              <div className="flex items-center gap-3 border-b border-[var(--border)] pb-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Section 2</span>
                  <h2 className="text-2xl font-outfit font-bold text-[var(--text-primary)]">Personal Information We Collect</h2>
                </div>
              </div>
              <p className="leading-relaxed text-[var(--text-secondary)]">
                Depending on how you use RideWave (as a Traveler seeking a ride, a Driver offering rides, or a visitor browsing routes), we collect the following categories of personal information:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] space-y-2">
                  <h3 className="font-bold text-sm text-[var(--text-primary)] flex items-center gap-2">
                    <Users className="w-4 h-4 text-teal-500" /> Profile & Identity Data
                  </h3>
                  <ul className="text-xs text-[var(--text-secondary)] space-y-1.5 list-disc list-inside">
                    <li>Full Name and Display Name</li>
                    <li>Email Address and Email Verification Status</li>
                    <li>Phone Number</li>
                    <li>Profile Picture / Avatar URL</li>
                    <li>Date of Birth, Gender, Address, City & Country</li>
                    <li>Emergency Contact details (Name, Phone Number, Email)</li>
                    <li>Travel Preferences & Languages spoken</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] space-y-2">
                  <h3 className="font-bold text-sm text-[var(--text-primary)] flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-indigo-500" /> Driver & Vehicle Data
                  </h3>
                  <ul className="text-xs text-[var(--text-secondary)] space-y-1.5 list-disc list-inside">
                    <li>Government ID (CNIC/National ID) and Driving License numbers</li>
                    <li>Document Scans (ID front/back, selfie, driving license photo)</li>
                    <li>Vehicle Make, Model, Year, Registration Number, and Color</li>
                    <li>Vehicle Type (Car, Bike, Van, Bus), Fuel Type, Transmission</li>
                    <li>Total Passenger Seat Capacity and Vehicle Photos</li>
                    <li>Insurance Registration details</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] space-y-2">
                  <h3 className="font-bold text-sm text-[var(--text-primary)] flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-500" /> Trip, Route & Telemetry Data
                  </h3>
                  <ul className="text-xs text-[var(--text-secondary)] space-y-1.5 list-disc list-inside">
                    <li>Pickup Address, Destination Address, and intermediate stops</li>
                    <li>Precise GPS Coordinates (Latitude and Longitude)</li>
                    <li>Real-time driver GPS tracking (speed, heading, accuracy, timestamps)</li>
                    <li>Departure Date, Time, Distance (km), and Estimated Travel Duration</li>
                    <li>Seat reservation counts and customized pickup notes</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] space-y-2">
                  <h3 className="font-bold text-sm text-[var(--text-primary)] flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-purple-500" /> Financial & Transaction Data
                  </h3>
                  <ul className="text-xs text-[var(--text-secondary)] space-y-1.5 list-disc list-inside">
                    <li>Transaction references, invoice URLs, and payment amounts</li>
                    <li>Payment Methods (Stripe Card, JazzCash, EasyPaisa, Cash, Wallet)</li>
                    <li>Promotional discount codes and referral credits</li>
                    <li><em>Note:</em> Raw card numbers and CVCs are processed by Stripe; RideWave never stores credit card credentials.</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 3. Account Registration & Authentication */}
            <section id="authentication" className="p-6 sm:p-8 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)] scroll-mt-24 space-y-4 shadow-sm">
              <div className="flex items-center gap-3 border-b border-[var(--border)] pb-4">
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">Section 3</span>
                  <h2 className="text-2xl font-outfit font-bold text-[var(--text-primary)]">Account Registration & Authentication</h2>
                </div>
              </div>
              <p className="leading-relaxed text-[var(--text-secondary)]">
                RideWave supports two secure methods for account creation and authentication via NextAuth.js:
              </p>
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)]">
                  <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-1">1. Email & Password Authentication</h3>
                  <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
                    Users may register with their email address and a self-selected password. All passwords are salted and hashed using industry-standard <strong>bcrypt</strong> (10+ salt rounds) before database storage. Plaintext passwords are never logged, never stored, and cannot be viewed by RideWave staff.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)]">
                  <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-1">2. Google Sign-In (OAuth 2.0 Single Sign-On)</h3>
                  <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
                    Users can sign in seamlessly using their existing Google Account. When you select Google Sign-In, Google handles password validation and returns an authorized OAuth token. No Google password is ever exposed to or collected by RideWave.
                  </p>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
                User sessions are maintained through encrypted JSON Web Tokens (JWT) signed with a high-entropy secret key and transmitted over HTTPS-only cookies.
              </p>
            </section>

            {/* 4. Google Sign-In and Google User Data (CRITICAL GOOGLE OAUTH SECTION) */}
            <section id="google-data" className="p-6 sm:p-8 rounded-2xl bg-[var(--bg-surface)] border-2 border-teal-500/30 scroll-mt-24 space-y-5 shadow-md">
              <div className="flex items-center gap-3 border-b border-[var(--border)] pb-4">
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">Section 4 (Google Cloud Verification)</span>
                  <h2 className="text-2xl font-outfit font-bold text-[var(--text-primary)]">Google Sign-In and Google User Data</h2>
                </div>
              </div>
              
              <div className="p-4 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-900 dark:text-teal-200 text-xs sm:text-sm space-y-1.5">
                <p className="font-bold flex items-center gap-2 text-teal-700 dark:text-teal-300">
                  <CheckCircle2 className="w-4 h-4" /> Compliance with Google API Services User Data Policy
                </p>
                <p>
                  RideWave complies strictly with Google&apos;s verification and disclosure requirements for apps using Google OAuth 2.0. This section explicitly documents how Google user data is accessed, utilized, stored, shared, retained, and deleted.
                </p>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-[var(--text-secondary)]">
                <div>
                  <h3 className="font-bold text-[var(--text-primary)] mb-1">A. What Google Data We Access</h3>
                  <p className="leading-relaxed">
                    When you choose to register or log in to RideWave using Google Sign-In, we request access only to your basic Google profile identity (via standard OAuth openid, email, and profile scopes). Specifically, we receive:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1 pl-2">
                    <li><strong>Google Account Email Address:</strong> Used to uniquely identify and link your account.</li>
                    <li><strong>Full Name / Display Name:</strong> Used to personalize your profile and display your name to fellow travelers or drivers on confirmed rides.</li>
                    <li><strong>Profile Picture URL:</strong> Used as your initial public avatar on RideWave.</li>
                    <li><strong>Google Provider Subject ID (<code className="px-1 py-0.5 rounded bg-[var(--bg-elevated)] text-[var(--text-primary)] font-mono">sub</code>):</strong> A unique numeric identifier returned by Google to verify authentication across sessions.</li>
                  </ul>
                  <p className="mt-2 text-[var(--text-muted)] italic">
                    We do NOT request access to Google Drive, Gmail, Google Contacts, Google Calendar, or any sensitive or restricted scopes.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-[var(--text-primary)] mb-1">B. How We Use Google User Data</h3>
                  <p className="leading-relaxed">
                    Data received from Google Sign-In is used exclusively to:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1 pl-2">
                    <li>Authenticate your identity and grant access to your account without requiring a separate password.</li>
                    <li>Create your verified user profile and assign your platform role (default: Traveler).</li>
                    <li>Send you essential booking receipts, driver arrival alerts, and security notifications via email.</li>
                    <li>Display your first name and profile photo to confirmed co-passengers and drivers for boarding verification.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-[var(--text-primary)] mb-1">C. How Google User Data Is Stored & Protected</h3>
                  <p className="leading-relaxed">
                    Google profile data is stored in our secured MongoDB cluster hosted within isolated virtual private cloud (VPC) subnets. Data is encrypted in transit using TLS 1.3 and encrypted at rest using AES-256 encryption. Access to database instances is strictly restricted to authorized production processes.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-[var(--text-primary)] mb-1">D. Sharing & Transfer of Google Data</h3>
                  <p className="leading-relaxed">
                    <strong>Zero Third-Party Advertising Sharing:</strong> We do NOT share, transfer, or disclose Google user data to data brokers, third-party advertisers, market researchers, or advertising networks under any circumstances.
                  </p>
                  <p className="mt-1 leading-relaxed">
                    Google user data is shared solely with other registered users on RideWave to the minimal extent necessary to coordinate rides (e.g., displaying a driver&apos;s photo to a traveler waiting at a pickup stop).
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-[var(--text-primary)] mb-1">E. Retention & Deletion of Google Data</h3>
                  <p className="leading-relaxed">
                    We retain Google user data only for as long as your RideWave account remains active. You may delete your account and all associated Google user data at any time by visiting your Account Settings or emailing <a href="mailto:muzamalfarooq111@gmail.com" className="text-teal-600 dark:text-teal-400 underline font-semibold">muzamalfarooq111@gmail.com</a>. Upon account deletion, all Google-derived identifiers, emails, names, and avatar references are permanently erased from our active databases within thirty (30) days.
                  </p>
                </div>

                {/* LIMITED USE CLAUSE */}
                <div className="p-4 rounded-xl bg-[var(--bg-elevated)] border-l-4 border-teal-500 space-y-2">
                  <h4 className="font-bold text-sm text-[var(--text-primary)]">Google API Services User Data Policy: Limited Use Disclosure</h4>
                  <p className="text-xs leading-relaxed text-[var(--text-secondary)]">
                    RideWave&apos;s use and transfer to any other app of information received from Google APIs will adhere to the{' '}
                    <a
                      href="https://developers.google.com/terms/api-services-user-data-policy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-600 dark:text-teal-400 font-semibold underline inline-flex items-center gap-1"
                    >
                      Google API Services User Data Policy <ExternalLink className="w-3 h-3" />
                    </a>
                    , including the <strong>Limited Use</strong> requirements.
                  </p>
                </div>
              </div>
            </section>

            {/* 5. GPS Location and Google Maps */}
            <section id="location-maps" className="p-6 sm:p-8 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)] scroll-mt-24 space-y-4 shadow-sm">
              <div className="flex items-center gap-3 border-b border-[var(--border)] pb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Section 5</span>
                  <h2 className="text-2xl font-outfit font-bold text-[var(--text-primary)]">GPS Location and Google Maps Platform</h2>
                </div>
              </div>
              <p className="leading-relaxed text-[var(--text-secondary)]">
                Accurate location information is essential for ride-sharing. We integrate the official <strong>Google Maps JavaScript API, Google Places Autocomplete API, and Distance Matrix API</strong> to deliver map features:
              </p>
              <div className="space-y-3 text-xs sm:text-sm text-[var(--text-secondary)]">
                <div className="p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] space-y-1.5">
                  <h3 className="font-semibold text-sm text-[var(--text-primary)]">1. Traveler Location Collection</h3>
                  <p>
                    When a passenger searches for a ride or sets a pickup point using our interactive map or Places autocomplete, we collect approximate or precise latitude and longitude coordinates. This data is used solely to match you with drivers traveling along your route and compute pickup walking distances.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] space-y-1.5">
                  <h3 className="font-semibold text-sm text-[var(--text-primary)]">2. Real-Time Driver GPS Tracking</h3>
                  <p>
                    When a driver begins an active ride, the RideWave application collects device GPS coordinates, heading, speed, and accuracy via the browser/device Geolocation API (<code className="px-1 py-0.5 rounded bg-[var(--bg-base)] font-mono">navigator.geolocation.watchPosition</code>). These updates are transmitted over encrypted WebSockets (<code className="px-1 py-0.5 rounded bg-[var(--bg-base)] font-mono">location:update</code>) and broadcast exclusively to confirmed passengers on that specific ride via <code className="px-1 py-0.5 rounded bg-[var(--bg-base)] font-mono">ride:&#123;rideId&#125;</code> rooms.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] space-y-1.5">
                  <h3 className="font-semibold text-sm text-[var(--text-primary)]">3. User Permission & Control</h3>
                  <p>
                    Location access always requires your prior consent via standard device/browser permission dialogues. You can disable location tracking at any time in your device settings. Real-time driver GPS tracking automatically terminates the moment a ride is marked as completed or cancelled.
                  </p>
                </div>
              </div>
              <p className="text-xs text-[var(--text-muted)]">
                By using Google Maps within RideWave, you are also bound by the{' '}
                <a
                  href="https://maps.google.com/help/terms_maps.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-600 dark:text-teal-400 underline"
                >
                  Google Maps/Google Earth Additional Terms of Service
                </a>{' '}
                and the{' '}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-600 dark:text-teal-400 underline"
                >
                  Google Privacy Policy
                </a>.
              </p>
            </section>

            {/* 6. Rider, Vehicle & Booking Information */}
            <section id="rides-vehicles" className="p-6 sm:p-8 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)] scroll-mt-24 space-y-4 shadow-sm">
              <div className="flex items-center gap-3 border-b border-[var(--border)] pb-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">Section 6</span>
                  <h2 className="text-2xl font-outfit font-bold text-[var(--text-primary)]">Rider, Driver, Vehicle & Booking Data</h2>
                </div>
              </div>
              <p className="leading-relaxed text-[var(--text-secondary)]">
                To maintain platform safety, prevent fraud, and verify identity:
              </p>
              <ul className="text-xs sm:text-sm text-[var(--text-secondary)] space-y-2 list-disc list-inside pl-2">
                <li><strong>Driver Verification:</strong> Drivers must submit identity documentation (CNIC, driving license, vehicle photos) for review before publishing rides. Verification documents are stored in private Cloudinary media buckets and accessed solely by authorized trust &amp; safety personnel.</li>
                <li><strong>Vehicle Information:</strong> Make, model, year, registration number, and seat capacity are displayed publicly on published rides so passengers can locate their designated vehicle safely.</li>
                <li><strong>Booking Passes &amp; QR Codes:</strong> Each confirmed booking generates a unique reference number (<code className="px-1 py-0.5 rounded bg-[var(--bg-elevated)] font-mono">bookingRef</code>) and an encrypted boarding QR code scanned by the driver upon passenger pickup.</li>
                <li><strong>Reviews &amp; Ratings:</strong> Following ride completion, travelers and drivers may submit 1-to-5 star ratings and reviews. Reviews are displayed publicly on user profiles to build community accountability.</li>
              </ul>
            </section>

            {/* 7. Data Usage, Storage & Security */}
            <section id="data-usage-security" className="p-6 sm:p-8 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)] scroll-mt-24 space-y-4 shadow-sm">
              <div className="flex items-center gap-3 border-b border-[var(--border)] pb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <Server className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Section 7</span>
                  <h2 className="text-2xl font-outfit font-bold text-[var(--text-primary)]">Data Usage, Storage & Security</h2>
                </div>
              </div>
              <p className="leading-relaxed text-[var(--text-secondary)]">
                We implement comprehensive technical, operational, and organizational security measures to protect your information against unauthorized access, destruction, loss, or alteration:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] space-y-1.5">
                  <h3 className="font-semibold text-sm text-[var(--text-primary)] flex items-center gap-1.5">
                    <Lock className="w-4 h-4 text-teal-500" /> Cryptographic Safeguards
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)]">
                    All web communication is encrypted using Transport Layer Security (TLS 1.2 / TLS 1.3). Database collections are protected by AES-256 encryption at rest. Passwords use bcrypt hashing with salted rounds.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] space-y-1.5">
                  <h3 className="font-semibold text-sm text-[var(--text-primary)] flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-indigo-500" /> Access Controls & Boundaries
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Role-Based Access Control (RBAC) separates administrative permissions from general user access. Strict server-side route guards verify JWT session validity before executing any database mutation.
                  </p>
                </div>
              </div>
            </section>

            {/* 8. Third-Party Service Providers */}
            <section id="third-parties" className="p-6 sm:p-8 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)] scroll-mt-24 space-y-4 shadow-sm">
              <div className="flex items-center gap-3 border-b border-[var(--border)] pb-4">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider">Section 8</span>
                  <h2 className="text-2xl font-outfit font-bold text-[var(--text-primary)]">Third-Party Service Providers</h2>
                </div>
              </div>
              <p className="leading-relaxed text-[var(--text-secondary)]">
                We partner with trusted third-party cloud infrastructure providers who process data on our behalf under strict confidentiality agreements:
              </p>
              <div className="divide-y divide-[var(--border)] text-xs sm:text-sm">
                <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <strong className="text-[var(--text-primary)]">Google Cloud Platform &amp; Google Maps APIs</strong>
                    <p className="text-xs text-[var(--text-secondary)]">OAuth single sign-on authentication, geolocation, mapping, route planning, Places autocomplete.</p>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 font-medium shrink-0">Authentication &amp; Maps</span>
                </div>
                <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <strong className="text-[var(--text-primary)]">Stripe Inc.</strong>
                    <p className="text-xs text-[var(--text-secondary)]">Secure payment gateway processing credit/debit card transactions under PCI-DSS Level 1 compliance.</p>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 font-medium shrink-0">Payment Processing</span>
                </div>
                <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <strong className="text-[var(--text-primary)]">Cloudinary Ltd.</strong>
                    <p className="text-xs text-[var(--text-secondary)]">Encrypted media asset storage and content delivery network (CDN) for avatars and vehicle photos.</p>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium shrink-0">Media Storage</span>
                </div>
                <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <strong className="text-[var(--text-primary)]">MongoDB Atlas</strong>
                    <p className="text-xs text-[var(--text-secondary)]">Enterprise cloud database hosting user accounts, ride reservations, and platform data.</p>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium shrink-0">Database Provider</span>
                </div>
                <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <strong className="text-[var(--text-primary)]">Nodemailer / SMTP Provider</strong>
                    <p className="text-xs text-[var(--text-secondary)]">Automated dispatch of transactional email receipts, ride reminders, and password resets.</p>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-slate-500/10 text-slate-600 dark:text-slate-400 font-medium shrink-0">Transactional Email</span>
                </div>
              </div>
            </section>

            {/* 9. Data Retention and Deletion */}
            <section id="retention-deletion" className="p-6 sm:p-8 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)] scroll-mt-24 space-y-4 shadow-sm">
              <div className="flex items-center gap-3 border-b border-[var(--border)] pb-4">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">Section 9</span>
                  <h2 className="text-2xl font-outfit font-bold text-[var(--text-primary)]">Data Retention & Account Deletion</h2>
                </div>
              </div>
              <p className="leading-relaxed text-[var(--text-secondary)]">
                We retain your personal data only for as long as necessary to provide RideWave services, comply with legal obligations (such as tax, accounting, and transport safety regulations), and resolve platform disputes.
              </p>
              <div className="p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] space-y-3">
                <h3 className="font-bold text-sm text-[var(--text-primary)]">How to Request Full Account &amp; Data Deletion:</h3>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
                  You have the right to request the permanent deletion of your RideWave account and all associated personal data (including Google OAuth tokens, vehicle documents, profile photos, and trip history). You can exercise this right through:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3 rounded-lg bg-[var(--bg-surface)] border border-[var(--border)]">
                    <span className="font-semibold text-xs text-[var(--text-primary)] block mb-1">Option 1: In-App Settings</span>
                    <span className="text-xs text-[var(--text-secondary)]">Navigate to <Link href="/settings" className="text-teal-600 dark:text-teal-400 underline">Dashboard &gt; Settings</Link> and select &ldquo;Delete My Account&rdquo;.</span>
                  </div>
                  <div className="p-3 rounded-lg bg-[var(--bg-surface)] border border-[var(--border)]">
                    <span className="font-semibold text-xs text-[var(--text-primary)] block mb-1">Option 2: Email Our Data Officer</span>
                    <span className="text-xs text-[var(--text-secondary)]">Send an erasure request to <a href="mailto:muzamalfarooq111@gmail.com" className="text-teal-600 dark:text-teal-400 font-semibold underline">muzamalfarooq111@gmail.com</a> from your registered email.</span>
                  </div>
                </div>
                <p className="text-xs text-[var(--text-muted)]">
                  Upon receiving a deletion request, we permanently purge or anonymize your personal records within thirty (30) calendar days, retaining only non-identifiable records required by statutory law.
                </p>
              </div>
            </section>

            {/* 10. User Privacy Rights */}
            <section id="privacy-rights" className="p-6 sm:p-8 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)] scroll-mt-24 space-y-4 shadow-sm">
              <div className="flex items-center gap-3 border-b border-[var(--border)] pb-4">
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">Section 10</span>
                  <h2 className="text-2xl font-outfit font-bold text-[var(--text-primary)]">Your Privacy Rights &amp; Choices</h2>
                </div>
              </div>
              <p className="leading-relaxed text-[var(--text-secondary)]">
                Depending on your location and jurisdiction, you enjoy the following privacy rights:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-[var(--text-secondary)]">
                <div className="p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)]">
                  <strong className="text-[var(--text-primary)] block mb-1">Right to Access:</strong>
                  Request a copy of the personal information RideWave holds about you.
                </div>
                <div className="p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)]">
                  <strong className="text-[var(--text-primary)] block mb-1">Right to Rectification:</strong>
                  Update or correct inaccurate or incomplete profile details anytime in your profile settings.
                </div>
                <div className="p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)]">
                  <strong className="text-[var(--text-primary)] block mb-1">Right to Erasure (&ldquo;To Be Forgotten&rdquo;):</strong>
                  Request permanent deletion of your account and associated personal data.
                </div>
                <div className="p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)]">
                  <strong className="text-[var(--text-primary)] block mb-1">Right to Withdraw Consent:</strong>
                  Revoke permissions for GPS tracking, marketing emails, or Google account linking at any time.
                </div>
              </div>
            </section>

            {/* 11. Children's Privacy */}
            <section id="children-privacy" className="p-6 sm:p-8 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)] scroll-mt-24 space-y-4 shadow-sm">
              <div className="flex items-center gap-3 border-b border-[var(--border)] pb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Section 11</span>
                  <h2 className="text-2xl font-outfit font-bold text-[var(--text-primary)]">Children&apos;s Privacy</h2>
                </div>
              </div>
              <p className="leading-relaxed text-[var(--text-secondary)]">
                RideWave is strictly intended for individuals who are at least 18 years of age (or the legal age of majority in your jurisdiction). We do not knowingly solicit, collect, or store personal information from children under 18 years of age. If we learn that personal data of a minor has been collected without verifiable parental authorization, we will promptly delete that data from our systems. Parents or guardians who believe their child has registered an unauthorized account may contact us at <a href="mailto:muzamalfarooq111@gmail.com" className="text-teal-600 dark:text-teal-400 font-semibold underline">muzamalfarooq111@gmail.com</a>.
              </p>
            </section>

            {/* 12. Updates and Contact Info */}
            <section id="updates-contact" className="p-6 sm:p-8 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)] scroll-mt-24 space-y-4 shadow-sm">
              <div className="flex items-center gap-3 border-b border-[var(--border)] pb-4">
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">Section 12</span>
                  <h2 className="text-2xl font-outfit font-bold text-[var(--text-primary)]">Policy Updates &amp; Contact Information</h2>
                </div>
              </div>
              <p className="leading-relaxed text-[var(--text-secondary)]">
                We may periodically update this Privacy Policy to reflect enhancements in our mobility technology, legal mandates, or operational workflows. When modifications are made, the revised &ldquo;Last Updated&rdquo; date at the top of this document will be updated. Continued use of RideWave following posted revisions constitutes acceptance of the updated terms.
              </p>
              
              <div className="p-5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] space-y-3">
                <h3 className="font-bold text-sm text-[var(--text-primary)]">Official Data Protection &amp; Platform Inquiries:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-[var(--text-secondary)]">
                  <div>
                    <span className="text-[var(--text-muted)] block">Platform Operator:</span>
                    <strong className="text-[var(--text-primary)]">RideWave Technologies</strong>
                  </div>
                  <div>
                    <span className="text-[var(--text-muted)] block">Lead Administrator:</span>
                    <strong className="text-[var(--text-primary)]">Muzamal Farooq</strong>
                  </div>
                  <div>
                    <span className="text-[var(--text-muted)] block">Privacy Email:</span>
                    <a href="mailto:muzamalfarooq111@gmail.com" className="text-teal-600 dark:text-teal-400 font-semibold underline">muzamalfarooq111@gmail.com</a>
                  </div>
                  <div>
                    <span className="text-[var(--text-muted)] block">Direct Telephone:</span>
                    <a href="tel:+923067774327" className="text-teal-600 dark:text-teal-400 font-semibold underline">+92 306 7774327</a>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-[var(--text-muted)] block">Physical Operations Address:</span>
                    <strong className="text-[var(--text-primary)]">Lahore, Punjab, Pakistan</strong>
                  </div>
                </div>
              </div>
            </section>

          </main>
        </div>
      </div>
    </div>
  );
}

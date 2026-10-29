'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  Send,
  User,
  Mail,
  Tag,
  Hash,
  FileText,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Car,
  Compass,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function SupportContactForm() {
  const { data: session } = useSession();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    userType: 'TRAVELLER',
    category: 'Booking & Rides',
    bookingId: '',
    subject: '',
    description: '',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState(null);
  const [serverError, setServerError] = useState(null);

  // Pre-fill user information if authenticated
  useEffect(() => {
    if (session?.user) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || session.user.name || '',
        email: prev.email || session.user.email || '',
        userType: session.user.role === 'RIDER' ? 'DRIVER' : 'TRAVELLER',
      }));
    }
  }, [session]);

  const categories = [
    'Booking & Rides',
    'Payments & Pricing',
    'Account & Profile',
    'Safety & Security Concern',
    'Driver Support',
    'Technical & App Issues',
    'Other / General Inquiry',
  ];

  const validate = () => {
    const errs = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errs.name = 'Please provide your full name (at least 2 characters).';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      errs.email = 'Please provide a valid email address.';
    }

    if (!formData.subject.trim() || formData.subject.trim().length < 3) {
      errs.subject = 'Please enter a clear subject (at least 3 characters).';
    }

    if (!formData.description.trim() || formData.description.trim().length < 10) {
      errs.description = 'Please provide detailed information (at least 10 characters).';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);

    if (!validate()) {
      toast.error('Please resolve the errors highlighted in the form.');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          userType: formData.userType,
          category: formData.category,
          bookingId: formData.bookingId.trim() || undefined,
          subject: formData.subject.trim(),
          description: formData.description.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to submit support ticket.');
      }

      setSubmittedTicket({
        referenceCode: data.referenceCode || `RW-${Date.now().toString().slice(-6)}`,
        email: formData.email.trim(),
        category: formData.category,
        subject: formData.subject.trim(),
      });

      toast.success('Your support request has been submitted successfully!');
    } catch (err) {
      console.error('Support form submission error:', err);
      const msg = err.message || 'Could not connect to the support server. Please try again later.';
      setServerError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmittedTicket(null);
    setServerError(null);
    setFormData({
      name: session?.user?.name || '',
      email: session?.user?.email || '',
      userType: session?.user?.role === 'RIDER' ? 'DRIVER' : 'TRAVELLER',
      category: 'Booking & Rides',
      bookingId: '',
      subject: '',
      description: '',
    });
    setErrors({});
  };

  return (
    <section id="contact" aria-labelledby="contact-heading" className="w-full">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-[#E7E5DD] dark:border-[#23584B] bg-white dark:bg-[#173F35] p-6 sm:p-10 shadow-lg relative overflow-hidden">
          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#C6A76B]/5 rounded-full blur-3xl pointer-events-none" />

          {/* Section Header */}
          <div className="text-center max-w-xl mx-auto mb-10 space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#DCE7DF]/60 dark:bg-[#102F28] text-[#173F35] dark:text-[#C6A76B] text-xs font-bold uppercase tracking-widest border border-[#E7E5DD] dark:border-[#23584B]">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Dedicated Assistance</span>
            </div>
            <h2 id="contact-heading" className="font-outfit font-extrabold text-2xl sm:text-4xl text-[#171A17] dark:text-[#F8F6F0]">
              Still Need Help?
            </h2>
            <p className="text-sm sm:text-base text-[#4E554B] dark:text-[#D0DBD3]">
              Can&apos;t find the answer you need? Our customer support specialists are ready to investigate your concerns and assist both travelers and drivers.
            </p>
          </div>

          {/* Submission Success State */}
          {submittedTicket ? (
            <div className="py-8 px-4 text-center space-y-6 animate-fade-in">
              <div className="w-16 h-16 rounded-2xl bg-[#26734D]/10 text-[#26734D] flex items-center justify-center mx-auto border border-[#26734D]/20 shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2 max-w-md mx-auto">
                <h3 className="font-outfit font-extrabold text-2xl text-[#171A17] dark:text-[#F8F6F0]">
                  Support Ticket Lodged
                </h3>
                <p className="text-sm text-[#4E554B] dark:text-[#D0DBD3] leading-relaxed">
                  We have received your inquiry. A confirmation receipt has been dispatched to{' '}
                  <strong className="text-[#171A17] dark:text-[#F8F6F0]">{submittedTicket.email}</strong>.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#F8F6F0] dark:bg-[#102F28] border border-[#E7E5DD] dark:border-[#23584B] max-w-md mx-auto text-left space-y-2 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-[#E7E5DD]/70 dark:border-[#23584B]/70">
                  <span className="text-[#4E554B] dark:text-[#D0DBD3]">Ticket Reference:</span>
                  <span className="font-mono font-bold text-sm text-[#173F35] dark:text-[#C6A76B]">
                    {submittedTicket.referenceCode}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-[#E7E5DD]/70 dark:border-[#23584B]/70">
                  <span className="text-[#4E554B] dark:text-[#D0DBD3]">Category:</span>
                  <span className="font-semibold text-[#171A17] dark:text-[#F8F6F0]">
                    {submittedTicket.category}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-[#4E554B] dark:text-[#D0DBD3]">Average Review Window:</span>
                  <span className="font-semibold text-[#26734D]">2 to 4 business hours</span>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#173F35] text-white hover:bg-[#102F28] dark:bg-[#C6A76B] dark:text-[#102F28] font-semibold text-sm transition-all duration-200 cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Submit Another Request</span>
                </button>
                <a
                  href="#faqs"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-[#E7E5DD] dark:border-[#23584B] bg-white/70 dark:bg-[#173F35] text-xs font-semibold text-[#171A17] dark:text-[#F8F6F0] hover:text-[#C6A76B] transition-colors"
                >
                  <span>Return to FAQs</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          ) : (
            /* Support Request Form */
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              {serverError && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-300 text-xs flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{serverError}</span>
                </div>
              )}

              {/* Row 1: Name and Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="support-name" className="block text-xs font-bold uppercase tracking-wider text-[#171A17] dark:text-[#F8F6F0] mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#4E554B] dark:text-[#D0DBD3]">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      id="support-name"
                      type="text"
                      placeholder="e.g. Sarah Jenkins"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        if (errors.name) setErrors({ ...errors, name: null });
                      }}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl bg-[#F8F6F0] dark:bg-[#102F28] border text-sm text-[#171A17] dark:text-[#F8F6F0] placeholder-[#4E554B]/60 dark:placeholder-[#D0DBD3]/40 focus:outline-none transition-all ${
                        errors.name
                          ? 'border-red-500 focus:ring-1 focus:ring-red-500'
                          : 'border-[#E7E5DD] dark:border-[#23584B] focus:border-[#C6A76B]'
                      }`}
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? 'support-name-error' : undefined}
                      required
                    />
                  </div>
                  {errors.name && (
                    <p id="support-name-error" className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="support-email" className="block text-xs font-bold uppercase tracking-wider text-[#171A17] dark:text-[#F8F6F0] mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#4E554B] dark:text-[#D0DBD3]">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      id="support-email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (errors.email) setErrors({ ...errors, email: null });
                      }}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl bg-[#F8F6F0] dark:bg-[#102F28] border text-sm text-[#171A17] dark:text-[#F8F6F0] placeholder-[#4E554B]/60 dark:placeholder-[#D0DBD3]/40 focus:outline-none transition-all ${
                        errors.email
                          ? 'border-red-500 focus:ring-1 focus:ring-red-500'
                          : 'border-[#E7E5DD] dark:border-[#23584B] focus:border-[#C6A76B]'
                      }`}
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? 'support-email-error' : undefined}
                      required
                    />
                  </div>
                  {errors.email && (
                    <p id="support-email-error" className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Row 2: User Type and Issue Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <span className="block text-xs font-bold uppercase tracking-wider text-[#171A17] dark:text-[#F8F6F0] mb-2">
                    User Type <span className="text-red-500">*</span>
                  </span>
                  <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Select user type">
                    <button
                      type="button"
                      role="radio"
                      aria-checked={formData.userType === 'TRAVELLER'}
                      onClick={() => setFormData({ ...formData, userType: 'TRAVELLER' })}
                      className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                        formData.userType === 'TRAVELLER'
                          ? 'bg-[#173F35] text-white border-[#173F35] dark:bg-[#C6A76B] dark:text-[#102F28] shadow-sm'
                          : 'bg-[#F8F6F0] dark:bg-[#102F28] text-[#4E554B] dark:text-[#D0DBD3] border-[#E7E5DD] dark:border-[#23584B]'
                      }`}
                    >
                      <Compass className="w-4 h-4" />
                      <span>Traveller</span>
                    </button>
                    <button
                      type="button"
                      role="radio"
                      aria-checked={formData.userType === 'DRIVER'}
                      onClick={() => setFormData({ ...formData, userType: 'DRIVER' })}
                      className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                        formData.userType === 'DRIVER'
                          ? 'bg-[#173F35] text-white border-[#173F35] dark:bg-[#C6A76B] dark:text-[#102F28] shadow-sm'
                          : 'bg-[#F8F6F0] dark:bg-[#102F28] text-[#4E554B] dark:text-[#D0DBD3] border-[#E7E5DD] dark:border-[#23584B]'
                      }`}
                    >
                      <Car className="w-4 h-4" />
                      <span>Driver</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="support-category" className="block text-xs font-bold uppercase tracking-wider text-[#171A17] dark:text-[#F8F6F0] mb-2">
                    Issue Category <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#4E554B] dark:text-[#D0DBD3]">
                      <Tag className="w-4 h-4" />
                    </div>
                    <select
                      id="support-category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full pl-10 pr-8 py-3 rounded-xl bg-[#F8F6F0] dark:bg-[#102F28] border border-[#E7E5DD] dark:border-[#23584B] text-sm text-[#171A17] dark:text-[#F8F6F0] focus:border-[#C6A76B] focus:outline-none transition-all cursor-pointer"
                    >
                      {categories.map((c) => (
                        <option key={c} value={c} className="bg-white dark:bg-[#102F28] text-[#171A17] dark:text-[#F8F6F0]">
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Row 3: Booking ID and Subject */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="support-booking-id" className="block text-xs font-bold uppercase tracking-wider text-[#171A17] dark:text-[#F8F6F0] mb-2">
                    Booking ID <span className="text-[#4E554B] dark:text-[#D0DBD3] font-normal lowercase">(optional)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#4E554B] dark:text-[#D0DBD3]">
                      <Hash className="w-4 h-4" />
                    </div>
                    <input
                      id="support-booking-id"
                      type="text"
                      placeholder="e.g. BK-9821"
                      value={formData.bookingId}
                      onChange={(e) => setFormData({ ...formData, bookingId: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#F8F6F0] dark:bg-[#102F28] border border-[#E7E5DD] dark:border-[#23584B] text-sm text-[#171A17] dark:text-[#F8F6F0] placeholder-[#4E554B]/60 dark:placeholder-[#D0DBD3]/40 focus:border-[#C6A76B] focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="support-subject" className="block text-xs font-bold uppercase tracking-wider text-[#171A17] dark:text-[#F8F6F0] mb-2">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#4E554B] dark:text-[#D0DBD3]">
                      <FileText className="w-4 h-4" />
                    </div>
                    <input
                      id="support-subject"
                      type="text"
                      placeholder="Brief summary of your question or issue"
                      value={formData.subject}
                      onChange={(e) => {
                        setFormData({ ...formData, subject: e.target.value });
                        if (errors.subject) setErrors({ ...errors, subject: null });
                      }}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl bg-[#F8F6F0] dark:bg-[#102F28] border text-sm text-[#171A17] dark:text-[#F8F6F0] placeholder-[#4E554B]/60 dark:placeholder-[#D0DBD3]/40 focus:outline-none transition-all ${
                        errors.subject
                          ? 'border-red-500 focus:ring-1 focus:ring-red-500'
                          : 'border-[#E7E5DD] dark:border-[#23584B] focus:border-[#C6A76B]'
                      }`}
                      aria-invalid={!!errors.subject}
                      aria-describedby={errors.subject ? 'support-subject-error' : undefined}
                      required
                    />
                  </div>
                  {errors.subject && (
                    <p id="support-subject-error" className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.subject}
                    </p>
                  )}
                </div>
              </div>

              {/* Detailed Description */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="support-description" className="block text-xs font-bold uppercase tracking-wider text-[#171A17] dark:text-[#F8F6F0]">
                    Detailed Description <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[11px] text-[#4E554B] dark:text-[#D0DBD3]">
                    {formData.description.length} characters
                  </span>
                </div>
                <textarea
                  id="support-description"
                  rows={5}
                  placeholder="Please describe what happened, including trip date, driver name, route details, or error messages where applicable..."
                  value={formData.description}
                  onChange={(e) => {
                    setFormData({ ...formData, description: e.target.value });
                    if (errors.description) setErrors({ ...errors, description: null });
                  }}
                  className={`w-full p-4 rounded-xl bg-[#F8F6F0] dark:bg-[#102F28] border text-sm text-[#171A17] dark:text-[#F8F6F0] placeholder-[#4E554B]/60 dark:placeholder-[#D0DBD3]/40 focus:outline-none transition-all leading-relaxed ${
                    errors.description
                      ? 'border-red-500 focus:ring-1 focus:ring-red-500'
                      : 'border-[#E7E5DD] dark:border-[#23584B] focus:border-[#C6A76B]'
                  }`}
                  aria-invalid={!!errors.description}
                  aria-describedby={errors.description ? 'support-desc-error' : undefined}
                  required
                />
                {errors.description && (
                  <p id="support-desc-error" className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 rounded-xl bg-[#173F35] text-white hover:bg-[#102F28] dark:bg-[#C6A76B] dark:text-[#102F28] font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-60 cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 dark:border-[#102F28]/30 border-t-white dark:border-t-[#102F28] rounded-full animate-spin" />
                      <span>Submitting Support Request...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Support Request</span>
                    </>
                  )}
                </button>
              </div>

              {/* Security & Reassurance note */}
              <p className="text-center text-[11px] text-[#4E554B] dark:text-[#D0DBD3] pt-1">
                🔒 Your personal information is encrypted and transmitted securely. Never share your password or payment OTPs with anyone.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}


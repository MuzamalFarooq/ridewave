'use client';

import { Search, X, Sparkles, HelpCircle } from 'lucide-react';

export default function HelpHeader({ searchQuery, setSearchQuery, totalResultsCount, isSearching }) {
  const quickSearches = [
    'Cancel a ride',
    'Payment failed',
    'Driver did not arrive',
    'Left item in vehicle',
    'Register as driver',
    'Reset password',
  ];

  return (
    <header className="relative pt-28 pb-16 md:pt-36 md:pb-20 overflow-hidden bg-gradient-to-b from-[#102F28] via-[#173F35] to-[#102F28] text-[#F8F6F0]">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#C6A76B]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 left-10 w-80 h-80 bg-[#23584B]/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
        {/* Welcome Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#102F28]/80 border border-[#23584B] text-xs font-semibold text-[#C6A76B] shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
          <span>RideWave Customer Care & Knowledge Base</span>
        </div>

        {/* Heading */}
        <h1 className="font-outfit font-extrabold text-3xl sm:text-5xl lg:text-6xl text-[#F8F6F0] tracking-tight leading-tight">
          How Can We Help You?
        </h1>

        {/* Description */}
        <p className="text-base sm:text-lg text-[#DCE7DF] max-w-2xl mx-auto leading-relaxed font-normal">
          Whether you are a traveler booking your next intercity journey or a driver managing verified trips, our support team and resource library are here to assist with bookings, payments, safety, and technical questions.
        </p>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto pt-2">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4.5 flex items-center pointer-events-none text-[#C6A76B]">
              <Search className="w-5 h-5 transition-transform duration-200 group-focus-within:scale-110" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for help, bookings, payments..."
              className="w-full pl-12 pr-12 py-4 rounded-2xl bg-[#F8F6F0] text-[#171A17] placeholder-[#4E554B] text-base font-medium shadow-lg border-2 border-transparent focus:border-[#C6A76B] focus:outline-none transition-all duration-200"
              aria-label="Search help articles and questions"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#4E554B] hover:text-[#171A17] transition-colors"
                aria-label="Clear search input"
              >
                <div className="w-7 h-7 rounded-full bg-[#DCE7DF] flex items-center justify-center hover:bg-[#C6A76B] hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </div>
              </button>
            )}
          </div>

          {/* Quick search chips */}
          <div className="pt-3 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-[#DCE7DF] font-medium flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5 text-[#C6A76B]" /> Popular:
            </span>
            {quickSearches.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => setSearchQuery(term)}
                className={`px-3 py-1 rounded-full border transition-all text-xs font-medium cursor-pointer ${
                  searchQuery.toLowerCase() === term.toLowerCase()
                    ? 'bg-[#C6A76B] text-[#102F28] border-[#C6A76B]'
                    : 'bg-[#173F35]/70 hover:bg-[#173F35] text-[#F8F6F0] border-[#23584B] hover:border-[#C6A76B]/60'
                }`}
              >
                {term}
              </button>
            ))}
          </div>

          {/* Search Results Feedback */}
          {isSearching && (
            <div className="mt-4 p-2.5 rounded-xl bg-[#102F28]/90 border border-[#23584B] text-xs text-[#DCE7DF] flex items-center justify-between">
              <span>
                Found <strong>{totalResultsCount}</strong> result{totalResultsCount === 1 ? '' : 's'} for &ldquo;{searchQuery}&rdquo;
              </span>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-[#C6A76B] hover:underline font-semibold"
              >
                Reset search
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}


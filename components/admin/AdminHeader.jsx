'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Menu,
  Search,
  ExternalLink,
  ShieldCheck,
  User,
  Car,
  CalendarCheck,
  Loader2,
  X,
  LogOut,
} from 'lucide-react';

export default function AdminHeader({ onMenuClick, adminEmail }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchDropdownRef = useRef(null);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!searchQuery.trim() || searchQuery.trim().length < 2) {
        setSearchResults(null);
        return;
      }
      try {
        setIsSearching(true);
        const res = await fetch(`/api/admin/search?q=${encodeURIComponent(searchQuery.trim())}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data);
          setIsSearchOpen(true);
        }
      } catch (err) {
        console.error('Admin search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchDropdownRef.current && !searchDropdownRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults(null);
    setIsSearchOpen(false);
  };

  const handleSelectResult = (url) => {
    clearSearch();
    router.push(url);
  };

  return (
    <header className="sticky top-0 z-30 flex h-18 w-full items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 lg:px-8 backdrop-blur-md dark:border-emerald-950/40 dark:bg-[#0c241e]/95">
      {/* Left section: mobile hamburger & search bar */}
      <div className="flex items-center gap-4 flex-1 max-w-2xl">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-emerald-900/40"
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Global Search Bar */}
        <div ref={searchDropdownRef} className="relative w-full">
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 h-4 w-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
            <input
              type="text"
              placeholder="Search users, riders, bookings by name, email, ref..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                if (searchResults) setIsSearchOpen(true);
              }}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/80 pl-10 pr-9 py-2 text-sm text-slate-800 placeholder-slate-400 transition-all focus:border-emerald-600 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600/20 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-[#C6A76B]"
            />
            {isSearching ? (
              <Loader2 className="absolute right-3 h-4 w-4 animate-spin text-emerald-600" />
            ) : searchQuery ? (
              <button
                onClick={clearSearch}
                className="absolute right-3 p-0.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            ) : null}
          </div>

          {/* Categorized Search Results Dropdown */}
          {isSearchOpen && searchResults && (
            <div className="absolute left-0 right-0 top-full mt-2 z-50 max-h-96 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-3 shadow-xl dark:border-emerald-900/50 dark:bg-[#0d2620] custom-scrollbar">
              {(!searchResults.users?.length &&
                !searchResults.riders?.length &&
                !searchResults.bookings?.length) ? (
                <div className="py-6 text-center text-xs text-slate-500 dark:text-slate-400">
                  No matching results found for &ldquo;{searchQuery}&rdquo;.
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Users */}
                  {searchResults.users?.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 px-2 pb-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-[#C6A76B]">
                        <User className="h-3.5 w-3.5" />
                        <span>Users ({searchResults.users.length})</span>
                      </div>
                      <div className="space-y-1">
                        {searchResults.users.map((u) => (
                          <button
                            key={u.id}
                            onClick={() => handleSelectResult(`/admin/users?search=${encodeURIComponent(u.email)}`)}
                            className="w-full flex items-center justify-between rounded-xl px-3 py-2 text-left hover:bg-slate-100 dark:hover:bg-emerald-950/80 transition-colors"
                          >
                            <div className="truncate">
                              <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">{u.name || 'Unnamed'}</p>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400">{u.email}</p>
                            </div>
                            <span className="shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-emerald-900/60 dark:text-emerald-300">
                              {u.role}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Riders */}
                  {searchResults.riders?.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 px-2 pb-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-[#C6A76B]">
                        <Car className="h-3.5 w-3.5" />
                        <span>Riders ({searchResults.riders.length})</span>
                      </div>
                      <div className="space-y-1">
                        {searchResults.riders.map((r) => (
                          <button
                            key={r.id}
                            onClick={() => handleSelectResult(`/admin/riders?search=${encodeURIComponent(r.email)}`)}
                            className="w-full flex items-center justify-between rounded-xl px-3 py-2 text-left hover:bg-slate-100 dark:hover:bg-emerald-950/80 transition-colors"
                          >
                            <div className="truncate">
                              <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">{r.name || 'Unnamed'}</p>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400">{r.email}</p>
                            </div>
                            {r.vehicles?.[0] && (
                              <span className="shrink-0 text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
                                {r.vehicles[0].registrationNumber}
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Bookings */}
                  {searchResults.bookings?.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 px-2 pb-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-[#C6A76B]">
                        <CalendarCheck className="h-3.5 w-3.5" />
                        <span>Bookings ({searchResults.bookings.length})</span>
                      </div>
                      <div className="space-y-1">
                        {searchResults.bookings.map((b) => (
                          <button
                            key={b.id}
                            onClick={() => handleSelectResult(`/admin/bookings?search=${encodeURIComponent(b.bookingRef)}`)}
                            className="w-full flex items-center justify-between rounded-xl px-3 py-2 text-left hover:bg-slate-100 dark:hover:bg-emerald-950/80 transition-colors"
                          >
                            <div className="truncate">
                              <p className="text-xs font-semibold font-mono text-slate-800 dark:text-slate-100">{b.bookingRef}</p>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                                {b.pickupAddress} → {b.dropoffAddress}
                              </p>
                            </div>
                            <span className="shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300">
                              {b.status}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right section: System Status & User badge */}
      <div className="flex items-center gap-3">
        {/* Status pill */}
        <div className="hidden sm:flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Admin Session Active</span>
        </div>

        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-emerald-600 dark:text-slate-300 dark:hover:text-[#C6A76B] transition-colors px-2 py-1"
        >
          <span>Live Site</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </a>

        {/* Admin profile chip */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-emerald-900/50">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#173F35] text-white text-xs font-bold border border-[#C6A76B]/40 shadow-xs">
            <ShieldCheck className="h-4 w-4 text-[#C6A76B]" />
          </div>
          <span className="hidden xl:inline text-xs font-semibold text-slate-700 dark:text-slate-200">
            {adminEmail || 'Administrator'}
          </span>
        </div>
      </div>
    </header>
  );
}

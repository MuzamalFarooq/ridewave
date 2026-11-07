'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Car, Bike, Navigation, MapPin, Users, Calendar, Clock,
  Search, Crosshair, ArrowUpDown, Shield, Star, Zap, SlidersHorizontal,
  Home, User, Settings, CreditCard, ChevronRight, Check,
  AlertCircle, Sparkles, LogOut, Compass, ArrowRight, RefreshCw
} from 'lucide-react';
import RideBookingMap from './RideBookingMap';
import { VEHICLE_RATES } from './useBookingEngine';
import { useSession, signOut } from 'next-auth/react';

export default function DesktopBookingExperience({ engine }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const {
    activeTab,
    setActiveTab,
    pickup,
    setPickup,
    destination,
    setDestination,
    handleSwapLocations,
    handleUseCurrentLocation,
    pickOnMapMode,
    setPickOnMapMode,
    handleMapClick,
    routeInfo,
    calculatingRoute,
    vehicleType,
    setVehicleType,
    seats,
    setSeats,
    estimatedFare,
    customOfferPrice,
    setCustomOfferPrice,
    passengerNotes,
    setPassengerNotes,
    availableRides,
    loadingRides,
    selectedRide,
    setSelectedRide,
    rideFilters,
    setRideFilters,
    fetchAvailableRides,
    bookingLoading,
    handleConfirmBooking,
    recentPlaces,
    userLocation,
  } = engine;

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Sidebar navigation items
  const navItems = [
    { label: 'Dashboard', href: '/dashboard/traveler', icon: Home },
    { label: 'Book a Ride', href: '#', active: true, icon: Car, onClick: () => setActiveTab('new-ride') },
    { label: 'Available Rides', href: '#', icon: Compass, onClick: () => setActiveTab('available-rides') },
    { label: 'My Bookings', href: '/dashboard/traveler/bookings', icon: Calendar },
    { label: 'Ride History', href: '/dashboard/traveler/bookings?tab=history', icon: Clock },
    { label: 'Profile', href: '/profile', icon: User },
    { label: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <div className="flex w-full h-[calc(100vh-80px)] mt-20 overflow-hidden bg-[#F8F6F0] dark:bg-[#102F28]">
      {/* ========================================================
          SECTION 1: NAVIGATION SIDEBAR (Collapsible & Responsive)
      ======================================================== */}
      <aside
        className={`hidden md:flex flex-col border-r border-[#E7E5DD] dark:border-[#23584B] bg-white dark:bg-[#173F35] transition-all duration-300 z-10 flex-shrink-0 ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-[#E7E5DD] dark:border-[#23584B] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#173F35] dark:bg-[#102F28] border border-[#C6A76B] flex items-center justify-center text-[#C6A76B] font-bold text-sm shadow-sm">
              RW
            </div>
            {!sidebarCollapsed && (
              <span className="font-outfit font-bold text-lg text-[#171A17] dark:text-white">
                RideWave
              </span>
            )}
          </Link>
          <button
            type="button"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-[#102F28] text-slate-500"
            title="Toggle Sidebar"
          >
            <ChevronRight className={`w-4 h-4 transition-transform ${sidebarCollapsed ? '' : 'rotate-180'}`} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
          {navItems.map((item, idx) => {
            const Icon = item.icon;
            const isCurrent = item.active || (item.label === 'Available Rides' && activeTab === 'available-rides');

            return (
              <button
                key={idx}
                type="button"
                onClick={item.onClick ? item.onClick : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isCurrent
                    ? 'bg-[#173F35] text-white shadow-sm'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#102F28]'
                }`}
              >
                {item.href && !item.onClick ? (
                  <Link href={item.href} className="flex items-center gap-3 w-full">
                    <Icon className="w-4 h-4 flex-shrink-0 text-[#C6A76B]" />
                    {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                  </Link>
                ) : (
                  <>
                    <Icon className="w-4 h-4 flex-shrink-0 text-[#C6A76B]" />
                    {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                  </>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Status Footer */}
        <div className="p-3 border-t border-[#E7E5DD] dark:border-[#23584B]">
          {session ? (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#173F35] text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                {session.user?.name?.[0] || 'U'}
              </div>
              {!sidebarCollapsed && (
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-[#171A17] dark:text-white truncate">
                    {session.user?.name}
                  </p>
                  <p className="text-[10px] text-slate-400 capitalize">{session.user?.role || 'Traveler'}</p>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 py-2 rounded-xl bg-[#173F35] text-white text-xs font-bold"
            >
              Sign In
            </Link>
          )}
        </div>
      </aside>

      {/* ========================================================
          SECTION 2: BOOKING PANEL (Independently Scrollable)
      ======================================================== */}
      <section className="w-full md:w-[420px] lg:w-[460px] h-full flex flex-col bg-white dark:bg-[#173F35] border-r border-[#E7E5DD] dark:border-[#23584B] z-10 shadow-lg flex-shrink-0">
        {/* Panel Header & Mode Switcher */}
        <div className="p-5 border-b border-[#E7E5DD] dark:border-[#23584B] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-outfit font-extrabold text-xl text-[#171A17] dark:text-white">
                Book a Ride
              </h2>
              <p className="text-xs text-[#4E554B] dark:text-[#A0B2A6]">
                RideWave verified drivers across Pakistan
              </p>
            </div>
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              title="Locate Me via GPS"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F8F6F0] dark:bg-[#102F28] border border-[#E7E5DD] dark:border-[#23584B] text-xs font-bold text-[#26734D] hover:bg-emerald-50 transition-colors"
            >
              <Crosshair className="w-3.5 h-3.5" /> GPS
            </button>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex rounded-2xl p-1 bg-[#F8F6F0] dark:bg-[#102F28] border border-[#E7E5DD] dark:border-[#23584B]">
            <button
              type="button"
              onClick={() => setActiveTab('new-ride')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'new-ride'
                  ? 'bg-white dark:bg-[#173F35] text-[#173F35] dark:text-[#C6A76B] shadow-sm'
                  : 'text-[#4E554B] dark:text-[#A0B2A6]'
              }`}
            >
              Book a New Ride
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('available-rides')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'available-rides'
                  ? 'bg-white dark:bg-[#173F35] text-[#173F35] dark:text-[#C6A76B] shadow-sm'
                  : 'text-[#4E554B] dark:text-[#A0B2A6]'
              }`}
            >
              Available Rides ({availableRides.length})
            </button>
          </div>
        </div>

        {/* Scrollable Form & Content Container */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Pickup & Destination Location Inputs */}
          <div className="p-4 rounded-2xl bg-[#F8F6F0] dark:bg-[#102F28] border border-[#E7E5DD] dark:border-[#23584B] space-y-3 relative">
            {/* Pickup */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Pickup Location (A)
              </label>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#26734D] text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                  A
                </div>
                <input
                  type="text"
                  placeholder="Enter pickup address or city"
                  value={pickup.address}
                  onChange={(e) => setPickup((p) => ({ ...p, address: e.target.value }))}
                  className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-[#173F35] border border-[#E7E5DD] dark:border-[#23584B] text-xs font-medium text-[#171A17] dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#173F35]"
                />
                <button
                  type="button"
                  onClick={() => setPickOnMapMode('pickup')}
                  title="Pick point on map"
                  className={`p-2 rounded-xl border text-xs transition-colors ${
                    pickOnMapMode === 'pickup'
                      ? 'bg-[#173F35] text-white border-[#173F35]'
                      : 'bg-white dark:bg-[#173F35] text-[#173F35] dark:text-[#C6A76B] border-[#E7E5DD] dark:border-[#23584B]'
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Destination */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Destination (B)
              </label>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#C6A76B] text-[#171A17] flex items-center justify-center font-bold text-xs flex-shrink-0">
                  B
                </div>
                <input
                  type="text"
                  placeholder="Enter drop-off destination"
                  value={destination.address}
                  onChange={(e) => setDestination((d) => ({ ...d, address: e.target.value }))}
                  className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-[#173F35] border border-[#E7E5DD] dark:border-[#23584B] text-xs font-medium text-[#171A17] dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#173F35]"
                />
                <button
                  type="button"
                  onClick={() => setPickOnMapMode('destination')}
                  title="Pick point on map"
                  className={`p-2 rounded-xl border text-xs transition-colors ${
                    pickOnMapMode === 'destination'
                      ? 'bg-[#173F35] text-white border-[#173F35]'
                      : 'bg-white dark:bg-[#173F35] text-[#173F35] dark:text-[#C6A76B] border-[#E7E5DD] dark:border-[#23584B]'
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Swap Button */}
            <button
              type="button"
              onClick={handleSwapLocations}
              title="Swap Locations"
              className="absolute right-14 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white dark:bg-[#173F35] border border-[#E7E5DD] dark:border-[#23584B] text-slate-500 hover:text-[#173F35] flex items-center justify-center shadow-sm"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Route Stats Summary */}
          {routeInfo && (
            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-[#26734D]/10 border border-[#26734D]/25">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-[#26734D]" />
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Estimated Distance</p>
                  <p className="text-sm font-extrabold text-[#26734D]">
                    {routeInfo.distanceText || `${routeInfo.distanceKm} km`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#26734D]" />
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Travel Time</p>
                  <p className="text-sm font-extrabold text-[#26734D]">
                    {routeInfo.durationText || `${routeInfo.durationMinutes} mins`}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              MODE A: BOOK A NEW RIDE
          ======================================================== */}
          {activeTab === 'new-ride' && (
            <div className="space-y-4">
              {/* Vehicle Selection */}
              <div>
                <label className="block text-xs font-bold text-[#4E554B] dark:text-[#A0B2A6] mb-2">
                  Choose Vehicle Class
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {Object.values(VEHICLE_RATES).map((veh) => {
                    const isSelected = vehicleType === veh.id;
                    return (
                      <div
                        key={veh.id}
                        onClick={() => setVehicleType(veh.id)}
                        className={`p-3 rounded-2xl border text-center cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-[#173F35] text-white border-[#173F35] shadow-md scale-102'
                            : 'bg-[#F8F6F0] dark:bg-[#102F28] text-slate-700 dark:text-slate-200 border-[#E7E5DD] dark:border-[#23584B] hover:border-slate-300'
                        }`}
                      >
                        <div className="text-2xl mb-1">{veh.icon}</div>
                        <p className="text-xs font-bold">{veh.name.split('/')[0]}</p>
                        <p className={`text-[10px] mt-0.5 ${isSelected ? 'text-[#C6A76B]' : 'text-slate-400'}`}>
                          {veh.capacity} seat{veh.capacity > 1 ? 's' : ''}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* inDrive-Style Fair Price Offer */}
              <div className="p-4 rounded-2xl bg-[#F8F6F0] dark:bg-[#102F28] border border-[#E7E5DD] dark:border-[#23584B] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-xs font-bold text-[#171A17] dark:text-white">
                      Your Offer Price (PKR)
                    </label>
                    <span className="text-[11px] text-slate-500">
                      Market Estimate: ~PKR {estimatedFare.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const current = Number(customOfferPrice || estimatedFare);
                        setCustomOfferPrice(String(Math.max(100, current - 50)));
                      }}
                      className="w-7 h-7 rounded-lg bg-white dark:bg-[#173F35] border border-[#E7E5DD] dark:border-[#23584B] font-bold text-xs"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      placeholder={String(estimatedFare)}
                      value={customOfferPrice}
                      onChange={(e) => setCustomOfferPrice(e.target.value)}
                      className="w-28 text-center font-extrabold text-sm px-2 py-1.5 rounded-xl bg-white dark:bg-[#173F35] border border-[#E7E5DD] dark:border-[#23584B] text-[#173F35] dark:text-[#C6A76B] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const current = Number(customOfferPrice || estimatedFare);
                        setCustomOfferPrice(String(current + 50));
                      }}
                      className="w-7 h-7 rounded-lg bg-white dark:bg-[#173F35] border border-[#E7E5DD] dark:border-[#23584B] font-bold text-xs"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Passenger Seats */}
                <div className="flex items-center justify-between pt-2 border-t border-[#E7E5DD] dark:border-[#23584B]">
                  <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">Passengers / Seats</span>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setSeats(n)}
                        className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                          seats === n
                            ? 'bg-[#173F35] text-white shadow-sm'
                            : 'bg-white dark:bg-[#173F35] text-slate-700 dark:text-slate-300 border border-[#E7E5DD] dark:border-[#23584B]'
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Passenger Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Special Instructions / Notes</label>
                <input
                  type="text"
                  placeholder="e.g. luggage size, AC preference, pickup landmark..."
                  value={passengerNotes}
                  onChange={(e) => setPassengerNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#F8F6F0] dark:bg-[#102F28] border border-[#E7E5DD] dark:border-[#23584B] text-xs font-medium text-[#171A17] dark:text-white placeholder-slate-400"
                />
              </div>

              {/* Confirm Booking Button */}
              <button
                type="button"
                onClick={handleConfirmBooking}
                disabled={bookingLoading}
                className="w-full py-3.5 rounded-2xl bg-[#173F35] hover:bg-[#102F28] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all"
              >
                {bookingLoading ? (
                  'Requesting Ride...'
                ) : (
                  <>
                    Confirm Booking • PKR {(customOfferPrice || estimatedFare).toLocaleString()} <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>
            </div>
          )}

          {/* ========================================================
              MODE B: AVAILABLE RIDES FEED
          ======================================================== */}
          {activeTab === 'available-rides' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {availableRides.length} Available Ride{availableRides.length !== 1 ? 's' : ''}
                </span>
                <button
                  type="button"
                  onClick={fetchAvailableRides}
                  className="flex items-center gap-1 text-xs text-[#173F35] dark:text-[#C6A76B] font-semibold"
                >
                  <RefreshCw className="w-3 h-3" /> Refresh
                </button>
              </div>

              {loadingRides ? (
                <div className="p-8 text-center text-xs text-slate-400">Loading published rides...</div>
              ) : availableRides.length === 0 ? (
                <div className="p-6 rounded-2xl bg-[#F8F6F0] dark:bg-[#102F28] text-center space-y-2.5">
                  <Car className="w-9 h-9 mx-auto text-slate-400" />
                  <p className="text-xs font-bold text-[#171A17] dark:text-white">
                    No rides matching these coordinates
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Switch to &quot;Book a New Ride&quot; to broadcast an on-demand ride offer to nearby drivers!
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('new-ride')}
                    className="px-4 py-2 rounded-xl bg-[#173F35] text-white text-xs font-bold"
                  >
                    Post Ride Request
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {availableRides.map((ride) => {
                    const isSelected = selectedRide?.id === ride.id;
                    const pricePkr = Math.round((ride.pricePerSeat || 12) * 280);

                    return (
                      <div
                        key={ride.id}
                        onClick={() => {
                          setSelectedRide(ride);
                          if (ride.pickupAddress) setPickup((p) => ({ ...p, address: ride.pickupAddress }));
                          if (ride.destinationAddress) setDestination((d) => ({ ...d, address: ride.destinationAddress }));
                        }}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#173F35]/5 border-[#173F35] dark:border-[#C6A76B] shadow-md ring-1 ring-[#173F35]'
                            : 'bg-[#F8F6F0] dark:bg-[#102F28] border-[#E7E5DD] dark:border-[#23584B] hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-full bg-[#173F35] text-white flex items-center justify-center font-bold text-xs">
                              {ride.rider?.name?.[0] || 'D'}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-[#171A17] dark:text-white">
                                {ride.rider?.name || 'Verified Driver'}
                              </p>
                              <div className="flex items-center gap-1 text-[11px] text-amber-500 font-semibold">
                                <Star className="w-3 h-3 fill-amber-500" />
                                <span>{ride.rider?.profile?.averageRating?.toFixed(1) || '4.9'}</span>
                                <span className="text-slate-400">
                                  ({ride.rider?.profile?.totalTrips || 12} trips)
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-base font-extrabold text-[#173F35] dark:text-[#C6A76B]">
                              PKR {pricePkr.toLocaleString()}
                            </p>
                            <p className="text-[10px] text-slate-400">per seat</p>
                          </div>
                        </div>

                        <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1 mb-3">
                          <p className="truncate">📍 <strong className="text-slate-800 dark:text-slate-100">From:</strong> {ride.pickupAddress}</p>
                          <p className="truncate">🎯 <strong className="text-slate-800 dark:text-slate-100">To:</strong> {ride.destinationAddress}</p>
                        </div>

                        <div className="flex items-center justify-between pt-2.5 border-t border-[#E7E5DD] dark:border-[#23584B]">
                          <span className="text-[11px] text-slate-500 font-medium">
                            🚗 {ride.vehicle?.brand} {ride.vehicle?.model} • {ride.seatsLeft || ride.availableSeats} seats left
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedRide(ride);
                              handleConfirmBooking();
                            }}
                            className="px-3 py-1.5 rounded-xl bg-[#173F35] text-white text-xs font-bold shadow-sm hover:bg-[#102F28]"
                          >
                            Request to Join
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ========================================================
          SECTION 3: INTERACTIVE GOOGLE MAPS (Expansive Display)
      ======================================================== */}
      <section className="flex-1 h-full relative overflow-hidden bg-[#102F28]">
        <RideBookingMap
          pickup={pickup}
          destination={destination}
          routeInfo={routeInfo}
          userLocation={userLocation}
          availableRides={availableRides}
          selectedRide={selectedRide}
          onSelectRide={(ride) => {
            setSelectedRide(ride);
            setActiveTab('available-rides');
          }}
          onMapClick={handleMapClick}
          pickOnMapMode={pickOnMapMode}
          className="w-full h-full"
        />
      </section>
    </div>
  );
}

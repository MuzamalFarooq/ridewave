'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Navigation, Car, Bike, Users, Calendar, Clock,
  Search, Crosshair, ChevronUp, ChevronDown, Check, ArrowRight,
  Shield, Star, Zap, SlidersHorizontal, ArrowUpDown, X, Home,
  User, Compass, Sparkles, AlertCircle
} from 'lucide-react';
import RideBookingMap from './RideBookingMap';
import { VEHICLE_RATES } from './useBookingEngine';

export default function MobileBookingExperience({ engine }) {
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
    bookingLoading,
    handleConfirmBooking,
    recentPlaces,
    userLocation,
  } = engine;

  // Bottom Sheet Snap States: 'collapsed' (120px) | 'half' (48vh) | 'full' (88vh)
  const [sheetState, setSheetState] = useState('collapsed');

  // Active input in full expanded view: 'pickup' | 'destination' | null
  const [activeSearchField, setActiveSearchField] = useState(null);
  const [searchFilterText, setSearchFilterText] = useState('');

  // Handle snap change
  const handleSnap = (state) => {
    setSheetState(state);
  };

  const cycleSheetState = () => {
    if (sheetState === 'collapsed') setSheetState('half');
    else if (sheetState === 'half') setSheetState('full');
    else setSheetState('half');
  };

  // Convert snap state to CSS heights
  const getSheetHeightClass = () => {
    if (sheetState === 'collapsed') return 'h-[130px]';
    if (sheetState === 'half') return 'h-[50vh]';
    return 'h-[88vh]';
  };

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-[#102F28] select-none">
      {/* 1. Full-Screen Google Map */}
      <div className="absolute inset-0 z-0">
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
            setSheetState('half');
          }}
          onMapClick={handleMapClick}
          pickOnMapMode={pickOnMapMode}
          className="w-full h-full"
        />
      </div>

      {/* 2. Clean Floating Header */}
      <header className="absolute top-3 inset-x-3 z-20 flex items-center justify-between pointer-events-none">
        {/* Brand Chip */}
        <div className="pointer-events-auto flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-white/95 dark:bg-[#102F28]/95 backdrop-blur-md shadow-lg border border-[#E7E5DD] dark:border-[#23584B]">
          <div className="w-7 h-7 rounded-full bg-[#173F35] flex items-center justify-center text-white font-bold text-xs">
            RW
          </div>
          <div className="flex flex-col">
            <span className="font-outfit font-bold text-xs tracking-tight text-[#171A17] dark:text-white">
              RideWave
            </span>
            <span className="text-[10px] text-[#26734D] font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#26734D] animate-ping" />
              {userLocation?.city || 'Pakistan'}
            </span>
          </div>
        </div>

        {/* GPS Status / Current Location Button */}
        <button
          type="button"
          onClick={handleUseCurrentLocation}
          className="pointer-events-auto flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/95 dark:bg-[#102F28]/95 backdrop-blur-md shadow-lg border border-[#E7E5DD] dark:border-[#23584B] text-[#171A17] dark:text-white text-xs font-medium active:scale-95 transition-transform"
        >
          <Crosshair className="w-3.5 h-3.5 text-[#26734D]" />
          <span>My GPS</span>
        </button>
      </header>

      {/* 3. Draggable inDrive-Inspired Bottom Sheet */}
      <motion.div
        layout
        transition={{ type: 'spring', damping: 28, stiffness: 280 }}
        className={`absolute inset-x-0 bottom-14 z-30 bg-white dark:bg-[#173F35] rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.25)] border-t border-[#E7E5DD] dark:border-[#23584B] flex flex-col transition-all duration-300 ${getSheetHeightClass()}`}
      >
        {/* Drag Handle Bar */}
        <div
          onClick={cycleSheetState}
          className="w-full pt-3 pb-2 flex flex-col items-center justify-center cursor-pointer active:opacity-70"
        >
          <div className="w-12 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600 mb-1" />
          <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            {sheetState === 'collapsed' ? (
              <span className="flex items-center gap-1">
                Swipe up to book <ChevronUp className="w-3 h-3" />
              </span>
            ) : sheetState === 'half' ? (
              <span className="flex items-center gap-1">
                Details & More <ChevronUp className="w-3 h-3" />
              </span>
            ) : (
              <span className="flex items-center gap-1">
                Collapse <ChevronDown className="w-3 h-3" />
              </span>
            )}
          </div>
        </div>

        {/* ========================================================
            A. COLLAPSED STATE (Compact Panel)
        ======================================================== */}
        {sheetState === 'collapsed' && (
          <div className="px-4 pb-2 space-y-2">
            {/* Quick Destination Shortcut Pill */}
            <div
              onClick={() => {
                setSheetState('half');
                setActiveSearchField('destination');
              }}
              className="flex items-center justify-between p-3 rounded-2xl bg-[#F8F6F0] dark:bg-[#102F28] border border-[#E7E5DD] dark:border-[#23584B] cursor-pointer"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-full bg-[#C6A76B] flex items-center justify-center text-[#171A17] flex-shrink-0">
                  <Search className="w-3.5 h-3.5" />
                </div>
                <div className="truncate">
                  <p className="text-xs font-semibold text-[#171A17] dark:text-white truncate">
                    {destination.address ? destination.address.split(',')[0] : 'Where are you heading?'}
                  </p>
                  <p className="text-[10px] text-[#4E554B] dark:text-[#A0B2A6] truncate">
                    {pickup.address ? `From: ${pickup.address.split(',')[0]}` : 'Tap to enter pickup & drop-off'}
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-[#173F35] dark:text-[#C6A76B] flex-shrink-0">
                Go <ArrowRight className="w-3 h-3 inline ml-0.5" />
              </span>
            </div>

            {/* Quick Mode Switcher Pills */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('available-rides');
                  setSheetState('half');
                }}
                className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold text-center border transition-all ${
                  activeTab === 'available-rides'
                    ? 'bg-[#173F35] text-white border-[#173F35]'
                    : 'bg-white dark:bg-[#102F28] text-slate-700 dark:text-slate-200 border-[#E7E5DD] dark:border-[#23584B]'
                }`}
              >
                Available Rides ({availableRides.length})
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('new-ride');
                  setSheetState('half');
                }}
                className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold text-center border transition-all ${
                  activeTab === 'new-ride'
                    ? 'bg-[#173F35] text-white border-[#173F35]'
                    : 'bg-white dark:bg-[#102F28] text-slate-700 dark:text-slate-200 border-[#E7E5DD] dark:border-[#23584B]'
                }`}
              >
                Book a New Ride
              </button>
            </div>
          </div>
        )}

        {/* ========================================================
            B. HALF-EXPANDED & FULLY EXPANDED STATES
        ======================================================== */}
        {sheetState !== 'collapsed' && (
          <div className="flex-1 overflow-y-auto px-4 pb-20 space-y-3.5">
            {/* 1. Mode Tabs (Available Rides vs Book a New Ride) */}
            <div className="flex rounded-2xl p-1 bg-[#F8F6F0] dark:bg-[#102F28] border border-[#E7E5DD] dark:border-[#23584B]">
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
            </div>

            {/* 2. Pickup & Destination Inputs */}
            <div className="relative p-3 rounded-2xl bg-[#F8F6F0] dark:bg-[#102F28] border border-[#E7E5DD] dark:border-[#23584B] space-y-2.5">
              {/* Pickup Input */}
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#26734D] text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                  A
                </div>
                <input
                  type="text"
                  placeholder="Pickup Location"
                  value={pickup.address}
                  onChange={(e) => setPickup((p) => ({ ...p, address: e.target.value }))}
                  onFocus={() => {
                    setSheetState('full');
                    setActiveSearchField('pickup');
                  }}
                  className="flex-1 bg-white dark:bg-[#173F35] border border-[#E7E5DD] dark:border-[#23584B] rounded-xl px-3 py-2 text-xs font-medium text-[#171A17] dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#173F35]"
                />
                <button
                  type="button"
                  onClick={() => setPickOnMapMode('pickup')}
                  title="Pick on Map"
                  className="p-2 rounded-xl bg-white dark:bg-[#173F35] text-[#173F35] dark:text-[#C6A76B] border border-[#E7E5DD] dark:border-[#23584B]"
                >
                  <MapPin className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Destination Input */}
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#C6A76B] text-[#171A17] flex items-center justify-center font-bold text-xs flex-shrink-0">
                  B
                </div>
                <input
                  type="text"
                  placeholder="Where are you going?"
                  value={destination.address}
                  onChange={(e) => setDestination((d) => ({ ...d, address: e.target.value }))}
                  onFocus={() => {
                    setSheetState('full');
                    setActiveSearchField('destination');
                  }}
                  className="flex-1 bg-white dark:bg-[#173F35] border border-[#E7E5DD] dark:border-[#23584B] rounded-xl px-3 py-2 text-xs font-medium text-[#171A17] dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#173F35]"
                />
                <button
                  type="button"
                  onClick={() => setPickOnMapMode('destination')}
                  title="Pick on Map"
                  className="p-2 rounded-xl bg-white dark:bg-[#173F35] text-[#173F35] dark:text-[#C6A76B] border border-[#E7E5DD] dark:border-[#23584B]"
                >
                  <MapPin className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Swap Button */}
              <button
                type="button"
                onClick={handleSwapLocations}
                className="absolute right-12 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white dark:bg-[#173F35] border border-[#E7E5DD] dark:border-[#23584B] text-slate-500 flex items-center justify-center shadow-sm"
              >
                <ArrowUpDown className="w-3 h-3" />
              </button>
            </div>

            {/* Route Summary Badge if calculated */}
            {routeInfo && (
              <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#26734D]/10 border border-[#26734D]/20 text-xs">
                <span className="font-semibold text-[#26734D] flex items-center gap-1">
                  <Navigation className="w-3.5 h-3.5" /> {routeInfo.distanceText || `${routeInfo.distanceKm} km`}
                </span>
                <span className="text-[#4E554B] dark:text-[#A0B2A6]">
                  Est. Time: <strong>{routeInfo.durationText || `${routeInfo.durationMinutes} mins`}</strong>
                </span>
              </div>
            )}

            {/* ========================================================
                TAB 1: AVAILABLE RIDES VIEW
            ======================================================== */}
            {activeTab === 'available-rides' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#4E554B] dark:text-[#A0B2A6]">
                    Nearby Rides ({availableRides.length})
                  </h3>
                  <button
                    type="button"
                    onClick={() => setSheetState('full')}
                    className="text-xs text-[#173F35] dark:text-[#C6A76B] font-semibold"
                  >
                    View All
                  </button>
                </div>

                {loadingRides ? (
                  <div className="p-6 text-center text-xs text-slate-400">Loading nearby drivers...</div>
                ) : availableRides.length === 0 ? (
                  <div className="p-6 rounded-2xl bg-[#F8F6F0] dark:bg-[#102F28] text-center space-y-2">
                    <Car className="w-8 h-8 mx-auto text-slate-400" />
                    <p className="text-xs font-semibold text-[#171A17] dark:text-white">
                      No matching rides found
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Be the first to request a ride or switch to Book a New Ride!
                    </p>
                    <button
                      type="button"
                      onClick={() => setActiveTab('new-ride')}
                      className="px-4 py-2 rounded-xl bg-[#173F35] text-white text-xs font-bold"
                    >
                      Create Custom Request
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {availableRides.slice(0, sheetState === 'full' ? 20 : 3).map((ride) => {
                      const isSelected = selectedRide?.id === ride.id;
                      const pricePkr = Math.round((ride.pricePerSeat || 12) * 280);

                      return (
                        <div
                          key={ride.id}
                          onClick={() => {
                            setSelectedRide(ride);
                            if (ride.pickupAddress && !pickup.address) {
                              setPickup((p) => ({ ...p, address: ride.pickupAddress }));
                            }
                            if (ride.destinationAddress && !destination.address) {
                              setDestination((d) => ({ ...d, address: ride.destinationAddress }));
                            }
                          }}
                          className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#173F35]/5 border-[#173F35] dark:border-[#C6A76B] shadow-md'
                              : 'bg-white dark:bg-[#102F28] border-[#E7E5DD] dark:border-[#23584B]'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-[#173F35] text-white flex items-center justify-center font-bold text-xs">
                                {ride.rider?.name?.[0] || 'R'}
                              </div>
                              <div>
                                <h4 className="text-xs font-bold text-[#171A17] dark:text-white">
                                  {ride.rider?.name || 'Verified Driver'}
                                </h4>
                                <div className="flex items-center gap-1 text-[10px] text-amber-500">
                                  <Star className="w-2.5 h-2.5 fill-amber-500" />
                                  <span>{ride.rider?.profile?.averageRating?.toFixed(1) || '4.9'}</span>
                                  <span className="text-slate-400">
                                    • {ride.vehicle?.brand || 'Car'} {ride.vehicle?.model || ''}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-sm font-extrabold text-[#173F35] dark:text-[#C6A76B]">
                                PKR {pricePkr.toLocaleString()}
                              </span>
                              <p className="text-[10px] text-slate-400">{ride.seatsLeft || ride.availableSeats} seat left</p>
                            </div>
                          </div>

                          <div className="text-[11px] text-slate-600 dark:text-slate-300 space-y-0.5 mb-2">
                            <p className="truncate">📍 {ride.pickupAddress}</p>
                            <p className="truncate">🎯 {ride.destinationAddress}</p>
                          </div>

                          {isSelected && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleConfirmBooking();
                              }}
                              disabled={bookingLoading}
                              className="w-full py-2.5 rounded-xl bg-[#173F35] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-98"
                            >
                              {bookingLoading ? 'Reserving Seat...' : 'Request to Join This Ride'}
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ========================================================
                TAB 2: BOOK A NEW RIDE (inDrive Inspired Custom Offer)
            ======================================================== */}
            {activeTab === 'new-ride' && (
              <div className="space-y-3.5">
                {/* Vehicle Selection Cards */}
                <div>
                  <label className="block text-xs font-bold text-[#4E554B] dark:text-[#A0B2A6] mb-2">
                    Select Vehicle Class
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.values(VEHICLE_RATES).map((veh) => {
                      const isSelected = vehicleType === veh.id;
                      return (
                        <button
                          key={veh.id}
                          type="button"
                          onClick={() => setVehicleType(veh.id)}
                          className={`p-2.5 rounded-2xl border text-center transition-all ${
                            isSelected
                              ? 'bg-[#173F35] text-white border-[#173F35] shadow-md scale-102'
                              : 'bg-white dark:bg-[#102F28] text-slate-700 dark:text-slate-200 border-[#E7E5DD] dark:border-[#23584B]'
                          }`}
                        >
                          <div className="text-xl mb-1">{veh.icon}</div>
                          <div className="text-xs font-bold">{veh.name.split('/')[0]}</div>
                          <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-[#C6A76B]' : 'text-slate-400'}`}>
                            {veh.capacity} seat{veh.capacity > 1 ? 's' : ''}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* inDrive-Style Fair Price Offer */}
                <div className="p-3.5 rounded-2xl bg-[#F8F6F0] dark:bg-[#102F28] border border-[#E7E5DD] dark:border-[#23584B] space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-[#171A17] dark:text-white">
                        Your Offer Price (PKR)
                      </span>
                      <p className="text-[10px] text-slate-500">
                        Recommended: ~PKR {estimatedFare.toLocaleString()}
                      </p>
                    </div>
                    <div className="w-32">
                      <input
                        type="number"
                        placeholder={String(estimatedFare)}
                        value={customOfferPrice}
                        onChange={(e) => setCustomOfferPrice(e.target.value)}
                        className="w-full text-right font-extrabold text-sm px-3 py-1.5 rounded-xl bg-white dark:bg-[#173F35] border border-[#E7E5DD] dark:border-[#23584B] text-[#173F35] dark:text-[#C6A76B] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Seat Selection */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#E7E5DD] dark:border-[#23584B]">
                    <span className="text-xs text-slate-600 dark:text-slate-300">Number of Passengers</span>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4].map((n) => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setSeats(n)}
                          className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center ${
                            seats === n
                              ? 'bg-[#173F35] text-white'
                              : 'bg-white dark:bg-[#173F35] text-slate-700 dark:text-slate-300 border border-[#E7E5DD] dark:border-[#23584B]'
                          }`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Passenger Notes / Request details */}
                <input
                  type="text"
                  placeholder="Notes for driver (e.g. 2 bags, AC required)..."
                  value={passengerNotes}
                  onChange={(e) => setPassengerNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#F8F6F0] dark:bg-[#102F28] border border-[#E7E5DD] dark:border-[#23584B] text-xs text-[#171A17] dark:text-white placeholder-slate-400"
                />

                {/* Confirm Booking Button */}
                <button
                  type="button"
                  onClick={handleConfirmBooking}
                  disabled={bookingLoading}
                  className="w-full py-3.5 rounded-2xl bg-[#173F35] hover:bg-[#102F28] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg active:scale-98 transition-all"
                >
                  {bookingLoading ? 'Requesting Ride...' : `Confirm Booking • PKR ${(customOfferPrice || estimatedFare).toLocaleString()}`}
                </button>
              </div>
            )}

            {/* 3. Recent Locations Shortcuts */}
            {recentPlaces.length > 0 && sheetState === 'full' && (
              <div className="pt-2">
                <span className="text-xs font-bold text-[#4E554B] dark:text-[#A0B2A6] block mb-2">
                  Recent Locations
                </span>
                <div className="space-y-1.5">
                  {recentPlaces.map((place, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        if (activeSearchField === 'pickup') {
                          setPickup(place);
                        } else {
                          setDestination(place);
                        }
                      }}
                      className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-[#F8F6F0] dark:hover:bg-[#102F28] cursor-pointer text-xs"
                    >
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate text-slate-700 dark:text-slate-300">{place.address}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* 4. Compact Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 inset-x-0 h-14 bg-white/95 dark:bg-[#102F28]/95 backdrop-blur-md border-t border-[#E7E5DD] dark:border-[#23584B] z-40 flex items-center justify-around px-2 pb-safe">
        <Link
          href="/"
          className="flex flex-col items-center justify-center py-1 px-3 text-[#4E554B] dark:text-[#A0B2A6] hover:text-[#173F35]"
        >
          <Home className="w-4 h-4" />
          <span className="text-[10px] font-semibold mt-0.5">Home</span>
        </Link>

        <button
          type="button"
          onClick={() => {
            setSheetState('half');
          }}
          className="flex flex-col items-center justify-center py-1 px-3 text-[#173F35] dark:text-[#C6A76B] font-bold"
        >
          <Car className="w-4 h-4" />
          <span className="text-[10px] font-semibold mt-0.5">Book Ride</span>
        </button>

        <Link
          href="/dashboard/traveler/bookings"
          className="flex flex-col items-center justify-center py-1 px-3 text-[#4E554B] dark:text-[#A0B2A6] hover:text-[#173F35]"
        >
          <Calendar className="w-4 h-4" />
          <span className="text-[10px] font-semibold mt-0.5">My Rides</span>
        </Link>

        <Link
          href="/profile"
          className="flex flex-col items-center justify-center py-1 px-3 text-[#4E554B] dark:text-[#A0B2A6] hover:text-[#173F35]"
        >
          <User className="w-4 h-4" />
          <span className="text-[10px] font-semibold mt-0.5">Profile</span>
        </Link>
      </nav>
    </div>
  );
}


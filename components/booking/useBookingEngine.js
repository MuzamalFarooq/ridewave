'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { useUserLocation } from '@/contexts/LocationContext';
import { calculateRoute, reverseGeocode } from '@/lib/maps';

// Vehicle rate constants for Pakistan market (PKR)
export const VEHICLE_RATES = {
  CAR: {
    id: 'CAR',
    name: 'Car / Sedan',
    icon: '🚗',
    baseFare: 150,
    perKmRate: 48,
    perMinRate: 4,
    capacity: 4,
    description: 'Comfortable air-conditioned ride',
  },
  BIKE: {
    id: 'BIKE',
    name: 'Motorcycle',
    icon: '🏍️',
    baseFare: 80,
    perKmRate: 24,
    perMinRate: 2,
    capacity: 1,
    description: 'Fast, budget-friendly solo ride',
  },
  VAN: {
    id: 'VAN',
    name: 'Van / MPV',
    icon: '🚐',
    baseFare: 250,
    perKmRate: 70,
    perMinRate: 6,
    capacity: 7,
    description: 'Group travel with luggage space',
  },
};

export function useBookingEngine() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const { userLocation, detectUserLocation } = useUserLocation();

  // Active view tab: 'new-ride' | 'available-rides'
  const initialTab = searchParams.get('mode') === 'new' ? 'new-ride' : 'available-rides';
  const [activeTab, setActiveTab] = useState(initialTab);

  // Locations state
  const [pickup, setPickup] = useState({
    address: searchParams.get('pickup') || searchParams.get('from') || '',
    lat: searchParams.get('pickupLat') ? parseFloat(searchParams.get('pickupLat')) : null,
    lng: searchParams.get('pickupLng') ? parseFloat(searchParams.get('pickupLng')) : null,
  });

  const [destination, setDestination] = useState({
    address: searchParams.get('destination') || searchParams.get('to') || '',
    lat: searchParams.get('destLat') ? parseFloat(searchParams.get('destLat')) : null,
    lng: searchParams.get('destLng') ? parseFloat(searchParams.get('destLng')) : null,
  });

  // Route & Route Calculation
  const [routeInfo, setRouteInfo] = useState(null);
  const [calculatingRoute, setCalculatingRoute] = useState(false);

  // Booking Parameters
  const [vehicleType, setVehicleType] = useState('CAR');
  const [seats, setSeats] = useState(1);
  const [departureDate, setDepartureDate] = useState(
    searchParams.get('date') || new Date().toISOString().split('T')[0]
  );
  const [customOfferPrice, setCustomOfferPrice] = useState('');
  const [passengerNotes, setPassengerNotes] = useState('');

  // Map interaction mode: 'pickup' | 'destination' | null
  const [pickOnMapMode, setPickOnMapMode] = useState(null);

  // Available Published Rides
  const [availableRides, setAvailableRides] = useState([]);
  const [loadingRides, setLoadingRides] = useState(false);
  const [selectedRide, setSelectedRide] = useState(null);
  const [rideFilters, setRideFilters] = useState({
    vehicleType: '',
    maxPrice: '',
    instantBooking: false,
    womenOnly: false,
  });

  // Booking Execution State
  const [bookingLoading, setBookingLoading] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Recent places history (lazy initialization from localStorage)
  const [recentPlaces, setRecentPlaces] = useState(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem('ridewave_recent_places');
      return stored ? JSON.parse(stored).slice(0, 5) : [];
    } catch {
      return [];
    }
  });

  const saveRecentPlace = useCallback((place) => {
    if (!place?.address) return;
    setRecentPlaces((prev) => {
      const filtered = prev.filter((p) => p.address !== place.address);
      const updated = [{ address: place.address, lat: place.lat, lng: place.lng }, ...filtered].slice(0, 5);
      try {
        localStorage.setItem('ridewave_recent_places', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  }, []);

  // Autofill pickup with user GPS location if empty
  useEffect(() => {
    if (userLocation?.address && !pickup.address && !pickup.lat) {
      const timer = setTimeout(() => {
        setPickup({
          address: userLocation.address,
          lat: userLocation.lat,
          lng: userLocation.lng,
        });
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [userLocation?.address, userLocation?.lat, userLocation?.lng, pickup.address, pickup.lat]);

  // Recalculate route whenever pickup and destination change
  useEffect(() => {
    let isCancelled = false;

    async function computeRoute() {
      if (!pickup.address || !destination.address) {
        setRouteInfo(null);
        return;
      }

      setCalculatingRoute(true);
      try {
        const origin = pickup.lat && pickup.lng
          ? { lat: pickup.lat, lng: pickup.lng }
          : pickup.address;

        const dest = destination.lat && destination.lng
          ? { lat: destination.lat, lng: destination.lng }
          : destination.address;

        const result = await calculateRoute(origin, dest);
        if (!isCancelled && result) {
          setRouteInfo(result);
        }
      } catch (err) {
        console.warn('Route calculation fallback:', err?.message);
        if (pickup.lat && pickup.lng && destination.lat && destination.lng) {
          const R = 6371;
          const dLat = ((destination.lat - pickup.lat) * Math.PI) / 180;
          const dLng = ((destination.lng - pickup.lng) * Math.PI) / 180;
          const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((pickup.lat * Math.PI) / 180) *
              Math.cos((destination.lat * Math.PI) / 180) *
              Math.sin(dLng / 2) *
              Math.sin(dLng / 2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          const estKm = Math.round(R * c * 1.25);
          const estMin = Math.round(estKm * 2.5);

          if (!isCancelled) {
            setRouteInfo({
              distanceKm: estKm,
              durationMinutes: estMin,
              distanceText: `${estKm} km`,
              durationText: `~${estMin} mins`,
              fallback: true,
            });
          }
        }
      } finally {
        if (!isCancelled) setCalculatingRoute(false);
      }
    }

    const timer = setTimeout(computeRoute, 400);
    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [pickup.address, pickup.lat, pickup.lng, destination.address, destination.lat, destination.lng]);

  // Calculate estimated fare for current vehicle and distance
  const estimatedFare = useMemo(() => {
    const rate = VEHICLE_RATES[vehicleType] || VEHICLE_RATES.CAR;
    const distance = routeInfo?.distanceKm || 10;
    const duration = routeInfo?.durationMinutes || 25;

    const base = rate.baseFare;
    const distanceCost = distance * rate.perKmRate;
    const timeCost = duration * rate.perMinRate;
    const calculated = Math.round((base + distanceCost + timeCost) * seats);

    return Math.max(calculated, rate.baseFare);
  }, [vehicleType, routeInfo?.distanceKm, routeInfo?.durationMinutes, seats]);

  // Fetch available published rides from API
  const fetchAvailableRides = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        status: 'PUBLISHED',
        limit: '20',
      });

      if (pickup.address) params.set('pickup', pickup.address.split(',')[0].trim());
      if (destination.address) params.set('destination', destination.address.split(',')[0].trim());
      if (rideFilters.vehicleType) params.set('vehicleType', rideFilters.vehicleType);
      if (rideFilters.maxPrice) params.set('maxPrice', rideFilters.maxPrice);

      const res = await fetch(`/api/rides?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to load rides');
      const data = await res.json();
      setAvailableRides(data.rides || []);
    } catch (err) {
      console.warn('Error loading available rides:', err?.message);
    }
  }, [pickup.address, destination.address, rideFilters.vehicleType, rideFilters.maxPrice]);

  // Fetch rides when filters or search locations change
  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const params = new URLSearchParams({
          status: 'PUBLISHED',
          limit: '20',
        });
        if (pickup.address) params.set('pickup', pickup.address.split(',')[0].trim());
        if (destination.address) params.set('destination', destination.address.split(',')[0].trim());
        if (rideFilters.vehicleType) params.set('vehicleType', rideFilters.vehicleType);
        if (rideFilters.maxPrice) params.set('maxPrice', rideFilters.maxPrice);

        const res = await fetch(`/api/rides?${params.toString()}`);
        if (!res.ok) return;
        const data = await res.json();
        if (!ignore && data.rides) {
          setAvailableRides(data.rides);
        }
      } catch (e) {
        // Ignore network errors in effect
      }
    })();

    return () => {
      ignore = true;
    };
  }, [pickup.address, destination.address, rideFilters.vehicleType, rideFilters.maxPrice]);

  // Handle map click for setting pickup / destination
  const handleMapClick = useCallback(async (coords) => {
    if (!coords || !coords.lat || !coords.lng) return;

    try {
      toast.loading('Resolving address...', { id: 'geo-resolve' });
      const address = await reverseGeocode(coords.lat, coords.lng);
      toast.dismiss('geo-resolve');

      if (pickOnMapMode === 'pickup' || (!pickOnMapMode && !pickup.address)) {
        setPickup({ address, lat: coords.lat, lng: coords.lng });
        saveRecentPlace({ address, lat: coords.lat, lng: coords.lng });
        toast.success(`📍 Pickup set: ${address.split(',')[0]}`);
        setPickOnMapMode(null);
      } else if (pickOnMapMode === 'destination' || (!pickOnMapMode && pickup.address && !destination.address)) {
        setDestination({ address, lat: coords.lat, lng: coords.lng });
        saveRecentPlace({ address, lat: coords.lat, lng: coords.lng });
        toast.success(`🎯 Destination set: ${address.split(',')[0]}`);
        setPickOnMapMode(null);
      } else {
        setDestination({ address, lat: coords.lat, lng: coords.lng });
        saveRecentPlace({ address, lat: coords.lat, lng: coords.lng });
        toast.success(`🎯 Updated destination: ${address.split(',')[0]}`);
      }
    } catch (err) {
      toast.dismiss('geo-resolve');
      toast.error('Could not get address for this spot');
    }
  }, [pickOnMapMode, pickup.address, destination.address, saveRecentPlace]);

  // Use current GPS location as pickup
  const handleUseCurrentLocation = useCallback(async () => {
    try {
      toast.loading('Locating you...', { id: 'gps-locate' });
      const loc = await detectUserLocation(false);
      toast.dismiss('gps-locate');

      if (loc && loc.address) {
        setPickup({ address: loc.address, lat: loc.lat, lng: loc.lng });
        saveRecentPlace({ address: loc.address, lat: loc.lat, lng: loc.lng });
        toast.success(`📍 Current location set`);
      }
    } catch (err) {
      toast.dismiss('gps-locate');
      toast.error('Could not access current location');
    }
  }, [detectUserLocation, saveRecentPlace]);

  // Swap pickup & destination
  const handleSwapLocations = useCallback(() => {
    const temp = { ...pickup };
    setPickup({ ...destination });
    setDestination(temp);
    toast.success('Locations swapped', { duration: 1500 });
  }, [pickup, destination]);

  // Direct Booking Confirmation Handler
  const handleConfirmBooking = useCallback(async () => {
    if (!session) {
      toast.error('Please sign in to confirm your booking');
      router.push(`/login?callbackUrl=${encodeURIComponent('/find-ride')}`);
      return;
    }

    if (!pickup.address) {
      toast.error('Please specify a pickup location');
      return;
    }

    if (!destination.address) {
      toast.error('Please specify a destination');
      return;
    }

    setBookingLoading(true);

    try {
      if (selectedRide) {
        const res = await fetch('/api/bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            rideId: selectedRide.id,
            seatsBooked: seats,
            passengerNotes: passengerNotes.trim() || undefined,
            paymentMethod: 'CASH',
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Booking failed');

        toast.success('🎉 Booking confirmed successfully!');
        setConfirmedBooking(data.booking);
        router.push(`/dashboard/traveler/bookings`);
        return;
      }

      const offerPrice = customOfferPrice ? parseFloat(customOfferPrice) : estimatedFare;

      toast.success(
        `🚗 Ride requested! Offered: PKR ${offerPrice.toLocaleString()}. Drivers are being notified.`,
        { duration: 5000 }
      );

      saveRecentPlace(pickup);
      saveRecentPlace(destination);
      setActiveTab('available-rides');
    } catch (err) {
      toast.error(err.message || 'Could not complete booking request');
    } finally {
      setBookingLoading(false);
    }
  }, [
    session,
    pickup,
    destination,
    selectedRide,
    seats,
    passengerNotes,
    customOfferPrice,
    estimatedFare,
    router,
    saveRecentPlace,
  ]);

  return {
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
    departureDate,
    setDepartureDate,
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
    confirmedBooking,
    handleConfirmBooking,
    recentPlaces,
    saveRecentPlace,
    userLocation,
  };
}

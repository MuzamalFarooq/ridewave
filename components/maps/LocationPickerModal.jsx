'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, Search, X, Check, Crosshair, Loader2, Compass, AlertCircle, RefreshCw } from 'lucide-react';
import { loadGoogleMaps, reverseGeocodeDetailed, geocodeAddress, getCurrentLocation } from '@/lib/maps';

// Default fallback city (Lahore, Pakistan)
const DEFAULT_CENTER = {
  lat: 31.5204,
  lng: 74.3587,
  address: 'Lahore, Pakistan',
};

// Dark theme map styling for RideWave design system
const DARK_MAP_STYLES = [
  { elementType: 'geometry', stylers: [{ color: '#1f2937' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#1f2937' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#9ca3af' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#374151' }] },
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#d1d5db' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#111827' }] },
  { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
];

export default function LocationPickerModal({
  isOpen,
  onClose,
  title = 'Pick Exact Location',
  initialAddress = '',
  fieldType = 'from', // 'from' | 'to'
  onSelectLocation,
}) {
  const mapRef = useRef(null);
  const searchInputRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const autocompleteRef = useRef(null);
  const geoWatchIdRef = useRef(null);
  const geoTimeoutRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState(initialAddress || '');
  const [selectedLocation, setSelectedLocation] = useState({
    address: initialAddress || DEFAULT_CENTER.address,
    formattedAddress: initialAddress || DEFAULT_CENTER.address,
    lat: DEFAULT_CENTER.lat,
    lng: DEFAULT_CENTER.lng,
    latitude: DEFAULT_CENTER.lat,
    longitude: DEFAULT_CENTER.lng,
    place_id: null,
    placeId: null,
  });

  const [isGeocoding, setIsGeocoding] = useState(false);
  const [isGpsLoading, setIsGpsLoading] = useState(false);
  const [googleMapsReady, setGoogleMapsReady] = useState(false);
  const [gpsAccuracy, setGpsAccuracy] = useState(null);
  const [gpsStatus, setGpsStatus] = useState({ type: 'idle', message: '' });

  // Update marker position and pan map safely
  const updateMapAndMarker = useCallback((lat, lng, zoomLevel = null) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.panTo({ lat, lng });
      if (zoomLevel) mapInstanceRef.current.setZoom(zoomLevel);
    }
    if (markerRef.current) {
      markerRef.current.setPosition({ lat, lng });
    }
  }, []);

  // Update selected location state with address details
  const setLocationState = useCallback((lat, lng, formattedAddress, placeId = null) => {
    const cleanAddress = formattedAddress || `Lat: ${Number(lat).toFixed(4)}, Lng: ${Number(lng).toFixed(4)}`;
    setSelectedLocation({
      address: cleanAddress,
      formattedAddress: cleanAddress,
      lat: Number(lat),
      lng: Number(lng),
      latitude: Number(lat),
      longitude: Number(lng),
      place_id: placeId,
      placeId: placeId,
    });
    setSearchQuery(cleanAddress);
  }, []);

  // Reverse geocode lat/lng to address and place_id
  const performReverseGeocode = useCallback(
    async (lat, lng) => {
      setIsGeocoding(true);
      try {
        const result = await reverseGeocodeDetailed(lat, lng);
        setLocationState(lat, lng, result.formattedAddress, result.placeId);
      } catch (err) {
        console.warn('Reverse geocode error:', err);
        setLocationState(lat, lng, `Lat: ${Number(lat).toFixed(4)}, Lng: ${Number(lng).toFixed(4)}`, null);
      } finally {
        setIsGeocoding(false);
      }
    },
    [setLocationState]
  );

  // Clear running geolocation watchers
  const stopGpsWatcher = useCallback(() => {
    if (geoWatchIdRef.current !== null && typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.clearWatch(geoWatchIdRef.current);
      geoWatchIdRef.current = null;
    }
    if (geoTimeoutRef.current) {
      clearTimeout(geoTimeoutRef.current);
      geoTimeoutRef.current = null;
    }
  }, []);

  // High accuracy GPS Detection with 10-20m accuracy threshold & fallback handling
  const detectGpsLocation = useCallback(() => {
    stopGpsWatcher();

    if (typeof window === 'undefined' || !navigator.geolocation) {
      setGpsStatus({ type: 'error', message: 'Geolocation is not supported by your device or browser.' });
      return;
    }

    if (!navigator.onLine) {
      setGpsStatus({ type: 'error', message: 'You are currently offline. Using manual location selection.' });
      return;
    }

    setIsGpsLoading(true);
    setGpsAccuracy(null);
    setGpsStatus({ type: 'loading', message: 'Requesting precise GPS location...' });

    let bestFix = null;

    // Timeout safety fallback after 10 seconds
    geoTimeoutRef.current = setTimeout(() => {
      stopGpsWatcher();
      setIsGpsLoading(false);
      if (bestFix) {
        const { latitude, longitude, accuracy } = bestFix.coords;
        setGpsAccuracy(accuracy);
        updateMapAndMarker(latitude, longitude, 16);
        performReverseGeocode(latitude, longitude);
        setGpsStatus({
          type: accuracy <= 20 ? 'success' : 'poor',
          message: accuracy <= 20
            ? `GPS Location acquired (Accuracy: ±${Math.round(accuracy)}m)`
            : `GPS Signal weak (Accuracy: ±${Math.round(accuracy)}m). You can adjust marker on map.`,
        });
      } else {
        setGpsStatus({
          type: 'error',
          message: 'GPS request timed out. Please search or pick a location manually.',
        });
      }
    }, 10000);

    const geoOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    };

    geoWatchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setGpsAccuracy(accuracy);

        if (!bestFix || accuracy < bestFix.coords.accuracy) {
          bestFix = position;
        }

        // Center map and update marker preview immediately
        updateMapAndMarker(latitude, longitude, 16);

        // Accuracy threshold: 10–20 meters
        if (accuracy <= 20) {
          stopGpsWatcher();
          setIsGpsLoading(false);
          performReverseGeocode(latitude, longitude);
          setGpsStatus({
            type: 'success',
            message: `High-accuracy GPS fix (Accuracy: ±${Math.round(accuracy)}m)`,
          });
        } else {
          setGpsStatus({
            type: 'poor',
            message: `Waiting for a more accurate GPS signal... (Current: ±${Math.round(accuracy)}m)`,
          });
          performReverseGeocode(latitude, longitude);
        }
      },
      (error) => {
        stopGpsWatcher();
        setIsGpsLoading(false);
        let errorMsg = 'GPS location failed.';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMsg = 'Location permission denied. Please search or select location manually.';
            break;

          case error.POSITION_UNAVAILABLE:
            errorMsg = 'GPS position unavailable. Please search or select location manually.';
            break;

          case error.TIMEOUT:
            errorMsg = 'GPS signal request timed out. Please try again or select manually.';
            break;

          default:
            errorMsg = error.message || 'Unable to retrieve location.';
            break;
        }
        setGpsStatus({ type: 'error', message: errorMsg });
      },
      geoOptions
    );
  }, [stopGpsWatcher, updateMapAndMarker, performReverseGeocode]);

  // Handle modal lifecycle & initial geocoding / GPS trigger
  useEffect(() => {
    if (!isOpen) {
      stopGpsWatcher();
      return;
    }

    setSearchQuery(initialAddress || '');

    if (initialAddress) {
      setIsGeocoding(true);
      geocodeAddress(initialAddress)
        .then((res) => {
          if (res) {
            setLocationState(res.lat, res.lng, res.formattedAddress || initialAddress, null);
            updateMapAndMarker(res.lat, res.lng, 15);
          }
        })
        .catch(() => {
          // Automatic GPS detection if initial address fails
          detectGpsLocation();
        })
        .finally(() => setIsGeocoding(false));
    } else {
      // Trigger automatic high-accuracy GPS detection when modal opens
      detectGpsLocation();
    }

    return () => {
      stopGpsWatcher();
    };
  }, [isOpen, initialAddress, detectGpsLocation, setLocationState, updateMapAndMarker, stopGpsWatcher]);

  // Load Google Maps & Places Autocomplete
  useEffect(() => {
    if (!isOpen || !mapRef.current) return;

    let isMounted = true;

    loadGoogleMaps()
      .then((google) => {
        if (!isMounted || !google || !mapRef.current) return;

        setGoogleMapsReady(true);
        const center = { lat: selectedLocation.lat, lng: selectedLocation.lng };

        const map = new google.maps.Map(mapRef.current, {
          center,
          zoom: 14,
          disableDefaultUI: false,
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
          styles: DARK_MAP_STYLES,
        });

        mapInstanceRef.current = map;

        const pinColor = fieldType === 'from' ? '#6366f1' : '#ec4899';

        const marker = new google.maps.Marker({
          position: center,
          map,
          draggable: true,
          title: 'Selected Pickup/Drop-off Location',
          animation: google.maps.Animation.DROP,
          icon: {
            path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
            scale: 7,
            fillColor: pinColor,
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2,
          },
        });

        markerRef.current = marker;

        // Listen to marker drag events
        marker.addListener('dragend', (e) => {
          const lat = e.latLng.lat();
          const lng = e.latLng.lng();
          performReverseGeocode(lat, lng);
        });

        // Listen to map click events
        map.addListener('click', (e) => {
          const lat = e.latLng.lat();
          const lng = e.latLng.lng();
          marker.setPosition({ lat, lng });
          performReverseGeocode(lat, lng);
        });

        // Initialize Google Places Autocomplete on input field
        if (searchInputRef.current && google.maps.places) {
          const autocomplete = new google.maps.places.Autocomplete(searchInputRef.current, {
            fields: ['formatted_address', 'geometry', 'name', 'place_id'],
          });

          autocompleteRef.current = autocomplete;

          autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            if (!place || !place.geometry || !place.geometry.location) return;

            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            const address = place.formatted_address || place.name || '';
            const placeId = place.place_id || null;

            setLocationState(lat, lng, address, placeId);
            updateMapAndMarker(lat, lng, 16);
          });
        }
      })
      .catch((err) => {
        console.error('Google Maps JS API load error:', err);
        if (isMounted) setGoogleMapsReady(false);
      });

    return () => {
      isMounted = false;
      if (autocompleteRef.current && window.google?.maps?.event) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
      if (markerRef.current && window.google?.maps?.event) {
        window.google.maps.event.clearInstanceListeners(markerRef.current);
      }
      if (mapInstanceRef.current && window.google?.maps?.event) {
        window.google.maps.event.clearInstanceListeners(mapInstanceRef.current);
      }
    };
  }, [isOpen, fieldType, performReverseGeocode, setLocationState, updateMapAndMarker]);

  // Form submit search fallback
  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsGeocoding(true);
    try {
      if (window.google?.maps) {
        const res = await geocodeAddress(searchQuery);
        if (res) {
          setLocationState(res.lat, res.lng, res.formattedAddress, null);
          updateMapAndMarker(res.lat, res.lng, 15);
        }
      } else {
        // Fallback OpenStreetMap Nominatim search
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=1`,
          { headers: { 'Accept-Language': 'en' } }
        );
        if (res.ok) {
          const data = await res.json();
          if (data && data[0]) {
            const lat = parseFloat(data[0].lat);
            const lng = parseFloat(data[0].lon);
            const address = data[0].display_name;
            setLocationState(lat, lng, address, data[0].place_id ? String(data[0].place_id) : null);
            updateMapAndMarker(lat, lng, 15);
          }
        }
      }
    } catch (err) {
      console.error('Location search error:', err);
      setGpsStatus({ type: 'error', message: 'Address search failed. Please try a different location query.' });
    } finally {
      setIsGeocoding(false);
    }
  };

  // Confirm selection & return location object with all requested attributes
  const handleConfirm = () => {
    const payload = {
      lat: selectedLocation.lat,
      lng: selectedLocation.lng,
      latitude: selectedLocation.latitude,
      longitude: selectedLocation.longitude,
      address: selectedLocation.address,
      formattedAddress: selectedLocation.formattedAddress,
      place_id: selectedLocation.place_id,
      placeId: selectedLocation.placeId,
    };

    onSelectLocation?.(payload);
    onClose();
  };

  if (!isOpen) return null;

  const headerColor = fieldType === 'from' ? 'text-indigo-400' : 'text-pink-400';
  const headerBg = fieldType === 'from' ? 'bg-indigo-500/10 border-indigo-500/20' : 'bg-pink-500/10 border-pink-500/20';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-900/90">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl border ${headerBg} ${headerColor}`}>
                {fieldType === 'from' ? <MapPin className="w-5 h-5" /> : <Navigation className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-outfit">{title}</h3>
                <p className="text-xs text-slate-400">Search address, click map, or drag marker to set exact location</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
              title="Close Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Bar & GPS Button */}
          <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex flex-col sm:flex-row gap-3">
            <form onSubmit={handleSearchSubmit} className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search city, area, street, or landmark..."
                className="w-full pl-10 pr-24 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 transition-all"
              />
              <button
                type="submit"
                disabled={isGeocoding}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition-colors flex items-center gap-1 disabled:opacity-50"
              >
                {isGeocoding ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Search'}
              </button>
            </form>

            <button
              type="button"
              onClick={detectGpsLocation}
              disabled={isGpsLoading}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition-all shrink-0 active:scale-95 disabled:opacity-60"
            >
              {isGpsLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
              ) : (
                <Crosshair className="w-4 h-4 text-indigo-400" />
              )}
              <span>{isGpsLoading ? 'Detecting GPS...' : 'Use My GPS Location'}</span>
            </button>
          </div>

          {/* GPS Accuracy / Status Message Strip */}
          {gpsStatus.type !== 'idle' && (
            <div
              className={`px-4 py-2 text-xs flex items-center justify-between border-b ${
                gpsStatus.type === 'loading'
                  ? 'bg-indigo-950/40 border-indigo-900/40 text-indigo-300'
                  : gpsStatus.type === 'success'
                  ? 'bg-emerald-950/40 border-emerald-900/40 text-emerald-300'
                  : gpsStatus.type === 'poor'
                  ? 'bg-amber-950/40 border-amber-900/40 text-amber-300'
                  : 'bg-red-950/40 border-red-900/40 text-red-300'
              }`}
            >
              <div className="flex items-center gap-2">
                {gpsStatus.type === 'loading' && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {gpsStatus.type === 'success' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                {gpsStatus.type === 'poor' && <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />}
                {gpsStatus.type === 'error' && <AlertCircle className="w-3.5 h-3.5 text-red-400" />}
                <span>{gpsStatus.message}</span>
              </div>

              {gpsStatus.type === 'error' && (
                <button
                  type="button"
                  onClick={detectGpsLocation}
                  className="flex items-center gap-1 text-[11px] underline hover:text-white"
                >
                  <RefreshCw className="w-3 h-3" /> Retry
                </button>
              )}
            </div>
          )}

          {/* Interactive Google Map Section */}
          <div className="relative flex-1 min-h-[360px] bg-slate-950">
            <div ref={mapRef} className="w-full h-full min-h-[360px]" />

            {/* Fallback Display if Google Maps JS API Key is Not Available */}
            {!googleMapsReady && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4">
                  <Compass className="w-8 h-8 text-indigo-400 animate-pulse" />
                </div>
                <h4 className="text-base font-semibold text-white mb-1">Interactive Location Picker</h4>
                <p className="text-xs text-slate-400 max-w-sm mb-4">
                  Use the search bar above or click "Use My GPS Location" to auto-detect coordinates.
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-indigo-300">
                  <span>📍 Coordinates: {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}</span>
                </div>
              </div>
            )}

            {/* Geocoding Loading Floating Badge */}
            {isGeocoding && (
              <div className="absolute top-3 right-3 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-full backdrop-blur-md flex items-center gap-2 text-xs text-indigo-300 shadow-lg z-10">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Fetching address...</span>
              </div>
            )}
          </div>

          {/* Bottom Confirmation Bar */}
          <div className="p-4 sm:p-5 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-start gap-3 w-full sm:w-auto flex-1 min-w-0">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 shrink-0 mt-0.5">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
                  Formatted Address
                </span>
                <p className="text-sm font-medium text-white truncate max-w-md" title={selectedLocation.address}>
                  {selectedLocation.address || `${selectedLocation.lat.toFixed(4)}, ${selectedLocation.lng.toFixed(4)}`}
                </p>
                <span className="text-[11px] text-slate-500 font-mono">
                  Coordinates: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={!selectedLocation.address}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-semibold transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2 disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                <span>Confirm Location</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

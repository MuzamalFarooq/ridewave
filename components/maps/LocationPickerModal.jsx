'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, Search, X, Check, Crosshair, Loader2, Compass, AlertCircle, RefreshCw, AlertTriangle } from 'lucide-react';
import { loadGoogleMaps, reverseGeocodeDetailed, geocodeAddress, getCurrentLocation } from '@/lib/maps';

// Default fallback city (Lahore, Pakistan)
const DEFAULT_CENTER = {
  lat: 31.5204,
  lng: 74.3587,
  address: 'Lahore, Pakistan',
};

// Sleek dark theme map styling for RideWave design system
const DARK_MAP_STYLES = [
  { elementType: 'geometry', stylers: [{ color: '#0f172a' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0f172a' }, { weight: 2 }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#94a3b8' }] },
  { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#cbd5e1' }] },
  { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1e293b' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#334155' }] },
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#cbd5e1' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#312e81' }] },
  { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#4338ca' }] },
  { featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{ color: '#e0e7ff' }] },
  { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#1e293b' }] },
  { featureType: 'transit.station', elementType: 'labels.text.fill', stylers: [{ color: '#a5b4fc' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0284c7' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#38bdf8' }] },
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
  const geoTimeoutRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState(initialAddress || '');
  const [selectedLocation, setSelectedLocation] = useState({
    address: initialAddress || DEFAULT_CENTER.address,
    formattedAddress: initialAddress || DEFAULT_CENTER.address,
    lat: DEFAULT_CENTER.lat,
    lng: DEFAULT_CENTER.lng,
    latitude: DEFAULT_CENTER.lat,
    longitude: DEFAULT_CENTER.lng,
    placeId: null,
  });

  const [isGeocoding, setIsGeocoding] = useState(false);
  const [isGpsLoading, setIsGpsLoading] = useState(false);
  const [mapsState, setMapsState] = useState({ loading: true, error: null });
  const [gpsStatus, setGpsStatus] = useState({ type: 'idle', message: '' });

  // Update marker position and pan map safely
  const updateMapAndMarker = useCallback((lat, lng, zoomLevel = null) => {
    const numericLat = Number(lat);
    const numericLng = Number(lng);
    if (isNaN(numericLat) || isNaN(numericLng)) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.panTo({ lat: numericLat, lng: numericLng });
      if (zoomLevel) mapInstanceRef.current.setZoom(zoomLevel);
    }
    if (markerRef.current) {
      markerRef.current.setPosition({ lat: numericLat, lng: numericLng });
    }
  }, []);

  // Update selected location state with address and coordinates
  const setLocationState = useCallback((lat, lng, formattedAddress, placeId = null) => {
    const numericLat = Number(lat);
    const numericLng = Number(lng);
    const cleanAddress = formattedAddress || `Lat: ${numericLat.toFixed(4)}, Lng: ${numericLng.toFixed(4)}`;
    
    setSelectedLocation({
      address: cleanAddress,
      formattedAddress: cleanAddress,
      lat: numericLat,
      lng: numericLng,
      latitude: numericLat,
      longitude: numericLng,
      placeId: placeId,
    });
    setSearchQuery(cleanAddress);
  }, []);

  // Real-time coordinate update during marker drag
  const setRealtimeCoords = useCallback((lat, lng) => {
    const numericLat = Number(lat);
    const numericLng = Number(lng);
    setSelectedLocation((prev) => ({
      ...prev,
      lat: numericLat,
      lng: numericLng,
      latitude: numericLat,
      longitude: numericLng,
    }));
  }, []);

  // Reverse geocode lat/lng to address
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

  // GPS Location Detection with Fallback handling
  const detectGpsLocation = useCallback(async () => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setGpsStatus({ type: 'error', message: 'Geolocation is not supported by your browser.' });
      return;
    }

    setIsGpsLoading(true);
    setGpsStatus({ type: 'loading', message: 'Detecting your GPS location...' });

    try {
      const coords = await getCurrentLocation({ timeout: 10000, enableHighAccuracy: true });
      const { latitude, longitude, accuracy } = coords;

      updateMapAndMarker(latitude, longitude, 16);
      await performReverseGeocode(latitude, longitude);

      setGpsStatus({
        type: 'success',
        message: `GPS location detected (Accuracy: ±${Math.round(accuracy || 10)}m)`,
      });
    } catch (error) {
      console.warn('GPS location detection failed/denied:', error);
      let errorMsg = 'GPS location unavailable. Centered on default city.';
      if (error?.code === 1 || error?.message?.includes('denied')) {
        errorMsg = 'Location permission denied. Map centered on default city.';
      } else if (error?.code === 3 || error?.message?.includes('timeout')) {
        errorMsg = 'GPS request timed out. Map centered on default city.';
      }

      setGpsStatus({ type: 'error', message: errorMsg });

      // Fallback: center map on default city
      updateMapAndMarker(DEFAULT_CENTER.lat, DEFAULT_CENTER.lng, 13);
      if (!initialAddress) {
        setLocationState(DEFAULT_CENTER.lat, DEFAULT_CENTER.lng, DEFAULT_CENTER.address);
      }
    } finally {
      setIsGpsLoading(false);
    }
  }, [updateMapAndMarker, performReverseGeocode, initialAddress, setLocationState]);

  // Load Google Maps & Initialize Map Instance
  const initMap = useCallback(
    (forceRetry = false) => {
      if (!mapRef.current) return;

      setMapsState({ loading: true, error: null });

      loadGoogleMaps(forceRetry)
        .then((google) => {
          if (!google || !mapRef.current) {
            throw new Error('Google Maps failed to initialize.');
          }

          setMapsState({ loading: false, error: null });

          const initialCenter = {
            lat: selectedLocation.lat || DEFAULT_CENTER.lat,
            lng: selectedLocation.lng || DEFAULT_CENTER.lng,
          };

          const map = new google.maps.Map(mapRef.current, {
            center: initialCenter,
            zoom: 15,
            disableDefaultUI: false,
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
            gestureHandling: 'greedy',
            styles: DARK_MAP_STYLES,
          });

          mapInstanceRef.current = map;

          const pinColor = fieldType === 'from' ? '#6366f1' : '#ec4899';

          // Custom Marker Icon
          const marker = new google.maps.Marker({
            position: initialCenter,
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

          // Real-time position updates while dragging marker
          marker.addListener('drag', (e) => {
            const lat = e.latLng.lat();
            const lng = e.latLng.lng();
            setRealtimeCoords(lat, lng);
          });

          // Final geocode when drag ends
          marker.addListener('dragend', (e) => {
            const lat = e.latLng.lat();
            const lng = e.latLng.lng();
            performReverseGeocode(lat, lng);
          });

          // Map click to place marker
          map.addListener('click', (e) => {
            const lat = e.latLng.lat();
            const lng = e.latLng.lng();
            marker.setPosition({ lat, lng });
            performReverseGeocode(lat, lng);
          });

          // Ensure map resizes properly after modal transition
          setTimeout(() => {
            if (mapInstanceRef.current && google.maps?.event) {
              google.maps.event.trigger(mapInstanceRef.current, 'resize');
              mapInstanceRef.current.setCenter(initialCenter);
            }
          }, 300);

          // Google Places Autocomplete Search Box
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
          console.error('Google Maps load error:', err);
          setMapsState({
            loading: false,
            error: err?.message || 'Failed to load Google Maps JavaScript API. Please check your network connection.',
          });
        });
    },
    [fieldType, selectedLocation.lat, selectedLocation.lng, performReverseGeocode, setRealtimeCoords, setLocationState, updateMapAndMarker]
  );

  // Lifecycle on modal open
  useEffect(() => {
    if (!isOpen) return;

    setSearchQuery(initialAddress || '');

    if (initialAddress) {
      setIsGeocoding(true);
      geocodeAddress(initialAddress)
        .then((res) => {
          if (res) {
            setLocationState(res.lat, res.lng, res.formattedAddress || initialAddress);
            updateMapAndMarker(res.lat, res.lng, 15);
          }
        })
        .catch(() => {
          detectGpsLocation();
        })
        .finally(() => setIsGeocoding(false));
    } else {
      detectGpsLocation();
    }

    // Initialize Map
    initMap();

    return () => {
      if (geoTimeoutRef.current) clearTimeout(geoTimeoutRef.current);
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
  }, [isOpen]);

  // Form submit manual search fallback
  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsGeocoding(true);
    try {
      if (window.google?.maps) {
        const res = await geocodeAddress(searchQuery);
        if (res) {
          setLocationState(res.lat, res.lng, res.formattedAddress);
          updateMapAndMarker(res.lat, res.lng, 16);
        }
      } else {
        // Nominatim OpenStreetMap fallback
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
            updateMapAndMarker(lat, lng, 16);
          }
        }
      }
    } catch (err) {
      console.error('Search error:', err);
      setGpsStatus({ type: 'error', message: 'Address search failed. Please try another query.' });
    } finally {
      setIsGeocoding(false);
    }
  };

  // Confirm Selection & return object with address, latitude, and longitude
  const handleConfirm = () => {
    const payload = {
      address: selectedLocation.address || selectedLocation.formattedAddress,
      latitude: Number(selectedLocation.latitude),
      longitude: Number(selectedLocation.longitude),
      lat: Number(selectedLocation.lat),
      lng: Number(selectedLocation.lng),
      formattedAddress: selectedLocation.formattedAddress,
      placeId: selectedLocation.placeId || null,
    };

    onSelectLocation?.(payload);
    onClose();
  };

  if (!isOpen) return null;

  const headerColor = fieldType === 'from' ? 'text-indigo-400' : 'text-pink-400';
  const headerBg = fieldType === 'from' ? 'bg-indigo-500/10 border-indigo-500/20' : 'bg-pink-500/10 border-pink-500/20';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[90vh] max-h-[750px]"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-800 bg-slate-900/95 shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className={`p-2.5 rounded-xl border ${headerBg} ${headerColor} shrink-0`}>
                {fieldType === 'from' ? <MapPin className="w-5 h-5" /> : <Navigation className="w-5 h-5" />}
              </div>
              <div className="min-w-0">
                <h3 className="text-base sm:text-lg font-bold text-white font-outfit truncate">{title}</h3>
                <p className="text-xs text-slate-400 truncate">Search address, click map, or drag marker to set location</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors shrink-0 ml-2"
              title="Close Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Bar & GPS Trigger */}
          <div className="p-3 sm:p-4 bg-slate-950/80 border-b border-slate-800 flex flex-col sm:flex-row gap-2.5 shrink-0">
            <form onSubmit={handleSearchSubmit} className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search location, street, area, or landmark..."
                className="w-full pl-10 pr-24 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-indigo-500 transition-all"
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

          {/* GPS Status Bar */}
          {gpsStatus.type !== 'idle' && (
            <div
              className={`px-4 py-2 text-xs flex items-center justify-between border-b shrink-0 ${
                gpsStatus.type === 'loading'
                  ? 'bg-indigo-950/40 border-indigo-900/40 text-indigo-300'
                  : gpsStatus.type === 'success'
                  ? 'bg-emerald-950/40 border-emerald-900/40 text-emerald-300'
                  : gpsStatus.type === 'poor'
                  ? 'bg-amber-950/40 border-amber-900/40 text-amber-300'
                  : 'bg-slate-800/80 border-slate-700 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                {gpsStatus.type === 'loading' && <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />}
                {gpsStatus.type === 'success' && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                {gpsStatus.type === 'poor' && <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400 shrink-0" />}
                {gpsStatus.type === 'error' && <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                <span className="truncate">{gpsStatus.message}</span>
              </div>

              {gpsStatus.type === 'error' && (
                <button
                  type="button"
                  onClick={detectGpsLocation}
                  className="flex items-center gap-1 text-[11px] underline hover:text-white shrink-0 ml-2"
                >
                  <RefreshCw className="w-3 h-3" /> Retry GPS
                </button>
              )}
            </div>
          )}

          {/* Map & Error Container */}
          <div className="relative flex-1 w-full bg-slate-950 min-h-0">
            <div ref={mapRef} className="w-full h-full" />

            {/* Google Maps Loading State */}
            {mapsState.loading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-sm z-20">
                <Loader2 className="w-10 h-10 text-indigo-400 animate-spin mb-3" />
                <p className="text-sm text-slate-300 font-medium">Loading Google Maps...</p>
              </div>
            )}

            {/* Google Maps Error State with Retry Button */}
            {!mapsState.loading && mapsState.error && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 p-6 text-center z-20">
                <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4 text-red-400">
                  <AlertTriangle className="w-8 h-8" />
                </div>
                <h4 className="text-base sm:text-lg font-bold text-white mb-2 font-outfit">Google Maps Load Error</h4>
                <p className="text-xs sm:text-sm text-slate-400 max-w-md mb-6">{mapsState.error}</p>
                <button
                  type="button"
                  onClick={() => initMap(true)}
                  className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-lg flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Retry Loading Map</span>
                </button>
              </div>
            )}

            {/* Geocoding Loading Floating Badge */}
            {isGeocoding && (
              <div className="absolute top-3 right-3 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-full backdrop-blur-md flex items-center gap-2 text-xs text-indigo-300 shadow-lg z-10">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Updating address...</span>
              </div>
            )}
          </div>

          {/* Real-time Location Details & Confirm Action */}
          <div className="p-3.5 sm:p-5 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 shrink-0">
            <div className="flex items-start gap-3 w-full sm:w-auto flex-1 min-w-0">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 shrink-0 mt-0.5">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                  Selected Address
                </span>
                <p className="text-xs sm:text-sm font-medium text-white truncate max-w-lg" title={selectedLocation.address}>
                  {selectedLocation.address || 'Click map or drag marker to pick address'}
                </p>
                <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono mt-0.5">
                  <span>Lat: <strong className="text-indigo-300 font-medium">{Number(selectedLocation.latitude || selectedLocation.lat || 0).toFixed(6)}</strong></span>
                  <span>Lng: <strong className="text-indigo-300 font-medium">{Number(selectedLocation.longitude || selectedLocation.lng || 0).toFixed(6)}</strong></span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0 justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs sm:text-sm font-medium transition-colors flex-1 sm:flex-none"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={!selectedLocation.address}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs sm:text-sm font-semibold transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 flex-1 sm:flex-none disabled:opacity-50"
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

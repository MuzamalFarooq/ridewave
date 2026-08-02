'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, Search, X, Check, Crosshair, Loader2, Compass } from 'lucide-react';
import { loadGoogleMaps, reverseGeocode, geocodeAddress, getCurrentLocation } from '@/lib/maps';

export default function LocationPickerModal({
  isOpen,
  onClose,
  title = 'Pick Exact Location',
  initialAddress = '',
  fieldType = 'from', // 'from' | 'to'
  onSelectLocation,
}) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState(initialAddress || '');
  const [selectedLocation, setSelectedLocation] = useState({
    address: initialAddress || '',
    lat: 31.5204, // Default Lahore
    lng: 74.3587,
  });
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [isGpsLoading, setIsGpsLoading] = useState(false);
  const [googleMapsReady, setGoogleMapsReady] = useState(false);

  // Initialize or update location when modal opens
  useEffect(() => {
    if (!isOpen) return;

    setSearchQuery(initialAddress || '');

    // Attempt geocoding initialAddress if present, else default
    if (initialAddress) {
      setIsGeocoding(true);
      geocodeAddress(initialAddress)
        .then((res) => {
          if (res) {
            setSelectedLocation({ address: res.formattedAddress || initialAddress, lat: res.lat, lng: res.lng });
            if (mapInstanceRef.current) {
              mapInstanceRef.current.panTo({ lat: res.lat, lng: res.lng });
              markerRef.current?.setPosition({ lat: res.lat, lng: res.lng });
            }
          }
        })
        .catch(() => {
          // Keep default
        })
        .finally(() => setIsGeocoding(false));
    }
  }, [isOpen, initialAddress]);

  // Load Google Maps instance inside modal container
  useEffect(() => {
    if (!isOpen || !mapRef.current) return;

    loadGoogleMaps()
      .then((google) => {
        if (!google || !mapRef.current) return;

        setGoogleMapsReady(true);
        const center = { lat: selectedLocation.lat, lng: selectedLocation.lng };

        const map = new google.maps.Map(mapRef.current, {
          center,
          zoom: 13,
          disableDefaultUI: false,
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
          styles: [
            { elementType: 'geometry', stylers: [{ color: '#1f2937' }] },
            { elementType: 'labels.text.stroke', stylers: [{ color: '#1f2937' }] },
            { elementType: 'labels.text.fill', stylers: [{ color: '#9ca3af' }] },
            { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#374151' }] },
            { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#111827' }] },
          ],
        });

        mapInstanceRef.current = map;

        const pinColor = fieldType === 'from' ? '#6366f1' : '#ec4899';

        const marker = new google.maps.Marker({
          position: center,
          map,
          draggable: true,
          title: 'Selected Location',
          icon: {
            path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
            scale: 6,
            fillColor: pinColor,
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2,
          },
        });

        markerRef.current = marker;

        const updateFromCoords = async (lat, lng) => {
          setIsGeocoding(true);
          try {
            const addr = await reverseGeocode(lat, lng);
            setSelectedLocation({ address: addr, lat, lng });
            setSearchQuery(addr);
          } catch (e) {
            setSelectedLocation((prev) => ({ ...prev, lat, lng }));
          } finally {
            setIsGeocoding(false);
          }
        };

        map.addListener('click', (e) => {
          const lat = e.latLng.lat();
          const lng = e.latLng.lng();
          marker.setPosition({ lat, lng });
          updateFromCoords(lat, lng);
        });

        marker.addListener('dragend', (e) => {
          const lat = e.latLng.lat();
          const lng = e.latLng.lng();
          updateFromCoords(lat, lng);
        });
      })
      .catch(() => {
        setGoogleMapsReady(false);
      });
  }, [isOpen, fieldType]);

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsGeocoding(true);
    try {
      if (window.google?.maps) {
        const res = await geocodeAddress(searchQuery);
        if (res) {
          setSelectedLocation({ address: res.formattedAddress, lat: res.lat, lng: res.lng });
          if (mapInstanceRef.current) {
            mapInstanceRef.current.panTo({ lat: res.lat, lng: res.lng });
            mapInstanceRef.current.setZoom(14);
            markerRef.current?.setPosition({ lat: res.lat, lng: res.lng });
          }
        }
      } else {
        // Fallback search using Nominatim
        const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=1`, {
          headers: { 'Accept-Language': 'en' },
        });
        if (res.ok) {
          const data = await res.json();
          if (data && data[0]) {
            const lat = parseFloat(data[0].lat);
            const lng = parseFloat(data[0].lon);
            const address = data[0].display_name;
            setSelectedLocation({ address, lat, lng });
          }
        }
      }
    } catch (err) {
      console.error('Location search error:', err);
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleDetectGps = async () => {
    setIsGpsLoading(true);
    try {
      const coords = await getCurrentLocation();
      const addr = await reverseGeocode(coords.lat, coords.lng);
      setSelectedLocation({ address: addr, lat: coords.lat, lng: coords.lng });
      setSearchQuery(addr);

      if (mapInstanceRef.current) {
        mapInstanceRef.current.panTo({ lat: coords.lat, lng: coords.lng });
        mapInstanceRef.current.setZoom(15);
        markerRef.current?.setPosition({ lat: coords.lat, lng: coords.lng });
      }
    } catch (err) {
      console.error('GPS detect error:', err);
    } finally {
      setIsGpsLoading(false);
    }
  };

  const handleConfirm = () => {
    onSelectLocation?.(selectedLocation);
    onClose();
  };

  if (!isOpen) return null;

  const headerColor = fieldType === 'from' ? 'text-indigo-400' : 'text-pink-400';
  const headerBg = fieldType === 'from' ? 'bg-indigo-500/10 border-indigo-500/20' : 'bg-pink-500/10 border-pink-500/20';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl border ${headerBg} ${headerColor}`}>
                {fieldType === 'from' ? <MapPin className="w-5 h-5" /> : <Navigation className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-outfit">{title}</h3>
                <p className="text-xs text-slate-400">Click on the map or drag the pin to select your exact location</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search & Actions Bar */}
          <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex flex-col sm:flex-row gap-3">
            <form onSubmit={handleSearchSubmit} className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search city, area, or landmark..."
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
              onClick={handleDetectGps}
              disabled={isGpsLoading}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition-all shrink-0 active:scale-95"
            >
              {isGpsLoading ? <Loader2 className="w-4 h-4 animate-spin text-indigo-400" /> : <Crosshair className="w-4 h-4 text-indigo-400" />}
              <span>{isGpsLoading ? 'Detecting GPS...' : 'Use My GPS Location'}</span>
            </button>
          </div>

          {/* Interactive Map Section */}
          <div className="relative flex-1 min-h-[350px] bg-slate-950">
            <div ref={mapRef} className="w-full h-full min-h-[350px]" />

            {/* Fallback Map UI if Google Maps key is missing */}
            {!googleMapsReady && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4">
                  <Compass className="w-8 h-8 text-indigo-400 animate-pulse" />
                </div>
                <h4 className="text-base font-semibold text-white mb-1">Interactive Location Picker</h4>
                <p className="text-xs text-slate-400 max-w-sm mb-4">
                  Use the search bar above or click "Use My GPS Location" to set coordinates.
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-indigo-300">
                  <span>📍 Coordinates: {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}</span>
                </div>
              </div>
            )}

            {isGeocoding && (
              <div className="absolute top-3 right-3 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-full backdrop-blur-md flex items-center gap-2 text-xs text-indigo-300 shadow-lg">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Updating address...</span>
              </div>
            )}
          </div>

          {/* Bottom Confirmation Strip */}
          <div className="p-4 sm:p-5 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-start gap-3 w-full sm:w-auto flex-1 min-w-0">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 shrink-0 mt-0.5">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">Selected Address</span>
                <p className="text-sm font-medium text-white truncate max-w-md">
                  {selectedLocation.address || `${selectedLocation.lat.toFixed(4)}, ${selectedLocation.lng.toFixed(4)}`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 justify-end">
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
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

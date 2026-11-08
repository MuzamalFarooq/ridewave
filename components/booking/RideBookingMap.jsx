'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Loader2, Navigation, Crosshair, MapPin, Flag, Layers, ZoomIn, ZoomOut, Compass } from 'lucide-react';
import { loadGoogleMaps } from '@/lib/maps';

// Premium RideWave map styling (Clean, dark-accented modern style)
const RIDEWAVE_MAP_STYLES = [
  { elementType: 'geometry', stylers: [{ color: '#172621' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#102F28' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#C6A76B' }] },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#DCE7DF' }],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#A0B2A6' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#102F28' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#6B9080' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#233F36' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#162E26' }],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#F8F6F0' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#2E5347' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#1B382F' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#C6A76B' }],
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{ color: '#1F3C32' }],
  },
  {
    featureType: 'transit.station',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#C6A76B' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#0D211C' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#516E65' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#0D211C' }],
  },
];

export default function RideBookingMap({
  pickup,
  destination,
  routeInfo,
  userLocation,
  availableRides = [],
  selectedRide = null,
  onSelectRide = null,
  onMapClick = null,
  pickOnMapMode = null,
  className = '',
}) {
  const mapElementRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const directionsRendererRef = useRef(null);
  const onMapClickRef = useRef(onMapClick);
  const userLocationRef = useRef(userLocation);

  useEffect(() => {
    onMapClickRef.current = onMapClick;
    userLocationRef.current = userLocation;
  });

  const markersRef = useRef({
    user: null,
    pickup: null,
    destination: null,
    rides: [],
  });

  const [loading, setLoading] = useState(true);
  const [mapError, setMapError] = useState(null);
  const [mapReady, setMapReady] = useState(false);

  // Initialize Google Maps instance
  useEffect(() => {
    let isCancelled = false;

    loadGoogleMaps()
      .then((google) => {
        if (isCancelled || !mapElementRef.current) return;

        // Default initial center (User location if available, otherwise Lahore coordinates)
        const initialLat = userLocationRef.current?.lat || 31.5204;
        const initialLng = userLocationRef.current?.lng || 74.3587;

        const map = new google.maps.Map(mapElementRef.current, {
          center: { lat: initialLat, lng: initialLng },
          zoom: 13,
          disableDefaultUI: true,
          zoomControl: false,
          gestureHandling: 'greedy',
          styles: RIDEWAVE_MAP_STYLES,
        });

        mapInstanceRef.current = map;

        // Attach Map Click Listener
        map.addListener('click', (e) => {
          if (onMapClickRef.current && e.latLng) {
            onMapClickRef.current({
              lat: e.latLng.lat(),
              lng: e.latLng.lng(),
            });
          }
        });

        // Initialize DirectionsRenderer for rendering route
        const renderer = new google.maps.DirectionsRenderer({
          map,
          suppressMarkers: true, // We render our own luxury custom markers
          polylineOptions: {
            strokeColor: '#C6A76B', // RideWave Gold
            strokeWeight: 5,
            strokeOpacity: 0.9,
          },
        });
        directionsRendererRef.current = renderer;

        setLoading(false);
        setMapReady(true);

        // Ensure map resizes properly after DOM settlement
        [0, 100, 300, 600].forEach((delay) => {
          setTimeout(() => {
            if (mapInstanceRef.current && window.google?.maps?.event) {
              window.google.maps.event.trigger(mapInstanceRef.current, 'resize');
            }
          }, delay);
        });
      })
      .catch((err) => {
        console.warn('Map initialization note:', err?.message);
        if (!isCancelled) {
          setMapError(err?.message || 'Google Maps failed to load. Check API key, referrers, and network.');
          setLoading(false);
        }
      });

    const authFailHandler = (e) => {
      setMapError(e?.detail?.message || 'Google Maps authorization failed. Verify API key, billing, and HTTP referrers in Google Cloud Console.');
      setLoading(false);
    };

    window.addEventListener('google-maps-auth-failure', authFailHandler);

    return () => {
      isCancelled = true;
      window.removeEventListener('google-maps-auth-failure', authFailHandler);
    };
  }, []);

  // Observe map container resize and trigger Google Maps resize
  useEffect(() => {
    if (!mapElementRef.current) return;

    let ro = null;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => {
        if (mapInstanceRef.current && window.google?.maps?.event) {
          window.google.maps.event.trigger(mapInstanceRef.current, 'resize');
        }
      });
      ro.observe(mapElementRef.current);
    }

    return () => {
      if (ro) ro.disconnect();
    };
  }, []);

  // Update User GPS Location Marker & Pan to user location
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !window.google?.maps || !userLocation?.lat || !userLocation?.lng) return;

    const userPos = { lat: Number(userLocation.lat), lng: Number(userLocation.lng) };
    if (isNaN(userPos.lat) || isNaN(userPos.lng)) return;

    if (markersRef.current.user) {
      markersRef.current.user.setPosition(userPos);
    } else {
      const userMarker = new window.google.maps.Marker({
        position: userPos,
        map,
        title: 'You are here',
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 9,
          fillColor: '#10b981',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 3,
        },
        zIndex: 50,
      });
      markersRef.current.user = userMarker;
    }

    // Pan map to user's detected GPS coordinates
    map.panTo(userPos);
    map.setZoom(15);
  }, [mapReady, userLocation?.lat, userLocation?.lng]);

  // Update Pickup Marker & Pan if no route yet
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !window.google?.maps) return;

    if (pickup?.lat && pickup?.lng) {
      const pos = { lat: Number(pickup.lat), lng: Number(pickup.lng) };
      if (!isNaN(pos.lat) && !isNaN(pos.lng)) {
        if (!routeInfo && !destination?.lat) {
          map.panTo(pos);
          map.setZoom(15);
        }
      }

      if (markersRef.current.pickup) {
        markersRef.current.pickup.setPosition(pos);
      } else {
        markersRef.current.pickup = new window.google.maps.Marker({
          position: pos,
          map,
          title: `Pickup: ${pickup.address}`,
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="44" viewBox="0 0 36 44">
                <path d="M18 0C8.06 0 0 8.06 0 18c0 13.5 18 26 18 26s18-12.5 18-26C36 8.06 27.94 0 18 0z" fill="#173F35"/>
                <circle cx="18" cy="18" r="14" fill="#26734D"/>
                <text x="18" y="23" text-anchor="middle" fill="#FFFFFF" font-family="sans-serif" font-weight="bold" font-size="14">A</text>
              </svg>
            `),
            scaledSize: new window.google.maps.Size(36, 44),
            anchor: new window.google.maps.Point(18, 44),
          },
          zIndex: 60,
        });
      }
    } else if (markersRef.current.pickup) {
      markersRef.current.pickup.setMap(null);
      markersRef.current.pickup = null;
    }
  }, [mapReady, pickup?.lat, pickup?.lng, pickup?.address, routeInfo, destination?.lat]);

  // Update Destination Marker
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !window.google?.maps) return;

    if (destination?.lat && destination?.lng) {
      const pos = { lat: destination.lat, lng: destination.lng };
      if (markersRef.current.destination) {
        markersRef.current.destination.setPosition(pos);
      } else {
        markersRef.current.destination = new window.google.maps.Marker({
          position: pos,
          map,
          title: `Destination: ${destination.address}`,
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="44" viewBox="0 0 36 44">
                <path d="M18 0C8.06 0 0 8.06 0 18c0 13.5 18 26 18 26s18-12.5 18-26C36 8.06 27.94 0 18 0z" fill="#102F28"/>
                <circle cx="18" cy="18" r="14" fill="#C6A76B"/>
                <text x="18" y="23" text-anchor="middle" fill="#171A17" font-family="sans-serif" font-weight="bold" font-size="14">B</text>
              </svg>
            `),
            scaledSize: new window.google.maps.Size(36, 44),
            anchor: new window.google.maps.Point(18, 44),
          },
          zIndex: 60,
        });
      }
    } else if (markersRef.current.destination) {
      markersRef.current.destination.setMap(null);
      markersRef.current.destination = null;
    }
  }, [mapReady, destination?.lat, destination?.lng, destination?.address]);

  // Render or Clear Route Polyline
  useEffect(() => {
    const renderer = directionsRendererRef.current;
    const map = mapInstanceRef.current;
    if (!renderer || !map) return;

    if (routeInfo?.result) {
      renderer.setDirections(routeInfo.result);

      // Auto-fit bounds
      if (routeInfo.result.routes?.[0]?.bounds) {
        map.fitBounds(routeInfo.result.routes[0].bounds, {
          top: 60,
          right: 40,
          bottom: 180, // Leave clearance for bottom sheet
          left: 40,
        });
      }
    } else {
      // Clear route
      renderer.set('directions', null);
    }
  }, [mapReady, routeInfo]);

  // Render Nearby Available Rides Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !window.google?.maps) return;

    // Clear existing ride markers
    markersRef.current.rides.forEach((m) => m.setMap(null));
    markersRef.current.rides = [];

    // Filter available rides that have pickup coordinates
    availableRides.forEach((ride) => {
      const lat = ride.pickupLat || (ride.stops?.[0]?.lat);
      const lng = ride.pickupLng || (ride.stops?.[0]?.lng);
      if (!lat || !lng) return;

      const isSelected = selectedRide?.id === ride.id;
      const isCar = (ride.vehicle?.vehicleType || 'CAR') === 'CAR';
      const priceText = `PKR ${Math.round((ride.pricePerSeat || 10) * 280).toLocaleString()}`;

      const rideMarker = new window.google.maps.Marker({
        position: { lat: Number(lat), lng: Number(lng) },
        map,
        title: `${ride.rider?.name || 'Driver'}: ${priceText}`,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
              <circle cx="24" cy="24" r="20" fill="${isSelected ? '#C6A76B' : '#173F35'}" stroke="#FFFFFF" stroke-width="2.5"/>
              <text x="24" y="29" text-anchor="middle" fill="#FFFFFF" font-size="18">${isCar ? '🚗' : '🏍️'}</text>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(40, 40),
          anchor: new window.google.maps.Point(20, 20),
        },
        zIndex: isSelected ? 80 : 40,
      });

      rideMarker.addListener('click', () => {
        if (onSelectRide) onSelectRide(ride);
      });

      markersRef.current.rides.push(rideMarker);
    });
  }, [mapReady, availableRides, selectedRide, onSelectRide]);

  // Recenter Map on User GPS Location
  const handleRecenter = useCallback(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    const lat = userLocation?.lat || 31.5204;
    const lng = userLocation?.lng || 74.3587;
    map.panTo({ lat, lng });
    map.setZoom(14);
  }, [userLocation]);

  // Zoom Helpers
  const handleZoomIn = () => {
    const map = mapInstanceRef.current;
    if (map) map.setZoom(map.getZoom() + 1);
  };

  const handleZoomOut = () => {
    const map = mapInstanceRef.current;
    if (map) map.setZoom(map.getZoom() - 1);
  };

  return (
    <div className={`relative w-full h-full min-h-[300px] overflow-hidden ${className}`}>
      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#102F28]/90 text-white">
          <Loader2 className="w-10 h-10 animate-spin text-[#C6A76B] mb-3" />
          <p className="text-sm font-medium tracking-wide">Loading RideWave Live Map...</p>
        </div>
      )}

      {/* Map Canvas with guaranteed dimensions */}
      <div
        ref={mapElementRef}
        className="w-full h-full"
        style={{ width: '100%', height: '100%', minHeight: '350px' }}
      />

      {/* Error / Key Issue Notification */}
      {mapError && (
        <div className="absolute top-4 left-4 right-4 md:right-auto md:max-w-md z-30 p-3.5 rounded-2xl bg-[#102F28]/95 border border-amber-500/50 shadow-2xl text-white backdrop-blur-md">
          <div className="flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-amber-300">Map Service Status</p>
              <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">{mapError}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setLoading(true);
                setMapError(null);
                loadGoogleMaps(true)
                  .then((google) => {
                    if (mapElementRef.current) {
                      const map = new google.maps.Map(mapElementRef.current, {
                        center: { lat: userLocation?.lat || 31.5204, lng: userLocation?.lng || 74.3587 },
                        zoom: 14,
                        disableDefaultUI: true,
                        styles: RIDEWAVE_MAP_STYLES,
                      });
                      mapInstanceRef.current = map;
                      setMapReady(true);
                    }
                    setLoading(false);
                  })
                  .catch((e) => {
                    setMapError(e.message);
                    setLoading(false);
                  });
              }}
              className="px-2.5 py-1 rounded-lg bg-[#C6A76B] text-[#102F28] font-bold text-[10px] shrink-0 hover:bg-[#b8975a]"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Mode Banner: "Tap on Map" */}
      {pickOnMapMode && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 px-5 py-2.5 rounded-full bg-[#102F28] text-white shadow-xl border border-[#C6A76B] flex items-center gap-2 animate-bounce">
          <MapPin className="w-4 h-4 text-[#C6A76B]" />
          <span className="text-xs font-semibold">
            Tap anywhere to select {pickOnMapMode === 'pickup' ? 'Pickup' : 'Destination'}
          </span>
        </div>
      )}

      {/* Floating Map Controls */}
      <div className="absolute right-4 bottom-24 md:bottom-6 z-20 flex flex-col gap-2.5">
        {/* Recenter GPS */}
        <button
          type="button"
          onClick={handleRecenter}
          title="Recenter on My Location"
          className="w-11 h-11 rounded-2xl bg-white/95 dark:bg-[#173F35]/95 text-[#171A17] dark:text-white shadow-lg border border-[#E7E5DD] dark:border-[#23584B] flex items-center justify-center hover:bg-[#F8F6F0] dark:hover:bg-[#102F28] transition-all"
        >
          <Crosshair className="w-5 h-5 text-[#26734D]" />
        </button>

        {/* Zoom In */}
        <button
          type="button"
          onClick={handleZoomIn}
          title="Zoom In"
          className="w-11 h-11 rounded-2xl bg-white/95 dark:bg-[#173F35]/95 text-[#171A17] dark:text-white shadow-lg border border-[#E7E5DD] dark:border-[#23584B] flex items-center justify-center hover:bg-[#F8F6F0] dark:hover:bg-[#102F28] transition-all"
        >
          <ZoomIn className="w-5 h-5" />
        </button>

        {/* Zoom Out */}
        <button
          type="button"
          onClick={handleZoomOut}
          title="Zoom Out"
          className="w-11 h-11 rounded-2xl bg-white/95 dark:bg-[#173F35]/95 text-[#171A17] dark:text-white shadow-lg border border-[#E7E5DD] dark:border-[#23584B] flex items-center justify-center hover:bg-[#F8F6F0] dark:hover:bg-[#102F28] transition-all"
        >
          <ZoomOut className="w-5 h-5" />
        </button>
      </div>

      {/* Fallback Simulation Notice if API key missing */}
      {mapError && (
        <div className="absolute top-4 left-4 z-20 px-3 py-1.5 rounded-xl bg-amber-500/90 text-white text-xs font-medium shadow-md backdrop-blur-sm">
          Map Mode: Interactive Simulation
        </div>
      )}
    </div>
  );
}

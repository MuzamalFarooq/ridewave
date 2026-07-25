'use client';

import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { Loader2, MapPin } from 'lucide-react';

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

let mapsLoaded = false;
let mapsLoading = false;
const mapsCallbacks = [];

function loadGoogleMaps() {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') return reject('SSR');
    if (mapsLoaded) return resolve(window.google);
    mapsCallbacks.push({ resolve, reject });
    if (mapsLoading) return;
    mapsLoading = true;
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places,geometry&callback=__googleMapsLoaded`;
    script.async = true;
    script.defer = true;
    window.__googleMapsLoaded = () => {
      mapsLoaded = true;
      mapsLoading = false;
      mapsCallbacks.forEach(({ resolve }) => resolve(window.google));
      mapsCallbacks.length = 0;
    };
    script.onerror = () => {
      mapsLoading = false;
      mapsCallbacks.forEach(({ reject }) => reject(new Error('Google Maps failed to load')));
      mapsCallbacks.length = 0;
    };
    document.head.appendChild(script);
  });
}

// MapContainer — Full Google Map wrapper
const MapContainer = forwardRef(({
  center = { lat: 31.5204, lng: 74.3587 }, // Default: Lahore
  zoom = 11,
  markers = [],
  route = null, // { origin, destination, waypoints }
  onMapClick = null,
  height = '400px',
  showUserLocation = false,
  className = '',
}, ref) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const directionsRendererRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useImperativeHandle(ref, () => ({
    panTo: (position) => mapInstanceRef.current?.panTo(position),
    setZoom: (zoom) => mapInstanceRef.current?.setZoom(zoom),
    getMap: () => mapInstanceRef.current,
  }));

  useEffect(() => {
    if (!GOOGLE_MAPS_API_KEY) {
      setError('Google Maps API key not configured');
      setLoading(false);
      return;
    }

    loadGoogleMaps()
      .then((google) => {
        if (!mapRef.current) return;

        const map = new google.maps.Map(mapRef.current, {
          center,
          zoom,
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          styles: [
            { elementType: 'geometry', stylers: [{ color: '#1a1a2e' }] },
            { elementType: 'labels.text.stroke', stylers: [{ color: '#1a1a2e' }] },
            { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
            { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#38414e' }] },
            { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#212a37' }] },
            { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#17263c' }] },
          ],
        });

        mapInstanceRef.current = map;

        if (onMapClick) {
          map.addListener('click', (e) => {
            onMapClick({ lat: e.latLng.lat(), lng: e.latLng.lng() });
          });
        }

        if (showUserLocation && navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((pos) => {
            const userPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
            new google.maps.Marker({
              position: userPos,
              map,
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: '#6366f1',
                fillOpacity: 1,
                strokeColor: '#ffffff',
                strokeWeight: 2,
              },
              title: 'Your location',
            });
            map.panTo(userPos);
          });
        }

        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load Google Maps');
        setLoading(false);
      });
  }, []);

  // Update markers
  useEffect(() => {
    if (!mapInstanceRef.current || !window.google) return;

    // Clear existing markers
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    markers.forEach((markerData) => {
      const marker = new window.google.maps.Marker({
        position: markerData.position,
        map: mapInstanceRef.current,
        title: markerData.title,
        icon: markerData.icon || {
          url: markerData.type === 'pickup'
            ? 'data:image/svg+xml;base64,' + btoa('<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30"><circle cx="15" cy="15" r="12" fill="#10b981" stroke="white" stroke-width="2"/><text x="15" y="20" text-anchor="middle" fill="white" font-size="12">P</text></svg>')
            : 'data:image/svg+xml;base64,' + btoa('<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30"><circle cx="15" cy="15" r="12" fill="#ec4899" stroke="white" stroke-width="2"/><text x="15" y="20" text-anchor="middle" fill="white" font-size="12">D</text></svg>'),
          scaledSize: new window.google.maps.Size(30, 30),
        },
        animation: markerData.animate ? window.google.maps.Animation.BOUNCE : null,
      });

      if (markerData.info) {
        const infoWindow = new window.google.maps.InfoWindow({
          content: `<div style="padding:8px;font-family:sans-serif;background:#1a1a2e;color:white;border-radius:8px">${markerData.info}</div>`,
        });
        marker.addListener('click', () => infoWindow.open(mapInstanceRef.current, marker));
      }

      markersRef.current.push(marker);
    });
  }, [markers]);

  // Draw route
  useEffect(() => {
    if (!mapInstanceRef.current || !window.google || !route) return;

    if (!directionsRendererRef.current) {
      directionsRendererRef.current = new window.google.maps.DirectionsRenderer({
        suppressMarkers: false,
        polylineOptions: { strokeColor: '#6366f1', strokeWeight: 4, strokeOpacity: 0.8 },
      });
      directionsRendererRef.current.setMap(mapInstanceRef.current);
    }

    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: route.origin,
        destination: route.destination,
        waypoints: route.waypoints || [],
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === 'OK') {
          directionsRendererRef.current.setDirections(result);
        }
      }
    );
  }, [route]);

  if (error) {
    return (
      <div className="flex items-center justify-center rounded-2xl border" style={{ height, background: 'linear-gradient(135deg, #1a1a2e, #0f3460)', borderColor: 'var(--border)' }}>
        <div className="text-center text-white p-6">
          <MapPin className="w-10 h-10 mx-auto mb-2 opacity-50" />
          <p className="text-sm opacity-60">{error}</p>
          <p className="text-xs mt-1 opacity-40">Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in .env</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative rounded-2xl overflow-hidden ${className}`} style={{ height }}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-10" style={{ background: '#1a1a2e' }}>
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#6366f1' }} />
        </div>
      )}
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
});

MapContainer.displayName = 'MapContainer';
export default MapContainer;

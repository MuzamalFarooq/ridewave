'use client';

import { useEffect, useRef, useState } from 'react';
import { useSocket } from '@/contexts/SocketContext';
import { Navigation } from 'lucide-react';
import MapContainer from './MapContainer';

export default function LiveTracker({ rideId, riderId, isRider = false, pickupCoords, destinationCoords }) {
  const { socket } = useSocket();
  const mapRef = useRef(null);
  const [riderLocation, setRiderLocation] = useState(null);
  const [watchId, setWatchId] = useState(null);
  const [eta, setEta] = useState(null);
  const markerRef = useRef(null);

  // Rider: broadcast location
  useEffect(() => {
    if (!isRider || !socket || !rideId) return;

    const id = navigator.geolocation.watchPosition(
      (pos) => {
        const location = { lat: pos.coords.latitude, lng: pos.coords.longitude, speed: pos.coords.speed };
        socket.emit('location:update', { rideId, riderId, location });
        setRiderLocation(location);

        // Update marker on map
        if (mapRef.current && window.google) {
          if (!markerRef.current) {
            markerRef.current = new window.google.maps.Marker({
              position: location,
              map: mapRef.current.getMap(),
              icon: {
                url: 'data:image/svg+xml;base64,' + btoa('<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36"><circle cx="18" cy="18" r="16" fill="#6366f1" stroke="white" stroke-width="2"/><text x="18" y="23" text-anchor="middle" fill="white" font-size="14">🚗</text></svg>'),
                scaledSize: new window.google.maps.Size(36, 36),
                anchor: new window.google.maps.Point(18, 18),
              },
            });
          } else {
            markerRef.current.setPosition(location);
          }
          mapRef.current.panTo(location);
        }
      },
      (err) => console.warn('Geolocation error:', err),
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 2000 }
    );

    setWatchId(id);
    return () => { if (id) navigator.geolocation.clearWatch(id); };
  }, [isRider, socket, rideId]);

  // Passenger: receive location
  useEffect(() => {
    if (isRider || !socket || !rideId) return;

    socket.emit('tracking:join', { rideId });

    socket.on('location:update', ({ location }) => {
      setRiderLocation(location);

      if (mapRef.current && window.google) {
        if (!markerRef.current) {
          markerRef.current = new window.google.maps.Marker({
            position: location,
            map: mapRef.current.getMap(),
            animation: window.google.maps.Animation.DROP,
            title: 'Driver',
          });
        } else {
          markerRef.current.setPosition(location);
        }
        mapRef.current.panTo(location);
      }
    });

    return () => {
      socket.off('location:update');
      socket.emit('tracking:leave', { rideId });
    };
  }, [isRider, socket, rideId]);

  const markers = [
    pickupCoords && { position: pickupCoords, title: 'Pickup', type: 'pickup' },
    destinationCoords && { position: destinationCoords, title: 'Destination', type: 'destination' },
  ].filter(Boolean);

  const route = pickupCoords && destinationCoords
    ? { origin: pickupCoords, destination: destinationCoords }
    : null;

  return (
    <div className="relative">
      <MapContainer
        ref={mapRef}
        center={riderLocation || pickupCoords || { lat: 31.5204, lng: 74.3587 }}
        zoom={13}
        markers={markers}
        route={route}
        height="380px"
        className="rounded-2xl"
      />

      {/* Status overlay */}
      <div className="absolute top-3 left-3 flex items-center gap-2 px-3 py-2 rounded-xl text-white text-sm"
        style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
        <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: riderLocation ? '#10b981' : '#f59e0b' }} />
        {riderLocation
          ? isRider ? 'Broadcasting your location' : 'Live tracking active'
          : isRider ? 'Starting GPS...' : 'Waiting for driver...'
        }
      </div>

      {riderLocation?.speed != null && (
        <div className="absolute top-3 right-3 px-3 py-2 rounded-xl text-white text-sm"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
          <Navigation className="w-4 h-4 inline mr-1" />
          {Math.round((riderLocation.speed || 0) * 3.6)} km/h
        </div>
      )}
    </div>
  );
}

/**
 * Google Maps utility functions
 */

const MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

let mapsLoaded = false;

/**
 * Load the Google Maps JavaScript API
 */
export const loadGoogleMaps = () => {
  if (typeof window === 'undefined') return Promise.resolve();
  if (mapsLoaded && window.google?.maps) return Promise.resolve(window.google.maps);

  return new Promise((resolve, reject) => {
    if (window.google?.maps) {
      mapsLoaded = true;
      return resolve(window.google.maps);
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${MAPS_API_KEY}&libraries=places,geometry,drawing&loading=async`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      mapsLoaded = true;
      resolve(window.google.maps);
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

/**
 * Calculate route between two points using Directions API
 */
export const calculateRoute = (origin, destination, waypoints = []) => {
  return new Promise((resolve, reject) => {
    if (!window.google?.maps) {
      reject(new Error('Google Maps not loaded'));
      return;
    }

    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin,
        destination,
        waypoints: waypoints.map((wp) => ({ location: wp, stopover: true })),
        travelMode: window.google.maps.TravelMode.DRIVING,
        optimizeWaypoints: true,
      },
      (result, status) => {
        if (status === 'OK') {
          const route = result.routes[0].legs[0];
          resolve({
            result,
            distanceKm: route.distance.value / 1000,
            durationMinutes: Math.round(route.duration.value / 60),
            distanceText: route.distance.text,
            durationText: route.duration.text,
            polyline: result.routes[0].overview_polyline,
          });
        } else {
          reject(new Error(`Directions request failed: ${status}`));
        }
      }
    );
  });
};

/**
 * Geocode an address to coordinates
 */
export const geocodeAddress = async (address) => {
  return new Promise((resolve, reject) => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const loc = results[0].geometry.location;
        resolve({
          lat: loc.lat(),
          lng: loc.lng(),
          formattedAddress: results[0].formatted_address,
        });
      } else {
        reject(new Error(`Geocoding failed: ${status}`));
      }
    });
  });
};

/**
 * Reverse geocode coordinates to address with detailed place information (Google Maps & Nominatim fallback)
 */
export const reverseGeocodeDetailed = async (lat, lng) => {
  if (typeof window !== 'undefined' && window.google?.maps?.Geocoder) {
    try {
      const result = await new Promise((resolve, reject) => {
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: { lat: Number(lat), lng: Number(lng) } }, (results, status) => {
          if (status === 'OK' && results && results[0]) {
            resolve({
              formattedAddress: results[0].formatted_address,
              placeId: results[0].place_id || null,
            });
          } else {
            reject(new Error(`Google Geocoding failed with status: ${status}`));
          }
        });
      });
      if (result?.formattedAddress) return result;
    } catch (e) {
      console.warn('Google reverse geocode fallback to OSM:', e.message);
    }
  }

  // Fallback: OpenStreetMap Nominatim API
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`, {
      headers: { 'Accept-Language': 'en' },
    });
    if (res.ok) {
      const data = await res.json();
      if (data.display_name) {
        const parts = data.display_name.split(', ');
        const address = parts.length > 3 ? parts.slice(0, 3).join(', ') : data.display_name;
        return {
          formattedAddress: address,
          placeId: data.place_id ? String(data.place_id) : null,
        };
      }
    }
  } catch (err) {
    console.error('OSM reverse geocode failed:', err);
  }

  return {
    formattedAddress: `Lat: ${Number(lat).toFixed(4)}, Lng: ${Number(lng).toFixed(4)}`,
    placeId: null,
  };
};

/**
 * Reverse geocode coordinates to address string (backwards compatibility)
 */
export const reverseGeocode = async (lat, lng) => {
  const result = await reverseGeocodeDetailed(lat, lng);
  return result.formattedAddress;
};

/**
 * Calculate distance between two lat/lng points (Haversine formula)
 */
export const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Get user's current location with high accuracy options
 */
export const getCurrentLocation = (options = {}) => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      reject(new Error('Geolocation not supported by this device or browser'));
      return;
    }

    const defaultOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
      ...options,
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      (error) => {
        reject(error);
      },
      defaultOptions
    );
  });
};

/**
 * Watch user's location continuously
 */
export const watchLocation = (callback, errorCallback) => {
  if (!navigator.geolocation) return null;
  return navigator.geolocation.watchPosition(
    (position) => {
      callback({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy,
        speed: position.coords.speed,
        heading: position.coords.heading,
      });
    },
    errorCallback,
    { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
  );
};

/**
 * Stop watching location
 */
export const clearLocationWatch = (watchId) => {
  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId);
  }
};

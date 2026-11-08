/**
 * Google Maps utility functions
 */

let mapsLoadingPromise = null;

/**
 * Load the Google Maps JavaScript API with robust callback synchronization
 */
export const loadGoogleMaps = (forceRetry = false) => {
  if (typeof window === 'undefined') return Promise.resolve(null);

  // Return immediately if Google Maps is already fully instantiated with Map constructor
  if (window.google?.maps?.Map && window.google?.maps?.places) {
    return Promise.resolve(window.google.maps);
  }

  if (forceRetry) {
    mapsLoadingPromise = null;
    const oldScript = document.querySelector('script[id="google-maps-js"]');
    if (oldScript) oldScript.remove();
    const staleScripts = document.querySelectorAll('script[src*="maps.googleapis.com"]');
    staleScripts.forEach((s) => s.remove());
  }

  if (mapsLoadingPromise && !forceRetry) return mapsLoadingPromise;

  mapsLoadingPromise = new Promise((resolve, reject) => {
    // Re-check in case another call already initialized it
    if (window.google?.maps?.Map && window.google?.maps?.places) {
      return resolve(window.google.maps);
    }

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
    if (!apiKey) {
      console.warn('RideWave: NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not defined in environment.');
      return reject(new Error('Google Maps API key is not configured.'));
    }

    // Generate unique callback function name to avoid conflicts
    const callbackName = `__rw_google_maps_cb_${Date.now()}`;

    // Global Google Maps authentication failure handler (detects billing/referrer/invalid key)
    window.gm_authFailure = () => {
      console.error('Google Maps API Authentication Failure (gm_authFailure). Check API key, billing status, and HTTP referrer restrictions in Google Cloud Console.');
      window.dispatchEvent(new CustomEvent('google-maps-auth-failure', {
        detail: { message: 'Google Maps authentication failed. Please verify API key, billing, and HTTP referrers in Google Cloud Console.' }
      }));
    };

    // Callback invoked by Google Maps when all libraries are loaded and ready
    window[callbackName] = () => {
      try {
        delete window[callbackName];
      } catch (e) {
        window[callbackName] = undefined;
      }

      if (window.google?.maps?.Map) {
        window.dispatchEvent(new CustomEvent('google-maps-loaded'));
        resolve(window.google.maps);
      } else {
        mapsLoadingPromise = null;
        reject(new Error('Google Maps loaded but Map constructor is unavailable.'));
      }
    };

    const script = document.createElement('script');
    script.id = 'google-maps-js';
    // Places is the only optional library used by RideWave; drawing and geometry are not needed.
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=${callbackName}`;
    script.async = true;
    script.defer = true;

    script.onerror = (err) => {
      try {
        delete window[callbackName];
      } catch (e) {}
      mapsLoadingPromise = null;
      console.error('Google Maps script network error:', err);
      reject(new Error('Failed to load Google Maps script. Check network connection or ad blocker.'));
    };

    document.head.appendChild(script);
  });

  return mapsLoadingPromise;
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

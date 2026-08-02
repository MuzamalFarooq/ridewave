'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getCurrentLocation, reverseGeocode } from '@/lib/maps';
import toast from 'react-hot-toast';

const LocationContext = createContext();

export function LocationProvider({ children }) {
  const [userLocation, setUserLocation] = useState({
    lat: null,
    lng: null,
    address: '',
    city: '',
    loading: true,
    error: null,
    isGranted: false,
  });

  const [pickerModal, setPickerModal] = useState({
    isOpen: false,
    fieldType: 'from', // 'from' | 'to'
    initialAddress: '',
    onSelect: null,
  });

  const detectUserLocation = useCallback(async (showToastNotice = false) => {
    setUserLocation((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const coords = await getCurrentLocation();
      const address = await reverseGeocode(coords.lat, coords.lng);
      
      // Extract city if possible
      const addressParts = address.split(', ');
      const city = addressParts.length > 1 ? addressParts[addressParts.length - 2] : addressParts[0];

      const locationData = {
        lat: coords.lat,
        lng: coords.lng,
        address,
        city,
        loading: false,
        error: null,
        isGranted: true,
      };

      setUserLocation(locationData);

      if (showToastNotice) {
        toast.success(`📍 Location detected: ${address.split(',')[0]}`, { id: 'location-detected' });
      }

      return locationData;
    } catch (err) {
      console.warn('Geolocation permission or lookup error:', err);
      const fallbackState = {
        lat: 31.5204, // Default Lahore
        lng: 74.3587,
        address: 'Lahore, Pakistan',
        city: 'Lahore',
        loading: false,
        error: err?.message || 'Location access denied',
        isGranted: false,
      };
      setUserLocation(fallbackState);
      return fallbackState;
    }
  }, []);

  // Request location automatically on site load
  useEffect(() => {
    detectUserLocation(false);
  }, [detectUserLocation]);

  const openPicker = (fieldType = 'from', initialAddress = '', onSelect = null) => {
    setPickerModal({
      isOpen: true,
      fieldType,
      initialAddress,
      onSelect,
    });
  };

  const closePicker = () => {
    setPickerModal((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <LocationContext.Provider
      value={{
        userLocation,
        detectUserLocation,
        pickerModal,
        openPicker,
        closePicker,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useUserLocation() {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useUserLocation must be used within a LocationProvider');
  }
  return context;
}

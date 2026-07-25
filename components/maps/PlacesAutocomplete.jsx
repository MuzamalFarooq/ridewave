'use client';

import { useEffect, useRef, useState } from 'react';
import { MapPin, X } from 'lucide-react';

export default function PlacesAutocomplete({
  value,
  onChange,
  onPlaceSelect,
  placeholder = 'Search location...',
  className = '',
  icon: Icon = MapPin,
  iconColor = '#10b981',
  id,
}) {
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const [inputValue, setInputValue] = useState(value || '');

  useEffect(() => {
    setInputValue(value || '');
  }, [value]);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) return;

    const initAutocomplete = () => {
      if (!window.google?.maps?.places || !inputRef.current) return;

      autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ['(cities)'],
        componentRestrictions: { country: 'pk' },
        fields: ['formatted_address', 'geometry', 'name'],
      });

      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current.getPlace();
        if (!place.geometry) return;

        const address = place.formatted_address || place.name || '';
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();

        setInputValue(address);
        onChange?.(address);
        onPlaceSelect?.({ address, lat, lng });
      });
    };

    if (window.google?.maps?.places) {
      initAutocomplete();
    } else {
      window.addEventListener('google-maps-loaded', initAutocomplete, { once: true });
    }

    return () => {
      if (autocompleteRef.current) {
        window.google?.maps?.event?.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, []);

  return (
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 z-10 pointer-events-none" style={{ color: iconColor }} />
      <input
        ref={inputRef}
        id={id}
        type="text"
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          onChange?.(e.target.value);
        }}
        placeholder={placeholder}
        className={`input-field pl-10 ${className}`}
        autoComplete="off"
      />
      {inputValue && (
        <button
          type="button"
          onClick={() => {
            setInputValue('');
            onChange?.('');
            onPlaceSelect?.(null);
            inputRef.current?.focus();
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center transition-colors"
          style={{ background: 'var(--border)' }}
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}

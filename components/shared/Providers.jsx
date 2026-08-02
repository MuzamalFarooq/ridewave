'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from './ThemeProvider';
import { SocketProvider } from '@/contexts/SocketContext';
import { LocationProvider } from '@/contexts/LocationContext';

export default function Providers({ children }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <SocketProvider>
          <LocationProvider>
            {children}
          </LocationProvider>
        </SocketProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}

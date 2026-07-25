'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from './ThemeProvider';
import { SocketProvider } from '@/contexts/SocketContext';

export default function Providers({ children }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <SocketProvider>
          {children}
        </SocketProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}

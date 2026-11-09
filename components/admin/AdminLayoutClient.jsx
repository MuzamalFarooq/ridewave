'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

export default function AdminLayoutClient({ children, adminEmail }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // If on admin login page, display standalone without admin header/sidebar
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#071713] text-slate-900 dark:text-slate-100 font-sans antialiased">
      {/* Sidebar navigation */}
      <AdminSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        adminEmail={adminEmail}
      />

      {/* Main content body with left margin on desktop */}
      <div className="flex flex-col min-h-screen lg:pl-72 transition-all">
        <AdminHeader
          onMenuClick={() => setIsSidebarOpen(true)}
          adminEmail={adminEmail}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}


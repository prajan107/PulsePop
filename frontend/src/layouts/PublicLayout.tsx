import React from 'react';
import { Outlet } from 'react-router-dom';
import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';

export const PublicLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col bg-[#0F172A] text-[#F8FAFC]">
      <Navbar />
      <main className="flex-1 flex flex-col justify-center items-center">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

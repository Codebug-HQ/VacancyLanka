// app/layout.tsx
'use client';

import { useState, useEffect } from 'react';
import { Montserrat } from 'next/font/google';
import Header from '@/components/navigation/Header';
import MobileMenu from '@/components/navigation/MobileMenu';
import MegaMenu from '@/components/navigation/MegaMenu';
import { LoadingProvider } from '@/context/LoadingContext';
import InitialPreloader from '@/context/InitialPreloader';
import './globals.css';

const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat' });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  
  // Controls when we hide the initial big preloader
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    // Minimal delay to show beautiful animation + feel snappy
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 1800); // 1.8s – adjust to taste (1200–2500ms is sweet spot)

    return () => clearTimeout(timer);
  }, []);

  return (
    <html lang="en">
      <body className={`${montserrat.variable} font-sans bg-[#00251b] antialiased`}>
        {/* 1. Initial Full-screen Preloader – shows first */}
        <InitialPreloader isVisible={isInitialLoading} />

        {/* 2. Rest of the app – hidden until preloader finishes */}
        <div 
          className={`
            transition-opacity duration-800
            ${isInitialLoading ? 'opacity-0 pointer-events-none' : 'opacity-100'}
          `}
        >
          <LoadingProvider>
            <Header
              isMobileMenuOpen={isMobileMenuOpen}
              setIsMobileMenuOpen={setIsMobileMenuOpen}
              isMegaMenuOpen={isMegaMenuOpen}
              setIsMegaMenuOpen={setIsMegaMenuOpen}
            />

            <MobileMenu isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} />
            <MegaMenu isOpen={isMegaMenuOpen} setIsOpen={setIsMegaMenuOpen} />

            <main className={isMobileMenuOpen || isMegaMenuOpen ? "blur-sm transition-all duration-300" : "transition-all duration-300"}>
              {children}
            </main>
          </LoadingProvider>
        </div>
      </body>
    </html>
  );
}
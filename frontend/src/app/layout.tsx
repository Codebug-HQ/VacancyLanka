'use client';
import { useState } from 'react';
import { Montserrat } from 'next/font/google';
import Header from '@/components/navigation/Header';
import MobileMenu from '@/components/navigation/MobileMenu';
import MegaMenu from '@/components/navigation/MegaMenu';
import { LoadingProvider } from '@/context/LoadingContext';
import './globals.css';

const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat' });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);

  return (
    <html lang="en">
      <body className={`${montserrat.variable} font-sans bg-white antialiased`}>
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
      </body>
    </html>
  );
}
'use client';

import React, { useEffect, useState, Dispatch, SetStateAction } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { twMerge } from 'tailwind-merge';
import AnimatedHamburger from '../ui/AnimatedHamburger';
import Icon from '../ui/Icon';
import Button from '../ui/Button';
import { request } from 'graphql-request';
import { useLoading } from '@/context/LoadingContext';

interface HeaderProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: Dispatch<SetStateAction<boolean>>;
  isMegaMenuOpen: boolean;
  setIsMegaMenuOpen: Dispatch<SetStateAction<boolean>>;
}

const GET_NAVIGATION = `
  query Navigation {
    activities (where: {orderby: {field: DATE, order: ASC}}) {
      nodes { title }
    }
    packages (where: {orderby: {field: DATE, order: ASC}}) {
      nodes { title }
    }
    itineraries (where: {orderby: {field: DATE, order: ASC}}) {
      nodes { title }
    }
  }
`;

interface NavItem {
  title: string;
  href: string;
}

export default function Header({ setIsMobileMenuOpen, isMobileMenuOpen }: HeaderProps) {
  const { startLoading, finishLoading } = useLoading();

  const [scrolled, setScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [packages, setPackages] = useState<NavItem[]>([]);
  const [activities, setActivities] = useState<NavItem[]>([]);

  useEffect(() => {
    async function fetchNavigation() {
      try {
        startLoading();
        const proxyUrl = typeof window !== 'undefined'
          ? `${window.location.origin}/api/graphql/proxy`
          : '/api/graphql/proxy';

        const data: any = await request(proxyUrl, GET_NAVIGATION);
        const packageTitles = [...(data.packages?.nodes || []), ...(data.itineraries?.nodes || [])];

        setPackages(packageTitles.map((node: any) => ({ title: node.title, href: '#packages' })));
        setActivities((data.activities?.nodes || []).map((node: any) => ({ title: node.title, href: '#activities' })));
      } catch (err) {
        console.error('Failed to load navigation data:', err);
      } finally {
        setTimeout(() => finishLoading(), 600);
      }
    }
    fetchNavigation();
  }, [startLoading, finishLoading]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Updated link styles using #00251b and hover #00773f
const baseLinkStyle = twMerge(
    "relative px-4 py-2 text-[17px] font-bold tracking-tight transition-all duration-500 cursor-pointer flex items-center group",
    "bg-gradient-to-r from-[#00251b] via-[#00251b] to-[#00773f] bg-[length:200%_100%] bg-left text-transparent bg-clip-text",
    "hover:bg-right hover:scale-105" // Shimmer effect + subtle scale
  );

  const isActive = scrolled || isMobileMenuOpen || isHovered;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[100]"
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={twMerge(
          'relative z-[110] transition-all duration-500 ease-in-out',
          scrolled 
            ? 'bg-white py-3 shadow-xl' 
            : 'bg-gradient-to-b from-white/90 to-transparent backdrop-blur-sm py-6'
        )}
      >
        <nav className="container mx-auto flex items-center justify-between px-6">
          {/* Logo with dynamic sizing */}
          <Link href="/" className="flex items-center gap-2">
            <motion.img 
              animate={{ height: scrolled ? '48px' : '64px' }}
              transition={{ duration: 0.4 }}
              src="/images/logo-vacay.png" 
              alt="VacayLanka" 
              className="w-auto" 
            />
          </Link>

          {/* Desktop Nav */}
  <div className="hidden lg:flex items-center gap-2">
    <Link href="#hero" className={baseLinkStyle}>
      Home
    </Link>
    
    <div 
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
    >
      <div className={baseLinkStyle}>
        <span className="mr-2">Explore Sri Lanka</span>
        <Icon 
          type="discovery" 
          isActive={isHovered} 
          className={isHovered ? "text-[#00773f]" : "text-[#00251b]"} 
        />
      </div>
    </div>

    <Link href="#gallery" className={baseLinkStyle}>
      Gallery
    </Link>
    <Link href="#vehicles" className={baseLinkStyle}>
      Rentals
    </Link>

    <div className="ml-6">
      <Link href="#contact">
        <Button 
          variant="primary" 
          className="bg-[#00773f] hover:bg-[#00251b] transition-all duration-500 px-8 rounded-full shadow-lg hover:shadow-[#00773f]/30 transform hover:-translate-y-1"
        >
          Contact Us
        </Button>
      </Link>
    </div>
  </div>
          {/* Mobile Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-3 z-[130] rounded-full hover:bg-[#00773f]/10 transition-colors"
            aria-label="Toggle menu"
          >
            <AnimatedHamburger isOpen={isMobileMenuOpen} />
          </button>
        </nav>
      </motion.header>

      {/* Mega Menu Flyout */}
      <AnimatePresence>
        {isHovered && packages.length > 0 && activities.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            onMouseEnter={() => setIsHovered(true)}
            // Changed bg to #00251b
            className="absolute top-full left-0 w-full bg-[#00251b] border-t border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.8)] overflow-hidden pointer-events-auto"
          >
            <div className="container mx-auto grid grid-cols-12 gap-12 p-12 max-h-[85vh]">
              {/* Left: Menu Links */}
              <div className="col-span-7 grid grid-cols-2 gap-8 border-r border-white/5">
                <div>
                  <h3 className="text-[#00773f] text-xs uppercase tracking-[0.3em] font-black mb-8">
                    Travel Packages
                  </h3>
                  <ul className="space-y-5">
                    {packages.map((item, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <Link
                          href={item.href}
                          className="text-white/50 hover:text-white text-lg transition-all flex items-center group"
                        >
                          <span className="w-0 group-hover:w-6 h-[2px] bg-[#00773f] mr-0 group-hover:mr-4 transition-all duration-300"></span>
                          {item.title}
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-[#00773f] text-xs uppercase tracking-[0.3em] font-black mb-8">
                    Popular Activities
                  </h3>
                  <ul className="space-y-5">
                    {activities.map((item, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (i + packages.length) * 0.05 }}
                      >
                        <Link
                          href={item.href}
                          className="text-white/50 hover:text-white text-lg transition-all flex items-center group"
                        >
                          <span className="w-0 group-hover:w-6 h-[2px] bg-[#00773f] mr-0 group-hover:mr-4 transition-all duration-300"></span>
                          {item.title}
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Right: Visual Grid */}
              <div className="col-span-5 grid grid-cols-2 gap-4 h-full min-h-[300px]">
                <div className="relative rounded-2xl overflow-hidden group border border-white/10">
                  <img
                    src="https://images.unsplash.com/photo-1546708973-b339540b5162?q=80&w=600"
                    className="object-cover w-full h-full brightness-50 group-hover:brightness-75 group-hover:scale-110 transition-all duration-1000"
                    alt="Tea"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent p-6 flex flex-col justify-end">
                    <p className="text-[#00773f] text-[10px] font-bold tracking-[0.2em]">CEYLON</p>
                    <h4 className="text-white font-bold text-xl uppercase">Tea Estates</h4>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex-1 relative rounded-2xl overflow-hidden group border border-white/10">
                    <img
                      src="https://cdn.kimkim.com/files/a/content_articles/featured_photos/0e32ba0a1ccc298e3b520787eab6176b9946de6c/big-892a2aecfd74c925d1973c7cd0f7d4d6.jpg"
                      className="object-cover w-full h-full brightness-50 group-hover:brightness-75 transition-all duration-700"
                      alt="Coast"
                    />
                  </div>
                  <div className="flex-1 relative rounded-2xl overflow-hidden group border border-white/10">
                    <img
                      src="https://images.unsplash.com/photo-1612862862126-865765df2ded?q=80&w=600"
                      className="object-cover w-full h-full brightness-50 group-hover:brightness-75 transition-all duration-700"
                      alt="Heritage"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
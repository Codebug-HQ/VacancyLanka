'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

type Place = {
  title: string;
  description: string;
  image: string;
};

type Destination = {
  name: string;
  places: Place[];
};

type LightboxProps = {
  destination: Destination | null;
  onClose: () => void;
  currentPlaceIndex?: number;
  onNext?: () => void;
  onPrev?: () => void;
};

export default function Lightbox({ destination, onClose }: LightboxProps) {
  const [currentPlaceIndex, setCurrentPlaceIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (destination) {
      setCurrentPlaceIndex(0);
      setIsAutoPlaying(true);
    }
  }, [destination]);

  useEffect(() => {
    if (!destination || !isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentPlaceIndex((prev) => 
        prev === destination.places.length - 1 ? 0 : prev + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [currentPlaceIndex, destination, isAutoPlaying]);

  if (!destination) return null;

  const nextPlace = () => setCurrentPlaceIndex((prev) => (prev === destination.places.length - 1 ? 0 : prev + 1));
  const prevPlace = () => setCurrentPlaceIndex((prev) => (prev === 0 ? destination.places.length - 1 : prev - 1));

  const currentPlace = destination.places[currentPlaceIndex];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/98 px-4 md:px-8 overflow-hidden"
        onClick={(e) => e.target === e.currentTarget && onClose()}
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        {/* Blurred Background */}
        <motion.div key={`bg-${currentPlaceIndex}`} initial={{ opacity: 0 }} animate={{ opacity: 0.3 }} exit={{ opacity: 0 }} className="absolute inset-0 z-0 pointer-events-none">
          <Image src={currentPlace.image} fill alt="" className="object-cover blur-[100px] scale-110" />
        </motion.div>

        {/* Close Button - Smaller on mobile */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 md:top-10 md:right-10 text-white/70 hover:text-[#EF476F] z-[1100] transition-colors"
        >
          <X className="w-8 h-8 md:w-12 md:h-12" />
        </button>

        {/* Main Content Container */}
        <div className="relative z-10 w-full max-w-7xl h-full max-h-[90vh] flex flex-col lg:grid lg:grid-cols-2 gap-6 lg:gap-16 items-center justify-center">
          
          {/* Image Panel - Reduced size on mobile */}
          <div className="relative w-full h-[35vh] sm:h-[40vh] lg:h-full lg:aspect-video rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl border border-white/10 shrink-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPlaceIndex}
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -100, opacity: 0 }}
                transition={{ duration: 0.5, ease: "anticipate" }}
                className="absolute inset-0"
              >
                <Image
                  src={currentPlace.image}
                  alt={currentPlace.title}
                  fill
                  className="object-cover"
                  priority
                  unoptimized
                />
              </motion.div>
            </AnimatePresence>

            {/* Mobile Pagination Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 lg:hidden">
              {destination.places.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === currentPlaceIndex ? 'bg-[#EF476F] w-6' : 'bg-white/40 w-1.5'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Text Panel - Flexible height */}
          <div className="text-white flex flex-col justify-center text-center lg:text-left">
            <motion.span
              className="w-fit mx-auto lg:mx-0 px-3 py-1 rounded-full border border-[#EF476F] text-[#EF476F] text-[10px] md:text-xs font-bold tracking-widest uppercase mb-3 md:mb-6"
            >
              {destination.name}
            </motion.span>

<AnimatePresence mode="wait">
  <motion.div
    key={currentPlaceIndex}
    // Variant-based animation
    initial={{ 
      opacity: 0, 
      x: typeof window !== 'undefined' && window.innerWidth < 1024 ? -50 : 0, 
      y: typeof window !== 'undefined' && window.innerWidth < 1024 ? 0 : 20 
    }}
    animate={{ opacity: 1, x: 0, y: 0 }}
    exit={{ 
      opacity: 0, 
      x: typeof window !== 'undefined' && window.innerWidth < 1024 ? 50 : 0, 
      y: typeof window !== 'undefined' && window.innerWidth < 1024 ? 0 : -20 
    }}
    transition={{ delay: 0.1, duration: 0.4 }}
  >
    <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-8xl font-black mb-3 md:mb-6 tracking-tighter leading-none">
      {currentPlace.title}
    </h2>
    <p className="text-sm sm:text-lg text-gray-300 max-w-lg mx-auto lg:mx-0 leading-relaxed opacity-90 line-clamp-3 md:line-clamp-none">
      {currentPlace.description}
    </p>
  </motion.div>
</AnimatePresence>

            {/* Navigation Controls */}
            <div className="flex items-center justify-center lg:justify-start gap-4 md:gap-6 mt-6 md:mt-12">
              <div className="flex gap-2 md:gap-3">
                <button
                  onClick={prevPlace}
                  className="p-3 md:p-4 rounded-full border border-white/20 hover:bg-white/10 transition-all backdrop-blur-sm"
                >
                  <ChevronLeft size={20} className="md:w-[28px] md:h-[28px]" />
                </button>
                <button
                  onClick={nextPlace}
                  className="p-3 md:p-4 rounded-full bg-[#EF476F] hover:bg-[#f45a7f] transition-all shadow-lg"
                >
                  <ChevronRight size={20} className="md:w-[28px] md:h-[28px]" />
                </button>
              </div>

              <div className="hidden sm:block h-[1px] w-12 md:w-20 bg-white/20" />

              <span className="font-mono text-xs md:text-sm tracking-widest text-white/50">
                {String(currentPlaceIndex + 1).padStart(2, '0')} / {String(destination.places.length).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
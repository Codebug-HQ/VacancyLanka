'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { twMerge } from 'tailwind-merge';
import MagneticButton from '../ui/MagneticButton'; // Use our new magnetic button
import { getProxiedImageUrl } from '@/lib/image-proxy';

// Close Icon for the menu
const CloseIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className="w-8 h-8"
    {...props}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

interface MegaMenuProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const megaMenuItems = [
  { 
    title: 'Cultural Triangle', 
    description: 'Ancient cities, rock fortresses, and vibrant heritage.', 
    image: 'https://images.unsplash.com/photo-1621577717462-817bf4959146?auto=format&fit=crop&q=80&w=1500',
    link: '#destinations'
  },
  { 
    title: 'Tea Country', 
    description: 'Misty hills, lush tea plantations, and scenic train rides.', 
    image: 'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&q=80&w=1500',
    link: '#destinations'
  },
  { 
    title: 'Southern Beaches', 
    description: 'Golden sands, whale watching, and surfing hotspots.', 
    image: 'https://images.unsplash.com/photo-1598282305542-a1b72e947d6b?auto=format&fit=crop&q=80&w=1500',
    link: '#destinations'
  },
  { 
    title: 'Wildlife & Safaris', 
    description: 'Leopards, elephants, and exotic birds in national parks.', 
    image: 'https://images.unsplash.com/photo-1627999816035-77cf380d1969?auto=format&fit=crop&q=80&w=1500',
    link: '#destinations'
  },
];

const menuVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.3 }
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      staggerChildren: 0.07,
      delayChildren: 0.2
    }
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: {
      duration: 0.3,
      ease: [0.6, -0.05, 0.01, 0.99] as const 
    }
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1, 
    transition: { 
      type: "spring" as const, 
      stiffness: 200, 
      damping: 20 
    } 
  },
};

export default function MegaMenu({ isOpen, setIsOpen }: MegaMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[60] flex items-center justify-center p-8 overflow-y-auto hidden lg:flex"
          variants={menuVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-8 right-8 text-white hover:text-accent transition-colors z-50 focus:outline-none focus:ring-2 focus:ring-white/50 rounded-full p-2"
            aria-label="Close mega menu"
          >
            <CloseIcon />
          </button>

          <motion.div 
            className="grid grid-cols-2 xl:grid-cols-4 gap-8 max-w-7xl mx-auto"
            variants={menuVariants} // Use parent variants for staggering
          >
            {megaMenuItems.map((item, index) => (
              <motion.div 
                key={item.title} 
                variants={itemVariants}
                className="group relative h-96 overflow-hidden rounded-lg shadow-2xl hover:scale-[1.02] transition-transform duration-300 ease-in-out"
              >
                <Image
                  src={getProxiedImageUrl(item.image)}
                  alt={item.title}
                  fill
                  className="object-cover brightness-[0.6] group-hover:brightness-[0.7] group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 p-6 flex flex-col justify-end">
                  <h3 className="text-3xl font-bold text-white mb-2 leading-tight drop-shadow-lg">
                    {item.title}
                  </h3>
                  <p className="text-lg text-zinc-200 mb-4 drop-shadow-md">
                    {item.description}
                  </p>
                  <a href={item.link} onClick={() => setIsOpen(false)}>
                    <MagneticButton 
                      className="inline-flex items-center text-white bg-accent hover:bg-primary py-2 px-5 rounded-full text-md"
                    >
                      Explore <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                    </MagneticButton>
                  </a>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
             initial={{ opacity: 0, y: 50 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.8, duration: 0.5 }}
             className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center text-white/70 text-sm flex items-center gap-4"
          >
            <a href="#packages" className="hover:text-white transition-colors">All Packages</a>
            <span className="w-1 h-1 bg-white/50 rounded-full"></span>
            <a href="#contact" className="hover:text-white transition-colors">Custom Journey</a>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
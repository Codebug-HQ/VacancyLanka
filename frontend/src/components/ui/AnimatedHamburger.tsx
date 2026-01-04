'use client';

import { motion } from 'framer-motion';

export default function AnimatedHamburger({ isOpen }: { isOpen: boolean }) {
  return (
    <div className="relative w-8 h-6 flex flex-col justify-between items-center">
      {/* Top line → rotates to 45° and moves toward center */}
      <motion.span
        animate={
          isOpen
            ? { rotate: 45, y: 8, backgroundColor: '#EF476F' }
            : { rotate: 0, y: 0, backgroundColor: '#FFFFFF' }
        }
        transition={{ duration: 0.6, type: 'spring', stiffness: 100, damping: 20 }}
        className="w-full h-1 block origin-center rounded-full bg-white"
      />

      {/* Middle line → fades out */}
      <motion.span
        animate={{ opacity: isOpen ? 0 : 1 }}
        transition={{ duration: 0.3 }}
        className="w-full h-1 block rounded-full bg-white"
      />

      {/* Bottom line → rotates to -45° and moves toward center */}
      <motion.span
        animate={
          isOpen
            ? { rotate: -45, y: -8, backgroundColor: '#EF476F' }
            : { rotate: 0, y: 0, backgroundColor: '#FFFFFF' }
        }
        transition={{ duration: 0.6, type: 'spring', stiffness: 100, damping: 20 }}
        className="w-full h-1 block origin-center rounded-full bg-white"
      />
    </div>
  );
}
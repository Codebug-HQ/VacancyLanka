'use client';
import { motion } from 'framer-motion';

interface IconProps {
  type: 'accordion' | 'discovery';
  isActive: boolean; 
  className?: string;
}

export default function Icon({ type, isActive, className }: IconProps) {
  // Accordion logic remains consistent for mobile menus
  if (type === 'accordion') {
    return (
      <div className={`relative w-6 h-6 flex items-center justify-center flex-shrink-0 ${className}`}>
        <motion.div
          className="absolute w-5 h-[2px] bg-[#00783e] rounded-full"
          animate={{ rotate: isActive ? 180 : 0 }}
        />
        <motion.div
          className="absolute w-[2px] h-5 bg-[#00783e] rounded-full"
          animate={{ 
            rotate: isActive ? 90 : 0,
            opacity: isActive ? 0 : 1,
          }}
        />
      </div>
    );
  }

  // Professional Chevron Discovery Style
  return (
    <div className={`relative w-6 h-6 flex items-center justify-center flex-shrink-0 ${className}`}>
      {/* Container for the Chevron */}
      <motion.div
        animate={{ 
          rotate: isActive ? 180 : 0,
          y: isActive ? 0 : 2 // Slight bounce down when idle
        }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="relative z-10 flex items-center justify-center w-full h-full"
      >
        {/* Left Half of Chevron */}
        <motion.span
          animate={{ 
            backgroundColor: isActive ? "#00783e" : "#00251b",
            rotate: 135,
            x: 2.5
          }}
          className="absolute w-[8px] h-[2px] rounded-full"
        />
        {/* Right Half of Chevron */}
        <motion.span
          animate={{ 
            backgroundColor: isActive ? "#00783e" : "#00251b",
            rotate: -135,
            x: -2.5
          }}
          className="absolute w-[8px] h-[2px] rounded-full"
        />
      </motion.div>

      {/* Discovery Circle Frame */}
      <motion.div
        initial={false}
        animate={{ 
          scale: isActive ? 1 : 0.8,
          opacity: isActive ? 1 : 0,
          borderColor: "#00783e"
        }}
        className="absolute inset-0 border-2 rounded-full"
        transition={{ duration: 0.3, ease: "easeOut" }}
      />

      {/* Radial Pulse Effect */}
      {isActive && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0.5 }}
          animate={{ scale: 1.6, opacity: 0 }}
          transition={{ 
            repeat: Infinity, 
            duration: 1.5, 
            ease: "circOut" 
          }}
          className="absolute inset-0 border border-[#00783e] rounded-full"
        />
      )}
    </div>
  );
}
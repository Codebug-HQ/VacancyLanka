'use client';
import React from 'react';
import { HTMLMotionProps, motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'primary' | 'outline' | 'ghost';
  children: React.ReactNode;
  className?: string;
}

export default function Button({ 
  variant = 'primary', 
  children, 
  className, 
  ...props 
}: ButtonProps) {
  
  const variants = {
    primary: "bg-[#00783e] text-white shadow-[0_10px_20px_rgba(239,71,111,0.3)]",
    outline: "border border-white/20 text-white hover:border-[#00783e]",
    ghost: "text-white hover:bg-white/10"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      className={twMerge(
        "relative px-8 py-3 rounded-full font-bold transition-all duration-300 overflow-hidden group",
        variants[variant],
        className
      )}
      {...props}
    >
      {/* Glossy Overlay Animation */}
      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
      
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </motion.button>
  );
}
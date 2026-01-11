'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface InitialPreloaderProps {
  isVisible: boolean;
}

export default function InitialPreloader({ isVisible }: InitialPreloaderProps) {
  return (
    <AnimatePresence>
            {isVisible && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[10000] flex items-center justify-center bg-[#00251b]"
              >
                {/* Elegant Background Patterns */}
                <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
                   <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#00783e] blur-[120px]" />
                   <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#06D6A0] blur-[120px]" />
                </div>
    
                <div className="relative flex flex-col items-center">
                  {/* Creative Animated Logo Mark */}
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative mb-8"
                  >
                    <div className="w-24 h-24 border-t-2 border-r-2 border-[#00783e] rounded-full animate-spin duration-[2s]" />
                    <div className="absolute inset-0 flex items-center justify-center">
                       <span className="text-3xl font-black text-white tracking-tighter">V</span>
                    </div>
                  </motion.div>
    
                  {/* Text Animation */}
                  <div className="overflow-hidden h-8">
                    <motion.p 
                      initial={{ y: 40 }}
                      animate={{ y: 0 }}
                      className="text-white text-xs uppercase tracking-[0.5em] font-bold"
                    >
                      Discovering Paradise
                    </motion.p>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mt-6 w-48 h-[1px] bg-white/10 relative overflow-hidden">
                    <motion.div 
                      initial={{ x: '-100%' }}
                      animate={{ x: '100%' }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00783e] to-transparent"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
  );
}
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CountdownUnitProps } from './countdown.types';

export const CountdownUnit: React.FC<CountdownUnitProps> = ({ value, label, labelHi }) => {
  const formattedValue = String(value).padStart(2, '0');

  return (
    <div className="flex flex-col items-center select-none">
      {/* Premium Luxury Gold-Bordered Glass Box */}
      <div className="relative w-14 h-16 xs:w-16 xs:h-20 sm:w-28 sm:h-32 md:w-32 md:h-36 rounded-xl sm:rounded-2xl bg-gradient-to-b from-[#581C2B] via-[#380715] to-[#25030C] border-2 border-royalGold/80 shadow-[0_12px_30px_-5px_rgba(0,0,0,0.8)] flex items-center justify-center overflow-hidden group hover:border-royalGold transition-all duration-300">
        {/* Subtle Top Gloss Layer */}
        <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/15 to-transparent pointer-events-none" />

        {/* Central Fine Gold Horizon Line */}
        <div className="absolute top-1/2 inset-x-0 h-[1px] bg-royalGold/30 pointer-events-none" />

        {/* Number with smooth vertical slide transition */}
        <div className="relative z-10 flex items-center justify-center h-full">
          <AnimatePresence mode="popLayout">
            <motion.span
              key={formattedValue}
              initial={{ y: -15, opacity: 0.2, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 15, opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="font-heading text-xl xs:text-2xl sm:text-5xl md:text-6xl font-bold text-champagne tracking-tight drop-shadow-[0_2px_10px_rgba(212,175,55,0.45)]"
            >
              {formattedValue}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* Corner Micro Filigrees */}
        <div className="absolute top-1 left-1 w-1.5 h-1.5 border-t border-l border-royalGold/60 pointer-events-none" />
        <div className="absolute top-1 right-1 w-1.5 h-1.5 border-t border-r border-royalGold/60 pointer-events-none" />
        <div className="absolute bottom-1 left-1 w-1.5 h-1.5 border-b border-l border-royalGold/60 pointer-events-none" />
        <div className="absolute bottom-1 right-1 w-1.5 h-1.5 border-b border-r border-royalGold/60 pointer-events-none" />
      </div>

      {/* Label */}
      <span className="mt-1.5 xs:mt-2 sm:mt-3 text-[9px] xs:text-[11px] sm:text-sm uppercase tracking-widest font-semibold text-royalGold drop-shadow-sm text-center">
        {labelHi || label}
      </span>
    </div>
  );
};

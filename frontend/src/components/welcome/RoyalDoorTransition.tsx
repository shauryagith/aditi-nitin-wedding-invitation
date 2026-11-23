import React from 'react';
import { motion } from 'framer-motion';

interface RoyalDoorTransitionProps {
  isOpening: boolean;
  onAnimationComplete: () => void;
}

export const RoyalDoorTransition: React.FC<RoyalDoorTransitionProps> = ({
  isOpening,
  onAnimationComplete,
}) => {
  if (!isOpening) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none perspective-[1400px] overflow-hidden">
      {/* Golden Light Flood in Center Gap */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={
          isOpening
            ? {
                opacity: [0, 0.9, 1, 0],
                scale: [0.8, 1.4, 2.2, 3],
              }
            : { opacity: 0 }
        }
        transition={{ duration: 1.4, ease: 'easeInOut' }}
        className="absolute inset-0 bg-radial-gradient from-[#FFF9F0] via-[#D4AF37] to-transparent z-40 pointer-events-none"
      />

      {/* Royal Palace Left Door */}
      <motion.div
        initial={{ rotateY: 0 }}
        animate={isOpening ? { rotateY: -100, x: '-20%' } : { rotateY: 0 }}
        transition={{ duration: 1.3, ease: [0.65, 0, 0.35, 1] }}
        style={{ transformOrigin: 'left center', transformStyle: 'preserve-3d' }}
        className="absolute top-0 bottom-0 left-0 w-1/2 bg-gradient-to-r from-[#2A040E] via-[#3D0715] to-[#4D0A1C] border-r-2 border-royalGold shadow-[10px_0_40px_rgba(0,0,0,0.9)] z-30 flex flex-col justify-between p-6 sm:p-12 overflow-hidden"
      >
        {/* Palace Arch Silhouette & Jaali Lattice */}
        <div className="absolute inset-4 sm:inset-8 border border-royalGold/40 rounded-t-full pointer-events-none flex flex-col items-center">
          <div className="w-full h-40 border-b border-royalGold/30 opacity-40 mandala-bg" />
        </div>

        {/* Brass Palace Ring Handle (Left) */}
        <div className="absolute top-1/2 right-4 sm:right-8 -translate-y-1/2 flex flex-col items-center">
          <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full border-2 border-royalGold bg-deepBurgundy flex items-center justify-center shadow-2xl">
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-champagne" />
          </div>
        </div>

        {/* Golden Studs */}
        <div className="flex justify-between w-full opacity-60">
          <div className="w-2.5 h-2.5 rounded-full bg-royalGold shadow-md" />
          <div className="w-2.5 h-2.5 rounded-full bg-royalGold shadow-md" />
        </div>
        <div className="flex justify-between w-full opacity-60">
          <div className="w-2.5 h-2.5 rounded-full bg-royalGold shadow-md" />
          <div className="w-2.5 h-2.5 rounded-full bg-royalGold shadow-md" />
        </div>
      </motion.div>

      {/* Royal Palace Right Door */}
      <motion.div
        initial={{ rotateY: 0 }}
        animate={isOpening ? { rotateY: 100, x: '20%' } : { rotateY: 0 }}
        transition={{ duration: 1.3, ease: [0.65, 0, 0.35, 1] }}
        onAnimationComplete={() => {
          if (isOpening) {
            onAnimationComplete();
          }
        }}
        style={{ transformOrigin: 'right center', transformStyle: 'preserve-3d' }}
        className="absolute top-0 bottom-0 right-0 w-1/2 bg-gradient-to-l from-[#2A040E] via-[#3D0715] to-[#4D0A1C] border-l-2 border-royalGold shadow-[-10px_0_40px_rgba(0,0,0,0.9)] z-30 flex flex-col justify-between p-6 sm:p-12 overflow-hidden"
      >
        {/* Palace Arch Silhouette & Jaali Lattice */}
        <div className="absolute inset-4 sm:inset-8 border border-royalGold/40 rounded-t-full pointer-events-none flex flex-col items-center">
          <div className="w-full h-40 border-b border-royalGold/30 opacity-40 mandala-bg" />
        </div>

        {/* Brass Palace Ring Handle (Right) */}
        <div className="absolute top-1/2 left-4 sm:left-8 -translate-y-1/2 flex flex-col items-center">
          <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full border-2 border-royalGold bg-deepBurgundy flex items-center justify-center shadow-2xl">
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-champagne" />
          </div>
        </div>

        {/* Golden Studs */}
        <div className="flex justify-between w-full opacity-60">
          <div className="w-2.5 h-2.5 rounded-full bg-royalGold shadow-md" />
          <div className="w-2.5 h-2.5 rounded-full bg-royalGold shadow-md" />
        </div>
        <div className="flex justify-between w-full opacity-60">
          <div className="w-2.5 h-2.5 rounded-full bg-royalGold shadow-md" />
          <div className="w-2.5 h-2.5 rounded-full bg-royalGold shadow-md" />
        </div>
      </motion.div>
    </div>
  );
};

export default RoyalDoorTransition;

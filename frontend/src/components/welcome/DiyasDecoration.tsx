import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface DiyasDecorationProps {
  className?: string;
  active?: boolean;
}

interface SingleDiyaProps {
  isLit: boolean;
  delay: number;
  size?: number;
}

export const SingleDiya: React.FC<SingleDiyaProps> = ({ isLit, delay, size = 48 }) => {
  return (
    <div className="relative inline-flex flex-col items-center justify-center">
      {/* Animated Flickering Warm Flame with Glow */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={
          isLit
            ? {
                scale: [1, 1.12, 0.96, 1.05, 1],
                opacity: [0.85, 1, 0.9, 1, 0.85],
              }
            : { scale: 0, opacity: 0 }
        }
        transition={
          isLit
            ? {
                duration: 1.6,
                repeat: Infinity,
                ease: 'easeInOut',
                delay,
              }
            : { duration: 0.3 }
        }
        className="relative flex items-center justify-center -mb-1.5 z-20 pointer-events-none"
      >
        {/* Outer Warm Corona / Glow */}
        <div className="absolute -inset-2.5 rounded-full bg-amber-400/30 blur-md animate-pulse" />

        {/* Flame Body */}
        <div className="w-3 xs:w-3.5 h-5 xs:h-6 rounded-full bg-gradient-to-t from-orange-600 via-amber-400 to-yellow-100 blur-[0.4px] shadow-[0_0_18px_#f59e0b]" />

        {/* Inner Bright Flame Core */}
        <div className="absolute w-1 xs:w-1.5 h-3 xs:h-3.5 rounded-full bg-white opacity-90 -translate-y-0.5" />
      </motion.div>

      {/* Traditional Brass Diya Base */}
      <svg
        width={size}
        height={size * 0.52}
        viewBox="0 0 60 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]"
      >
        {/* Diya Bowl */}
        <path
          d="M5 14 C12 28 48 28 55 14 C57 10 51 8 30 8 C9 8 3 10 5 14 Z"
          fill="url(#diyaGoldGradient)"
          stroke="#D4AF37"
          strokeWidth="1.5"
        />
        {/* Oil Rim */}
        <ellipse cx="30" cy="11.5" rx="22" ry="4" fill="#3D0715" opacity="0.6" />
        {/* Decorative Engraving */}
        <path d="M12 24 C20 29 40 29 48 24" stroke="#F5E6CC" strokeWidth="1.4" strokeLinecap="round" />
        <circle cx="30" cy="22" r="1.5" fill="#D4AF37" />

        <defs>
          <linearGradient id="diyaGoldGradient" x1="5" y1="8" x2="55" y2="28" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFF9F0" />
            <stop offset="0.3" stopColor="#D4AF37" />
            <stop offset="0.8" stopColor="#B89428" />
            <stop offset="1" stopColor="#735B17" />
          </linearGradient>
        </defs>
      </svg>

      {/* Warm Reflection on Floor */}
      <motion.div
        animate={isLit ? { opacity: [0.3, 0.6, 0.3] } : { opacity: 0 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="w-10 xs:w-12 h-2.5 rounded-full bg-amber-500/25 blur-sm -mt-1 pointer-events-none"
      />
    </div>
  );
};

export const DiyasDecoration: React.FC<DiyasDecorationProps> = ({ className = '', active = true }) => {
  const [litDiyas, setLitDiyas] = useState<boolean[]>([false, false, false, false]);

  useEffect(() => {
    if (!active) {
      setLitDiyas([false, false, false, false]);
      return;
    }

    // Sequentially illuminate diyas one by one (Scene 1 requirement)
    const timers: NodeJS.Timeout[] = [];
    timers.push(setTimeout(() => setLitDiyas([true, false, false, false]), 500));
    timers.push(setTimeout(() => setLitDiyas([true, true, false, false]), 950));
    timers.push(setTimeout(() => setLitDiyas([true, true, true, false]), 1400));
    timers.push(setTimeout(() => setLitDiyas([true, true, true, true]), 1850));

    return () => timers.forEach(clearTimeout);
  }, [active]);

  return (
    <div className={`flex items-center justify-between w-full max-w-xs xs:max-w-md sm:max-w-2xl md:max-w-3xl px-3 xs:px-4 sm:px-8 pointer-events-none ${className}`}>
      {/* Left Pair of Diyas */}
      <div className="flex items-center gap-2 xs:gap-3 sm:gap-6">
        <SingleDiya isLit={litDiyas[0]} delay={0} size={38} />
        <SingleDiya isLit={litDiyas[1]} delay={0.25} size={46} />
      </div>

      {/* Right Pair of Diyas */}
      <div className="flex items-center gap-2 xs:gap-3 sm:gap-6">
        <SingleDiya isLit={litDiyas[2]} delay={0.15} size={46} />
        <SingleDiya isLit={litDiyas[3]} delay={0.35} size={38} />
      </div>
    </div>
  );
};

export default DiyasDecoration;

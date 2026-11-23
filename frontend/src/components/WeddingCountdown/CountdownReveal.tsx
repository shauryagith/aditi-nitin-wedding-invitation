import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { CountdownRevealProps } from './countdown.types';

export const CountdownReveal: React.FC<CountdownRevealProps> = ({ isRevealed, children }) => {
  const hasTriggeredSparkles = useRef(false);

  useEffect(() => {
    if (isRevealed && !hasTriggeredSparkles.current) {
      hasTriggeredSparkles.current = true;

      try {
        // Opulent Golden Confetti / Sparkle Burst
        confetti({
          particleCount: 65,
          spread: 80,
          origin: { y: 0.65 },
          colors: ['#D4AF37', '#FFD700', '#FFF8DC', '#E5C158', '#AA771C'],
          disableForReducedMotion: true,
          ticks: 200,
          gravity: 1.1,
          scalar: 0.9,
        });
      } catch {
        // Fallback if canvas-confetti fails or is blocked
      }
    }
  }, [isRevealed]);

  return (
    <motion.div
      initial={{ opacity: 0.4, scale: 0.96 }}
      animate={
        isRevealed
          ? {
              opacity: 1,
              scale: 1,
              filter: 'none',
              boxShadow: '0 20px 60px -15px rgba(212, 175, 55, 0.35)',
            }
          : {
              opacity: 0.6,
              scale: 0.98,
            }
      }
      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
      className="w-full h-full flex flex-col items-center justify-center"
    >
      {children}
    </motion.div>
  );
};

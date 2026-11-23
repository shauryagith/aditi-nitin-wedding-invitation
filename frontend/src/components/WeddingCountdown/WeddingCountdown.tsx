import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Clock, Calendar } from 'lucide-react';
import { useWeddingCountdown } from './useWeddingCountdown';
import { ScratchCard } from './ScratchCard';
import { WeddingCountdownProps } from './countdown.types';
import { COUNTDOWN_CONFIG } from './countdown.config';
import { useLanguage } from '../../context/LanguageContext';
import { OrnamentalDivider } from '../common/DecorativeOrnaments';

export const WeddingCountdown: React.FC<WeddingCountdownProps> = ({
  targetDate = COUNTDOWN_CONFIG.targetDateIso,
  autoRevealThreshold = COUNTDOWN_CONFIG.thresholds.autoReveal,
  onRevealed,
  className = '',
  id = 'countdown',
}) => {
  const { t, language } = useLanguage();
  const timeLeft = useWeddingCountdown(targetDate);
  const [percentScratched, setPercentScratched] = useState(0);
  const [isRevealed, setIsRevealed] = useState(() => {
    try {
      return sessionStorage.getItem(COUNTDOWN_CONFIG.storageKey) === 'true';
    } catch {
      return false;
    }
  });

  const handleRevealComplete = useCallback(() => {
    setIsRevealed(true);
    setPercentScratched(100);
    try {
      sessionStorage.setItem(COUNTDOWN_CONFIG.storageKey, 'true');
    } catch {
      // Ignored
    }
    if (onRevealed) onRevealed();
  }, [onRevealed]);

  const handleManualReveal = useCallback(() => {
    handleRevealComplete();
  }, [handleRevealComplete]);

  const handleReset = useCallback(() => {
    setIsRevealed(false);
    setPercentScratched(0);
    try {
      sessionStorage.removeItem(COUNTDOWN_CONFIG.storageKey);
    } catch {
      // Ignored
    }
  }, []);

  return (
    <section
      id={id}
      className={`py-20 sm:py-28 px-4 sm:px-6 bg-deepBurgundy text-ivory relative overflow-hidden ${className}`}
    >
      {/* Background radial glow & authentic mandala watermark */}
      <div className="absolute inset-0 bg-radial-gradient from-primaryMaroon/50 via-deepBurgundy to-deepBurgundy opacity-95" />
      <div className="absolute inset-0 mandala-bg opacity-15 pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Section Heading & Auspicious Invocation */}
        <div className="mb-10 sm:mb-14">
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs uppercase tracking-widest text-royalGold font-bold font-hindi block"
          >
            ॥ शुभ मुहूर्त प्रतीक्षा ॥
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-ivory mt-2"
          >
            {t.countdown.sectionTitle}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="font-cormorant text-base sm:text-xl text-champagne/90 italic mt-2 max-w-xl mx-auto"
          >
            {t.countdown.sectionSubtitle}
          </motion.p>

          <div className="flex justify-center my-3">
            <OrnamentalDivider color="#D4AF37" className="scale-90 sm:scale-100" />
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs uppercase tracking-widest text-royalGold/90 font-medium"
          >
            Timezone: Asia/Kolkata (IST) • 11 December 2026
          </motion.p>
        </div>

        {/* Real Interactive Scratch Card with Live Countdown Underneath */}
        <ScratchCard
          timeLeft={timeLeft}
          isRevealed={isRevealed}
          percentScratched={percentScratched}
          onProgressUpdate={setPercentScratched}
          onRevealComplete={handleRevealComplete}
          onRevealNow={handleManualReveal}
          onReset={handleReset}
        />
      </div>
    </section>
  );
};

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ScratchCanvas } from './ScratchCanvas';
import { ScratchProgress } from './ScratchProgress';
import { CountdownDisplay } from './CountdownDisplay';
import { CountdownReveal } from './CountdownReveal';
import { CountdownTimeRemaining } from './countdown.types';
import { COUNTDOWN_CONFIG } from './countdown.config';
import { CornerFlourish } from '../common/DecorativeOrnaments';

interface ScratchCardProps {
  timeLeft: CountdownTimeRemaining;
  isRevealed: boolean;
  percentScratched: number;
  onProgressUpdate: (percent: number) => void;
  onRevealComplete: () => void;
  onRevealNow: () => void;
  onReset?: () => void;
}

export const ScratchCard: React.FC<ScratchCardProps> = ({
  timeLeft,
  isRevealed,
  percentScratched,
  onProgressUpdate,
  onRevealComplete,
  onRevealNow,
  onReset,
}) => {
  const revealRef = useRef<(() => void) | null>(null);
  const resetRef = useRef<(() => void) | null>(null);

  const handleManualReveal = () => {
    if (revealRef.current) {
      revealRef.current();
    } else {
      onRevealNow();
    }
  };

  const handleManualReset = () => {
    if (resetRef.current) {
      resetRef.current();
    }
    if (onReset) onReset();
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
      {/* Scratch Container Card */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8 }}
        className="relative w-full min-h-[340px] xs:min-h-[390px] sm:min-h-[440px] rounded-2xl sm:rounded-3xl p-1 bg-gradient-to-b from-[#581C2B] via-[#380715] to-[#25030C] border-2 border-royalGold/90 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] overflow-hidden gold-border-card"
      >
        {/* Decorative Corner Filigrees on Frame */}
        <div className="absolute inset-0 pointer-events-none z-30">
          <CornerFlourish position="top-left" />
          <CornerFlourish position="top-right" />
          <CornerFlourish position="bottom-left" />
          <CornerFlourish position="bottom-right" />
        </div>

        {/* Ambient Radial Background Glow */}
        <div className="absolute inset-0 bg-radial-gradient from-primaryMaroon/50 via-deepBurgundy to-maroon-950 opacity-90 pointer-events-none" />

        {/* ============================================================== */}
        {/* UNDERNEATH LAYER: The Live Wedding Countdown                    */}
        {/* ============================================================== */}
        <div className="relative z-10 w-full h-full min-h-[330px] xs:min-h-[380px] sm:min-h-[430px] flex items-center justify-center p-2 xs:p-4 sm:p-6">
          <CountdownReveal isRevealed={isRevealed}>
            <CountdownDisplay timeLeft={timeLeft} isRevealed={isRevealed} />
          </CountdownReveal>
        </div>

        {/* ============================================================== */}
        {/* OVERLAY LAYER: Real Interactive Golden Scratch Canvas          */}
        {/* ============================================================== */}
        <ScratchCanvas
          isRevealed={isRevealed}
          brushRadius={COUNTDOWN_CONFIG.brush.defaultRadius}
          autoRevealThreshold={COUNTDOWN_CONFIG.thresholds.autoReveal}
          onProgressUpdate={onProgressUpdate}
          onRevealComplete={onRevealComplete}
          onRevealRef={revealRef}
          onResetRef={resetRef}
        />
      </motion.div>

      {/* Real-time Progress Bar & "Reveal Now" Accessibility Button */}
      <ScratchProgress
        percentScratched={percentScratched}
        isRevealed={isRevealed}
        onRevealNow={handleManualReveal}
        onReset={handleManualReset}
      />
    </div>
  );
};

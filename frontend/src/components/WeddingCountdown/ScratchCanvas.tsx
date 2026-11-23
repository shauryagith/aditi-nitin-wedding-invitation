import React from 'react';
import { motion } from 'framer-motion';
import { ScratchCanvasProps } from './countdown.types';
import { useScratchCanvas } from './useScratchCanvas';
import { COUNTDOWN_CONFIG } from './countdown.config';

export const ScratchCanvas: React.FC<
  ScratchCanvasProps & {
    onRevealRef?: React.MutableRefObject<(() => void) | null>;
    onResetRef?: React.MutableRefObject<(() => void) | null>;
  }
> = ({
  isRevealed,
  brushRadius = COUNTDOWN_CONFIG.brush.defaultRadius,
  autoRevealThreshold = COUNTDOWN_CONFIG.thresholds.autoReveal,
  onProgressUpdate,
  onRevealComplete,
  onStartScratching,
  onStopScratching,
  onRevealRef,
  onResetRef,
}) => {
  const {
    canvasRef,
    percentScratched,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    revealAll,
    resetScratch,
  } = useScratchCanvas({
    isRevealed,
    brushRadius,
    autoRevealThreshold,
    onProgressUpdate,
    onRevealComplete,
    onStartScratching,
    onStopScratching,
  });

  // Expose methods to parent ref if provided
  if (onRevealRef) onRevealRef.current = revealAll;
  if (onResetRef) onResetRef.current = resetScratch;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={isRevealed ? { opacity: 0, pointerEvents: 'none' } : { opacity: 1 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="absolute inset-0 z-20 rounded-2xl overflow-hidden cursor-crosshair select-none"
    >
      {/* 25% & 50% Golden Glow FX */}
      {percentScratched >= COUNTDOWN_CONFIG.thresholds.subtleGlow && !isRevealed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: percentScratched >= COUNTDOWN_CONFIG.thresholds.halfway ? 0.8 : 0.45,
            boxShadow: 'inset 0 0 35px rgba(212, 175, 55, 0.65)',
          }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 pointer-events-none z-10 rounded-2xl"
        />
      )}

      {/* Real HTML5 Interactive Scratch Canvas */}
      <canvas
        ref={canvasRef}
        role="img"
        aria-label="Interactive golden scratch card. Scratch using mouse, touch, or stylus to reveal the live wedding countdown, or use the Reveal Now button."
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className="w-full h-full block rounded-2xl touch-none"
        style={{ touchAction: 'none' }}
      />
    </motion.div>
  );
};

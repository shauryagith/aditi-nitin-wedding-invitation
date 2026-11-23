import React from 'react';
import { motion } from 'framer-motion';

export interface LordGaneshaArtworkProps {
  /** Pixel size or preset size */
  size?: number | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  /** Whether to show the auspicious Sanskrit invocation below the image */
  showText?: boolean;
  /** Invocation verse text style */
  textVariant?: 'shree-ganeshay-namah' | 'om-shree-ganeshay-namah';
  /** Whether to animate a soft radiant golden halo / aura */
  animateAura?: boolean;
  /** Round medallion with transparent border or full artwork */
  shape?: 'round' | 'full';
  /** High priority eager loading */
  priority?: boolean;
}

const SIZE_MAP = {
  sm: 64,
  md: 96,
  lg: 130,
  xl: 160,
};

export const LordGaneshaArtwork: React.FC<LordGaneshaArtworkProps> = ({
  size = 'md',
  className = '',
  showText = true,
  textVariant = 'shree-ganeshay-namah',
  animateAura = true,
  shape = 'round',
  priority = false,
}) => {
  const pixelSize = typeof size === 'number' ? size : SIZE_MAP[size] || 96;

  const imageSrc =
    shape === 'round'
      ? '/assets/wedding/decorations/lord-ganesha-gold-round.webp'
      : '/assets/wedding/decorations/lord-ganesha-gold.webp';

  const fallbackSrc =
    shape === 'round'
      ? '/assets/wedding/decorations/lord-ganesha-gold-round.png'
      : '/assets/wedding/decorations/lord-ganesha-gold.png';

  const textLabel =
    textVariant === 'om-shree-ganeshay-namah'
      ? '॥ ॐ श्री गणेशाय नमः ॥'
      : '॥ श्री गणेशाय नमः ॥';

  return (
    <div
      className={`relative inline-flex flex-col items-center justify-center select-none ${className}`}
      style={{ width: 'fit-content' }}
    >
      {/* Radiant Golden Prabhavali Halo / Aura Glow */}
      {animateAura && (
        <motion.div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: pixelSize * 1.3,
            height: pixelSize * 1.3,
            background:
              'radial-gradient(circle, rgba(212,175,55,0.45) 0%, rgba(245,230,204,0.2) 40%, rgba(212,175,55,0) 70%)',
            filter: 'blur(8px)',
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.65, 0.95, 0.65],
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}

      {/* Decorative Outer Golden Ring */}
      <div
        className="relative z-10 rounded-full p-1 bg-gradient-to-tr from-gold-600 via-royalGold to-gold-200 shadow-[0_0_20px_rgba(212,175,55,0.5)] group"
        style={{
          width: pixelSize + 8,
          height: pixelSize + 8,
        }}
      >
        <div className="w-full h-full rounded-full overflow-hidden bg-deepBurgundy border border-royalGold/80 flex items-center justify-center">
          <picture>
            <source srcSet={imageSrc} type="image/webp" />
            <img
              src={fallbackSrc}
              alt="Bhagwan Shree Ganesha - Auspicious Wedding Blessing"
              width={pixelSize}
              height={pixelSize}
              loading={priority ? 'eager' : 'lazy'}
              decoding="async"
              className="w-full h-full object-cover object-center drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] transform group-hover:scale-105 transition-transform duration-500"
            />
          </picture>
        </div>
      </div>

      {/* Auspicious Sanskrit Invocation */}
      {showText && (
        <motion.p
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="text-xs sm:text-sm uppercase tracking-widest text-royalGold font-bold font-hindi mt-2.5 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)] text-center"
        >
          {textLabel}
        </motion.p>
      )}
    </div>
  );
};

export default LordGaneshaArtwork;

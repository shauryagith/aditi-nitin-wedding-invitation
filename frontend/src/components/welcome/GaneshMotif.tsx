import React from 'react';
import { motion } from 'framer-motion';

interface GaneshMotifProps {
  size?: number;
  className?: string;
  showText?: boolean;
  animateAura?: boolean;
}

export const GaneshMotif: React.FC<GaneshMotifProps> = ({
  size = 80,
  className = '',
  showText = true,
  animateAura = true,
}) => {
  return (
    <div className={`relative inline-flex flex-col items-center justify-center ${className}`}>
      {/* Radiant Glowing Background Aura */}
      {animateAura && (
        <motion.div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: size * 1.35,
            height: size * 1.35,
            background:
              'radial-gradient(circle, rgba(212,175,55,0.45) 0%, rgba(245,230,204,0.18) 45%, rgba(212,175,55,0) 70%)',
            filter: 'blur(8px)',
          }}
          animate={{
            scale: [1, 1.12, 1],
            opacity: [0.6, 0.95, 0.6],
          }}
          transition={{
            duration: 3.2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}

      {/* Royal Gold Ring with High-Resolution Ganesha Medallion */}
      <div
        className="relative z-10 rounded-full p-1 bg-gradient-to-tr from-gold-600 via-royalGold to-gold-200 shadow-[0_0_22px_rgba(212,175,55,0.55)] group"
        style={{
          width: size + 6,
          height: size + 6,
        }}
      >
        <div className="w-full h-full rounded-full overflow-hidden bg-deepBurgundy border border-royalGold/80 flex items-center justify-center">
          <picture>
            <source srcSet="/assets/wedding/decorations/lord-ganesha-gold-round.webp" type="image/webp" />
            <img
              src="/assets/wedding/decorations/lord-ganesha-gold-round.png"
              alt="Bhagwan Shree Ganesha - Auspicious Wedding Blessing"
              width={size}
              height={size}
              loading="eager"
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
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-xs sm:text-sm uppercase tracking-widest text-royalGold font-bold font-hindi mt-2.5 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)] text-center"
        >
          ॥ श्री गणेशाय नमः ॥
        </motion.p>
      )}
    </div>
  );
};

export default GaneshMotif;

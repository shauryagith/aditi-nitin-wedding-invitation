import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart } from 'lucide-react';
import { CornerFlourish } from '../common/DecorativeOrnaments';
import { useLanguage } from '../../context/LanguageContext';

interface WeddingEnvelopeProps {
  isOpen: boolean;
  onOpen: () => void;
  children?: React.ReactNode;
}

export const WeddingEnvelope: React.FC<WeddingEnvelopeProps> = ({
  isOpen,
  onOpen,
  children,
}) => {
  const { language } = useLanguage();

  return (
    <div className="relative w-full max-w-[290px] xs:max-w-[350px] sm:max-w-[440px] md:max-w-[480px] mx-auto perspective-[1200px] select-none">
      <motion.div
        initial={{ scale: 0.88, opacity: 0, y: 35 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full rounded-2xl shadow-[0_20px_50px_-10px_rgba(0,0,0,0.85)] border-2 border-royalGold bg-gradient-to-b from-[#4A0A1C] via-[#380715] to-[#25030C] overflow-visible"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Subtle Gold Embroidered Inner Border */}
        <div className="absolute inset-1.5 rounded-xl border border-dashed border-royalGold/40 pointer-events-none z-10" />

        {/* ============================================================== */}
        {/* CLOSED ENVELOPE STATE: Front Face, Flap & Wax Seal             */}
        {/* ============================================================== */}
        {!isOpen && (
          <div
            onClick={onOpen}
            className="relative w-full min-h-[380px] xs:min-h-[440px] sm:min-h-[490px] flex flex-col items-center justify-between p-4 xs:p-6 cursor-pointer group"
            role="button"
            tabIndex={0}
            aria-label="Click to open royal wedding invitation envelope"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onOpen();
              }
            }}
          >
            {/* Corner Gold Flourishes on the Envelope Face */}
            <CornerFlourish position="top-left" />
            <CornerFlourish position="top-right" />
            <CornerFlourish position="bottom-left" />
            <CornerFlourish position="bottom-right" />

            {/* Folded Top Flap (Triangular SVG pointing down) */}
            <div className="absolute top-0 inset-x-0 h-36 xs:h-44 sm:h-48 z-20 pointer-events-none">
              <svg
                viewBox="0 0 460 175"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.7)]"
                preserveAspectRatio="none"
              >
                <polygon
                  points="0,0 460,0 230,170"
                  fill="url(#closedFlapGradient)"
                  stroke="#D4AF37"
                  strokeWidth="2"
                />
                <polygon
                  points="14,6 446,6 230,158"
                  fill="none"
                  stroke="#D4AF37"
                  strokeWidth="1"
                  strokeDasharray="4 3"
                  opacity="0.65"
                />
                <defs>
                  <linearGradient id="closedFlapGradient" x1="230" y1="0" x2="230" y2="175" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#581C2B" />
                    <stop offset="0.6" stopColor="#3D0715" />
                    <stop offset="1" stopColor="#25030C" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Golden Wax Seal Medallion Positioned on Apex of Flap */}
            <div className="absolute top-32 xs:top-38 sm:top-42 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center">
              {/* Pulsing Golden Halo */}
              <div
                className="absolute -inset-2.5 rounded-full bg-royalGold/30 blur-md animate-ping pointer-events-none"
                style={{ animationDuration: '2.5s' }}
              />

              {/* Scalloped Molten Wax Seal Disc */}
              <div className="relative w-16 h-16 xs:w-18 xs:h-18 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-[#FFF9F0] via-[#D4AF37] to-[#8C6D1F] p-[2px] shadow-[0_8px_30px_rgba(212,175,55,0.7)] group-hover:scale-110 active:scale-95 transition-transform duration-300">
                <div className="w-full h-full rounded-full bg-gradient-to-b from-[#D4AF37] via-[#B89428] to-[#6E5310] flex flex-col items-center justify-center border border-champagne text-deepBurgundy relative overflow-hidden">
                  {/* Glossy Reflection Highlight */}
                  <div className="absolute top-0 inset-x-0 h-1/2 bg-white/25 rounded-t-full pointer-events-none" />

                  {/* Embossed Inner Monogram Ring */}
                  <div className="w-12 h-12 xs:w-13 xs:h-13 sm:w-15 sm:h-15 rounded-full border border-dashed border-[#581C2B]/60 flex flex-col items-center justify-center p-1">
                    <span className="font-script text-xl xs:text-2xl sm:text-3xl font-bold text-[#3D0715] leading-none tracking-tight drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)]">
                      A&amp;N
                    </span>
                    <Heart className="w-2.5 h-2.5 fill-[#800020] text-[#581C2B] mt-0.5" />
                  </div>
                </div>
              </div>

              {/* Interactive "Tap seal to open" Callout Badge */}
              <motion.div
                animate={{ y: [0, 4, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                className="mt-2.5 px-3.5 py-1 rounded-full bg-deepBurgundy/95 border border-royalGold text-champagne text-[10px] xs:text-xs font-semibold whitespace-nowrap shadow-xl backdrop-blur-md flex items-center gap-1.5 group-hover:bg-primaryMaroon transition-colors"
              >
                <Sparkles className="w-3 h-3 text-royalGold animate-spin-slow" />
                <span>{language === 'hi' ? 'खोलने के लिए मोहर स्पर्श करें' : 'Tap seal to open'}</span>
              </motion.div>
            </div>

            {/* Sealed Envelope Center Embellishments (Beneath the Seal) */}
            <div className="mt-auto pt-44 xs:pt-48 sm:pt-52 pb-4 text-center space-y-1.5 z-10">
              <p className="font-heading text-[10px] xs:text-xs uppercase tracking-widest text-champagne/70 font-semibold">
                {language === 'hi' ? '॥ मांगलिक निमंत्रण पत्र ॥' : 'Royal Wedding Invitation'}
              </p>
              <h2 className="font-script text-3xl xs:text-4xl sm:text-5xl text-royalGold drop-shadow-md">
                {language === 'hi' ? 'अदिति एवं नितिन' : 'Aditi & Nitin'}
              </h2>
              <div className="inline-block px-3 py-0.5 rounded-full bg-royalGold/15 border border-royalGold/30 text-[10px] xs:text-xs text-champagne font-medium">
                11 December 2026 • Gorakhpur
              </div>
            </div>

            {/* Bottom Flap Diagonal Gold Piping */}
            <div className="absolute bottom-0 inset-x-0 h-24 pointer-events-none z-10 overflow-hidden rounded-b-2xl opacity-40">
              <svg viewBox="0 0 460 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" preserveAspectRatio="none">
                <path d="M0 100 L230 15 L460 100" stroke="#D4AF37" strokeWidth="1.5" fill="none" />
              </svg>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* OPENED ENVELOPE STATE: 3D Flap Opened, Card Slides Upward      */}
        {/* ============================================================== */}
        {isOpen && (
          <div className="relative w-full overflow-visible">
            {/* Unfolded Top Flap Swung Upward in 3D */}
            <motion.div
              initial={{ rotateX: 0 }}
              animate={{ rotateX: 180 }}
              transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
              style={{
                transformOrigin: 'top center',
                transformStyle: 'preserve-3d',
              }}
              className="absolute top-0 inset-x-0 h-32 xs:h-40 sm:h-44 z-0 pointer-events-none"
            >
              <svg
                viewBox="0 0 460 175"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full filter drop-shadow-[0_-6px_14px_rgba(0,0,0,0.6)]"
                preserveAspectRatio="none"
              >
                <polygon
                  points="0,0 460,0 230,170"
                  fill="#330511"
                  stroke="#D4AF37"
                  strokeWidth="1.5"
                  opacity="0.95"
                />
              </svg>
            </motion.div>

            {/* Golden Radiance Light Emitter From Opening Pocket */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: [0, 0.8, 0.4], scale: [0.8, 1.3, 1] }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              className="absolute top-10 left-1/2 -translate-x-1/2 w-64 h-24 bg-royalGold/20 blur-2xl rounded-full pointer-events-none z-10"
            />

            {/* Sliding Invitation Card Slot */}
            <div className="relative z-20 w-full p-2.5 xs:p-3 sm:p-5">
              {children}
            </div>

            {/* Envelope Bottom Pocket Rim Framing the Card Base */}
            <div className="absolute bottom-0 inset-x-0 h-16 xs:h-20 sm:h-24 pointer-events-none z-30 overflow-hidden rounded-b-2xl">
              <svg
                viewBox="0 0 460 90"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full opacity-60 drop-shadow-[0_-4px_12px_rgba(0,0,0,0.8)]"
                preserveAspectRatio="none"
              >
                <polygon
                  points="0,90 460,90 230,15"
                  fill="url(#pocketGradient)"
                  stroke="#D4AF37"
                  strokeWidth="1.5"
                />
                <defs>
                  <linearGradient id="pocketGradient" x1="230" y1="15" x2="230" y2="90" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#3D0715" />
                    <stop offset="1" stopColor="#25030C" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default WeddingEnvelope;

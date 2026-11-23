import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Eye, RotateCcw } from 'lucide-react';
import { ScratchProgressProps } from './countdown.types';
import { useLanguage } from '../../context/LanguageContext';

export const ScratchProgress: React.FC<ScratchProgressProps> = ({
  percentScratched,
  isRevealed,
  onRevealNow,
  onReset,
}) => {
  const { language } = useLanguage();

  return (
    <div className="w-full max-w-md mx-auto mt-6 text-center">
      {!isRevealed ? (
        <div className="space-y-3">
          {/* Encouraging Progress Label */}
          <p className="text-xs sm:text-sm font-cormorant font-semibold text-champagne/90 tracking-wide flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-royalGold animate-pulse" />
            <span>
              {language === 'hi'
                ? percentScratched > 0
                  ? `पावन तिथि प्रकट हो रही है (${percentScratched}% पूर्ण)...`
                  : 'कार्ड को स्क्रैच करके शुभ मुहूर्त देखें!'
                : percentScratched > 0
                ? `Keep scratching to reveal your special day (${percentScratched}%)...`
                : 'Scratch the golden card to reveal the wedding countdown!'}
            </span>
          </p>

          {/* Golden Progress Bar */}
          <div className="w-full h-2.5 bg-black/40 rounded-full overflow-hidden border border-royalGold/40 p-0.5 shadow-inner">
            <motion.div
              className="h-full bg-gradient-to-r from-royalGold via-[#FFF3B0] to-royalGold rounded-full shadow-[0_0_10px_rgba(212,175,55,0.7)]"
              initial={{ width: 0 }}
              animate={{ width: `${percentScratched}%` }}
              transition={{ ease: 'easeOut', duration: 0.2 }}
            />
          </div>

          {/* Secondary "Reveal Now" Button (Keyboard Accessible) */}
          <div className="pt-2 flex justify-center">
            <button
              type="button"
              onClick={onRevealNow}
              className="group px-5 py-2 rounded-full bg-primaryMaroon/80 hover:bg-primaryMaroon border border-royalGold/60 hover:border-royalGold text-champagne hover:text-white text-xs sm:text-sm font-semibold transition-all duration-300 shadow-md hover:shadow-royalGold/30 flex items-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-royalGold"
              aria-label="Skip scratching and reveal wedding countdown immediately"
            >
              <Eye className="w-4 h-4 text-royalGold group-hover:scale-110 transition-transform" />
              <span>{language === 'hi' ? 'सीधे तिथि देखें' : 'Reveal Now'}</span>
            </button>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center gap-3 pt-2"
        >
          <span className="text-xs uppercase tracking-widest text-royalGold font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-royalGold" />
            {language === 'hi' ? 'शुभ मुहूर्त प्रकट हुआ' : 'Countdown Revealed'}
          </span>

          {onReset && (
            <button
              type="button"
              onClick={onReset}
              className="px-3.5 py-1 rounded-full bg-primaryMaroon/60 hover:bg-primaryMaroon border border-royalGold/30 hover:border-royalGold text-champagne/80 hover:text-white text-[11px] font-medium transition-all flex items-center gap-1.5 cursor-pointer"
              title="Scratch card again"
              aria-label="Scratch card again"
            >
              <RotateCcw className="w-3 h-3 text-royalGold" />
              <span>{language === 'hi' ? 'पुनः स्क्रैच करें' : 'Scratch Again'}</span>
            </button>
          )}
        </motion.div>
      )}
    </div>
  );
};

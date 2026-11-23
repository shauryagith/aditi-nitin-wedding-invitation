import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Calendar, Heart, ArrowRight } from 'lucide-react';
import { GaneshMotif } from './GaneshMotif';
import { CornerFlourish, OrnamentalDivider } from '../common/DecorativeOrnaments';
import { useLanguage } from '../../context/LanguageContext';

interface InvitationCardProps {
  isOpen: boolean;
  onEnterMainSite: () => void;
}

export const InvitationCard: React.FC<InvitationCardProps> = ({
  isOpen,
  onEnterMainSite,
}) => {
  const { language } = useLanguage();

  return (
    <motion.div
      initial={{ y: 40, opacity: 0, scale: 0.95 }}
      animate={
        isOpen
          ? {
              y: 0,
              opacity: 1,
              scale: 1,
              boxShadow: '0 25px 60px -10px rgba(212,175,55,0.4)',
            }
          : {
              y: 30,
              opacity: 0,
              scale: 0.95,
            }
      }
      transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full rounded-2xl bg-[#FFF9F0] p-4 xs:p-5 sm:p-6 md:p-7 shadow-2xl border-2 border-royalGold text-center text-darkBrown overflow-hidden gold-border-card"
    >
      {/* Corner Filigrees with Adaptive Scaling */}
      <div className="scale-75 xs:scale-90 sm:scale-100">
        <CornerFlourish position="top-left" />
        <CornerFlourish position="top-right" />
        <CornerFlourish position="bottom-left" />
        <CornerFlourish position="bottom-right" />
      </div>

      {/* Top Auspicious Invocation: Ganesh Motif & Family Blessings */}
      <div className="mb-1.5 xs:mb-2">
        <GaneshMotif size={56} showText={false} animateAura={isOpen} className="mx-auto" />
        <p className="text-[10px] xs:text-[11px] sm:text-xs uppercase tracking-widest text-primaryMaroon font-bold font-hindi mt-1">
          || श्री गणेशाय नमः ||
        </p>
        <p className="text-[9px] xs:text-[10px] sm:text-xs uppercase tracking-wider text-darkBrown/75 font-cormorant font-semibold mt-0.5">
          {language === 'hi'
            ? 'समस्त पूज्य परिजनों एवं पूर्वजों के शुभाशीर्वाद से'
            : 'With the blessings of our families'}
        </p>
      </div>

      <OrnamentalDivider color="#D4AF37" className="my-1 sm:my-2 scale-70 xs:scale-80 sm:scale-90" />

      {/* Couple Names in Great Vibes Script Calligraphy */}
      <div className="my-1.5 xs:my-2 sm:my-3">
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="font-script text-3xl xs:text-4xl sm:text-5xl md:text-6xl text-primaryMaroon leading-none drop-shadow-[0_1px_2px_rgba(212,175,55,0.3)]"
        >
          {language === 'hi' ? 'अदिति' : 'Aditi'}
        </motion.h1>

        <div className="flex items-center justify-center my-1 gap-2 text-royalGold">
          <div className="h-[1px] w-6 xs:w-8 sm:w-12 bg-royalGold/50" />
          <Heart className="w-3 h-3 xs:w-3.5 xs:h-3.5 fill-primaryMaroon text-royalGold animate-pulse" />
          <div className="h-[1px] w-6 xs:w-8 sm:w-12 bg-royalGold/50" />
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28, duration: 0.6 }}
          className="font-script text-3xl xs:text-4xl sm:text-5xl md:text-6xl text-primaryMaroon leading-none drop-shadow-[0_1px_2px_rgba(212,175,55,0.3)]"
        >
          {language === 'hi' ? 'नितिन' : 'Nitin'}
        </motion.h1>
      </div>

      {/* Tagline & Date Badge */}
      <div className="space-y-1 my-1.5 xs:my-2">
        <p className="font-cormorant text-[10px] xs:text-xs sm:text-sm font-semibold tracking-wider text-royalGold uppercase">
          {language === 'hi' ? 'स्नेह एवं परिणय का पावन उत्सव' : 'A Celebration of Love • Together Forever'}
        </p>

        {/* Auspicious Date Pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 xs:py-1 rounded-full bg-champagne/70 border border-royalGold/50 text-[10px] xs:text-xs sm:text-sm font-bold text-primaryMaroon shadow-sm">
          <Calendar className="w-3 h-3 xs:w-3.5 xs:h-3.5 text-royalGold" />
          <span>{language === 'hi' ? '११ दिसम्बर २०२६ • शुक्रवार' : '11 December 2026 • Gorakhpur'}</span>
        </div>
      </div>

      {/* Personal Invitation Note */}
      <p className="text-[11px] xs:text-xs sm:text-sm text-darkBrown/85 font-cormorant italic px-1 xs:px-2 my-1.5 xs:my-2 leading-relaxed">
        {language === 'hi'
          ? 'आपकी स्नेहिल उपस्थिति हमारे जीवन के इस मांगलिक उत्सव को पूर्ण बनाएगी।'
          : 'Your presence will make our celebration complete.'}
      </p>

      {/* Main Entrance Button: OPEN WEDDING INVITATION */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-3 xs:mt-4 pt-2 border-t border-royalGold/30 flex flex-col items-center space-y-1"
        >
          <button
            onClick={onEnterMainSite}
            className="group relative w-full sm:w-auto px-6 xs:px-8 py-2.5 xs:py-3 sm:py-3.5 rounded-full bg-gradient-to-r from-royalGold via-[#F5E6CC] to-royalGold text-deepBurgundy font-bold text-xs xs:text-sm tracking-wider uppercase shadow-[0_8px_25px_rgba(212,175,55,0.5)] border-2 border-royalGold hover:shadow-[0_12px_35px_rgba(212,175,55,0.7)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden cursor-pointer"
          >
            {/* Shimmer light sweep */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

            <Sparkles className="w-3.5 h-3.5 xs:w-4 xs:h-4 text-primaryMaroon group-hover:rotate-12 transition-transform" />
            <span className="font-heading">
              {language === 'hi' ? 'शुभ विवाह आमंत्रण देखें' : 'OPEN WEDDING INVITATION'}
            </span>
            <ArrowRight className="w-3.5 h-3.5 xs:w-4 xs:h-4 text-primaryMaroon group-hover:translate-x-1 transition-transform" />
          </button>

          <span className="text-[9px] xs:text-[10px] sm:text-[11px] text-primaryMaroon/80 font-cormorant italic font-semibold pt-0.5">
            {language === 'hi' ? 'सस्नेह एवं मंगलकामनाओं सहित' : 'With Love & Blessings'}
          </span>
        </motion.div>
      )}
    </motion.div>
  );
};

export default InvitationCard;

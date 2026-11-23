import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart } from 'lucide-react';
import { CountdownDisplayProps } from './countdown.types';
import { CountdownUnit } from './CountdownUnit';
import { useLanguage } from '../../context/LanguageContext';
import { OrnamentalDivider } from '../common/DecorativeOrnaments';

export const CountdownDisplay: React.FC<CountdownDisplayProps> = ({ timeLeft, isRevealed }) => {
  const { language } = useLanguage();

  if (timeLeft.isCompleted) {
    return (
      <div className="p-6 sm:p-10 rounded-2xl bg-gradient-to-b from-[#4A0A1C] via-[#380715] to-[#25030C] border-2 border-royalGold text-center shadow-2xl gold-border-card max-w-xl mx-auto">
        <Sparkles className="w-10 h-10 text-royalGold mx-auto mb-3 animate-pulse" />
        <h3 className="font-heading text-2xl sm:text-3xl font-bold text-champagne">
          {language === 'hi' ? '॥ पावन विवाह उत्सव प्रारंभ ॥' : 'The Wedding Celebration Has Begun!'}
        </h3>
        <p className="font-cormorant italic text-sm sm:text-lg text-ivory/90 mt-2 leading-relaxed">
          {language === 'hi'
            ? 'अदिति एवं नितिन के जीवन के इस दिव्य परिणय पर प्रभु का असीम आशीर्वाद सदा बना रहे।'
            : 'May divine blessings, love, and joyous moments surround Aditi & Nitin as they embark on this sacred journey.'}
        </p>
        <p className="text-xs uppercase tracking-widest text-royalGold font-bold mt-4">
          11 December 2026 • Gorakhpur
        </p>
      </div>
    );
  }

  return (
    <div
      className="w-full max-w-xl mx-auto flex flex-col items-center justify-center text-center p-2 xs:p-4 sm:p-6 select-none"
      aria-live="polite"
    >
      {/* Auspicious Sub-Header */}
      <span className="text-[10px] xs:text-xs uppercase tracking-widest text-royalGold font-semibold font-hindi">
        {language === 'hi' ? '॥ शुभ विवाह में शेष समय ॥' : 'The Celebration Begins In'}
      </span>

      {/* Couple Calligraphy */}
      <h3 className="font-script text-2xl xs:text-4xl sm:text-5xl md:text-6xl text-champagne my-1 drop-shadow-md">
        {language === 'hi' ? 'अदिति एवं नितिन' : 'Aditi & Nitin'}
      </h3>

      <div className="my-1 xs:my-2 w-full max-w-xs">
        <OrnamentalDivider color="#D4AF37" className="scale-75 xs:scale-85 sm:scale-100 my-1" />
      </div>

      {/* 4 Premium Horizontally Aligned Countdown Boxes (Responsive Grid on Mobile) */}
      <div className="grid grid-cols-4 gap-1.5 xs:gap-3 sm:gap-6 md:gap-8 my-2 xs:my-4 sm:my-6 justify-center w-full max-w-lg">
        <CountdownUnit
          value={timeLeft.days}
          label="Days"
          labelHi={language === 'hi' ? 'दिन' : 'Days'}
        />
        <CountdownUnit
          value={timeLeft.hours}
          label="Hours"
          labelHi={language === 'hi' ? 'घंटे' : 'Hours'}
        />
        <CountdownUnit
          value={timeLeft.minutes}
          label="Minutes"
          labelHi={language === 'hi' ? 'मिनट' : 'Minutes'}
        />
        <CountdownUnit
          value={timeLeft.seconds}
          label="Seconds"
          labelHi={language === 'hi' ? 'सेकंड' : 'Seconds'}
        />
      </div>

      {/* Footer Date & Motto */}
      <div className="mt-1 xs:mt-2 space-y-1">
        <p className="font-heading text-xs xs:text-sm sm:text-base font-bold text-champagne tracking-wider">
          {language === 'hi' ? '११ दिसम्बर २०२६ • गोरखपुर' : '11 December 2026'}
        </p>
        <p className="font-cormorant italic text-xs xs:text-sm text-champagne/80">
          {language === 'hi'
            ? 'सदा साथ — प्रेम एवं समर्पण का पावन उत्सव'
            : 'Together Forever – A Celebration of Love.'}
        </p>
      </div>

      {/* Screen-reader accessible announcement */}
      <span className="sr-only">
        {`${timeLeft.days} days, ${timeLeft.hours} hours, ${timeLeft.minutes} minutes, ${timeLeft.seconds} seconds remaining until the wedding.`}
      </span>
    </div>
  );
};

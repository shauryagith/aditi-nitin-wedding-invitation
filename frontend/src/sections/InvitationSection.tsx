import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { WEDDING_CONFIG } from '../config/wedding.config';
import { WeddingConfig } from '../types/wedding';
import { weddingService } from '../services/api';
import { weddingSyncManager } from '../utils/dataSync';
import { useRealtimeCMS } from '../hooks/useRealtimeCMS';
import { OrnamentalDivider, CornerFlourish, GaneshaEmblem, KalashMotif, DiyaMotif } from '../components/common/DecorativeOrnaments';
import { LordGaneshaArtwork } from '../components/common/LordGaneshaArtwork';

export const InvitationSection: React.FC = () => {
  const { t, language } = useLanguage();
  const [config, setConfig] = useState<WeddingConfig>(WEDDING_CONFIG);

  const loadInvitation = useCallback(() => {
    weddingService.getWeddingDetails().then((data) => {
      if (data) setConfig(data);
    });
  }, []);

  useEffect(() => {
    loadInvitation();
    return weddingSyncManager.subscribe(loadInvitation);
  }, [loadInvitation]);

  // Real-Time Socket.IO Synchronization
  useRealtimeCMS(['wedding', 'venue', 'settings'], () => {
    loadInvitation();
  });

  const { bride, groom, traditionalBlessing, invitationMessage, weddingDateFormatted, weddingDateFormattedHi, venue } = config;

  return (
    <section id="invitation" className="py-20 sm:py-28 px-4 sm:px-6 bg-ivory relative overflow-hidden">
      {/* Decorative background watermark */}
      <div className="absolute inset-0 ivory-pattern-bg opacity-40 pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8 }}
          className="relative bg-[#FFFDF9] rounded-3xl p-5 xs:p-8 sm:p-12 md:p-14 shadow-2xl border-2 border-royalGold text-center text-darkBrown gold-border-card"
        >
          {/* Ornaments in corners */}
          <CornerFlourish position="top-left" />
          <CornerFlourish position="top-right" />
          <CornerFlourish position="bottom-left" />
          <CornerFlourish position="bottom-right" />

          {/* Ganesha & Sacred Verse */}
          <div className="mb-6 flex flex-col items-center justify-center">
            <div className="flex items-center justify-center gap-4 sm:gap-8">
              <DiyaMotif size={36} className="hidden sm:inline-flex opacity-85" />
              <LordGaneshaArtwork
                size={110}
                animateAura={true}
                showText={false}
                priority={true}
                className="drop-shadow-lg"
              />
              <DiyaMotif size={36} className="hidden sm:inline-flex opacity-85" />
            </div>
            <h2 className="text-sm sm:text-base uppercase tracking-widest text-primaryMaroon font-bold font-hindi mt-3 drop-shadow-sm">
              ॥ ॐ श्री गणेशाय नमः ॥
            </h2>
          </div>

          {/* Sanskrit Shloka Card */}
          <div className="my-5 p-4 sm:p-6 rounded-2xl bg-champagne/40 border border-royalGold/50 max-w-2xl mx-auto shadow-inner">
            <p className="font-hindi text-base sm:text-lg md:text-xl text-primaryMaroon font-semibold leading-relaxed">
              {traditionalBlessing.sanskrit}
            </p>
            <p className="text-xs sm:text-sm text-darkBrown/80 font-cormorant italic mt-2.5">
              {language === 'hi' ? traditionalBlessing.hindi : traditionalBlessing.english}
            </p>
          </div>

          <OrnamentalDivider color="#D4AF37" className="my-4" />

          {/* Invitation Message */}
          <p className="font-cormorant text-lg sm:text-xl md:text-2xl text-primaryMaroon max-w-2xl mx-auto leading-relaxed italic my-4">
            {language === 'hi' ? invitationMessage.hindi : invitationMessage.english}
          </p>

          {/* Auspicious Date & Venue Highlight */}
          <div className="my-6 inline-flex flex-wrap items-center justify-center gap-3 sm:gap-6 py-2 px-6 rounded-full bg-champagne/60 border border-royalGold/60 shadow-sm">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-primaryMaroon">
              <Calendar className="w-4 h-4 text-royalGold flex-shrink-0" />
              <span>{language === 'hi' ? weddingDateFormattedHi : weddingDateFormatted}</span>
            </div>
            <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-royalGold" />
            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-primaryMaroon">
              <MapPin className="w-4 h-4 text-royalGold flex-shrink-0" />
              <span>Gorakhpur, Uttar Pradesh</span>
            </div>
          </div>

          {/* Couple Announcement with Parents Info (2-column layout) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 my-8 sm:my-10 relative">
            {/* Center connector for large screens */}
            <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex-col items-center z-10">
              <span className="font-script text-3xl sm:text-4xl text-royalGold font-normal bg-[#FFFDF9] px-3 py-1 rounded-full border border-royalGold/40 shadow-md">
                weds
              </span>
            </div>

            {/* Bride Details */}
            <div className="p-6 sm:p-7 rounded-2xl bg-ivory/90 border border-royalGold/40 shadow-md relative group hover:border-royalGold transition-colors text-center">
              <span className="text-xs uppercase tracking-widest text-royalGold font-bold block mb-1">
                {t.invitation.brideFamilyHeading}
              </span>
              <h3 className="font-script text-4xl sm:text-5xl font-normal text-primaryMaroon leading-tight mt-1">
                {language === 'hi' ? bride.nameHi : bride.name}
              </h3>
              <p className="font-heading text-lg sm:text-xl font-bold text-darkBrown mt-0.5">
                {language === 'hi' ? bride.fullNameHi : bride.fullName}
              </p>
              <div className="h-[1px] w-16 bg-royalGold/50 mx-auto my-3" />
              <p className="text-xs uppercase tracking-wider text-darkBrown/70 font-semibold">
                {t.invitation.daughterOf}
              </p>
              <div className="mt-1 text-sm sm:text-base font-serif text-primaryMaroon font-bold space-y-0.5">
                <p>{language === 'hi' ? bride.motherHi : bride.mother}</p>
                <p>&amp; {language === 'hi' ? bride.fatherHi : bride.father}</p>
              </div>
            </div>

            {/* Groom Details */}
            <div className="p-6 sm:p-7 rounded-2xl bg-ivory/90 border border-royalGold/40 shadow-md relative group hover:border-royalGold transition-colors text-center">
              <span className="text-xs uppercase tracking-widest text-royalGold font-bold block mb-1">
                {t.invitation.groomFamilyHeading}
              </span>
              <h3 className="font-script text-4xl sm:text-5xl font-normal text-primaryMaroon leading-tight mt-1">
                {language === 'hi' ? groom.nameHi : groom.name}
              </h3>
              <p className="font-heading text-lg sm:text-xl font-bold text-darkBrown mt-0.5">
                {language === 'hi' ? groom.fullNameHi : groom.fullName}
              </p>
              <div className="h-[1px] w-16 bg-royalGold/50 mx-auto my-3" />
              <p className="text-xs uppercase tracking-wider text-darkBrown/70 font-semibold">
                {t.invitation.sonOf}
              </p>
              <div className="mt-1 text-sm sm:text-base font-serif text-primaryMaroon font-bold space-y-0.5">
                <p>{language === 'hi' ? groom.motherHi : groom.mother}</p>
                <p>&amp; {language === 'hi' ? groom.fatherHi : groom.father}</p>
              </div>
            </div>
          </div>

          <OrnamentalDivider color="#D4AF37" className="my-4" />

          {/* Blessings closing note */}
          <div className="mt-4">
            <KalashMotif size={44} className="mx-auto mb-2 text-royalGold" />
            <p className="text-sm sm:text-base font-cormorant italic text-darkBrown/80 max-w-xl mx-auto">
              {language === 'hi'
                ? 'आपकी गरिमामयी उपस्थिति एवं स्नेहिल आशीर्वाद के हम सादर अभिलाषी हैं।'
                : 'Soliciting your gracious presence, heartfelt prayers, and auspicious blessings on this momentous union.'}
            </p>
            <p className="text-xs uppercase tracking-widest text-primaryMaroon font-bold mt-3 font-heading">
              {language === 'hi' ? '— समस्त श्रीवास्तव एवं जोशी परिवार —' : '— With Warm Regards from Both Families —'}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default InvitationSection;

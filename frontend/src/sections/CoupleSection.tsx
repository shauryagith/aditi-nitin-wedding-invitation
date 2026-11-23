import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { WEDDING_CONFIG } from '../config/wedding.config';
import { weddingService } from '../services/api';
import { weddingSyncManager } from '../utils/dataSync';
import { useRealtimeCMS } from '../hooks/useRealtimeCMS';
import { OrnamentalDivider, CornerFlourish } from '../components/common/DecorativeOrnaments';

export const CoupleSection: React.FC = () => {
  const { t, language } = useLanguage();
  const [couple, setCouple] = useState({ bride: WEDDING_CONFIG.bride, groom: WEDDING_CONFIG.groom });

  const loadCouple = useCallback(() => {
    weddingService.getWeddingDetails().then((data: any) => {
      if (data) {
        setCouple({
          bride: {
            ...WEDDING_CONFIG.bride,
            ...(data.bride || {}),
            photoUrl: data.bride?.photoUrl || data.bride?.image || data.brideImage || WEDDING_CONFIG.bride.photoUrl,
          },
          groom: {
            ...WEDDING_CONFIG.groom,
            ...(data.groom || {}),
            photoUrl: data.groom?.photoUrl || data.groom?.image || data.groomImage || WEDDING_CONFIG.groom.photoUrl,
          },
        });
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    loadCouple();
    return weddingSyncManager.subscribe(loadCouple);
  }, [loadCouple]);

  // Real-Time Socket.IO Synchronization
  useRealtimeCMS(['couple', 'wedding'], () => {
    loadCouple();
  });

  const { bride, groom } = couple;

  return (
    <section id="couple" className="py-20 sm:py-28 px-4 sm:px-6 bg-deepBurgundy text-ivory relative overflow-hidden">
      {/* Background mandala decoration */}
      <div className="absolute inset-0 mandala-bg opacity-15 pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section Heading */}
        <div className="text-center mb-16 sm:mb-20">
          <span className="text-xs uppercase tracking-widest text-royalGold font-semibold font-hindi">
            ॥ वर-वधू परिचय ॥
          </span>
          <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-ivory mt-2">
            {t.couple.sectionTitle}
          </h2>
          <p className="font-cormorant text-base sm:text-xl text-champagne/90 italic mt-2 max-w-xl mx-auto">
            {t.couple.sectionSubtitle}
          </p>
          <OrnamentalDivider color="#D4AF37" className="my-3 scale-90" />
        </div>

        {/* Profiles Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-stretch">
          {/* Bride Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 p-5 xs:p-6 sm:p-8 rounded-3xl bg-primaryMaroon/85 border-2 border-royalGold/60 backdrop-blur-md shadow-2xl relative group hover:border-royalGold transition-all duration-300"
          >
            {/* Bride Photo with Gold Frame */}
            <div className="relative w-44 h-56 xs:w-48 xs:h-60 sm:w-56 sm:h-72 flex-shrink-0 rounded-2xl overflow-hidden border-2 border-royalGold shadow-2xl bg-maroon-950">
              <img
                src={bride.photoUrl}
                alt={bride.fullName}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = WEDDING_CONFIG.bride.photoUrl;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-deepBurgundy/90 via-transparent to-transparent" />
              <div className="absolute bottom-2.5 inset-x-2 text-center">
                <span className="px-3 py-1 rounded-full bg-royalGold text-deepBurgundy text-xs font-bold uppercase tracking-wider shadow-md">
                  {language === 'hi' ? bride.roleHi : bride.role}
                </span>
              </div>
            </div>

            {/* Bride Details */}
            <div className="flex-1 text-center sm:text-left space-y-2">
              <span className="text-[11px] uppercase tracking-widest text-royalGold font-semibold">
                {t.invitation.brideFamilyHeading}
              </span>
              <h3 className="font-script text-4xl sm:text-5xl text-champagne leading-tight">
                {language === 'hi' ? bride.nameHi : bride.name}
              </h3>
              <p className="font-heading text-lg font-bold text-ivory">
                {language === 'hi' ? bride.fullNameHi : bride.fullName}
              </p>
              <p className="text-xs text-champagne/80 font-medium">
                {t.invitation.daughterOf} {language === 'hi' ? bride.motherHi : bride.mother} &amp; {language === 'hi' ? bride.fatherHi : bride.father}
              </p>
              <div className="h-[1px] w-16 bg-royalGold/50 my-2 mx-auto sm:mx-0" />
              <p className="text-xs sm:text-sm text-ivory/80 leading-relaxed font-sans font-light">
                {language === 'hi' ? bride.bioHi : bride.bio}
              </p>
            </div>
          </motion.div>

          {/* Groom Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 p-5 xs:p-6 sm:p-8 rounded-3xl bg-primaryMaroon/85 border-2 border-royalGold/60 backdrop-blur-md shadow-2xl relative group hover:border-royalGold transition-all duration-300"
          >
            {/* Groom Photo with Gold Frame */}
            <div className="relative w-44 h-56 xs:w-48 xs:h-60 sm:w-56 sm:h-72 flex-shrink-0 rounded-2xl overflow-hidden border-2 border-royalGold shadow-2xl bg-maroon-950">
              <img
                src={groom.photoUrl}
                alt={groom.fullName}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = WEDDING_CONFIG.groom.photoUrl;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-deepBurgundy/90 via-transparent to-transparent" />
              <div className="absolute bottom-2.5 inset-x-2 text-center">
                <span className="px-3 py-1 rounded-full bg-royalGold text-deepBurgundy text-xs font-bold uppercase tracking-wider shadow-md">
                  {language === 'hi' ? groom.roleHi : groom.role}
                </span>
              </div>
            </div>

            {/* Groom Details */}
            <div className="flex-1 text-center sm:text-left space-y-2">
              <span className="text-[11px] uppercase tracking-widest text-royalGold font-semibold">
                {t.invitation.groomFamilyHeading}
              </span>
              <h3 className="font-script text-4xl sm:text-5xl text-champagne leading-tight">
                {language === 'hi' ? groom.nameHi : groom.name}
              </h3>
              <p className="font-heading text-lg font-bold text-ivory">
                {language === 'hi' ? groom.fullNameHi : groom.fullName}
              </p>
              <p className="text-xs text-champagne/80 font-medium">
                {t.invitation.sonOf} {language === 'hi' ? groom.motherHi : groom.mother} &amp; {language === 'hi' ? groom.fatherHi : groom.father}
              </p>
              <div className="h-[1px] w-16 bg-royalGold/50 my-2 mx-auto sm:mx-0" />
              <p className="text-xs sm:text-sm text-ivory/80 leading-relaxed font-sans font-light">
                {language === 'hi' ? groom.bioHi : groom.bio}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Photography Reference Note */}
        <div className="mt-8 text-center">
          <p className="text-[11px] sm:text-xs text-champagne/60 font-cormorant italic">
            {language === 'hi'
              ? 'पारंपरिक भारतीय वैवाहिक छायाचित्र संदर्भ। वर एवं वधू के वास्तविक छायाचित्र एडमिन पोर्टल से कभी भी बदले जा सकते हैं।'
              : 'Traditional Indian wedding portrait references. Actual couple photographs are fully editable via the administration dashboard.'}
          </p>
        </div>
      </div>
    </section>
  );
};

export default CoupleSection;

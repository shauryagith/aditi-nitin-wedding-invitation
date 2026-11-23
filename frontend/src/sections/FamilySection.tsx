import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Users, Heart, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { WEDDING_CONFIG } from '../config/wedding.config';
import { WEDDING_IMAGES } from '../config/weddingImages';
import { weddingService } from '../services/api';
import { weddingSyncManager } from '../utils/dataSync';
import { useRealtimeCMS } from '../hooks/useRealtimeCMS';
import { OrnamentalDivider, KalashMotif, CornerFlourish } from '../components/common/DecorativeOrnaments';

export const FamilySection: React.FC = () => {
  const { t, language } = useLanguage();
  const [couple, setCouple] = useState({ bride: WEDDING_CONFIG.bride, groom: WEDDING_CONFIG.groom });

  const loadFamily = useCallback(() => {
    weddingService.getWeddingDetails().then((data) => {
      if (data && data.bride && data.groom) {
        setCouple({ bride: data.bride, groom: data.groom });
      }
    });
  }, []);

  useEffect(() => {
    loadFamily();
    return weddingSyncManager.subscribe(loadFamily);
  }, [loadFamily]);

  // Real-Time Socket.IO Synchronization
  useRealtimeCMS(['family', 'wedding'], () => {
    loadFamily();
  });

  const { bride, groom } = couple;

  return (
    <section id="family" className="py-20 sm:py-28 px-4 sm:px-6 bg-ivory relative overflow-hidden">
      {/* Background Subtle Watermark */}
      <div className="absolute inset-0 ivory-pattern-bg opacity-35 pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 sm:mb-20">
          <span className="text-xs uppercase tracking-widest text-royalGold font-bold font-hindi">
            ॥ स्नेही परिजन ॥
          </span>
          <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-primaryMaroon mt-2">
            {t.family.sectionTitle}
          </h2>
          <p className="font-cormorant text-base sm:text-xl text-darkBrown/80 italic mt-2 max-w-xl mx-auto">
            {t.family.sectionSubtitle}
          </p>
          <OrnamentalDivider color="#D4AF37" className="my-3 scale-90 sm:scale-100" />
        </div>

        {/* Families 2-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
          {/* Srivastava Family (Bride's Side) */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7 }}
            className="rounded-3xl bg-[#FFFDF9] border-2 border-royalGold p-5 xs:p-6 sm:p-8 shadow-2xl text-center relative overflow-hidden gold-border-card flex flex-col justify-between"
          >
            <CornerFlourish position="top-left" />
            <CornerFlourish position="top-right" />
            <CornerFlourish position="bottom-left" />
            <CornerFlourish position="bottom-right" />

            <div>
              {/* Family Portrait with Gold Frame */}
              <div className="relative w-full h-48 sm:h-56 rounded-2xl overflow-hidden border-2 border-royalGold shadow-md mb-5 bg-maroon-950 group">
                <img
                  src={WEDDING_IMAGES.family.srivastava}
                  alt="The Srivastava Family"
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/wedding-assets/optimized/family-srivastava.webp';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-deepBurgundy/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-royalGold/90 text-deepBurgundy text-[11px] font-bold uppercase tracking-wider shadow-sm">
                    {language === 'hi' ? 'वधू पक्ष' : "Bride's Side"}
                  </span>
                  <span className="text-[11px] text-champagne/90 font-medium">Gorakhpur</span>
                </div>
              </div>

              <h3 className="font-heading text-2xl sm:text-3xl font-bold text-primaryMaroon mt-1">
                {language === 'hi' ? 'श्रीवास्तव परिवार' : 'The Srivastava Family'}
              </h3>

              {/* Parents Highlight Block */}
              <div className="my-4 py-3.5 px-4 rounded-2xl bg-champagne/40 border border-royalGold/40 shadow-inner">
                <span className="text-[10px] uppercase tracking-wider text-primaryMaroon font-bold block mb-1">
                  {language === 'hi' ? 'पूज्य माता एवं पिता' : 'Loving Parents'}
                </span>
                <p className="text-base sm:text-lg font-heading font-bold text-darkBrown">
                  {language === 'hi' ? bride.motherHi : bride.mother}
                </p>
                <p className="text-sm font-script text-royalGold my-0.5">&amp;</p>
                <p className="text-base sm:text-lg font-heading font-bold text-darkBrown">
                  {language === 'hi' ? bride.fatherHi : bride.father}
                </p>
              </div>

              <p className="text-xs sm:text-sm text-darkBrown/80 font-cormorant italic leading-relaxed px-2">
                {language === 'hi'
                  ? 'गोरखपुर की पावन धरा से, हमारी लाडली बिटिया अदिति के इस शुभ परिणय में आप सभी का हार्दिक अभिनंदन। आपके पावन आशीष से हमारे जीवन का यह उत्सव धन्य होगा।'
                  : 'From our ancestral home in Gorakhpur, we warmly invite you to grace the wedding of our beloved daughter Aditi. Your warm blessings will forever illuminate their new beginning.'}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-royalGold/30 flex justify-center items-center gap-2 text-xs font-semibold text-primaryMaroon">
              <Sparkles className="w-3.5 h-3.5 text-royalGold" />
              <span>Gorakhpur, Uttar Pradesh</span>
            </div>
          </motion.div>

          {/* Joshi Family (Groom's Side) */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="rounded-3xl bg-[#FFFDF9] border-2 border-royalGold p-5 xs:p-6 sm:p-8 shadow-2xl text-center relative overflow-hidden gold-border-card flex flex-col justify-between"
          >
            <CornerFlourish position="top-left" />
            <CornerFlourish position="top-right" />
            <CornerFlourish position="bottom-left" />
            <CornerFlourish position="bottom-right" />

            <div>
              {/* Family Portrait with Gold Frame */}
              <div className="relative w-full h-48 sm:h-56 rounded-2xl overflow-hidden border-2 border-royalGold shadow-md mb-5 bg-maroon-950 group">
                <img
                  src={WEDDING_IMAGES.family.joshi}
                  alt="The Joshi Family"
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/wedding-assets/optimized/family-joshi.webp';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-deepBurgundy/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-royalGold/90 text-deepBurgundy text-[11px] font-bold uppercase tracking-wider shadow-sm">
                    {language === 'hi' ? 'वर पक्ष' : "Groom's Side"}
                  </span>
                  <span className="text-[11px] text-champagne/90 font-medium">Blessings &amp; Prayers</span>
                </div>
              </div>

              <h3 className="font-heading text-2xl sm:text-3xl font-bold text-primaryMaroon mt-1">
                {language === 'hi' ? 'जोशी परिवार' : 'The Joshi Family'}
              </h3>

              {/* Parents Highlight Block */}
              <div className="my-4 py-3.5 px-4 rounded-2xl bg-champagne/40 border border-royalGold/40 shadow-inner">
                <span className="text-[10px] uppercase tracking-wider text-primaryMaroon font-bold block mb-1">
                  {language === 'hi' ? 'पूज्य माता एवं पिता' : 'Loving Parents'}
                </span>
                <p className="text-base sm:text-lg font-heading font-bold text-darkBrown">
                  {language === 'hi' ? groom.motherHi : groom.mother}
                </p>
                <p className="text-sm font-script text-royalGold my-0.5">&amp;</p>
                <p className="text-base sm:text-lg font-heading font-bold text-darkBrown">
                  {language === 'hi' ? groom.fatherHi : groom.father}
                </p>
              </div>

              <p className="text-xs sm:text-sm text-darkBrown/80 font-cormorant italic leading-relaxed px-2">
                {language === 'hi'
                  ? 'हमारे सुपुत्र नितिन के जीवन के इस मांगलिक अवसर पर आपका स्नेह और उपस्थिति हमारे लिए अत्यंत सौभाग्यशाली है। आप सभी का सस्नेह व आदरपूर्वक स्वागत है।'
                  : 'On this sacred milestone in the life of our son Nitin, your auspicious presence, affection, and blessings will be our greatest honor. We cordially welcome you.'}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-royalGold/30 flex justify-center items-center gap-2 text-xs font-semibold text-primaryMaroon">
              <Sparkles className="w-3.5 h-3.5 text-royalGold" />
              <span>With Sincere Regard &amp; Prayers</span>
            </div>
          </motion.div>
        </div>

        {/* United Families Celebration Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.8 }}
          className="mt-12 sm:mt-16 rounded-3xl overflow-hidden border-2 border-royalGold bg-deepBurgundy text-ivory shadow-2xl relative"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
            <div className="relative h-64 sm:h-80 w-full overflow-hidden">
              <img
                src={WEDDING_IMAGES.family.united}
                alt="Two Families United in Joy"
                className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-deepBurgundy/30 to-deepBurgundy lg:block hidden" />
            </div>
            <div className="p-8 sm:p-12 text-center lg:text-left space-y-3">
              <span className="text-xs uppercase tracking-widest text-royalGold font-bold">
                {language === 'hi' ? '॥ दो कुल, एक पावन संगम ॥' : 'Two Families, One Sacred Celebration'}
              </span>
              <h3 className="font-heading text-3xl sm:text-4xl font-bold text-champagne">
                {language === 'hi' ? 'परंपरा, संस्कार और आत्मीयता' : 'Heritage, Love & Boundless Gratitude'}
              </h3>
              <p className="text-xs sm:text-sm text-ivory/80 font-cormorant italic leading-relaxed">
                {language === 'hi'
                  ? 'श्रीवास्तव एवं जोशी परिवार मिलकर इस पावन वैवाहिक उत्सव में आपका सादर स्वागत करते हैं। आपका आगमन नवयुगल के सुखद भविष्य का आधार बनेगा।'
                  : 'The Srivastava and Joshi families join hands to welcome you to this sacred union. Your blessings will forever illuminate Aditi & Nitin’s journey together.'}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FamilySection;

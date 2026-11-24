import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, BookOpen, Quote } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { WEDDING_CONFIG } from '../config/wedding.config';
import { weddingService } from '../services/api';
import { weddingSyncManager } from '../utils/dataSync';
import { useRealtimeCMS } from '../hooks/useRealtimeCMS';
import { OrnamentalDivider, CornerFlourish } from '../components/common/DecorativeOrnaments';

export const OurStory: React.FC = () => {
  const { language, t } = useLanguage();
  const [milestones, setMilestones] = useState(WEDDING_CONFIG.storyMilestones);

  const loadStory = useCallback(() => {
    weddingService.getWeddingDetails().then((data: any) => {
      if (data && data.storyMilestones && data.storyMilestones.length > 0) {
        setMilestones(data.storyMilestones);
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    loadStory();
    return weddingSyncManager.subscribe(loadStory);
  }, [loadStory]);

  // Real-Time Socket.IO Synchronization
  useRealtimeCMS('story', (payload) => {
    if (payload.data && Array.isArray(payload.data) && payload.data.length > 0) {
      setMilestones(payload.data);
    } else {
      loadStory();
    }
  });

  return (
    <section id="our-story" className="py-20 sm:py-28 px-4 sm:px-6 bg-deepBurgundy text-ivory relative overflow-hidden">
      {/* Background Mandala & Ambient Lighting */}
      <div className="absolute inset-0 bg-radial-gradient from-primaryMaroon/50 via-deepBurgundy to-deepBurgundy opacity-95" />
      <div className="absolute inset-0 mandala-bg opacity-15 pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 sm:mb-20">
          <span className="text-xs uppercase tracking-widest text-royalGold font-bold font-hindi">
            ॥ प्रीति कथा ॥
          </span>
          <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-ivory mt-2">
            {t.ourStory.sectionTitle}
          </h2>
          <p className="font-cormorant text-base sm:text-xl text-champagne/90 italic mt-2 max-w-xl mx-auto">
            {t.ourStory.sectionSubtitle}
          </p>
          <OrnamentalDivider color="#D4AF37" className="my-3 scale-90" />
        </div>

        {/* Asymmetrical Story Chapters */}
        <div className="space-y-20 sm:space-y-28">
          {milestones.map((item, idx) => {
            const isReverse = idx % 2 === 1;

            return (
              <motion.div
                key={item.id || idx}
                data-testid={`story-chapter-${idx + 1}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.6 }}
                className={`flex flex-col ${
                  isReverse ? 'lg:flex-row-reverse' : 'lg:flex-row'
                } items-center gap-10 lg:gap-16`}
              >
                {/* Premium Framed Photograph (Asymmetrical) */}
                <div className="w-full lg:w-1/2 flex justify-center">
                  <div className="relative group">
                    {/* Background Decorative Gold Frame */}
                    <div className="absolute -inset-1.5 xs:-inset-2.5 sm:-inset-3.5 rounded-3xl border-2 border-dashed border-royalGold/50 -rotate-2 group-hover:rotate-0 transition-transform duration-500 pointer-events-none" />

                    {/* Image Box */}
                    <div className="relative w-64 xs:w-72 sm:w-80 md:w-96 max-w-[calc(100vw-3rem)] h-72 xs:h-80 sm:h-96 rounded-2xl overflow-hidden border-2 border-royalGold shadow-[0_15px_35px_rgba(0,0,0,0.6)] bg-maroon-950">
                      <img
                        src={item.image || item.imageUrl || WEDDING_CONFIG.storyMilestones[idx]?.image || ''}
                        alt={language === 'hi' ? item.titleHi || item.title : item.title}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                        onError={(e) => {
                          const fallback = WEDDING_CONFIG.storyMilestones[idx]?.image || '/wedding-assets/optimized/ceremony-wedding.webp';
                          if (e.currentTarget.src !== fallback) {
                            e.currentTarget.src = fallback;
                          }
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-deepBurgundy/80 via-transparent to-transparent pointer-events-none" />

                      {/* Date Badge */}
                      <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center px-3 py-1.5 rounded-xl bg-deepBurgundy/90 border border-royalGold/50 backdrop-blur-md">
                        <span className="text-xs uppercase font-bold text-royalGold tracking-wider">
                          {t.ourStory.chapter} 0{idx + 1}
                        </span>
                        <span className="text-xs font-semibold text-champagne">
                          {language === 'hi' ? item.dateStrHi || item.date || item.dateStr : item.dateStr || item.date}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Narrative Text Block */}
                <div className="w-full lg:w-1/2 text-center lg:text-left space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primaryMaroon/80 border border-royalGold/40 text-royalGold text-xs font-semibold">
                    <Sparkles className="w-3.5 h-3.5 text-royalGold" />
                    <span>{t.ourStory.chapter} 0{idx + 1}</span>
                  </div>

                  {/* Handwritten Script Title */}
                  <h3 className="font-script text-4xl sm:text-5xl md:text-6xl text-champagne leading-tight">
                    {language === 'hi' ? item.titleHi : item.title}
                  </h3>

                  <div className="h-[1px] w-20 bg-royalGold/60 mx-auto lg:mx-0 my-2" />

                  {/* Description */}
                  <p className="font-sans text-sm sm:text-base text-ivory/85 leading-relaxed font-light">
                    {language === 'hi' ? item.descriptionHi : item.description}
                  </p>

                  {/* Romantic Quote */}
                  {item.quote && (
                    <div className="p-4 sm:p-5 rounded-2xl bg-primaryMaroon/60 border border-royalGold/30 mt-4 relative">
                      <Quote className="w-5 h-5 text-royalGold/60 mb-1" />
                      <p className="font-cormorant text-base sm:text-lg text-champagne italic">
                        "{language === 'hi' ? item.quoteHi || item.quote : item.quote}"
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Photography Reference Note */}
        <div className="mt-14 text-center">
          <p className="text-[11px] sm:text-xs text-champagne/60 font-cormorant italic">
            {language === 'hi'
              ? 'पारंपरिक भारतीय प्री-वेडिंग एवं वैवाहिक छायाचित्र संदर्भ। वास्तविक युगल छवियाँ एडमिन पोर्टल द्वारा विन्यास योग्य हैं।'
              : 'Traditional Indian pre-wedding & couple photography references. Story photographs are fully configurable through the administration portal.'}
          </p>
        </div>
      </div>
    </section>
  );
};

export default OurStory;

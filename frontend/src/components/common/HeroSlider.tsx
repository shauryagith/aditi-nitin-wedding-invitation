import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles, Calendar, Heart, Share2, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { WEDDING_CONFIG } from '../../config/wedding.config';
import { GaneshaEmblem, OrnamentalDivider, FloatingPetalsOverlay } from './DecorativeOrnaments';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { WEDDING_IMAGES } from '../../config/weddingImages';

interface HeroSliderProps {
  onOpenShareModal: () => void;
}

export const HeroSlider: React.FC<HeroSliderProps> = ({ onOpenShareModal }) => {
  const { language, t } = useLanguage();
  const prevRef = useRef<HTMLButtonElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);

  const scrollTo = (id: string) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const slides = [
    {
      id: 1,
      image: WEDDING_IMAGES.hero.slide1,
      alt: 'Aditi and Nitin Royal Wedding in Traditional Attire',
      subtitle: language === 'hi' ? '॥ श्री गणेशाय नमः ॥' : '॥ Shree Ganeshay Namah ॥',
      title: language === 'hi' ? 'अदिति ❤️ नितिन' : 'Aditi ❤️ Nitin',
      highlight: language === 'hi' ? 'सदा साथ • Together Forever' : 'Together Forever',
      date: language === 'hi' ? '११ दिसम्बर २०२६ • गोरखपुर' : '11 December 2026 • Gorakhpur',
      isHeroTitle: true,
    },
    {
      id: 2,
      image: WEDDING_IMAGES.hero.slide2,
      alt: 'Traditional Hindu Wedding Mandap Decorated with Marigolds and Sacred Agni',
      subtitle: language === 'hi' ? 'श्रीवास्तव एवं जोशी परिवार' : 'The Srivastava & Joshi Families',
      title: language === 'hi' ? 'दो परिवार, एक पावन मिलन' : 'Two Families, One Beautiful Celebration',
      highlight: language === 'hi' ? 'प्रेम, आदर एवं सौहार्द का उत्सव' : 'Join us in celebrating love and togetherness.',
      date: language === 'hi' ? '११ दिसम्बर २०२६' : '11 December 2026',
      isHeroTitle: false,
    },
    {
      id: 3,
      image: WEDDING_IMAGES.hero.slide3,
      alt: 'Romantic Royal Indian Couple Pre-Wedding Celebration',
      subtitle: language === 'hi' ? 'मांगलिक वैदिक संस्कार' : 'Sacred Vedic Rituals',
      title: language === 'hi' ? 'परंपराओं का स्वर्णिम उत्सव' : 'A Celebration of Traditions',
      highlight: language === 'hi' ? 'हल्दी | मेहँदी | तिलक | शुभ विवाह' : 'Haldi | Mehndi | Tilak | Wedding',
      date: language === 'hi' ? '११ दिसम्बर २०२६' : '11 December 2026',
      isHeroTitle: false,
    },
    {
      id: 4,
      image: WEDDING_IMAGES.hero.slide4,
      alt: 'Grand Traditional Indian Wedding Ceremonial Welcome and Floral Decor',
      subtitle: language === 'hi' ? 'सादर आमंत्रण' : 'Cordial Invitation',
      title: language === 'hi' ? 'आपकी उपस्थिति हमारा सौभाग्य' : 'Your Presence Is Our Blessing',
      highlight: language === 'hi' ? 'हम सस्नेह आपको इस पावन उत्सव में आमंत्रित करते हैं।' : 'We cordially invite you to celebrate with us.',
      date: language === 'hi' ? '११ दिसम्बर २०२६' : '11 December 2026',
      isHeroTitle: false,
    },
  ];

  return (
    <section id="hero" className="relative w-full h-screen min-h-[640px] max-h-[1080px] overflow-hidden bg-deepBurgundy">
      {/* Falling Flower Petals Canvas Simulation */}
      <FloatingPetalsOverlay className="z-20" />

      {/* Floating Golden Sparks */}
      <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-royalGold/40 blur-[1px]"
            style={{
              width: `${6 + (i % 3) * 6}px`,
              height: `${6 + (i % 3) * 6}px`,
              left: `${10 + i * 11}%`,
              top: `${15 + (i * 13) % 70}%`,
            }}
            animate={{
              y: [-15, 15, -15],
              x: [-10, 10, -10],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 4 + i * 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Swiper Slider */}
      <Swiper
        modules={[Autoplay, EffectFade, Navigation, Pagination]}
        effect="fade"
        speed={1400}
        fadeEffect={{ crossFade: true }}
        autoplay={{
          delay: 6000,
          disableOnInteraction: false,
        }}
        loop={true}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        onBeforeInit={(swiper) => {
          // @ts-ignore
          swiper.params.navigation.prevEl = prevRef.current;
          // @ts-ignore
          swiper.params.navigation.nextEl = nextRef.current;
        }}
        className="w-full h-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id} className="relative w-full h-full overflow-hidden">
            {/* Background Image with Smooth Ken Burns Zoom */}
            <div className="absolute inset-0 w-full h-full overflow-hidden">
              <img
                src={slide.image}
                alt={slide.alt}
                className="w-full h-full object-cover object-center ken-burns-active"
                loading="eager"
              />
            </div>

            {/* Cinematic Gradient Overlays (Deep Burgundy to Royal Maroon) */}
            <div className="absolute inset-0 bg-gradient-to-t from-deepBurgundy via-primaryMaroon/50 to-deepBurgundy/80 z-10" />
            <div className="absolute inset-0 bg-radial-gradient from-transparent via-deepBurgundy/40 to-deepBurgundy/80 z-10" />
            <div className="absolute inset-0 mandala-bg opacity-10 z-10 pointer-events-none" />

            {/* Slide Foreground Content */}
            <div className="relative z-20 w-full h-full flex flex-col items-center justify-center px-4 sm:px-6 text-center text-ivory max-w-5xl mx-auto pt-16">
              {/* Sacred Ganesha Emblem */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="mb-3"
              >
                <GaneshaEmblem size={64} className="text-royalGold drop-shadow-md" />
                <span className="text-xs sm:text-sm uppercase tracking-widest text-royalGold font-semibold font-hindi block mt-2">
                  {slide.subtitle}
                </span>
              </motion.div>

              {/* Main Heading */}
              {slide.isHeroTitle ? (
                <div className="my-2 sm:my-4">
                  <h1 className="font-heading text-3xl xs:text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-ivory drop-shadow-lg">
                    <span className="font-script text-4xl xs:text-5xl sm:text-7xl md:text-8xl text-champagne block sm:inline">
                      {language === 'hi' ? WEDDING_CONFIG.bride.nameHi : WEDDING_CONFIG.bride.name}
                    </span>
                    <span className="mx-2 sm:mx-6 text-royalGold font-cormorant text-2xl sm:text-5xl inline-block align-middle font-normal animate-pulse">
                      ❤️
                    </span>
                    <span className="font-script text-4xl xs:text-5xl sm:text-7xl md:text-8xl text-champagne block sm:inline">
                      {language === 'hi' ? WEDDING_CONFIG.groom.nameHi : WEDDING_CONFIG.groom.name}
                    </span>
                  </h1>
                </div>
              ) : (
                <div className="my-2 sm:my-4">
                  <h2 className="font-heading text-2xl xs:text-3xl sm:text-5xl md:text-6xl font-bold text-ivory max-w-3xl mx-auto leading-tight drop-shadow-lg">
                    {slide.title}
                  </h2>
                </div>
              )}

              {/* Ornamental Divider */}
              <OrnamentalDivider color="#D4AF37" className="my-2 sm:my-3 scale-80 sm:scale-100" />

              {/* Highlight / Tagline */}
              <p className="font-cormorant text-base xs:text-lg sm:text-2xl md:text-3xl text-royalGold font-medium tracking-wide italic max-w-2xl mx-auto drop-shadow">
                {slide.highlight}
              </p>

              {/* Date & Location Pill */}
              <div className="mt-3 sm:mt-4 inline-flex items-center gap-2 px-3.5 sm:px-6 py-1.5 sm:py-2 rounded-full bg-deepBurgundy/80 border border-royalGold/60 shadow-lg backdrop-blur-md text-[11px] sm:text-sm text-champagne font-semibold tracking-wider">
                <Calendar className="w-3.5 h-3.5 text-royalGold" />
                <span>{slide.date}</span>
              </div>

              {/* Three Required Action Buttons */}
              <div className="mt-6 sm:mt-10 flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 max-w-xl mx-auto">
                {/* 1. Discover Invitation */}
                <button
                  onClick={() => scrollTo('#invitation')}
                  className="px-4 xs:px-5 sm:px-7 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-royalGold via-[#E0BC6C] to-royalGold text-deepBurgundy font-bold text-xs sm:text-sm tracking-wide shadow-xl hover:shadow-royalGold/40 hover:scale-105 active:scale-95 transition-all duration-300 border border-royalGold flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-deepBurgundy" />
                  <span>{t.common.discoverInvitation}</span>
                </button>

                {/* 2. View Wedding Events */}
                <button
                  onClick={() => scrollTo('#events')}
                  className="px-4 xs:px-5 sm:px-7 py-2.5 sm:py-3 rounded-full bg-primaryMaroon/80 hover:bg-primaryMaroon text-champagne font-semibold text-xs sm:text-sm tracking-wide shadow-lg border border-royalGold/60 hover:border-royalGold hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2 backdrop-blur-md"
                >
                  <Calendar className="w-4 h-4 text-royalGold" />
                  <span>{t.common.viewEvents}</span>
                </button>

                {/* 3. Share Invitation */}
                <button
                  onClick={onOpenShareModal}
                  className="px-4 xs:px-5 sm:px-7 py-2.5 sm:py-3 rounded-full bg-deepBurgundy/80 hover:bg-deepBurgundy text-royalGold font-semibold text-xs sm:text-sm tracking-wide shadow-lg border border-royalGold/50 hover:border-royalGold hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2 backdrop-blur-md"
                >
                  <Share2 className="w-4 h-4 text-royalGold" />
                  <span>{t.common.shareInvitation}</span>
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Manual Swiper Navigation Controls (Left & Right Arrows) */}
      <button
        ref={prevRef}
        aria-label="Previous Slide"
        className="hidden md:flex absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 lg:w-12 lg:h-12 rounded-full bg-deepBurgundy/70 border border-royalGold/60 text-royalGold hover:text-white hover:bg-primaryMaroon hover:border-royalGold items-center justify-center shadow-2xl backdrop-blur-md transition-all duration-300 group"
      >
        <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
      </button>

      <button
        ref={nextRef}
        aria-label="Next Slide"
        className="hidden md:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 lg:w-12 lg:h-12 rounded-full bg-deepBurgundy/70 border border-royalGold/60 text-royalGold hover:text-white hover:bg-primaryMaroon hover:border-royalGold items-center justify-center shadow-2xl backdrop-blur-md transition-all duration-300 group"
      >
        <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
      </button>

      {/* Scroll indicator */}
      <div className="absolute bottom-3 inset-x-0 z-30 flex justify-center pointer-events-none">
        <div className="animate-bounce flex flex-col items-center text-royalGold/80 text-[10px] uppercase tracking-widest">
          <span>{t.hero.scrollDown}</span>
          <ArrowRight className="w-3.5 h-3.5 rotate-90 mt-0.5" />
        </div>
      </div>
    </section>
  );
};

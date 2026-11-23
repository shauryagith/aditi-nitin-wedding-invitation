import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { WelcomeStage, WelcomeExperienceProps } from './welcomeTypes';
import { GaneshMotif } from './GaneshMotif';
import { DiyasDecoration } from './DiyasDecoration';
import { GoldenParticles } from './GoldenParticles';
import { FloatingPetals } from './FloatingPetals';
import { WeddingEnvelope } from './WeddingEnvelope';
import { InvitationCard } from './InvitationCard';
import { RoyalDoorTransition } from './RoyalDoorTransition';
import { WelcomeMusic } from './WelcomeMusic';
import { CornerFlourish } from '../common/DecorativeOrnaments';
import { useLanguage } from '../../context/LanguageContext';
import { useAudio } from '../../context/AudioContext';

export const WelcomeExperience: React.FC<WelcomeExperienceProps> = ({
  onComplete,
  onSkip,
}) => {
  const [stage, setStage] = useState<WelcomeStage>('DIVINE_INTRO');
  const [isDoorOpening, setIsDoorOpening] = useState(false);
  const [isCardUnsealed, setIsCardUnsealed] = useState(false);
  const [petalSweep, setPetalSweep] = useState(false);
  const { language } = useLanguage();
  const { startAudioWithUserGesture } = useAudio();

  // Scene 1 to Scene 2 progression timer (3.0 seconds divine welcome)
  useEffect(() => {
    const timer = setTimeout(() => {
      setStage('ENVELOPE_REVEAL');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Handle Unsealing (Scene 2 to Scene 3)
  const handleUnsealInvitation = () => {
    startAudioWithUserGesture();
    setIsCardUnsealed(true);
    setStage('UNSEALED_CARD');
  };

  // Handle Entrance to Main Site (Scene 4 to Scene 5)
  const handleOpenWeddingInvitation = () => {
    startAudioWithUserGesture();
    setPetalSweep(true);
    setIsDoorOpening(true);
    setStage('CINEMATIC_TRANSITION');

    try {
      sessionStorage.setItem('aditi_nitin_welcome_seen', 'true');
    } catch {
      // Ignored
    }
  };

  // Skip Intro Handler
  const handleSkipIntro = () => {
    try {
      sessionStorage.setItem('aditi_nitin_welcome_seen', 'true');
    } catch {
      // Ignored
    }
    if (onSkip) onSkip();
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-between w-full h-[100dvh] min-h-screen bg-[#2A040E] text-ivory overflow-y-auto overflow-x-hidden select-none">
      {/* Background Radial Glow & Rich Velvet Gradient */}
      <div className="fixed inset-0 bg-radial-gradient from-[#4A0A1C]/70 via-[#2A040E] to-[#1A0208] pointer-events-none" />

      {/* Rotating Sacred Mandala (Subtle Background Layer) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: [0.12, 0.22, 0.12],
          rotate: 360,
          scale: 1,
        }}
        transition={{
          opacity: { duration: 4.5, repeat: Infinity, ease: 'easeInOut' },
          rotate: { duration: 60, repeat: Infinity, ease: 'linear' },
          scale: { duration: 2 },
        }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] xs:w-[460px] xs:h-[460px] sm:w-[700px] sm:h-[700px] md:w-[860px] md:h-[860px] rounded-full border border-royalGold/20 pointer-events-none mandala-bg opacity-20"
      />

      {/* Ambient Floating Golden Particles & Rose/Marigold Petals */}
      <GoldenParticles burst={isCardUnsealed} count={35} />
      <FloatingPetals count={24} sweep={petalSweep} />

      {/* Decorative Gold Corner Borders */}
      <div className="fixed inset-0 pointer-events-none z-10">
        <CornerFlourish position="top-left" />
        <CornerFlourish position="top-right" />
        <CornerFlourish position="bottom-left" />
        <CornerFlourish position="bottom-right" />
      </div>

      {/* Top Header Bar: Music Controls (Left) & Skip Intro (Right) */}
      <header className="relative z-30 shrink-0 w-full max-w-7xl mx-auto px-3 xs:px-4 sm:px-8 py-2.5 xs:py-3 sm:py-4 flex items-center justify-between">
        {/* Music Controller */}
        <WelcomeMusic />

        {/* Skip Intro Button */}
        <button
          onClick={handleSkipIntro}
          className="group px-3 xs:px-3.5 py-1.5 rounded-full bg-deepBurgundy/80 hover:bg-primaryMaroon border border-royalGold/40 hover:border-royalGold text-champagne text-[11px] xs:text-xs font-medium transition-all shadow-md backdrop-blur-md flex items-center gap-1.5 cursor-pointer"
          aria-label="Skip wedding welcome introduction"
        >
          <span>{language === 'hi' ? 'सीधे वेबसाइट देखें' : 'Skip Intro'}</span>
          <ArrowRight className="w-3.5 h-3.5 text-royalGold group-hover:translate-x-0.5 transition-transform" />
        </button>
      </header>

      {/* Center Stage: Sequential Content Animation */}
      <main className="relative z-20 flex-1 flex flex-col items-center justify-center w-full px-3 xs:px-4 sm:px-6 my-auto py-2 xs:py-3 sm:py-4">
        <AnimatePresence mode="wait">
          {/* ============================================================== */}
          {/* SCENE 1: Divine Welcome Intro                                  */}
          {/* ============================================================== */}
          {stage === 'DIVINE_INTRO' && (
            <motion.div
              key="scene-divine"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05, filter: 'blur(6px)' }}
              transition={{ duration: 0.7 }}
              className="text-center flex flex-col items-center space-y-2.5 xs:space-y-3.5 sm:space-y-4 max-w-lg mx-auto py-4"
            >
              {/* Sacred Ganesha Motif - Prominently Displayed */}
              <GaneshMotif size={100} animateAura={true} showText={true} />

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="space-y-1.5 xs:space-y-2 pt-1"
              >
                <p className="font-cormorant text-sm xs:text-base sm:text-xl text-champagne/90 italic tracking-wider">
                  {language === 'hi'
                    ? 'समस्त पूज्य परिजनों एवं पूर्वजों के शुभाशीर्वाद से'
                    : 'With the blessings of our families'}
                </p>

                <h1 className="font-script text-4xl xs:text-5xl sm:text-6xl md:text-7xl text-royalGold drop-shadow-md py-1">
                  {language === 'hi' ? 'अदिति एवं नितिन' : 'Aditi & Nitin'}
                </h1>

                <p className="font-heading text-[10px] xs:text-xs sm:text-sm uppercase tracking-widest text-champagne/80 font-bold">
                  {language === 'hi' ? 'स्नेह एवं परिणय का पावन उत्सव' : 'A Celebration of Love'}
                </p>

                <div className="pt-1">
                  <span className="inline-block px-3 py-1 rounded-full bg-royalGold/15 border border-royalGold/35 text-[10px] xs:text-xs text-champagne font-semibold tracking-wider uppercase">
                    11 December 2026 • Gorakhpur
                  </span>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* ============================================================== */}
          {/* SCENE 2, 3 & 4: Royal Sealed Envelope & Interactive Card      */}
          {/* ============================================================== */}
          {(stage === 'ENVELOPE_REVEAL' || stage === 'UNSEALED_CARD' || stage === 'CINEMATIC_TRANSITION') && (
            <motion.div
              key="scene-envelope"
              initial={{ opacity: 0, scale: 0.88, y: 35 }}
              animate={
                stage === 'CINEMATIC_TRANSITION'
                  ? { scale: 1.15, opacity: 0, filter: 'blur(8px)' }
                  : { opacity: 1, scale: 1, y: 0 }
              }
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="w-full flex justify-center py-2"
            >
              <WeddingEnvelope
                isOpen={isCardUnsealed}
                onOpen={handleUnsealInvitation}
              >
                <InvitationCard
                  isOpen={isCardUnsealed}
                  onEnterMainSite={handleOpenWeddingInvitation}
                />
              </WeddingEnvelope>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Deck: Traditional Illuminated Diyas */}
      <footer className="relative z-20 shrink-0 w-full flex justify-center pb-3 xs:pb-4 sm:pb-6 pt-1">
        <DiyasDecoration active={true} />
      </footer>

      {/* SCENE 5: Royal Palace Doors 3D Transition */}
      <RoyalDoorTransition
        isOpening={isDoorOpening}
        onAnimationComplete={onComplete}
      />
    </div>
  );
};

export default WelcomeExperience;

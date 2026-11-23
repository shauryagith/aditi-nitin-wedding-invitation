import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Calendar, Sparkles, Lock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { WEDDING_CONFIG } from '../config/wedding.config';
import { GaneshaEmblem, DiyaMotif, OrnamentalDivider } from '../components/common/DecorativeOrnaments';
import { ReplayInvitationButton } from '../components/welcome/ReplayInvitationButton';

interface FooterProps {
  onReplayWelcome?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onReplayWelcome }) => {
  const { language } = useLanguage();

  const scrollTo = (id: string) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-deepBurgundy text-ivory pt-16 pb-12 px-4 sm:px-6 border-t-2 border-royalGold/50 overflow-hidden">
      {/* Background mandala decoration */}
      <div className="absolute inset-0 mandala-bg opacity-15 pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto flex flex-col items-center text-center">
        {/* Sacred Ganesha & Diya Blessing */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <DiyaMotif size={32} className="hidden sm:inline-flex opacity-85" />
          <GaneshaEmblem size={60} className="text-royalGold drop-shadow" />
          <DiyaMotif size={32} className="hidden sm:inline-flex opacity-85" />
        </div>

        <span className="text-xs uppercase tracking-widest text-royalGold font-semibold font-hindi">
          ॥ ॐ श्री गणेशाय नमः ॥
        </span>

        {/* Monogram and Couple Names */}
        <div className="my-4">
          <div className="w-14 h-14 rounded-full border-2 border-royalGold bg-primaryMaroon flex items-center justify-center mx-auto mb-3 shadow-inner">
            <span className="font-heading font-bold text-royalGold text-lg tracking-wider">A&amp;N</span>
          </div>

          <h2 className="font-script text-4xl sm:text-5xl md:text-6xl text-champagne">
            {language === 'hi' ? 'अदिति ❤️ नितिन' : 'Aditi & Nitin'}
          </h2>

          <p className="text-xs uppercase tracking-widest text-royalGold font-bold mt-1">
            Friday, 11 December 2026 • Gorakhpur, Uttar Pradesh
          </p>
        </div>

        <OrnamentalDivider color="#D4AF37" className="my-2 scale-90" />

        {/* Navigation Quick Links */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 my-6 text-xs sm:text-sm font-semibold text-champagne/90">
          <button onClick={() => scrollTo('#hero')} className="hover:text-royalGold transition-colors">
            {language === 'hi' ? 'मुख्य पृष्ठ' : 'Home'}
          </button>
          <button onClick={() => scrollTo('#invitation')} className="hover:text-royalGold transition-colors">
            {language === 'hi' ? 'निमंत्रण' : 'Invitation'}
          </button>
          <button onClick={() => scrollTo('#our-story')} className="hover:text-royalGold transition-colors">
            {language === 'hi' ? 'हमारी कहानी' : 'Our Story'}
          </button>
          <button onClick={() => scrollTo('#events')} className="hover:text-royalGold transition-colors">
            {language === 'hi' ? 'शुभ उत्सव' : 'Wedding Events'}
          </button>
          <button onClick={() => scrollTo('#gallery')} className="hover:text-royalGold transition-colors">
            {language === 'hi' ? 'गैलरी' : 'Gallery'}
          </button>
          <button onClick={() => scrollTo('#venue')} className="hover:text-royalGold transition-colors">
            {language === 'hi' ? 'विवाह स्थल' : 'Venue'}
          </button>
          <button onClick={() => scrollTo('#rsvp')} className="hover:text-royalGold transition-colors">
            {language === 'hi' ? 'उपस्थिति (RSVP)' : 'RSVP'}
          </button>
        </div>

        {/* Replay Invitation Button */}
        {onReplayWelcome && (
          <div className="my-3">
            <ReplayInvitationButton onReplay={onReplayWelcome} />
          </div>
        )}

        {/* Traditional Closing Verse */}
        <div className="max-w-xl mx-auto my-4 text-xs sm:text-sm font-cormorant italic text-champagne/80 leading-relaxed px-4">
          <p>
            {language === 'hi'
              ? 'श्रीवास्तव एवं जोशी परिवार की ओर से आप सभी का सहृदय आभार। आपकी उपस्थिति ही हमारा सबसे बड़ा आशीष है।'
              : 'With heartfelt gratitude from the Srivastava and Joshi families. We look forward to celebrating with you in Gorakhpur.'}
          </p>
        </div>

        {/* Copyright, Warm Note & Admin Login in Right Corner */}
        <div className="mt-8 pt-6 border-t border-royalGold/30 text-[11px] text-ivory/60 flex flex-col md:flex-row items-center justify-between w-full gap-3">
          <p className="order-2 md:order-1 text-center md:text-left">
            © 2026 Aditi &amp; Nitin Wedding Celebrations. All rights reserved.
          </p>

          <p className="order-1 md:order-2 flex items-center justify-center gap-1.5 text-royalGold text-center">
            <span>Crafted with devotion &amp; royal grace</span>
            <Heart className="w-3.5 h-3.5 fill-current text-primaryMaroon" />
          </p>

          <div className="order-3 flex items-center justify-center md:justify-end">
            <Link
              to="/admin/login"
              className="group inline-flex items-center gap-1.5 text-royalGold/80 hover:text-champagne font-medium transition-all px-2.5 py-1 rounded-md border border-royalGold/30 hover:border-royalGold bg-primaryMaroon/50 hover:bg-primaryMaroon shadow-sm hover:shadow"
              title={language === 'hi' ? 'व्यवस्थापक पोर्टल लॉगिन' : 'Admin Portal Login'}
            >
              <Lock className="w-3 h-3 text-royalGold group-hover:scale-110 transition-transform" />
              <span>{language === 'hi' ? 'एडमिन लॉगिन' : 'Admin Login'}</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

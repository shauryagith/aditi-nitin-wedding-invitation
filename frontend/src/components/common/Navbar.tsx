import React, { useState, useEffect } from 'react';
import { Menu, X, Music, VolumeX, Share2, Globe, Heart, MessageCircle, RotateCcw } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAudio } from '../../context/AudioContext';
import { buildWhatsAppChatUrl } from '../../utils/whatsapp';
import { WEDDING_CONFIG } from '../../config/wedding.config';

interface NavbarProps {
  onOpenShareModal: () => void;
  onReplayWelcome?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenShareModal, onReplayWelcome }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, toggleLanguage, t } = useLanguage();
  const { isPlaying, togglePlay } = useAudio();

  const navLinks = [
    { href: '#hero', id: 'hero', labelEn: 'Home', labelHi: 'होम' },
    { href: '#invitation', id: 'invitation', labelEn: 'Invitation', labelHi: 'निमंत्रण' },
    { href: '#our-story', id: 'our-story', labelEn: 'Our Story', labelHi: 'हमारी कहानी' },
    { href: '#events', id: 'events', labelEn: 'Events', labelHi: 'कार्यक्रम' },
    { href: '#gallery', id: 'gallery', labelEn: 'Gallery', labelHi: 'गैलरी' },
    { href: '#venue', id: 'venue', labelEn: 'Venue', labelHi: 'स्थान' },
    { href: '#rsvp', id: 'rsvp', labelEn: 'RSVP', labelHi: 'उपस्थिति' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);

      // Active Section Highlighting
      const sections = ['hero', 'invitation', 'our-story', 'events', 'gallery', 'venue', 'rsvp'];
      const scrollPosition = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const whatsappDirectChatUrl = buildWhatsAppChatUrl(
    WEDDING_CONFIG.contact.whatsappNumber,
    language === 'hi' ? 'नमस्ते! मैं विवाह समारोह के बारे में जानकारी चाहता/चाहती हूँ।' : 'Namaste! Inquiring regarding the wedding celebrations.'
  );

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-deepBurgundy/95 backdrop-blur-md shadow-2xl border-b border-royalGold/40 py-2.5 sm:py-3'
            : 'bg-gradient-to-b from-deepBurgundy/90 via-deepBurgundy/50 to-transparent py-4 sm:py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo / Monogram: Aditi & Nitin */}
          <a
            href="#hero"
            onClick={(e) => handleLinkClick(e, '#hero')}
            className="flex items-center gap-2.5 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full border-2 border-royalGold flex items-center justify-center bg-primaryMaroon shadow-inner group-hover:scale-105 transition-transform">
              <span className="font-heading font-bold text-royalGold text-xs tracking-wider">A&amp;N</span>
            </div>
            <div>
              <span className="font-script text-2xl sm:text-3xl text-champagne tracking-wide block leading-none">
                {language === 'hi' ? 'अदिति ❤️ नितिन' : 'Aditi & Nitin'}
              </span>
              <span className="text-[9px] text-royalGold tracking-widest uppercase block mt-0.5 font-semibold">
                11 December 2026
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-7">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;

              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className={`text-xs xl:text-sm font-semibold tracking-wider transition-colors duration-200 relative group py-1 ${
                    isActive ? 'text-royalGold' : 'text-ivory/85 hover:text-royalGold'
                  }`}
                >
                  {language === 'hi' ? link.labelHi : link.labelEn}
                  <span
                    className={`absolute bottom-0 left-0 h-0.5 bg-royalGold transition-all duration-300 ${
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </a>
              );
            })}

            {/* WhatsApp Link */}
            <a
              href={whatsappDirectChatUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp Chat"
              className="text-xs xl:text-sm font-semibold text-green-400 hover:text-green-300 flex items-center gap-1.5 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
              <span>WhatsApp</span>
            </a>
          </div>

          {/* Action Buttons (Language, Music, Share, Mobile Menu) */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              aria-label="Toggle Language"
              className="px-2.5 py-1.5 rounded-full border border-royalGold/50 bg-primaryMaroon/80 text-champagne hover:text-white hover:bg-primaryMaroon text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Globe className="w-3.5 h-3.5 text-royalGold" />
              <span>{language === 'en' ? 'हिन्दी' : 'English'}</span>
            </button>

            {/* Music Quick Toggle */}
            <button
              onClick={togglePlay}
              aria-label={isPlaying ? t.common.musicOff : t.common.musicOn}
              title={isPlaying ? t.common.musicOff : t.common.musicOn}
              className={`p-2 rounded-full border transition-all ${
                isPlaying
                  ? 'border-royalGold bg-royalGold/20 text-royalGold shadow-md shadow-royalGold/20 animate-pulse-slow'
                  : 'border-royalGold/40 bg-primaryMaroon/60 text-ivory/70 hover:text-royalGold'
              }`}
            >
              {isPlaying ? (
                <div className="flex items-center gap-0.5 h-3.5 px-0.5">
                  <span className="w-0.5 bg-royalGold h-2.5 animate-pulse" />
                  <span className="w-0.5 bg-royalGold h-3.5 animate-pulse delay-75" />
                  <span className="w-0.5 bg-royalGold h-2 animate-pulse delay-150" />
                </div>
              ) : (
                <VolumeX className="w-3.5 h-3.5" />
              )}
            </button>

            {/* Replay Welcome Intro */}
            {onReplayWelcome && (
              <button
                onClick={onReplayWelcome}
                title={language === 'hi' ? 'निमंत्रण पुनः देखें' : 'Replay Welcome Intro'}
                aria-label="Replay Welcome Experience"
                className="hidden xs:flex p-2 rounded-full border border-royalGold/50 bg-primaryMaroon/80 text-royalGold hover:bg-primaryMaroon hover:text-white transition-all shadow-sm items-center justify-center"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Share Invitation Button */}
            <button
              onClick={onOpenShareModal}
              aria-label="Share Wedding Invitation"
              className="hidden sm:flex p-2 rounded-full border border-royalGold/50 bg-primaryMaroon/80 text-royalGold hover:bg-primaryMaroon hover:text-white transition-all shadow-sm items-center justify-center"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
              className="lg:hidden p-2 rounded-lg text-ivory hover:text-royalGold focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 lg:hidden bg-deepBurgundy/98 backdrop-blur-2xl flex flex-col pt-24 pb-10 px-6 overflow-y-auto animate-fade-in border-b-2 border-royalGold">
          <div className="flex flex-col items-center space-y-4 text-center">
            <span className="text-xs uppercase tracking-widest text-royalGold font-bold font-hindi">
              ॥ श्री गणेशाय नमः ॥
            </span>

            <span className="font-script text-4xl text-champagne mb-2">
              Aditi &amp; Nitin
            </span>

            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className={`text-base font-heading font-medium transition-colors py-2 w-full border-b border-primaryMaroon/80 ${
                  activeSection === link.id ? 'text-royalGold font-bold' : 'text-ivory hover:text-royalGold'
                }`}
              >
                {language === 'hi' ? link.labelHi : link.labelEn}
              </a>
            ))}

            <a
              href={whatsappDirectChatUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-xl bg-[#25D366] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg mt-2"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>WhatsApp Connect</span>
            </a>

            <div className="pt-2 w-full flex flex-col gap-2.5">
              {onReplayWelcome && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onReplayWelcome();
                  }}
                  className="w-full py-2.5 px-4 rounded-xl border border-royalGold/60 bg-primaryMaroon/80 text-champagne font-semibold text-xs flex items-center justify-center gap-2 shadow"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-royalGold" />
                  <span>{language === 'hi' ? 'निमंत्रण पुनः देखें' : 'Replay Welcome Intro'}</span>
                </button>
              )}

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenShareModal();
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-royalGold via-[#E0BC6C] to-royalGold text-deepBurgundy font-bold text-sm flex items-center justify-center gap-2 shadow-lg"
              >
                <Share2 className="w-4 h-4 text-deepBurgundy" />
                <span>{t.common.shareInvitation}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;

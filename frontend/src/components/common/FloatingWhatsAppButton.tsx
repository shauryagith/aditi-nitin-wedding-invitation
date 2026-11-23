import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Share2, MapPin, Send, X, PhoneCall } from 'lucide-react';
import { buildWhatsAppChatUrl, getShareWhatsAppUrl, getVenueWhatsAppUrl, getRsvpWhatsAppUrl } from '../../utils/whatsapp';
import { WEDDING_CONFIG } from '../../config/wedding.config';
import { useLanguage } from '../../context/LanguageContext';

export const FloatingWhatsAppButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const { language } = useLanguage();
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const greeting =
    language === 'hi'
      ? 'नमस्ते! मैं अदिति और नितिन के विवाह उत्सव के संबंध में जानकारी चाहता/चाहती हूँ।'
      : "Namaste! I would like to inquire about Aditi and Nitin's wedding celebrations.";

  const chatUrl = buildWhatsAppChatUrl(WEDDING_CONFIG.contact.whatsappNumber, greeting);
  const shareInviteUrl = getShareWhatsAppUrl();
  const venueUrl = getVenueWhatsAppUrl();
  const rsvpUrl = getRsvpWhatsAppUrl({
    name: 'Honored Guest',
    attendanceStatus: 'CONFIRMED',
    guestCount: 1,
    selectedEvents: ['Haldi', 'Mehndi', 'Tilak', 'Wedding Ceremony'],
  });

  return (
    <div ref={menuRef} className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end">
      {/* Expanded Speed-Dial Action Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-3 w-64 xs:w-72 rounded-2xl bg-deepBurgundy/95 border-2 border-royalGold p-3.5 xs:p-4 shadow-2xl backdrop-blur-xl text-ivory space-y-2.5 gold-border-card"
          >
            <div className="flex items-center justify-between pb-2 border-b border-royalGold/30">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#25D366] flex items-center justify-center text-white">
                  <MessageCircle className="w-3.5 h-3.5 fill-current" />
                </div>
                <span className="text-xs font-bold text-champagne uppercase tracking-wider">
                  WhatsApp Assistant
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full text-royalGold hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 1. Direct Chat */}
            <a
              href={chatUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 p-2.5 rounded-xl bg-primaryMaroon/80 hover:bg-primaryMaroon border border-royalGold/30 hover:border-royalGold text-xs font-medium text-champagne transition-all"
            >
              <PhoneCall className="w-4 h-4 text-[#25D366] flex-shrink-0" />
              <span>{language === 'hi' ? 'परिवार से व्हाट्सएप पर बात करें' : 'Chat with Family'}</span>
            </a>

            {/* 2. Share Invitation */}
            <a
              href={shareInviteUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 p-2.5 rounded-xl bg-primaryMaroon/80 hover:bg-primaryMaroon border border-royalGold/30 hover:border-royalGold text-xs font-medium text-champagne transition-all"
            >
              <Share2 className="w-4 h-4 text-royalGold flex-shrink-0" />
              <span>{language === 'hi' ? 'निमंत्रण पत्रिका शेयर करें' : 'Share Invitation Card'}</span>
            </a>

            {/* 3. Send RSVP */}
            <a
              href={rsvpUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 p-2.5 rounded-xl bg-primaryMaroon/80 hover:bg-primaryMaroon border border-royalGold/30 hover:border-royalGold text-xs font-medium text-champagne transition-all"
            >
              <Send className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>{language === 'hi' ? 'व्हाट्सएप से RSVP भेजें' : 'Send RSVP Message'}</span>
            </a>

            {/* 4. Share Venue Location */}
            <a
              href={venueUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 p-2.5 rounded-xl bg-primaryMaroon/80 hover:bg-primaryMaroon border border-royalGold/30 hover:border-royalGold text-xs font-medium text-champagne transition-all"
            >
              <MapPin className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{language === 'hi' ? 'विवाह स्थल लोकेशन शेयर करें' : 'Share Wedding Venue'}</span>
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Main Button */}
      <div className="flex items-center">
        {/* Tooltip on hover */}
        <div
          className={`hidden sm:block mr-3 px-3 py-1.5 rounded-lg bg-deepBurgundy/90 text-champagne text-xs font-medium border border-royalGold/50 shadow-xl backdrop-blur-md transition-all duration-300 pointer-events-none whitespace-nowrap ${
            showTooltip && !isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
          }`}
        >
          {language === 'hi' ? 'व्हाट्सएप सहायता' : 'WhatsApp Connect'}
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Open WhatsApp Menu"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className="w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 border-2 border-royalGold relative focus:outline-none"
        >
          <MessageCircle className="w-7 h-7 fill-current" />
          {/* Pulsing halo */}
          <span className="absolute -inset-1 rounded-full bg-green-500 opacity-40 animate-ping pointer-events-none" />
        </button>
      </div>
    </div>
  );
};

export const WhatsAppButton = FloatingWhatsAppButton;
export default FloatingWhatsAppButton;

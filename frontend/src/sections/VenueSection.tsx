import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Copy, Check, MessageCircle, Info, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { WEDDING_CONFIG } from '../config/wedding.config';
import { weddingService } from '../services/api';
import { weddingSyncManager } from '../utils/dataSync';
import { useRealtimeCMS } from '../hooks/useRealtimeCMS';
import { getVenueWhatsAppUrl } from '../utils/whatsapp';
import { OrnamentalDivider } from '../components/common/DecorativeOrnaments';

export const VenueSection: React.FC = () => {
  const { t, language } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [venue, setVenue] = useState(WEDDING_CONFIG.venue);
  const whatsappVenueUrl = getVenueWhatsAppUrl();

  const loadVenue = useCallback(() => {
    weddingService.getWeddingDetails().then((data) => {
      if (data && data.venue) {
        setVenue(data.venue);
      }
    });
  }, []);

  useEffect(() => {
    loadVenue();
    return weddingSyncManager.subscribe(loadVenue);
  }, [loadVenue]);

  // Real-Time Socket.IO Synchronization
  useRealtimeCMS(['venue', 'wedding'], () => {
    loadVenue();
  });

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(venue.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Fallback
    }
  };

  return (
    <section id="venue" className="py-20 sm:py-28 px-4 sm:px-6 bg-deepBurgundy text-ivory relative overflow-hidden">
      {/* Background mandala decoration */}
      <div className="absolute inset-0 mandala-bg opacity-15 pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 sm:mb-20">
          <span className="text-xs uppercase tracking-widest text-royalGold font-semibold font-hindi">
            ॥ पावन विवाह स्थल ॥
          </span>
          <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-ivory mt-2">
            {t.venue.sectionTitle}
          </h2>
          <p className="font-cormorant text-base sm:text-xl text-champagne/90 italic mt-2 max-w-xl mx-auto">
            {t.venue.sectionSubtitle}
          </p>
          <OrnamentalDivider color="#D4AF37" className="my-3 scale-90" />
        </div>

        {/* 2-Column Venue Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-stretch">
          {/* Left Column: Venue Details Card & Venue Photograph */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl bg-primaryMaroon/85 border-2 border-royalGold/60 p-5 xs:p-6 sm:p-8 backdrop-blur-md shadow-2xl flex flex-col justify-between"
          >
            <div className="space-y-6">
              {/* Venue Photograph */}
              <div className="relative h-48 sm:h-56 rounded-2xl overflow-hidden border border-royalGold shadow-lg">
                <img
                  src={venue.photoUrl}
                  alt={venue.name}
                  className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/wedding-assets/optimized/venue-location.webp';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-deepBurgundy/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 text-champagne">
                  <div className="p-2 rounded-xl bg-royalGold text-deepBurgundy">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-royalGold block">
                      Gorakhpur, Uttar Pradesh
                    </span>
                    <h3 className="font-heading text-xl sm:text-2xl font-bold text-ivory">
                      {language === 'hi' ? venue.nameHi : venue.name}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Full Address Block */}
              <div className="p-4 sm:p-5 rounded-2xl bg-deepBurgundy/90 border border-royalGold/40 space-y-2">
                <span className="text-[11px] uppercase tracking-wider text-royalGold font-bold block">
                  {t.venue.addressLabel}
                </span>
                <p className="text-sm sm:text-base text-ivory/95 leading-relaxed font-sans font-medium">
                  {language === 'hi' ? venue.addressHi : venue.address}
                </p>
                {venue.landmark && (
                  <p className="text-xs text-champagne/80 mt-1">
                    <span className="text-royalGold font-semibold">Landmark:</span> {venue.landmark}
                  </p>
                )}
              </div>

              {/* Travel / Logistics Tip */}
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-royalGold/15 border border-royalGold/30">
                <Info className="w-5 h-5 text-royalGold flex-shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-champagne/95 leading-relaxed font-sans">
                  {language === 'hi' ? venue.directionsTipsHi : venue.directionsTips}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 mt-6 border-t border-royalGold/30 flex flex-col sm:flex-row gap-3">
              <a
                href={venue.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-royalGold via-[#E0BC6C] to-royalGold text-deepBurgundy font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Navigation className="w-4 h-4 text-deepBurgundy" />
                <span>{t.venue.openInMaps}</span>
              </a>

              <a
                href={whatsappVenueUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-4 rounded-xl bg-[#25D366] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-[#20ba5a] shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>{t.venue.shareVenueWhatsapp}</span>
              </a>

              <button
                onClick={handleCopyAddress}
                aria-label="Copy Address"
                className="py-3 px-4 rounded-xl bg-deepBurgundy border border-royalGold/50 text-royalGold hover:text-white hover:bg-primaryMaroon font-medium text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all"
              >
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? t.common.copied : t.venue.copyAddress}</span>
              </button>
            </div>
          </motion.div>

          {/* Right Column: Google Maps Iframe with Royal Frame */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl overflow-hidden border-2 border-royalGold shadow-2xl h-80 sm:h-96 lg:h-auto min-h-[360px] relative bg-maroon-950"
          >
            <iframe
              title="Wedding Venue Map - Gorakhpur"
              src={venue.embedMapUrl}
              className="w-full h-full border-0 filter contrast-105"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default VenueSection;

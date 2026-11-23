import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Navigation, Sparkles } from 'lucide-react';
import { WeddingEventItem } from '../../types/wedding';
import { useLanguage } from '../../context/LanguageContext';

interface EventCardProps {
  event: WeddingEventItem;
  index: number;
}

export const EventCard: React.FC<EventCardProps> = ({ event, index }) => {
  const { language, t } = useLanguage();
  const [imageError, setImageError] = React.useState(false);

  const rawImage = event.image;
  const imageUrl =
    typeof rawImage === 'object' && rawImage !== null
      ? (rawImage as any).secureUrl || (rawImage as any).url || ''
      : typeof rawImage === 'string'
      ? rawImage
      : '';

  const fallbackUrl = `/assets/wedding/${event.slug === 'wedding-ceremony' ? 'wedding' : event.slug || 'wedding'}/${event.slug === 'wedding-ceremony' ? 'wedding' : event.slug || 'wedding'}-ceremony.webp`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay: index * 0.12 }}
      className="group rounded-3xl bg-[#FFFDF9] border-2 overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
      style={{ borderColor: `${event.accentColor}80` }}
    >
      {/* Event Image Banner with Accent Overlay */}
      <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-deepBurgundy">
        <img
          src={imageUrl || fallbackUrl}
          alt={event.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-95"
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (target.src !== fallbackUrl && !imageError) {
              target.src = fallbackUrl;
            } else {
              setImageError(true);
              target.src = '/wedding-assets/optimized/ceremony-wedding.webp';
            }
          }}
        />
        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-deepBurgundy via-deepBurgundy/40 to-transparent" />

        {/* Order Badge */}
        <div className="absolute top-4 left-4 z-10">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-md ${event.badgeColor}`}
          >
            Ceremony 0{event.order}
          </span>
        </div>

        {/* Title Badge over Image */}
        <div className="absolute bottom-3 left-4 right-4 z-10">
          <h3 className="font-heading text-2xl sm:text-3xl font-bold text-ivory leading-tight drop-shadow-md">
            {language === 'hi' ? event.titleHi : event.title}
          </h3>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-5">
        {/* Date, Time (conditional), and Venue */}
        <div className="space-y-3">
          {/* Date */}
          <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-primaryMaroon">
            <Calendar className="w-4 h-4 text-royalGold flex-shrink-0" />
            <span>{language === 'hi' ? event.formattedDateHi : event.formattedDate}</span>
          </div>

          {/* Time: Displayed ONLY when configured! */}
          {event.startTime ? (
            <div className="flex items-center gap-2.5 text-xs sm:text-sm text-darkBrown/90 font-medium">
              <Clock className="w-4 h-4 text-royalGold flex-shrink-0" />
              <span>
                {event.startTime}
                {event.endTime ? ` – ${event.endTime}` : ''}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2.5 text-xs text-darkBrown/60 italic">
              <Clock className="w-3.5 h-3.5 text-royalGold/60 flex-shrink-0" />
              <span>{t.events.timingsTBA}</span>
            </div>
          )}

          {/* Venue */}
          <div className="flex items-start gap-2.5 text-xs sm:text-sm text-darkBrown/90">
            <MapPin className="w-4 h-4 text-royalGold flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-primaryMaroon">
                {language === 'hi' ? event.venueHi : event.venue}
              </p>
              <p className="text-[11px] text-darkBrown/70 mt-0.5">
                {language === 'hi' ? event.addressHi : event.address}
              </p>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm text-darkBrown/80 font-cormorant italic leading-relaxed pt-2 border-t border-royalGold/20">
          {language === 'hi' ? event.descriptionHi : event.description}
        </p>

        {/* Get Directions Button */}
        <div className="pt-2">
          <a
            href={event.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-4 rounded-xl bg-champagne/60 hover:bg-champagne text-primaryMaroon font-semibold text-xs flex items-center justify-center gap-2 border border-royalGold/40 hover:border-royalGold transition-all shadow-sm group/btn"
          >
            <Navigation className="w-3.5 h-3.5 text-royalGold group-hover/btn:translate-x-0.5 transition-transform" />
            <span>{t.events.directionsLabel}</span>
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;

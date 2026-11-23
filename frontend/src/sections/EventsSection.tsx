import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, LayoutGrid, SlidersHorizontal, GitCommit, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { WeddingEventItem } from '../types/wedding';
import { weddingService } from '../services/api';
import { weddingSyncManager } from '../utils/dataSync';
import { useRealtimeCMS } from '../hooks/useRealtimeCMS';
import { INITIAL_WEDDING_EVENTS } from '../config/wedding.config';
import { OrnamentalDivider } from '../components/common/DecorativeOrnaments';
import { EventCard } from '../components/common/EventCard';
import { EventSlider } from '../components/common/EventSlider';

export const EventsSection: React.FC = () => {
  const { t, language } = useLanguage();
  const [events, setEvents] = useState<WeddingEventItem[]>(INITIAL_WEDDING_EVENTS);
  const [viewMode, setViewMode] = useState<'grid' | 'slider' | 'timeline'>('grid');

  const loadEvents = useCallback(() => {
    weddingService.getEvents().then((data) => {
      if (data && data.length > 0) {
        setEvents(data);
      }
    });
  }, []);

  useEffect(() => {
    loadEvents();
    // Instantly refresh whenever changes are made in the Admin Dashboard
    return weddingSyncManager.subscribe(loadEvents);
  }, [loadEvents]);

  // Real-Time Socket.IO Synchronization
  useRealtimeCMS('event', (payload) => {
    if (payload.action === 'reorder' && Array.isArray(payload.data)) {
      setEvents(payload.data);
    } else {
      loadEvents();
    }
  });

  return (
    <section id="events" className="py-20 sm:py-28 px-4 sm:px-6 bg-ivory relative overflow-hidden">
      {/* Background Subtle Watermark */}
      <div className="absolute inset-0 ivory-pattern-bg opacity-35 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <span className="text-xs uppercase tracking-widest text-royalGold font-bold font-hindi">
            ॥ शुभ उत्सव एवं रस्में ॥
          </span>
          <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-primaryMaroon mt-2">
            {t.events.sectionTitle}
          </h2>
          <p className="font-cormorant text-base sm:text-xl text-darkBrown/80 italic mt-2 max-w-2xl mx-auto">
            {t.events.sectionSubtitle}
          </p>
          <OrnamentalDivider color="#D4AF37" className="my-3 scale-90 sm:scale-100" />

          {/* View Mode Toggle Buttons */}
          <div className="mt-6 inline-flex items-center p-1 rounded-full bg-champagne/50 border border-royalGold/40 shadow-sm">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === 'grid'
                  ? 'bg-primaryMaroon text-champagne shadow-md'
                  : 'text-primaryMaroon hover:text-darkBrown'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>{t.events.viewCards}</span>
            </button>

            <button
              onClick={() => setViewMode('slider')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === 'slider'
                  ? 'bg-primaryMaroon text-champagne shadow-md'
                  : 'text-primaryMaroon hover:text-darkBrown'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{t.events.viewSlider}</span>
            </button>

            <button
              onClick={() => setViewMode('timeline')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === 'timeline'
                  ? 'bg-primaryMaroon text-champagne shadow-md'
                  : 'text-primaryMaroon hover:text-darkBrown'
              }`}
            >
              <GitCommit className="w-3.5 h-3.5" />
              <span>{t.events.viewTimeline}</span>
            </button>
          </div>
        </div>

        {/* View Mode Content */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {events.map((evt, idx) => (
              <EventCard key={evt.id || idx} event={evt} index={idx} />
            ))}
          </div>
        )}

        {viewMode === 'slider' && <EventSlider events={events} />}

        {viewMode === 'timeline' && (
          <div className="max-w-4xl mx-auto relative pl-6 sm:pl-0">
            {/* Center vertical golden spine */}
            <div className="absolute top-0 bottom-0 left-6 sm:left-1/2 w-[2px] bg-gradient-to-b from-royalGold via-primaryMaroon to-royalGold -translate-x-1/2" />

            <div className="space-y-12 sm:space-y-16">
              {events.map((evt, idx) => {
                const isEven = idx % 2 === 0;
                return (
                  <motion.div
                    key={evt.id || idx}
                    initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.6 }}
                    className={`relative flex flex-col sm:flex-row items-center ${
                      isEven ? 'sm:flex-row-reverse' : ''
                    } gap-6 sm:gap-12`}
                  >
                    {/* Center Node Dot */}
                    <div className="absolute left-6 sm:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#FFF9F0] border-4 border-royalGold shadow-lg flex items-center justify-center z-10">
                      <div className="w-2.5 h-2.5 rounded-full bg-primaryMaroon" />
                    </div>

                    {/* Event Content Card */}
                    <div className="w-full sm:w-1/2 pl-8 sm:pl-0">
                      <div
                        className="p-6 rounded-3xl bg-[#FFFDF9] border-2 shadow-xl gold-border-card"
                        style={{ borderColor: evt.accentColor }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${evt.badgeColor}`}
                          >
                            Ceremony 0{evt.order}
                          </span>
                          <span className="text-xs font-bold text-primaryMaroon">
                            {evt.formattedDate}
                          </span>
                        </div>

                        <h3 className="font-heading text-2xl font-bold text-primaryMaroon mb-2">
                          {language === 'hi' ? evt.titleHi : evt.title}
                        </h3>

                        {/* Timing only when configured */}
                        {evt.startTime && (
                          <div className="flex items-center gap-2 text-xs font-semibold text-darkBrown/90 mb-2">
                            <Clock className="w-3.5 h-3.5 text-royalGold" />
                            <span>
                              {evt.startTime} {evt.endTime ? `– ${evt.endTime}` : ''}
                            </span>
                          </div>
                        )}

                        <p className="text-xs sm:text-sm text-darkBrown/80 font-cormorant italic leading-relaxed">
                          {language === 'hi' ? evt.descriptionHi : evt.description}
                        </p>
                      </div>
                    </div>

                    {/* Image Thumbnail */}
                    <div className="hidden sm:block sm:w-1/2">
                      <div className="w-48 h-32 rounded-2xl overflow-hidden border-2 border-royalGold shadow-md mx-auto">
                        <img
                          src={typeof evt.image === 'object' && evt.image ? (evt.image as any).secureUrl || (evt.image as any).url : evt.image}
                          alt={evt.title}
                          className="w-full h-full object-cover object-center hover:scale-110 transition-transform duration-500"
                          loading="lazy"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/assets/wedding/wedding/wedding-ceremony.webp';
                          }}
                        />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export const WeddingEvents = EventsSection;
export default EventsSection;

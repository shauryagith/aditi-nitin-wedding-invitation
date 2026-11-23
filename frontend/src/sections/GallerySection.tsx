import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, ZoomIn, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { GalleryPhoto } from '../types/wedding';
import { weddingService } from '../services/api';
import { weddingSyncManager } from '../utils/dataSync';
import { useRealtimeCMS } from '../hooks/useRealtimeCMS';
import { INITIAL_GALLERY_PHOTOS } from '../config/wedding.config';
import { OrnamentalDivider } from '../components/common/DecorativeOrnaments';
import { GalleryLightbox } from '../components/common/GalleryLightbox';

export const GallerySection: React.FC = () => {
  const { t, language } = useLanguage();
  const [photos, setPhotos] = useState<GalleryPhoto[]>(INITIAL_GALLERY_PHOTOS);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);

  const loadGallery = useCallback(() => {
    weddingService.getGallery()
      .then((data) => {
        if (data && data.length > 0) {
          setPhotos(data);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    loadGallery();
    // Instantly refresh gallery when photos are uploaded, edited, or reordered in dashboard
    return weddingSyncManager.subscribe(loadGallery);
  }, [loadGallery]);

  // Real-Time Socket.IO Synchronization
  useRealtimeCMS('gallery', (payload) => {
    if (payload.action === 'reorder' && Array.isArray(payload.data)) {
      setPhotos(payload.data);
    } else {
      loadGallery();
    }
  });

  const categories = [
    { key: 'all', labelEn: 'All Moments', labelHi: 'सभी स्मृतियाँ' },
    { key: 'aditi-nitin', labelEn: 'Aditi & Nitin', labelHi: 'अदिति एवं नितिन' },
    { key: 'pre-wedding', labelEn: 'Pre-Wedding', labelHi: 'प्री-वेडिंग' },
    { key: 'family-moments', labelEn: 'Family Moments', labelHi: 'पारिवारिक क्षण' },
    { key: 'wedding-celebrations', labelEn: 'Wedding Celebrations', labelHi: 'विवाह उत्सव' },
    { key: 'wedding-traditions', labelEn: 'Indian Wedding Traditions', labelHi: 'वैदिक संस्कार' },
  ];

  const filteredPhotos =
    selectedCategory === 'all'
      ? photos
      : photos.filter((p) => {
          if (!p) return false;
          const cat = (p.category || '').toLowerCase();
          if (cat === selectedCategory) return true;
          if (selectedCategory === 'aditi-nitin' && (cat === 'couple' || cat === 'aditi-nitin')) return true;
          if (selectedCategory === 'pre-wedding' && (cat === 'pre-wedding' || cat === 'prewedding')) return true;
          if (selectedCategory === 'family-moments' && (cat === 'family' || cat === 'family-moments')) return true;
          if (selectedCategory === 'wedding-celebrations' && (cat === 'celebration' || cat === 'celebrations' || cat === 'wedding' || cat === 'wedding-celebrations')) return true;
          if (selectedCategory === 'wedding-traditions' && ['haldi', 'mehndi', 'tilak', 'ceremony', 'traditions', 'wedding-traditions'].includes(cat)) return true;
          return false;
        });

  const openLightbox = (index: number) => {
    setActivePhotoIndex(index);
  };

  const closeLightbox = () => {
    setActivePhotoIndex(null);
  };

  const nextPhoto = () => {
    if (activePhotoIndex !== null) {
      setActivePhotoIndex((activePhotoIndex + 1) % filteredPhotos.length);
    }
  };

  const prevPhoto = () => {
    if (activePhotoIndex !== null) {
      setActivePhotoIndex((activePhotoIndex - 1 + filteredPhotos.length) % filteredPhotos.length);
    }
  };

  return (
    <section id="gallery" className="py-20 sm:py-28 px-4 sm:px-6 bg-deepBurgundy text-ivory relative overflow-hidden">
      {/* Background mandala decoration */}
      <div className="absolute inset-0 mandala-bg opacity-15 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <span className="text-xs uppercase tracking-widest text-royalGold font-semibold font-hindi">
            ॥ स्वर्णिम स्मृतियाँ ॥
          </span>
          <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-ivory mt-2">
            {t.gallery.sectionTitle}
          </h2>
          <p className="font-cormorant text-base sm:text-xl text-champagne/90 italic mt-2 max-w-xl mx-auto">
            {t.gallery.sectionSubtitle}
          </p>
          <OrnamentalDivider color="#D4AF37" className="my-3 scale-90 sm:scale-100" />
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 ${
                selectedCategory === cat.key
                  ? 'bg-gradient-to-r from-royalGold via-[#E0BC6C] to-royalGold text-deepBurgundy shadow-lg shadow-royalGold/30 scale-105'
                  : 'bg-primaryMaroon/80 text-champagne border border-royalGold/30 hover:border-royalGold hover:text-white'
              }`}
            >
              {language === 'hi' ? cat.labelHi : cat.labelEn}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="h-72 sm:h-80 rounded-2xl bg-burgundy-950/40 border border-royalGold/30 animate-pulse flex items-center justify-center"
              >
                <Sparkles className="w-6 h-6 text-royalGold/30 animate-spin" />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredPhotos.length === 0 && (
          <div className="text-center py-16 px-4 bg-primaryMaroon/20 rounded-3xl border border-royalGold/30 max-w-lg mx-auto">
            <Sparkles className="w-10 h-10 text-royalGold mx-auto mb-3 opacity-80" />
            <h3 className="font-heading text-xl text-champagne font-bold">
              {language === 'hi' ? 'कोई चित्र प्रकाशित नहीं है' : 'No Moments Published Yet'}
            </h3>
            <p className="font-cormorant text-sm text-ivory/70 italic mt-1">
              {language === 'hi'
                ? 'इस श्रेणी में अभी तक कोई तस्वीर प्रकाशित नहीं की गई है।'
                : 'No published moments available in this category. Check back soon for cherished memories!'}
            </p>
          </div>
        )}

        {/* Masonry / Responsive Grid */}
        {!loading && filteredPhotos.length > 0 && (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnimatePresence>
              {filteredPhotos.map((photo, idx) => (
                <motion.div
                  layout
                  key={photo.id || idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  className="group relative h-72 sm:h-80 rounded-2xl overflow-hidden border-2 border-royalGold/50 hover:border-royalGold shadow-xl bg-maroon-950 cursor-pointer"
                  onClick={() => openLightbox(idx)}
                >
                  {/* Image with Zoom on Hover */}
                  <img
                    src={photo.thumbnailUrl || photo.imageUrl}
                    alt={photo.title}
                    className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (!target.src.includes('gallery-moment-1.webp')) {
                        target.src = '/wedding-assets/optimized/gallery-moment-1.webp';
                      }
                    }}
                  />

                  {/* Gradient and Hover Reveal */}
                  <div className="absolute inset-0 bg-gradient-to-t from-deepBurgundy via-deepBurgundy/30 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />

                  {/* Category Pill */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="px-2.5 py-0.5 rounded-full bg-deepBurgundy/80 border border-royalGold/50 text-[10px] font-bold uppercase tracking-wider text-royalGold">
                      {language === 'hi' ? photo.categoryLabelHi || photo.categoryLabel : photo.categoryLabel}
                    </span>
                  </div>

                  {/* Quick View Icon */}
                  <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="p-2 rounded-full bg-royalGold text-deepBurgundy shadow-md">
                      <ZoomIn className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Title & Caption */}
                  <div className="absolute bottom-3 inset-x-3 z-10 transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                    <h4 className="font-heading text-lg font-bold text-champagne leading-tight">
                      {language === 'hi' ? photo.titleHi || photo.title : photo.title}
                    </h4>
                    {photo.caption && (
                      <p className="text-[11px] text-ivory/80 font-cormorant italic line-clamp-1 mt-0.5">
                        {photo.caption}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Lightbox Modal */}
      {activePhotoIndex !== null && (
        <GalleryLightbox
          photo={filteredPhotos[activePhotoIndex]}
          currentIndex={activePhotoIndex}
          totalPhotos={filteredPhotos.length}
          onClose={closeLightbox}
          onNext={nextPhoto}
          onPrev={prevPhoto}
        />
      )}
    </section>
  );
};

export const Gallery = GallerySection;
export default GallerySection;

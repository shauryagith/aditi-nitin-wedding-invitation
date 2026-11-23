import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Sparkles } from 'lucide-react';
import { GalleryPhoto } from '../../types/wedding';
import { useLanguage } from '../../context/LanguageContext';

interface GalleryLightboxProps {
  photo: GalleryPhoto | null;
  currentIndex: number;
  totalPhotos: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export const GalleryLightbox: React.FC<GalleryLightboxProps> = ({
  photo,
  currentIndex,
  totalPhotos,
  onClose,
  onNext,
  onPrev,
}) => {
  const { language } = useLanguage();
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    setIsZoomed(false);
  }, [currentIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!photo) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [photo, onClose, onNext, onPrev]);

  if (!photo) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-deepBurgundy/95 backdrop-blur-2xl p-4 sm:p-6"
        onClick={onClose}
      >
        {/* Top Control Bar */}
        <div
          className="absolute top-4 inset-x-4 sm:inset-x-8 flex items-center justify-between z-50 pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Index Counter */}
          <div className="px-4 py-1.5 rounded-full bg-primaryMaroon/80 border border-royalGold/50 text-champagne text-xs font-semibold tracking-wider">
            {currentIndex + 1} / {totalPhotos}
          </div>

          {/* Action Buttons (Zoom & Close) */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsZoomed(!isZoomed)}
              aria-label={isZoomed ? 'Zoom Out' : 'Zoom In'}
              className="p-2.5 rounded-full bg-primaryMaroon/80 hover:bg-primaryMaroon border border-royalGold/50 text-royalGold hover:text-white transition-all shadow-md"
            >
              {isZoomed ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              aria-label="Close Lightbox"
              className="p-2.5 rounded-full bg-primaryMaroon/80 hover:bg-red-800 border border-royalGold/50 text-royalGold hover:text-white transition-all shadow-md"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Previous Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          aria-label="Previous Photo"
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-50 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-primaryMaroon/80 hover:bg-primaryMaroon border border-royalGold text-royalGold hover:text-white flex items-center justify-center shadow-2xl transition-all"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Main Image Box */}
        <div
          className="relative max-w-4xl max-h-[82vh] overflow-hidden rounded-2xl border-2 border-royalGold shadow-[0_20px_60px_rgba(0,0,0,0.8)] bg-maroon-950 flex flex-col items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={photo.imageUrl || photo.thumbnailUrl}
            alt={photo.title}
            className={`max-w-full max-h-[72vh] object-contain transition-transform duration-300 ${
              isZoomed ? 'scale-150 cursor-zoom-out' : 'scale-100 cursor-zoom-in'
            }`}
            onClick={() => setIsZoomed(!isZoomed)}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (!target.src.includes('gallery-moment-1.webp')) {
                target.src = '/wedding-assets/optimized/gallery-moment-1.webp';
              }
            }}
          />

          {/* Caption Bar */}
          <div className="w-full bg-primaryMaroon/95 border-t border-royalGold/40 px-6 py-3 text-center">
            <h4 className="font-heading text-lg sm:text-xl font-bold text-champagne">
              {language === 'hi' ? photo.titleHi || photo.title : photo.title}
            </h4>
            {photo.caption && (
              <p className="text-xs sm:text-sm text-ivory/80 font-cormorant italic mt-0.5">
                {photo.caption}
              </p>
            )}
          </div>
        </div>

        {/* Next Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          aria-label="Next Photo"
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-50 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-primaryMaroon/80 hover:bg-primaryMaroon border border-royalGold text-royalGold hover:text-white flex items-center justify-center shadow-2xl transition-all"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

export default GalleryLightbox;

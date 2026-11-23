import React, { useState } from 'react';
import { Save, Plus, Trash2, ArrowUp, ArrowDown, Image as ImageIcon, Check } from 'lucide-react';
import { adminService } from '../../../services/api';
import { HeroSlideItem } from '../../../types/wedding';

interface HeroSliderSectionProps {
  initialSlides: HeroSlideItem[];
  onRefresh: () => void;
}

export const HeroSliderSection: React.FC<HeroSliderSectionProps> = ({
  initialSlides,
  onRefresh,
}) => {
  const [slides, setSlides] = useState<HeroSlideItem[]>(
    initialSlides && initialSlides.length > 0
      ? initialSlides
      : [
          {
            id: 'slide-1',
            desktopImage: 'https://res.cloudinary.com/ddpjysnr8/image/upload/v1795354463/wedding/gallery/gal_couple_1_sunset_palace.jpg',
            mobileImage: 'https://res.cloudinary.com/ddpjysnr8/image/upload/c_fill,g_auto,w_800,h_1200,q_auto/v1/wedding/gallery/gal_couple_1_sunset_palace.webp',
            title: 'Aditi & Nitin',
            subtitle: 'The Royal Wedding Celebration',
            dateBadge: 'December 11, 2026',
            order: 1,
            isActive: true,
          },
          {
            id: 'slide-2',
            desktopImage: 'https://res.cloudinary.com/ddpjysnr8/image/upload/v1795354461/wedding/events/wedding_ceremony.jpg',
            mobileImage: 'https://res.cloudinary.com/ddpjysnr8/image/upload/c_fill,g_auto,w_800,h_1200,q_auto/v1/wedding/events/wedding_ceremony.webp',
            title: 'Two Families, One Beautiful Celebration',
            subtitle: 'Join us in celebrating love and togetherness.',
            dateBadge: 'December 11, 2026',
            order: 2,
            isActive: true,
          },
          {
            id: 'slide-3',
            desktopImage: 'https://res.cloudinary.com/ddpjysnr8/image/upload/v1795354484/wedding/gallery/gal_celebration_1_baraat_procession.jpg',
            mobileImage: 'https://res.cloudinary.com/ddpjysnr8/image/upload/c_fill,g_auto,w_800,h_1200,q_auto/v1/wedding/gallery/gal_celebration_1_baraat_procession.webp',
            title: 'A Celebration of Traditions',
            subtitle: 'Haldi | Mehndi | Tilak | Wedding',
            dateBadge: 'December 11, 2026',
            order: 3,
            isActive: true,
          },
          {
            id: 'slide-4',
            desktopImage: 'https://res.cloudinary.com/ddpjysnr8/image/upload/v1795354465/wedding/gallery/gal_couple_2_carved_arches.jpg',
            mobileImage: 'https://res.cloudinary.com/ddpjysnr8/image/upload/c_fill,g_auto,w_800,h_1200,q_auto/v1/wedding/gallery/gal_couple_2_carved_arches.webp',
            title: 'Your Presence Is Our Blessing',
            subtitle: 'We cordially invite you to celebrate with us.',
            dateBadge: 'December 11, 2026',
            order: 4,
            isActive: true,
          },
        ]
  );

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleAddSlide = () => {
    const newSlide: HeroSlideItem = {
      id: `slide-${Date.now()}`,
      desktopImage: 'https://res.cloudinary.com/ddpjysnr8/image/upload/v1795354463/wedding/gallery/gal_couple_1_sunset_palace.jpg',
      mobileImage: 'https://res.cloudinary.com/ddpjysnr8/image/upload/c_fill,g_auto,w_800,h_1200,q_auto/v1/wedding/gallery/gal_couple_1_sunset_palace.webp',
      title: 'Royal Celebration',
      subtitle: 'Aditi & Nitin Wedding',
      dateBadge: 'December 11, 2026',
      order: slides.length + 1,
      isActive: true,
    };
    setSlides([...slides, newSlide]);
  };

  const handleRemoveSlide = (id: string) => {
    if (slides.length <= 1) {
      alert('At least one hero slide must remain.');
      return;
    }
    setSlides(slides.filter((s) => s.id !== id));
  };

  const handleMoveSlide = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === slides.length - 1)
    ) {
      return;
    }
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const reordered = [...slides];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(newIndex, 0, moved);
    reordered.forEach((s, idx) => (s.order = idx + 1));
    setSlides(reordered);
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccessMsg(null);
    try {
      await adminService.updateHeroSlides(slides);
      setSuccessMsg('Hero slides published successfully!');
      onRefresh();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      alert(`Save failed: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-white flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-gold-400" />
            Hero Background Slider
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Configure rotating photographs, headlines, and badges on the main hero banner.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleAddSlide}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gold-500/20 hover:bg-gold-500/30 text-gold-300 border border-gold-500/40 text-sm font-semibold transition"
          >
            <Plus className="w-4 h-4" /> Add Slide
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-600 text-burgundy-950 font-bold text-sm shadow-md transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Slider'}
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-sm flex items-center gap-2">
          <Check className="w-4 h-4" /> {successMsg}
        </div>
      )}

      <div className="space-y-4">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className="p-5 rounded-2xl bg-burgundy-950/40 border border-gold-500/20 shadow-md space-y-4"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-gold-500/20 text-gold-300 text-xs font-bold flex items-center justify-center border border-gold-500/30">
                  {index + 1}
                </span>
                <span className="text-sm font-bold text-white font-serif">{slide.title}</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleMoveSlide(index, 'up')}
                  disabled={index === 0}
                  className="p-1.5 rounded-lg bg-black/30 hover:bg-black/50 text-gray-300 disabled:opacity-30"
                  title="Move Up"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleMoveSlide(index, 'down')}
                  disabled={index === slides.length - 1}
                  className="p-1.5 rounded-lg bg-black/30 hover:bg-black/50 text-gray-300 disabled:opacity-30"
                  title="Move Down"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleRemoveSlide(slide.id)}
                  className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 ml-2"
                  title="Delete Slide"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gold-300 mb-1">
                  Main Title
                </label>
                <input
                  type="text"
                  value={slide.title}
                  onChange={(e) => {
                    const updated = [...slides];
                    updated[index].title = e.target.value;
                    setSlides(updated);
                  }}
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border border-gold-500/30 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gold-300 mb-1">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={slide.subtitle}
                  onChange={(e) => {
                    const updated = [...slides];
                    updated[index].subtitle = e.target.value;
                    setSlides(updated);
                  }}
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border border-gold-500/30 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gold-300 mb-1">
                  Date Badge Text
                </label>
                <input
                  type="text"
                  value={slide.dateBadge}
                  onChange={(e) => {
                    const updated = [...slides];
                    updated[index].dateBadge = e.target.value;
                    setSlides(updated);
                  }}
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border border-gold-500/30 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gold-300 mb-1">
                  Desktop Image URL (WebP)
                </label>
                <input
                  type="text"
                  value={slide.desktopImage}
                  onChange={(e) => {
                    const updated = [...slides];
                    updated[index].desktopImage = e.target.value;
                    setSlides(updated);
                  }}
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border border-gold-500/30 text-white text-sm"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

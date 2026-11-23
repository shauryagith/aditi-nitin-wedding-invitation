import React, { useState, useEffect, useCallback } from 'react';
import {
  BookOpen,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Save,
  Upload,
  RefreshCw,
  Image as ImageIcon,
  Sparkles,
  Check,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';
import { adminService, weddingService } from '../../../services/api';
import { StoryMilestone } from '../../../types/wedding';
import { WEDDING_CONFIG } from '../../../config/wedding.config';

interface OurStoryManagementSectionProps {
  storyMilestones?: StoryMilestone[];
  onUpdate?: () => void;
}

/**
 * Normalizes milestone records to guarantee all fields are filled with authentic published data.
 */
const normalizeWithPublishedData = (inputList?: StoryMilestone[]): StoryMilestone[] => {
  const published = WEDDING_CONFIG.storyMilestones;
  if (!inputList || inputList.length === 0) {
    return published.map((p) => ({ ...p }));
  }

  const result: StoryMilestone[] = inputList.map((item, idx) => {
    const pub = published[idx] || published[0];
    return {
      id: item.id || pub.id || `story-${idx + 1}`,
      title: item.title?.trim() || pub.title,
      titleHi: item.titleHi?.trim() || pub.titleHi || '',
      dateStr: item.dateStr?.trim() || item.date?.trim() || pub.dateStr || '',
      dateStrHi: item.dateStrHi?.trim() || pub.dateStrHi || '',
      date: item.date || item.dateStr || pub.dateStr || '',
      description: item.description?.trim() || pub.description,
      descriptionHi: item.descriptionHi?.trim() || pub.descriptionHi || '',
      image: item.image?.trim() || item.imageUrl?.trim() || pub.image,
      imageUrl: item.image?.trim() || item.imageUrl?.trim() || pub.image,
      quote: item.quote !== undefined && item.quote !== '' ? item.quote : pub.quote || '',
      quoteHi: item.quoteHi !== undefined && item.quoteHi !== '' ? item.quoteHi : pub.quoteHi || '',
    };
  });

  // If fewer chapters exist in input, backfill remaining published chapters
  if (result.length < published.length) {
    for (let i = result.length; i < published.length; i++) {
      result.push({ ...published[i] });
    }
  }

  return result;
};

export const OurStoryManagementSection: React.FC<OurStoryManagementSectionProps> = ({
  storyMilestones = [],
  onUpdate,
}) => {
  const [milestones, setMilestones] = useState<StoryMilestone[]>(() => {
    return normalizeWithPublishedData(storyMilestones);
  });

  const [saving, setSaving] = useState(false);
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (storyMilestones && storyMilestones.length > 0) {
      setMilestones(normalizeWithPublishedData(storyMilestones));
    } else {
      weddingService
        .getWeddingDetails()
        .then((data: any) => {
          if (data && data.storyMilestones && data.storyMilestones.length > 0) {
            setMilestones(normalizeWithPublishedData(data.storyMilestones));
          } else {
            setMilestones(normalizeWithPublishedData());
          }
        })
        .catch(() => {
          setMilestones(normalizeWithPublishedData());
        });
    }
  }, [storyMilestones]);

  const handleChange = (index: number, field: keyof StoryMilestone, value: string) => {
    setMilestones((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleLoadPublishedData = () => {
    setMilestones(WEDDING_CONFIG.storyMilestones.map((p) => ({ ...p })));
    setStatusMessage({
      type: 'success',
      text: 'All sections loaded with 100% authentic published website Our Story data! Click "Save & Publish Live" to persist changes.',
    });
  };

  const handleAddMilestone = () => {
    const newIdx = milestones.length + 1;
    const newMilestone: StoryMilestone = {
      id: `story-${Date.now()}`,
      title: `Chapter 0${newIdx}: A New Milestone`,
      titleHi: `अध्याय 0${newIdx}: नया पावन अध्याय`,
      dateStr: 'December 2026',
      dateStrHi: 'दिसम्बर २०२६',
      description: 'Enter the memorable narrative of this beautiful celebration chapter.',
      descriptionHi: 'इस पावन संस्मरण और उत्सव का विस्तृत हिन्दी विवरण यहाँ लिखें।',
      image: 'https://res.cloudinary.com/ddpjysnr8/image/upload/v1795363478/wedding/story/hjwfaiizwy73qgyyeezy.jpg',
      quote: 'Two souls, one sacred path towards eternity.',
      quoteHi: 'दो आत्माएँ, एक पावन यात्रा एवं अनंत समर्पण।',
    };
    setMilestones((prev) => [...prev, newMilestone]);
  };

  const handleRemoveMilestone = (index: number) => {
    if (milestones.length <= 1) {
      alert('You must have at least one story chapter.');
      return;
    }
    if (window.confirm(`Delete chapter "${milestones[index].title || `Chapter ${index + 1}`}"?`)) {
      setMilestones((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= milestones.length) return;

    setMilestones((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy;
    });
  };

  const handleImageFileUpload = async (index: number, file: File) => {
    setUploadingIdx(index);
    setStatusMessage(null);
    try {
      const formData = new FormData();
      formData.append('images', file);
      formData.append('category', 'story');
      formData.append('altText', milestones[index].title || 'Our Story Chapter');

      const res = await adminService.uploadMedia(formData);
      if (res && res.data && res.data.length > 0) {
        const uploaded = res.data[0];
        const secureUrl = uploaded.secureUrl || uploaded.url;
        handleChange(index, 'image', secureUrl);
        setStatusMessage({ type: 'success', text: `Image uploaded successfully for Chapter ${index + 1}` });
      } else {
        throw new Error('Upload failed or returned empty payload.');
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Image upload failed.' });
    } finally {
      setUploadingIdx(null);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setStatusMessage(null);
    try {
      await adminService.updateStoryMilestones(milestones);
      setStatusMessage({
        type: 'success',
        text: 'Our Story milestones updated successfully! Real-time update broadcast to all website visitors.',
      });
      if (onUpdate) onUpdate();
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to save story milestones.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-primaryMaroon">
            <BookOpen className="w-6 h-6 text-royalGold" />
            <h2 className="text-2xl font-bold font-heading">Our Story Management (प्रीति कथा)</h2>
          </div>
          <p className="text-sm text-stone-600 mt-1">
            Pre-filled with authentic published website data across all 4 chapters: dates, bilingual narratives, quotes, and Cloudinary photos.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleLoadPublishedData}
            title="Reload published website data into all fields"
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs transition-colors border border-stone-300 shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5 text-stone-600" />
            Auto-Fill Published Data
          </button>
          <button
            type="button"
            onClick={handleAddMilestone}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-champagne text-primaryMaroon font-semibold text-xs hover:bg-champagne/80 transition-colors border border-royalGold/40 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Chapter
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primaryMaroon text-champagne font-semibold text-xs sm:text-sm hover:bg-maroon-800 transition-colors shadow-md disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Publishing...' : 'Save & Publish Live'}
          </button>
        </div>
      </div>

      {/* Status Alerts */}
      {statusMessage && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border border-rose-200 text-rose-800'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <Check className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          )}
          <span className="text-sm font-medium">{statusMessage.text}</span>
        </div>
      )}

      {/* Chapters List */}
      <div className="space-y-6">
        {milestones.map((milestone, idx) => (
          <div
            key={milestone.id || idx}
            className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-stone-200 hover:border-royalGold/50 transition-all space-y-6"
          >
            {/* Top Bar */}
            <div className="flex justify-between items-center pb-4 border-b border-stone-100">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-deepBurgundy text-royalGold flex items-center justify-center font-bold text-sm">
                  0{idx + 1}
                </span>
                <div>
                  <h3 className="font-bold text-stone-800 text-lg">
                    {milestone.title || `Chapter 0${idx + 1}`}
                  </h3>
                  <span className="text-xs text-stone-500 font-hindi">
                    {milestone.titleHi || 'अध्याय'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleMove(idx, 'up')}
                  disabled={idx === 0}
                  title="Move Up"
                  className="p-1.5 rounded-lg text-stone-500 hover:bg-stone-100 disabled:opacity-30"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleMove(idx, 'down')}
                  disabled={idx === milestones.length - 1}
                  title="Move Down"
                  className="p-1.5 rounded-lg text-stone-500 hover:bg-stone-100 disabled:opacity-30"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleRemoveMilestone(idx)}
                  title="Delete Chapter"
                  className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 ml-2"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Form & Image Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Form Inputs (8 cols) */}
              <div className="lg:col-span-8 space-y-4">
                {/* Titles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Chapter Title (English) *
                    </label>
                    <input
                      type="text"
                      value={milestone.title || ''}
                      onChange={(e) => handleChange(idx, 'title', e.target.value)}
                      placeholder="e.g. When Two Souls First Met"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-primaryMaroon bg-stone-50/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Chapter Title (Hindi / हिन्दी) *
                    </label>
                    <input
                      type="text"
                      value={milestone.titleHi || ''}
                      onChange={(e) => handleChange(idx, 'titleHi', e.target.value)}
                      placeholder="e.g. जब दो राहें एक हुईं"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-hindi focus:outline-none focus:ring-2 focus:ring-primaryMaroon bg-stone-50/50"
                    />
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Milestone Date / Season (English) *
                    </label>
                    <input
                      type="text"
                      value={milestone.dateStr || milestone.date || ''}
                      onChange={(e) => {
                        handleChange(idx, 'dateStr', e.target.value);
                        handleChange(idx, 'date', e.target.value);
                      }}
                      placeholder="e.g. Autumn 2024"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-primaryMaroon bg-stone-50/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Milestone Date / Season (Hindi / हिन्दी) *
                    </label>
                    <input
                      type="text"
                      value={milestone.dateStrHi || ''}
                      onChange={(e) => handleChange(idx, 'dateStrHi', e.target.value)}
                      placeholder="e.g. शरद २०२४"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-hindi focus:outline-none focus:ring-2 focus:ring-primaryMaroon bg-stone-50/50"
                    />
                  </div>
                </div>

                {/* Descriptions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Story Narrative (English) *
                    </label>
                    <textarea
                      rows={4}
                      value={milestone.description || ''}
                      onChange={(e) => handleChange(idx, 'description', e.target.value)}
                      placeholder="Detailed narrative for this chapter..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-primaryMaroon bg-stone-50/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Story Narrative (Hindi / हिन्दी) *
                    </label>
                    <textarea
                      rows={4}
                      value={milestone.descriptionHi || ''}
                      onChange={(e) => handleChange(idx, 'descriptionHi', e.target.value)}
                      placeholder="इस अध्याय का विस्तृत हिन्दी संस्मरण..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-hindi focus:outline-none focus:ring-2 focus:ring-primaryMaroon bg-stone-50/50"
                    />
                  </div>
                </div>

                {/* Quotes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Poetic Quote (English)
                    </label>
                    <input
                      type="text"
                      value={milestone.quote || ''}
                      onChange={(e) => handleChange(idx, 'quote', e.target.value)}
                      placeholder="e.g. In the quietest moments, destiny finds its gentle rhythm."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm italic focus:outline-none focus:ring-2 focus:ring-primaryMaroon bg-stone-50/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Poetic Quote (Hindi / हिन्दी)
                    </label>
                    <input
                      type="text"
                      value={milestone.quoteHi || ''}
                      onChange={(e) => handleChange(idx, 'quoteHi', e.target.value)}
                      placeholder="e.g. जहाँ शब्दों से परे, भावनाएँ अपनी पवित्रता में संवाद करती हैं।"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-hindi italic focus:outline-none focus:ring-2 focus:ring-primaryMaroon bg-stone-50/50"
                    />
                  </div>
                </div>

                {/* Direct Image URL input */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Image URL (Cloudinary Secure HTTPS URL) *
                  </label>
                  <input
                    type="url"
                    value={milestone.image || milestone.imageUrl || ''}
                    onChange={(e) => handleChange(idx, 'image', e.target.value)}
                    placeholder="https://res.cloudinary.com/.../image/upload/..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primaryMaroon bg-stone-50/50"
                  />
                </div>
              </div>

              {/* Image Preview & Upload (4 cols) */}
              <div className="lg:col-span-4 flex flex-col items-center space-y-3">
                <span className="text-xs font-semibold text-stone-700 self-start">Chapter Photograph</span>

                {/* Image Card Preview */}
                <div className="relative w-48 sm:w-56 h-56 sm:h-64 rounded-2xl overflow-hidden border-2 border-royalGold shadow-md bg-stone-900 group">
                  <img
                    src={milestone.image || milestone.imageUrl || WEDDING_CONFIG.storyMilestones[idx]?.image || ''}
                    alt={milestone.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      const fallback = WEDDING_CONFIG.storyMilestones[idx]?.image || 'https://res.cloudinary.com/ddpjysnr8/image/upload/v1795363478/wedding/story/hjwfaiizwy73qgyyeezy.jpg';
                      if (e.currentTarget.src !== fallback) {
                        e.currentTarget.src = fallback;
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-2 left-2 right-2 text-center text-xs text-champagne font-semibold truncate">
                    {milestone.title || `Chapter 0${idx + 1}`}
                  </div>
                </div>

                {/* Upload Button */}
                <label className="w-full cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploadingIdx === idx}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageFileUpload(idx, file);
                    }}
                  />
                  <div className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-royalGold bg-champagne/30 hover:bg-champagne/60 text-primaryMaroon text-xs font-semibold transition-colors text-center">
                    <Upload className="w-4 h-4" />
                    {uploadingIdx === idx ? 'Uploading to Cloudinary...' : 'Upload New Photo'}
                  </div>
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

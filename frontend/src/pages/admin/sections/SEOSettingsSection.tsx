import React, { useState } from 'react';
import { Globe, Save, Check, RefreshCw } from 'lucide-react';
import { adminService } from '../../../services/api';

interface SEOSettingsSectionProps {
  initialSEO?: any;
  onRefresh: () => void;
}

export const SEOSettingsSection: React.FC<SEOSettingsSectionProps> = ({
  initialSEO,
  onRefresh,
}) => {
  const [formData, setFormData] = useState({
    metaTitle: initialSEO?.metaTitle || 'Aditi & Nitin Royal Hindu Wedding - 11 December 2026',
    metaDescription:
      initialSEO?.metaDescription ||
      'Official wedding celebration and digital invitation for Aditi Srivastava and Nitin Joshi in Gorakhpur, UP. Join us for the sacred ceremonies.',
    ogImage: initialSEO?.ogImage || '/wedding-assets/optimized/hero-main.webp',
    keywords: Array.isArray(initialSEO?.keywords)
      ? initialSEO.keywords.join(', ')
      : 'Aditi Nitin Wedding, Gorakhpur Wedding, Royal Indian Wedding, 11 December 2026',
  });

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(null);
    try {
      await adminService.updateSEO({
        metaTitle: formData.metaTitle,
        metaDescription: formData.metaDescription,
        ogImage: formData.ogImage,
        keywords: formData.keywords.split(',').map((k: string) => k.trim()).filter(Boolean),
      });
      setSuccessMsg('SEO tags and OpenGraph metadata updated successfully!');
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
      <div>
        <h2 className="text-2xl font-serif font-bold text-white flex items-center gap-2">
          <Globe className="w-6 h-6 text-gold-400" />
          Search Engine Optimization (SEO) & Social Sharing
        </h2>
        <p className="text-sm text-gray-400 mt-1">
          Configure how the wedding invitation looks on Google search results, WhatsApp previews, and social media links.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-sm flex items-center gap-2">
          <Check className="w-4 h-4" /> {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-burgundy-950/40 border border-gold-500/20 shadow-xl space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gold-300 mb-1">
            Meta Title (Page Title)
          </label>
          <input
            type="text"
            value={formData.metaTitle}
            onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-gold-500/30 text-white text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gold-300 mb-1">
            Meta Description (Search & WhatsApp Snippet)
          </label>
          <textarea
            rows={3}
            value={formData.metaDescription}
            onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-gold-500/30 text-white text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gold-300 mb-1">
            Social Share Preview Image URL (og:image)
          </label>
          <input
            type="text"
            value={formData.ogImage}
            onChange={(e) => setFormData({ ...formData, ogImage: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-gold-500/30 text-white text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gold-300 mb-1">
            SEO Keywords (Comma Separated)
          </label>
          <input
            type="text"
            value={formData.keywords}
            onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-gold-500/30 text-white text-sm"
          />
        </div>

        <div className="flex justify-end pt-4 border-t border-white/10">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-600 text-burgundy-950 font-bold text-sm shadow-lg transition disabled:opacity-50"
          >
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving...' : 'Save SEO Tags'}
          </button>
        </div>
      </form>
    </div>
  );
};

import React, { useState } from 'react';
import { Palette, Save, Check, RefreshCw, Sparkles } from 'lucide-react';
import { adminService } from '../../../services/api';

interface WebsiteAppearanceSectionProps {
  initialAppearance?: any;
  onRefresh: () => void;
}

export const WebsiteAppearanceSection: React.FC<WebsiteAppearanceSectionProps> = ({
  initialAppearance,
  onRefresh,
}) => {
  const [formData, setFormData] = useState({
    primaryColor: initialAppearance?.primaryColor || '#780016',
    secondaryColor: initialAppearance?.secondaryColor || '#d4af37',
    enableFloatingParticles:
      initialAppearance?.enableFloatingParticles !== undefined
        ? initialAppearance.enableFloatingParticles
        : true,
    enableFlowerPetals:
      initialAppearance?.enableFlowerPetals !== undefined
        ? initialAppearance.enableFlowerPetals
        : true,
    enableMusicAutoplay:
      initialAppearance?.enableMusicAutoplay !== undefined
        ? initialAppearance.enableMusicAutoplay
        : false,
  });

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(null);
    try {
      await adminService.updateAppearance(formData);
      setSuccessMsg('Website appearance and animation settings updated!');
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
          <Palette className="w-6 h-6 text-gold-400" />
          Website Theme & Visual Effects
        </h2>
        <p className="text-sm text-gray-400 mt-1">
          Customize royal Hindu wedding theme palettes, floating particles, and ceremonial animations.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-sm flex items-center gap-2">
          <Check className="w-4 h-4" /> {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-burgundy-950/40 border border-gold-500/20 shadow-xl space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-gold-300 mb-2">
              Primary Theme Color (Royal Burgundy)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={formData.primaryColor}
                onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                className="w-10 h-10 rounded-lg border-none cursor-pointer"
              />
              <input
                type="text"
                value={formData.primaryColor}
                onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                className="px-3 py-2 rounded-lg bg-black/40 border border-gold-500/30 text-white text-sm w-32"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gold-300 mb-2">
              Accent Theme Color (Royal Gold)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={formData.secondaryColor}
                onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                className="w-10 h-10 rounded-lg border-none cursor-pointer"
              />
              <input
                type="text"
                value={formData.secondaryColor}
                onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                className="px-3 py-2 rounded-lg bg-black/40 border border-gold-500/30 text-white text-sm w-32"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-white/10 space-y-4">
          <h3 className="text-sm font-semibold text-gold-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Animation & Visual Controls
          </h3>

          <div className="flex items-center justify-between p-3 rounded-xl bg-black/30 border border-white/5">
            <div>
              <div className="text-sm font-medium text-white">Floating Golden Particles</div>
              <div className="text-xs text-gray-400">Atmospheric golden dust particles in background</div>
            </div>
            <input
              type="checkbox"
              checked={formData.enableFloatingParticles}
              onChange={(e) => setFormData({ ...formData, enableFloatingParticles: e.target.checked })}
              className="w-5 h-5 accent-gold-500 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-black/30 border border-white/5">
            <div>
              <div className="text-sm font-medium text-white">Ceremonial Flower Petals</div>
              <div className="text-xs text-gray-400">Marigold and rose petal animation on celebration sections</div>
            </div>
            <input
              type="checkbox"
              checked={formData.enableFlowerPetals}
              onChange={(e) => setFormData({ ...formData, enableFlowerPetals: e.target.checked })}
              className="w-5 h-5 accent-gold-500 cursor-pointer"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-white/10">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-600 text-burgundy-950 font-bold text-sm shadow-lg transition disabled:opacity-50"
          >
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving...' : 'Save Appearance'}
          </button>
        </div>
      </form>
    </div>
  );
};

import React, { useState } from 'react';
import { Save, User, Check, RefreshCw } from 'lucide-react';
import { adminService } from '../../../services/api';

interface CoupleDetailsSectionProps {
  initialContent: any;
  onRefresh: () => void;
}

export const CoupleDetailsSection: React.FC<CoupleDetailsSectionProps> = ({
  initialContent,
  onRefresh,
}) => {
  const [formData, setFormData] = useState({
    brideName: initialContent?.brideName || 'Aditi',
    brideNameHi: initialContent?.brideNameHi || 'अदिति',
    brideBio:
      initialContent?.brideBio ||
      'A graceful soul whose smile radiates warmth and joy. Daughter of Smt. Meera Devi and Shri KBL Srivastava.',
    brideImage: initialContent?.brideImage || '/wedding-assets/optimized/aditi-portrait.webp',
    brideMother: initialContent?.brideMother || 'Smt. Meera Devi',
    brideFather: initialContent?.brideFather || 'Shri KBL Srivastava',

    groomName: initialContent?.groomName || 'Nitin',
    groomNameHi: initialContent?.groomNameHi || 'नितिन',
    groomBio:
      initialContent?.groomBio ||
      'A visionary leader with a heart of gold. Son of Smt. Suman and Shri Lalit Mohan Joshi.',
    groomImage: initialContent?.groomImage || '/wedding-assets/optimized/nitin-portrait.webp',
    groomMother: initialContent?.groomMother || 'Smt. Suman',
    groomFather: initialContent?.groomFather || 'Shri Lalit Mohan Joshi',
  });

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(null);
    try {
      await adminService.updateGeneralContent(formData);
      setSuccessMsg('Couple profiles updated and published successfully!');
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif font-bold text-white flex items-center gap-2">
            <User className="w-6 h-6 text-gold-400" />
            Couple Profiles & Lineage
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Manage Aditi and Nitin's official introductions, biographical descriptions, portraits, and parental lineage.
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-sm flex items-center gap-2">
          <Check className="w-4 h-4" /> {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Bride Card */}
        <div className="p-6 rounded-2xl bg-burgundy-950/40 border border-gold-500/20 shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-white/10">
            <span className="w-3 h-3 rounded-full bg-rose-400" />
            <h3 className="text-lg font-serif font-bold text-white">The Bride: Aditi Srivastava</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gold-300 mb-1">Bride's Name (English)</label>
              <input
                type="text"
                value={formData.brideName}
                onChange={(e) => setFormData({ ...formData, brideName: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-black/40 border border-gold-500/30 text-white text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gold-300 mb-1">दुल्हन का नाम (हिंदी)</label>
              <input
                type="text"
                value={formData.brideNameHi}
                onChange={(e) => setFormData({ ...formData, brideNameHi: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-black/40 border border-gold-500/30 text-white text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gold-300 mb-1">Mother's Name</label>
              <input
                type="text"
                value={formData.brideMother}
                onChange={(e) => setFormData({ ...formData, brideMother: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-black/40 border border-gold-500/30 text-white text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gold-300 mb-1">Father's Name</label>
              <input
                type="text"
                value={formData.brideFather}
                onChange={(e) => setFormData({ ...formData, brideFather: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-black/40 border border-gold-500/30 text-white text-sm"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gold-300 mb-1">Portrait Image URL</label>
              <input
                type="text"
                value={formData.brideImage}
                onChange={(e) => setFormData({ ...formData, brideImage: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-black/40 border border-gold-500/30 text-white text-sm"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gold-300 mb-1">Bride's Bio / Introduction</label>
              <textarea
                rows={3}
                value={formData.brideBio}
                onChange={(e) => setFormData({ ...formData, brideBio: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-black/40 border border-gold-500/30 text-white text-sm"
              />
            </div>
          </div>
        </div>

        {/* Groom Card */}
        <div className="p-6 rounded-2xl bg-burgundy-950/40 border border-gold-500/20 shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-white/10">
            <span className="w-3 h-3 rounded-full bg-amber-400" />
            <h3 className="text-lg font-serif font-bold text-white">The Groom: Nitin Joshi</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gold-300 mb-1">Groom's Name (English)</label>
              <input
                type="text"
                value={formData.groomName}
                onChange={(e) => setFormData({ ...formData, groomName: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-black/40 border border-gold-500/30 text-white text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gold-300 mb-1">दूल्हे का नाम (हिंदी)</label>
              <input
                type="text"
                value={formData.groomNameHi}
                onChange={(e) => setFormData({ ...formData, groomNameHi: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-black/40 border border-gold-500/30 text-white text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gold-300 mb-1">Mother's Name</label>
              <input
                type="text"
                value={formData.groomMother}
                onChange={(e) => setFormData({ ...formData, groomMother: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-black/40 border border-gold-500/30 text-white text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gold-300 mb-1">Father's Name</label>
              <input
                type="text"
                value={formData.groomFather}
                onChange={(e) => setFormData({ ...formData, groomFather: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-black/40 border border-gold-500/30 text-white text-sm"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gold-300 mb-1">Portrait Image URL</label>
              <input
                type="text"
                value={formData.groomImage}
                onChange={(e) => setFormData({ ...formData, groomImage: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-black/40 border border-gold-500/30 text-white text-sm"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gold-300 mb-1">Groom's Bio / Introduction</label>
              <textarea
                rows={3}
                value={formData.groomBio}
                onChange={(e) => setFormData({ ...formData, groomBio: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-black/40 border border-gold-500/30 text-white text-sm"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-600 text-burgundy-950 font-bold text-sm shadow-lg transition disabled:opacity-50"
          >
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving...' : 'Save Couple Details'}
          </button>
        </div>
      </form>
    </div>
  );
};

import React, { useState } from 'react';
import { Settings, Save, Check, RefreshCw, AlertTriangle } from 'lucide-react';
import { adminService } from '../../../services/api';

interface WebsiteSettingsSectionProps {
  initialContent: any;
  onRefresh: () => void;
}

export const WebsiteSettingsSection: React.FC<WebsiteSettingsSectionProps> = ({
  initialContent,
  onRefresh,
}) => {
  const [formData, setFormData] = useState({
    weddingDate: initialContent?.weddingDate || '2026-12-11T19:00:00+05:30',
    timezone: initialContent?.timezone || 'Asia/Kolkata',
    isPublic: initialContent?.websiteSettings?.isPublic !== undefined ? initialContent.websiteSettings.isPublic : true,
    maintenanceMode:
      initialContent?.websiteSettings?.maintenanceMode !== undefined
        ? initialContent.websiteSettings.maintenanceMode
        : false,
  });

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(null);
    try {
      await adminService.updateGeneralContent({
        weddingDate: formData.weddingDate,
        timezone: formData.timezone,
        websiteSettings: {
          isPublic: formData.isPublic,
          maintenanceMode: formData.maintenanceMode,
        },
      });
      setSuccessMsg('Operational website settings successfully updated!');
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
          <Settings className="w-6 h-6 text-gold-400" />
          Master Website Configuration
        </h2>
        <p className="text-sm text-gray-400 mt-1">
          Configure countdown target timestamp, timezone, and public site accessibility.
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
            <label className="block text-xs font-semibold text-gold-300 mb-1">
              Target Wedding Date & Time (ISO 8601)
            </label>
            <input
              type="text"
              value={formData.weddingDate}
              onChange={(e) => setFormData({ ...formData, weddingDate: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-gold-500/30 text-white text-sm"
              required
            />
            <p className="text-[11px] text-gray-400 mt-1">
              Confirmed Date: December 11, 2026 at 7:00 PM IST (Asia/Kolkata).
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gold-300 mb-1">Timezone</label>
            <input
              type="text"
              value={formData.timezone}
              onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-gold-500/30 text-white text-sm"
              required
            />
          </div>
        </div>

        <div className="pt-4 border-t border-white/10 space-y-4">
          <h3 className="text-sm font-semibold text-gold-400">Site Accessibility</h3>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-black/30 border border-white/5">
            <div>
              <div className="text-sm font-medium text-white">Publicly Accessible</div>
              <div className="text-xs text-gray-400">Allow guests to view invitation and submit RSVPs</div>
            </div>
            <input
              type="checkbox"
              checked={formData.isPublic}
              onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
              className="w-5 h-5 accent-gold-500 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-black/30 border border-white/5">
            <div>
              <div className="text-sm font-medium text-white">Maintenance Mode</div>
              <div className="text-xs text-rose-300/80">Display polite maintenance greeting to guests</div>
            </div>
            <input
              type="checkbox"
              checked={formData.maintenanceMode}
              onChange={(e) => setFormData({ ...formData, maintenanceMode: e.target.checked })}
              className="w-5 h-5 accent-rose-500 cursor-pointer"
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
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};

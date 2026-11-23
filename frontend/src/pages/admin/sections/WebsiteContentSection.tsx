import React, { useState } from 'react';
import { Save, Check, RefreshCw, FileText } from 'lucide-react';
import { adminService } from '../../../services/api';

interface WebsiteContentSectionProps {
  initialContent: any;
  onRefresh: () => void;
}

export const WebsiteContentSection: React.FC<WebsiteContentSectionProps> = ({
  initialContent,
  onRefresh,
}) => {
  const [formData, setFormData] = useState({
    invitationMessage:
      initialContent?.invitationMessage ||
      'With the divine grace of Lord Ganesha and the blessings of our ancestors, we warmly invite you to celebrate the joyous wedding of Aditi and Nitin.',
    invitationMessageHi:
      initialContent?.invitationMessageHi ||
      'श्री गणेशाय नमः। हमारे पूर्वजों के आशीर्वाद से, हम आपको अदिति एवं नितिन के शुभ विवाह के पावन अवसर पर सपरिवार सादर आमंत्रित करते हैं।',
    primaryPhone: initialContent?.websiteSettings?.primaryPhone || '+91-9876543210',
    whatsappNumber: initialContent?.websiteSettings?.whatsappNumber || '919876543210',
  });

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(null);
    try {
      await adminService.updateGeneralContent({
        invitationMessage: formData.invitationMessage,
        invitationMessageHi: formData.invitationMessageHi,
        websiteSettings: {
          primaryPhone: formData.primaryPhone,
          whatsappNumber: formData.whatsappNumber,
        },
      });
      setSuccessMsg('Website content successfully saved and published!');
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
            <FileText className="w-6 h-6 text-gold-400" />
            Website Content & Blessings
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Edit the wedding invitation prose, traditional blessings, and helpline contacts.
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-sm flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-burgundy-950/40 border border-gold-500/20 shadow-xl space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gold-300 mb-2">
            Main Invitation Message (English)
          </label>
          <textarea
            rows={4}
            value={formData.invitationMessage}
            onChange={(e) => setFormData({ ...formData, invitationMessage: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-black/40 border border-gold-500/30 text-white text-sm focus:outline-none focus:border-gold-400"
            required
          />
          <p className="text-xs text-gray-400 mt-1">
            Displayed prominently in the invitation card envelope and ceremony headers.
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gold-300 mb-2">
            शुभ निमंत्रण संदेश (हिंदी / देवनागरी)
          </label>
          <textarea
            rows={4}
            value={formData.invitationMessageHi}
            onChange={(e) => setFormData({ ...formData, invitationMessageHi: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-black/40 border border-gold-500/30 text-white text-sm focus:outline-none focus:border-gold-400"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-white/10">
          <div>
            <label className="block text-sm font-semibold text-gold-300 mb-2">
              Primary Wedding Helpline Phone
            </label>
            <input
              type="text"
              value={formData.primaryPhone}
              onChange={(e) => setFormData({ ...formData, primaryPhone: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-black/40 border border-gold-500/30 text-white text-sm focus:outline-none focus:border-gold-400"
              placeholder="+91-9876543210"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gold-300 mb-2">
              WhatsApp Support Number (without '+' or spaces)
            </label>
            <input
              type="text"
              value={formData.whatsappNumber}
              onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-black/40 border border-gold-500/30 text-white text-sm focus:outline-none focus:border-gold-400"
              placeholder="919876543210"
              required
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-600 hover:to-amber-700 text-burgundy-950 font-bold text-sm shadow-lg transition disabled:opacity-50"
          >
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Publishing Changes...' : 'Save & Publish Content'}
          </button>
        </div>
      </form>
    </div>
  );
};

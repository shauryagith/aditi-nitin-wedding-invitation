import React, { useState } from 'react';
import { Save, MapPin, Check, RefreshCw, Navigation } from 'lucide-react';
import { adminService } from '../../../services/api';

interface VenueLocationSectionProps {
  initialContent: any;
  onRefresh: () => void;
}

export const VenueLocationSection: React.FC<VenueLocationSectionProps> = ({
  initialContent,
  onRefresh,
}) => {
  const [formData, setFormData] = useState({
    venue: initialContent?.venue || 'Srivastava Niwas',
    address: initialContent?.address || '002E Bank Colony, Padari Bazaar, Gorakhpur, UP 273014, India',
    mapUrl:
      initialContent?.mapUrl ||
      'https://maps.google.com/?q=002E+Bank+Colony,+Padari+Bazaar,+Gorakhpur',
    directions:
      initialContent?.directions ||
      'Located in Padari Bazaar near Bank Colony. Ample parking available at the venue premises. Approximately 20 minutes from Gorakhpur Railway Station.',
    lat: initialContent?.coordinates?.lat || 26.7865,
    lng: initialContent?.coordinates?.lng || 83.398,
  });

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(null);
    try {
      await adminService.updateGeneralContent({
        venue: formData.venue,
        address: formData.address,
        mapUrl: formData.mapUrl,
        directions: formData.directions,
        coordinates: {
          lat: parseFloat(String(formData.lat)),
          lng: parseFloat(String(formData.lng)),
        },
      });
      setSuccessMsg('Venue location and navigation details saved successfully!');
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
            <MapPin className="w-6 h-6 text-gold-400" />
            Venue & Location Management
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Configure Gorakhpur wedding venue address, GPS coordinates, Google Maps navigation link, and parking directions.
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-sm flex items-center gap-2">
          <Check className="w-4 h-4" /> {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-burgundy-950/40 border border-gold-500/20 shadow-xl space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-gold-300 mb-1">Venue Name</label>
            <input
              type="text"
              value={formData.venue}
              onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-gold-500/30 text-white text-sm"
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-gold-300 mb-1">Full Postal Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-gold-500/30 text-white text-sm"
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-gold-300 mb-1">Google Maps Link</label>
            <input
              type="url"
              value={formData.mapUrl}
              onChange={(e) => setFormData({ ...formData, mapUrl: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-gold-500/30 text-white text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gold-300 mb-1">GPS Latitude</label>
            <input
              type="number"
              step="any"
              value={formData.lat}
              onChange={(e) => setFormData({ ...formData, lat: parseFloat(e.target.value) || 0 })}
              className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-gold-500/30 text-white text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gold-300 mb-1">GPS Longitude</label>
            <input
              type="number"
              step="any"
              value={formData.lng}
              onChange={(e) => setFormData({ ...formData, lng: parseFloat(e.target.value) || 0 })}
              className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-gold-500/30 text-white text-sm"
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-gold-300 mb-1">Arrival Directions & Parking Instructions</label>
            <textarea
              rows={3}
              value={formData.directions}
              onChange={(e) => setFormData({ ...formData, directions: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-gold-500/30 text-white text-sm"
            />
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-white/10">
          <a
            href={formData.mapUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-xs text-gold-400 hover:text-gold-300 underline font-medium"
          >
            <Navigation className="w-3.5 h-3.5" /> Test Navigation in Google Maps
          </a>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-600 text-burgundy-950 font-bold text-sm shadow-lg transition disabled:opacity-50"
          >
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving...' : 'Save Venue Details'}
          </button>
        </div>
      </form>
    </div>
  );
};

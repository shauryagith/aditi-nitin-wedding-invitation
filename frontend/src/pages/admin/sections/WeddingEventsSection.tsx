import React, { useState } from 'react';
import { Calendar, Plus, Edit2, Trash2, Check, Clock, MapPin, UploadCloud, Image as ImageIcon } from 'lucide-react';
import { adminService } from '../../../services/api';
import { WeddingEventItem } from '../../../types/wedding';

interface WeddingEventsSectionProps {
  events: WeddingEventItem[];
  onRefresh: () => void;
}

export const WeddingEventsSection: React.FC<WeddingEventsSectionProps> = ({
  events,
  onRefresh,
}) => {
  const [editingEvent, setEditingEvent] = useState<Partial<WeddingEventItem> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleOpenAdd = () => {
    setEditingEvent({
      title: '',
      titleHi: '',
      slug: `event-${Date.now()}`,
      description: '',
      descriptionHi: '',
      date: '2026-12-11',
      startTime: '10:00 AM',
      endTime: '01:00 PM',
      venue: 'Srivastava Niwas',
      address: '002E Bank Colony, Padari Bazaar, Gorakhpur, UP 273014',
      image: 'https://res.cloudinary.com/ddpjysnr8/image/upload/v1795354450/wedding/events/haldi_ceremony.jpg',
      dressCode: 'Traditional Attire',
      mapUrl: 'https://maps.google.com/?q=002E+Bank+Colony,+Padari+Bazaar,+Gorakhpur',
      order: events.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (ev: WeddingEventItem) => {
    setEditingEvent({ ...ev });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete event "${title}"?`)) return;
    try {
      await adminService.deleteEvent(id);
      onRefresh();
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingEvent) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('images', file);
    formData.append('category', editingEvent.slug || 'events');
    formData.append('altText', `${editingEvent.title || 'Wedding Ceremony'} - Event Asset`);

    try {
      const res = await adminService.uploadMedia(formData);
      if (res && res.data && res.data.length > 0) {
        const uploaded = res.data[0];
        setEditingEvent({
          ...editingEvent,
          image: uploaded.secureUrl || uploaded.url,
          ...(uploaded.publicId ? { publicId: uploaded.publicId } : {}),
        });
        setSuccessMsg('Event image uploaded to Cloudinary successfully!');
        setTimeout(() => setSuccessMsg(null), 3000);
      }
    } catch (err: any) {
      alert(`Image upload failed: ${err.message}`);
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;
    setSaving(true);
    try {
      if (editingEvent.id || (editingEvent as any)._id) {
        const id = editingEvent.id || (editingEvent as any)._id;
        await adminService.updateEvent(id, editingEvent);
        setSuccessMsg('Event updated successfully!');
      } else {
        await adminService.createEvent(editingEvent);
        setSuccessMsg('New event created successfully!');
      }
      setIsModalOpen(false);
      onRefresh();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      alert(`Save failed: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-white flex items-center gap-2">
            <Calendar className="w-6 h-6 text-gold-400" />
            Wedding Ceremonies & Events
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Manage the sacred timeline: Haldi, Mehndi, Tilak, and Shubh Vivah with Cloudinary image management.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-600 text-burgundy-950 font-bold text-sm shadow-md transition"
        >
          <Plus className="w-4 h-4" /> Add Ceremony
        </button>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-sm flex items-center gap-2">
          <Check className="w-4 h-4" /> {successMsg}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map((ev) => (
          <div
            key={ev.id || (ev as any)._id}
            className="p-5 rounded-2xl bg-burgundy-950/40 border border-gold-500/20 shadow-xl space-y-4 hover:border-gold-500/40 transition flex flex-col justify-between"
          >
            <div>
              {/* Event Image Banner in Admin */}
              <div className="relative h-40 w-full rounded-xl overflow-hidden bg-black/60 border border-gold-500/30 mb-4">
                <img
                  src={typeof ev.image === 'object' && ev.image ? (ev.image as any).secureUrl || (ev.image as any).url : ev.image}
                  alt={ev.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/wedding-assets/optimized/ceremony-wedding.webp';
                  }}
                />
                <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/70 text-gold-300 border border-gold-500/40">
                  Ceremony #{ev.order}
                </span>
              </div>

              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gold-400">
                    {ev.date}
                  </span>
                  <h3 className="text-lg font-serif font-bold text-white mt-0.5">{ev.title}</h3>
                  {ev.titleHi && <div className="text-xs text-gold-200/80">{ev.titleHi}</div>}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(ev)}
                    className="p-2 rounded-lg bg-gold-500/10 hover:bg-gold-500/20 text-gold-300"
                    title="Edit Ceremony"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(ev.id || (ev as any)._id, ev.title)}
                    className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300"
                    title="Delete Ceremony"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-gray-300 mt-2 line-clamp-2">{ev.description}</p>

              <div className="mt-4 pt-3 border-t border-white/10 space-y-1.5 text-xs text-gray-300">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                  <span>
                    {ev.startTime} – {ev.endTime}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                  <span className="truncate">{ev.venue}</span>
                </div>
                {ev.dressCode && (
                  <div className="text-[11px] text-amber-300/80 font-medium">
                    Dress Code: {ev.dressCode}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Add Modal */}
      {isModalOpen && editingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-burgundy-950 border border-gold-500/40 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl">
            <h3 className="text-xl font-serif font-bold text-white">
              {editingEvent.id || (editingEvent as any)._id ? 'Edit Ceremony' : 'Add New Ceremony'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Image Uploader & Live Preview */}
              <div className="p-4 rounded-xl bg-black/40 border border-gold-500/30 space-y-3">
                <label className="block text-xs font-semibold text-gold-300">
                  Ceremony Event Image (Cloudinary Secure Delivery)
                </label>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {/* Preview Box */}
                  <div className="w-36 h-24 rounded-lg overflow-hidden bg-black/60 border border-gold-500/40 shrink-0 relative">
                    {editingEvent.image ? (
                      <img
                        src={typeof editingEvent.image === 'object' && editingEvent.image ? (editingEvent.image as any).secureUrl || (editingEvent.image as any).url : editingEvent.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/wedding-assets/optimized/ceremony-wedding.webp';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 text-[10px]">
                        <ImageIcon className="w-6 h-6 mb-1 text-gold-500/40" />
                        No image
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-2 w-full">
                    {/* File Upload Input */}
                    <label className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-gold-500/20 hover:bg-gold-500/30 text-gold-300 text-xs font-semibold cursor-pointer border border-gold-500/40 transition">
                      <UploadCloud className="w-4 h-4" />
                      <span>{uploadingImage ? 'Uploading to Cloudinary...' : 'Upload New Image to Cloudinary'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileChange}
                        disabled={uploadingImage}
                        className="hidden"
                      />
                    </label>

                    {/* Direct URL Input */}
                    <input
                      type="text"
                      placeholder="Or enter Cloudinary image URL"
                      value={typeof editingEvent.image === 'object' && editingEvent.image ? (editingEvent.image as any).secureUrl || '' : editingEvent.image || ''}
                      onChange={(e) => setEditingEvent({ ...editingEvent, image: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg bg-black/60 border border-gold-500/30 text-white text-xs"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gold-300 mb-1">Title (English)</label>
                  <input
                    type="text"
                    value={editingEvent.title || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-gold-500/30 text-white text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gold-300 mb-1">शीर्षक (हिंदी)</label>
                  <input
                    type="text"
                    value={editingEvent.titleHi || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, titleHi: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-gold-500/30 text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gold-300 mb-1">Date</label>
                  <input
                    type="date"
                    value={editingEvent.date || '2026-12-11'}
                    onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-gold-500/30 text-white text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gold-300 mb-1">Order</label>
                  <input
                    type="number"
                    value={editingEvent.order || 1}
                    onChange={(e) => setEditingEvent({ ...editingEvent, order: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-gold-500/30 text-white text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gold-300 mb-1">Start Time</label>
                  <input
                    type="text"
                    value={editingEvent.startTime || ''}
                    placeholder="e.g. 10:00 AM"
                    onChange={(e) => setEditingEvent({ ...editingEvent, startTime: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-gold-500/30 text-white text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gold-300 mb-1">End Time</label>
                  <input
                    type="text"
                    value={editingEvent.endTime || ''}
                    placeholder="e.g. 01:00 PM"
                    onChange={(e) => setEditingEvent({ ...editingEvent, endTime: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-gold-500/30 text-white text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gold-300 mb-1">Venue</label>
                  <input
                    type="text"
                    value={editingEvent.venue || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, venue: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-gold-500/30 text-white text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gold-300 mb-1">Dress Code</label>
                  <input
                    type="text"
                    value={editingEvent.dressCode || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, dressCode: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-gold-500/30 text-white text-sm"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gold-300 mb-1">Full Address</label>
                  <input
                    type="text"
                    value={editingEvent.address || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, address: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-gold-500/30 text-white text-sm"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gold-300 mb-1">Google Maps URL</label>
                  <input
                    type="url"
                    value={editingEvent.mapUrl || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, mapUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-gold-500/30 text-white text-sm"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gold-300 mb-1">Description (English)</label>
                  <textarea
                    rows={2}
                    value={editingEvent.description || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-gold-500/30 text-white text-sm"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 text-gray-300 text-sm font-semibold hover:bg-white/20 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || uploadingImage}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-600 text-burgundy-950 text-sm font-bold shadow-md transition disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Ceremony'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

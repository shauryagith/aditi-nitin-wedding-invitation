import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  Check,
  Filter,
  UploadCloud,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Edit2,
} from 'lucide-react';
import { adminService } from '../../../services/api';
import { GalleryPhoto } from '../../../types/wedding';

interface GalleryManagementSectionProps {
  gallery: GalleryPhoto[];
  onRefresh: () => void;
}

export const GalleryManagementSection: React.FC<GalleryManagementSectionProps> = ({
  gallery,
  onRefresh,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<Partial<GalleryPhoto> | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const categories = [
    { key: 'ALL', label: 'All Moments' },
    { key: 'aditi-nitin', label: 'Aditi & Nitin' },
    { key: 'pre-wedding', label: 'Pre-Wedding' },
    { key: 'family-moments', label: 'Family Moments' },
    { key: 'wedding-celebrations', label: 'Wedding Celebrations' },
    { key: 'wedding-traditions', label: 'Wedding Traditions' },
  ];

  const filteredPhotos =
    selectedCategory === 'ALL'
      ? gallery
      : gallery.filter((p) => {
          const c = (p.category || '').toLowerCase();
          if (c === selectedCategory) return true;
          if (selectedCategory === 'aditi-nitin' && c === 'couple') return true;
          if (selectedCategory === 'family-moments' && c === 'family') return true;
          if (selectedCategory === 'wedding-celebrations' && (c === 'wedding' || c === 'celebration')) return true;
          if (selectedCategory === 'wedding-traditions' && ['haldi', 'mehndi', 'tilak', 'ceremony'].includes(c)) return true;
          return false;
        });

  const handleOpenAdd = () => {
    setEditingPhoto({
      title: '',
      titleHi: '',
      caption: '',
      imageUrl: '',
      thumbnailUrl: '',
      category: 'aditi-nitin',
      categoryLabel: 'Aditi & Nitin',
      categoryLabelHi: 'अदिति एवं नितिन',
      order: gallery.length + 1,
      isPublished: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (photo: GalleryPhoto) => {
    setEditingPhoto({ ...photo });
    setIsModalOpen(true);
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingPhoto) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('images', file);
    formData.append('category', 'gallery');
    formData.append('altText', `${editingPhoto.title || 'Gallery Moment'} - Aditi & Nitin`);

    try {
      const res = await adminService.uploadMedia(formData);
      if (res && res.data && res.data.length > 0) {
        const uploaded = res.data[0];
        setEditingPhoto({
          ...editingPhoto,
          imageUrl: uploaded.secureUrl || uploaded.url,
          thumbnailUrl: uploaded.thumbnailUrl || uploaded.secureUrl || uploaded.url,
          publicId: uploaded.publicId,
        });
        setSuccessMsg('Photo uploaded to Cloudinary successfully!');
        setTimeout(() => setSuccessMsg(null), 3000);
      }
    } catch (err: any) {
      alert(`Image upload failed: ${err.message}`);
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPhoto) return;
    setSaving(true);
    try {
      const id = editingPhoto.id || (editingPhoto as any)._id;
      if (id) {
        await adminService.updatePhoto(id, editingPhoto);
        setSuccessMsg('Photo updated successfully!');
      } else {
        await adminService.createPhoto(editingPhoto);
        setSuccessMsg('New photo added to gallery successfully!');
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

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Delete photo "${title}" from gallery?`)) return;
    try {
      await adminService.deletePhoto(id);
      onRefresh();
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  const handleTogglePublish = async (photo: GalleryPhoto) => {
    const id = photo.id || (photo as any)._id;
    if (!id) return;
    try {
      const nextStatus = photo.isPublished === false ? true : false;
      await adminService.updatePhoto(id, { isPublished: nextStatus });
      onRefresh();
    } catch (err: any) {
      alert(`Failed to toggle status: ${err.message}`);
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= gallery.length) return;

    const copy = [...gallery];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;

    const orderMap = copy.map((p, idx) => ({
      id: p.id || (p as any)._id,
      order: idx + 1,
    }));

    try {
      await adminService.reorderPhotos(orderMap);
      onRefresh();
    } catch (err: any) {
      alert(`Reorder failed: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-white flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-gold-400" />
            Wedding Gallery Management
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Curate photographs displayed in the interactive guest gallery lightbox with Cloudinary delivery.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-600 text-burgundy-950 font-bold text-sm shadow-md transition"
        >
          <Plus className="w-4 h-4" /> Add Photo
        </button>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-sm flex items-center gap-2">
          <Check className="w-4 h-4" /> {successMsg}
        </div>
      )}

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <Filter className="w-4 h-4 text-gold-400 shrink-0" />
        {categories.map((c) => (
          <button
            key={c.key}
            onClick={() => setSelectedCategory(c.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              selectedCategory === c.key
                ? 'bg-gold-500 text-burgundy-950'
                : 'bg-black/30 text-gray-300 hover:bg-black/50'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Photos Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredPhotos.map((photo, idx) => (
          <div
            key={photo.id || (photo as any)._id}
            className="group relative rounded-xl overflow-hidden bg-black/40 border border-gold-500/20 shadow-md flex flex-col justify-between hover:border-gold-500/40 transition"
          >
            <div className="aspect-square w-full overflow-hidden bg-black/60 relative">
              <img
                src={photo.thumbnailUrl || photo.imageUrl}
                alt={photo.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/wedding-assets/optimized/gallery-moment-1.webp';
                }}
              />
              <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-black/70 text-gold-300 border border-gold-500/30">
                {photo.categoryLabel || photo.category}
              </span>

              {/* Published Badge */}
              <button
                onClick={() => handleTogglePublish(photo)}
                className={`absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 shadow ${
                  photo.isPublished !== false
                    ? 'bg-emerald-600/90 text-white'
                    : 'bg-rose-600/90 text-white'
                }`}
                title={photo.isPublished !== false ? 'Published (Click to Unpublish)' : 'Unpublished (Click to Publish)'}
              >
                {photo.isPublished !== false ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                <span>{photo.isPublished !== false ? 'Live' : 'Hidden'}</span>
              </button>

              {/* Order Controls */}
              <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/70 rounded p-0.5 border border-white/10 opacity-0 group-hover:opacity-100 transition">
                <button
                  onClick={() => handleMove(idx, 'up')}
                  disabled={idx === 0}
                  className="p-1 hover:text-gold-300 disabled:opacity-30"
                  title="Move Earlier"
                >
                  <ArrowUp className="w-3 h-3" />
                </button>
                <span className="text-[10px] font-bold text-gold-300 px-1">#{photo.order}</span>
                <button
                  onClick={() => handleMove(idx, 'down')}
                  disabled={idx === filteredPhotos.length - 1}
                  className="p-1 hover:text-gold-300 disabled:opacity-30"
                  title="Move Later"
                >
                  <ArrowDown className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className="p-3 space-y-1">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-white truncate max-w-[170px]" title={photo.title}>
                  {photo.title}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleOpenEdit(photo)}
                    className="p-1 rounded text-gold-300 hover:text-white"
                    title="Edit Photo Details"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(photo.id || (photo as any)._id, photo.title)}
                    className="p-1 rounded text-rose-400 hover:text-rose-300"
                    title="Delete Photo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              {photo.caption && (
                <p className="text-[11px] text-gray-400 italic line-clamp-1">{photo.caption}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && editingPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-burgundy-950 border border-gold-500/40 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-serif font-bold text-white">
              {editingPhoto.id || (editingPhoto as any)._id ? 'Edit Gallery Photo' : 'Add Photo to Gallery'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              {/* Image Uploader & Preview */}
              <div className="p-3 rounded-xl bg-black/40 border border-gold-500/30 space-y-2">
                <label className="block text-xs font-semibold text-gold-300">Photo Image</label>
                <div className="flex items-center gap-3">
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-black/60 border border-gold-500/30 shrink-0">
                    {editingPhoto.imageUrl ? (
                      <img
                        src={editingPhoto.thumbnailUrl || editingPhoto.imageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/wedding-assets/optimized/gallery-moment-1.webp';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500">
                        <ImageIcon className="w-6 h-6 text-gold-500/30" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <label className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg bg-gold-500/20 hover:bg-gold-500/30 text-gold-300 text-xs font-semibold cursor-pointer border border-gold-500/40 transition">
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>{uploadingImage ? 'Uploading...' : 'Upload Image to Cloudinary'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileChange}
                        disabled={uploadingImage}
                        className="hidden"
                      />
                    </label>
                    <input
                      type="text"
                      placeholder="Or paste Cloudinary URL"
                      value={editingPhoto.imageUrl || ''}
                      onChange={(e) =>
                        setEditingPhoto({
                          ...editingPhoto,
                          imageUrl: e.target.value,
                          thumbnailUrl: editingPhoto.thumbnailUrl || e.target.value,
                        })
                      }
                      className="w-full px-2.5 py-1 rounded-lg bg-black/60 border border-gold-500/30 text-white text-xs"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gold-300 mb-1">Photo Title (English)</label>
                <input
                  type="text"
                  value={editingPhoto.title || ''}
                  onChange={(e) => setEditingPhoto({ ...editingPhoto, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border border-gold-500/30 text-white text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gold-300 mb-1">शीर्षक (हिंदी)</label>
                <input
                  type="text"
                  value={editingPhoto.titleHi || ''}
                  onChange={(e) => setEditingPhoto({ ...editingPhoto, titleHi: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border border-gold-500/30 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gold-300 mb-1">Caption</label>
                <textarea
                  rows={2}
                  value={editingPhoto.caption || ''}
                  onChange={(e) => setEditingPhoto({ ...editingPhoto, caption: e.target.value })}
                  placeholder="Memorable moment description..."
                  className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-gold-500/30 text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gold-300 mb-1">Category</label>
                  <select
                    value={editingPhoto.category || 'aditi-nitin'}
                    onChange={(e) => {
                      const val = e.target.value;
                      const matched = categories.find((c) => c.key === val);
                      setEditingPhoto({
                        ...editingPhoto,
                        category: val as any,
                        categoryLabel: matched?.label || val,
                      });
                    }}
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-gold-500/30 text-white text-sm"
                  >
                    <option value="aditi-nitin">Aditi & Nitin</option>
                    <option value="pre-wedding">Pre-Wedding</option>
                    <option value="family-moments">Family Moments</option>
                    <option value="wedding-celebrations">Wedding Celebrations</option>
                    <option value="wedding-traditions">Wedding Traditions</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gold-300 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={editingPhoto.order || 1}
                    onChange={(e) => setEditingPhoto({ ...editingPhoto, order: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-gold-500/30 text-white text-sm"
                    required
                  />
                </div>
              </div>

              {/* Published Toggle */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isPublished"
                  checked={editingPhoto.isPublished !== false}
                  onChange={(e) => setEditingPhoto({ ...editingPhoto, isPublished: e.target.checked })}
                  className="w-4 h-4 rounded text-gold-500 focus:ring-gold-400"
                />
                <label htmlFor="isPublished" className="text-xs text-gold-200">
                  Publish in Live Guest Gallery
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 text-gray-300 text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || uploadingImage}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-gold-500 to-amber-600 text-burgundy-950 text-sm font-bold shadow-md disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Photo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

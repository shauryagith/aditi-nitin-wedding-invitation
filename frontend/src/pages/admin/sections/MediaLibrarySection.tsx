import React, { useState, useEffect } from 'react';
import {
  UploadCloud,
  Image as ImageIcon,
  Trash2,
  Edit2,
  Check,
  Search,
  Filter,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { adminService } from '../../../services/api';
import { MediaAssetItem } from '../../../types/wedding';

interface MediaLibrarySectionProps {
  onRefreshStats: () => void;
}

export const MediaLibrarySection: React.FC<MediaLibrarySectionProps> = ({ onRefreshStats }) => {
  const [mediaList, setMediaList] = useState<MediaAssetItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [editingMedia, setEditingMedia] = useState<MediaAssetItem | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const categories = [
    'ALL',
    'welcome',
    'ganesha',
    'hero',
    'bride',
    'groom',
    'couple',
    'our-story',
    'haldi',
    'mehndi',
    'tilak',
    'wedding',
    'family',
    'gallery',
    'venue',
    'decorations',
  ];

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await adminService.getMedia({
        category: selectedCategory !== 'ALL' ? selectedCategory : undefined,
        search: searchTerm || undefined,
      });
      if (res && res.data) {
        setMediaList(res.data);
      }
    } catch (err: any) {
      console.warn('Media fetch notice:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [selectedCategory, searchTerm]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }
    formData.append('category', selectedCategory !== 'ALL' ? selectedCategory : 'gallery');

    try {
      await adminService.uploadMedia(formData);
      setSuccessMsg(`Successfully uploaded ${files.length} asset(s) with WebP conversion!`);
      fetchMedia();
      onRefreshStats();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      alert(`Upload failed: ${err.message}`);
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete image "${name}"?`)) return;
    try {
      await adminService.deleteMedia(id);
      fetchMedia();
      onRefreshStats();
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  const handleUpdateMetadata = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMedia) return;
    try {
      await adminService.updateMediaMetadata(editingMedia._id, {
        category: editingMedia.category,
        sectionPlacement: editingMedia.sectionPlacement,
        altText: editingMedia.altText,
        caption: editingMedia.caption,
      });
      setSuccessMsg('Media metadata updated successfully!');
      setEditingMedia(null);
      fetchMedia();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      alert(`Update failed: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-white flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-gold-400" />
            Media & Asset Library
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Centralized WebP image repository with category tagging and section binding.
          </p>
        </div>

        {/* Upload Button */}
        <label className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-600 text-burgundy-950 font-bold text-sm shadow-md transition cursor-pointer">
          <UploadCloud className="w-4 h-4" />
          {isUploading ? 'Optimizing & Uploading...' : 'Upload Images'}
          <input
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/avif"
            onChange={handleFileUpload}
            disabled={isUploading}
            className="hidden"
          />
        </label>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-sm flex items-center gap-2">
          <Check className="w-4 h-4" /> {successMsg}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-burgundy-950/40 border border-gold-500/20 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1">
          <Filter className="w-4 h-4 text-gold-400 shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-gold-500 text-burgundy-950'
                  : 'bg-black/30 text-gray-300 hover:bg-black/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search assets..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-black/40 border border-gold-500/30 text-white text-xs focus:outline-none focus:border-gold-400"
          />
        </div>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="py-12 text-center text-gold-400 text-sm flex items-center justify-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin" /> Loading assets...
        </div>
      ) : mediaList.length === 0 ? (
        <div className="py-12 text-center rounded-2xl bg-burgundy-950/20 border border-dashed border-gold-500/20 text-gray-400 text-sm">
          No media found for the selected category. Upload images to populate this section.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {mediaList.map((asset) => (
            <div
              key={asset._id}
              className="group relative rounded-xl overflow-hidden bg-black/40 border border-gold-500/20 hover:border-gold-500/50 transition shadow-md flex flex-col justify-between"
            >
              <div className="aspect-square w-full overflow-hidden bg-black/60 relative">
                <img
                  src={asset.thumbnailUrl || asset.webpUrl || asset.url}
                  alt={asset.altText}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  loading="lazy"
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-black/70 text-gold-300 backdrop-blur-sm">
                  {asset.category}
                </span>
                {asset.storageProvider === 'cloudinary' ? (
                  <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-semibold bg-sky-500/80 text-white backdrop-blur-sm shadow">
                    Cloudinary
                  </span>
                ) : (
                  <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-semibold bg-emerald-600/80 text-white backdrop-blur-sm shadow">
                    Local
                  </span>
                )}
              </div>

              <div className="p-2.5">
                <div className="text-xs font-semibold text-white truncate" title={asset.originalName}>
                  {asset.originalName}
                </div>
                <div className="text-[10px] text-gray-400 mt-0.5 truncate">
                  {asset.width && asset.height ? `${asset.width}x${asset.height} • ` : ''}
                  {Math.round(asset.size / 1024)} KB
                </div>

                <div className="flex items-center justify-between pt-2 mt-2 border-t border-white/10">
                  <button
                    onClick={() => setEditingMedia(asset)}
                    className="p-1 rounded text-gold-300 hover:text-gold-200"
                    title="Edit Metadata"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <a
                    href={asset.webpUrl || asset.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1 rounded text-gray-400 hover:text-white"
                    title="View Fullsize"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    onClick={() => handleDelete(asset._id, asset.originalName)}
                    className="p-1 rounded text-rose-400 hover:text-rose-300"
                    title="Delete Asset"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Metadata Edit Modal */}
      {editingMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-burgundy-950 border border-gold-500/40 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-serif font-bold text-white">Edit Image Metadata</h3>

            <form onSubmit={handleUpdateMetadata} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gold-300 mb-1">Category</label>
                <select
                  value={editingMedia.category}
                  onChange={(e) => setEditingMedia({ ...editingMedia, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border border-gold-500/30 text-white text-sm"
                >
                  {categories
                    .filter((c) => c !== 'ALL')
                    .map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gold-300 mb-1">Section Placement</label>
                <input
                  type="text"
                  placeholder="e.g. welcome-modal, hero-slide-1"
                  value={editingMedia.sectionPlacement || ''}
                  onChange={(e) => setEditingMedia({ ...editingMedia, sectionPlacement: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border border-gold-500/30 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gold-300 mb-1">Alt Text</label>
                <input
                  type="text"
                  value={editingMedia.altText}
                  onChange={(e) => setEditingMedia({ ...editingMedia, altText: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border border-gold-500/30 text-white text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gold-300 mb-1">Caption</label>
                <input
                  type="text"
                  value={editingMedia.caption || ''}
                  onChange={(e) => setEditingMedia({ ...editingMedia, caption: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border border-gold-500/30 text-white text-sm"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingMedia(null)}
                  className="px-4 py-2 rounded-xl bg-white/10 text-gray-300 text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-gold-500 to-amber-600 text-burgundy-950 text-sm font-bold shadow-md"
                >
                  Update Metadata
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

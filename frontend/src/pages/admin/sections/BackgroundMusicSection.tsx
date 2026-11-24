import React, { useState, useEffect, useRef } from 'react';
import {
  Music,
  UploadCloud,
  Play,
  Pause,
  Volume2,
  Trash2,
  Check,
  Star,
  RefreshCw,
  AlertCircle,
  FileAudio,
  Sliders,
  CheckCircle2,
  X,
} from 'lucide-react';
import { adminService } from '../../../services/api';
import { MusicTrackItem } from '../../../types/wedding';

interface BackgroundMusicSectionProps {
  onRefreshStats: () => void;
}

export const BackgroundMusicSection: React.FC<BackgroundMusicSectionProps> = ({
  onRefreshStats,
}) => {
  const [tracks, setTracks] = useState<MusicTrackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Staged File Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [trackTitle, setTrackTitle] = useState('');
  const [trackArtist, setTrackArtist] = useState('Traditional Shehnai & Sitar');
  const [trackVolume, setTrackVolume] = useState(0.65);
  const [setAsActive, setSetAsActive] = useState(true);
  const [isDragging, setIsDragging] = useState(false);

  // Audio preview state
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const fetchTracks = async () => {
    setLoading(true);
    try {
      const res = await adminService.getMusicTracks();
      if (res && res.data) {
        setTracks(res.data);
      }
    } catch (err: any) {
      console.warn('Tracks fetch notice:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTracks();
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleTogglePlay = (track: MusicTrackItem) => {
    if (playingTrackId === track._id) {
      audioRef.current?.pause();
      setPlayingTrackId(null);
    } else {
      if (!audioRef.current) {
        audioRef.current = new Audio();
      }
      const rawUrl = track.secureUrl || track.fileUrl;
      const playUrl = rawUrl.startsWith('http')
        ? rawUrl
        : `${import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || ''}${rawUrl}`;
      audioRef.current.src = playUrl;
      audioRef.current.volume = track.volume || 0.65;
      audioRef.current.play().catch((err) => {
        console.warn('Playback error:', err);
        setErrorMsg('Could not preview track. Format may not be supported by this browser.');
      });
      setPlayingTrackId(track._id);
      audioRef.current.onended = () => setPlayingTrackId(null);
      audioRef.current.onerror = () => {
        setPlayingTrackId(null);
        setErrorMsg('Audio preview failed to load from source URL.');
      };
    }
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    const cleanTitle = file.name
      .replace(/\.[^/.]+$/, '')
      .replace(/[-_]/g, ' ')
      .trim();
    setTrackTitle(cleanTitle);
    setErrorMsg(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (!file.type.startsWith('audio/') && !file.name.match(/\.(mp3|m4a|aac|ogg|wav|webm|flac)$/i)) {
        setErrorMsg('Please select a valid audio file (MP3, M4A, AAC, WAV, OGG, FLAC).');
        return;
      }
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setErrorMsg('Please select an audio file first.');
      return;
    }

    setUploading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const formData = new FormData();
    formData.append('audio', selectedFile);
    formData.append('title', trackTitle.trim() || selectedFile.name.replace(/\.[^/.]+$/, ''));
    formData.append('artist', trackArtist.trim() || 'Traditional Shehnai & Sitar');
    formData.append('volume', String(trackVolume));
    formData.append('isDefault', setAsActive ? 'true' : 'false');

    try {
      const res = await adminService.uploadMusicTrack(formData);
      if (res && res.success === false) {
        throw new Error(res.message || 'Audio upload failed.');
      }
      const uploadedTitle = trackTitle.trim() || selectedFile.name.replace(/\.[^/.]+$/, '');
      setSuccessMsg(`"${uploadedTitle}" uploaded successfully and set as ${setAsActive ? 'Active Background Music' : 'Library Track'}!`);
      setSelectedFile(null);
      setTrackTitle('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      await fetchTracks();
      onRefreshStats();
      setTimeout(() => setSuccessMsg(null), 8000);
    } catch (err: any) {
      console.error('Audio upload failed:', err);
      setErrorMsg(err.message || 'Audio upload failed. Please verify the file is a valid audio format and the server is connected.');
    } finally {
      setUploading(false);
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      setErrorMsg(null);
      await adminService.setDefaultMusicTrack(id);
      setSuccessMsg('Default wedding background track updated!');
      fetchTracks();
      onRefreshStats();
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setErrorMsg(`Failed to set default track: ${err.message}`);
      setTimeout(() => setErrorMsg(null), 5000);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Delete audio track "${title}"?`)) return;
    try {
      setErrorMsg(null);
      if (playingTrackId === id) {
        audioRef.current?.pause();
        setPlayingTrackId(null);
      }
      await adminService.deleteMusicTrack(id);
      setSuccessMsg(`Deleted track "${title}".`);
      fetchTracks();
      onRefreshStats();
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setErrorMsg(`Delete failed: ${err.message}`);
      setTimeout(() => setErrorMsg(null), 5000);
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Audio Track';
    const mb = bytes / (1024 * 1024);
    if (mb >= 1) {
      return `${mb.toFixed(1)} MB`;
    }
    return `${Math.round(bytes / 1024)} KB`;
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-white flex items-center gap-2">
            <Music className="w-6 h-6 text-gold-400" />
            Background Music Management
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Upload traditional Shehnai, Sitar, or ceremonial wedding tracks for automatic background playback on the website.
          </p>
        </div>

        {/* Quick Upload Trigger */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-600 text-burgundy-950 font-bold text-sm shadow-md transition cursor-pointer self-start sm:self-auto"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Select Audio File</span>
        </button>
      </div>

      {/* Hidden File Input with full OS audio extensions filter */}
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*,.mp3,.m4a,.aac,.ogg,.wav,.flac"
        onChange={handleInputChange}
        disabled={uploading}
        className="hidden"
      />

      {/* Notifications */}
      {uploading && (
        <div className="p-4 rounded-xl bg-gold-500/15 border border-gold-500/40 text-gold-300 text-sm flex items-center gap-3 animate-pulse shadow-lg">
          <RefreshCw className="w-5 h-5 animate-spin text-gold-400 shrink-0" />
          <div>
            <p className="font-semibold text-white">Uploading track to Cloud Storage...</p>
            <p className="text-xs text-gold-400/90 mt-0.5">Processing audio and creating high-quality streaming URL. Please wait a moment.</p>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-sm flex items-start justify-between gap-3 shadow-lg">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-white">Upload Error</p>
              <p className="text-xs text-rose-200 mt-0.5">{errorMsg}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setErrorMsg(null)}
            className="p-1 rounded text-rose-400 hover:text-white hover:bg-rose-500/20 transition cursor-pointer"
            title="Dismiss error"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-sm flex items-start justify-between gap-3 shadow-lg">
          <div className="flex items-start gap-2.5">
            <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-white">Music Uploaded Successfully</p>
              <p className="text-xs text-emerald-200 mt-0.5">{successMsg}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSuccessMsg(null)}
            className="p-1 rounded text-emerald-400 hover:text-white hover:bg-emerald-500/20 transition cursor-pointer"
            title="Dismiss notice"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Upload & Staging Form / Drag & Drop Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`p-6 rounded-2xl border-2 transition-all duration-200 ${
          isDragging
            ? 'border-gold-400 bg-gold-500/15 scale-[1.01]'
            : selectedFile
            ? 'border-gold-500/50 bg-burgundy-950/60 shadow-xl'
            : 'border-dashed border-gold-500/30 bg-burgundy-950/30 hover:border-gold-500/50'
        }`}
      >
        {!selectedFile ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center py-6 cursor-pointer text-center group"
          >
            <div className="w-14 h-14 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 group-hover:scale-110 group-hover:bg-gold-500/20 transition-all mb-3">
              <UploadCloud className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-white font-serif">
              Click to browse or drag & drop wedding music file
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Supports MP3, M4A, AAC, WAV, OGG, FLAC (up to 50MB)
            </p>
            <span className="mt-3 px-4 py-1.5 rounded-lg bg-gold-500/20 border border-gold-500/40 text-gold-300 text-xs font-semibold">
              Browse Audio Files
            </span>
          </div>
        ) : (
          <form onSubmit={handleUploadSubmit} className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gold-500/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gold-500/20 border border-gold-500/40 flex items-center justify-center text-gold-400">
                  <FileAudio className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-sm font-bold text-white block">{selectedFile.name}</span>
                  <span className="text-xs text-gold-400/90 font-mono">
                    {formatFileSize(selectedFile.size)} • {selectedFile.type || 'audio/mpeg'}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedFile(null);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition"
                title="Cancel selection"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gold-400 mb-1">
                  Track Title *
                </label>
                <input
                  type="text"
                  value={trackTitle}
                  onChange={(e) => setTrackTitle(e.target.value)}
                  placeholder="e.g. Mangalyam Tantunanena (Shehnai)"
                  required
                  className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-gold-500/30 text-white text-sm focus:border-gold-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gold-400 mb-1">
                  Artist / Performer
                </label>
                <input
                  type="text"
                  value={trackArtist}
                  onChange={(e) => setTrackArtist(e.target.value)}
                  placeholder="e.g. Traditional Shehnai & Sitar"
                  className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-gold-500/30 text-white text-sm focus:border-gold-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={setAsActive}
                  onChange={(e) => setSetAsActive(e.target.checked)}
                  className="w-4 h-4 rounded text-gold-500 focus:ring-gold-400 border-gold-500/40 bg-black/40"
                />
                <span className="text-xs text-champagne font-semibold flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-gold-400 fill-gold-400" />
                  Set as Active Background Music immediately upon upload
                </span>
              </label>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  disabled={uploading}
                  className="px-4 py-2 rounded-xl border border-white/20 text-gray-300 hover:text-white text-xs font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex items-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-600 text-burgundy-950 font-bold text-xs tracking-wider shadow-lg transition disabled:opacity-50"
                >
                  {uploading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Uploading to Cloud...</span>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>Confirm & Upload Track</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>

      {/* Tracks List Header */}
      <div className="flex items-center justify-between pt-2">
        <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
          <span>Uploaded Wedding Tracks</span>
          <span className="px-2 py-0.5 rounded-full text-xs bg-gold-500/20 text-gold-300 border border-gold-500/30">
            {tracks.length}
          </span>
        </h3>
        <button
          type="button"
          onClick={fetchTracks}
          className="text-xs text-gold-400 hover:text-gold-300 flex items-center gap-1 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Tracks List */}
      <div className="space-y-3">
        {loading ? (
          <div className="py-12 text-center text-gold-400 text-sm flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin" /> Loading music tracks...
          </div>
        ) : tracks.length === 0 ? (
          <div className="p-8 rounded-2xl bg-burgundy-950/20 border border-dashed border-gold-500/20 text-center text-gray-400 text-sm space-y-3">
            <p>No custom music tracks uploaded yet. The website is currently using the default Indian Shehnai melody.</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 rounded-xl bg-gold-500/20 hover:bg-gold-500/30 text-gold-300 border border-gold-500/40 text-xs font-semibold inline-flex items-center gap-1.5 transition"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Upload Wedding Track Now</span>
            </button>
          </div>
        ) : (
          tracks.map((track) => (
            <div
              key={track._id}
              className={`p-4 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                track.isDefault
                  ? 'bg-gold-500/15 border-gold-500/60 shadow-xl shadow-gold-500/10'
                  : 'bg-burgundy-950/40 border-gold-500/20 hover:border-gold-500/30'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <button
                  type="button"
                  onClick={() => handleTogglePlay(track)}
                  className={`w-11 h-11 rounded-full shrink-0 flex items-center justify-center transition shadow-md ${
                    playingTrackId === track._id
                      ? 'bg-gold-500 text-burgundy-950 scale-105 ring-2 ring-gold-400'
                      : 'bg-black/50 text-gold-400 hover:bg-gold-500/20 border border-gold-500/30'
                  }`}
                  title={playingTrackId === track._id ? 'Pause Preview' : 'Play Preview'}
                >
                  {playingTrackId === track._id ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5 ml-0.5" />
                  )}
                </button>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-white font-serif truncate max-w-xs sm:max-w-md">
                      {track.title}
                    </span>
                    {track.isDefault && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-gold-500 text-burgundy-950 flex items-center gap-1 shadow-sm">
                        <Star className="w-3 h-3 fill-current" /> Active Default Track
                      </span>
                    )}
                    {track.storageProvider === 'cloudinary' ? (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                        Cloudinary
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Local Storage
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-400 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span>{track.artist}</span>
                    <span>•</span>
                    <span>{formatFileSize(track.fileSize)}</span>
                    <span>•</span>
                    <span className="uppercase text-[10px] text-gold-400/80 font-mono">
                      {track.format || 'audio'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                {!track.isDefault ? (
                  <button
                    type="button"
                    onClick={() => handleSetDefault(track._id)}
                    className="px-3.5 py-1.5 rounded-lg bg-gold-500/10 hover:bg-gold-500/25 text-gold-300 border border-gold-500/40 text-xs font-semibold transition flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-gold-400" />
                    <span>Set as Active</span>
                  </button>
                ) : (
                  <span className="text-xs text-gold-400 font-semibold flex items-center gap-1 px-2 py-1">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Playing on Site</span>
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => handleDelete(track._id, track.title)}
                  className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 transition"
                  title="Delete Track"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

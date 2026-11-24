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
import { weddingSyncManager } from '../../../utils/dataSync';
import { MusicTrackItem } from '../../../types/wedding';

export type UploadState = 'idle' | 'selecting' | 'validating' | 'uploading' | 'saving' | 'success' | 'error';

interface BackgroundMusicSectionProps {
  onRefreshStats: () => void;
}

const SUPPORTED_AUDIO_EXTENSIONS = ['mp3', 'wav', 'm4a', 'aac', 'ogg', 'flac', 'webm'];
const MAX_AUDIO_SIZE_BYTES = 50 * 1024 * 1024; // 50MB

export const BackgroundMusicSection: React.FC<BackgroundMusicSectionProps> = ({
  onRefreshStats,
}) => {
  const [tracks, setTracks] = useState<MusicTrackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [correlationId, setCorrelationId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isBusy = uploadState === 'validating' || uploadState === 'uploading' || uploadState === 'saving';

  // Staged File Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [stagedPreviewUrl, setStagedPreviewUrl] = useState<string | null>(null);
  const [trackTitle, setTrackTitle] = useState('');
  const [trackArtist, setTrackArtist] = useState('Traditional Shehnai & Sitar');
  const [trackVolume, setTrackVolume] = useState(0.65);
  const [setAsActive, setSetAsActive] = useState(true);
  const [isDragging, setIsDragging] = useState(false);

  // Audio preview state
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const fetchTracks = async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const res = await adminService.getMusicTracks();
      if (res && res.data) {
        setTracks(res.data);
      }
    } catch (err: any) {
      console.warn('Tracks fetch notice:', err.message);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchTracks(true);

    // Auto-sync tracks list when Socket.IO or background updates occur
    const unsubscribeSync = weddingSyncManager.subscribe((entity) => {
      if (entity === 'music' || entity === '/admin/music' || entity === 'all') {
        fetchTracks(false);
      }
    });

    return () => {
      unsubscribeSync();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (stagedPreviewUrl) {
        URL.revokeObjectURL(stagedPreviewUrl);
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

  /**
   * Comprehensive client-side validation:
   * 1. File existence & non-zero size
   * 2. Size limit (50MB)
   * 3. Extension & MIME type
   * 4. Magic bytes inspection (rejects disguised executable/image files)
   */
  const validateAndStageFile = async (file: File) => {
    setUploadState('validating');
    setErrorMsg(null);

    // 1. Check empty file
    if (file.size === 0) {
      setErrorMsg('The selected audio file is empty (0 bytes). Please choose a valid file.');
      setUploadState('error');
      return;
    }

    // 2. Check maximum size (50MB)
    if (file.size > MAX_AUDIO_SIZE_BYTES) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      setErrorMsg(`Audio file size (${sizeMb} MB) exceeds the maximum allowed 50 MB limit.`);
      setUploadState('error');
      return;
    }

    // 3. Check extension
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    const hasValidExt = SUPPORTED_AUDIO_EXTENSIONS.includes(ext);
    const hasAudioMime = file.type.startsWith('audio/') || file.type === 'application/ogg' || file.type === 'video/ogg';

    if (!hasValidExt && !hasAudioMime) {
      setErrorMsg('Unsupported format. Please select an audio file (MP3, WAV, M4A, AAC, OGG, FLAC, WEBM).');
      setUploadState('error');
      return;
    }

    // 4. Magic bytes validation (guard against renamed executables, zip, or images)
    try {
      const headerBuffer = await file.slice(0, 16).arrayBuffer();
      const bytes = new Uint8Array(headerBuffer);

      // Check known non-audio headers
      const isExe = bytes.length >= 2 && bytes[0] === 0x4d && bytes[1] === 0x5a; // 'MZ'
      const isElf = bytes.length >= 4 && bytes[0] === 0x7f && bytes[1] === 0x45 && bytes[2] === 0x4c && bytes[3] === 0x46; // ELF
      const isPng = bytes.length >= 8 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47;
      const isJpeg = bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
      const isGif = bytes.length >= 4 && bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x38;

      if (isExe || isElf || isPng || isJpeg || isGif) {
        setErrorMsg('The selected file does not appear to be a valid audio file. Corrupted or disguised files are not supported.');
        setUploadState('error');
        return;
      }
    } catch {
      // If slice fails, proceed with standard MIME validation
    }

    // Revoke previous staged preview if any
    if (stagedPreviewUrl) {
      URL.revokeObjectURL(stagedPreviewUrl);
    }

    const previewUrl = URL.createObjectURL(file);
    setStagedPreviewUrl(previewUrl);
    setSelectedFile(file);
    setUploadState('selecting');

    const cleanTitle = file.name
      .replace(/\.[^/.]+$/, '')
      .replace(/[-_]/g, ' ')
      .trim();
    setTrackTitle(cleanTitle);
  };

  const handleClearStaged = () => {
    if (stagedPreviewUrl) {
      URL.revokeObjectURL(stagedPreviewUrl);
      setStagedPreviewUrl(null);
    }
    setSelectedFile(null);
    setTrackTitle('');
    setCorrelationId(null);
    setErrorMsg(null);
    setUploadState('idle');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndStageFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      validateAndStageFile(file);
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

  const handleUploadSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isBusy) return;

    if (!selectedFile) {
      setErrorMsg('Please select an audio file first.');
      setUploadState('error');
      return;
    }

    const cid = `music-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    setCorrelationId(cid);
    setUploadState('uploading');
    setErrorMsg(null);
    setSuccessMsg(null);

    const savingTimer = setTimeout(() => {
      setUploadState((curr) => (curr === 'uploading' ? 'saving' : curr));
    }, 1200);

    const formData = new FormData();
    formData.append('audio', selectedFile);
    formData.append('title', trackTitle.trim() || selectedFile.name.replace(/\.[^/.]+$/, ''));
    formData.append('artist', trackArtist.trim() || 'Traditional Shehnai & Sitar');
    formData.append('volume', String(trackVolume));
    formData.append('isDefault', setAsActive ? 'true' : 'false');

    try {
      const res = await adminService.uploadMusicTrack(formData, cid);
      clearTimeout(savingTimer);
      if (res && res.success === false) {
        throw new Error(res.message || 'Audio upload failed.');
      }
      const uploadedTitle = trackTitle.trim() || selectedFile.name.replace(/\.[^/.]+$/, '');
      setSuccessMsg(`"${uploadedTitle}" uploaded successfully and set as ${setAsActive ? 'Active Background Music' : 'Library Track'}!`);
      setUploadState('success');
      handleClearStaged();
      await fetchTracks(false);
      console.log(`[UploadDiagnostic][${res?.correlationId || cid}][Stage 12: Admin music list refreshed]`);
      onRefreshStats();
      setTimeout(() => {
        setSuccessMsg(null);
        setUploadState('idle');
      }, 8000);
    } catch (err: any) {
      clearTimeout(savingTimer);
      console.error(`[UploadDiagnostic][${cid}][Frontend Upload Error]:`, err);
      // Preserve the staged file so the admin can retry without re-selecting
      setUploadState('error');
      setCorrelationId(err.correlationId || cid);
      setErrorMsg(err.message || 'Audio upload failed. Please verify the file is a valid audio format and the server is connected.');
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      setErrorMsg(null);
      await adminService.setDefaultMusicTrack(id);
      setSuccessMsg('Default wedding background track updated!');
      fetchTracks(false);
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
      fetchTracks(false);
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
        disabled={isBusy}
        className="hidden"
      />

      {/* Notifications */}
      {isBusy && (
        <div className="p-4 rounded-xl bg-gold-500/15 border border-gold-500/40 text-gold-300 text-sm flex items-center gap-3 animate-pulse shadow-lg">
          <RefreshCw className="w-5 h-5 animate-spin text-gold-400 shrink-0" />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-white">
                {uploadState === 'validating' && 'Validating Audio File...'}
                {uploadState === 'uploading' && 'Uploading Track to Backend...'}
                {uploadState === 'saving' && 'Processing Cloudinary & Database Sync...'}
              </p>
              {correlationId && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40 text-gold-400 border border-gold-500/30">
                  ID: {correlationId}
                </span>
              )}
            </div>
            <p className="text-xs text-gold-400/90 mt-0.5">
              {uploadState === 'validating' && 'Verifying audio integrity, extensions, and audio header magic bytes.'}
              {uploadState === 'uploading' && 'Streaming multipart audio payload to server.'}
              {uploadState === 'saving' && 'Uploading high-fidelity audio to Cloudinary CDN and persisting in MongoDB Atlas.'}
            </p>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-sm flex items-start justify-between gap-3 shadow-lg">
          <div className="flex items-start gap-2.5 flex-1">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold text-white">Upload Error</p>
                {correlationId && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40 text-rose-300 border border-rose-500/30">
                    ID: {correlationId}
                  </span>
                )}
              </div>
              <p className="text-xs text-rose-200 mt-1">{errorMsg}</p>
              {selectedFile && (
                <div className="mt-2.5 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleUploadSubmit()}
                    disabled={isBusy}
                    className="px-3 py-1.5 rounded-lg bg-rose-500/30 hover:bg-rose-500/50 text-white font-semibold text-xs transition cursor-pointer flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Retry Upload</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleClearStaged}
                    className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 font-semibold text-xs transition cursor-pointer"
                  >
                    Clear Staged File
                  </button>
                </div>
              )}
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
                onClick={handleClearStaged}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition"
                title="Cancel selection"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Audio Playback Preview for staged file */}
            {stagedPreviewUrl && (
              <div className="p-3 rounded-xl bg-black/40 border border-gold-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-gold-400 shrink-0">
                  <Volume2 className="w-4 h-4 text-gold-400" />
                  <span>Playback Preview:</span>
                </div>
                <audio
                  src={stagedPreviewUrl}
                  controls
                  controlsList="nodownload"
                  className="w-full sm:max-w-md h-8 accent-gold-500 rounded"
                />
              </div>
            )}

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
                  onClick={handleClearStaged}
                  disabled={isBusy}
                  className="px-4 py-2 rounded-xl border border-white/20 text-gray-300 hover:text-white text-xs font-semibold transition disabled:opacity-40"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isBusy || !selectedFile}
                  className="flex items-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-600 text-burgundy-950 font-bold text-xs tracking-wider shadow-lg transition disabled:opacity-50 cursor-pointer"
                >
                  {isBusy ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>
                        {uploadState === 'validating' && 'Validating...'}
                        {uploadState === 'uploading' && 'Uploading Stream...'}
                        {uploadState === 'saving' && 'Saving to Cloud & DB...'}
                      </span>
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
          onClick={() => fetchTracks(true)}
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

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

  // Audio preview state
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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
      audioRef.current.volume = track.volume || 0.5;
      audioRef.current.play().catch(() => {});
      setPlayingTrackId(track._id);
      audioRef.current.onended = () => setPlayingTrackId(null);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const formData = new FormData();
    formData.append('audio', file);
    formData.append('title', file.name.replace(/\.[^/.]+$/, ''));
    formData.append('artist', 'Traditional Shehnai & Sitar');
    formData.append('volume', '0.5');
    formData.append('isDefault', tracks.length === 0 ? 'true' : 'false');

    try {
      const res = await adminService.uploadMusicTrack(formData);
      if (res && res.success === false) {
        throw new Error(res.message || 'Audio upload failed.');
      }
      setSuccessMsg('Audio track uploaded successfully!');
      fetchTracks();
      onRefreshStats();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      console.error('Audio upload failed:', err);
      setErrorMsg(err.message || 'Audio upload failed.');
      setTimeout(() => setErrorMsg(null), 6000);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      setErrorMsg(null);
      await adminService.setDefaultMusicTrack(id);
      setSuccessMsg('Default wedding background track updated!');
      fetchTracks();
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
      fetchTracks();
      onRefreshStats();
    } catch (err: any) {
      setErrorMsg(`Delete failed: ${err.message}`);
      setTimeout(() => setErrorMsg(null), 5000);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-white flex items-center gap-2">
            <Music className="w-6 h-6 text-gold-400" />
            Background Music Management
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Upload traditional Shehnai, Sitar, or ceremonial wedding tracks for the guest music player.
          </p>
        </div>

        {/* Upload Audio Button */}
        <label className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-600 text-burgundy-950 font-bold text-sm shadow-md transition cursor-pointer">
          <UploadCloud className="w-4 h-4" />
          {uploading ? 'Uploading Audio...' : 'Upload Music Track'}
          <input
            type="file"
            accept="audio/mp3,audio/mpeg,audio/m4a,audio/aac,audio/ogg,audio/wav"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" /> {errorMsg}
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-sm flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0" /> {successMsg}
        </div>
      )}

      {/* Tracks List */}
      <div className="space-y-3">
        {loading ? (
          <div className="py-12 text-center text-gold-400 text-sm flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin" /> Loading music tracks...
          </div>
        ) : tracks.length === 0 ? (
          <div className="p-8 rounded-2xl bg-burgundy-950/20 border border-dashed border-gold-500/20 text-center text-gray-400 text-sm">
            No music tracks uploaded yet. The website is currently using the default Indian Shehnai instrumental.
          </div>
        ) : (
          tracks.map((track) => (
            <div
              key={track._id}
              className={`p-4 rounded-2xl border transition flex items-center justify-between gap-4 ${
                track.isDefault
                  ? 'bg-gold-500/10 border-gold-500/40 shadow-lg'
                  : 'bg-burgundy-950/40 border-gold-500/20 hover:border-gold-500/30'
              }`}
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleTogglePlay(track)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition shadow-md ${
                    playingTrackId === track._id
                      ? 'bg-gold-500 text-burgundy-950'
                      : 'bg-black/40 text-gold-400 hover:bg-gold-500/20'
                  }`}
                  title={playingTrackId === track._id ? 'Pause' : 'Play Preview'}
                >
                  {playingTrackId === track._id ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5 ml-0.5" />
                  )}
                </button>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white font-serif">{track.title}</span>
                    {track.storageProvider === 'cloudinary' ? (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                        Cloudinary
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Local
                      </span>
                    )}
                    {track.isDefault && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-gold-500/20 text-gold-300 border border-gold-500/30 flex items-center gap-1">
                        <Star className="w-3 h-3 fill-gold-400 text-gold-400" /> Active Default
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {track.artist} • Volume: {Math.round(track.volume * 100)}%
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {!track.isDefault && (
                  <button
                    onClick={() => handleSetDefault(track._id)}
                    className="px-3 py-1.5 rounded-lg bg-gold-500/10 hover:bg-gold-500/20 text-gold-300 border border-gold-500/30 text-xs font-semibold transition"
                  >
                    Set as Active
                  </button>
                )}
                <button
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

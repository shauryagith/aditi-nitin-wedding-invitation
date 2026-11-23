import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { WEDDING_CONFIG } from '../config/wedding.config';
import { weddingService } from '../services/api';
import { weddingSyncManager } from '../utils/dataSync';

interface AudioContextType {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  currentTrack: { title: string; artist: string } | null;
  togglePlay: () => void;
  toggleMute: () => void;
  setVolume: (val: number) => void;
  startAudioWithUserGesture: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolumeState] = useState<number>(0.65);
  const [currentTrack, setCurrentTrack] = useState<{ title: string; artist: string } | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const synthIntervalRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Fallback Web Audio API Melody Generator (Indian Shehnai / Sitar style Raag)
  const startFallbackSynth = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioCtx();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Traditional Pentatonic Auspicious Notes (Sa, Re, Ga, Pa, Dha)
      const notes = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25];
      let step = 0;

      if (synthIntervalRef.current) clearInterval(synthIntervalRef.current);

      synthIntervalRef.current = window.setInterval(() => {
        if (!isPlaying && !audioRef.current?.paused) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        const freq = notes[step % notes.length];
        step = (step + 1 + Math.floor(Math.random() * 2)) % notes.length;

        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(isMuted ? 0 : volume * 0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 1.2);
      }, 700);
    } catch {
      // Ignored
    }
  };

  const stopFallbackSynth = () => {
    if (synthIntervalRef.current) {
      clearInterval(synthIntervalRef.current);
      synthIntervalRef.current = null;
    }
  };

  useEffect(() => {
    const audio = new Audio(WEDDING_CONFIG.music.audioUrl);
    audio.loop = true;
    audio.volume = volume;
    audioRef.current = audio;

    const handleEnded = () => setIsPlaying(false);
    const handleError = () => {
      console.warn('Audio URL fallback to Web Audio synthesizer');
      if (isPlaying) startFallbackSynth();
    };

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    // Fetch dynamic background music from backend CMS if available
    const fetchActiveTrack = () => {
      weddingService
        .getActiveMusic()
        .then((track) => {
          if (track && (track.fileUrl || track.secureUrl) && audioRef.current) {
            setCurrentTrack({
              title: track.title || WEDDING_CONFIG.music.title,
              artist: track.artist || WEDDING_CONFIG.music.artist,
            });
            const rawUrl = track.secureUrl || track.fileUrl;
            const resolvedUrl = rawUrl.startsWith('http')
              ? rawUrl
              : `${import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || ''}${rawUrl}`;
            if (audioRef.current.src !== resolvedUrl) {
              const wasPlaying = isPlaying;
              audioRef.current.src = resolvedUrl;
              if (wasPlaying) {
                audioRef.current.play().catch(() => {});
              }
            }
            if (track.volume !== undefined) {
              audioRef.current.volume = track.volume;
              setVolumeState(track.volume);
            }
          }
        })
        .catch(() => {});
    };

    fetchActiveTrack();
    const unsubscribeSync = weddingSyncManager.subscribe((entity) => {
      if (entity === 'music' || entity === 'all') {
        fetchActiveTrack();
      }
    });

    return () => {
      unsubscribeSync();
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.pause();
      stopFallbackSynth();
      audioRef.current = null;
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      stopFallbackSynth();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          startFallbackSynth();
          setIsPlaying(true);
        });
    }
  };

  const toggleMute = () => {
    const newMute = !isMuted;
    setIsMuted(newMute);
    if (audioRef.current) {
      audioRef.current.muted = newMute;
    }
  };

  const setVolume = (val: number) => {
    const clamped = Math.max(0, Math.min(1, val));
    setVolumeState(clamped);
    if (audioRef.current) {
      audioRef.current.volume = clamped;
    }
  };

  const startAudioWithUserGesture = () => {
    if (isPlaying) return;
    if (audioRef.current) {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          startFallbackSynth();
          setIsPlaying(true);
        });
    }
  };

  return (
    <AudioContext.Provider
      value={{
        isPlaying,
        isMuted,
        volume,
        currentTrack,
        togglePlay,
        toggleMute,
        setVolume,
        startAudioWithUserGesture,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = (): AudioContextType => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};

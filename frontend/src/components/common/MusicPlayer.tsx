import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Play, Pause, Music, Sliders } from 'lucide-react';
import { useAudio } from '../../context/AudioContext';
import { WEDDING_CONFIG } from '../../config/wedding.config';
import { useLanguage } from '../../context/LanguageContext';

export const MusicPlayer: React.FC = () => {
  const { isPlaying, isMuted, volume, currentTrack, togglePlay, toggleMute, setVolume } = useAudio();
  const { language } = useLanguage();
  const [showControls, setShowControls] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowControls(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-40 flex flex-col items-start">
      {/* Expanded Music Controls Popup */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-3 w-64 xs:w-72 rounded-2xl bg-deepBurgundy/95 border-2 border-royalGold p-3.5 xs:p-4 shadow-2xl backdrop-blur-xl text-ivory gold-border-card space-y-3"
          >
            {/* Header / Track Name */}
            <div className="flex items-center gap-2.5 pb-2 border-b border-royalGold/30">
              <div className="w-8 h-8 rounded-full bg-royalGold/20 border border-royalGold flex items-center justify-center text-royalGold flex-shrink-0">
                <Music className="w-4 h-4" />
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-champagne truncate">
                  {currentTrack?.title || WEDDING_CONFIG.music.title}
                </p>
                <p className="text-[10px] text-ivory/70 truncate">
                  {currentTrack?.artist || WEDDING_CONFIG.music.artist}
                </p>
              </div>
            </div>

            {/* Play/Pause & Mute Buttons */}
            <div className="flex items-center justify-between gap-2">
              <button
                onClick={togglePlay}
                className="flex-1 py-2 px-3 rounded-xl bg-primaryMaroon hover:bg-maroon-700 border border-royalGold/50 text-champagne text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5 text-royalGold" />
                    <span>{language === 'hi' ? 'संगीत रोकें' : 'Pause'}</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 text-royalGold fill-current" />
                    <span>{language === 'hi' ? 'संगीत बजाएं' : 'Play'}</span>
                  </>
                )}
              </button>

              <button
                onClick={toggleMute}
                aria-label={isMuted ? 'Unmute' : 'Mute'}
                className="p-2 rounded-xl bg-primaryMaroon hover:bg-maroon-700 border border-royalGold/50 text-royalGold transition-all shadow-md"
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>

            {/* Volume Range Slider */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px] font-semibold text-royalGold uppercase tracking-wider">
                <span>Volume</span>
                <span>{Math.round(volume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-full accent-royalGold bg-primaryMaroon rounded-lg h-1.5 cursor-pointer"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Music Button */}
      <button
        onClick={() => {
          if (!isPlaying && !showControls) {
            togglePlay();
          }
          setShowControls(!showControls);
        }}
        aria-label="Wedding Music Player"
        className={`flex items-center gap-2.5 px-3 sm:px-4 py-2.5 rounded-full border-2 shadow-2xl backdrop-blur-md transition-all duration-300 ${
          isPlaying
            ? 'bg-deepBurgundy/90 border-royalGold text-champagne shadow-royalGold/20 scale-105'
            : 'bg-deepBurgundy/80 border-royalGold/50 text-ivory/80 hover:text-white hover:border-royalGold'
        }`}
      >
        {/* Animated Equalizer Bars */}
        {isPlaying ? (
          <div className="flex items-center gap-0.5 h-4 px-0.5">
            <span className="w-1 bg-royalGold h-3 animate-pulse" />
            <span className="w-1 bg-royalGold h-4 animate-pulse delay-75" />
            <span className="w-1 bg-royalGold h-2 animate-pulse delay-150" />
          </div>
        ) : (
          <Music className="w-4 h-4 text-royalGold" />
        )}

        <span className="hidden sm:inline text-xs font-semibold tracking-wider text-royalGold">
          {isPlaying
            ? language === 'hi'
              ? 'मंगल वादन'
              : 'Wedding Symphony'
            : language === 'hi'
            ? 'संगीत'
            : 'Music'}
        </span>
      </button>
    </div>
  );
};

export default MusicPlayer;

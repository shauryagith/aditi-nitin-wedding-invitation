import React from 'react';
import { Volume2, VolumeX, Music, Play, Pause } from 'lucide-react';
import { useAudio } from '../../context/AudioContext';
import { useLanguage } from '../../context/LanguageContext';

interface WelcomeMusicProps {
  className?: string;
}

export const WelcomeMusic: React.FC<WelcomeMusicProps> = ({ className = '' }) => {
  const { isPlaying, isMuted, togglePlay, toggleMute } = useAudio();
  const { language } = useLanguage();

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      {/* Play/Pause Button */}
      <button
        onClick={togglePlay}
        aria-label={isPlaying ? 'Pause wedding music' : 'Play wedding music'}
        className="px-3 py-1.5 rounded-full bg-deepBurgundy/80 hover:bg-primaryMaroon border border-royalGold/50 text-champagne text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md backdrop-blur-md"
      >
        {isPlaying ? (
          <>
            {/* Animated Equalizer Bars */}
            <div className="flex items-center gap-0.5 h-3 px-0.5">
              <span className="w-0.5 bg-royalGold h-2 animate-pulse" />
              <span className="w-0.5 bg-royalGold h-3 animate-pulse delay-75" />
              <span className="w-0.5 bg-royalGold h-1.5 animate-pulse delay-150" />
            </div>
            <span>{language === 'hi' ? 'संगीत' : 'Music On'}</span>
          </>
        ) : (
          <>
            <Play className="w-3.5 h-3.5 text-royalGold fill-current" />
            <span>{language === 'hi' ? 'संगीत चालू करें' : 'Play Music'}</span>
          </>
        )}
      </button>

      {/* Mute/Unmute Button */}
      {isPlaying && (
        <button
          onClick={toggleMute}
          aria-label={isMuted ? 'Unmute music' : 'Mute music'}
          className="p-1.5 rounded-full bg-deepBurgundy/80 hover:bg-primaryMaroon border border-royalGold/40 text-royalGold hover:text-white transition-all shadow-md backdrop-blur-md"
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5" />}
        </button>
      )}
    </div>
  );
};

export default WelcomeMusic;

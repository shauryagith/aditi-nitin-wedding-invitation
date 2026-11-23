import React from 'react';
import { RotateCcw, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface ReplayInvitationButtonProps {
  onReplay: () => void;
  className?: string;
}

export const ReplayInvitationButton: React.FC<ReplayInvitationButtonProps> = ({
  onReplay,
  className = '',
}) => {
  const { language } = useLanguage();

  const handleReplay = () => {
    try {
      sessionStorage.removeItem('aditi_nitin_welcome_seen');
    } catch {
      // Ignored
    }
    onReplay();
  };

  return (
    <button
      onClick={handleReplay}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-deepBurgundy/80 hover:bg-primaryMaroon border border-royalGold/50 hover:border-royalGold text-champagne text-xs font-semibold shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 ${className}`}
      aria-label="Replay Royal Welcome Invitation"
    >
      <RotateCcw className="w-3.5 h-3.5 text-royalGold" />
      <span>{language === 'hi' ? 'निमंत्रण पुनः देखें' : 'Replay Invitation Intro'}</span>
    </button>
  );
};

export default ReplayInvitationButton;

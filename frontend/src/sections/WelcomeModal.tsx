import React from 'react';
import { WelcomeExperience } from '../components/welcome/WelcomeExperience';

interface WelcomeModalProps {
  onEnter: () => void;
  onSkip?: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ onEnter, onSkip }) => {
  return <WelcomeExperience onComplete={onEnter} onSkip={onSkip || onEnter} />;
};

export const WelcomeScreen = WelcomeModal;
export default WelcomeModal;

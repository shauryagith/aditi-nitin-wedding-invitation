import React from 'react';
import { HeroSlider } from '../components/common/HeroSlider';

interface HeroSectionProps {
  onOpenShareModal?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenShareModal = () => {} }) => {
  return <HeroSlider onOpenShareModal={onOpenShareModal} />;
};

export default HeroSection;

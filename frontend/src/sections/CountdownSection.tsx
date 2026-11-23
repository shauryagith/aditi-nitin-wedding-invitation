import React from 'react';
import { WeddingCountdown } from '../components/WeddingCountdown';
import { WeddingCountdownProps } from '../components/WeddingCountdown/countdown.types';

export const CountdownSection: React.FC<WeddingCountdownProps> = (props) => {
  return <WeddingCountdown {...props} />;
};

export const Countdown = CountdownSection;
export default CountdownSection;

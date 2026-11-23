export interface CountdownTimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  isCompleted: boolean;
  isValid: boolean;
  isPlaceholder?: boolean;
}

export type ScratchStage = 'unscratched' | 'glowing' | 'halfway' | 'revealed';

export interface ScratchProgressState {
  percentScratched: number;
  isRevealed: boolean;
  isScratching: boolean;
  hasStartedScratching: boolean;
  stage: ScratchStage;
}

export interface WeddingCountdownProps {
  targetDate?: string;
  autoRevealThreshold?: number;
  onRevealed?: () => void;
  className?: string;
  id?: string;
}

export interface ScratchCanvasProps {
  isRevealed: boolean;
  brushRadius?: number;
  autoRevealThreshold?: number;
  onProgressUpdate: (percent: number) => void;
  onRevealComplete: () => void;
  onStartScratching?: () => void;
  onStopScratching?: () => void;
  width?: number;
  height?: number;
}

export interface ScratchProgressProps {
  percentScratched: number;
  isRevealed: boolean;
  onRevealNow: () => void;
  onReset?: () => void;
}

export interface CountdownUnitProps {
  value: number;
  label: string;
  labelHi?: string;
}

export interface CountdownDisplayProps {
  timeLeft: CountdownTimeRemaining;
  isRevealed: boolean;
}

export interface CountdownRevealProps {
  isRevealed: boolean;
  children: React.ReactNode;
}

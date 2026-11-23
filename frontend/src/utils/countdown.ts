export interface CountdownResult {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isCompleted: boolean;
  isPlaceholder: boolean;
  isValid: boolean;
}

/**
 * Calculates countdown time units remaining until a target ISO date string in Asia/Kolkata
 */
export const calculateTimeRemaining = (targetDateIso: string | undefined): CountdownResult => {
  if (!targetDateIso || targetDateIso.includes('PLACEHOLDER') || targetDateIso.trim() === '') {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isCompleted: false,
      isPlaceholder: true,
      isValid: false,
    };
  }

  const targetTime = new Date(targetDateIso).getTime();

  if (isNaN(targetTime)) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isCompleted: false,
      isPlaceholder: true,
      isValid: false,
    };
  }

  const currentTime = new Date().getTime();
  const diff = targetTime - currentTime;

  if (diff <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isCompleted: true,
      isPlaceholder: false,
      isValid: true,
    };
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    days,
    hours,
    minutes,
    seconds,
    isCompleted: false,
    isPlaceholder: false,
    isValid: true,
  };
};

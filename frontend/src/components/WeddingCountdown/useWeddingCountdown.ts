import { useState, useEffect, useRef, useMemo } from 'react';
import { CountdownTimeRemaining } from './countdown.types';
import { COUNTDOWN_TARGET_DATE_ISO } from './countdown.config';

/**
 * Robust countdown calculator handling ISO timestamps and Asia/Kolkata timezone
 */
export const calculateRemainingTime = (targetIso: string): CountdownTimeRemaining => {
  if (!targetIso || targetIso.trim() === '' || targetIso.includes('PLACEHOLDER')) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalSeconds: 0,
      isCompleted: false,
      isValid: false,
      isPlaceholder: true,
    };
  }

  const targetMs = new Date(targetIso).getTime();

  if (isNaN(targetMs)) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalSeconds: 0,
      isCompleted: false,
      isValid: false,
      isPlaceholder: true,
    };
  }

  const nowMs = Date.now();
  const diffMs = targetMs - nowMs;

  if (diffMs <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalSeconds: 0,
      isCompleted: true,
      isValid: true,
      isPlaceholder: false,
    };
  }

  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    days,
    hours,
    minutes,
    seconds,
    totalSeconds,
    isCompleted: false,
    isValid: true,
    isPlaceholder: false,
  };
};

/**
 * Custom hook for live wedding countdown
 * Updates precisely once per second and prevents unnecessary re-renders
 */
export const useWeddingCountdown = (targetDateIso: string = COUNTDOWN_TARGET_DATE_ISO) => {
  const [timeRemaining, setTimeRemaining] = useState<CountdownTimeRemaining>(() =>
    calculateRemainingTime(targetDateIso)
  );

  const prevSecondsRef = useRef<number>(timeRemaining.totalSeconds);

  useEffect(() => {
    // Initial sync
    const initial = calculateRemainingTime(targetDateIso);
    setTimeRemaining(initial);
    prevSecondsRef.current = initial.totalSeconds;

    if (initial.isCompleted) return;

    const intervalId = setInterval(() => {
      const next = calculateRemainingTime(targetDateIso);
      if (next.totalSeconds !== prevSecondsRef.current) {
        prevSecondsRef.current = next.totalSeconds;
        setTimeRemaining(next);
      }

      if (next.isCompleted) {
        clearInterval(intervalId);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [targetDateIso]);

  return timeRemaining;
};

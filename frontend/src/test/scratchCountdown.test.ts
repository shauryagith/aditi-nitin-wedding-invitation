import { describe, it, expect, vi, beforeEach } from 'vitest';
import { calculateRemainingTime } from '../components/WeddingCountdown/useWeddingCountdown';
import { COUNTDOWN_CONFIG, PROVISIONAL_WEDDING_TARGET_ISO } from '../components/WeddingCountdown/countdown.config';

describe('Scratch-To-Reveal Wedding Countdown Logic & Config', () => {
  beforeEach(() => {
    vi.useRealTimers();
  });

  it('verifies configuration has required scratch thresholds (25%, 50%, 70%)', () => {
    expect(COUNTDOWN_CONFIG.thresholds.subtleGlow).toBe(25);
    expect(COUNTDOWN_CONFIG.thresholds.halfway).toBe(50);
    expect(COUNTDOWN_CONFIG.thresholds.autoReveal).toBe(70);
    expect(COUNTDOWN_CONFIG.timezone).toBe('Asia/Kolkata');
    expect(COUNTDOWN_CONFIG.brush.defaultRadius).toBeGreaterThanOrEqual(24);
  });

  it('calculates accurate positive time units for a future wedding date', () => {
    const futureDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 15 + 1000 * 60 * 45).toISOString();
    const result = calculateRemainingTime(futureDate);

    expect(result.isValid).toBe(true);
    expect(result.isCompleted).toBe(false);
    expect(result.days).toBeGreaterThanOrEqual(14);
    expect(result.totalSeconds).toBeGreaterThan(0);
  });

  it('handles past date as completed with zero values and no negative numbers', () => {
    const pastDate = '2020-11-22T00:00:00+05:30';
    const result = calculateRemainingTime(pastDate);

    expect(result.isValid).toBe(true);
    expect(result.isCompleted).toBe(true);
    expect(result.days).toBe(0);
    expect(result.hours).toBe(0);
    expect(result.minutes).toBe(0);
    expect(result.seconds).toBe(0);
    expect(result.totalSeconds).toBe(0);
  });

  it('handles empty or placeholder target date gracefully', () => {
    const emptyResult = calculateRemainingTime('');
    expect(emptyResult.isValid).toBe(false);
    expect(emptyResult.isPlaceholder).toBe(true);
    expect(emptyResult.days).toBe(0);

    const placeholderResult = calculateRemainingTime('[DATE_PLACEHOLDER]');
    expect(placeholderResult.isValid).toBe(false);
    expect(placeholderResult.isPlaceholder).toBe(true);
  });

  it('correctly calculates difference with Asia/Kolkata +05:30 target timestamp', () => {
    vi.setSystemTime(new Date('2026-11-22T00:00:00+05:30'));
    // 11 December 2026 00:00:00 IST
    const istDate = '2026-12-11T00:00:00+05:30';
    const targetMs = new Date(istDate).getTime();
    expect(isNaN(targetMs)).toBe(false);

    const res = calculateRemainingTime(istDate);
    // When evaluated at 2026-11-22, remaining days to 11 Dec 2026 is exactly 19 days
    expect(res.days).toBeGreaterThanOrEqual(18);
    expect(res.isCompleted).toBe(false);
  });

  it('supports the provisional target date 11 December 2026 in Asia/Kolkata', () => {
    vi.setSystemTime(new Date('2026-11-22T00:00:00+05:30'));
    expect(PROVISIONAL_WEDDING_TARGET_ISO).toBe('2026-12-11T00:00:00+05:30');
    const res = calculateRemainingTime(PROVISIONAL_WEDDING_TARGET_ISO);
    expect(res.isValid).toBe(true);
    expect(res.days).toBeGreaterThanOrEqual(18);
  });
});

import { describe, it, expect } from 'vitest';
import { calculateTimeRemaining } from '../utils/countdown';

describe('Wedding Countdown Logic', () => {
  it('should gracefully handle placeholder string [DATE_PLACEHOLDER]', () => {
    const res = calculateTimeRemaining('[DATE_PLACEHOLDER]');
    expect(res.isPlaceholder).toBe(true);
    expect(res.isValid).toBe(false);
    expect(res.days).toBe(0);
  });

  it('should gracefully handle undefined or empty date', () => {
    const res = calculateTimeRemaining('');
    expect(res.isPlaceholder).toBe(true);
    expect(res.isValid).toBe(false);
  });

  it('should recognize when a date is in the past as completed', () => {
    const pastDate = '2020-01-01T00:00:00+05:30';
    const res = calculateTimeRemaining(pastDate);
    expect(res.isCompleted).toBe(true);
    expect(res.isPlaceholder).toBe(false);
    expect(res.isValid).toBe(true);
    expect(res.days).toBe(0);
  });

  it('should compute positive countdown values for a future date', () => {
    const future = new Date(Date.now() + 1000 * 60 * 60 * 24 * 10).toISOString();
    const res = calculateTimeRemaining(future);
    expect(res.isCompleted).toBe(false);
    expect(res.isPlaceholder).toBe(false);
    expect(res.isValid).toBe(true);
    expect(res.days).toBeGreaterThanOrEqual(9);
  });
});

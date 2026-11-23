// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { weddingSyncManager } from '../utils/dataSync';

describe('Real-Time Wedding Data Synchronization Manager', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('subscribes and notifies local subscribers immediately when notifyUpdate is called', () => {
    const subscriber = vi.fn();
    const unsubscribe = weddingSyncManager.subscribe(subscriber);

    weddingSyncManager.notifyUpdate('events');

    expect(subscriber).toHaveBeenCalled();
    expect(subscriber).toHaveBeenCalledWith('events');

    unsubscribe();
  });

  it('stops notifying subscriber after unsubscription', () => {
    const subscriber = vi.fn();
    const unsubscribe = weddingSyncManager.subscribe(subscriber);

    unsubscribe();
    weddingSyncManager.notifyUpdate('gallery');

    expect(subscriber).not.toHaveBeenCalled();
  });

  it('writes to localStorage so other browser tabs receive the sync event', () => {
    weddingSyncManager.notifyUpdate('content');

    const stored = localStorage.getItem('aditi_nitin_data_sync_ts');
    expect(stored).toBeTruthy();

    const parsed = JSON.parse(stored!);
    expect(parsed.entity).toBe('content');
    expect(parsed.timestamp).toBeGreaterThan(0);
  });

  it('responds to storage events fired by other tabs', () => {
    const subscriber = vi.fn();
    const unsubscribe = weddingSyncManager.subscribe(subscriber);

    const storageEvent = new StorageEvent('storage', {
      key: 'aditi_nitin_data_sync_ts',
      newValue: JSON.stringify({ entity: 'events', timestamp: Date.now() }),
    });

    window.dispatchEvent(storageEvent);

    expect(subscriber).toHaveBeenCalledWith('events');

    unsubscribe();
  });

  it('responds to window focus event to refresh stale data', () => {
    const subscriber = vi.fn();
    const unsubscribe = weddingSyncManager.subscribe(subscriber);

    window.dispatchEvent(new Event('focus'));

    expect(subscriber).toHaveBeenCalledWith('all');

    unsubscribe();
  });
});

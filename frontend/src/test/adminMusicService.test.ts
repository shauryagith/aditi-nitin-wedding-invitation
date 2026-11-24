import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { adminService } from '../services/api';
import { weddingSyncManager } from '../utils/dataSync';

describe('Frontend adminService.uploadMusicTrack & CSRF / Error Handling', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('1. Sends X-Requested-With: XMLHttpRequest, credentials: include, and does NOT set Content-Type', async () => {
    let capturedUrl = '';
    let capturedOptions: RequestInit | undefined;

    global.fetch = vi.fn().mockImplementation(async (url: string, options: RequestInit) => {
      capturedUrl = url;
      capturedOptions = options;
      return {
        ok: true,
        status: 201,
        json: async () => ({
          success: true,
          message: 'Background music uploaded successfully',
          data: { _id: 'track-123', title: 'Royal Shehnai' },
        }),
      };
    });

    const notifySpy = vi.spyOn(weddingSyncManager, 'notifyUpdate');

    const formData = new FormData();
    formData.append('audio', new Blob(['fake audio content'], { type: 'audio/mpeg' }), 'test_shehnai.mp3');
    formData.append('title', 'Royal Shehnai');

    const result = await adminService.uploadMusicTrack(formData);

    expect(capturedUrl).toContain('/admin/music/upload');
    expect(capturedOptions?.method).toBe('POST');
    expect(capturedOptions?.credentials).toBe('include');
    expect(capturedOptions?.body).toBe(formData);

    // X-Requested-With header must be sent for anti-CSRF validation
    const headers = capturedOptions?.headers as Record<string, string>;
    expect(headers).toBeDefined();
    expect(headers['X-Requested-With']).toBe('XMLHttpRequest');

    // Content-Type must NOT be manually set so browser can generate boundary
    expect(headers['Content-Type']).toBeUndefined();

    // Successful response and sync notification
    expect(result.success).toBe(true);
    expect(result.data.title).toBe('Royal Shehnai');
    expect(notifySpy).toHaveBeenCalledWith('/admin/music');
  });

  it('2. Throws meaningful error with backend message when server returns 403 CSRF rejection', async () => {
    global.fetch = vi.fn().mockImplementation(async () => {
      return {
        ok: false,
        status: 403,
        json: async () => ({
          success: false,
          message: 'CSRF Forbidden: Missing required CSRF protection header (X-Requested-With or X-CSRF-Token).',
        }),
      };
    });

    const formData = new FormData();
    formData.append('audio', new Blob(['test'], { type: 'audio/mpeg' }), 'track.mp3');

    await expect(adminService.uploadMusicTrack(formData)).rejects.toThrow(
      'CSRF Forbidden: Missing required CSRF protection header (X-Requested-With or X-CSRF-Token).'
    );
  });

  it('3. Throws meaningful error when server returns 403 Role Forbidden', async () => {
    global.fetch = vi.fn().mockImplementation(async () => {
      return {
        ok: false,
        status: 403,
        json: async () => ({
          success: false,
          message: 'Forbidden. Your role (VIEWER) does not have permission for this action. Required: MEDIA_MANAGER, SUPER_ADMIN',
        }),
      };
    });

    const formData = new FormData();
    await expect(adminService.uploadMusicTrack(formData)).rejects.toThrow(
      'Forbidden. Your role (VIEWER) does not have permission for this action.'
    );
  });

  it('4. Dispatches auth:unauthorized event and throws on 401 Unauthorized', async () => {
    let unauthorizedEventFired = false;
    const listener = () => {
      unauthorizedEventFired = true;
    };
    window.addEventListener('auth:unauthorized', listener);

    global.fetch = vi.fn().mockImplementation(async () => {
      return {
        ok: false,
        status: 401,
        json: async () => ({
          success: false,
          message: 'Unauthorized. Authentication token missing.',
        }),
      };
    });

    const formData = new FormData();
    await expect(adminService.uploadMusicTrack(formData)).rejects.toThrow(
      'Unauthorized. Authentication token missing.'
    );
    expect(unauthorizedEventFired).toBe(true);

    window.removeEventListener('auth:unauthorized', listener);
  });

  it('5. Throws immediately on 400 Bad Request (invalid file or missing fields) without retrying', async () => {
    let callCount = 0;
    global.fetch = vi.fn().mockImplementation(async () => {
      callCount++;
      return {
        ok: false,
        status: 400,
        json: async () => ({
          success: false,
          message: 'Audio file cannot be empty (0 bytes).',
        }),
      };
    });

    const formData = new FormData();
    formData.append('audio', new Blob([], { type: 'audio/mpeg' }), 'empty.mp3');

    await expect(adminService.uploadMusicTrack(formData)).rejects.toThrow(
      'Audio file cannot be empty (0 bytes).'
    );
    // Must NOT retry 400 client error
    expect(callCount).toBe(1);
  });

  it('6. Retries on 502/503/504 gateway cold start and succeeds on next attempt', async () => {
    let callCount = 0;
    global.fetch = vi.fn().mockImplementation(async () => {
      callCount++;
      if (callCount === 1) {
        return {
          ok: false,
          status: 502,
          json: async () => ({
            success: false,
            message: 'Bad Gateway (Server waking up)',
          }),
        };
      }
      return {
        ok: true,
        status: 201,
        json: async () => ({
          success: true,
          message: 'Background music uploaded successfully',
          data: { _id: 'track-retry-1', title: 'Retry Track' },
        }),
      };
    });

    const formData = new FormData();
    formData.append('audio', new Blob(['test audio'], { type: 'audio/mpeg' }), 'retry.mp3');

    const result = await adminService.uploadMusicTrack(formData);
    expect(callCount).toBe(2);
    expect(result.success).toBe(true);
    expect(result.data.title).toBe('Retry Track');
  });
});

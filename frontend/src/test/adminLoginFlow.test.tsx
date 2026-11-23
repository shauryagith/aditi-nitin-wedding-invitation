// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { adminService, getStoredToken, setStoredToken } from '../services/api';

describe('Admin Dual-Layer Authentication & Token Persistence', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    vi.restoreAllMocks();
  });

  it('stores token in client storage on setStoredToken and retrieves it with getStoredToken', () => {
    expect(getStoredToken()).toBeNull();
    const mockToken = 'mock_jwt_token_header.payload.signature';
    setStoredToken(mockToken);
    expect(getStoredToken()).toBe(mockToken);
    expect(localStorage.getItem('aditi_nitin_admin_jwt')).toBe(mockToken);
    expect(sessionStorage.getItem('aditi_nitin_admin_jwt')).toBe(mockToken);

    setStoredToken(null);
    expect(getStoredToken()).toBeNull();
    expect(localStorage.getItem('aditi_nitin_admin_jwt')).toBeNull();
  });

  it('appends token query param to CSV export URL when authenticated', () => {
    setStoredToken(null);
    const unauthenticatedUrl = adminService.exportGuestsCSVUrl();
    expect(unauthenticatedUrl).not.toContain('?token=');

    const testToken = 'export_test_token_123';
    setStoredToken(testToken);
    const authenticatedUrl = adminService.exportGuestsCSVUrl();
    expect(authenticatedUrl).toContain(`?token=${testToken}`);
  });

  it('attaches Authorization Bearer header to apiRequest when token is stored', async () => {
    const testToken = 'my_secure_jwt_token_999';
    setStoredToken(testToken);

    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ success: true, data: { admin: { name: 'Admin', email: 'admin@test.com', role: 'SUPER_ADMIN' } } }),
    } as any);

    await adminService.checkAuth();

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const calledOptions = fetchSpy.mock.calls[0][1];
    expect(calledOptions).toBeDefined();
    expect((calledOptions?.headers as any)?.Authorization).toBe(`Bearer ${testToken}`);
    expect((calledOptions?.headers as any)?.['X-Requested-With']).toBe('XMLHttpRequest');
    expect(calledOptions?.credentials).toBe('include');
  });

  it('clears stored token when an API request encounters a 401 Unauthorized status', async () => {
    const testToken = 'expired_test_token';
    setStoredToken(testToken);
    expect(getStoredToken()).toBe(testToken);

    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({ success: false, message: 'Invalid or expired token' }),
    } as any);

    await expect(adminService.checkAuth()).rejects.toThrow('Invalid or expired token');
    expect(getStoredToken()).toBeNull();
  });
});

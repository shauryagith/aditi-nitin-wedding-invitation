// @vitest-environment jsdom
import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { AuthProvider, useAuth } from '../context/AuthContext';
import * as apiModule from '../services/api';

// Mock IntersectionObserver
beforeAll(() => {
  class MockIntersectionObserver {
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
  }
  window.IntersectionObserver = MockIntersectionObserver as any;
});

describe('Frontend Admin Security & ProtectedRoute Specifications', () => {
  it('redirects unauthenticated visitor away from protected dashboard to /admin/login', async () => {
    // Mock checkAuth returning null/failure
    vi.spyOn(apiModule.adminService, 'checkAuth').mockRejectedValue(new Error('Unauthorized'));

    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/admin/dashboard']}>
          <Routes>
            <Route path="/admin/login" element={<div>Mock Login Page</div>} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <div>Secret Protected Dashboard Content</div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    );

    // Should redirect to login and NOT render protected content
    await waitFor(() => {
      expect(screen.getByText('Mock Login Page')).toBeDefined();
    });
    expect(screen.queryByText('Secret Protected Dashboard Content')).toBeNull();
  });

  it('renders loading state without flashing dashboard content while verifying session', () => {
    // Unresolved promise simulates ongoing verification
    vi.spyOn(apiModule.adminService, 'checkAuth').mockReturnValue(new Promise(() => {}));

    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/admin/dashboard']}>
          <Routes>
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <div>Secret Protected Dashboard Content</div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    );

    // Cryptographic verification state visible
    expect(screen.getByText(/Verifying Admin Session/i)).toBeDefined();
    // Dashboard content MUST NOT appear during loading
    expect(screen.queryByText('Secret Protected Dashboard Content')).toBeNull();
  });

  it('renders protected dashboard when user is authenticated with permitted role', async () => {
    vi.spyOn(apiModule.adminService, 'checkAuth').mockResolvedValue({
      success: true,
      data: {
        admin: {
          id: 'admin-1',
          name: 'Super Admin',
          email: 'admin@aditinitinwedding.com',
          role: 'SUPER_ADMIN',
        },
      },
    } as any);

    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/admin/dashboard']}>
          <Routes>
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']}>
                  <div>Secret Protected Dashboard Content</div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Secret Protected Dashboard Content')).toBeDefined();
    });
  });

  it('blocks authenticated user without required role with access restricted notice', async () => {
    vi.spyOn(apiModule.adminService, 'checkAuth').mockResolvedValue({
      success: true,
      data: {
        admin: {
          id: 'admin-coord',
          name: 'Wedding Coordinator',
          email: 'coord@aditinitinwedding.com',
          role: 'VIEWER',
        },
      },
    } as any);

    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/admin/users']}>
          <Routes>
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
                  <div>Super Secret User Management</div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Access Restricted')).toBeDefined();
    });
    expect(screen.getByText(/VIEWER/i)).toBeDefined();
    expect(screen.queryByText('Super Secret User Management')).toBeNull();
  });
});

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { adminService } from '../services/api';

export interface AdminUser {
  id?: string;
  name: string;
  email: string;
  role: string;
  lastLoginAt?: string;
}

interface AuthContextType {
  admin: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AdminUser>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<AdminUser | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshAuth = useCallback(async (): Promise<AdminUser | null> => {
    try {
      const res = await adminService.checkAuth();
      if (res.success && res.data?.admin) {
        setAdmin(res.data.admin);
        return res.data.admin;
      }
      setAdmin(null);
      return null;
    } catch {
      setAdmin(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshAuth();

    // Listen for unauthorized 401 events from any API call to immediately invalidate session
    const handleUnauthorized = () => {
      setAdmin(null);
      setIsLoading(false);
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, [refreshAuth]);

  const login = async (email: string, password: string): Promise<AdminUser> => {
    setIsLoading(true);
    try {
      const res = await adminService.login(email, password);
      if (res.success && res.data?.admin) {
        setAdmin(res.data.admin);
        return res.data.admin;
      }
      throw new Error(res.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await adminService.logout().catch(() => null);
    } finally {
      setAdmin(null);
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        isAuthenticated: !!admin,
        isLoading,
        login,
        logout,
        refreshAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

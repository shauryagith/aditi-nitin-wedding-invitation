import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GaneshaEmblem } from '../common/DecorativeOrnaments';
import { ShieldAlert, ShieldCheck } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { admin, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // 1. Loading state prevents any flash of unauthenticated content (FOUC)
  if (isLoading) {
    return (
      <div className="min-h-screen bg-maroon-950 flex flex-col items-center justify-center p-4 relative overflow-hidden text-ivory">
        <div className="absolute inset-0 mandala-bg opacity-10 pointer-events-none" />
        <div className="relative z-10 flex flex-col items-center text-center max-w-sm">
          <div className="relative mb-6">
            <GaneshaEmblem size={64} className="text-gold-400 animate-pulse" />
            <div className="absolute inset-0 rounded-full border-2 border-gold-400/40 animate-ping pointer-events-none" />
          </div>
          <h2 className="font-heading text-xl text-gold-300 font-semibold mb-2">
            Verifying Admin Session
          </h2>
          <p className="text-xs text-ivory/70 flex items-center gap-1.5 justify-center">
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Validating cryptographic credentials...</span>
          </p>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated visitors are redirected to admin login
  if (!isAuthenticated || !admin) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // 3. Optional Role-based check
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = admin.role;
    const isSuperAdmin = userRole === 'SUPER_ADMIN';
    const isPermitted = isSuperAdmin || allowedRoles.includes(userRole);

    if (!isPermitted) {
      return (
        <div className="min-h-screen bg-maroon-950 flex items-center justify-center p-4 text-ivory">
          <div className="max-w-md w-full bg-maroon-900/90 border border-red-500/40 rounded-2xl p-6 text-center shadow-2xl backdrop-blur-md">
            <ShieldAlert className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-lg font-bold text-red-300 font-heading mb-2">
              Access Restricted
            </h2>
            <p className="text-xs text-ivory/80 mb-6">
              Your admin role (<span className="text-gold-400 font-semibold">{userRole}</span>) does not have permission to view this section.
            </p>
            <a
              href="/admin/dashboard"
              className="inline-block px-5 py-2 rounded-xl bg-gold-500/20 text-gold-300 hover:bg-gold-500/30 text-xs font-semibold border border-gold-500/40 transition-colors"
            >
              Return to Overview
            </a>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
};

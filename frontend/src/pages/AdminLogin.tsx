import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, Mail, ArrowLeft, AlertCircle, ShieldCheck, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { GaneshaEmblem } from '../components/common/DecorativeOrnaments';

export const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('admin@aditinitinwedding.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionExpiredNotice, setSessionExpiredNotice] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // If already authenticated, redirect to destination
    if (isAuthenticated) {
      const destination = (location.state as any)?.from?.pathname || '/admin/dashboard';
      navigate(destination, { replace: true });
    }

    // Check if session expired
    const params = new URLSearchParams(location.search);
    if (params.get('expired') === 'true') {
      setSessionExpiredNotice(true);
    }
  }, [isAuthenticated, location, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSessionExpiredNotice(false);

    try {
      await login(email, password);
      const destination = (location.state as any)?.from?.pathname || '/admin/dashboard';
      navigate(destination, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-maroon-950 flex items-center justify-center p-4 relative overflow-hidden text-ivory">
      {/* Background decorations */}
      <div className="absolute inset-0 mandala-bg opacity-15 pointer-events-none" />

      <div className="relative z-10 w-full max-w-md bg-maroon-900/90 rounded-3xl p-8 border-2 border-gold-500/50 shadow-2xl backdrop-blur-xl">
        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs text-gold-300 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Wedding Website</span>
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <GaneshaEmblem size={52} className="mx-auto text-gold-400 mb-2" />
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-gold-300">
            Admin Portal
          </h2>
          <p className="text-xs text-ivory/70 mt-1">
            Aditi &amp; Nitin Wedding Invitation Administration
          </p>
        </div>

        {sessionExpiredNotice && (
          <div className="mb-6 p-3.5 rounded-xl bg-amber-900/60 border border-amber-500/50 text-amber-200 text-xs flex items-start gap-2">
            <Clock className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <span>Your session has expired. Please sign in again with your admin credentials.</span>
          </div>
        )}

        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-900/60 border border-red-500/50 text-red-200 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gold-300 mb-1">
              Admin Email
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@aditinitinwedding.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-maroon-950/80 border border-gold-500/40 text-ivory text-sm focus:border-gold-400 outline-none"
              />
              <Mail className="w-4 h-4 text-gold-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gold-300 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-maroon-950/80 border border-gold-500/40 text-ivory text-sm focus:border-gold-400 outline-none"
              />
              <Lock className="w-4 h-4 text-gold-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500 text-maroon-950 font-bold text-sm tracking-wide shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{loading ? 'Authenticating...' : 'Sign In to Portal'}</span>
            </button>
          </div>
        </form>

        <div className="mt-8 pt-4 border-t border-maroon-800/80 text-center">
          <p className="text-[11px] text-ivory/50">
            Protected with bcrypt password hashing &amp; secure HTTP-only cookies
          </p>
        </div>
      </div>
    </div>
  );
};

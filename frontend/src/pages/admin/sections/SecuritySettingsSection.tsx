import React, { useState } from 'react';
import { Lock, Key, ShieldCheck, Check, AlertCircle, RefreshCw } from 'lucide-react';
import { adminService } from '../../../services/api';

export const SecuritySettingsSection: React.FC = () => {
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      setStatusMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    if (passwords.newPassword.length < 8) {
      setStatusMsg({ type: 'error', text: 'Password must be at least 8 characters long.' });
      return;
    }

    setSaving(true);
    setStatusMsg(null);
    try {
      await adminService.changePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      setStatusMsg({ type: 'success', text: 'Administrator password updated successfully!' });
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setStatusMsg(null), 5000);
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to update password.' });
    } finally {
      setSaving(false);
    }
  };

  const securityChecklist = [
    { label: 'Role-Based Access Control (RBAC)', status: 'ACTIVE', desc: 'Granular permissions enforced per route' },
    { label: 'Bcrypt Password Hashing (Cost 10)', status: 'ACTIVE', desc: 'Salted cryptographic key derivation' },
    { label: 'JWT HttpOnly Session Cookies', status: 'ACTIVE', desc: 'Protected against XSS token extraction' },
    { label: 'Brute Force Rate Limiting', status: 'ACTIVE', desc: '10 auth attempts & 20 RSVPs per 15 mins' },
    { label: 'Account Lockout Mitigation', status: 'ACTIVE', desc: '5 consecutive failures lock account for 15 mins' },
    { label: 'Tamper-Evident Audit Logging', status: 'ACTIVE', desc: 'All administrative state mutations logged' },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-serif font-bold text-white flex items-center gap-2">
          <Lock className="w-6 h-6 text-gold-400" />
          Security Hardening & Password Management
        </h2>
        <p className="text-sm text-gray-400 mt-1">
          Update your administrator credentials and review active backend security policies.
        </p>
      </div>

      {statusMsg && (
        <div
          className={`p-4 rounded-xl border text-sm flex items-center gap-2 ${
            statusMsg.type === 'success'
              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
              : 'bg-rose-500/20 border-rose-500/40 text-rose-300'
          }`}
        >
          {statusMsg.type === 'success' ? (
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          {statusMsg.text}
        </div>
      )}

      {/* Change Password Form */}
      <div className="p-6 rounded-2xl bg-burgundy-950/40 border border-gold-500/20 shadow-xl space-y-4">
        <h3 className="text-base font-serif font-bold text-white flex items-center gap-2">
          <Key className="w-4 h-4 text-gold-400" />
          Change Admin Password
        </h3>

        <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
          <div>
            <label className="block text-xs font-semibold text-gold-300 mb-1">Current Password</label>
            <input
              type="password"
              value={passwords.currentPassword}
              onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-black/40 border border-gold-500/30 text-white text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gold-300 mb-1">New Password (Min 8 chars)</label>
            <input
              type="password"
              value={passwords.newPassword}
              onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-black/40 border border-gold-500/30 text-white text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gold-300 mb-1">Confirm New Password</label>
            <input
              type="password"
              value={passwords.confirmPassword}
              onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-black/40 border border-gold-500/30 text-white text-sm"
              required
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-600 text-burgundy-950 font-bold text-sm shadow-md transition disabled:opacity-50"
            >
              {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
              {saving ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>

      {/* Security Policies Audit Card */}
      <div className="p-6 rounded-2xl bg-burgundy-950/40 border border-gold-500/20 shadow-xl space-y-4">
        <h3 className="text-base font-serif font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          Active Application Security Posture
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {securityChecklist.map((item, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-black/30 border border-white/5 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">{item.label}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {item.status}
                </span>
              </div>
              <p className="text-[11px] text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

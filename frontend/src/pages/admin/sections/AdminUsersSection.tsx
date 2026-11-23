import React, { useState, useEffect } from 'react';
import { Shield, Plus, Trash2, Edit2, Check, RefreshCw, Key } from 'lucide-react';
import { adminService } from '../../../services/api';
import { AdminUserItem } from '../../../types/wedding';

export const AdminUsersSection: React.FC = () => {
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'CONTENT_MANAGER',
  });
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await adminService.getAdminUsers();
      if (res && res.data) {
        setUsers(res.data);
      }
    } catch (err: any) {
      console.warn('Admin users notice:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminService.createAdminUser(newUser);
      setSuccessMsg('Administrator account created successfully!');
      setIsModalOpen(false);
      fetchUsers();
      setNewUser({ name: '', email: '', password: '', role: 'CONTENT_MANAGER' });
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      alert(`Create user failed: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete administrator account for "${name}"?`)) return;
    try {
      await adminService.deleteAdminUser(id);
      fetchUsers();
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-white flex items-center gap-2">
            <Shield className="w-6 h-6 text-gold-400" />
            Administrator Accounts & RBAC Roles
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Manage granular permissions: Super Admin, Content Manager, Media Manager, and RSVP Manager.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-600 text-burgundy-950 font-bold text-sm shadow-md transition"
        >
          <Plus className="w-4 h-4" /> Add Administrator
        </button>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-sm flex items-center gap-2">
          <Check className="w-4 h-4" /> {successMsg}
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center text-gold-400 text-sm flex items-center justify-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin" /> Loading administrators...
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gold-500/20 bg-burgundy-950/40 shadow-xl">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-black/40 text-[11px] uppercase tracking-wider text-gold-400 border-b border-white/10">
              <tr>
                <th className="px-4 py-3">Admin Name</th>
                <th className="px-4 py-3">Email Address</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Last Active</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-white/5 transition">
                  <td className="px-4 py-3.5 font-semibold text-white">{u.name}</td>
                  <td className="px-4 py-3.5 text-gray-300 font-mono text-[11px]">{u.email}</td>
                  <td className="px-4 py-3.5">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gold-500/20 text-gold-300 border border-gold-500/30">
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-gray-400 text-[11px]">
                    {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString() : 'Never'}
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <button
                      onClick={() => handleDelete(u._id, u.name)}
                      className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300"
                      title="Delete User"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-burgundy-950 border border-gold-500/40 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-serif font-bold text-white">Create Administrator Account</h3>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gold-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border border-gold-500/30 text-white text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gold-300 mb-1">Email Address</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border border-gold-500/30 text-white text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gold-300 mb-1">Initial Password</label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  placeholder="Min 8 characters"
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border border-gold-500/30 text-white text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gold-300 mb-1">Assigned Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border border-gold-500/30 text-white text-sm"
                >
                  <option value="CONTENT_MANAGER">Content Manager (Text & Events)</option>
                  <option value="MEDIA_MANAGER">Media Manager (Images & Music)</option>
                  <option value="RSVP_MANAGER">RSVP Manager (Guests & Export)</option>
                  <option value="COORDINATOR">Event Coordinator (Read-Only)</option>
                  <option value="SUPER_ADMIN">Super Administrator (Full Access)</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 text-gray-300 text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-gold-500 to-amber-600 text-burgundy-950 text-sm font-bold shadow-md"
                >
                  {saving ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

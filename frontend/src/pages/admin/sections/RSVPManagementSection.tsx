import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  Download,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Phone,
  Mail,
  Check,
} from 'lucide-react';
import { adminService } from '../../../services/api';
import { GuestRecord } from '../../../types/wedding';

interface RSVPManagementSectionProps {
  onRefreshStats: () => void;
  onExportCSV: () => void;
}

export const RSVPManagementSection: React.FC<RSVPManagementSectionProps> = ({
  onRefreshStats,
  onExportCSV,
}) => {
  const [guests, setGuests] = useState<GuestRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [attendanceFilter, setAttendanceFilter] = useState<'ALL' | 'CONFIRMED' | 'DECLINED' | 'TENTATIVE'>('ALL');
  const [editingGuest, setEditingGuest] = useState<Partial<GuestRecord> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchGuests = async () => {
    setLoading(true);
    try {
      const res = await adminService.getGuests({
        attendance: attendanceFilter !== 'ALL' ? attendanceFilter : undefined,
        search: searchTerm || undefined,
      });
      if (res && res.data) {
        setGuests(res.data);
      }
    } catch (err: any) {
      console.warn('Guests fetch notice:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuests();
  }, [attendanceFilter, searchTerm]);

  const handleOpenAdd = () => {
    setEditingGuest({
      name: '',
      phone: '',
      email: '',
      guestCount: 2,
      attendanceStatus: 'CONFIRMED',
      selectedEvents: ['shubh-vivah'],
      message: '',
      whatsappOptIn: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (guest: GuestRecord) => {
    setEditingGuest({ ...guest });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete RSVP record for "${name}"?`)) return;
    try {
      await adminService.deleteGuest(id);
      fetchGuests();
      onRefreshStats();
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGuest) return;
    setSaving(true);
    try {
      if (editingGuest._id) {
        await adminService.updateGuest(editingGuest._id, editingGuest);
        setSuccessMsg('Guest RSVP updated successfully!');
      } else {
        await adminService.createGuest(editingGuest);
        setSuccessMsg('Guest RSVP recorded successfully!');
      }
      setIsModalOpen(false);
      fetchGuests();
      onRefreshStats();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      alert(`Save failed: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-gold-400" />
            Guest RSVP Records & Logistics
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Track confirmed attendees, guest counts, dietary preferences, and event selections.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onExportCSV}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gold-500/20 hover:bg-gold-500/30 text-gold-300 border border-gold-500/40 text-sm font-semibold transition"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-600 text-burgundy-950 font-bold text-sm shadow-md transition"
          >
            <Plus className="w-4 h-4" /> Add Guest
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-sm flex items-center gap-2">
          <Check className="w-4 h-4" /> {successMsg}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-burgundy-950/40 border border-gold-500/20 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gold-400 shrink-0" />
          {(['ALL', 'CONFIRMED', 'DECLINED', 'TENTATIVE'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setAttendanceFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition ${
                attendanceFilter === status
                  ? 'bg-gold-500 text-burgundy-950'
                  : 'bg-black/30 text-gray-300 hover:bg-black/50'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, phone..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-black/40 border border-gold-500/30 text-white text-xs focus:outline-none focus:border-gold-400"
          />
        </div>
      </div>

      {/* Guest Table */}
      {loading ? (
        <div className="py-12 text-center text-gold-400 text-sm flex items-center justify-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin" /> Loading RSVP records...
        </div>
      ) : guests.length === 0 ? (
        <div className="py-12 text-center rounded-2xl bg-burgundy-950/20 border border-dashed border-gold-500/20 text-gray-400 text-sm">
          No RSVP submissions match your criteria.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gold-500/20 bg-burgundy-950/40 shadow-xl">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-black/40 text-[11px] uppercase tracking-wider text-gold-400 border-b border-white/10">
              <tr>
                <th className="px-4 py-3">Guest Name</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Count</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Events Attending</th>
                <th className="px-4 py-3">Message</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {guests.map((g) => (
                <tr key={g._id} className="hover:bg-white/5 transition">
                  <td className="px-4 py-3.5 font-semibold text-white">
                    {g.name}
                    {g.whatsappOptIn && (
                      <span className="ml-1.5 inline-block w-2 h-2 rounded-full bg-emerald-400" title="WhatsApp Opt-in" />
                    )}
                  </td>
                  <td className="px-4 py-3.5 space-y-0.5">
                    <div className="flex items-center gap-1.5 text-gray-200">
                      <Phone className="w-3 h-3 text-gold-400" /> {g.phone}
                    </div>
                    {g.email && (
                      <div className="flex items-center gap-1.5 text-gray-400 text-[11px]">
                        <Mail className="w-3 h-3" /> {g.email}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3.5 font-bold text-white font-serif text-sm">
                    {g.guestCount}
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        g.attendanceStatus === 'CONFIRMED'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : g.attendanceStatus === 'DECLINED'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      }`}
                    >
                      {g.attendanceStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 max-w-[180px] truncate text-[11px]">
                    {g.selectedEvents && g.selectedEvents.length > 0
                      ? g.selectedEvents.join(', ')
                      : 'All Ceremonies'}
                  </td>
                  <td className="px-4 py-3.5 max-w-[200px] truncate text-gray-400 text-[11px]" title={g.message}>
                    {g.message || '—'}
                  </td>
                  <td className="px-4 py-3.5 text-right space-x-1">
                    <button
                      onClick={() => handleOpenEdit(g)}
                      className="p-1.5 rounded-lg bg-gold-500/10 hover:bg-gold-500/20 text-gold-300"
                      title="Edit RSVP"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(g._id!, g.name)}
                      className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300"
                      title="Delete RSVP"
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

      {/* Edit / Add Modal */}
      {isModalOpen && editingGuest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-burgundy-950 border border-gold-500/40 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-serif font-bold text-white">
              {editingGuest._id ? 'Edit Guest RSVP' : 'Record New RSVP'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gold-300 mb-1">Guest Name</label>
                  <input
                    type="text"
                    value={editingGuest.name || ''}
                    onChange={(e) => setEditingGuest({ ...editingGuest, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-gold-500/30 text-white text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gold-300 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={editingGuest.phone || ''}
                    onChange={(e) => setEditingGuest({ ...editingGuest, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-gold-500/30 text-white text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gold-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={editingGuest.email || ''}
                    onChange={(e) => setEditingGuest({ ...editingGuest, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-gold-500/30 text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gold-300 mb-1">Guest Count</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={editingGuest.guestCount || 1}
                    onChange={(e) => setEditingGuest({ ...editingGuest, guestCount: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-gold-500/30 text-white text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gold-300 mb-1">Attendance Status</label>
                  <select
                    value={editingGuest.attendanceStatus}
                    onChange={(e) => setEditingGuest({ ...editingGuest, attendanceStatus: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-gold-500/30 text-white text-sm"
                  >
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="DECLINED">Declined</option>
                    <option value="TENTATIVE">Tentative</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gold-300 mb-1">Message from Guest</label>
                  <textarea
                    rows={2}
                    value={editingGuest.message || ''}
                    onChange={(e) => setEditingGuest({ ...editingGuest, message: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-gold-500/30 text-white text-sm"
                  />
                </div>
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
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-gold-500 to-amber-600 text-burgundy-950 text-sm font-bold shadow-md disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, CheckCircle, RefreshCw, AlertCircle, Clock } from 'lucide-react';
import { adminService } from '../../../services/api';
import { GuestRecord } from '../../../types/wedding';

interface WhatsAppSettingsSectionProps {
  guests: GuestRecord[];
}

export const WhatsAppSettingsSection: React.FC<WhatsAppSettingsSectionProps> = ({ guests }) => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGuest, setSelectedGuest] = useState<string>('');
  const [templateName, setTemplateName] = useState<string>('wedding_reminder');
  const [sending, setSending] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await adminService.getWhatsAppMessages();
      if (res && res.data) {
        setLogs(res.data);
      }
    } catch (err: any) {
      console.warn('WhatsApp logs notice:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleSendReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGuest) {
      alert('Please select an opted-in guest.');
      return;
    }

    setSending(true);
    setStatusMsg(null);
    try {
      const res = await adminService.sendWhatsAppReminder({
        guestId: selectedGuest,
        templateName,
      });
      setStatusMsg({ type: 'success', text: res.message || 'WhatsApp message triggered successfully!' });
      fetchLogs();
      setTimeout(() => setStatusMsg(null), 5000);
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to send WhatsApp message.' });
    } finally {
      setSending(false);
    }
  };

  const optedInGuests = guests.filter((g) => g.whatsappOptIn);

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h2 className="text-2xl font-serif font-bold text-white flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-emerald-400" />
          WhatsApp Cloud API & Guest Helpline
        </h2>
        <p className="text-sm text-gray-400 mt-1">
          Send automated ceremony invitations, reminders, and track message delivery status.
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
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          {statusMsg.text}
        </div>
      )}

      {/* Trigger Reminder Card */}
      <div className="p-6 rounded-2xl bg-burgundy-950/40 border border-gold-500/20 shadow-xl space-y-4">
        <h3 className="text-base font-serif font-bold text-white">
          Send WhatsApp Wedding Reminder
        </h3>

        <form onSubmit={handleSendReminder} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gold-300 mb-1">
                Select Opted-In Guest ({optedInGuests.length} available)
              </label>
              <select
                value={selectedGuest}
                onChange={(e) => setSelectedGuest(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-black/40 border border-gold-500/30 text-white text-sm"
                required
              >
                <option value="">-- Choose Guest --</option>
                {optedInGuests.map((g) => (
                  <option key={g._id} value={g._id}>
                    {g.name} ({g.phone}) - {g.attendanceStatus}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gold-300 mb-1">
                Approved Meta Message Template
              </label>
              <select
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-black/40 border border-gold-500/30 text-white text-sm"
              >
                <option value="wedding_reminder">wedding_reminder (Ceremony details & timings)</option>
                <option value="venue_directions">venue_directions (Gorakhpur venue map & pin)</option>
                <option value="welcome_aditi_nitin">welcome_aditi_nitin (Auspicious invitation greeting)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={sending || optedInGuests.length === 0}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-sm shadow-md transition disabled:opacity-50"
            >
              {sending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {sending ? 'Sending via Meta API...' : 'Send WhatsApp Message'}
            </button>
          </div>
        </form>
      </div>

      {/* Delivery Logs Table */}
      <div className="p-6 rounded-2xl bg-burgundy-950/40 border border-gold-500/20 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-serif font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-gold-400" />
            Recent Outbound WhatsApp Logs
          </h3>
          <button
            onClick={fetchLogs}
            className="text-xs text-gold-400 hover:text-gold-300 flex items-center gap-1 font-semibold"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>

        {loading ? (
          <div className="py-8 text-center text-gold-400 text-xs flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin" /> Fetching delivery logs...
          </div>
        ) : logs.length === 0 ? (
          <div className="py-8 text-center text-gray-400 text-xs">
            No outbound messages recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="bg-black/30 text-[10px] uppercase tracking-wider text-gold-400 border-b border-white/10">
                <tr>
                  <th className="px-3 py-2">Phone</th>
                  <th className="px-3 py-2">Template</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Sent Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {logs.map((log, i) => (
                  <tr key={i} className="hover:bg-white/5">
                    <td className="px-3 py-2 font-mono">{log.phone}</td>
                    <td className="px-3 py-2">{log.templateName}</td>
                    <td className="px-3 py-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {log.status || 'DELIVERED'}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-gray-400">
                      {new Date(log.sentAt || log.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

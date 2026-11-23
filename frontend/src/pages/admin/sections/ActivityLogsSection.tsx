import React, { useState, useEffect } from 'react';
import { Activity, Filter, RefreshCw } from 'lucide-react';
import { adminService } from '../../../services/api';
import { ActivityLogItem } from '../../../types/wedding';

export const ActivityLogsSection: React.FC = () => {
  const [logs, setLogs] = useState<ActivityLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState<string>('ALL');

  const actions = ['ALL', 'LOGIN', 'CREATE', 'UPDATE', 'DELETE', 'EXPORT', 'RESTORE', 'SETTINGS_CHANGE'];

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await adminService.getActivityLogs({
        action: actionFilter !== 'ALL' ? actionFilter : undefined,
      });
      if (res && res.data) {
        setLogs(res.data);
      }
    } catch (err: any) {
      console.warn('Activity logs fetch notice:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [actionFilter]);

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-white flex items-center gap-2">
            <Activity className="w-6 h-6 text-gold-400" />
            Security & Administration Audit Trail
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Tamper-evident log recording all administrative modifications, logins, and export actions.
          </p>
        </div>
        <button
          onClick={fetchLogs}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gold-500/20 hover:bg-gold-500/30 text-gold-300 border border-gold-500/40 text-xs font-semibold"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Logs
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <Filter className="w-4 h-4 text-gold-400 shrink-0" />
        {actions.map((act) => (
          <button
            key={act}
            onClick={() => setActionFilter(act)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition ${
              actionFilter === act
                ? 'bg-gold-500 text-burgundy-950'
                : 'bg-black/30 text-gray-300 hover:bg-black/50'
            }`}
          >
            {act}
          </button>
        ))}
      </div>

      {/* Logs Table */}
      {loading ? (
        <div className="py-12 text-center text-gold-400 text-sm flex items-center justify-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin" /> Loading audit logs...
        </div>
      ) : logs.length === 0 ? (
        <div className="py-12 text-center rounded-2xl bg-burgundy-950/20 border border-dashed border-gold-500/20 text-gray-400 text-sm">
          No audit logs recorded for this filter.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gold-500/20 bg-burgundy-950/40 shadow-xl">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-black/40 text-[11px] uppercase tracking-wider text-gold-400 border-b border-white/10">
              <tr>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Entity</th>
                <th className="px-4 py-3">Details</th>
                <th className="px-4 py-3">Administrator</th>
                <th className="px-4 py-3">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {logs.map((log) => (
                <tr key={log._id} className="hover:bg-white/5 transition">
                  <td className="px-4 py-3 font-mono text-[11px] text-gray-400">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        log.action === 'CREATE'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : log.action === 'UPDATE'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : log.action === 'DELETE'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      }`}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-white">{log.entity}</td>
                  <td className="px-4 py-3 text-gray-200 max-w-xs truncate" title={log.details}>
                    {log.details}
                  </td>
                  <td className="px-4 py-3 text-gray-300">{log.adminEmail}</td>
                  <td className="px-4 py-3 font-mono text-gray-400 text-[11px]">{log.ipAddress || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

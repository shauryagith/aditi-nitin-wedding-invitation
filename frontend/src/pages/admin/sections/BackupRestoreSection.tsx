import React, { useState } from 'react';
import { Database, Download, UploadCloud, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { adminService } from '../../../services/api';

export const BackupRestoreSection: React.FC = () => {
  const [restoring, setRestoring] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleDownloadBackup = () => {
    window.location.href = adminService.exportBackupUrl();
  };

  const handleFileRestore = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!window.confirm('WARNING: Restoring from a backup will overwrite current database records. Are you sure you wish to proceed?')) {
      e.target.value = '';
      return;
    }

    setRestoring(true);
    setStatusMsg(null);

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const json = JSON.parse(evt.target?.result as string);
        const res = await adminService.restoreBackup(json);
        setStatusMsg({ type: 'success', text: res.message || 'Database restored successfully!' });
      } catch (err: any) {
        setStatusMsg({ type: 'error', text: err.message || 'Restore failed. Verify file integrity.' });
      } finally {
        setRestoring(false);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-serif font-bold text-white flex items-center gap-2">
          <Database className="w-6 h-6 text-gold-400" />
          Database Backup & Disaster Recovery
        </h2>
        <p className="text-sm text-gray-400 mt-1">
          Export full JSON database snapshots of RSVPs, media registry, ceremonies, and site settings.
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
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          {statusMsg.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Export Card */}
        <div className="p-6 rounded-2xl bg-burgundy-950/40 border border-gold-500/20 shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-serif font-bold text-white flex items-center gap-2">
              <Download className="w-4 h-4 text-gold-400" />
              Download Database Backup
            </h3>
            <p className="text-xs text-gray-400 mt-2">
              Generates an offline JSON archive containing all wedding records, RSVP responses, media metadata, and QR configurations.
            </p>
          </div>

          <button
            onClick={handleDownloadBackup}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-600 text-burgundy-950 font-bold text-sm shadow-md transition"
          >
            <Download className="w-4 h-4" /> Download JSON Archive
          </button>
        </div>

        {/* Restore Card */}
        <div className="p-6 rounded-2xl bg-burgundy-950/40 border border-gold-500/20 shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-serif font-bold text-white flex items-center gap-2">
              <UploadCloud className="w-4 h-4 text-amber-400" />
              Restore from Backup Archive
            </h3>
            <p className="text-xs text-rose-300/80 mt-2">
              Restores collections from an uploaded JSON dump. Overwrites existing database entries with archive data.
            </p>
          </div>

          <label className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-black/40 hover:bg-black/60 text-gold-300 border border-gold-500/30 font-bold text-sm shadow-md transition cursor-pointer">
            {restoring ? <RefreshCw className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
            {restoring ? 'Restoring Collections...' : 'Upload & Restore JSON'}
            <input
              type="file"
              accept=".json,application/json"
              onChange={handleFileRestore}
              disabled={restoring}
              className="hidden"
            />
          </label>
        </div>
      </div>
    </div>
  );
};

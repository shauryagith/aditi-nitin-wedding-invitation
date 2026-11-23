import React from 'react';
import {
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Image as ImageIcon,
  Music,
  Calendar,
  QrCode,
  Download,
  Activity,
  ArrowRight,
} from 'lucide-react';
import { GuestRecord, ActivityLogItem } from '../../../types/wedding';

interface DashboardOverviewProps {
  stats: {
    totalRsvps: number;
    confirmedGuests: number;
    declinedGuests: number;
    tentativeGuests: number;
    expectedAttendees: number;
    whatsappOptIns: number;
    totalMedia: number;
    totalMusic: number;
    totalEvents: number;
    totalGallery: number;
    totalQRs: number;
    recentRsvps: GuestRecord[];
    recentActivities: ActivityLogItem[];
  };
  onNavigateTab: (tabId: string) => void;
  onExportCSV: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  stats,
  onNavigateTab,
  onExportCSV,
}) => {
  const cards = [
    {
      title: 'Total RSVPs',
      value: stats.totalRsvps,
      subtitle: `${stats.expectedAttendees} Expected Attendees`,
      icon: Users,
      color: 'from-amber-500/20 to-amber-600/10 border-amber-500/30 text-amber-300',
      tab: 'rsvp',
    },
    {
      title: 'Confirmed Guests',
      value: stats.confirmedGuests,
      subtitle: 'Attending Celebrations',
      icon: CheckCircle,
      color: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30 text-emerald-300',
      tab: 'rsvp',
    },
    {
      title: 'Declined With Regrets',
      value: stats.declinedGuests,
      subtitle: 'Sending Blessings',
      icon: XCircle,
      color: 'from-rose-500/20 to-rose-600/10 border-rose-500/30 text-rose-300',
      tab: 'rsvp',
    },
    {
      title: 'Pending Responses',
      value: stats.tentativeGuests,
      subtitle: 'Awaiting Confirmation',
      icon: Clock,
      color: 'from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-300',
      tab: 'rsvp',
    },
    {
      title: 'Media Assets',
      value: stats.totalMedia ?? 0,
      subtitle: 'WebP Optimized',
      icon: ImageIcon,
      color: 'from-purple-500/20 to-purple-600/10 border-purple-500/30 text-purple-300',
      tab: 'media',
    },
    {
      title: 'Background Music',
      value: stats.totalMusic ?? 0,
      subtitle: 'Active Shehnai & Sitar',
      icon: Music,
      color: 'from-pink-500/20 to-pink-600/10 border-pink-500/30 text-pink-300',
      tab: 'music',
    },
    {
      title: 'Wedding Events',
      value: stats.totalEvents ?? 0,
      subtitle: 'Dec 11, 2026',
      icon: Calendar,
      color: 'from-amber-600/20 to-yellow-600/10 border-amber-600/30 text-yellow-300',
      tab: 'events',
    },
    {
      title: 'Active QR Codes',
      value: stats.totalQRs ?? 0,
      subtitle: 'High-Res Scannable',
      icon: QrCode,
      color: 'from-teal-500/20 to-teal-600/10 border-teal-500/30 text-teal-300',
      tab: 'qr',
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-burgundy-900/60 via-burgundy-800/40 to-burgundy-900/60 border border-gold-500/30 shadow-xl backdrop-blur-md">
        <div>
          <span className="text-xs uppercase tracking-widest text-gold-400 font-semibold">
            Aditi & Nitin Royal Wedding CMS
          </span>
          <h2 className="text-2xl font-serif font-bold text-white mt-1">
            Executive Wedding Dashboard
          </h2>
          <p className="text-sm text-gold-200/80 mt-1">
            December 11, 2026 • Gorakhpur, UP • Live System Status
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gold-500/20 hover:bg-gold-500/30 text-gold-300 border border-gold-500/40 text-sm font-medium transition shadow-md"
          >
            <Download className="w-4 h-4 text-gold-400" />
            Export Guest CSV
          </button>
          <button
            onClick={() => onNavigateTab('qr')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-600 hover:to-amber-700 text-burgundy-950 font-semibold text-sm transition shadow-lg shadow-gold-500/10"
          >
            <QrCode className="w-4 h-4" />
            Manage QR Codes
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c, idx) => {
          const Icon = c.icon;
          return (
            <div
              key={idx}
              onClick={() => onNavigateTab(c.tab)}
              className={`p-5 rounded-2xl bg-gradient-to-br ${c.color} border backdrop-blur-md hover:scale-[1.02] cursor-pointer transition-all duration-300 shadow-lg`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wider text-gray-300">
                  {c.title}
                </span>
                <div className="p-2 rounded-xl bg-black/20 border border-white/10">
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-3xl font-bold font-serif text-white">{c.value}</div>
                <div className="text-xs text-gray-400 mt-1 flex items-center justify-between">
                  <span>{c.subtitle}</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-1 transition" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Two Column Layout: Recent RSVPs & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent RSVPs Card */}
        <div className="p-6 rounded-2xl bg-burgundy-950/40 border border-gold-500/20 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-gold-400" />
              <h3 className="text-lg font-serif font-bold text-white">Recent RSVPs</h3>
            </div>
            <button
              onClick={() => onNavigateTab('rsvp')}
              className="text-xs text-gold-400 hover:text-gold-300 font-medium flex items-center gap-1"
            >
              View All ({stats.totalRsvps}) <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {stats.recentRsvps.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm">
              No RSVP submissions recorded yet.
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {stats.recentRsvps.slice(0, 5).map((r, i) => (
                <div key={i} className="py-3 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-white">{r.name}</div>
                    <div className="text-xs text-gray-400">
                      {r.phone} • {r.guestCount} {r.guestCount === 1 ? 'Guest' : 'Guests'}
                    </div>
                  </div>
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      r.attendanceStatus === 'CONFIRMED'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : r.attendanceStatus === 'DECLINED'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    }`}
                  >
                    {r.attendanceStatus}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Audit Activity Log Card */}
        <div className="p-6 rounded-2xl bg-burgundy-950/40 border border-gold-500/20 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-gold-400" />
              <h3 className="text-lg font-serif font-bold text-white">Admin Activity Log</h3>
            </div>
            <button
              onClick={() => onNavigateTab('activity-logs')}
              className="text-xs text-gold-400 hover:text-gold-300 font-medium flex items-center gap-1"
            >
              Full Audit Trail <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {stats.recentActivities.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm">
              No administrative activities logged yet.
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {stats.recentActivities.slice(0, 5).map((a, i) => (
                <div key={i} className="py-3 flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-gold-500/10 text-gold-400 mt-0.5">
                    <Activity className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-200 truncate">{a.details}</p>
                    <div className="text-[11px] text-gray-400 mt-0.5">
                      {a.adminEmail} • {new Date(a.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

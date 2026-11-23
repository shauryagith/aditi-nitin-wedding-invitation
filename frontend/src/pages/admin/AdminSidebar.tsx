import React from 'react';
import {
  LayoutDashboard,
  FileText,
  Sliders,
  Heart,
  Users,
  Calendar,
  BookOpen,
  Image as ImageIcon,
  Images,
  Music,
  MapPin,
  QrCode,
  CheckSquare,
  Palette,
  Globe,
  MessageSquare,
  Shield,
  Activity,
  Lock,
  Database,
  Settings,
  LogOut,
  ExternalLink,
} from 'lucide-react';
import { LordGaneshaArtwork } from '../../components/common/LordGaneshaArtwork';

export type AdminTabId =
  | 'overview'
  | 'content'
  | 'hero'
  | 'couple'
  | 'family'
  | 'story'
  | 'events'
  | 'media'
  | 'gallery'
  | 'music'
  | 'venue'
  | 'qr'
  | 'rsvp'
  | 'appearance'
  | 'seo'
  | 'whatsapp'
  | 'users'
  | 'activity-logs'
  | 'security'
  | 'backup'
  | 'settings';

interface AdminSidebarProps {
  activeTab: AdminTabId;
  onSelectTab: (tab: AdminTabId) => void;
  onLogout: () => void;
  adminName?: string;
  adminRole?: string;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onSelectTab,
  onLogout,
  adminName = 'Wedding Admin',
  adminRole = 'SUPER_ADMIN',
}) => {
  const navGroups = [
    {
      group: 'Overview',
      items: [
        { id: 'overview' as AdminTabId, label: '1. Dashboard', icon: LayoutDashboard },
      ],
    },
    {
      group: 'Website Content',
      items: [
        { id: 'content' as AdminTabId, label: '2. Website Content', icon: FileText },
        { id: 'hero' as AdminTabId, label: '3. Hero Slider', icon: Sliders },
        { id: 'couple' as AdminTabId, label: '4. Couple Details', icon: Heart },
        { id: 'family' as AdminTabId, label: '5. Family Details', icon: Users },
        { id: 'story' as AdminTabId, label: '6. Our Story (प्रीति कथा)', icon: BookOpen },
        { id: 'events' as AdminTabId, label: '7. Wedding Events', icon: Calendar },
      ],
    },
    {
      group: 'Media & Experience',
      items: [
        { id: 'media' as AdminTabId, label: '8. Media Library', icon: ImageIcon },
        { id: 'gallery' as AdminTabId, label: '9. Gallery Management', icon: Images },
        { id: 'music' as AdminTabId, label: '10. Background Music', icon: Music },
        { id: 'venue' as AdminTabId, label: '11. Venue & Location', icon: MapPin },
        { id: 'qr' as AdminTabId, label: '12. QR Code Management', icon: QrCode },
      ],
    },
    {
      group: 'Guests & Logistics',
      items: [
        { id: 'rsvp' as AdminTabId, label: '13. RSVP Management', icon: CheckSquare },
        { id: 'whatsapp' as AdminTabId, label: '14. WhatsApp Settings', icon: MessageSquare },
      ],
    },
    {
      group: 'System & Security',
      items: [
        { id: 'appearance' as AdminTabId, label: '13. Website Appearance', icon: Palette },
        { id: 'seo' as AdminTabId, label: '14. SEO Settings', icon: Globe },
        { id: 'users' as AdminTabId, label: '16. Admin Users & Roles', icon: Shield },
        { id: 'activity-logs' as AdminTabId, label: '17. Activity Logs', icon: Activity },
        { id: 'security' as AdminTabId, label: '18. Security Settings', icon: Lock },
        { id: 'backup' as AdminTabId, label: '19. Backup & Restore', icon: Database },
        { id: 'settings' as AdminTabId, label: '20. Website Settings', icon: Settings },
      ],
    },
  ];

  return (
    <aside className="w-72 bg-burgundy-950/95 border-r border-gold-500/20 flex flex-col justify-between h-screen sticky top-0 backdrop-blur-xl shrink-0 z-40">
      {/* Brand Header */}
      <div className="p-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <LordGaneshaArtwork size={38} showText={false} className="shrink-0" />
          <div className="min-w-0">
            <h1 className="font-serif font-bold text-white text-base truncate">Aditi & Nitin</h1>
            <span className="text-[10px] uppercase tracking-widest text-gold-400 font-semibold block">
              Royal CMS Admin
            </span>
          </div>
        </div>

        {/* User Chip */}
        <div className="mt-4 p-2.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
          <div className="min-w-0">
            <div className="text-xs font-semibold text-white truncate">{adminName}</div>
            <div className="text-[10px] text-gold-400 font-mono uppercase truncate">{adminRole}</div>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" title="Online" />
        </div>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5 custom-scrollbar">
        {navGroups.map((grp, gIdx) => (
          <div key={gIdx} className="space-y-1">
            <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-gold-400/70">
              {grp.group}
            </div>
            {grp.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition ${
                    isActive
                      ? 'bg-gradient-to-r from-gold-500 to-amber-600 text-burgundy-950 font-bold shadow-md shadow-gold-500/10'
                      : 'text-gray-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-burgundy-950' : 'text-gold-400'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer Controls */}
      <div className="p-4 border-t border-white/10 space-y-2">
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-black/30 hover:bg-black/50 text-gray-300 hover:text-white text-xs font-medium transition"
        >
          <ExternalLink className="w-3.5 h-3.5 text-gold-400" />
          Preview Live Website
        </a>

        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold transition"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign Out Admin
        </button>
      </div>
    </aside>
  );
};

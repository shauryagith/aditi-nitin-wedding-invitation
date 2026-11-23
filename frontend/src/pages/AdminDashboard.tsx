import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, RefreshCw } from 'lucide-react';
import { adminService, weddingService } from '../services/api';
import { weddingSyncManager } from '../utils/dataSync';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import { GuestRecord, WeddingEventItem, GalleryPhoto } from '../types/wedding';
import { INITIAL_WEDDING_EVENTS, INITIAL_GALLERY_PHOTOS } from '../config/wedding.config';

import { AdminSidebar, AdminTabId } from './admin/AdminSidebar';
import { DashboardOverview } from './admin/sections/DashboardOverview';
import { WebsiteContentSection } from './admin/sections/WebsiteContentSection';
import { HeroSliderSection } from './admin/sections/HeroSliderSection';
import { CoupleDetailsSection } from './admin/sections/CoupleDetailsSection';
import { FamilyDetailsSection } from './admin/sections/FamilyDetailsSection';
import { OurStoryManagementSection } from './admin/sections/OurStoryManagementSection';
import { WeddingEventsSection } from './admin/sections/WeddingEventsSection';
import { MediaLibrarySection } from './admin/sections/MediaLibrarySection';
import { GalleryManagementSection } from './admin/sections/GalleryManagementSection';
import { BackgroundMusicSection } from './admin/sections/BackgroundMusicSection';
import { VenueLocationSection } from './admin/sections/VenueLocationSection';
import { QRCodeSection } from './admin/sections/QRCodeSection';
import { RSVPManagementSection } from './admin/sections/RSVPManagementSection';
import { WebsiteAppearanceSection } from './admin/sections/WebsiteAppearanceSection';
import { SEOSettingsSection } from './admin/sections/SEOSettingsSection';
import { WhatsAppSettingsSection } from './admin/sections/WhatsAppSettingsSection';
import { AdminUsersSection } from './admin/sections/AdminUsersSection';
import { ActivityLogsSection } from './admin/sections/ActivityLogsSection';
import { SecuritySettingsSection } from './admin/sections/SecuritySettingsSection';
import { BackupRestoreSection } from './admin/sections/BackupRestoreSection';
import { WebsiteSettingsSection } from './admin/sections/WebsiteSettingsSection';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { admin, logout: authLogout } = useAuth();
  const { joinAdminRoom } = useSocket();
  const [activeTab, setActiveTab] = useState<AdminTabId>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    joinAdminRoom();
  }, [joinAdminRoom]);

  // Current admin session
  const [currentAdmin, setCurrentAdmin] = useState<{
    name: string;
    email: string;
    role: string;
  }>({
    name: admin?.name || 'Wedding Admin',
    email: admin?.email || 'admin@aditinitinwedding.com',
    role: admin?.role || 'SUPER_ADMIN',
  });

  useEffect(() => {
    if (admin) {
      setCurrentAdmin({
        name: admin.name,
        email: admin.email,
        role: admin.role,
      });
    }
  }, [admin]);

  // Master Data
  const [stats, setStats] = useState({
    totalRsvps: 0,
    confirmedGuests: 0,
    declinedGuests: 0,
    tentativeGuests: 0,
    expectedAttendees: 0,
    whatsappOptIns: 0,
    totalMedia: 0,
    totalMusic: 0,
    totalEvents: 4,
    totalGallery: 0,
    totalQRs: 4,
    recentRsvps: [] as GuestRecord[],
    recentActivities: [] as any[],
  });

  const [weddingContent, setWeddingContent] = useState<any>(null);
  const [events, setEvents] = useState<WeddingEventItem[]>(INITIAL_WEDDING_EVENTS);
  const [gallery, setGallery] = useState<GalleryPhoto[]>(INITIAL_GALLERY_PHOTOS);
  const [guests, setGuests] = useState<GuestRecord[]>([]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [authRes, statsRes, contentRes, eventsRes, galleryRes, guestsRes] = await Promise.allSettled([
        adminService.checkAuth(),
        adminService.getDashboardStats(),
        adminService.getWeddingContent(),
        weddingService.getEvents(),
        weddingService.getGallery(),
        adminService.getGuests(),
      ]);

      if (authRes.status === 'fulfilled' && authRes.value?.data?.admin) {
        setCurrentAdmin(authRes.value.data.admin);
      }
      if (statsRes.status === 'fulfilled' && statsRes.value?.data) {
        setStats(statsRes.value.data);
      }
      if (contentRes.status === 'fulfilled' && contentRes.value?.data) {
        setWeddingContent(contentRes.value.data);
      }
      if (eventsRes.status === 'fulfilled' && eventsRes.value) {
        setEvents(eventsRes.value);
      }
      if (galleryRes.status === 'fulfilled' && galleryRes.value) {
        setGallery(galleryRes.value);
      }
      if (guestsRes.status === 'fulfilled' && guestsRes.value?.data) {
        setGuests(guestsRes.value.data);
      }

      // Notify any open wedding website tabs of the latest master data
      weddingSyncManager.notifyUpdate('admin_refresh');
    } catch (err) {
      console.warn('Admin load data notice:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLogout = async () => {
    try {
      await authLogout();
    } finally {
      navigate('/admin/login');
    }
  };

  const handleExportCSV = () => {
    window.location.href = adminService.exportGuestsCSVUrl();
  };

  const renderActiveSection = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <DashboardOverview
            stats={stats}
            onNavigateTab={(tab) => setActiveTab(tab as AdminTabId)}
            onExportCSV={handleExportCSV}
          />
        );
      case 'content':
        return <WebsiteContentSection initialContent={weddingContent} onRefresh={loadData} />;
      case 'hero':
        return <HeroSliderSection initialSlides={weddingContent?.heroSlides || []} onRefresh={loadData} />;
      case 'couple':
        return <CoupleDetailsSection initialContent={weddingContent} onRefresh={loadData} />;
      case 'family':
        return <FamilyDetailsSection initialMembers={weddingContent?.familyMembers || []} onRefresh={loadData} />;
      case 'story':
        return (
          <OurStoryManagementSection
            storyMilestones={weddingContent?.storyMilestones || []}
            onUpdate={loadData}
          />
        );
      case 'events':
        return <WeddingEventsSection events={events} onRefresh={loadData} />;
      case 'media':
        return <MediaLibrarySection onRefreshStats={loadData} />;
      case 'gallery':
        return <GalleryManagementSection gallery={gallery} onRefresh={loadData} />;
      case 'music':
        return <BackgroundMusicSection onRefreshStats={loadData} />;
      case 'venue':
        return <VenueLocationSection initialContent={weddingContent} onRefresh={loadData} />;
      case 'qr':
        return <QRCodeSection onRefreshStats={loadData} />;
      case 'rsvp':
        return <RSVPManagementSection onRefreshStats={loadData} onExportCSV={handleExportCSV} />;
      case 'appearance':
        return <WebsiteAppearanceSection initialAppearance={weddingContent?.appearance} onRefresh={loadData} />;
      case 'seo':
        return <SEOSettingsSection initialSEO={weddingContent?.seo} onRefresh={loadData} />;
      case 'whatsapp':
        return <WhatsAppSettingsSection guests={guests} />;
      case 'users':
        return <AdminUsersSection />;
      case 'activity-logs':
        return <ActivityLogsSection />;
      case 'security':
        return <SecuritySettingsSection />;
      case 'backup':
        return <BackupRestoreSection />;
      case 'settings':
        return <WebsiteSettingsSection initialContent={weddingContent} onRefresh={loadData} />;
      default:
        return (
          <DashboardOverview
            stats={stats}
            onNavigateTab={(tab) => setActiveTab(tab as AdminTabId)}
            onExportCSV={handleExportCSV}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-white flex flex-col md:flex-row font-sans selection:bg-gold-500 selection:text-burgundy-950">
      {/* Mobile Top Navbar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-burgundy-950 border-b border-gold-500/20 sticky top-0 z-50">
        <div>
          <span className="font-serif font-bold text-white text-base">Aditi & Nitin</span>
          <span className="text-[10px] uppercase tracking-widest text-gold-400 font-semibold block">
            Royal CMS Admin
          </span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg bg-black/40 text-gold-300"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <AdminSidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          onLogout={handleLogout}
          adminName={currentAdmin.name}
          adminRole={currentAdmin.role}
        />
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-md">
          <div className="w-4/5 max-w-xs h-full bg-burgundy-950 border-r border-gold-500/30 overflow-y-auto">
            <div className="p-4 flex justify-end">
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <AdminSidebar
              activeTab={activeTab}
              onSelectTab={(tab) => {
                setActiveTab(tab);
                setMobileMenuOpen(false);
              }}
              onLogout={handleLogout}
              adminName={currentAdmin.name}
              adminRole={currentAdmin.role}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
        {loading ? (
          <div className="h-96 flex flex-col items-center justify-center gap-3 text-gold-400">
            <RefreshCw className="w-8 h-8 animate-spin" />
            <span className="text-sm font-medium tracking-wider">Synchronizing Admin CMS...</span>
          </div>
        ) : (
          renderActiveSection()
        )}
      </main>
    </div>
  );
};

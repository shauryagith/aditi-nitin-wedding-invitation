import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/common/Navbar';
import { WelcomeExperience } from '../components/welcome/WelcomeExperience';
import { HeroSection } from '../sections/HeroSection';
import { InvitationSection } from '../sections/InvitationSection';
import { CountdownSection } from '../sections/CountdownSection';
import { CoupleSection } from '../sections/CoupleSection';
import { OurStory } from '../sections/OurStory';
import { EventsSection } from '../sections/EventsSection';
import { GallerySection } from '../sections/GallerySection';
import { FamilySection } from '../sections/FamilySection';
import { VenueSection } from '../sections/VenueSection';
import { RsvpSection } from '../sections/RsvpSection';
import { Footer } from '../sections/Footer';
import { FloatingWhatsAppButton } from '../components/common/FloatingWhatsAppButton';
import { MusicPlayer } from '../components/common/MusicPlayer';
import { BackToTop } from '../components/common/BackToTop';
import { ShareModal } from '../components/common/ShareModal';
import { weddingSyncManager } from '../utils/dataSync';

export const HomePage: React.FC = () => {
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [hasEntered, setHasEntered] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('aditi_nitin_welcome_seen') === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    // Immediately check server sync status on HomePage mount
    weddingSyncManager.checkServerSync();
  }, []);

  const handleEnter = () => {
    try {
      sessionStorage.setItem('aditi_nitin_welcome_seen', 'true');
    } catch {
      // Ignored
    }
    setHasEntered(true);
  };

  const handleReplayWelcome = () => {
    try {
      sessionStorage.removeItem('aditi_nitin_welcome_seen');
    } catch {
      // Ignored
    }
    setHasEntered(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen bg-ivory text-darkBrown selection:bg-royalGold selection:text-deepBurgundy">
      {/* Cinematic Royal Welcome Experience Overlay */}
      {!hasEntered && (
        <WelcomeExperience
          onComplete={handleEnter}
          onSkip={handleEnter}
        />
      )}

      {/* Sticky Royal Navigation Bar */}
      <Navbar
        onOpenShareModal={() => setShareModalOpen(true)}
        onReplayWelcome={handleReplayWelcome}
      />

      {/* Main Wedding Sections */}
      <main>
        {/* Full-width Cinematic Hero Slider */}
        <HeroSection onOpenShareModal={() => setShareModalOpen(true)} />

        {/* Traditional Royal Invitation */}
        <InvitationSection />

        {/* Auspicious Live Countdown */}
        <CountdownSection />

        {/* Royal Couple Profiles */}
        <CoupleSection />

        {/* Romantic Couple Story Milestones */}
        <OurStory />

        {/* Four Sacred Wedding Ceremonies (11 Dec 2026) */}
        <EventsSection />

        {/* Photo Gallery with Lightbox */}
        <GallerySection />

        {/* Two Loving Families (Bride & Groom) */}
        <FamilySection />

        {/* Wedding Venue (Gorakhpur Address & Google Maps) */}
        <VenueSection />

        {/* RSVP Section */}
        <RsvpSection />
      </main>

      {/* Royal Footer */}
      <Footer onReplayWelcome={handleReplayWelcome} />

      {/* Fixed WhatsApp Click-to-Chat & Assistant */}
      <FloatingWhatsAppButton />

      {/* Floating Indian Wedding Instrumental Music Player */}
      <MusicPlayer />

      {/* Smooth Back to Top Button */}
      <BackToTop />

      {/* Share / QR Code Modal */}
      <ShareModal isOpen={shareModalOpen} onClose={() => setShareModalOpen(false)} />
    </div>
  );
};

export default HomePage;

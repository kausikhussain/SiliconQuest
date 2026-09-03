import React, { useState, useEffect } from 'react';
import { ScrollScrubIntro } from './components/ScrollScrubIntro';
import { Navigation } from './components/Navigation';
import { HeroSection } from './components/HeroSection';
import { AboutManifesto } from './components/AboutManifesto';
import { DisciplinesSection } from './components/DisciplinesSection';
import { EventShowcase } from './components/EventShowcase';

import { EditorialGallery } from './components/EditorialGallery';
import { TeamSection } from './components/TeamSection';
import { KnowledgeVault } from './components/KnowledgeVault';
import { RegistrationModal } from './components/RegistrationModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { CustomCursor } from './components/CustomCursor';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem('sqc_theme');
      return saved === 'light' || saved === 'dark' ? saved : 'dark';
    } catch {
      return 'dark';
    }
  });

  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('sqc_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleReplayIntro = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSkipIntro = () => {
    const mainEl = document.getElementById('main-content');
    if (mainEl) {
      mainEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      {/* Background Ambience Layers */}
      <div className="bg-atmosphere" />
      <div className="bg-grid-pattern" />

      {/* Custom Magnetic Cursor */}
      <CustomCursor />

      {/* 01 — FULLSCREEN TRUE SCROLL-SCRUBBED INTRO */}
      <ScrollScrubIntro onSkip={handleSkipIntro} />

      {/* Navigation (Sticky & Fixed on Homepage) */}
      <Navigation
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenJoinModal={() => setIsJoinModalOpen(true)}
        onOpenAdminModal={() => setIsAdminModalOpen(true)}
        onReplayIntro={handleReplayIntro}
      />

      {/* Main Website Experience */}
      <div id="main-content" style={{ position: 'relative', zIndex: 1 }}>
        <main>
          {/* 02 — CLUB IDENTITY & HERO TRANSITION */}
          <HeroSection theme={theme} onOpenJoinModal={() => setIsJoinModalOpen(true)} />

          {/* 03 — MANIFESTO & 4 INTELLECTUAL PILLARS */}
          <AboutManifesto />

          {/* 04 — WHAT WE DO / DISCIPLINES */}
          <DisciplinesSection />

          {/* 05 — FLAGSHIP TOURNAMENTS & CHAMPIONSHIP ARCHIVES */}
          <EventShowcase onOpenRegisterModal={() => setIsJoinModalOpen(true)} />

          {/* 06 — EDITORIAL GALLERY */}
          <EditorialGallery />

          {/* 07 — TEAM & LEADERSHIP */}
          <TeamSection />

          {/* 09 — KNOWLEDGE VAULT & RESOURCES */}
          <KnowledgeVault />
        </main>

        {/* 10 — FOOTER */}
        <Footer onOpenAdminModal={() => setIsAdminModalOpen(true)} />
      </div>

      {/* 11 — OFFICIAL QUIZ CLUB REGISTRATION MODAL */}
      <RegistrationModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
      />

      {/* 12 — PROTECTED CLUB ADMIN DASHBOARD */}
      <AdminDashboardModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
      />
    </div>
  );
};

export default App;

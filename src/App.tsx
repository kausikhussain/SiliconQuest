import React, { useState, useEffect } from 'react';
import { LoginPortal } from './components/LoginPortal';
import { ScrollScrubIntro } from './components/ScrollScrubIntro';
import { Navigation } from './components/Navigation';
import { HeroSection } from './components/HeroSection';
import { AboutManifesto } from './components/AboutManifesto';
import { DisciplinesSection } from './components/DisciplinesSection';
import { EventShowcase } from './components/EventShowcase';
import { PodiumLeaderboard } from './components/PodiumLeaderboard';
import { EditorialGallery } from './components/EditorialGallery';
import { TeamSection } from './components/TeamSection';
import { KnowledgeVault } from './components/KnowledgeVault';
import { JoinModal } from './components/JoinModal';
import { CustomCursor } from './components/CustomCursor';
import { Footer } from './components/Footer';

interface UserData {
  name: string;
  sicId: string;
  role: string;
}

export const App: React.FC = () => {
  const [user, setUser] = useState<UserData | null>(() => {
    try {
      const saved = sessionStorage.getItem('sqc_user_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem('sqc_theme');
      return saved === 'light' || saved === 'dark' ? saved : 'dark';
    } catch {
      return 'dark';
    }
  });

  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('sqc_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleLoginSuccess = (userData: UserData) => {
    setUser(userData);
    sessionStorage.setItem('sqc_user_session', JSON.stringify(userData));
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  };

  const handleLogout = () => {
    sessionStorage.removeItem('sqc_user_session');
    setUser(null);
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

  // If not authenticated, display the Login / Access Portal
  if (!user) {
    return (
      <div style={{ position: 'relative', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
        <CustomCursor />
        <LoginPortal onLoginSuccess={handleLoginSuccess} />
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      {/* Background Ambience Layers */}
      <div className="bg-atmosphere" />
      <div className="bg-grid-pattern" />

      {/* Custom Magnetic Cursor */}
      <CustomCursor />

      {/* 01 — FULLSCREEN POST-LOGIN TRUE SCROLL-SCRUBBED INTRO */}
      <ScrollScrubIntro onSkip={handleSkipIntro} />

      {/* Navigation (Sticky & Fixed on Homepage) */}
      <Navigation
        user={user}
        theme={theme}
        onToggleTheme={toggleTheme}
        onLogout={handleLogout}
        onOpenJoinModal={() => setIsJoinModalOpen(true)}
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

          {/* 05 — FLAGSHIP TOURNAMENTS & CALENDAR */}
          <EventShowcase onOpenRegisterModal={() => setIsJoinModalOpen(true)} />

          {/* 06 — CHAMPIONSHIP LAURELS & HALL OF FAME */}
          <PodiumLeaderboard />

          {/* 07 — EDITORIAL GALLERY */}
          <EditorialGallery />

          {/* 08 — TEAM & LEADERSHIP */}
          <TeamSection />

          {/* 09 — KNOWLEDGE VAULT & RESOURCES */}
          <KnowledgeVault />
        </main>

        {/* 11 — FOOTER */}
        <Footer />
      </div>

      {/* 10 — JOIN CLUB / AUDITION MODAL */}
      <JoinModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
      />
    </div>
  );
};

export default App;

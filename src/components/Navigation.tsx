import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Menu, X, Sparkles, RotateCcw, LogOut, UserCheck, Sun, Moon, ArrowRight, Lock } from 'lucide-react';
import { sound } from '../utils/soundEngine';

interface NavigationProps {
  onOpenJoinModal: () => void;
  onOpenAdminModal?: () => void;
  onReplayIntro: () => void;
  user?: { name: string; sicId: string; role: string } | null;
  onLogout?: () => void;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  onOpenJoinModal,
  onOpenAdminModal,
  onReplayIntro,
  user,
  onLogout,
  theme = 'dark',
  onToggleTheme
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(sound.getIsAudioActive());

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const toggleAudio = () => {
    const nextState = sound.toggleMute();
    setIsAudioOn(nextState);
  };

  const navLinks = [
    { label: 'About', href: '#about', num: '01' },
    { label: 'Disciplines', href: '#disciplines', num: '02' },
    { label: 'Events', href: '#events', num: '03' },
    { label: 'Laurels', href: '#laurels', num: '04' },
    { label: 'Gallery', href: '#gallery', num: '05' },
    { label: 'Team', href: '#team', num: '06' },
    { label: 'Vault', href: '#vault', num: '07' }
  ];

  const handleLinkClick = (href: string) => {
    sound.playClick();
    setIsMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          padding: isScrolled
            ? 'calc(8px + var(--sat)) 12px 8px'
            : 'calc(14px + var(--sat)) 16px 14px',
          transition: 'padding 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        className="main-navigation-header"
      >
        <div
          style={{
            maxWidth: '1320px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: isScrolled ? '8px 16px' : '12px 20px',
            background: 'var(--nav-bg)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid var(--nav-border)',
            borderRadius: isScrolled ? '14px' : '18px',
            boxShadow: isScrolled ? 'var(--shadow-elevated)' : 'var(--shadow-subtle)',
            transition: 'all 0.35s ease'
          }}
          className="main-navigation-pill"
        >
          {/* Logo Brand */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
              sound.playClick();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              textDecoration: 'none',
              color: 'var(--text-primary)',
              flexShrink: 0
            }}
          >
            {/* Geometric Hexagon Glyph */}
            <div
              style={{
                width: '28px',
                height: '28px',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
                <polygon
                  points="50,5 90,27 90,73 50,95 10,73 10,27"
                  fill="none"
                  stroke="var(--accent-cyan)"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                <polygon
                  points="50,25 75,40 75,60 50,75 25,60 25,40"
                  fill="var(--accent-cyan)"
                  opacity="0.8"
                />
              </svg>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span
                className="font-display"
                style={{
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  letterSpacing: '0.03em',
                  color: 'var(--text-primary)',
                  lineHeight: 1.15
                }}
              >
                SILICON <span style={{ color: 'var(--accent-cyan)' }}>QUIZ</span>
              </span>
              <span
                className="font-mono"
                style={{
                  fontSize: '0.58rem',
                  color: 'var(--text-muted)',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase'
                }}
              >
                SOCIETY · 2026
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '24px'
            }}
            className="desktop-nav-links"
          >
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleLinkClick(link.href)}
                onMouseEnter={() => sound.playHover()}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  letterSpacing: '0.02em',
                  cursor: 'pointer',
                  padding: '6px 4px',
                  transition: 'color 0.2s ease',
                  position: 'relative'
                }}
                className="nav-link-item"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            {/* User Badge on Desktop */}
            {user && (
              <div
                style={{
                  display: 'none',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '999px',
                  background: 'var(--accent-cyan-glow)',
                  border: '1px solid var(--border-accent)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  color: 'var(--accent-cyan)'
                }}
                className="desktop-user-badge"
              >
                <UserCheck size={13} />
                <span>{user.sicId}</span>
              </div>
            )}

            {/* Light / Dark Mode Toggle (Always Visible & Accessible on Mobile & Desktop) */}
            {onToggleTheme && (
              <button
                onClick={() => {
                  sound.playClick();
                  onToggleTheme();
                }}
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                aria-label="Toggle Theme"
                style={{
                  background: 'var(--btn-secondary-bg)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-secondary)',
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  flexShrink: 0
                }}
                onMouseEnter={() => sound.playHover()}
              >
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              </button>
            )}

            {/* Sound Toggle (Desktop and Large Tablets) */}
            <button
              onClick={toggleAudio}
              title={isAudioOn ? 'Mute Sound Effects' : 'Enable Audio Feedback'}
              aria-label="Toggle Sound Effects"
              style={{
                background: isAudioOn ? 'var(--accent-cyan-glow)' : 'var(--btn-secondary-bg)',
                border: isAudioOn ? '1px solid var(--border-accent)' : '1px solid var(--border-subtle)',
                color: isAudioOn ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                display: 'none',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                flexShrink: 0
              }}
              className="desktop-sound-btn"
              onMouseEnter={() => sound.playHover()}
            >
              {isAudioOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>

            {/* Replay Fullscreen Intro (Desktop) */}
            <button
              onClick={() => {
                sound.playClick();
                onReplayIntro();
              }}
              title="Replay Fullscreen Intro"
              aria-label="Replay Intro"
              style={{
                background: 'var(--btn-secondary-bg)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                display: 'none',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                flexShrink: 0
              }}
              className="desktop-replay-btn"
              onMouseEnter={() => sound.playHover()}
            >
              <RotateCcw size={16} />
            </button>

            {/* Logout Button (Desktop) */}
            {onLogout && (
              <button
                onClick={() => {
                  sound.playClick();
                  onLogout();
                }}
                title="Sign Out of Portal"
                aria-label="Logout"
                style={{
                  background: 'var(--btn-secondary-bg)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-muted)',
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  display: 'none',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  flexShrink: 0
                }}
                className="desktop-logout-btn"
                onMouseEnter={(e) => {
                  sound.playHover();
                  e.currentTarget.style.color = 'var(--accent-rose)';
                  e.currentTarget.style.borderColor = 'var(--accent-rose)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--text-muted)';
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                }}
              >
                <LogOut size={15} />
              </button>
            )}

            {/* Admin Console Access Button (Desktop) */}
            {onOpenAdminModal && (
              <button
                onClick={() => {
                  sound.playClick();
                  onOpenAdminModal();
                }}
                title="Quiz Club Admin Management Console"
                aria-label="Admin Portal"
                style={{
                  background: 'var(--btn-secondary-bg)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-muted)',
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  display: 'none',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  flexShrink: 0
                }}
                className="desktop-admin-btn"
                onMouseEnter={(e) => {
                  sound.playHover();
                  e.currentTarget.style.color = 'var(--accent-cyan)';
                  e.currentTarget.style.borderColor = 'var(--accent-cyan)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--text-muted)';
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                }}
              >
                <Lock size={15} />
              </button>
            )}

            {/* Join Club Primary CTA (Desktop and Large screens) */}
            <button
              onClick={() => {
                sound.playClick();
                onOpenJoinModal();
              }}
              className="btn-primary desktop-join-btn"
              style={{
                display: 'none',
                padding: '8px 18px',
                fontSize: '0.78rem',
                letterSpacing: '0.06em'
              }}
              onMouseEnter={() => sound.playHover()}
            >
              <Sparkles size={13} />
              JOIN QUIZ CLUB
            </button>

            {/* Mobile Menu Toggle Button (>=44px touch target) */}
            <button
              onClick={() => {
                sound.playClick();
                setIsMobileMenuOpen(!isMobileMenuOpen);
              }}
              aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '42px',
                height: '42px',
                background: isMobileMenuOpen ? 'var(--accent-cyan-glow)' : 'var(--btn-secondary-bg)',
                border: `1px solid ${isMobileMenuOpen ? 'var(--border-accent)' : 'var(--border-subtle)'}`,
                borderRadius: '10px',
                color: isMobileMenuOpen ? 'var(--accent-cyan)' : 'var(--text-primary)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                flexShrink: 0
              }}
              className="mobile-menu-btn"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Full-Screen Ultra-Premium Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999,
            backgroundColor: 'var(--bg-primary)',
            backdropFilter: 'blur(28px)',
            WebkitBackdropFilter: 'blur(28px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: 'calc(80px + var(--sat)) 24px calc(24px + var(--sab))',
            overflowY: 'auto',
            animation: 'fadeIn 0.22s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          {/* Top Brand & Links Section */}
          <div style={{ maxWidth: '440px', margin: '0 auto', width: '100%' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '20px',
                paddingBottom: '12px',
                borderBottom: '1px solid var(--border-subtle)'
              }}
            >
              <span className="section-tagline" style={{ margin: 0 }}>
                EXPLORE SECTIONS
              </span>
              {user && (
                <span
                  className="font-mono"
                  style={{
                    fontSize: '0.7rem',
                    color: 'var(--accent-cyan)',
                    background: 'var(--accent-cyan-glow)',
                    padding: '4px 10px',
                    borderRadius: '999px',
                    border: '1px solid var(--border-accent)'
                  }}
                >
                  {user.sicId}
                </span>
              )}
            </div>

            {/* Links List with Rich Typography */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleLinkClick(link.href)}
                  style={{
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(1.4rem, 5.5vw, 1.85rem)',
                    fontWeight: 700,
                    cursor: 'pointer',
                    padding: '10px 0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={() => sound.playHover()}
                >
                  <span>{link.label}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      className="font-mono"
                      style={{
                        fontSize: '0.72rem',
                        color: 'var(--accent-cyan)',
                        opacity: 0.8
                      }}
                    >
                      {link.num}
                    </span>
                    <ArrowRight size={16} color="var(--accent-cyan)" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Bottom Action Clusters */}
          <div
            style={{
              maxWidth: '440px',
              margin: '24px auto 0',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}
          >
            <button
              onClick={() => {
                sound.playClick();
                setIsMobileMenuOpen(false);
                onOpenJoinModal();
              }}
              className="btn-cyan"
              style={{ width: '100%', padding: '14px', fontSize: '0.85rem' }}
            >
              <Sparkles size={16} />
              <span>JOIN QUIZ CLUB</span>
            </button>

            {/* Mobile Utility Controls Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button
                onClick={() => {
                  sound.playClick();
                  toggleAudio();
                }}
                className="btn-secondary"
                style={{
                  padding: '12px',
                  fontSize: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                {isAudioOn ? <Volume2 size={15} color="var(--accent-cyan)" /> : <VolumeX size={15} />}
                <span>{isAudioOn ? 'AUDIO ON' : 'AUDIO MUTED'}</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  setIsMobileMenuOpen(false);
                  onReplayIntro();
                }}
                className="btn-secondary"
                style={{
                  padding: '12px',
                  fontSize: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <RotateCcw size={14} />
                <span>REPLAY INTRO</span>
              </button>
            </div>

            {/* Admin Console Access in Mobile Menu */}
            {onOpenAdminModal && (
              <button
                onClick={() => {
                  sound.playClick();
                  setIsMobileMenuOpen(false);
                  onOpenAdminModal();
                }}
                className="btn-secondary"
                style={{
                  width: '100%',
                  padding: '11px',
                  fontSize: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  borderColor: 'rgba(0, 242, 254, 0.25)',
                  color: 'var(--accent-cyan)'
                }}
              >
                <Lock size={14} />
                <span>QUIZ CLUB ADMIN PORTAL</span>
              </button>
            )}

            {onLogout && (
              <button
                onClick={() => {
                  sound.playClick();
                  setIsMobileMenuOpen(false);
                  onLogout();
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  padding: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <LogOut size={13} />
                <span>SIGN OUT OF PORTAL</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Inline styles for responsive visibility */}
      <style>{`
        @media (min-width: 768px) {
          .main-navigation-header {
            padding: 16px 24px !important;
          }
          .desktop-sound-btn,
          .desktop-replay-btn {
            display: flex !important;
          }
        }
        @media (min-width: 1024px) {
          .desktop-nav-links {
            display: flex !important;
          }
          .desktop-user-badge {
            display: inline-flex !important;
          }
          .desktop-join-btn {
            display: inline-flex !important;
          }
          .desktop-admin-btn {
            display: flex !important;
          }
          .desktop-logout-btn {
            display: flex !important;
          }
          .mobile-menu-btn {
            display: none !important;
          }
        }
        .nav-link-item:hover {
          color: var(--accent-cyan) !important;
        }
      `}</style>
    </>
  );
};

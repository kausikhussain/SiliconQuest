import React from 'react';
import { ArrowRight, Trophy, Users, Zap, Compass, Award, Sparkles } from 'lucide-react';
import { Hero3DCanvas } from './Hero3DCanvas';
import { CLUB_INFO } from '../data/clubData';
import { sound } from '../utils/soundEngine';

interface HeroSectionProps {
  onOpenJoinModal: () => void;
  theme?: 'dark' | 'light';
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenJoinModal, theme = 'dark' }) => {
  const scrollToSection = (id: string) => {
    sound.playClick();
    const el = document.querySelector(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="identity"
      style={{
        position: 'relative',
        minHeight: '100dvh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        overflow: 'hidden',
        paddingTop: 'calc(96px + var(--sat))',
        paddingBottom: '60px'
      }}
      className="hero-main-section"
    >
      {/* 3D Interactive WebGL Canvas in Background */}
      <Hero3DCanvas interactive={true} theme={theme} />

      {/* Radial Gradient Vignette for Depth & Readability */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            theme === 'light'
              ? 'radial-gradient(ellipse at 50% 50%, rgba(248, 249, 252, 0.45) 0%, rgba(248, 249, 252, 0.94) 80%, #f8f9fc 100%)'
              : 'radial-gradient(ellipse at 50% 50%, rgba(7, 9, 14, 0.35) 0%, rgba(7, 9, 14, 0.92) 80%, #07090e 100%)',
          pointerEvents: 'none',
          zIndex: 1
        }}
      />

      <div className="section-container" style={{ zIndex: 10, position: 'relative' }}>
        <div style={{ maxWidth: '1040px' }}>
          {/* Institutional Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              borderRadius: '999px',
              backgroundColor: 'var(--bg-glass)',
              border: '1px solid var(--border-subtle)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              boxShadow: 'var(--shadow-subtle)',
              marginBottom: '20px',
              maxWidth: '100%'
            }}
          >
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: 'var(--accent-cyan)',
                boxShadow: '0 0 10px var(--accent-cyan)',
                flexShrink: 0
              }}
            />
            <span
              className="font-mono"
              style={{
                fontSize: 'clamp(0.65rem, 1.8vw, 0.75rem)',
                letterSpacing: '0.1em',
                color: 'var(--text-secondary)',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              SILICON INSTITUTE OF TECHNOLOGY · SAMBALPUR, ODISHA
            </span>
          </div>

          {/* Large Editorial Headline */}
          <h1
            className="font-display"
            style={{
              fontSize: 'clamp(2.6rem, 8.5vw, 6.4rem)',
              fontWeight: 800,
              lineHeight: 0.98,
              letterSpacing: '-0.04em',
              marginBottom: '20px',
              textTransform: 'uppercase',
              position: 'relative',
              zIndex: 12
            }}
          >
            <span className="hero-title-main">SILICON</span>
            <span className="hero-title-sub">QUIZ CLUB</span>
          </h1>

          {/* Punchline Statement */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <div
              style={{
                width: '28px',
                height: '2px',
                backgroundColor: 'var(--accent-cyan)',
                boxShadow: '0 0 8px var(--accent-cyan)',
                flexShrink: 0
              }}
            />
            <p
              className="font-mono"
              style={{
                fontSize: 'clamp(0.85rem, 2.2vw, 1.35rem)',
                fontWeight: 600,
                letterSpacing: '0.12em',
                color: 'var(--text-primary)',
                textTransform: 'uppercase'
              }}
            >
              Where Curiosity Becomes Competition
            </p>
          </div>

          <p
            className="section-subtitle"
            style={{
              fontSize: 'clamp(0.95rem, 1.5vw, 1.25rem)',
              lineHeight: 1.65,
              color: 'var(--text-secondary)',
              marginBottom: '36px',
              maxWidth: '740px'
            }}
          >
            The premier intellectual society of Silicon Institute of Technology, Sambalpur, Odisha. Pushing the
            frontiers of curiosity, analytical speed, and academic championship excellence.
          </p>

          {/* Action CTAs Stack */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '48px'
            }}
            className="hero-action-buttons"
          >
            <button
              onClick={() => scrollToSection('#events')}
              className="btn-primary hero-btn"
              onMouseEnter={() => sound.playHover()}
            >
              <Compass size={16} />
              <span>EXPLORE ARENAS</span>
            </button>

            <button
              onClick={() => scrollToSection('#laurels')}
              className="btn-secondary hero-btn"
              onMouseEnter={() => sound.playHover()}
            >
              <Award size={16} />
              <span>HALL OF FAME</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onOpenJoinModal();
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                background: 'transparent',
                border: 'none',
                color: 'var(--accent-cyan)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.825rem',
                fontWeight: 600,
                letterSpacing: '0.06em',
                cursor: 'pointer',
                padding: '10px 14px',
                textTransform: 'uppercase',
                minHeight: '44px'
              }}
              className="hero-audition-btn"
              onMouseEnter={() => sound.playHover()}
            >
              <span>JOIN QUIZ CLUB</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Real-time Telemetry Stat Strip (Symmetric 2x2 on Mobile, 4-col on Desktop) */}
          <div
            className="glass-panel hero-stats-grid"
            style={{
              display: 'grid',
              gap: '16px',
              padding: '20px 24px',
              borderRadius: '18px'
            }}
          >
            {CLUB_INFO.stats.map((stat, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '3px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {i === 0 && <Zap size={14} color="var(--accent-cyan)" />}
                  {i === 1 && <Users size={14} color="#38bdf8" />}
                  {i === 2 && <Trophy size={14} color="#f59e0b" />}
                  {i === 3 && <Sparkles size={14} color="#a5b4fc" />}
                  <span
                    className="font-display"
                    style={{
                      fontSize: 'clamp(1.4rem, 3.5vw, 1.85rem)',
                      fontWeight: 800,
                      color: 'var(--text-primary)',
                      letterSpacing: '-0.02em'
                    }}
                  >
                    {stat.value}
                  </span>
                </div>
                <span
                  className="font-mono"
                  style={{
                    fontSize: '0.68rem',
                    color: 'var(--text-muted)',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase'
                  }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .hero-stats-grid {
          grid-template-columns: repeat(2, 1fr);
        }
        @media (min-width: 768px) {
          .hero-main-section {
            padding-top: 120px;
            padding-bottom: 80px;
          }
          .hero-stats-grid {
            grid-template-columns: repeat(4, 1fr);
            padding: 24px 28px;
          }
        }
        @media (max-width: 480px) {
          .hero-action-buttons {
            flex-direction: column;
            align-items: stretch;
          }
          .hero-btn {
            width: 100%;
          }
          .hero-audition-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
};

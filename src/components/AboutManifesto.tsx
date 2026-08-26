import React from 'react';
import { Target, Cpu, Flame, Network } from 'lucide-react';
import { sound } from '../utils/soundEngine';

export const AboutManifesto: React.FC = () => {
  const pillars = [
    {
      num: '01',
      title: 'RADICAL CURIOSITY',
      desc: 'We question the axioms. From quantum anomalies to obscure geopolitical treaties, every fact is an open invitation to investigate deeper.',
      icon: Target
    },
    {
      num: '02',
      title: 'LATERAL SYNTHESIS',
      desc: 'True intellect does not store trivia in silos; it weaves seamless mental bridges connecting art, astrophysics, algorithms, and philosophy.',
      icon: Cpu
    },
    {
      num: '03',
      title: 'HIGH-VELOCITY COMBAT',
      desc: 'Under the glare of the arena spotlights and a live ticking countdown, we train minds to calculate, deduce, and buzz with supreme precision.',
      icon: Flame
    },
    {
      num: '04',
      title: 'COMMUNITY & LEGACY',
      desc: 'Fostering generation after generation of quizmasters, researchers, and lateral thinkers across the Silicon academic ecosystem.',
      icon: Network
    }
  ];

  return (
    <section
      id="about"
      style={{
        padding: '80px 0',
        position: 'relative',
        backgroundColor: 'var(--bg-primary)',
        borderTop: '1px solid var(--border-subtle)'
      }}
      className="about-manifesto-section"
    >
      <div className="section-container">
        {/* Header Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '32px',
            alignItems: 'end',
            marginBottom: '48px'
          }}
          className="about-header-grid"
        >
          <div>
            <div className="section-tagline">03 · MANIFESTO</div>
            <h2 className="section-title">
              ARCHITECTING <br />
              <span
                style={{
                  background: 'linear-gradient(90deg, var(--accent-cyan), var(--accent-indigo))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                INTELLECTUAL AGILITY.
              </span>
            </h2>
          </div>

          <div>
            <p
              style={{
                fontSize: 'clamp(0.95rem, 1.4vw, 1.15rem)',
                lineHeight: 1.65,
                color: 'var(--text-secondary)',
                marginBottom: '16px'
              }}
            >
              Born inside the halls of <strong style={{ color: 'var(--text-primary)' }}>Silicon Institute of Technology</strong>, the Silicon Quiz Club is not an extracurricular pastime. It is a high-performance intellectual workshop where intuition meets ruthless analytical rigor.
            </p>
            <p
              className="font-mono"
              style={{
                fontSize: '0.75rem',
                color: 'var(--accent-cyan)',
                letterSpacing: '0.08em'
              }}
            >
              ESTABLISHED 2018 · SAMBALPUR & BHUBANESWAR CAMPUS
            </p>
          </div>
        </div>

        {/* 4 Pillars Editorial Grid */}
        <div
          style={{
            display: 'grid',
            gap: '16px'
          }}
          className="pillars-grid"
        >
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="glass-panel"
                style={{
                  padding: '28px 24px',
                  borderRadius: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={() => sound.playHover()}
              >
                {/* Subtle Pillar Number */}
                <div
                  className="font-mono"
                  style={{
                    position: 'absolute',
                    top: '16px',
                    right: '20px',
                    fontSize: '1.6rem',
                    fontWeight: 800,
                    color: 'var(--border-medium)',
                    userSelect: 'none'
                  }}
                >
                  {item.num}
                </div>

                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    background: 'var(--accent-cyan-glow)',
                    border: '1px solid var(--border-accent)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent-cyan)'
                  }}
                >
                  <Icon size={19} />
                </div>

                <h3
                  className="font-display"
                  style={{
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    letterSpacing: '-0.02em',
                    marginTop: '4px'
                  }}
                >
                  {item.title}
                </h3>

                <p
                  style={{
                    fontSize: '0.875rem',
                    lineHeight: 1.6,
                    color: 'var(--text-secondary)'
                  }}
                >
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .pillars-grid {
          grid-template-columns: 1fr;
        }
        @media (min-width: 600px) {
          .pillars-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
          }
        }
        @media (min-width: 1024px) {
          .about-manifesto-section {
            padding: 120px 0;
          }
          .about-header-grid {
            gap: 48px;
            margin-bottom: 72px;
          }
          .pillars-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 24px;
          }
        }
      `}</style>
    </section>
  );
};

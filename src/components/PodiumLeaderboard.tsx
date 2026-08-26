import React from 'react';
import { Trophy } from 'lucide-react';
import { sound } from '../utils/soundEngine';

export const PodiumLeaderboard: React.FC = () => {
  const podiumLaureates = [
    {
      place: '1ST PLACE · GOLD LAUREL',
      team: 'Priyabrata Pal & Ayush Jena',
      syndicate: 'Chronos Syndicate',
      score: '1,840 PTS',
      tournament: 'College Quiz League Championship',
      image: '/assets/images/WhatsApp Image 2026-08-23 at 12.39.08 AM.jpeg',
      color: '#f59e0b',
      borderGlow: 'rgba(245, 158, 11, 0.4)'
    },
    {
      place: '2ND PLACE · SILVER LAUREL',
      team: 'Sanya Sonalika & Saundarya Sinha',
      syndicate: 'Nova Duo',
      score: '1,710 PTS',
      tournament: 'College Quiz League Championship',
      image: '/assets/images/WhatsApp Image 2026-08-23 at 12.39.14 AM.jpeg',
      color: '#94a3b8',
      borderGlow: 'rgba(148, 163, 184, 0.4)'
    },
    {
      place: '3RD PLACE · BRONZE LAUREL',
      team: 'Satyam Chandra & ARYAN DEO',
      syndicate: 'Apex Vanguard',
      score: '1,650 PTS',
      tournament: 'College Quiz League Championship',
      image: '/assets/images/WhatsApp Image 2026-08-23 at 12.39.09 AM.jpeg',
      color: '#d97706',
      borderGlow: 'rgba(217, 119, 6, 0.4)'
    }
  ];

  return (
    <section
      id="laurels"
      style={{
        padding: '80px 0',
        backgroundColor: 'var(--bg-primary)',
        position: 'relative',
        borderTop: '1px solid var(--border-subtle)'
      }}
      className="podium-main-section"
    >
      <div className="section-container">
        {/* Section Header */}
        <div style={{ marginBottom: '40px' }} className="podium-header">
          <div className="section-tagline">06 · HALL OF FAME</div>
          <h2 className="section-title">
            CHAMPIONSHIP <span style={{ color: 'var(--accent-cyan)' }}>LAURELS</span>
          </h2>
          <p className="section-subtitle">
            Honoring the masterminds and varsity teams who conquered inter-collegiate championships and lateral elimination finals.
          </p>
        </div>

        {/* 3 Authentic Championship Podium Cards */}
        <div
          style={{
            display: 'grid',
            gap: '20px'
          }}
          className="podium-cards-grid"
        >
          {podiumLaureates.map((item, idx) => (
            <div
              key={idx}
              className="glass-panel"
              style={{
                borderRadius: '20px',
                overflow: 'hidden',
                border: `1px solid ${item.borderGlow}`,
                boxShadow: `0 15px 40px -15px rgba(0, 0, 0, 0.4), 0 0 25px -10px ${item.borderGlow}`,
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.3s ease'
              }}
              onMouseEnter={() => sound.playHover()}
            >
              {/* Photo Box */}
              <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                <img
                  src={item.image}
                  alt={item.team}
                  className="img-hover-shine"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                  loading="lazy"
                />
                <div
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    padding: '5px 12px',
                    borderRadius: '999px',
                    backgroundColor: 'rgba(7, 9, 14, 0.88)',
                    backdropFilter: 'blur(10px)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    color: item.color,
                    border: `1px solid ${item.borderGlow}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Trophy size={12} color={item.color} />
                  <span>{item.place}</span>
                </div>
              </div>

              {/* Card Body */}
              <div style={{ padding: '22px 20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <span
                  className="font-mono"
                  style={{
                    fontSize: '0.7rem',
                    color: 'var(--text-muted)',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    marginBottom: '6px'
                  }}
                >
                  {item.tournament}
                </span>

                <h3
                  className="font-display"
                  style={{
                    fontSize: '1.3rem',
                    fontWeight: 800,
                    color: 'var(--text-primary)',
                    marginBottom: '4px'
                  }}
                >
                  {item.team}
                </h3>

                <p
                  style={{
                    fontSize: '0.85rem',
                    color: 'var(--text-secondary)',
                    marginBottom: '16px'
                  }}
                >
                  Syndicate: <strong style={{ color: 'var(--text-primary)' }}>{item.syndicate}</strong>
                </p>

                <div
                  style={{
                    marginTop: 'auto',
                    paddingTop: '14px',
                    borderTop: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <span className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    FINAL SCORE
                  </span>
                  <span
                    className="font-mono"
                    style={{
                      fontSize: '1.05rem',
                      fontWeight: 800,
                      color: item.color,
                      letterSpacing: '0.04em'
                    }}
                  >
                    {item.score}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .podium-cards-grid {
          grid-template-columns: 1fr;
        }
        @media (min-width: 640px) {
          .podium-cards-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 1024px) {
          .podium-main-section {
            padding: 120px 0;
          }
          .podium-header {
            margin-bottom: 64px;
          }
          .podium-cards-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 24px;
            margin-bottom: 72px;
          }
        }
      `}</style>
    </section>
  );
};

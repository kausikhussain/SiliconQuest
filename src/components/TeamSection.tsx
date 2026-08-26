import React from 'react';
import { Sparkles } from 'lucide-react';
import { TEAM_PROFILES } from '../data/clubData';
import { sound } from '../utils/soundEngine';

export const TeamSection: React.FC = () => {
  return (
    <section
      id="team"
      style={{
        padding: '80px 0',
        backgroundColor: 'var(--bg-primary)',
        position: 'relative',
        borderTop: '1px solid var(--border-subtle)'
      }}
      className="team-main-section"
    >
      <div className="section-container">
        {/* Section Header */}
        <div style={{ marginBottom: '40px' }} className="team-header">
          <div className="section-tagline">08 · LEADERSHIP & FACULTY</div>
          <h2 className="section-title">
            THE INTELLECTUAL <span style={{ color: 'var(--accent-cyan)' }}>SYNDICATE</span>
          </h2>
          <p className="section-subtitle">
            Curators, tournament arbiters, and faculty mentors steering the analytical direction of Silicon Quiz Club.
          </p>
        </div>

        {/* Editorial Profile Grid */}
        <div
          style={{
            display: 'grid',
            gap: '24px'
          }}
          className="team-profiles-grid"
        >
          {TEAM_PROFILES.map((member) => (
            <div
              key={member.id}
              className="glass-panel"
              style={{
                borderRadius: '20px',
                overflow: 'hidden',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={() => sound.playHover()}
            >
              {/* Portrait Image */}
              <div
                style={{
                  position: 'relative',
                  height: '280px',
                  overflow: 'hidden',
                  background: 'var(--bg-surface-elevated)'
                }}
              >
                <img
                  src={member.image}
                  alt={member.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'top center',
                    filter: 'grayscale(20%) contrast(1.08) brightness(0.95)',
                    transition: 'all 0.5s ease'
                  }}
                  className="team-member-portrait"
                  loading="lazy"
                />

                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(180deg, transparent 40%, var(--bg-card) 100%)'
                  }}
                />

                {/* Role Badge */}
                <div
                  style={{
                    position: 'absolute',
                    top: '14px',
                    left: '14px'
                  }}
                >
                  <span className="badge-tag" style={{ background: 'var(--bg-card)' }}>
                    <Sparkles size={11} />
                    {member.role}
                  </span>
                </div>
              </div>

              {/* Member Details */}
              <div
                style={{
                  padding: '24px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1
                }}
              >
                <div style={{ marginBottom: '10px' }}>
                  <h3
                    className="font-display"
                    style={{
                      fontSize: '1.3rem',
                      fontWeight: 800,
                      color: 'var(--text-primary)',
                      marginBottom: '3px'
                    }}
                  >
                    {member.name}
                  </h3>
                  <span
                    className="font-mono"
                    style={{
                      fontSize: '0.7rem',
                      color: 'var(--accent-cyan)',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase'
                    }}
                  >
                    {member.title}
                  </span>
                </div>

                <p
                  style={{
                    fontSize: '0.85rem',
                    lineHeight: 1.6,
                    color: 'var(--text-secondary)',
                    marginBottom: '18px'
                  }}
                >
                  {member.bio}
                </p>

                {/* Domain Specializations */}
                <div style={{ marginTop: 'auto', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)' }}>
                  <span
                    className="font-mono"
                    style={{
                      display: 'block',
                      fontSize: '0.65rem',
                      color: 'var(--text-muted)',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      marginBottom: '6px'
                    }}
                  >
                    RESEARCH VERTICALS
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {member.specialty.map((spec: string, i: number) => (
                      <span
                        key={i}
                        className="font-mono"
                        style={{
                          fontSize: '0.7rem',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          background: 'var(--btn-secondary-bg)',
                          border: '1px solid var(--border-subtle)',
                          color: 'var(--text-secondary)'
                        }}
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .team-profiles-grid {
          grid-template-columns: 1fr;
        }
        @media (min-width: 640px) {
          .team-profiles-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 1024px) {
          .team-main-section {
            padding: 120px 0;
          }
          .team-header {
            margin-bottom: 64px;
          }
          .team-profiles-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 32px;
          }
        }
      `}</style>
    </section>
  );
};

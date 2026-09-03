import React from 'react';
import { Sparkles, ExternalLink, Mail } from 'lucide-react';
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
          <div className="section-tagline">07 · LEADERSHIP & FACULTY</div>
          <h2 className="section-title">
            THE INTELLECTUAL <span style={{ color: 'var(--accent-cyan)' }}>SYNDICATE</span>
          </h2>
          <p className="section-subtitle">
            The curators, tournament arbiters, and mentors directing the analytical mission of Silicon Quiz Club.
          </p>
        </div>

        {/* Editorial Profile Cards — Alternating Layout */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {TEAM_PROFILES.map((member, idx) => (
            <div
              key={member.id}
              className={`glass-panel team-profile-card ${idx % 2 === 1 ? 'team-profile-reversed' : ''}`}
              style={{
                borderRadius: '20px',
                overflow: 'hidden',
                border: '1px solid var(--border-subtle)',
                display: 'grid',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={() => sound.playHover()}
            >
              {/* Portrait Image */}
              <div
                className="team-profile-portrait"
                style={{
                  position: 'relative',
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
                  className="team-member-portrait-img"
                  loading="lazy"
                />

                {/* Gradient scrim */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(180deg, transparent 50%, rgba(7, 9, 14, 0.4) 100%)'
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
                  <span
                    className="badge-tag"
                    style={{
                      background: 'rgba(7, 9, 14, 0.85)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid var(--border-subtle)'
                    }}
                  >
                    <Sparkles size={11} />
                    {member.role.split('/')[0].trim()}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div
                className="team-profile-content"
                style={{
                  padding: '28px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  backgroundColor: 'var(--bg-card)'
                }}
              >
                {/* Name (large, editorial) */}
                <h3
                  className="font-display"
                  style={{
                    fontSize: 'clamp(1.2rem, 2.5vw, 1.5rem)',
                    fontWeight: 800,
                    color: 'var(--text-primary)',
                    letterSpacing: '-0.01em',
                    marginBottom: '4px',
                    lineHeight: 1.2
                  }}
                >
                  {member.name}
                </h3>

                {/* Title (mono, subtle) */}
                <span
                  className="font-mono"
                  style={{
                    fontSize: '0.7rem',
                    color: 'var(--accent-cyan)',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    marginBottom: '14px',
                    display: 'block'
                  }}
                >
                  {member.title}
                </span>

                {/* Concise contribution statement */}
                <p
                  style={{
                    fontSize: '0.88rem',
                    lineHeight: 1.6,
                    color: 'var(--text-secondary)',
                    marginBottom: '18px'
                  }}
                >
                  {member.bio}
                </p>

                {/* Specialties */}
                <div style={{ marginBottom: '16px' }}>
                  <span
                    className="font-mono"
                    style={{
                      display: 'block',
                      fontSize: '0.6rem',
                      color: 'var(--text-muted)',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      marginBottom: '6px'
                    }}
                  >
                    DOMAINS
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {member.specialty.map((spec: string, i: number) => (
                      <span
                        key={i}
                        className="font-mono"
                        style={{
                          fontSize: '0.68rem',
                          padding: '4px 10px',
                          borderRadius: '8px',
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

                {/* Contact Links */}
                {member.socials && (
                  <div style={{ display: 'flex', gap: '8px', marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
                    {member.socials.linkedin && (
                      <a
                        href={member.socials.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono"
                        style={{
                          fontSize: '0.68rem',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          background: 'var(--btn-secondary-bg)',
                          border: '1px solid var(--border-subtle)',
                          color: 'var(--text-secondary)',
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <ExternalLink size={11} />
                        LinkedIn
                      </a>
                    )}
                    {member.socials.email && (
                      <a
                        href={`mailto:${member.socials.email}`}
                        className="font-mono"
                        style={{
                          fontSize: '0.68rem',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          background: 'var(--btn-secondary-bg)',
                          border: '1px solid var(--border-subtle)',
                          color: 'var(--text-secondary)',
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <Mail size={11} />
                        Contact
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .team-profile-card {
          grid-template-columns: 1fr;
        }
        .team-profile-portrait {
          min-height: 260px;
        }
        .team-profile-card:hover .team-member-portrait-img {
          transform: scale(1.03);
          filter: grayscale(0%) contrast(1.1) brightness(1);
        }

        @media (min-width: 768px) {
          .team-profile-card {
            grid-template-columns: 2fr 3fr;
          }
          .team-profile-reversed {
            direction: rtl;
          }
          .team-profile-reversed > * {
            direction: ltr;
          }
          .team-profile-portrait {
            min-height: 320px;
          }
          .team-profile-content {
            padding: 32px 28px;
          }
        }

        @media (min-width: 1024px) {
          .team-main-section {
            padding: 120px 0;
          }
          .team-header {
            margin-bottom: 64px;
          }
          .team-profile-card {
            grid-template-columns: 2fr 3fr;
          }
          .team-profile-portrait {
            min-height: 380px;
          }
          .team-profile-content {
            padding: 40px 36px;
          }
        }
      `}</style>
    </section>
  );
};

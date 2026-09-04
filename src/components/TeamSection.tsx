import React from 'react';
import { Sparkles, Award, Shield, Users } from 'lucide-react';
import { CLUB_MEMBERS } from '../data/clubData';
import { sound } from '../utils/soundEngine';

export const TeamSection: React.FC = () => {
  const fic = CLUB_MEMBERS.find((m) => m.tier === 'fic')!;
  const secretary = CLUB_MEMBERS.find((m) => m.tier === 'secretary')!;
  const jointSecretary = CLUB_MEMBERS.find((m) => m.tier === 'joint_secretary')!;
  const seniorCoordinators = CLUB_MEMBERS.filter((m) => m.tier === 'senior_coordinator');
  const coordinators = CLUB_MEMBERS.filter((m) => m.tier === 'coordinator');

  return (
    <section
      id="team"
      style={{
        padding: '80px 0',
        backgroundColor: 'var(--bg-primary)',
        position: 'relative',
        borderTop: '1px solid var(--border-subtle)'
      }}
      className="members-main-section"
    >
      <div className="section-container">
        {/* Section Header */}
        <div style={{ marginBottom: '56px', textAlign: 'center' }} className="members-header">
          <div
            className="section-tagline"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              justifyContent: 'center',
              marginBottom: '12px'
            }}
          >
            <Sparkles size={12} color="var(--accent-cyan)" />
            <span>07 · LEADERSHIP & MEMBERS</span>
          </div>

          <h2
            className="section-title"
            style={{
              fontSize: 'clamp(2rem, 5vw, 3.2rem)',
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              marginBottom: '16px'
            }}
          >
            THE PEOPLE <br />
            <span style={{ color: 'var(--accent-cyan)' }}>BEHIND THE QUESTIONS.</span>
          </h2>

          <p
            className="section-subtitle"
            style={{
              maxWidth: '620px',
              margin: '0 auto',
              fontSize: 'clamp(0.9rem, 2vw, 1.05rem)',
              color: 'var(--text-secondary)'
            }}
          >
            The students and faculty shaping the Quiz Club at Silicon Institute of Technology.
          </p>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            TIER 01 — FACULTY / FIC FEATURE
        ═══════════════════════════════════════════════════════════════════ */}
        <div className="tier-wrapper" style={{ marginBottom: '48px', position: 'relative' }}>
          <div
            className="hierarchy-badge"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginBottom: '20px'
            }}
          >
            <span
              className="font-mono"
              style={{
                fontSize: '0.68rem',
                color: 'var(--accent-cyan)',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                padding: '4px 14px',
                borderRadius: '999px',
                background: 'rgba(0, 242, 254, 0.08)',
                border: '1px solid rgba(0, 242, 254, 0.25)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Award size={13} />
              FACULTY / IN-CHARGE
            </span>
          </div>

          {/* Large Faculty Portrait Composition */}
          <div
            className="glass-panel faculty-feature-card"
            style={{
              borderRadius: '24px',
              overflow: 'hidden',
              border: '1px solid var(--border-accent)',
              boxShadow: '0 20px 50px -15px rgba(0, 0, 0, 0.5), 0 0 30px -10px rgba(0, 242, 254, 0.15)',
              position: 'relative',
              maxWidth: '960px',
              margin: '0 auto'
            }}
            onMouseEnter={() => sound.playHover()}
          >
            <div className="faculty-grid">
              {/* Faculty Portrait Box */}
              <div
                className="faculty-portrait-container"
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                  background: 'var(--bg-surface-elevated)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <img
                  src={fic.image}
                  alt={fic.name}
                  className="faculty-img"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'top center',
                    transition: 'transform 0.5s ease'
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(7, 9, 14, 0.7) 0%, transparent 60%)'
                  }}
                  className="faculty-scrim"
                />
              </div>

              {/* Faculty Details */}
              <div
                className="faculty-details"
                style={{
                  padding: '36px 32px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  backgroundColor: 'var(--bg-card)'
                }}
              >
                <div style={{ marginBottom: '14px' }}>
                  <div
                    className="font-mono"
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--accent-cyan)',
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      fontWeight: 700,
                      marginBottom: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Shield size={14} color="var(--accent-cyan)" />
                    {fic.designation}
                  </div>

                  <h3
                    className="font-display"
                    style={{
                      fontSize: 'clamp(1.7rem, 4vw, 2.4rem)',
                      fontWeight: 800,
                      color: 'var(--text-primary)',
                      letterSpacing: '-0.02em',
                      lineHeight: 1.15
                    }}
                  >
                    {fic.name}
                  </h3>
                </div>

                <p
                  style={{
                    fontSize: '0.95rem',
                    lineHeight: 1.65,
                    color: 'var(--text-secondary)',
                    marginBottom: '24px'
                  }}
                >
                  {fic.bio}
                </p>

                <div
                  style={{
                    marginTop: 'auto',
                    paddingTop: '16px',
                    borderTop: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                >
                  <span
                    className="font-mono"
                    style={{
                      fontSize: '0.72rem',
                      color: 'var(--text-muted)',
                      letterSpacing: '0.08em'
                    }}
                  >
                    {fic.department}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Node Connector Motif */}
          <div className="hierarchy-node-connector">
            <div className="node-line" />
            <div className="node-circle" />
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            TIER 02 & 03 — STUDENT LEADERSHIP (Secretary & Joint Secretary)
        ═══════════════════════════════════════════════════════════════════ */}
        <div className="tier-wrapper" style={{ marginBottom: '56px', position: 'relative' }}>
          <div
            className="hierarchy-badge"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginBottom: '24px'
            }}
          >
            <span
              className="font-mono"
              style={{
                fontSize: '0.68rem',
                color: 'var(--text-muted)',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                padding: '4px 14px',
                borderRadius: '999px',
                background: 'var(--btn-secondary-bg)',
                border: '1px solid var(--border-subtle)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Users size={13} />
              STUDENT LEADERSHIP
            </span>
          </div>

          {/* Side-by-Side Leadership Pair */}
          <div className="leadership-pair-grid">
            {/* Secretary */}
            <div
              className="glass-panel leadership-card"
              style={{
                borderRadius: '20px',
                overflow: 'hidden',
                border: '1px solid var(--border-accent)',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.35s ease'
              }}
              onMouseEnter={() => sound.playHover()}
            >
              <div className="leadership-portrait-box">
                <img
                  src={secretary.image}
                  alt={secretary.name}
                  className="leadership-img"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.5s ease'
                  }}
                  loading="lazy"
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(7, 9, 14, 0.7) 0%, transparent 45%)'
                  }}
                />
              </div>

              <div
                style={{
                  padding: '24px 22px',
                  backgroundColor: 'var(--bg-card)',
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1
                }}
              >
                <div
                  className="font-mono"
                  style={{
                    fontSize: '0.72rem',
                    color: 'var(--accent-cyan)',
                    letterSpacing: '0.12em',
                    fontWeight: 700,
                    marginBottom: '4px'
                  }}
                >
                  {secretary.designation}
                </div>

                <h3
                  className="font-display"
                  style={{
                    fontSize: 'clamp(1.35rem, 3vw, 1.75rem)',
                    fontWeight: 800,
                    color: 'var(--text-primary)',
                    letterSpacing: '-0.02em',
                    marginBottom: '8px'
                  }}
                >
                  {secretary.name}
                </h3>

                <p
                  style={{
                    fontSize: '0.85rem',
                    lineHeight: 1.55,
                    color: 'var(--text-secondary)',
                    marginTop: 'auto',
                    paddingTop: '10px'
                  }}
                >
                  {secretary.bio}
                </p>
              </div>
            </div>

            {/* Joint Secretary */}
            <div
              className="glass-panel leadership-card"
              style={{
                borderRadius: '20px',
                overflow: 'hidden',
                border: '1px solid var(--border-accent)',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.35s ease'
              }}
              onMouseEnter={() => sound.playHover()}
            >
              <div className="leadership-portrait-box">
                <img
                  src={jointSecretary.image}
                  alt={jointSecretary.name}
                  className="leadership-img"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.5s ease'
                  }}
                  loading="lazy"
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(7, 9, 14, 0.7) 0%, transparent 45%)'
                  }}
                />
              </div>

              <div
                style={{
                  padding: '24px 22px',
                  backgroundColor: 'var(--bg-card)',
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1
                }}
              >
                <div
                  className="font-mono"
                  style={{
                    fontSize: '0.72rem',
                    color: 'var(--accent-cyan)',
                    letterSpacing: '0.12em',
                    fontWeight: 700,
                    marginBottom: '4px'
                  }}
                >
                  {jointSecretary.designation}
                </div>

                <h3
                  className="font-display"
                  style={{
                    fontSize: 'clamp(1.35rem, 3vw, 1.75rem)',
                    fontWeight: 800,
                    color: 'var(--text-primary)',
                    letterSpacing: '-0.02em',
                    marginBottom: '8px'
                  }}
                >
                  {jointSecretary.name}
                </h3>

                <p
                  style={{
                    fontSize: '0.85rem',
                    lineHeight: 1.55,
                    color: 'var(--text-secondary)',
                    marginTop: 'auto',
                    paddingTop: '10px'
                  }}
                >
                  {jointSecretary.bio}
                </p>
              </div>
            </div>
          </div>

          {/* Node Connector Motif */}
          <div className="hierarchy-node-connector">
            <div className="node-line" />
            <div className="node-circle" />
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            TIER 04 — SENIOR COORDINATORS (6 Members)
        ═══════════════════════════════════════════════════════════════════ */}
        <div className="tier-wrapper" style={{ marginBottom: '56px', position: 'relative' }}>
          <div
            className="hierarchy-badge"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginBottom: '24px'
            }}
          >
            <span
              className="font-mono"
              style={{
                fontSize: '0.68rem',
                color: 'var(--text-muted)',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                padding: '4px 14px',
                borderRadius: '999px',
                background: 'var(--btn-secondary-bg)',
                border: '1px solid var(--border-subtle)'
              }}
            >
              SENIOR COORDINATORS
            </span>
          </div>

          {/* 6-Member Balanced 3x2 Editorial Showcase */}
          <div className="senior-coordinators-grid">
            {seniorCoordinators.map((member) => (
              <div
                key={member.id}
                className="glass-panel member-card senior-card"
                style={{
                  borderRadius: '16px',
                  overflow: 'hidden',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={() => sound.playHover()}
              >
                <div className="member-portrait-box senior-portrait-box">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="member-img"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'top center',
                      transition: 'transform 0.45s ease'
                    }}
                    loading="lazy"
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(7, 9, 14, 0.65) 0%, transparent 45%)'
                    }}
                  />
                </div>

                <div
                  style={{
                    padding: '16px 14px',
                    backgroundColor: 'var(--bg-card)',
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1
                  }}
                >
                  <h4
                    className="font-display"
                    style={{
                      fontSize: '1.1rem',
                      fontWeight: 800,
                      color: 'var(--text-primary)',
                      letterSpacing: '-0.01em',
                      marginBottom: '4px'
                    }}
                  >
                    {member.name}
                  </h4>

                  <span
                    className="font-mono"
                    style={{
                      fontSize: '0.65rem',
                      color: 'var(--accent-cyan)',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      fontWeight: 600
                    }}
                  >
                    {member.designation}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Node Connector Motif */}
          <div className="hierarchy-node-connector">
            <div className="node-line" />
            <div className="node-circle" />
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            TIER 05 & 06 — COORDINATORS (9 Members)
        ═══════════════════════════════════════════════════════════════════ */}
        <div className="tier-wrapper" style={{ position: 'relative' }}>
          <div
            className="hierarchy-badge"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginBottom: '24px'
            }}
          >
            <span
              className="font-mono"
              style={{
                fontSize: '0.68rem',
                color: 'var(--text-muted)',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                padding: '4px 14px',
                borderRadius: '999px',
                background: 'var(--btn-secondary-bg)',
                border: '1px solid var(--border-subtle)'
              }}
            >
              COORDINATORS
            </span>
          </div>

          {/* Coordinators Grid */}
          <div className="coordinators-grid">
            {coordinators.map((member) => (
              <div
                key={member.id}
                className="glass-panel member-card coordinator-card"
                style={{
                  borderRadius: '14px',
                  overflow: 'hidden',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={() => sound.playHover()}
              >
                <div className="member-portrait-box coordinator-portrait-box">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="member-img"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'top center',
                      transition: 'transform 0.45s ease'
                    }}
                    loading="lazy"
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(7, 9, 14, 0.6) 0%, transparent 45%)'
                    }}
                  />
                </div>

                <div
                  style={{
                    padding: '14px 12px',
                    backgroundColor: 'var(--bg-card)',
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1
                  }}
                >
                  <h4
                    className="font-display"
                    style={{
                      fontSize: '0.98rem',
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                      letterSpacing: '-0.01em',
                      marginBottom: '2px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {member.name}
                  </h4>

                  <span
                    className="font-mono"
                    style={{
                      fontSize: '0.62rem',
                      color: 'var(--text-muted)',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      fontWeight: 600
                    }}
                  >
                    {member.designation}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        /* Faculty Feature Layout */
        .faculty-grid {
          display: grid;
          grid-template-columns: 1fr;
        }
        .faculty-portrait-container {
          min-height: 340px;
          height: 100%;
        }
        .faculty-feature-card:hover .faculty-img {
          transform: scale(1.03);
        }

        /* Student Leadership Grid */
        .leadership-pair-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
          max-width: 440px;
          margin: 0 auto;
        }
        .leadership-portrait-box {
          position: relative;
          height: 320px;
          overflow: hidden;
          background: var(--bg-surface-elevated);
        }
        .leadership-portrait-box .leadership-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 12% !important;
          transition: transform 0.5s ease;
        }
        .leadership-card:hover {
          transform: translateY(-4px);
          border-color: var(--accent-cyan) !important;
          box-shadow: 0 16px 36px -12px rgba(0, 0, 0, 0.4), 0 0 20px -8px rgba(0, 242, 254, 0.2);
        }
        .leadership-card:hover .leadership-img {
          transform: scale(1.04);
        }

        /* Senior Coordinators Grid */
        .senior-coordinators-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
          max-width: 1140px;
          margin: 0 auto;
        }
        @media (max-width: 639px) {
          .senior-coordinators-grid > :last-child:nth-child(odd) {
            grid-column: span 2;
            max-width: 280px;
            margin: 0 auto;
            width: 100%;
          }
        }
        .senior-portrait-box {
          position: relative;
          height: 230px;
          overflow: hidden;
          background: var(--bg-surface-elevated);
        }
        .senior-portrait-box .member-img {
          object-position: center 15% !important;
        }
        .senior-card:hover {
          transform: translateY(-3px);
          border-color: rgba(0, 242, 254, 0.35) !important;
        }
        .senior-card:hover .member-img {
          transform: scale(1.04);
        }

        /* Coordinators Grid */
        .coordinators-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          max-width: 1080px;
          margin: 0 auto;
        }
        .coordinator-portrait-box {
          position: relative;
          height: 210px;
          overflow: hidden;
          background: var(--bg-surface-elevated);
        }
        .coordinator-portrait-box .member-img {
          object-position: center 15% !important;
        }
        .coordinator-card:hover {
          transform: translateY(-3px);
          border-color: var(--border-accent) !important;
        }
        .coordinator-card:hover .member-img {
          transform: scale(1.04);
        }

        /* Hierarchy Node Connector Motif */
        .hierarchy-node-connector {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: 28px;
        }
        .node-line {
          width: 1px;
          height: 32px;
          background: linear-gradient(to bottom, var(--accent-cyan), var(--border-subtle));
          opacity: 0.5;
        }
        .node-circle {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--accent-cyan);
          box-shadow: 0 0 8px var(--accent-cyan);
        }

        /* Responsive Breakpoints */
        @media (min-width: 640px) and (max-width: 767px) {
          .senior-coordinators-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
            max-width: 600px;
          }
          .senior-coordinators-grid > :nth-child(5) {
            grid-column: span 2;
            max-width: 290px;
            margin: 0 auto;
            width: 100%;
          }
          .coordinators-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 16px;
          }
          .senior-portrait-box {
            height: 260px;
          }
          .coordinator-portrait-box {
            height: 260px;
          }
        }

        @media (min-width: 768px) and (max-width: 1023px) {
          .faculty-grid {
            grid-template-columns: 2fr 3fr;
          }
          .faculty-portrait-container {
            min-height: 420px;
          }
          .leadership-pair-grid {
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            max-width: 740px;
            margin: 0 auto;
          }
          .leadership-portrait-box {
            height: 330px;
          }
          .senior-coordinators-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 18px;
            max-width: 840px;
            margin: 0 auto;
          }
          .coordinators-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 18px;
          }
          .senior-portrait-box {
            height: 260px;
          }
          .coordinator-portrait-box {
            height: 270px;
          }
        }

        @media (min-width: 1024px) {
          .members-main-section {
            padding: 120px 0;
          }
          .members-header {
            margin-bottom: 72px;
          }
          .faculty-grid {
            grid-template-columns: 5fr 7fr;
          }
          .faculty-portrait-container {
            min-height: 460px;
          }
          .faculty-details {
            padding: 48px 40px;
          }
          .leadership-pair-grid {
            grid-template-columns: 1fr 1fr;
            gap: 24px;
            max-width: 780px;
            margin: 0 auto;
          }
          .leadership-portrait-box {
            height: 340px;
          }
          .senior-coordinators-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 22px;
            max-width: 960px;
            margin: 0 auto;
          }
          .coordinators-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
          }
          .senior-portrait-box {
            height: 270px;
          }
          .coordinator-portrait-box {
            height: 290px;
          }
        }
      `}</style>
    </section>
  );
};

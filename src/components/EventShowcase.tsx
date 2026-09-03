import React from 'react';
import { Calendar, MapPin, Trophy, Award, Clock } from 'lucide-react';
import { CLUB_EVENTS, getEventStatus } from '../data/clubData';
import { sound } from '../utils/soundEngine';

interface EventShowcaseProps {
  onOpenRegisterModal?: () => void;
}

export const EventShowcase: React.FC<EventShowcaseProps> = () => {
  // Dynamically determine event status based on current date
  const upcomingEvents = CLUB_EVENTS.filter(
    (e) => getEventStatus(e.isoDate, e.status) === 'UPCOMING'
  );
  const completedEvents = CLUB_EVENTS.filter(
    (e) => getEventStatus(e.isoDate, e.status) === 'COMPLETED'
  );

  const podiumColors = [
    { label: '1ST', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.12)', border: 'rgba(245, 158, 11, 0.3)' },
    { label: '2ND', color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.1)', border: 'rgba(148, 163, 184, 0.25)' },
    { label: '3RD', color: '#d97706', bg: 'rgba(217, 119, 6, 0.1)', border: 'rgba(217, 119, 6, 0.25)' }
  ];

  return (
    <section
      id="events"
      style={{
        padding: '80px 0',
        backgroundColor: 'var(--bg-primary)',
        position: 'relative',
        borderTop: '1px solid var(--border-subtle)'
      }}
      className="events-main-section"
    >
      <div className="section-container">
        {/* Section Header */}
        <div style={{ marginBottom: '40px' }} className="events-header">
          <div className="section-tagline">05 · THE QUIZ CLUB ARCHIVE</div>
          <h2 className="section-title">
            THE REAL <span style={{ color: 'var(--accent-cyan)' }}>TIMELINE</span>
          </h2>
          <p className="section-subtitle">
            Authentic chronicle of completed club activities through August 2026 and confirmed upcoming programmes.
          </p>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            UPCOMING EVENT — ONLY ONE CONFIRMED (Refined, Non-Dominating Card)
        ═══════════════════════════════════════════════════════════════════ */}
        {upcomingEvents.map((evt) => (
          <div
            key={evt.id}
            className="glass-panel upcoming-event-card"
            style={{
              borderRadius: '20px',
              padding: '28px 28px',
              border: '1px solid rgba(0, 242, 254, 0.35)',
              background: 'linear-gradient(135deg, rgba(0, 242, 254, 0.05) 0%, var(--bg-card) 100%)',
              boxShadow: 'var(--shadow-elevated)',
              marginBottom: '56px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
            onMouseEnter={() => sound.playHover()}
          >
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
              <span
                className="font-mono"
                style={{
                  fontSize: '0.68rem',
                  padding: '4px 12px',
                  borderRadius: '999px',
                  background: 'rgba(0, 242, 254, 0.15)',
                  border: '1px solid var(--accent-cyan)',
                  color: 'var(--accent-cyan)',
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                ● UPCOMING
              </span>
              <span
                className="font-mono"
                style={{
                  fontSize: '0.82rem',
                  color: 'var(--text-primary)',
                  fontWeight: 700,
                  letterSpacing: '0.08em'
                }}
              >
                {evt.date}
              </span>
              <span style={{ color: 'var(--text-muted)' }}>·</span>
              <span
                className="font-mono"
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <MapPin size={12} color="var(--accent-cyan)" />
                {evt.venue}
              </span>
            </div>

            <h3
              className="font-display"
              style={{
                fontSize: 'clamp(1.5rem, 3.5vw, 2.2rem)',
                fontWeight: 800,
                color: 'var(--text-primary)',
                letterSpacing: '-0.02em',
                lineHeight: 1.15
              }}
            >
              {evt.title}
            </h3>

            <p
              style={{
                fontSize: '0.92rem',
                lineHeight: 1.6,
                color: 'var(--text-secondary)',
                maxWidth: '680px',
                margin: 0
              }}
            >
              {evt.shortDescription}
            </p>
          </div>
        ))}

        {/* ═══════════════════════════════════════════════════════════════════
            COMPLETED EVENTS ARCHIVE — Editorial Split-Layout & Podiums
        ═══════════════════════════════════════════════════════════════════ */}
        <div id="laurels" style={{ marginBottom: '24px', scrollMarginTop: '100px' }}>
          <div
            className="font-mono"
            style={{
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
              letterSpacing: '0.15em',
              marginBottom: '8px',
              textTransform: 'uppercase'
            }}
          >
            COMPLETED EVENTS ARCHIVE
          </div>
          <div style={{ width: '48px', height: '2px', background: 'var(--accent-cyan)', borderRadius: '1px' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', marginBottom: '64px' }}>
          {completedEvents.map((evt, idx) => (
            <div
              key={evt.id}
              className={`glass-panel event-chapter ${idx % 2 === 1 ? 'event-chapter-reversed' : ''}`}
              style={{
                borderRadius: '20px',
                overflow: 'hidden',
                border: '1px solid var(--border-subtle)',
                display: 'grid'
              }}
              onMouseEnter={() => sound.playHover()}
            >
              {/* Image Column */}
              <div
                className="event-chapter-image"
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                  background: 'var(--bg-surface-elevated)'
                }}
              >
                <img
                  src={evt.image}
                  alt={evt.title}
                  className="img-hover-shine"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center 48%',
                    minHeight: '280px'
                  }}
                  loading="lazy"
                />
                {/* Scrim */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(7, 9, 14, 0.7) 0%, transparent 50%)'
                  }}
                />
                {/* Status Badge */}
                <div
                  className="font-mono"
                  style={{
                    position: 'absolute',
                    top: '14px',
                    left: '14px',
                    padding: '5px 12px',
                    borderRadius: '999px',
                    backgroundColor: 'rgba(7, 9, 14, 0.85)',
                    backdropFilter: 'blur(10px)',
                    fontSize: '0.65rem',
                    color: '#94a3b8',
                    border: '1px solid var(--border-subtle)',
                    letterSpacing: '0.08em',
                    fontWeight: 600
                  }}
                >
                  COMPLETED · {evt.date.toUpperCase()}
                </div>
                {/* Edition on image */}
                {evt.edition && (
                  <div
                    className="font-mono"
                    style={{
                      position: 'absolute',
                      bottom: '14px',
                      left: '14px',
                      fontSize: '0.7rem',
                      color: '#ffffff',
                      letterSpacing: '0.1em'
                    }}
                  >
                    {evt.edition}
                  </div>
                )}
              </div>

              {/* Content Column */}
              <div
                className="event-chapter-content"
                style={{
                  padding: '28px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  backgroundColor: 'var(--bg-card)'
                }}
              >
                {/* Meta */}
                <div
                  className="font-mono"
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '0.7rem',
                    color: 'var(--accent-cyan)',
                    marginBottom: '10px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={12} />
                    <span>{evt.date}</span>
                  </div>
                  <span>·</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={12} />
                    <span>{evt.venue}</span>
                  </div>
                </div>

                {/* Title */}
                <h3
                  className="font-display"
                  style={{
                    fontSize: 'clamp(1.3rem, 3vw, 1.7rem)',
                    fontWeight: 800,
                    color: 'var(--text-primary)',
                    letterSpacing: '-0.02em',
                    marginBottom: '4px',
                    lineHeight: 1.15
                  }}
                >
                  {evt.title}
                </h3>

                <p
                  className="font-mono"
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    letterSpacing: '0.06em',
                    marginBottom: '12px'
                  }}
                >
                  {evt.subtitle}
                </p>

                <p
                  style={{
                    fontSize: '0.88rem',
                    lineHeight: 1.6,
                    color: 'var(--text-secondary)',
                    marginBottom: evt.podium ? '20px' : '0'
                  }}
                >
                  {evt.shortDescription}
                </p>

                {/* Inline Podium */}
                {evt.podium && (
                  <div
                    style={{
                      padding: '16px',
                      borderRadius: '14px',
                      background: 'var(--bg-surface-elevated)',
                      border: '1px solid var(--border-subtle)'
                    }}
                  >
                    <div
                      className="font-mono"
                      style={{
                        fontSize: '0.62rem',
                        color: 'var(--text-muted)',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        marginBottom: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <Award size={12} />
                      CHAMPIONSHIP PODIUM
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {[evt.podium.first, evt.podium.second, evt.podium.third].map((name, pi) => (
                        <div
                          key={pi}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '8px 12px',
                            borderRadius: '10px',
                            background: podiumColors[pi].bg,
                            border: `1px solid ${podiumColors[pi].border}`
                          }}
                        >
                          <div
                            style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '8px',
                              background: podiumColors[pi].bg,
                              border: `1px solid ${podiumColors[pi].border}`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0
                            }}
                          >
                            <Trophy size={13} color={podiumColors[pi].color} />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div
                              className="font-mono"
                              style={{
                                fontSize: '0.6rem',
                                color: podiumColors[pi].color,
                                letterSpacing: '0.1em',
                                marginBottom: '1px'
                              }}
                            >
                              {podiumColors[pi].label}
                            </div>
                            <div
                              style={{
                                fontSize: '0.82rem',
                                fontWeight: 600,
                                color: 'var(--text-primary)',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                              }}
                            >
                              {name}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            CLUB TIMELINE — Strict Chronological History (2025 → August 2026 → Sept 2026)
        ═══════════════════════════════════════════════════════════════════ */}
        <div className="club-timeline" style={{ position: 'relative', paddingLeft: '24px' }}>
          <div
            className="font-mono"
            style={{
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
              letterSpacing: '0.15em',
              marginBottom: '24px',
              textTransform: 'uppercase'
            }}
          >
            HISTORICAL EVENT TIMELINE
          </div>

          {/* Vertical Line */}
          <div
            style={{
              position: 'absolute',
              left: '5px',
              top: '48px',
              bottom: '0',
              width: '2px',
              background: 'var(--border-subtle)',
              borderRadius: '1px'
            }}
          />

          {/* Timeline Entries (Earliest to Latest) */}
          {[
            ...completedEvents.slice().reverse(),
            ...upcomingEvents
          ].map((evt) => {
            const isUpcoming = getEventStatus(evt.isoDate, evt.status) === 'UPCOMING';
            return (
              <div
                key={evt.id}
                style={{
                  position: 'relative',
                  paddingBottom: '24px',
                  paddingLeft: '6px'
                }}
              >
                {/* Dot */}
                <div
                  style={{
                    position: 'absolute',
                    left: '-23px',
                    top: '6px',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: isUpcoming ? 'var(--accent-cyan)' : 'var(--border-subtle)',
                    border: isUpcoming ? '2px solid var(--accent-cyan)' : '2px solid var(--bg-primary)',
                    boxShadow: isUpcoming ? '0 0 10px rgba(0, 242, 254, 0.4)' : 'none'
                  }}
                />

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span
                    className="font-mono"
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: isUpcoming ? 'var(--accent-cyan)' : 'var(--text-muted)',
                      letterSpacing: '0.06em'
                    }}
                  >
                    {evt.date}
                  </span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>—</span>
                  <span
                    style={{
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      color: 'var(--text-primary)'
                    }}
                  >
                    {evt.title}
                  </span>
                  <span
                    className="font-mono"
                    style={{
                      fontSize: '0.6rem',
                      padding: '2px 8px',
                      borderRadius: '999px',
                      background: isUpcoming ? 'rgba(0, 242, 254, 0.12)' : 'var(--btn-secondary-bg)',
                      color: isUpcoming ? 'var(--accent-cyan)' : 'var(--text-muted)',
                      border: isUpcoming ? '1px solid rgba(0, 242, 254, 0.3)' : '1px solid var(--border-subtle)',
                      fontWeight: 700,
                      letterSpacing: '0.08em'
                    }}
                  >
                    {isUpcoming ? 'UPCOMING' : 'COMPLETED'}
                  </span>
                </div>
                <div
                  className="font-mono"
                  style={{
                    fontSize: '0.68rem',
                    color: 'var(--text-muted)',
                    marginTop: '3px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Clock size={10} />
                  {evt.venue}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        /* Upcoming Event Card */
        .upcoming-event-card {
          position: relative;
          transition: transform 0.35s ease, border-color 0.35s ease;
        }
        .upcoming-event-card:hover {
          transform: translateY(-2px);
          border-color: var(--accent-cyan) !important;
        }

        /* Event Chapter — Split Layout */
        .event-chapter {
          grid-template-columns: 1fr;
        }
        .event-chapter-image {
          min-height: 220px;
        }

        /* Timeline */
        .club-timeline {
          max-width: 720px;
        }

        @media (min-width: 768px) {
          .upcoming-event-card {
            padding: 36px 40px;
          }
        }

        @media (min-width: 1024px) {
          .events-main-section {
            padding: 120px 0;
          }
          .events-header {
            margin-bottom: 56px;
          }

          /* Split Layout on desktop */
          .event-chapter {
            grid-template-columns: 1fr 1fr;
          }
          .event-chapter-reversed {
            direction: rtl;
          }
          .event-chapter-reversed > * {
            direction: ltr;
          }
          .event-chapter-image {
            min-height: 380px;
          }
          .event-chapter-content {
            padding: 36px 32px;
          }
        }
      `}</style>
    </section>
  );
};

import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Trophy, Sparkles, Download, Award, Clock } from 'lucide-react';
import { CLUB_EVENTS } from '../data/clubData';
import { sound } from '../utils/soundEngine';

interface EventShowcaseProps {
  onOpenRegisterModal: () => void;
}

export const EventShowcase: React.FC<EventShowcaseProps> = ({ onOpenRegisterModal }) => {
  const upcomingEvent = CLUB_EVENTS.find((e) => e.status === 'upcoming') || CLUB_EVENTS[0];
  const pastEvents = CLUB_EVENTS.filter((e) => e.status === 'archived');

  // Dynamic Countdown Timer (Targeting Oct 24, 2026)
  const [timeLeft, setTimeLeft] = useState({
    days: 61,
    hours: 14,
    minutes: 32,
    seconds: 48
  });

  useEffect(() => {
    const targetDate = new Date('2026-10-24T09:30:00+05:30').getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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
          <div className="section-tagline">05 · TOURNAMENTS & CHAMPIONSHIPS</div>
          <h2 className="section-title">
            FLAGSHIP <span style={{ color: 'var(--accent-cyan)' }}>ARENAS</span>
          </h2>
          <p className="section-subtitle">
            Arena-scale championships, lateral elimination finals, and the quizzers who conquered them.
          </p>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            FEATURED UPCOMING EVENT — Full-width Hero
        ═══════════════════════════════════════════════════════════════════ */}
        <div
          className="glass-panel featured-event-hero"
          style={{
            borderRadius: '24px',
            overflow: 'hidden',
            border: '1px solid var(--border-accent)',
            boxShadow: 'var(--shadow-elevated)',
            marginBottom: '72px',
            position: 'relative'
          }}
        >
          {/* Full-width Background Image */}
          <div className="featured-event-image-box">
            <img
              src={upcomingEvent.image}
              alt={upcomingEvent.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'brightness(0.5) contrast(1.15)',
                transition: 'transform 0.6s ease'
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(135deg, rgba(7, 9, 14, 0.92) 0%, rgba(7, 9, 14, 0.4) 50%, rgba(7, 9, 14, 0.85) 100%)'
              }}
            />
          </div>

          {/* Content Overlay */}
          <div className="featured-event-content">
            {/* Top Badges */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
              <span
                className="badge-tag"
                style={{
                  background: 'rgba(2, 132, 199, 0.9)',
                  color: '#ffffff',
                  border: 'none',
                  fontWeight: 700
                }}
              >
                FLAGSHIP ANNUAL ARENA
              </span>
              <span
                className="font-mono"
                style={{
                  padding: '4px 10px',
                  borderRadius: '999px',
                  background: 'rgba(7, 9, 14, 0.85)',
                  backdropFilter: 'blur(10px)',
                  color: '#6ee7b7',
                  fontSize: '0.68rem',
                  fontWeight: 600,
                  border: '1px solid rgba(16, 185, 129, 0.4)'
                }}
              >
                REGISTRATIONS OPEN
              </span>
            </div>

            {/* Meta Row */}
            <div
              className="font-mono"
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: '10px',
                fontSize: '0.72rem',
                color: 'var(--accent-cyan)',
                marginBottom: '12px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Calendar size={13} />
                <span>{upcomingEvent.date}</span>
              </div>
              <span>·</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <MapPin size={13} />
                <span>{upcomingEvent.venue}</span>
              </div>
            </div>

            {/* Title */}
            <h3
              className="font-display"
              style={{
                fontSize: 'clamp(1.6rem, 4vw, 2.6rem)',
                fontWeight: 800,
                color: '#ffffff',
                letterSpacing: '-0.02em',
                marginBottom: '12px',
                lineHeight: 1.1
              }}
            >
              {upcomingEvent.title}
            </h3>

            <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'rgba(255, 255, 255, 0.75)', marginBottom: '24px', maxWidth: '560px' }}>
              {upcomingEvent.shortDescription}
            </p>

            {/* Prize Pool */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ffffff', marginBottom: '24px' }}>
              <Trophy size={16} color="#f59e0b" />
              <span className="font-mono" style={{ fontSize: '0.78rem', letterSpacing: '0.08em' }}>
                CHAMPIONSHIP POOL: ₹25,000 + TROPHIES
              </span>
            </div>

            {/* Countdown Grid */}
            <div style={{ marginBottom: '28px' }}>
              <span
                className="font-mono"
                style={{
                  display: 'block',
                  fontSize: '0.65rem',
                  color: 'rgba(255, 255, 255, 0.5)',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  marginBottom: '10px'
                }}
              >
                COUNTDOWN TO AUDITORIUM PRELIMS
              </span>

              <div className="countdown-grid">
                {[
                  { label: 'DAYS', val: timeLeft.days },
                  { label: 'HOURS', val: timeLeft.hours },
                  { label: 'MINS', val: timeLeft.minutes },
                  { label: 'SECS', val: timeLeft.seconds }
                ].map((item, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '10px 4px',
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '10px',
                      textAlign: 'center'
                    }}
                  >
                    <span
                      className="font-mono"
                      style={{
                        display: 'block',
                        fontSize: 'clamp(1.1rem, 3.5vw, 1.4rem)',
                        fontWeight: 800,
                        color: '#ffffff'
                      }}
                    >
                      {item.val.toString().padStart(2, '0')}
                    </span>
                    <span
                      className="font-mono"
                      style={{
                        fontSize: '0.55rem',
                        color: 'rgba(255, 255, 255, 0.5)',
                        letterSpacing: '0.08em'
                      }}
                    >
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: '10px'
              }}
              className="event-actions-stack"
            >
              <button
                onClick={() => {
                  sound.playClick();
                  onOpenRegisterModal();
                }}
                className="btn-cyan event-action-btn"
                onMouseEnter={() => sound.playHover()}
              >
                <Sparkles size={15} />
                <span>REGISTER TEAM</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  alert('BRAINBLAST 2026 Rulebook & Guidelines downloaded.');
                }}
                className="btn-secondary event-action-btn"
                onMouseEnter={() => sound.playHover()}
                style={{ color: '#ffffff', borderColor: 'rgba(255, 255, 255, 0.2)' }}
              >
                <Download size={14} />
                <span>RULEBOOK (PDF)</span>
              </button>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            ARCHIVED EVENT CHAPTERS — Editorial Split-Layout & Podiums
        ═══════════════════════════════════════════════════════════════════ */}
        <div id="laurels" style={{ marginBottom: '20px', scrollMarginTop: '100px' }}>
          <div className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.15em', marginBottom: '8px' }}>
            CHAMPIONSHIP ARCHIVES & PODIUMS
          </div>
          <div style={{ width: '48px', height: '2px', background: 'var(--accent-cyan)', borderRadius: '1px' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '64px' }}>
          {pastEvents.map((evt, idx) => (
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
                    minHeight: '260px'
                  }}
                  loading="lazy"
                />
                {/* Scrim */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(7, 9, 14, 0.6) 0%, transparent 50%)'
                  }}
                />
                {/* Category Badge */}
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
                    letterSpacing: '0.08em'
                  }}
                >
                  {evt.category.toUpperCase()}
                </div>
                {/* Edition on image */}
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
                    marginBottom: '20px'
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
            CLUB TIMELINE — Compact Vertical
        ═══════════════════════════════════════════════════════════════════ */}
        <div className="club-timeline" style={{ position: 'relative', paddingLeft: '24px' }}>
          <div
            className="font-mono"
            style={{
              fontSize: '0.7rem',
              color: 'var(--text-muted)',
              letterSpacing: '0.15em',
              marginBottom: '20px',
              paddingLeft: '0'
            }}
          >
            CLUB TIMELINE
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

          {/* Timeline Entries */}
          {[...CLUB_EVENTS].reverse().map((evt) => (
            <div
              key={evt.id}
              style={{
                position: 'relative',
                paddingBottom: '20px',
                paddingLeft: '4px'
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
                  background: evt.status === 'upcoming' ? 'var(--accent-cyan)' : 'var(--border-subtle)',
                  border: evt.status === 'upcoming' ? '2px solid var(--accent-cyan)' : '2px solid var(--bg-primary)',
                  boxShadow: evt.status === 'upcoming' ? '0 0 10px rgba(0, 242, 254, 0.4)' : 'none'
                }}
              />

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span
                  className="font-mono"
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: evt.status === 'upcoming' ? 'var(--accent-cyan)' : 'var(--text-muted)',
                    letterSpacing: '0.06em'
                  }}
                >
                  {evt.date.replace('ARCHIVED · ', '')}
                </span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>—</span>
                <span
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: 'var(--text-primary)'
                  }}
                >
                  {evt.title}
                </span>
                {evt.status === 'upcoming' && (
                  <span
                    className="font-mono"
                    style={{
                      fontSize: '0.6rem',
                      padding: '2px 8px',
                      borderRadius: '999px',
                      background: 'rgba(0, 242, 254, 0.12)',
                      color: 'var(--accent-cyan)',
                      border: '1px solid rgba(0, 242, 254, 0.3)',
                      fontWeight: 600
                    }}
                  >
                    UPCOMING
                  </span>
                )}
              </div>
              <div
                className="font-mono"
                style={{
                  fontSize: '0.68rem',
                  color: 'var(--text-muted)',
                  marginTop: '2px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Clock size={10} />
                {evt.venue}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .featured-event-hero {
          position: relative;
          min-height: 420px;
          display: flex;
          flex-direction: column;
        }
        .featured-event-image-box {
          position: absolute;
          inset: 0;
        }
        .featured-event-image-box img {
          position: absolute;
          inset: 0;
        }
        .featured-event-content {
          position: relative;
          z-index: 2;
          padding: 28px 24px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          flex: 1;
        }
        .countdown-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
          max-width: 320px;
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
          max-width: 700px;
        }

        @media (max-width: 480px) {
          .event-actions-stack {
            flex-direction: column;
            width: 100%;
          }
          .event-action-btn {
            width: 100%;
          }
        }

        @media (min-width: 768px) {
          .featured-event-content {
            padding: 48px 44px;
            max-width: 620px;
          }
          .featured-event-hero {
            min-height: 500px;
          }
        }

        @media (min-width: 1024px) {
          .events-main-section {
            padding: 120px 0;
          }
          .events-header {
            margin-bottom: 64px;
          }
          .featured-event-hero {
            min-height: 540px;
          }
          .featured-event-content {
            padding: 56px 52px;
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

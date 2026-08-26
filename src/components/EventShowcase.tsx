import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Trophy, Sparkles, Download } from 'lucide-react';
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
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60));
        const minutes = Math.floor((difference % (1000 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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
          <div className="section-tagline">05 · CALENDAR & TOURNAMENTS</div>
          <h2 className="section-title">
            FLAGSHIP <span style={{ color: 'var(--accent-cyan)' }}>ARENAS</span>
          </h2>
          <p className="section-subtitle">
            From classroom prelim masterclasses to grand inter-collegiate finals at Silicon Auditorium.
          </p>
        </div>

        {/* Featured Upcoming Event Showcase Hero Card */}
        <div
          className="glass-panel event-hero-card"
          style={{
            borderRadius: '24px',
            overflow: 'hidden',
            border: '1px solid var(--border-accent)',
            boxShadow: 'var(--shadow-elevated)',
            marginBottom: '56px',
            display: 'grid'
          }}
        >
          {/* Visual Column */}
          <div
            style={{
              position: 'relative',
              minHeight: '260px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '24px'
            }}
            className="event-hero-visual"
          >
            <img
              src={upcomingEvent.image}
              alt={upcomingEvent.title}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'brightness(0.6) contrast(1.15)',
                transition: 'transform 0.6s ease'
              }}
            />

            {/* Gradient Scrim */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(7, 9, 14, 0.95) 0%, rgba(7, 9, 14, 0.3) 50%, transparent 100%)'
              }}
            />

            {/* Top Badges */}
            <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              <span
                className="badge-tag"
                style={{
                  background: 'rgba(2, 132, 199, 0.9)',
                  color: '#ffffff',
                  border: 'none',
                  fontWeight: 700
                }}
              >
                FEATURED ANNUAL ARENA
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

            {/* Bottom Info on Image */}
            <div style={{ position: 'relative', zIndex: 2 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#ffffff',
                  marginBottom: '6px'
                }}
              >
                <Trophy size={16} color="#f59e0b" />
                <span className="font-mono" style={{ fontSize: '0.78rem', letterSpacing: '0.08em' }}>
                  CHAMPIONSHIP POOL: ₹25,000 + TROPHIES
                </span>
              </div>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.825rem', lineHeight: 1.45 }}>
                Open to all collegiate engineering and degree colleges across Eastern India.
              </p>
            </div>
          </div>

          {/* Content Column */}
          <div
            style={{
              padding: '28px 24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              backgroundColor: 'var(--bg-card)'
            }}
            className="event-hero-content"
          >
            <div>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  gap: '10px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  color: 'var(--accent-cyan)',
                  marginBottom: '10px'
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

              <h3
                className="font-display"
                style={{
                  fontSize: 'clamp(1.6rem, 4vw, 2.2rem)',
                  fontWeight: 800,
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.02em',
                  marginBottom: '12px'
                }}
              >
                {upcomingEvent.title}
              </h3>

              <p
                style={{
                  fontSize: '0.9rem',
                  lineHeight: 1.6,
                  color: 'var(--text-secondary)',
                  marginBottom: '24px'
                }}
              >
                {upcomingEvent.description}
              </p>

              {/* Dynamic Live Countdown Box */}
              <div style={{ marginBottom: '28px' }}>
                <span
                  className="font-mono"
                  style={{
                    display: 'block',
                    fontSize: '0.68rem',
                    color: 'var(--text-muted)',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    marginBottom: '10px'
                  }}
                >
                  COUNTDOWN TO AUDITORIUM PRELIMS
                </span>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '8px'
                  }}
                >
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
                        background: 'var(--btn-secondary-bg)',
                        border: '1px solid var(--border-subtle)',
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
                          color: 'var(--text-primary)'
                        }}
                      >
                        {item.val.toString().padStart(2, '0')}
                      </span>
                      <span
                        className="font-mono"
                        style={{
                          fontSize: '0.58rem',
                          color: 'var(--text-muted)',
                          letterSpacing: '0.08em'
                        }}
                      >
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
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
              >
                <Download size={14} />
                <span>RULEBOOK (PDF)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Past Archive Events Grid */}
        <h3
          className="font-display"
          style={{
            fontSize: '1.35rem',
            fontWeight: 800,
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
            marginBottom: '20px'
          }}
        >
          PREVIOUS TOURNAMENT ARCHIVES
        </h3>

        <div
          style={{
            display: 'grid',
            gap: '20px'
          }}
          className="archive-events-grid"
        >
          {pastEvents.map((evt) => (
            <div
              key={evt.id}
              className="glass-panel"
              style={{
                borderRadius: '18px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div style={{ position: 'relative', height: '170px', overflow: 'hidden' }}>
                <img
                  src={evt.image}
                  alt={evt.title}
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
                    padding: '4px 10px',
                    borderRadius: '999px',
                    backgroundColor: 'rgba(7, 9, 14, 0.85)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.65rem',
                    color: '#94a3b8',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  ARCHIVED
                </div>
              </div>

              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.7rem',
                    color: 'var(--accent-cyan)',
                    marginBottom: '6px'
                  }}
                >
                  {evt.date} · {evt.venue}
                </div>

                <h4
                  className="font-display"
                  style={{
                    fontSize: '1.15rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    marginBottom: '8px'
                  }}
                >
                  {evt.title}
                </h4>

                <p
                  style={{
                    fontSize: '0.85rem',
                    lineHeight: 1.55,
                    color: 'var(--text-secondary)',
                    marginBottom: '16px'
                  }}
                >
                  {evt.description}
                </p>

                <div
                  style={{
                    marginTop: 'auto',
                    paddingTop: '12px',
                    borderTop: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '8px'
                  }}
                >
                  <span className="font-mono" style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                    CHAMPION
                  </span>
                  <span
                    className="font-mono"
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      textAlign: 'right'
                    }}
                  >
                    {evt.podium?.first || 'Chronos Syndicate'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .event-hero-card {
          grid-template-columns: 1fr;
        }
        .archive-events-grid {
          grid-template-columns: 1fr;
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
        @media (min-width: 640px) {
          .archive-events-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 1024px) {
          .events-main-section {
            padding: 120px 0;
          }
          .events-header {
            margin-bottom: 64px;
          }
          .event-hero-card {
            grid-template-columns: 1fr 1fr;
            margin-bottom: 72px;
          }
          .event-hero-visual {
            min-height: 400px;
            padding: 36px;
          }
          .event-hero-content {
            padding: 44px 36px;
          }
        }
      `}</style>
    </section>
  );
};

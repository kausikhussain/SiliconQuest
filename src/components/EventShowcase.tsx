import React from 'react';
import { Calendar, MapPin, Trophy, Award, Clock, Users, Flame } from 'lucide-react';
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
            AUGUST 2026 EVENT STORY — Complete Visual Narrative
            (Opening → Live Telemetry → Finals → Winners → First-Year 2026)
        ═══════════════════════════════════════════════════════════════════ */}
        <div id="laurels" style={{ marginBottom: '24px', scrollMarginTop: '100px' }}>
          <div
            className="font-mono"
            style={{
              fontSize: '0.72rem',
              color: 'var(--accent-cyan)',
              letterSpacing: '0.15em',
              marginBottom: '8px',
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Flame size={13} />
            LATEST COMPLETED EVENT STORY · AUGUST 2026
          </div>
          <h3
            className="font-display"
            style={{
              fontSize: 'clamp(1.6rem, 3.8vw, 2.4rem)',
              fontWeight: 800,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
              marginBottom: '8px'
            }}
          >
            COLLEGE QUIZ LEAGUE
          </h3>
          <p
            style={{
              fontSize: '0.92rem',
              color: 'var(--text-secondary)',
              maxWidth: '700px',
              lineHeight: 1.6,
              marginBottom: '32px'
            }}
          >
            The comprehensive visual archive of the August 2026 championship — tracing the complete journey from opening briefing and 20 live speed rounds to the decisive stage finals, champions podium, and the 2026 first-year cohort assembly.
          </p>
        </div>

        {/* Event Story Step 1 & 2: Opening Briefing + Live Arena Telemetry */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
            marginBottom: '36px'
          }}
        >
          {/* Card 1: Opening Briefing */}
          <div
            className="glass-panel"
            style={{
              borderRadius: '20px',
              overflow: 'hidden',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column'
            }}
            onMouseEnter={() => sound.playHover()}
          >
            <div style={{ height: '240px', overflow: 'hidden', position: 'relative' }}>
              <img
                src="/assets/images/WhatsApp Image 2026-08-23 at 12.49.07 AM.jpeg"
                alt="Opening Ceremony and Welcome Briefing"
                className="img-hover-shine"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                loading="lazy"
              />
              <div
                className="font-mono"
                style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  padding: '4px 10px',
                  borderRadius: '999px',
                  background: 'rgba(7, 9, 14, 0.85)',
                  backdropFilter: 'blur(8px)',
                  fontSize: '0.62rem',
                  color: 'var(--accent-cyan)',
                  border: '1px solid rgba(0, 242, 254, 0.3)',
                  fontWeight: 600,
                  letterSpacing: '0.08em'
                }}
              >
                01 · OPENING
              </div>
            </div>
            <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div className="font-mono" style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                AUDITORIUM STAGE · BRIEFING
              </div>
              <h4 className="font-display" style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                Welcome & Competition Protocol
              </h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                Faculty advisors and club leadership inaugurating the session and outlining speed-league scoring rules.
              </p>
            </div>
          </div>

          {/* Card 2: Live Arena Telemetry */}
          <div
            className="glass-panel"
            style={{
              borderRadius: '20px',
              overflow: 'hidden',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column'
            }}
            onMouseEnter={() => sound.playHover()}
          >
            <div style={{ height: '240px', overflow: 'hidden', position: 'relative' }}>
              <img
                src="/assets/images/WhatsApp Image 2026-08-23 at 12.39.13 AM.jpeg"
                alt="Live Telemetry and Audience Scoreboard"
                className="img-hover-shine"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                loading="lazy"
              />
              <div
                className="font-mono"
                style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  padding: '4px 10px',
                  borderRadius: '999px',
                  background: 'rgba(7, 9, 14, 0.85)',
                  backdropFilter: 'blur(8px)',
                  fontSize: '0.62rem',
                  color: 'var(--accent-cyan)',
                  border: '1px solid rgba(0, 242, 254, 0.3)',
                  fontWeight: 600,
                  letterSpacing: '0.08em'
                }}
              >
                02 · LIVE ROUNDS
              </div>
            </div>
            <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div className="font-mono" style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                DIGITAL ARENA #2229 510
              </div>
              <h4 className="font-display" style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                Slido Live Telemetry & Speed Grid
              </h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                20 rapid-fire rounds with real-time digital scoring and live crowd responses projected onto the main arena display.
              </p>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            Event Story Step 3: THE FINAL ROUND (Dedicated High Visual Priority)
        ═══════════════════════════════════════════════════════════════════ */}
        <div
          className="glass-panel finals-hero-moment"
          style={{
            borderRadius: '24px',
            overflow: 'hidden',
            border: '1px solid var(--border-accent)',
            boxShadow: 'var(--shadow-elevated)',
            marginBottom: '36px',
            display: 'grid',
            gridTemplateColumns: '1fr',
            background: 'var(--bg-card)'
          }}
          onMouseEnter={() => sound.playHover()}
        >
          {/* Large Editorial Photograph */}
          <div style={{ position: 'relative', overflow: 'hidden', minHeight: '340px' }} className="finals-hero-image">
            <img
              src="/assets/images/Finale Between Winners.jpeg"
              alt="Finals Between Participating Teams"
              className="img-hover-shine"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                minHeight: '340px'
              }}
              loading="lazy"
            />
            {/* Dark Scrim */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(7, 9, 14, 0.85) 0%, rgba(7, 9, 14, 0.2) 60%, transparent 100%)'
              }}
            />
            <div
              className="font-mono"
              style={{
                position: 'absolute',
                top: '16px',
                left: '16px',
                padding: '6px 14px',
                borderRadius: '999px',
                background: 'rgba(7, 9, 14, 0.9)',
                backdropFilter: 'blur(10px)',
                fontSize: '0.68rem',
                color: 'var(--accent-cyan)',
                border: '1px solid var(--accent-cyan)',
                fontWeight: 700,
                letterSpacing: '0.12em',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              ● 03 · THE FINAL ROUND
            </div>
          </div>

          {/* Finals Editorial Context */}
          <div
            style={{
              padding: '32px 28px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              backgroundColor: 'var(--bg-card)'
            }}
          >
            <div
              className="font-mono"
              style={{
                fontSize: '0.72rem',
                color: 'var(--accent-cyan)',
                letterSpacing: '0.14em',
                marginBottom: '8px',
                textTransform: 'uppercase'
              }}
            >
              DECISIVE STAGE FINAL
            </div>
            <h3
              className="font-display"
              style={{
                fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)',
                fontWeight: 800,
                color: 'var(--text-primary)',
                letterSpacing: '-0.02em',
                marginBottom: '8px',
                lineHeight: 1.15
              }}
            >
              THE FINAL
            </h3>
            <p
              className="font-mono"
              style={{
                fontSize: '0.78rem',
                color: 'var(--text-muted)',
                letterSpacing: '0.06em',
                marginBottom: '16px'
              }}
            >
              High-pressure deduction between the top qualifying syndicates
            </p>
            <p
              style={{
                fontSize: '0.92rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                marginBottom: '20px'
              }}
            >
              The defining moments of the competition as finalist teams faced off on stage, tackling complex numerical deductions and speed tiebreakers under live arena scrutiny.
            </p>
            <div
              className="font-mono"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '0.74rem',
                color: 'var(--text-muted)',
                padding: '8px 14px',
                borderRadius: '10px',
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)',
                width: 'fit-content'
              }}
            >
              <Calendar size={13} color="var(--accent-cyan)" />
              <span>August 2026</span>
              <span>·</span>
              <MapPin size={13} color="var(--accent-cyan)" />
              <span>Main Stage Arena</span>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            Event Story Step 4 & 5: Champions Podium + First-Year 2026 Cohort
        ═══════════════════════════════════════════════════════════════════ */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px',
            marginBottom: '72px'
          }}
        >
          {/* Card 4: Champions Podium & Winners */}
          <div
            className="glass-panel"
            style={{
              borderRadius: '20px',
              overflow: 'hidden',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column'
            }}
            onMouseEnter={() => sound.playHover()}
          >
            <div style={{ height: '260px', overflow: 'hidden', position: 'relative' }}>
              <img
                src="/assets/images/WhatsApp Image 2026-08-23 at 12.39.08 AM.jpeg"
                alt="Gold Champions Trophy Presentation"
                className="img-hover-shine"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                loading="lazy"
              />
              <div
                className="font-mono"
                style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  padding: '4px 10px',
                  borderRadius: '999px',
                  background: 'rgba(7, 9, 14, 0.85)',
                  backdropFilter: 'blur(8px)',
                  fontSize: '0.62rem',
                  color: 'var(--accent-cyan)',
                  border: '1px solid rgba(0, 242, 254, 0.3)',
                  fontWeight: 600,
                  letterSpacing: '0.08em'
                }}
              >
                04 · WINNERS & PODIUM
              </div>
            </div>
            <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div
                className="font-mono"
                style={{
                  fontSize: '0.65rem',
                  color: 'var(--text-muted)',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  marginBottom: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontWeight: 700
                }}
              >
                <Award size={14} color="var(--accent-cyan)" />
                <span>VERIFIED CHAMPIONSHIP PODIUM</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  {
                    rank: '1ST',
                    names: 'Rahul Raj & Samson Barjo',
                    badge: '🥇',
                    color: '#f59e0b',
                    bg: 'rgba(245, 158, 11, 0.09)',
                    border: 'rgba(245, 158, 11, 0.35)',
                    iconBg: 'rgba(245, 158, 11, 0.16)'
                  },
                  {
                    rank: '2ND',
                    names: 'Aprna Dash & Ankita Tarai',
                    badge: '🥈',
                    color: '#94a3b8',
                    bg: 'rgba(148, 163, 184, 0.08)',
                    border: 'rgba(148, 163, 184, 0.3)',
                    iconBg: 'rgba(148, 163, 184, 0.14)'
                  },
                  {
                    rank: '3RD',
                    names: 'Samyak Raj & Ayush Jena',
                    badge: '🥉',
                    color: '#d97706',
                    bg: 'rgba(217, 119, 6, 0.08)',
                    border: 'rgba(217, 119, 6, 0.3)',
                    iconBg: 'rgba(217, 119, 6, 0.14)'
                  }
                ].map((podiumItem, pi) => (
                  <div
                    key={pi}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      background: podiumItem.bg,
                      border: `1px solid ${podiumItem.border}`,
                      transition: 'transform 0.25s ease, border-color 0.25s ease'
                    }}
                  >
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: podiumItem.iconBg,
                        border: `1px solid ${podiumItem.border}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <Trophy size={14} color={podiumItem.color} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        className="font-mono"
                        style={{
                          fontSize: '0.62rem',
                          color: podiumItem.color,
                          letterSpacing: '0.12em',
                          fontWeight: 700,
                          marginBottom: '2px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px'
                        }}
                      >
                        <span>{podiumItem.badge}</span>
                        <span>{podiumItem.rank}</span>
                      </div>
                      <div
                        style={{
                          fontSize: '0.92rem',
                          fontWeight: 700,
                          color: 'var(--text-primary)',
                          lineHeight: 1.35,
                          wordBreak: 'break-word'
                        }}
                      >
                        {podiumItem.names}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Card 5: FIRST-YEAR 2026 COHORT (High Prominence) */}
          <div
            className="glass-panel first-year-card"
            style={{
              borderRadius: '20px',
              overflow: 'hidden',
              border: '1px solid var(--border-accent)',
              display: 'flex',
              flexDirection: 'column'
            }}
            onMouseEnter={() => sound.playHover()}
          >
            <div style={{ height: '260px', overflow: 'hidden', position: 'relative' }}>
              <img
                src="/assets/images/First years 2026.jpeg"
                alt="First-Year 2026 Cohort Assembly"
                className="img-hover-shine"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                loading="lazy"
              />
              <div
                className="font-mono"
                style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  padding: '4px 10px',
                  borderRadius: '999px',
                  background: 'rgba(7, 9, 14, 0.85)',
                  backdropFilter: 'blur(8px)',
                  fontSize: '0.62rem',
                  color: 'var(--accent-cyan)',
                  border: '1px solid var(--accent-cyan)',
                  fontWeight: 700,
                  letterSpacing: '0.08em'
                }}
              >
                05 · FIRST-YEAR · 2026
              </div>
            </div>
            <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div
                className="font-mono"
                style={{
                  fontSize: '0.68rem',
                  color: 'var(--accent-cyan)',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  marginBottom: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Users size={12} />
                2026 INTAKE ASSEMBLY
              </div>
              <h4
                className="font-display"
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  marginBottom: '8px'
                }}
              >
                First-Year 2026 Participants
              </h4>
              <p
                style={{
                  fontSize: '0.85rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.6,
                  marginBottom: '14px'
                }}
              >
                The incoming 2026 first-year batch gathered in the lecture hall auditorium holding their commendations and awards after their inaugural club challenge.
              </p>
              <div
                className="font-mono"
                style={{
                  fontSize: '0.72rem',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <MapPin size={11} color="var(--accent-cyan)" />
                Lecture Hall Auditorium · August 2026
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            2025 COMPLETED CHAMPIONSHIPS ARCHIVE
        ═══════════════════════════════════════════════════════════════════ */}
        <div style={{ marginBottom: '24px' }}>
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
            2025 CHAMPIONSHIPS ARCHIVE
          </div>
          <div style={{ width: '48px', height: '2px', background: 'var(--border-accent)', borderRadius: '1px' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', marginBottom: '64px' }}>
          {completedEvents
            .filter((e) => e.year === 2025)
            .map((evt, idx) => (
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

        /* Finals Hero Moment */
        @media (min-width: 1024px) {
          .finals-hero-moment {
            grid-template-columns: 1.2fr 1fr !important;
          }
          .finals-hero-image {
            min-height: 420px !important;
          }
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

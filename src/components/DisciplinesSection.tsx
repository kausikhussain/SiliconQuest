import React, { useState } from 'react';
import { Telescope, BrainCircuit, Globe2, Film, Layers, Award, ChevronRight } from 'lucide-react';
import { sound } from '../utils/soundEngine';

interface Discipline {
  id: string;
  title: string;
  category: string;
  description: string;
  icon: React.ElementType;
  sampleQuestion: string;
  skills: string[];
  color: string;
}

export const DisciplinesSection: React.FC = () => {
  const [activeId, setActiveId] = useState<string>('sci');

  const disciplines: Discipline[] = [
    {
      id: 'sci',
      title: 'ASTRONOMY & SCIENCE',
      category: 'Empirical Frontiers',
      description: 'Retrograde orbital mechanics, quantum anomalies, particle physics, and deep space exploration trivia engineered for rigorous minds.',
      icon: Telescope,
      sampleQuestion: 'Which is the only planet in our solar system that exhibits retrograde rotation and a day longer than its year?',
      skills: ['Orbital Physics', 'Celestial Cartography', 'Astrophysics'],
      color: '#00f2fe'
    },
    {
      id: 'apt',
      title: 'SPEED APTITUDE & LOGIC',
      category: 'Mathematical Rigor',
      description: 'Clock angle coincidences, percentage splits, probability matrices, and modular arithmetic shortcuts practiced under high-stakes speed clocks.',
      icon: BrainCircuit,
      sampleQuestion: 'At what exact second between 3 and 4 o\'clock do the minute and hour hands perfectly coincide?',
      skills: ['Mental Shortcuts', 'Clock Angle Math', 'Algebraic Speed'],
      color: '#38bdf8'
    },
    {
      id: 'geo',
      title: 'GEOPOLITICS & HISTORY',
      category: 'Civilizational Intellect',
      description: 'Treaties, revolutions, cartographical shifts, espionage lore, and constitutional milestones spanning ancient to modern eras.',
      icon: Globe2,
      sampleQuestion: 'Which nation hosted and triumphed in the inaugural 1930 FIFA World Cup while building the Americas\' earliest welfare state?',
      skills: ['Diplomatic History', 'Cartography', 'Global Geopolitics'],
      color: '#a5b4fc'
    },
    {
      id: 'vis',
      title: 'VISUAL & POP CONNECTS',
      category: 'Lateral Deduction',
      description: 'Deciphering multi-layered four-clue visual collages, cryptic anagrams, cinema easter eggs, and brand evolution riddles.',
      icon: Film,
      sampleQuestion: 'What historic 1912 sandwich confectionary was born as a direct rival to Sunshine\'s Hydrox cookie?',
      skills: ['Visual Patterning', 'Pop Culture Lore', 'Cross-Domain Connects'],
      color: '#f59e0b'
    },
    {
      id: 'ses',
      title: 'PRELIMS & MASTERCLASSES',
      category: 'Knowledge Incubation',
      description: 'Weekly classroom prelims in Silicon lecture halls, mentorship pods, question formulation labs, and mock buzzer scrimmages.',
      icon: Layers,
      sampleQuestion: 'How to structure multi-tiered lead-ins so that every clue narrows down the answer space exponentially?',
      skills: ['Question Setting', 'Fact Verification', 'Debate & Review'],
      color: '#10b981'
    },
    {
      id: 'are',
      title: 'ARENA FINALS & BUZZERS',
      category: 'Mainstage Championships',
      description: 'Auditorium-scale digital championships with live telemetry, buzzer systems, synchronized audience participation, and championship trophies.',
      icon: Award,
      sampleQuestion: 'Real-time 20-round arena challenges streamed live across Silicon campuses.',
      skills: ['Buzzer Reflexes', 'Auditorium Moderation', 'Live Telemetry'],
      color: '#f43f5e'
    }
  ];

  const activeDiscipline = disciplines.find((d) => d.id === activeId) || disciplines[0];
  const ActiveIcon = activeDiscipline.icon;

  return (
    <section
      id="disciplines"
      style={{
        padding: '80px 0',
        backgroundColor: 'var(--bg-primary)',
        position: 'relative',
        borderTop: '1px solid var(--border-subtle)'
      }}
      className="disciplines-main-section"
    >
      <div className="section-container">
        {/* Section Header */}
        <div style={{ marginBottom: '40px' }} className="disciplines-header">
          <div className="section-tagline">04 · DOMAINS OF INTELLECT</div>
          <h2 className="section-title">
            WHAT WE <span style={{ color: 'var(--accent-cyan)' }}>EXPLORE</span>
          </h2>
          <p className="section-subtitle">
            From deep cosmos astrophysics to high-speed modular arithmetic, our research tracks synthesize the frontiers of human inquiry.
          </p>
        </div>

        {/* Mobile Horizontal Category Filter Strip */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '16px',
            marginBottom: '24px'
          }}
          className="disciplines-mobile-tabs hide-scrollbar"
        >
          {disciplines.map((d) => {
            const Icon = d.icon;
            const isActive = d.id === activeId;
            return (
              <button
                key={d.id}
                onClick={() => {
                  sound.playClick();
                  setActiveId(d.id);
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 16px',
                  borderRadius: '999px',
                  background: isActive ? 'var(--accent-cyan)' : 'var(--btn-secondary-bg)',
                  color: isActive ? '#07090e' : 'var(--text-secondary)',
                  border: `1px solid ${isActive ? 'var(--accent-cyan)' : 'var(--border-subtle)'}`,
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'all 0.2s ease',
                  minHeight: '42px'
                }}
              >
                <Icon size={16} />
                <span>{d.title.split('&')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Desktop 2-Column Switchboard / Mobile Showcase Stack */}
        <div
          style={{
            display: 'grid',
            gap: '24px',
            alignItems: 'start'
          }}
          className="disciplines-grid-layout"
        >
          {/* Left Vertical List of Disciplines (Desktop) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }} className="disciplines-desktop-list">
            {disciplines.map((d) => {
              const Icon = d.icon;
              const isActive = d.id === activeId;
              return (
                <button
                  key={d.id}
                  onClick={() => {
                    sound.playClick();
                    setActiveId(d.id);
                  }}
                  onMouseEnter={() => sound.playHover()}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px 20px',
                    borderRadius: '14px',
                    background: isActive ? 'var(--bg-card)' : 'transparent',
                    border: `1px solid ${isActive ? 'var(--border-accent)' : 'var(--border-subtle)'}`,
                    boxShadow: isActive ? 'var(--shadow-subtle)' : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '10px',
                        background: isActive ? 'var(--accent-cyan-glow)' : 'var(--btn-secondary-bg)',
                        border: `1px solid ${isActive ? 'var(--border-accent)' : 'var(--border-subtle)'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isActive ? 'var(--accent-cyan)' : 'var(--text-muted)',
                        flexShrink: 0
                      }}
                    >
                      <Icon size={18} />
                    </div>

                    <div>
                      <span
                        className="font-mono"
                        style={{
                          display: 'block',
                          fontSize: '0.68rem',
                          color: isActive ? 'var(--accent-cyan)' : 'var(--text-muted)',
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          marginBottom: '2px'
                        }}
                      >
                        {d.category}
                      </span>
                      <span
                        className="font-display"
                        style={{
                          fontSize: '1rem',
                          fontWeight: 700,
                          color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)'
                        }}
                      >
                        {d.title}
                      </span>
                    </div>
                  </div>

                  <ChevronRight
                    size={16}
                    color={isActive ? 'var(--accent-cyan)' : 'var(--text-muted)'}
                    style={{
                      transform: isActive ? 'translateX(4px)' : 'none',
                      transition: 'transform 0.2s ease'
                    }}
                  />
                </button>
              );
            })}
          </div>

          {/* Right Showcase Detail Panel */}
          <div
            className="glass-panel disciplines-showcase-panel"
            style={{
              padding: '28px 24px',
              borderRadius: '20px'
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                borderRadius: '999px',
                background: 'var(--accent-cyan-glow)',
                border: '1px solid var(--border-accent)',
                marginBottom: '18px'
              }}
            >
              <ActiveIcon size={15} color="var(--accent-cyan)" />
              <span
                className="font-mono"
                style={{
                  fontSize: '0.72rem',
                  color: 'var(--accent-cyan)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  fontWeight: 600
                }}
              >
                {activeDiscipline.category}
              </span>
            </div>

            <h3
              className="font-display"
              style={{
                fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                fontWeight: 800,
                color: 'var(--text-primary)',
                letterSpacing: '-0.02em',
                marginBottom: '12px'
              }}
            >
              {activeDiscipline.title}
            </h3>

            <p
              style={{
                fontSize: '0.925rem',
                lineHeight: 1.65,
                color: 'var(--text-secondary)',
                marginBottom: '24px'
              }}
            >
              {activeDiscipline.description}
            </p>

            {/* Core Competencies Pills */}
            <div style={{ marginBottom: '24px' }}>
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
                CORE COMPETENCIES & TRACKS
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {activeDiscipline.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="font-mono"
                    style={{
                      fontSize: '0.72rem',
                      padding: '5px 12px',
                      borderRadius: '6px',
                      background: 'var(--btn-secondary-bg)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)'
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Example Arena Challenge Box */}
            <div
              style={{
                padding: '18px 20px',
                borderRadius: '14px',
                background: 'var(--btn-secondary-bg)',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.68rem',
                  color: 'var(--accent-cyan)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  marginBottom: '8px'
                }}
              >
                <span>TYPICAL ARENA ENIGMA</span>
              </div>
              <p
                style={{
                  fontSize: '0.875rem',
                  lineHeight: 1.55,
                  color: 'var(--text-primary)',
                  fontStyle: 'italic'
                }}
              >
                "{activeDiscipline.sampleQuestion}"
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .disciplines-mobile-tabs {
          display: flex;
        }
        .disciplines-desktop-list {
          display: none;
        }
        .disciplines-grid-layout {
          grid-template-columns: 1fr;
        }
        @media (min-width: 1024px) {
          .disciplines-main-section {
            padding: 120px 0;
          }
          .disciplines-header {
            margin-bottom: 64px;
          }
          .disciplines-mobile-tabs {
            display: none !important;
          }
          .disciplines-desktop-list {
            display: flex !important;
          }
          .disciplines-grid-layout {
            grid-template-columns: 360px 1fr;
            gap: 32px;
          }
          .disciplines-showcase-panel {
            padding: 44px 36px !important;
            position: sticky;
            top: 100px;
          }
        }
      `}</style>
    </section>
  );
};

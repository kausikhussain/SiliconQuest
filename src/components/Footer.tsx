import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { sound } from '../utils/soundEngine';

export const Footer: React.FC = () => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const istString = now.toLocaleTimeString('en-US', {
        timeZone: 'Asia/Kolkata',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      setTime(`${istString} IST`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    sound.playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderTop: '1px solid var(--border-subtle)',
        padding: '60px 0 calc(32px + var(--sab))',
        position: 'relative',
        zIndex: 10
      }}
      className="footer-main-container"
    >
      <div className="section-container">
        {/* Top Grid */}
        <div
          style={{
            display: 'grid',
            gap: '36px',
            marginBottom: '48px'
          }}
          className="footer-top-grid"
        >
          {/* Brand & Manifesto Column */}
          <div style={{ maxWidth: '420px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
                  <polygon
                    points="50,5 90,27 90,73 50,95 10,73 10,27"
                    fill="none"
                    stroke="var(--accent-cyan)"
                    strokeWidth="8"
                  />
                  <polygon
                    points="50,25 75,40 75,60 50,75 25,60 25,40"
                    fill="var(--accent-cyan)"
                    opacity="0.8"
                  />
                </svg>
              </div>

              <h2
                className="font-display"
                style={{
                  fontSize: '1.15rem',
                  fontWeight: 800,
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.02em'
                }}
              >
                SILICON <span style={{ color: 'var(--accent-cyan)' }}>QUIZ CLUB</span>
              </h2>
            </div>

            <p
              style={{
                fontSize: '0.875rem',
                lineHeight: 1.6,
                color: 'var(--text-secondary)',
                marginBottom: '20px'
              }}
            >
              The definitive competitive quiz society of Silicon Institute of Technology & Silicon University. Cultivating lateral intellect, analytical speed, and championship honors.
            </p>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                borderRadius: '8px',
                background: 'var(--btn-secondary-bg)',
                border: '1px solid var(--border-subtle)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.68rem',
                color: 'var(--accent-cyan)'
              }}
            >
              <div
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--accent-emerald)',
                  boxShadow: '0 0 8px var(--accent-emerald)'
                }}
              />
              <span>HEADQUARTERS · {time}</span>
            </div>
          </div>

          {/* Institutional Coordinates */}
          <div>
            <span
              className="font-mono"
              style={{
                display: 'block',
                fontSize: '0.7rem',
                color: 'var(--accent-cyan)',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                marginBottom: '16px'
              }}
            >
              INSTITUTIONAL CAMPUSES
            </span>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <strong
                  style={{
                    display: 'block',
                    color: 'var(--text-primary)',
                    fontSize: '0.85rem',
                    marginBottom: '2px'
                  }}
                >
                  Silicon Institute of Technology, Sambalpur
                </strong>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', lineHeight: 1.45 }}>
                  Silicon West, Sason, Sambalpur, Odisha — 768200
                </p>
              </div>

              <div>
                <strong
                  style={{
                    display: 'block',
                    color: 'var(--text-primary)',
                    fontSize: '0.85rem',
                    marginBottom: '2px'
                  }}
                >
                  Silicon University, Bhubaneswar
                </strong>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', lineHeight: 1.45 }}>
                  Silicon Hills, Patia, Bhubaneswar, Odisha — 751024
                </p>
              </div>
            </div>
          </div>

          {/* Direct Navigation Links */}
          <div>
            <span
              className="font-mono"
              style={{
                display: 'block',
                fontSize: '0.7rem',
                color: 'var(--accent-cyan)',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                marginBottom: '16px'
              }}
            >
              DIRECTORY
            </span>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { label: '01 · Manifesto & Core Pillars', href: '#about' },
                { label: '02 · Intellectual Disciplines', href: '#disciplines' },
                { label: '03 · Flagship Tournaments', href: '#events' },
                { label: '04 · Championship Laurels', href: '#laurels' },
                { label: '05 · Visual Archives & Gallery', href: '#gallery' },
                { label: '06 · Syndicate Leadership', href: '#team' },
                { label: '07 · Archival Vault', href: '#vault' }
              ].map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link.href}
                    onClick={() => sound.playClick()}
                    style={{
                      color: 'var(--text-secondary)',
                      textDecoration: 'none',
                      fontSize: '0.825rem',
                      transition: 'color 0.2s ease'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-cyan)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar with Back to Top */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '14px',
            paddingTop: '24px',
            borderTop: '1px solid var(--border-subtle)'
          }}
        >
          <p
            className="font-mono"
            style={{
              fontSize: '0.7rem',
              color: 'var(--text-muted)',
              lineHeight: 1.5
            }}
          >
            © 2026 SILICON QUIZ CLUB. SILICON INSTITUTE OF TECHNOLOGY & SILICON UNIVERSITY.
          </p>

          <button
            onClick={scrollToTop}
            aria-label="Back to Top"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'var(--btn-secondary-bg)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)',
              padding: '8px 14px',
              borderRadius: '999px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              minHeight: '36px'
            }}
            onMouseEnter={() => sound.playHover()}
          >
            <span>BACK TO TOP</span>
            <ArrowUp size={12} />
          </button>
        </div>
      </div>

      <style>{`
        .footer-top-grid {
          grid-template-columns: 1fr;
        }
        @media (min-width: 640px) {
          .footer-top-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 1024px) {
          .footer-main-container {
            padding: 100px 0 40px;
          }
          .footer-top-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 48px;
            margin-bottom: 80px;
          }
        }
      `}</style>
    </footer>
  );
};

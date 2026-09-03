import React, { useState, useEffect } from 'react';
import { ArrowUp, Lock } from 'lucide-react';
import { sound } from '../utils/soundEngine';

interface FooterProps {
  onOpenAdminModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdminModal }) => {
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
        position: 'relative',
        zIndex: 10,
        backgroundColor: 'var(--bg-primary)',
        borderTop: '1px solid var(--border-subtle)',
        padding: 'calc(60px + var(--sat)) calc(16px + var(--sar)) calc(40px + var(--sab)) calc(16px + var(--sal))'
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '48px'
        }}
      >
        {/* Main Grid: Identity, Campus, and Directory */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '40px'
          }}
        >
          {/* Identity & Mission */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
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
                    strokeLinecap="round"
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
              The definitive competitive quiz society of Silicon Institute of Technology, Sambalpur, Odisha. Cultivating
              lateral intellect, analytical speed, and championship honors.
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

          {/* Institutional Location */}
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
              INSTITUTIONAL LOCATION
            </span>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <strong
                  style={{
                    display: 'block',
                    color: 'var(--text-primary)',
                    fontSize: '0.88rem',
                    marginBottom: '4px'
                  }}
                >
                  Silicon Institute of Technology, Sambalpur
                </strong>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', lineHeight: 1.5 }}>
                  Silicon West, Sason, Sambalpur, Odisha — 768200
                </p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', marginTop: '6px', fontFamily: 'var(--font-mono)' }}>
                  Affiliated to BPUT, Odisha · AICTE Approved
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

              {/* Admin Portal Trigger in Footer */}
              {onOpenAdminModal && (
                <li style={{ marginTop: '6px' }}>
                  <button
                    onClick={() => {
                      sound.playClick();
                      onOpenAdminModal();
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      color: 'var(--accent-cyan)',
                      fontSize: '0.825rem',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontFamily: 'var(--font-mono)'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                    onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
                  >
                    <Lock size={12} />
                    <span>08 · Club Admin Portal</span>
                  </button>
                </li>
              )}
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
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
              lineHeight: 1.5
            }}
          >
            © 2026 SILICON QUIZ CLUB. SILICON INSTITUTE OF TECHNOLOGY, SAMBALPUR, ODISHA.
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
            onMouseEnter={(e) => {
              sound.playHover();
              e.currentTarget.style.borderColor = 'var(--accent-cyan)';
              e.currentTarget.style.color = 'var(--accent-cyan)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-subtle)';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
          >
            <span>BACK TO TOP</span>
            <ArrowUp size={13} />
          </button>
        </div>
      </div>
    </footer>
  );
};

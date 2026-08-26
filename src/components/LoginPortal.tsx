import React, { useState } from 'react';
import { Lock, ArrowRight, Sparkles, User, Key, ShieldCheck } from 'lucide-react';
import { sound } from '../utils/soundEngine';

interface LoginPortalProps {
  onLoginSuccess: (user: { name: string; sicId: string; role: string }) => void;
}

export const LoginPortal: React.FC<LoginPortalProps> = ({ onLoginSuccess }) => {
  const [sicId, setSicId] = useState('');
  const [passcode, setPasscode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleMemberLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sicId.trim()) {
      setErrorMsg('Please enter your SIC / Student ID');
      sound.playIncorrect();
      return;
    }

    setIsLoading(true);
    sound.playClick();

    setTimeout(() => {
      sound.playSuccessCelebration();
      onLoginSuccess({
        name: sicId.toUpperCase(),
        sicId: sicId.toUpperCase(),
        role: 'Verified Member'
      });
    }, 600);
  };

  const handleGuestLogin = () => {
    sound.playClick();
    setIsLoading(true);

    setTimeout(() => {
      sound.playSuccessCelebration();
      onLoginSuccess({
        name: 'Guest Scholar',
        sicId: 'GUEST-SQC-2026',
        role: 'Guest Access'
      });
    }, 400);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        backgroundColor: '#060709',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'calc(16px + var(--sat)) calc(16px + var(--sar)) calc(16px + var(--sab)) calc(16px + var(--sal))',
        overflowY: 'auto'
      }}
    >
      {/* Background Atmosphere */}
      <div className="bg-atmosphere" />
      <div className="bg-grid-pattern" />

      {/* Radial Glow */}
      <div
        style={{
          position: 'absolute',
          width: 'clamp(300px, 80vw, 600px)',
          height: 'clamp(300px, 80vw, 600px)',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 242, 254, 0.08) 0%, transparent 70%)',
          pointerEvents: 'none'
        }}
      />

      {/* Main Login Card */}
      <div
        className="glass-panel-accent login-card-container"
        style={{
          maxWidth: '460px',
          width: '100%',
          borderRadius: '24px',
          padding: '32px 24px',
          position: 'relative',
          zIndex: 10,
          border: '1px solid rgba(0, 242, 254, 0.3)',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.9), 0 0 40px -10px rgba(0, 242, 254, 0.2)'
        }}
      >
        {/* Brand Emblem */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            marginBottom: '24px'
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              background: 'rgba(0, 242, 254, 0.1)',
              border: '1px solid rgba(0, 242, 254, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '12px',
              boxShadow: '0 0 20px rgba(0, 242, 254, 0.25)'
            }}
          >
            <Lock size={20} color="#00f2fe" />
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.68rem',
              color: 'var(--accent-cyan)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: '4px'
            }}
          >
            <Sparkles size={11} />
            <span>SILICON UNIVERSITY · AUTHENTICATION</span>
          </div>

          <h1
            className="font-display"
            style={{
              fontSize: 'clamp(1.4rem, 4.5vw, 1.75rem)',
              fontWeight: 800,
              color: '#ffffff',
              letterSpacing: '-0.02em',
              marginBottom: '4px'
            }}
          >
            SILICON QUIZ CLUB
          </h1>

          <p
            style={{
              fontSize: '0.825rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.45
            }}
          >
            Access the intellectual syndicate & digital championship arena.
          </p>
        </div>

        {/* Member Login Form */}
        <form onSubmit={handleMemberLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label
              className="font-mono"
              style={{ display: 'block', fontSize: '0.68rem', color: 'var(--text-muted)', marginBottom: '4px' }}
            >
              SIC / STUDENT ID OR EMAIL
            </label>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '11px 14px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <User size={15} color="var(--text-muted)" />
              <input
                type="text"
                placeholder="e.g. 23BCE104 or quizzer@silicon.ac.in"
                value={sicId}
                onChange={(e) => {
                  setSicId(e.target.value);
                  setErrorMsg('');
                }}
                disabled={isLoading}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#ffffff',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '16px',
                  width: '100%'
                }}
              />
            </div>
          </div>

          <div>
            <label
              className="font-mono"
              style={{ display: 'block', fontSize: '0.68rem', color: 'var(--text-muted)', marginBottom: '4px' }}
            >
              ACCESS PASSCODE (OPTIONAL)
            </label>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '11px 14px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <Key size={15} color="var(--text-muted)" />
              <input
                type="password"
                placeholder="••••••••••••"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                disabled={isLoading}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#ffffff',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '16px',
                  width: '100%'
                }}
              />
            </div>
          </div>

          {errorMsg && (
            <div
              style={{
                fontSize: '0.75rem',
                color: '#f43f5e',
                fontFamily: 'var(--font-mono)'
              }}
            >
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="btn-cyan"
            style={{ width: '100%', padding: '13px', marginTop: '4px' }}
            onMouseEnter={() => sound.playHover()}
          >
            <ShieldCheck size={15} />
            <span>{isLoading ? 'VERIFYING CREDENTIALS...' : 'ENTER AS MEMBER'}</span>
          </button>
        </form>

        {/* Divider */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            margin: '20px 0 16px',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.68rem'
          }}
        >
          <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.08)' }} />
          <span>OR</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.08)' }} />
        </div>

        {/* Instant 1-Click Guest Access */}
        <button
          onClick={handleGuestLogin}
          disabled={isLoading}
          className="btn-secondary"
          style={{
            width: '100%',
            padding: '13px',
            fontSize: '0.8rem',
            letterSpacing: '0.04em'
          }}
          onMouseEnter={() => sound.playHover()}
        >
          <span>QUICK GUEST SCHOLAR ACCESS</span>
          <ArrowRight size={14} />
        </button>

        {/* Footer info */}
        <div
          style={{
            marginTop: '20px',
            textAlign: 'center',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.65rem',
            color: 'var(--text-muted)'
          }}
        >
          SAMBALPUR & BHUBANESWAR CAMPUSES · SILICON UNIVERSITY
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .login-card-container {
            padding: 44px 36px !important;
            border-radius: 28px !important;
          }
        }
      `}</style>
    </div>
  );
};

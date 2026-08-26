import React, { useState } from 'react';
import { X, CheckCircle2, ArrowRight, Send } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/soundEngine';

interface JoinModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: string;
}

export const JoinModal: React.FC<JoinModalProps> = ({ isOpen, onClose, defaultRole }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [studentId, setStudentId] = useState('');
  const [college, setCollege] = useState('Silicon Institute of Technology, Sambalpur');
  const [track, setTrack] = useState(defaultRole || 'Stage Quizmaster & Host');
  const [triviaFact, setTriviaFact] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playSuccessCelebration();
    setIsSubmitted(true);
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 }
      });
    } catch {
      // safe
    }
  };

  const handleClose = () => {
    sound.playClick();
    onClose();
    setTimeout(() => {
      setStep(1);
      setIsSubmitted(false);
    }, 300);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        backgroundColor: 'rgba(6, 7, 9, 0.92)',
        backdropFilter: 'blur(28px)',
        WebkitBackdropFilter: 'blur(28px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'calc(16px + var(--sat)) calc(16px + var(--sar)) calc(16px + var(--sab)) calc(16px + var(--sal))',
        animation: 'fadeIn 0.25s ease'
      }}
      onClick={handleClose}
    >
      <div
        className="glass-panel-accent join-modal-container"
        style={{
          width: '100%',
          maxWidth: '600px',
          maxHeight: '90dvh',
          overflowY: 'auto',
          borderRadius: '24px',
          padding: '28px 20px',
          position: 'relative',
          border: '1px solid rgba(0, 242, 254, 0.35)',
          boxShadow: '0 30px 80px -20px rgba(0, 0, 0, 0.95), 0 0 50px -10px rgba(0, 242, 254, 0.25)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Icon Button */}
        <button
          onClick={handleClose}
          aria-label="Close Modal"
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10
          }}
        >
          <X size={18} />
        </button>

        {!isSubmitted ? (
          <div>
            {/* Header */}
            <div style={{ marginBottom: '24px' }}>
              <div className="section-tagline">ANNUAL INTAKE · 2026</div>
              <h3
                className="font-display"
                style={{
                  fontSize: 'clamp(1.4rem, 4vw, 1.85rem)',
                  fontWeight: 800,
                  color: '#ffffff',
                  marginBottom: '6px'
                }}
              >
                JOIN SILICON QUIZ CLUB
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Step into the arena. Apply to become a competitive quizzer, lead researcher, or stage master.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              {step === 1 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label
                      className="font-mono"
                      style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '4px' }}
                    >
                      FULL NAME *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Priyabrata Pal"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '11px 14px',
                        borderRadius: '10px',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        color: '#ffffff',
                        fontFamily: 'var(--font-sans)',
                        fontSize: '16px',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gap: '12px'
                    }}
                    className="join-form-row-2"
                  >
                    <div>
                      <label
                        className="font-mono"
                        style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '4px' }}
                      >
                        EMAIL ADDRESS *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="you@silicon.ac.in"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '11px 14px',
                          borderRadius: '10px',
                          background: 'rgba(255, 255, 255, 0.04)',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          color: '#ffffff',
                          fontFamily: 'var(--font-sans)',
                          fontSize: '16px',
                          outline: 'none'
                        }}
                      />
                    </div>

                    <div>
                      <label
                        className="font-mono"
                        style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '4px' }}
                      >
                        STUDENT / SIC ID *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 23BCE104"
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '11px 14px',
                          borderRadius: '10px',
                          background: 'rgba(255, 255, 255, 0.04)',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          color: '#ffffff',
                          fontFamily: 'var(--font-sans)',
                          fontSize: '16px',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      className="font-mono"
                      style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '4px' }}
                    >
                      CAMPUS & INSTITUTION *
                    </label>
                    <select
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '11px 14px',
                        borderRadius: '10px',
                        background: '#0c0e14',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        color: '#ffffff',
                        fontFamily: 'var(--font-sans)',
                        fontSize: '16px',
                        outline: 'none'
                      }}
                    >
                      <option value="Silicon Institute of Technology, Sambalpur">
                        Silicon Institute of Technology, Sambalpur
                      </option>
                      <option value="Silicon University, Bhubaneswar">Silicon University, Bhubaneswar</option>
                      <option value="Other Partner University">Other Partner University</option>
                    </select>
                  </div>

                  <div style={{ marginTop: '8px' }}>
                    <button
                      type="button"
                      onClick={() => {
                        if (!name || !email || !studentId) {
                          alert('Please enter your Name, Email, and Student ID.');
                          return;
                        }
                        sound.playClick();
                        setStep(2);
                      }}
                      className="btn-primary"
                      style={{ width: '100%' }}
                    >
                      <span>PROCEED TO TRACK SELECTION</span>
                      <ArrowRight size={15} />
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label
                      className="font-mono"
                      style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '6px' }}
                    >
                      PRIMARY AREA OF EXCELLENCE *
                    </label>
                    <div
                      style={{
                        display: 'grid',
                        gap: '8px'
                      }}
                      className="join-track-grid"
                    >
                      {[
                        'Stage Quizmaster & Host',
                        'Hard Research & Question Framing',
                        'Competitive Quizzer / Player',
                        'Live Telemetry & Tech Ops'
                      ].map((t) => (
                        <div
                          key={t}
                          onClick={() => {
                            sound.playClick();
                            setTrack(t);
                          }}
                          style={{
                            padding: '12px 14px',
                            borderRadius: '10px',
                            background: track === t ? 'rgba(0, 242, 254, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                            border: `1px solid ${track === t ? 'var(--accent-cyan)' : 'rgba(255, 255, 255, 0.08)'}`,
                            color: track === t ? '#ffffff' : 'var(--text-secondary)',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            minHeight: '44px',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          {t}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label
                      className="font-mono"
                      style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '4px' }}
                    >
                      THE LATERAL ENIGMA TEST (OPTIONAL)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Share one obscure, fascinating fact or trivia riddle that you love..."
                      value={triviaFact}
                      onChange={(e) => setTriviaFact(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '11px 14px',
                        borderRadius: '10px',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        color: '#ffffff',
                        fontFamily: 'var(--font-sans)',
                        fontSize: '16px',
                        outline: 'none',
                        resize: 'none'
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                    <button
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setStep(1);
                      }}
                      className="btn-secondary"
                      style={{ flex: 1 }}
                    >
                      BACK
                    </button>

                    <button type="submit" className="btn-cyan" style={{ flex: 2 }}>
                      <Send size={14} />
                      <span>SUBMIT DOSSIER</span>
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        ) : (
          /* Confirmation State */
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid #10b981',
                color: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px'
              }}
            >
              <CheckCircle2 size={28} />
            </div>

            <span className="badge-tag-emerald" style={{ marginBottom: '10px' }}>
              APPLICATION DISPATCHED
            </span>

            <h3
              className="font-display"
              style={{
                fontSize: 'clamp(1.4rem, 4vw, 1.85rem)',
                fontWeight: 800,
                color: '#ffffff',
                marginBottom: '8px'
              }}
            >
              WELCOME TO THE SELECTION POOL
            </h3>

            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: '24px' }}>
              Thank you, <strong>{name}</strong>. Your application for <strong>{track}</strong> has been registered. You will receive orientation & prelim notifications at <strong>{email}</strong>.
            </p>

            <button onClick={handleClose} className="btn-primary" style={{ width: '100%', maxWidth: '280px' }}>
              RETURN TO ARCHIVES
            </button>
          </div>
        )}
      </div>

      <style>{`
        .join-form-row-2 {
          grid-template-columns: 1fr;
        }
        .join-track-grid {
          grid-template-columns: 1fr;
        }
        @media (min-width: 520px) {
          .join-modal-container {
            padding: 40px !important;
            border-radius: 28px !important;
          }
          .join-form-row-2 {
            grid-template-columns: 1fr 1fr;
          }
          .join-track-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>
    </div>
  );
};

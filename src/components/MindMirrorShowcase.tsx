import React, { useState, useEffect, useCallback, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Calendar, MapPin, ArrowLeft } from 'lucide-react';
import { sound } from '../utils/soundEngine';

/* ═══════════════════════════════════════════════════════════════════
   MINDMIRROR 2K26 — STRUCTURED EVENT DATA
   Curated image sequence for editorial storytelling.
   Images are from /assets/images/1/ and /assets/images/2/.
   Ordered by visual narrative: Inauguration → Faculty → Stage →
   Audience → Interaction → Certificates → Closing.
═══════════════════════════════════════════════════════════════════ */

interface MindMirrorImage {
  id: string;
  src: string;
  alt: string;
  layout: 'hero' | 'wide' | 'portrait' | 'standard';
  section: 'inauguration' | 'faculty' | 'stage' | 'audience' | 'interaction' | 'certificates';
}

const MINDMIRROR_IMAGES: MindMirrorImage[] = [
  // ── HERO: The wide banner ──
  {
    id: 'mm-banner',
    src: '/assets/images/1/Banner.jpeg',
    alt: 'MindMirror 2K26 — Quiz Club Orientation official event banner — Silicon Quiz Club',
    layout: 'hero',
    section: 'inauguration'
  },

  // ── INAUGURATION: Dais panel & Ceremonial Lamp Lighting ──
  {
    id: 'mm-inaug-dais',
    src: '/assets/images/2/WhatsApp Image 2026-09-25 at 5.31.59 AM.jpeg',
    alt: 'MindMirror 2K26 — Faculty panel seated at the dais with the orientation banner projected — Silicon Quiz Club',
    layout: 'wide',
    section: 'inauguration'
  },
  {
    id: 'mm-lamp-1',
    src: '/assets/images/2/WhatsApp Image 2026-09-25 at 5.32.00 AM (1).jpeg',
    alt: 'MindMirror 2K26 — Senior faculty dignitary lighting the ceremonial lamp at the event inauguration — Silicon Quiz Club',
    layout: 'portrait',
    section: 'inauguration'
  },
  {
    id: 'mm-lamp-2',
    src: '/assets/images/2/WhatsApp Image 2026-09-25 at 5.31.57 AM.jpeg',
    alt: 'MindMirror 2K26 — Faculty member lighting the ceremonial lamp — Silicon Quiz Club',
    layout: 'portrait',
    section: 'inauguration'
  },
  {
    id: 'mm-lamp-3',
    src: '/assets/images/2/WhatsApp Image 2026-09-25 at 5.31.56 AM (1).jpeg',
    alt: 'MindMirror 2K26 — Faculty coordinator lighting the ceremonial lamp — Silicon Quiz Club',
    layout: 'portrait',
    section: 'inauguration'
  },

  // ── FACULTY: Podium addresses ──
  {
    id: 'mm-faculty-1',
    src: '/assets/images/2/WhatsApp Image 2026-09-25 at 5.32.00 AM.jpeg',
    alt: 'MindMirror 2K26 — Faculty address at the Silicon podium — Silicon Quiz Club',
    layout: 'portrait',
    section: 'faculty'
  },
  {
    id: 'mm-faculty-2',
    src: '/assets/images/2/WhatsApp Image 2026-09-25 at 5.31.55 AM.jpeg',
    alt: 'MindMirror 2K26 — Faculty member addressing attendees at the podium — Silicon Quiz Club',
    layout: 'portrait',
    section: 'faculty'
  },
  {
    id: 'mm-faculty-3',
    src: '/assets/images/2/WhatsApp Image 2026-09-25 at 5.31.56 AM.jpeg',
    alt: 'MindMirror 2K26 — Faculty member addressing the audience from the podium — Silicon Quiz Club',
    layout: 'portrait',
    section: 'faculty'
  },

  // ── STAGE: Student presentations ──
  {
    id: 'mm-stage-1',
    src: '/assets/images/1/WhatsApp Image 2026-09-25 at 5.31.54 AM (1).jpeg',
    alt: 'MindMirror 2K26 — Student presentation with orientation banner projected — Silicon Quiz Club',
    layout: 'wide',
    section: 'stage'
  },
  {
    id: 'mm-stage-2',
    src: '/assets/images/2/WhatsApp Image 2026-09-25 at 5.32.01 AM.jpeg',
    alt: 'MindMirror 2K26 — Podium address with orientation banner displayed — Silicon Quiz Club',
    layout: 'portrait',
    section: 'stage'
  },
  {
    id: 'mm-stage-3',
    src: '/assets/images/1/WhatsApp Image 2026-09-25 at 5.31.51 AM (1).jpeg',
    alt: 'MindMirror 2K26 — Student addressing the audience at the podium — Silicon Quiz Club',
    layout: 'portrait',
    section: 'stage'
  },
  {
    id: 'mm-stage-4',
    src: '/assets/images/1/WhatsApp Image 2026-09-25 at 5.31.44 AM.jpeg',
    alt: 'MindMirror 2K26 — Club website being showcased on the projector during the event — Silicon Quiz Club',
    layout: 'wide',
    section: 'stage'
  },

  // ── AUDIENCE: Crowd and atmosphere ──
  {
    id: 'mm-audience-1',
    src: '/assets/images/1/WhatsApp Image 2026-09-25 at 5.31.52 AM (1).jpeg',
    alt: 'MindMirror 2K26 — Students seated in the seminar hall during the orientation — Silicon Quiz Club',
    layout: 'wide',
    section: 'audience'
  },
  {
    id: 'mm-audience-2',
    src: '/assets/images/2/WhatsApp Image 2026-09-25 at 5.32.02 AM.jpeg',
    alt: 'MindMirror 2K26 — Faculty and attendees in the seminar hall — Silicon Quiz Club',
    layout: 'wide',
    section: 'audience'
  },

  // ── INTERACTION: Students with microphones ──
  {
    id: 'mm-interact-1',
    src: '/assets/images/1/WhatsApp Image 2026-09-25 at 5.31.53 AM.jpeg',
    alt: 'MindMirror 2K26 — Student interaction moment with microphone — Silicon Quiz Club',
    layout: 'portrait',
    section: 'interaction'
  },
  {
    id: 'mm-interact-2',
    src: '/assets/images/1/WhatsApp Image 2026-09-25 at 5.31.52 AM.jpeg',
    alt: 'MindMirror 2K26 — Participants engaging with microphone during the session — Silicon Quiz Club',
    layout: 'portrait',
    section: 'interaction'
  },
  {
    id: 'mm-interact-3',
    src: '/assets/images/1/WhatsApp Image 2026-09-25 at 5.31.51 AM.jpeg',
    alt: 'MindMirror 2K26 — Students interacting from audience seats with microphone — Silicon Quiz Club',
    layout: 'portrait',
    section: 'interaction'
  },
  {
    id: 'mm-interact-4',
    src: '/assets/images/1/WhatsApp Image 2026-09-25 at 5.31.49 AM.jpeg',
    alt: 'MindMirror 2K26 — Attendees listening attentively during the session — Silicon Quiz Club',
    layout: 'portrait',
    section: 'interaction'
  },
  {
    id: 'mm-interact-5',
    src: '/assets/images/1/WhatsApp Image 2026-09-25 at 5.31.53 AM (1).jpeg',
    alt: 'MindMirror 2K26 — Audience interaction during the orientation programme — Silicon Quiz Club',
    layout: 'portrait',
    section: 'interaction'
  },

  // ── CERTIFICATES: Closing moments ──
  {
    id: 'mm-cert-1',
    src: '/assets/images/1/WhatsApp Image 2026-09-25 at 5.31.54 AM.jpeg',
    alt: 'MindMirror 2K26 — Certificate of participation being presented — Silicon Quiz Club',
    layout: 'wide',
    section: 'certificates'
  },
  {
    id: 'mm-cert-2',
    src: '/assets/images/1/WhatsApp Image 2026-09-25 at 5.31.55 AM.jpeg',
    alt: 'MindMirror 2K26 — Participation certificate presentation ceremony — Silicon Quiz Club',
    layout: 'wide',
    section: 'certificates'
  },
];

interface MindMirrorShowcaseProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MindMirrorShowcase: React.FC<MindMirrorShowcaseProps> = ({ isOpen, onClose }) => {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [revealedImages, setRevealedImages] = useState<Set<string>>(new Set());
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const showcaseRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for staggered reveal
  useEffect(() => {
    if (!isOpen) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const imgId = entry.target.getAttribute('data-img-id');
            if (imgId) {
              setRevealedImages((prev) => new Set(prev).add(imgId));
            }
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    const timer = setTimeout(() => {
      const elements = document.querySelectorAll('.mm-gallery-item');
      elements.forEach((el) => observer.observe(el));
    }, 100);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [isOpen]);

  // Lock body scroll when showcase is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (lightboxIdx !== null) {
        if (e.key === 'Escape') { setLightboxIdx(null); return; }
        if (e.key === 'ArrowRight') { setLightboxIdx((lightboxIdx + 1) % MINDMIRROR_IMAGES.length); return; }
        if (e.key === 'ArrowLeft') { setLightboxIdx((lightboxIdx - 1 + MINDMIRROR_IMAGES.length) % MINDMIRROR_IMAGES.length); return; }
      } else {
        if (e.key === 'Escape') onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, lightboxIdx, onClose]);

  const openLightbox = useCallback((idx: number) => {
    sound.playClick();
    setLightboxIdx(idx);
  }, []);

  const closeLightbox = useCallback(() => {
    sound.playClick();
    setLightboxIdx(null);
  }, []);

  // Touch swipe for lightbox
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null || lightboxIdx === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    const deltaY = e.changedTouches[0].clientY - touchStartYRef.current;

    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 45) {
      if (deltaX < 0) {
        setLightboxIdx((lightboxIdx + 1) % MINDMIRROR_IMAGES.length);
      } else {
        setLightboxIdx((lightboxIdx - 1 + MINDMIRROR_IMAGES.length) % MINDMIRROR_IMAGES.length);
      }
    } else if (deltaY > 80 && Math.abs(deltaX) < 60) {
      closeLightbox();
    }
    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  if (!isOpen) return null;

  // Separate images by section for editorial layout
  const heroImage = MINDMIRROR_IMAGES[0]; // Banner
  const inaugImages = MINDMIRROR_IMAGES.filter(i => i.section === 'inauguration' && i.layout !== 'hero');
  const inaugDais = inaugImages.find(i => i.id === 'mm-inaug-dais');
  const inaugLamps = inaugImages.filter(i => i.id !== 'mm-inaug-dais');
  const facultyImages = MINDMIRROR_IMAGES.filter(i => i.section === 'faculty');
  const stageImages = MINDMIRROR_IMAGES.filter(i => i.section === 'stage');
  const audienceImages = MINDMIRROR_IMAGES.filter(i => i.section === 'audience');
  const interactionImages = MINDMIRROR_IMAGES.filter(i => i.section === 'interaction');
  const certificateImages = MINDMIRROR_IMAGES.filter(i => i.section === 'certificates');

  const getGlobalIndex = (img: MindMirrorImage) => MINDMIRROR_IMAGES.findIndex(i => i.id === img.id);

  const renderImage = (img: MindMirrorImage, className: string = '') => {
    const globalIdx = getGlobalIndex(img);
    const isRevealed = revealedImages.has(img.id);

    return (
      <div
        key={img.id}
        data-img-id={img.id}
        className={`mm-gallery-item ${className}`}
        onClick={() => openLightbox(globalIdx)}
        onMouseEnter={() => sound.playHover()}
        style={{
          opacity: isRevealed ? 1 : 0,
          transform: isRevealed ? 'translateY(0)' : 'translateY(32px)',
          transition: 'opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1), transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '12px',
          border: '1px solid var(--border-subtle)',
        }}
      >
        <img
          src={img.src}
          alt={img.alt}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
            display: 'block',
          }}
          className="mm-zoomable-img"
        />
        {/* Subtle hover overlay */}
        <div className="mm-img-overlay" />
      </div>
    );
  };

  return (
    <div
      className="mm-showcase-root"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 8000,
        backgroundColor: 'var(--bg-primary)',
        overflowY: 'auto',
        overflowX: 'hidden',
        WebkitOverflowScrolling: 'touch',
      }}
      ref={showcaseRef}
    >
      {/* ═══ STICKY BACK BUTTON ═══ */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          padding: '16px 24px',
          background: 'var(--bg-primary)',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <button
          onClick={() => { sound.playClick(); onClose(); }}
          aria-label="Back to Events"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--btn-secondary-bg)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-primary)',
            padding: '10px 18px',
            borderRadius: '10px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.76rem',
            fontWeight: 600,
            cursor: 'pointer',
            letterSpacing: '0.06em',
            transition: 'all 0.2s ease',
          }}
          className="mm-back-btn"
        >
          <ArrowLeft size={16} />
          BACK TO EVENTS
        </button>
      </div>

      {/* ═══ CINEMATIC HERO ═══ */}
      <div
        className="mm-hero-section"
        style={{
          position: 'relative',
          width: '100%',
          maxHeight: '70vh',
          minHeight: '360px',
          overflow: 'hidden',
          cursor: 'pointer',
        }}
        onClick={() => openLightbox(0)}
      >
        <img
          src={heroImage.src}
          alt={heroImage.alt}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 40%',
            minHeight: '360px',
            animation: 'mmHeroReveal 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards',
          }}
          fetchPriority="high"
        />
        {/* Cinematic gradient overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, var(--bg-primary) 0%, rgba(7, 9, 14, 0.6) 30%, rgba(7, 9, 14, 0.15) 60%, transparent 100%)',
          }}
        />
        {/* Hero Typography */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: 'clamp(32px, 6vw, 80px) clamp(20px, 5vw, 80px)',
            animation: 'mmTitleReveal 1s cubic-bezier(0.22, 1, 0.36, 1) 0.3s both',
          }}
        >
          <div
            className="font-mono"
            style={{
              fontSize: '0.7rem',
              color: 'var(--accent-cyan)',
              letterSpacing: '0.2em',
              marginBottom: '12px',
              textTransform: 'uppercase',
              fontWeight: 700,
            }}
          >
            SILICON QUIZ CLUB · EVENT SHOWCASE
          </div>
          <h1
            className="font-display"
            style={{
              fontSize: 'clamp(2.2rem, 6vw, 4.5rem)',
              fontWeight: 800,
              color: '#ffffff',
              letterSpacing: '-0.03em',
              lineHeight: 1.05,
              marginBottom: '12px',
            }}
          >
            MINDMIRROR <span style={{ color: 'var(--accent-cyan)' }}>2K26</span>
          </h1>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              flexWrap: 'wrap',
            }}
          >
            <span
              className="font-mono"
              style={{
                fontSize: '0.82rem',
                color: 'rgba(255, 255, 255, 0.85)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: 600,
              }}
            >
              <Calendar size={14} color="var(--accent-cyan)" />
              10 SEPTEMBER 2026
            </span>
            <span style={{ color: 'rgba(255, 255, 255, 0.3)' }}>·</span>
            <span
              className="font-mono"
              style={{
                fontSize: '0.82rem',
                color: 'rgba(255, 255, 255, 0.85)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: 600,
              }}
            >
              <MapPin size={14} color="var(--accent-cyan)" />
              Seminar Hall, Silicon Institute of Technology
            </span>
          </div>
        </div>
      </div>

      {/* ═══ EDITORIAL CONTENT ═══ */}
      <div
        className="mm-editorial-content"
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: 'clamp(40px, 6vw, 80px) clamp(16px, 4vw, 48px)',
        }}
      >
        {/* Visual Recap Intro */}
        <div
          style={{
            marginBottom: 'clamp(40px, 5vw, 64px)',
            maxWidth: '680px',
            animation: 'mmTitleReveal 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.5s both',
          }}
        >
          <div
            className="font-mono"
            style={{
              fontSize: '0.68rem',
              color: 'var(--accent-cyan)',
              letterSpacing: '0.18em',
              marginBottom: '12px',
              textTransform: 'uppercase',
            }}
          >
            A VISUAL RECAP
          </div>
          <p
            style={{
              fontSize: 'clamp(0.92rem, 1.4vw, 1.05rem)',
              lineHeight: 1.7,
              color: 'var(--text-secondary)',
            }}
          >
            MindMirror 2K26 marked a milestone moment for Silicon Quiz Club — an afternoon of formal inauguration, faculty addresses, student presentations, and collaborative engagement at the Seminar Hall of Silicon Institute of Technology, Sambalpur.
          </p>
        </div>

        {/* ═══ SECTION 1: INAUGURATION ═══ */}
        <div className="mm-section" style={{ marginBottom: 'clamp(48px, 6vw, 80px)' }}>
          <div
            className="font-mono mm-section-label"
            style={{
              fontSize: '0.65rem',
              color: 'var(--text-muted)',
              letterSpacing: '0.16em',
              marginBottom: '20px',
              textTransform: 'uppercase',
              paddingBottom: '10px',
              borderBottom: '1px solid var(--border-subtle)',
            }}
          >
            01 · INAUGURATION & CEREMONIAL COMMENCEMENT
          </div>
          {inaugDais && (
            <div style={{ marginBottom: '16px' }}>
              {renderImage(inaugDais, 'mm-grid-wide')}
            </div>
          )}
          <div className="mm-grid-lamp">
            {inaugLamps.map((img) => renderImage(img))}
          </div>
        </div>

        {/* ═══ SECTION 2: FACULTY ADDRESSES ═══ */}
        <div className="mm-section" style={{ marginBottom: 'clamp(48px, 6vw, 80px)' }}>
          <div
            className="font-mono mm-section-label"
            style={{
              fontSize: '0.65rem',
              color: 'var(--text-muted)',
              letterSpacing: '0.16em',
              marginBottom: '20px',
              textTransform: 'uppercase',
              paddingBottom: '10px',
              borderBottom: '1px solid var(--border-subtle)',
            }}
          >
            02 · FACULTY ADDRESSES
          </div>
          <div className="mm-grid-faculty">
            {facultyImages.map(img => renderImage(img))}
          </div>
        </div>

        {/* ═══ SECTION 3: STAGE & PRESENTATIONS ═══ */}
        <div className="mm-section" style={{ marginBottom: 'clamp(48px, 6vw, 80px)' }}>
          <div
            className="font-mono mm-section-label"
            style={{
              fontSize: '0.65rem',
              color: 'var(--text-muted)',
              letterSpacing: '0.16em',
              marginBottom: '20px',
              textTransform: 'uppercase',
              paddingBottom: '10px',
              borderBottom: '1px solid var(--border-subtle)',
            }}
          >
            03 · STAGE PRESENTATIONS
          </div>
          <div className="mm-grid-stage">
            {stageImages.map((img, idx) => renderImage(img, idx === 0 || idx === 3 ? 'mm-grid-wide' : ''))}
          </div>
        </div>

        {/* ═══ SECTION 4: AUDIENCE & ATMOSPHERE ═══ */}
        <div className="mm-section" style={{ marginBottom: 'clamp(48px, 6vw, 80px)' }}>
          <div
            className="font-mono mm-section-label"
            style={{
              fontSize: '0.65rem',
              color: 'var(--text-muted)',
              letterSpacing: '0.16em',
              marginBottom: '20px',
              textTransform: 'uppercase',
              paddingBottom: '10px',
              borderBottom: '1px solid var(--border-subtle)',
            }}
          >
            04 · THE AUDIENCE
          </div>
          <div className="mm-grid-audience">
            {audienceImages.map(img => renderImage(img, 'mm-grid-wide'))}
          </div>
        </div>

        {/* ═══ SECTION 5: INTERACTION MOMENTS ═══ */}
        <div className="mm-section" style={{ marginBottom: 'clamp(48px, 6vw, 80px)' }}>
          <div
            className="font-mono mm-section-label"
            style={{
              fontSize: '0.65rem',
              color: 'var(--text-muted)',
              letterSpacing: '0.16em',
              marginBottom: '20px',
              textTransform: 'uppercase',
              paddingBottom: '10px',
              borderBottom: '1px solid var(--border-subtle)',
            }}
          >
            05 · ENGAGEMENT & INTERACTION
          </div>
          <div className="mm-grid-interaction">
            {interactionImages.map(img => renderImage(img))}
          </div>
        </div>

        {/* ═══ SECTION 6: CERTIFICATE DISTRIBUTION ═══ */}
        <div className="mm-section" style={{ marginBottom: 'clamp(32px, 4vw, 48px)' }}>
          <div
            className="font-mono mm-section-label"
            style={{
              fontSize: '0.65rem',
              color: 'var(--text-muted)',
              letterSpacing: '0.16em',
              marginBottom: '20px',
              textTransform: 'uppercase',
              paddingBottom: '10px',
              borderBottom: '1px solid var(--border-subtle)',
            }}
          >
            06 · CLOSING CEREMONY
          </div>
          <div className="mm-grid-certs">
            {certificateImages.map(img => renderImage(img, 'mm-grid-wide'))}
          </div>
        </div>

        {/* ═══ CLOSING MARK ═══ */}
        <div
          style={{
            textAlign: 'center',
            padding: '48px 0 24px',
            borderTop: '1px solid var(--border-subtle)',
          }}
        >
          <div
            className="font-mono"
            style={{
              fontSize: '0.68rem',
              color: 'var(--text-muted)',
              letterSpacing: '0.14em',
              marginBottom: '8px',
            }}
          >
            SILICON QUIZ CLUB
          </div>
          <div
            className="font-display"
            style={{
              fontSize: '1.4rem',
              fontWeight: 800,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
            }}
          >
            MINDMIRROR <span style={{ color: 'var(--accent-cyan)' }}>2K26</span>
          </div>
          <div
            className="font-mono"
            style={{
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
              marginTop: '6px',
            }}
          >
            10 SEPTEMBER 2026
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          FULLSCREEN LIGHTBOX
      ═══════════════════════════════════════════════════════════════ */}
      {lightboxIdx !== null && (
        <div
          className="mm-lightbox"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10000,
            backgroundColor: 'rgba(7, 9, 14, 0.97)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            animation: 'mmLightboxIn 0.3s ease',
          }}
          onClick={closeLightbox}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Close */}
          <button
            onClick={closeLightbox}
            aria-label="Close fullscreen view"
            className="mm-lightbox-btn"
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              zIndex: 10,
            }}
          >
            <X size={20} />
          </button>

          {/* Prev */}
          <button
            onClick={(e) => { e.stopPropagation(); sound.playClick(); setLightboxIdx((lightboxIdx - 1 + MINDMIRROR_IMAGES.length) % MINDMIRROR_IMAGES.length); }}
            aria-label="Previous photo"
            className="mm-lightbox-btn mm-lightbox-nav-btn"
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
            }}
          >
            <ChevronLeft size={22} />
          </button>

          {/* Next */}
          <button
            onClick={(e) => { e.stopPropagation(); sound.playClick(); setLightboxIdx((lightboxIdx + 1) % MINDMIRROR_IMAGES.length); }}
            aria-label="Next photo"
            className="mm-lightbox-btn mm-lightbox-nav-btn"
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
            }}
          >
            <ChevronRight size={22} />
          </button>

          {/* Image & Caption */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '92vw',
              maxHeight: '88vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <img
              src={MINDMIRROR_IMAGES[lightboxIdx].src}
              alt={MINDMIRROR_IMAGES[lightboxIdx].alt}
              style={{
                maxWidth: '100%',
                maxHeight: '74vh',
                objectFit: 'contain',
                borderRadius: '8px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
              }}
            />
            {/* Caption */}
            <div
              style={{
                marginTop: '14px',
                fontSize: '0.82rem',
                color: 'rgba(255, 255, 255, 0.8)',
                textAlign: 'center',
                maxWidth: '680px',
                lineHeight: 1.45,
              }}
            >
              {MINDMIRROR_IMAGES[lightboxIdx].alt.replace(' — Silicon Quiz Club', '')}
            </div>
            {/* Counter */}
            <div
              className="font-mono"
              style={{
                marginTop: '6px',
                fontSize: '0.72rem',
                color: 'var(--accent-cyan)',
                letterSpacing: '0.12em',
                fontWeight: 600,
              }}
            >
              {lightboxIdx + 1} / {MINDMIRROR_IMAGES.length}
            </div>
          </div>
        </div>
      )}

      {/* ═══ COMPONENT STYLES ═══ */}
      <style>{`
        /* ── Animations ── */
        @keyframes mmHeroReveal {
          from { opacity: 0; transform: scale(1.06); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes mmTitleReveal {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes mmLightboxIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* ── Image hover zoom ── */
        .mm-gallery-item:hover .mm-zoomable-img {
          transform: scale(1.03);
        }
        .mm-img-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(7, 9, 14, 0.25) 0%, transparent 40%);
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }
        .mm-gallery-item:hover .mm-img-overlay {
          opacity: 1;
        }

        /* ── Back button hover ── */
        .mm-back-btn:hover {
          background: var(--accent-cyan) !important;
          color: #07090e !important;
          border-color: var(--accent-cyan) !important;
        }

        /* ── Lightbox buttons ── */
        .mm-lightbox-btn {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #fff;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .mm-lightbox-btn:hover {
          background: rgba(255, 255, 255, 0.2);
        }
        .mm-lightbox-btn:focus-visible {
          outline: 2px solid var(--accent-cyan);
          outline-offset: 2px;
        }

        /* ── GRID LAYOUTS ── */

        /* Inauguration: Dais wide + Lamp 3-portrait grid */
        .mm-grid-lamp {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }
        .mm-grid-lamp .mm-gallery-item { min-height: 280px; }

        /* Faculty: 3 portrait columns */
        .mm-grid-faculty {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }
        .mm-grid-faculty .mm-gallery-item { min-height: 280px; }

        /* Stage: mixed — wide + 2 portrait + wide */
        .mm-grid-stage {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }
        .mm-grid-stage .mm-gallery-item { min-height: 240px; }

        /* Audience: 2 wide stacked */
        .mm-grid-audience {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }
        .mm-grid-audience .mm-gallery-item { min-height: 240px; }

        /* Interaction: 5 items in dynamic grid */
        .mm-grid-interaction {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }
        .mm-grid-interaction .mm-gallery-item { min-height: 280px; }

        /* Certificates: 2 wide */
        .mm-grid-certs {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }
        .mm-grid-certs .mm-gallery-item { min-height: 240px; }

        /* ── Tablet (600px+) ── */
        @media (min-width: 600px) {
          .mm-grid-lamp {
            grid-template-columns: repeat(3, 1fr);
          }

          .mm-grid-faculty {
            grid-template-columns: repeat(3, 1fr);
          }

          .mm-grid-stage {
            grid-template-columns: repeat(2, 1fr);
          }
          .mm-grid-stage .mm-grid-wide {
            grid-column: span 2;
            min-height: 320px;
          }

          .mm-grid-audience {
            grid-template-columns: repeat(2, 1fr);
          }

          .mm-grid-interaction {
            grid-template-columns: repeat(6, 1fr);
          }
          .mm-grid-interaction .mm-gallery-item:nth-child(1),
          .mm-grid-interaction .mm-gallery-item:nth-child(2) {
            grid-column: span 3;
            min-height: 320px;
          }
          .mm-grid-interaction .mm-gallery-item:nth-child(3),
          .mm-grid-interaction .mm-gallery-item:nth-child(4),
          .mm-grid-interaction .mm-gallery-item:nth-child(5) {
            grid-column: span 2;
            min-height: 300px;
          }

          .mm-grid-certs {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        /* ── Desktop (1024px+) ── */
        @media (min-width: 1024px) {
          .mm-grid-lamp .mm-gallery-item { min-height: 400px; }

          .mm-grid-faculty .mm-gallery-item { min-height: 400px; }

          .mm-grid-stage .mm-gallery-item { min-height: 320px; }
          .mm-grid-stage .mm-grid-wide { min-height: 400px; }

          .mm-grid-audience .mm-gallery-item { min-height: 380px; }

          .mm-grid-interaction .mm-gallery-item:nth-child(1),
          .mm-grid-interaction .mm-gallery-item:nth-child(2) {
            min-height: 380px;
          }
          .mm-grid-interaction .mm-gallery-item:nth-child(3),
          .mm-grid-interaction .mm-gallery-item:nth-child(4),
          .mm-grid-interaction .mm-gallery-item:nth-child(5) {
            min-height: 360px;
          }

          .mm-grid-certs .mm-gallery-item { min-height: 360px; }
        }

        /* ── Mobile lightbox nav hidden ── */
        @media (max-width: 599px) {
          .mm-lightbox-nav-btn {
            display: none !important;
          }
        }

        /* ── Focus visible ── */
        .mm-gallery-item:focus-visible {
          outline: 2px solid var(--accent-cyan);
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
};

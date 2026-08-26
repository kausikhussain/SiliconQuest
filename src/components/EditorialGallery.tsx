import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Maximize2, X, ChevronLeft, ChevronRight, MapPin, Calendar } from 'lucide-react';
import { GALLERY_PHOTOS } from '../data/clubData';
import { GalleryPhoto } from '../types';
import { sound } from '../utils/soundEngine';

export const EditorialGallery: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [lightboxPhoto, setLightboxPhoto] = useState<GalleryPhoto | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  const filteredPhotos = GALLERY_PHOTOS.filter(
    (p) => activeTab === 'all' || p.category === activeTab
  );

  const openLightbox = (photo: GalleryPhoto, index: number) => {
    sound.playClick();
    setLightboxPhoto(photo);
    setCurrentIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = useCallback(() => {
    sound.playClick();
    setLightboxPhoto(null);
    document.body.style.overflow = '';
  }, []);

  const showNext = useCallback(() => {
    sound.playClick();
    const nextIdx = (currentIndex + 1) % filteredPhotos.length;
    setCurrentIndex(nextIdx);
    setLightboxPhoto(filteredPhotos[nextIdx]);
  }, [currentIndex, filteredPhotos]);

  const showPrev = useCallback(() => {
    sound.playClick();
    const prevIdx = (currentIndex - 1 + filteredPhotos.length) % filteredPhotos.length;
    setCurrentIndex(prevIdx);
    setLightboxPhoto(filteredPhotos[prevIdx]);
  }, [currentIndex, filteredPhotos]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxPhoto) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showNext();
      if (e.key === 'ArrowLeft') showPrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxPhoto, closeLightbox, showNext, showPrev]);

  // Touch swipe handling in Lightbox
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    const deltaY = e.changedTouches[0].clientY - touchStartYRef.current;

    // Horizontal swipe threshold 45px
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 45) {
      if (deltaX < 0) {
        showNext();
      } else {
        showPrev();
      }
    } else if (deltaY > 80 && Math.abs(deltaX) < 60) {
      // Swipe down to close
      closeLightbox();
    }

    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  return (
    <section
      id="gallery"
      style={{
        padding: '80px 0',
        backgroundColor: 'var(--bg-primary)',
        position: 'relative',
        borderTop: '1px solid var(--border-subtle)'
      }}
      className="gallery-main-section"
    >
      <div className="section-container">
        {/* Header */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'end',
            justifyContent: 'space-between',
            gap: '20px',
            marginBottom: '32px'
          }}
          className="gallery-header-row"
        >
          <div>
            <div className="section-tagline">07 · VISUAL ARCHIVE</div>
            <h2 className="section-title">
              EDITORIAL <span style={{ color: 'var(--accent-cyan)' }}>GALLERY</span>
            </h2>
            <p className="section-subtitle">
              Authentic chronicles of high-intensity buzzer rounds, stage presentations, and podium laurels.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div
            style={{
              display: 'flex',
              gap: '6px',
              overflowX: 'auto',
              paddingBottom: '8px',
              maxWidth: '100%'
            }}
            className="gallery-filter-pills hide-scrollbar"
          >
            {[
              { id: 'all', label: 'All Chronicles' },
              { id: 'championship', label: 'Championships' },
              { id: 'live-stage', label: 'Live Stages' },
              { id: 'prelims', label: 'Prelims' },
              { id: 'audience', label: 'Audience' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  sound.playClick();
                  setActiveTab(tab.id);
                }}
                style={{
                  background: activeTab === tab.id ? 'var(--accent-cyan)' : 'var(--btn-secondary-bg)',
                  color: activeTab === tab.id ? '#07090e' : 'var(--text-secondary)',
                  border: `1px solid ${activeTab === tab.id ? 'var(--accent-cyan)' : 'var(--border-subtle)'}`,
                  padding: '8px 14px',
                  borderRadius: '999px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  transition: 'all 0.2s ease',
                  minHeight: '38px'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid (Responsive Masonry) */}
        <div
          style={{
            display: 'grid',
            gap: '16px'
          }}
          className="editorial-gallery-grid"
        >
          {filteredPhotos.map((photo, idx) => {
            const isSpan2 = idx % 5 === 0 || idx % 7 === 0;

            return (
              <div
                key={photo.id}
                onClick={() => openLightbox(photo, idx)}
                className={`glass-panel gallery-card ${isSpan2 ? 'gallery-card-span-2' : ''}`}
                style={{
                  borderRadius: '18px',
                  overflow: 'hidden',
                  position: 'relative',
                  cursor: 'pointer',
                  minHeight: '220px'
                }}
                onMouseEnter={() => sound.playHover()}
              >
                <img
                  src={photo.src}
                  alt={photo.title}
                  className="img-hover-shine"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                  loading="lazy"
                />

                {/* Scrim Overlay */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(7, 9, 14, 0.92) 0%, transparent 60%)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    padding: '18px 20px',
                    opacity: 0.95,
                    transition: 'opacity 0.3s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span
                      className="font-mono"
                      style={{
                        fontSize: '0.65rem',
                        color: 'var(--accent-cyan)',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase'
                      }}
                    >
                      {photo.date}
                    </span>
                    <Maximize2 size={15} color="#ffffff" />
                  </div>

                  <h4
                    className="font-display"
                    style={{
                      fontSize: '1rem',
                      fontWeight: 700,
                      color: '#ffffff',
                      lineHeight: 1.3
                    }}
                  >
                    {photo.caption}
                  </h4>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Fullscreen Modal Lightbox with Safe Areas & Swipe Gestures */}
      {lightboxPhoto && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(7, 9, 14, 0.96)',
            backdropFilter: 'blur(28px)',
            WebkitBackdropFilter: 'blur(28px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'calc(16px + var(--sat)) calc(16px + var(--sar)) calc(16px + var(--sab)) calc(16px + var(--sal))',
            animation: 'fadeIn 0.25s ease'
          }}
          onClick={closeLightbox}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            aria-label="Close Lightbox"
            style={{
              position: 'absolute',
              top: 'calc(16px + var(--sat))',
              right: 'calc(16px + var(--sar))',
              background: 'rgba(255, 255, 255, 0.12)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#ffffff',
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 10,
              transition: 'all 0.2s ease'
            }}
          >
            <X size={20} />
          </button>

          {/* Prev Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              showPrev();
            }}
            aria-label="Previous Photo"
            style={{
              position: 'absolute',
              left: 'calc(12px + var(--sal))',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(255, 255, 255, 0.12)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#ffffff',
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 10,
              transition: 'all 0.2s ease'
            }}
            className="lightbox-nav-btn"
          >
            <ChevronLeft size={22} />
          </button>

          {/* Next Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              showNext();
            }}
            aria-label="Next Photo"
            style={{
              position: 'absolute',
              right: 'calc(12px + var(--sar))',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(255, 255, 255, 0.12)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#ffffff',
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 10,
              transition: 'all 0.2s ease'
            }}
            className="lightbox-nav-btn"
          >
            <ChevronRight size={22} />
          </button>

          {/* Central Modal Content */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '1000px',
              width: '100%',
              maxHeight: '88dvh',
              display: 'flex',
              flexDirection: 'column',
              borderRadius: '20px',
              overflow: 'hidden',
              background: 'rgba(15, 20, 30, 0.95)',
              border: '1px solid rgba(0, 242, 254, 0.3)',
              boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.95)'
            }}
          >
            {/* Image Box */}
            <div
              style={{
                flex: 1,
                maxHeight: '60dvh',
                overflow: 'hidden',
                backgroundColor: '#000000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <img
                src={lightboxPhoto.src}
                alt={lightboxPhoto.title}
                style={{
                  maxWidth: '100%',
                  maxHeight: '60dvh',
                  objectFit: 'contain'
                }}
              />
            </div>

            {/* Metadata Footer */}
            <div style={{ padding: '20px 24px', backgroundColor: 'rgba(15, 20, 30, 0.95)' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  color: 'var(--accent-cyan)',
                  marginBottom: '6px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Calendar size={12} />
                  <span>{lightboxPhoto.date}</span>
                </div>
                <span>·</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <MapPin size={12} />
                  <span>{lightboxPhoto.location}</span>
                </div>
              </div>

              <h3
                className="font-display"
                style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', marginBottom: '6px' }}
              >
                {lightboxPhoto.title}
              </h3>

              {lightboxPhoto.caption && (
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5 }}>
                  {lightboxPhoto.caption}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .editorial-gallery-grid {
          grid-template-columns: 1fr;
        }
        @media (min-width: 600px) {
          .editorial-gallery-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 18px;
          }
        }
        @media (min-width: 1024px) {
          .gallery-main-section {
            padding: 120px 0;
          }
          .gallery-header-row {
            margin-bottom: 48px;
          }
          .editorial-gallery-grid {
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            grid-auto-rows: 260px;
            gap: 20px;
          }
          .gallery-card-span-2 {
            grid-column: span 2;
            grid-row: span 2;
          }
        }
      `}</style>
    </section>
  );
};

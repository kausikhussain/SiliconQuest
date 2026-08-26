import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Volume2, VolumeX, ChevronDown, Sparkles, ArrowDown } from 'lucide-react';
import { sound } from '../utils/soundEngine';

interface ScrollScrubIntroProps {
  onIntroCompleted?: () => void;
  onSkip?: () => void;
}

const TOTAL_FRAMES = 240;
const VIDEO_DURATION_SECS = 10.0;

export const ScrollScrubIntro: React.FC<ScrollScrubIntroProps> = ({ onIntroCompleted, onSkip }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Direct DOM Refs for 0-rerender HUD updates
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressTextRef = useRef<HTMLSpanElement>(null);
  const timeTextRef = useRef<HTMLSpanElement>(null);
  const statusPillRef = useRef<HTMLDivElement>(null);

  const [isAudioActive, setIsAudioActive] = useState(sound.getIsAudioActive());

  // Frame Cache: Array of preloaded HTMLImageElements
  const framesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));
  const framesLoadedMapRef = useRef<boolean[]>(new Array(TOTAL_FRAMES).fill(false));
  const lastRenderedFrameRef = useRef<number>(-1);

  // Scrubbing & seeking state refs
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);
  const hasCompletedRef = useRef(false);

  // Cached layout metrics to prevent layout thrashing
  const scrollDistanceRef = useRef(0);
  const containerOffsetTopRef = useRef(0);

  // Helper to format frame time
  const formatTime = useCallback((secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    const ms = Math.floor((secs % 1) * 10);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${ms}`;
  }, []);

  // Responsive focal-point cover drawer (sharp, centered, intentional framing)
  const drawCover = useCallback((
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    cWidth: number,
    cHeight: number
  ) => {
    const naturalWidth = img.naturalWidth || 1280;
    const naturalHeight = img.naturalHeight || 720;
    const imgRatio = naturalWidth / naturalHeight;
    const canvasRatio = cWidth / cHeight;
    let drawWidth = cWidth;
    let drawHeight = cHeight;
    let offsetX = 0;
    let offsetY = 0;

    if (canvasRatio > imgRatio) {
      drawHeight = cWidth / imgRatio;
      offsetY = (cHeight - drawHeight) / 2;
    } else {
      drawWidth = cHeight * imgRatio;
      // Center crop for portrait mobile ensures the focal subject (center) is visible
      offsetX = (cWidth - drawWidth) / 2;
    }

    ctx.clearRect(0, 0, cWidth, cHeight);
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  }, []);

  // 1. Progressive Frame Preloader
  useEffect(() => {
    let isCancelled = false;

    const getFrameUrl = (index: number) => {
      const frameNum = String(index + 1).padStart(4, '0');
      return `/assets/video/frames/frame_${frameNum}.webp`;
    };

    const loadSingleFrame = (index: number): Promise<HTMLImageElement> => {
      return new Promise((resolve) => {
        if (framesRef.current[index] && framesLoadedMapRef.current[index]) {
          resolve(framesRef.current[index]!);
          return;
        }

        const img = new Image();
        img.src = getFrameUrl(index);
        img.onload = () => {
          if (!isCancelled) {
            framesRef.current[index] = img;
            framesLoadedMapRef.current[index] = true;
            // If this is the initial frame and canvas is empty, render immediately
            if (index === 0 && lastRenderedFrameRef.current === -1 && canvasRef.current) {
              const canvas = canvasRef.current;
              const ctx = canvas.getContext('2d');
              if (ctx) {
                drawCover(ctx, img, canvas.width, canvas.height);
                lastRenderedFrameRef.current = 0;
              }
            }
          }
          resolve(img);
        };
        img.onerror = () => {
          resolve(img);
        };
      });
    };

    // Immediate Phase 1: Load first frame (0) and key checkpoints (every 12th frame) for instant responsiveness
    loadSingleFrame(0).then(() => {
      if (isCancelled) return;

      const checkpointIndices: number[] = [];
      for (let i = 0; i < TOTAL_FRAMES; i += 12) {
        if (i !== 0) checkpointIndices.push(i);
      }

      Promise.all(checkpointIndices.map(loadSingleFrame)).then(() => {
        if (isCancelled) return;

        // Phase 2: Batch preload all remaining frames in chunks
        const remainingIndices: number[] = [];
        for (let i = 0; i < TOTAL_FRAMES; i++) {
          if (!framesLoadedMapRef.current[i]) {
            remainingIndices.push(i);
          }
        }

        // Load in batches of 16 to avoid network saturation while maximizing throughput
        const batchSize = 16;
        let currentBatch = 0;

        const loadNextBatch = () => {
          if (isCancelled || currentBatch * batchSize >= remainingIndices.length) return;
          const batch = remainingIndices.slice(currentBatch * batchSize, (currentBatch + 1) * batchSize);
          currentBatch++;
          Promise.all(batch.map(loadSingleFrame)).then(() => {
            if (!isCancelled) {
              setTimeout(loadNextBatch, 8);
            }
          });
        };

        loadNextBatch();
      });
    });

    return () => {
      isCancelled = true;
    };
  }, [drawCover]);

  // 2. High-Precision Single RAF Scrub Engine
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });
    if (!ctx) return;

    // High-DPI Canvas Resizing
    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = window.innerWidth;
      const height = window.innerHeight;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        // Re-render current frame on resize
        const currentIdx = Math.max(lastRenderedFrameRef.current, 0);
        const frame = framesRef.current[currentIdx];
        if (frame && framesLoadedMapRef.current[currentIdx]) {
          drawCover(ctx, frame, canvas.width, canvas.height);
        }
      }
    };

    const updateMetrics = () => {
      const rect = container.getBoundingClientRect();
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      containerOffsetTopRef.current = rect.top + scrollTop;
      scrollDistanceRef.current = Math.max(container.clientHeight - window.innerHeight, 1);
    };

    resizeCanvas();
    updateMetrics();

    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const scrolled = scrollY - containerOffsetTopRef.current;
      const rawProgress = scrolled / scrollDistanceRef.current;
      targetProgressRef.current = Math.min(Math.max(rawProgress, 0), 1);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', () => {
      resizeCanvas();
      updateMetrics();
      handleScroll();
    }, { passive: true });

    handleScroll();

    // Single Authoritative RAF Animation Loop
    let lastRenderedTime = -1;
    let lastRenderedPercent = -1;

    const renderLoop = () => {
      rafIdRef.current = requestAnimationFrame(renderLoop);

      const target = targetProgressRef.current;
      const current = currentProgressRef.current;
      const diff = target - current;

      // Ultra-responsive, buttery-smooth lerp convergence
      if (Math.abs(diff) > 0.0001) {
        const absDiff = Math.abs(diff);
        const factor = Math.min(0.26 + absDiff * 0.45, 0.82);
        currentProgressRef.current += diff * factor;
      } else {
        currentProgressRef.current = target;
      }

      const prog = currentProgressRef.current;
      const targetFrameIdx = Math.min(
        Math.max(Math.round(prog * (TOTAL_FRAMES - 1)), 0),
        TOTAL_FRAMES - 1
      );

      // Frame Drawing: Find exact or nearest loaded frame
      if (targetFrameIdx !== lastRenderedFrameRef.current) {
        let frameToDraw = framesRef.current[targetFrameIdx];

        if (!frameToDraw || !framesLoadedMapRef.current[targetFrameIdx]) {
          let bestIdx = -1;

          for (let offset = 1; offset < 30; offset++) {
            const before = targetFrameIdx - offset;
            const after = targetFrameIdx + offset;

            if (before >= 0 && framesLoadedMapRef.current[before]) {
              bestIdx = before;
              break;
            }
            if (after < TOTAL_FRAMES && framesLoadedMapRef.current[after]) {
              bestIdx = after;
              break;
            }
          }

          if (bestIdx !== -1) {
            frameToDraw = framesRef.current[bestIdx];
          }
        }

        if (frameToDraw && frameToDraw.complete && frameToDraw.naturalWidth > 0) {
          drawCover(ctx, frameToDraw, canvas.width, canvas.height);
          lastRenderedFrameRef.current = targetFrameIdx;
        }
      }

      // Direct DOM UI Updates (Zero React re-renders for max FPS)
      const percent = Math.round(prog * 100);
      if (percent !== lastRenderedPercent) {
        lastRenderedPercent = percent;
        if (progressBarRef.current) {
          progressBarRef.current.style.width = `${percent}%`;
        }
        if (progressTextRef.current) {
          progressTextRef.current.textContent = `${percent}%`;
        }

        if (percent >= 98 && !hasCompletedRef.current) {
          hasCompletedRef.current = true;
          if (onIntroCompleted) onIntroCompleted();
          if (statusPillRef.current) {
            statusPillRef.current.innerHTML = `
              <span style="display:inline-flex;align-items:center;gap:6px;color:#10b981;font-weight:700;">
                PROLOGUE COMPLETE · SCROLL DOWN TO ENTER
              </span>
            `;
          }
        } else if (percent < 98 && hasCompletedRef.current) {
          hasCompletedRef.current = false;
          if (statusPillRef.current) {
            statusPillRef.current.innerHTML = `
              <span style="display:inline-flex;align-items:center;gap:6px;color:#ffffff;">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#00f2fe" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="animate-bounce"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>
                SWIPE UP / SCROLL TO SCRUB
              </span>
            `;
          }
        }
      }

      const currentTime = prog * VIDEO_DURATION_SECS;
      if (Math.abs(currentTime - lastRenderedTime) > 0.05) {
        lastRenderedTime = currentTime;
        if (timeTextRef.current) {
          timeTextRef.current.textContent = `TIMELINE: ${formatTime(currentTime)} / ${formatTime(VIDEO_DURATION_SECS)}`;
        }
      }
    };

    rafIdRef.current = requestAnimationFrame(renderLoop);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [drawCover, formatTime, onIntroCompleted]);

  const toggleSound = () => {
    const active = sound.toggleMute();
    setIsAudioActive(active);
  };

  const handleSkipClick = () => {
    sound.playClick();
    if (onSkip) {
      onSkip();
    } else {
      const mainEl = document.getElementById('main-content');
      if (mainEl) {
        mainEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div
      ref={containerRef}
      id="scroll-intro-track"
      style={{
        position: 'relative',
        width: '100%',
        height: '320vh', // Provides ample scroll distance for smooth scrubbing on desktop and mobile
        backgroundColor: '#060709',
        zIndex: 1100
      }}
    >
      {/* Pinned Fullscreen Sticky Viewport (Accounting for mobile safe areas and dvh) */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          minHeight: '100dvh',
          overflow: 'hidden',
          backgroundColor: '#060709',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {/* Hardware-Accelerated 2D Canvas (0ms Seek Latency, Zero Jitter) */}
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            display: 'block',
            filter: 'contrast(1.06) brightness(0.98)',
            pointerEvents: 'none',
            transform: 'translateZ(0)',
            willChange: 'transform'
          }}
        />

        {/* Cinematic Vignette Overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at center, rgba(6, 7, 9, 0.04) 0%, rgba(6, 7, 9, 0.6) 80%, #060709 100%)',
            pointerEvents: 'none'
          }}
        />

        {/* Top Minimalist HUD Bar with Safe Area Padding */}
        <div
          style={{
            position: 'absolute',
            top: 'calc(16px + var(--sat))',
            left: 'calc(16px + var(--sal))',
            right: 'calc(16px + var(--sar))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            zIndex: 20,
            pointerEvents: 'auto'
          }}
        >
          {/* Brand Tag */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              className="badge-tag"
              style={{
                background: 'rgba(6, 7, 9, 0.88)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                padding: '6px 12px',
                border: '1px solid rgba(0, 242, 254, 0.25)',
                fontSize: '0.68rem'
              }}
            >
              <Sparkles size={11} color="#00f2fe" />
              <span className="intro-badge-text">CINEMATIC PROLOGUE</span>
            </span>
          </div>

          {/* Right Action Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={toggleSound}
              style={{
                background: isAudioActive ? 'rgba(0, 242, 254, 0.14)' : 'rgba(255, 255, 255, 0.08)',
                border: isAudioActive ? '1px solid rgba(0, 242, 254, 0.4)' : '1px solid rgba(255, 255, 255, 0.12)',
                color: isAudioActive ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                padding: '7px 12px',
                borderRadius: '999px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                cursor: 'pointer',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                transition: 'all 0.2s ease',
                minHeight: '36px'
              }}
            >
              {isAudioActive ? <Volume2 size={14} /> : <VolumeX size={14} />}
              <span className="intro-audio-text">{isAudioActive ? 'AUDIO ON' : 'MUTED'}</span>
            </button>

            <button
              onClick={handleSkipClick}
              className="btn-secondary"
              style={{
                padding: '7px 14px',
                fontSize: '0.72rem',
                letterSpacing: '0.06em',
                borderRadius: '999px',
                cursor: 'pointer',
                minHeight: '36px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
              onMouseEnter={() => sound.playHover()}
            >
              <span>SKIP</span>
              <ChevronDown size={13} />
            </button>
          </div>
        </div>

        {/* Bottom Minimalist Telemetry & Scroll Prompt with Safe Area Padding */}
        <div
          style={{
            position: 'absolute',
            bottom: 'calc(20px + var(--sab))',
            left: 'calc(16px + var(--sal))',
            right: 'calc(16px + var(--sar))',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
            zIndex: 20,
            pointerEvents: 'none'
          }}
        >
          {/* Scroll Down / Swipe Up Instruction Pill */}
          <div
            ref={statusPillRef}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '7px 18px',
              borderRadius: '999px',
              background: 'rgba(6, 7, 9, 0.9)',
              border: '1px solid rgba(0, 242, 254, 0.3)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.8)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase'
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#ffffff' }}>
              <ArrowDown size={12} color="#00f2fe" className="animate-bounce" />
              SWIPE UP / SCROLL TO SCRUB
            </span>
          </div>

          {/* Progress Timeline Telemetry Strip */}
          <div
            style={{
              width: '100%',
              maxWidth: '480px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                color: 'var(--text-secondary)'
              }}
            >
              <span ref={timeTextRef}>TIMELINE: 00:00.0 / 00:10.0</span>
              <span ref={progressTextRef} style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>
                0%
              </span>
            </div>

            <div
              style={{
                width: '100%',
                height: '3px',
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                borderRadius: '999px',
                overflow: 'hidden',
                position: 'relative'
              }}
            >
              <div
                ref={progressBarRef}
                style={{
                  width: '0%',
                  height: '100%',
                  background: 'linear-gradient(90deg, #00f2fe, #38bdf8)',
                  boxShadow: '0 0 10px #00f2fe',
                  transform: 'translateZ(0)',
                  willChange: 'width'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 480px) {
          .intro-badge-text {
            font-size: 0.65rem;
          }
        }
        @media (min-width: 768px) {
          .intro-badge-text::after {
            content: ' · SCROLL SCRUBBED';
          }
        }
      `}</style>
    </div>
  );
};

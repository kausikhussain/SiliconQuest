import React, { useEffect, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(true); // Default true until verified as mouse device

  useEffect(() => {
    // Check if device supports fine hover pointer (desktop/mouse)
    const hasHoverPointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!hasHoverPointer || 'ontouchstart' in window || navigator.maxTouchPoints > 0) {
      setIsTouchDevice(true);
      return;
    }

    setIsTouchDevice(false);

    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });

      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'BUTTON' ||
          target.tagName === 'A' ||
          target.tagName === 'INPUT' ||
          target.tagName === 'SELECT' ||
          target.tagName === 'TEXTAREA' ||
          target.closest('button') ||
          target.closest('a') ||
          target.classList.contains('gallery-card') ||
          target.classList.contains('btn-primary') ||
          target.classList.contains('btn-secondary') ||
          target.classList.contains('btn-cyan'))
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (isTouchDevice) return null;

  return (
    <div className={isHovered ? 'custom-cursor-hover' : ''} aria-hidden="true">
      <div
        className="custom-cursor-dot"
        style={{
          transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`
        }}
      />
      <div
        className="custom-cursor-ring"
        style={{
          transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`
        }}
      />
    </div>
  );
};

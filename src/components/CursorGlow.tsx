import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

/**
 * A soft radial glow that follows the cursor across the whole page — a subtle,
 * premium touch popularised by brittanychiang.com. Fixed, pointer-events-none,
 * and skipped entirely for touch devices and reduced-motion users.
 */
export default function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;
    // Skip on touch-primary devices (no meaningful cursor).
    if (window.matchMedia('(hover: none)').matches) return;

    const el = ref.current;
    if (!el) return;

    let frame = 0;
    const onMove = (e: MouseEvent) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        el.style.setProperty('--cx', `${e.clientX}px`);
        el.style.setProperty('--cy', `${e.clientY}px`);
        frame = 0;
      });
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [reduceMotion]);

  if (reduceMotion) return null;
  return <div ref={ref} className="cursor-glow" aria-hidden="true" />;
}

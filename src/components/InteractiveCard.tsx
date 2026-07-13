import { useRef, type ReactNode, type CSSProperties } from 'react';
import { useReducedMotion } from 'framer-motion';

interface InteractiveCardProps {
  children: ReactNode;
  className?: string;
  /** Enable subtle 3D tilt that follows the cursor. */
  tilt?: boolean;
  /** Max tilt in degrees (only used when `tilt` is on). */
  maxTilt?: number;
  style?: CSSProperties;
}

/**
 * Card wrapper that adds two cursor-driven effects used across the site:
 *  - a radial "spotlight" glow that tracks the pointer (via --mx / --my CSS vars)
 *  - an optional parallax 3D tilt
 *
 * The card keeps whatever layout class it is given (skill-card, project-card…);
 * the spotlight is an absolutely-positioned overlay and the real children stay
 * direct descendants, so existing flex/grid internals are untouched. Effects are
 * pointer-only and are disabled for users who prefer reduced motion (index.css).
 */
export default function InteractiveCard({
  children,
  className = '',
  tilt = false,
  maxTilt = 6,
  style,
}: InteractiveCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty('--mx', `${x}px`);
    el.style.setProperty('--my', `${y}px`);

    if (tilt && !reduceMotion && e.pointerType !== 'touch') {
      const px = x / rect.width - 0.5;
      const py = y / rect.height - 0.5;
      el.style.setProperty('--rx', `${(-py * maxTilt).toFixed(2)}deg`);
      el.style.setProperty('--ry', `${(px * maxTilt).toFixed(2)}deg`);
    }
  };

  const handleLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  };

  return (
    <div
      ref={ref}
      className={`interactive-card ${tilt ? 'interactive-card--tilt' : ''} ${className}`}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      style={style}
    >
      <span className="interactive-card__spotlight" aria-hidden="true" />
      {children}
    </div>
  );
}

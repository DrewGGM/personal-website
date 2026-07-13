import { useRef, type ReactNode } from 'react';
import { useReducedMotion } from 'framer-motion';

interface MagneticButtonProps {
  children: ReactNode;
  /** Pull strength; higher = follows cursor more. */
  strength?: number;
  className?: string;
}

/**
 * Wraps an interactive element and gives it a "magnetic" pull toward the
 * cursor while hovered, easing back to center on leave. Pointer-only.
 */
export default function MagneticButton({
  children,
  strength = 0.35,
  className = '',
}: MagneticButtonProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduceMotion = useReducedMotion();

  const handleMove = (e: React.PointerEvent<HTMLSpanElement>) => {
    if (e.pointerType === 'touch' || reduceMotion) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
  };

  const reset = () => {
    if (ref.current) ref.current.style.transform = 'translate(0, 0)';
  };

  return (
    <span
      ref={ref}
      className={`magnetic ${className}`}
      onPointerMove={handleMove}
      onPointerLeave={reset}
    >
      {children}
    </span>
  );
}

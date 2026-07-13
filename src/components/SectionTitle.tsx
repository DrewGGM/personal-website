import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface SectionTitleProps {
  /** 1-based section index, shown as a monospace eyebrow (e.g. "01"). */
  index: number;
  children: React.ReactNode;
}

/**
 * Shared section heading: a small numbered eyebrow, the title with a gradient
 * accent word, and an underline that draws itself in when scrolled into view.
 */
export default function SectionTitle({ index, children }: SectionTitleProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const num = String(index).padStart(2, '0');

  return (
    <div className="section-heading" ref={ref}>
      <motion.span
        className="section-heading__eyebrow"
        initial={{ opacity: 0, x: -12 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        <span className="section-heading__num">{num}</span>
        <span className="section-heading__line" />
      </motion.span>
      <motion.h2
        className="section-title"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.55, delay: 0.05 }}
      >
        {children}
        <motion.span
          className="section-title__underline"
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
        />
      </motion.h2>
    </div>
  );
}

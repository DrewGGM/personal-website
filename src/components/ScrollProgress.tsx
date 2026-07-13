import { motion, useScroll, useSpring } from 'framer-motion';

/**
 * Thin gradient bar pinned to the top of the viewport that fills as the
 * page is scrolled. Uses a spring so the motion feels fluid, not linear.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return <motion.div className="scroll-progress" style={{ scaleX }} aria-hidden="true" />;
}

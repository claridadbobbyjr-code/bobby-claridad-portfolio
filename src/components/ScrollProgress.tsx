import { motion, useScroll, useSpring } from 'framer-motion';

/** Thin red bar along the top edge that fills with page scroll. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden="true"
      data-testid="scroll-progress"
      className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left"
      style={{
        scaleX,
        background: 'linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)))',
        boxShadow: '0 0 12px hsl(var(--primary) / 0.7)',
      }}
    />
  );
}

import type { Transition, Variants } from 'framer-motion';

/**
 * Motion tokens — values taken from the design reference's Framer Motion config.
 * Change them here to retune the whole site.
 */
export const EASE_OUT_EXPO = [0.22, 1, 0.36, 1] as const;

/** Default "fade up" used for section headers and blocks (reference: y 20, 0.6s, once). */
export const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 } as Transition,
};

/** Heading word-mask reveal (reference: y 115% -> 0, 0.55s, stagger 55ms). */
export const headingContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.055 } },
};
export const headingWord: Variants = {
  hidden: { y: '115%' },
  visible: { y: '0%', transition: { duration: 0.55, ease: EASE_OUT_EXPO } },
};

/** Card grid stagger (reference: children 70ms apart, y 28, 0.5s). */
export const gridContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
export const gridItem: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

/** Hero node pop-in (reference: scale .7, y 14, 0.55s expo; container stagger 90ms, delay 150ms). */
export const nodeContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
};
export const nodeItem: Variants = {
  hidden: { opacity: 0, scale: 0.7, y: 14 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.55, ease: EASE_OUT_EXPO } },
};

/** Spring used by the nav's active underline. */
export const navSpring: Transition = { type: 'spring', stiffness: 380, damping: 30 };

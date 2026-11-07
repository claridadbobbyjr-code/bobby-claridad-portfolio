import { motion, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion';
import { useRef } from 'react';
import { FeatureCard } from '../components/FeatureCard';
import { RevealHeading } from '../components/RevealHeading';
import { ScrambleText } from '../components/ScrambleText';
import { bookingLink, services as c } from '../content/site';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { fadeUp, gridContainer, gridItem } from '../lib/motion';

type Service = (typeof c.items)[number];

function Header() {
  return (
    <>
      <ScrambleText text={c.label} className="section-label" />
      <RevealHeading id="services-title" lead={c.title} accent={c.accent} className="section-title mb-4 mt-3" />
      <p className="section-sub">{c.sub}</p>
    </>
  );
}

function Footnote() {
  return (
    <p className="text-base text-muted-foreground">
      {c.footnote}{' '}
      <a {...bookingLink} className="font-medium text-primary underline-offset-4 hover:underline">
        Book a call
      </a>{' '}
      and let’s scope it together.
    </p>
  );
}

/** One card flying in from alternating sides as the pinned section scrolls (reference motion, six-card pacing). */
function FlyingCard({ item, index, progress }: { item: Service; index: number; progress: MotionValue<number> }) {
  const start = 0.05 + index * 0.12;
  const end = start + 0.18;
  // left column flies in from the left, right column from the right, middle alternates
  const col = index % 3;
  const fromLeft = col === 0 || (col === 1 && index < 3);
  const rawX = useTransform(progress, [start, end], [fromLeft ? -520 : 520, 0]);
  const x = useSpring(rawX, { stiffness: 90, damping: 22, mass: 0.6 });
  const opacity = useTransform(progress, [start, end - 0.04], [0, 1]);
  const rotate = useTransform(progress, [start, end], [fromLeft ? -5 : 5, 0]);
  const scale = useTransform(progress, [start, end], [0.9, 1]);
  return (
    <motion.li style={{ x, opacity, rotate, scale }} className="h-full">
      <FeatureCard {...item} />
    </motion.li>
  );
}

function PinnedServices() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const headOpacity = useTransform(scrollYProgress, [0, 0.06], [0.3, 1]);
  const headY = useTransform(scrollYProgress, [0, 0.06], [24, 0]);
  const line = useTransform(scrollYProgress, [0.05, 0.85], [0, 1]);
  const foot = useTransform(scrollYProgress, [0.84, 0.95], [0, 1]);

  return (
    <div ref={ref} className="relative h-[300vh]" data-testid="services-pinned">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden px-5 md:px-12">
        <div className="container-wide relative z-10">
          <motion.div style={{ opacity: headOpacity, y: headY }} className="mb-8 text-center xl:mb-10">
            <Header />
          </motion.div>
          <div className="relative">
            <div className="pointer-events-none absolute left-[3%] right-[3%] top-[48px] h-px" aria-hidden="true">
              <motion.div
                style={{ scaleX: line, background: 'linear-gradient(90deg, transparent, hsl(var(--primary)/0.5) 15%, hsl(var(--accent)/0.5) 85%, transparent)' }}
                className="absolute inset-0 origin-left"
              />
              <motion.div
                animate={{ left: ['0%', '100%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1.8 }}
                className="absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_12px_hsl(var(--primary)/0.9),0_0_28px_hsl(var(--primary)/0.5)]"
              />
            </div>
            <ul className="grid grid-cols-3 gap-4 xl:gap-5">
              {c.items.map((item, i) => (
                <FlyingCard key={item.title} item={item} index={i} progress={scrollYProgress} />
              ))}
            </ul>
          </div>
          <motion.div style={{ opacity: foot }} className="mt-8 text-center">
            <Footnote />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function StaticServices() {
  return (
    <div className="section-padding">
      <div className="container-wide relative z-10">
        <motion.div {...fadeUp} className="mb-12 text-center md:mb-16">
          <Header />
        </motion.div>
        <motion.ul
          variants={gridContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-3"
        >
          {c.items.map((item) => (
            <motion.li key={item.title} variants={gridItem}>
              <FeatureCard {...item} />
            </motion.li>
          ))}
        </motion.ul>
        <div className="mt-10 text-center md:mt-14">
          <Footnote />
        </div>
      </div>
    </div>
  );
}

/**
 * Core services. On desktop the section pins for 300vh while the six cards fly in from
 * alternating sides (the reference's signature scroll scene). Tablet, phone and
 * reduced-motion users get a plain staggered grid.
 */
export function Services() {
  // pin only where the 3×2 grid fits on screen
  const desktop = useMediaQuery('(min-width: 1024px) and (min-height: 740px)');
  const reduced = useReducedMotion();
  return (
    <section id="services" aria-labelledby="services-title" className="relative">
      {desktop && !reduced ? <PinnedServices /> : <StaticServices />}
    </section>
  );
}

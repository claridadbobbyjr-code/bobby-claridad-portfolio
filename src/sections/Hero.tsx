import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, CalendarDays } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Magnetic } from '../components/Magnetic';
import { bookingLink, hero } from '../content/site';
import { getIcon } from '../lib/icons';
import { scrollToId } from '../lib/scroll';
import { HeroGraph } from './HeroGraph';

export function Hero() {
  const reduced = useReducedMotion();
  const [atTop, setAtTop] = useState(true);

  useEffect(() => {
    const onScroll = () => setAtTop(window.scrollY < 50);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section id="home" aria-labelledby="hero-title" className="relative flex min-h-screen items-center overflow-hidden pb-20 pt-28 sm:pt-32">
      <motion.div
        className="container-wide relative z-10 px-5 sm:px-8"
        initial={reduced ? false : { opacity: 0, filter: 'blur(16px)' }}
        animate={{ opacity: 1, filter: 'blur(0px)' }}
        transition={{ duration: 1, ease: 'easeOut' }}
      >
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="order-2 text-center lg:order-1 lg:text-left"
          >
            <motion.p
              initial={reduced ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-xs font-medium text-primary"
            >
              <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
              </span>
              <span>
                <span className="hidden min-[360px]:inline">{hero.badgeLead}</span>
                {hero.badge}
              </span>
            </motion.p>

            <h1 id="hero-title" className="mb-5 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
              {hero.titleLead} <span className="text-gradient">{hero.titleAccent}</span>
            </h1>

            <p className="mx-auto mb-7 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg lg:mx-0">{hero.sub}</p>

            <div className="mb-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center lg:justify-start">
              <Magnetic strength={0.5}>
                <motion.a
                  {...bookingLink}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  className="btn-sheen glow-pulse inline-flex w-full items-center justify-center whitespace-nowrap rounded-xl px-7 py-3.5 text-sm font-bold tracking-wide text-primary-foreground ring-1 ring-primary/40 transition-[box-shadow] duration-300 hover:ring-primary/70 sm:w-auto md:text-base"
                  style={{ background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%)' }}
                >
                  <span className="flex items-center">
                    <CalendarDays className="mr-2 h-4 w-4" aria-hidden="true" />
                    {hero.primaryCta}
                  </span>
                </motion.a>
              </Magnetic>
              <Magnetic strength={0.4}>
                <motion.a
                  href="#projects"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToId('projects');
                  }}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="glass-card group inline-flex w-full items-center justify-center whitespace-nowrap rounded-xl border-border px-6 py-3.5 text-sm font-semibold text-foreground transition-colors hover:border-primary/50 sm:w-auto md:text-base"
                >
                  {hero.secondaryCta}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                </motion.a>
              </Magnetic>
            </div>

            <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 lg:justify-start">
              {hero.trust.map(({ icon, label }) => {
                const Icon = getIcon(icon);
                return (
                  <li key={label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Icon className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                    <span>{label}</span>
                  </li>
                );
              })}
            </ul>
          </motion.div>

          <motion.div
            initial={reduced ? false : { opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
            className="relative order-1 flex justify-center lg:order-2 lg:justify-end"
          >
            <HeroGraph />
          </motion.div>
        </div>
      </motion.div>

      <motion.button
        type="button"
        onClick={() => scrollToId('about')}
        initial={{ opacity: 0 }}
        animate={{ opacity: atTop ? 1 : 0 }}
        transition={{ duration: 0.4, delay: atTop ? 1.2 : 0 }}
        className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 rounded-lg p-1 text-muted-foreground transition-colors hover:text-foreground md:flex"
        style={{ pointerEvents: atTop ? 'auto' : 'none' }}
        tabIndex={atTop ? 0 : -1}
        aria-label="Scroll to about"
      >
        <span className="flex h-10 w-6 justify-center rounded-full border-2 border-foreground/70 pt-2" aria-hidden="true">
          <span className="h-2 w-1 rounded-full bg-primary" style={{ animation: 'scroll-dot 1.8s ease-in-out infinite' }} />
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em]">Scroll</span>
      </motion.button>
    </section>
  );
}

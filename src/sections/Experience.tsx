import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { Briefcase, Download, Lock } from 'lucide-react';
import { useId, useRef, useState, type KeyboardEvent } from 'react';
import { SectionHeader } from '../components/SectionHeader';
import { experience as c, profile } from '../content/site';
import { fadeUp } from '../lib/motion';

/**
 * Replaces the reference's "Live demo" section: same framed browser panel that scales
 * up as it scrolls into view, holding an interactive viewer for every role on the résumé.
 * Implements the WAI-ARIA tabs pattern (arrow keys, Home/End).
 */
export function Experience() {
  const reduced = useReducedMotion();
  const frameRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: frameRef, offset: ['start end', 'center 0.65'] });
  const eased = useSpring(scrollYProgress, { stiffness: 80, damping: 20 });
  const scale = useTransform(eased, [0, 1], reduced ? [1, 1] : [0.93, 1]);
  const opacity = useTransform(eased, [0, 1], reduced ? [1, 1] : [0.45, 1]);

  const [index, setIndex] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const uid = useId();
  const role = c.roles[index];

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const last = c.roles.length - 1;
    let next: number | null = null;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = index === last ? 0 : index + 1;
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = index === 0 ? last : index - 1;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = last;
    if (next === null) return;
    e.preventDefault();
    setIndex(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <section id="experience" aria-labelledby="experience-title" className="section-padding relative">
      <div className="container-tight relative z-10">
        <SectionHeader id="experience-title" label={c.label} title={c.title} accent={c.accent} sub={c.sub} />

        <motion.div
          ref={frameRef}
          style={{ scale, opacity }}
          className="glass-card relative mx-auto w-full max-w-5xl overflow-hidden rounded-2xl border border-border/70 shadow-[0_30px_80px_-20px_hsl(var(--drop)/0.8),0_0_60px_hsl(var(--primary)/0.12)]"
        >
          <div className="flex items-center gap-3 border-b border-border/60 bg-[hsl(var(--panel-2)/0.9)] px-4 py-3" aria-hidden="true">
            <div className="flex gap-1.5">
              <span className="h-3 w-3 rounded-full bg-[#F74918]" />
              <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
              <span className="h-3 w-3 rounded-full bg-[#28c840]" />
            </div>
            <div className="mx-auto flex min-w-0 max-w-sm flex-1 items-center gap-2 rounded-lg bg-background/50 px-3 py-1.5 font-mono text-[11px] text-muted-foreground">
              <Lock className="h-3 w-3 shrink-0" />
              <span className="truncate">bobby-claridad / experience</span>
              <span className="ml-auto flex shrink-0 items-center gap-1 text-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" /> {c.roles.length} roles
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-[minmax(0,15rem)_1fr]">
            <div
              role="tablist"
              aria-label="Roles"
              aria-orientation="vertical"
              className="flex gap-1 overflow-x-auto border-b border-border/60 p-2 md:flex-col md:gap-0.5 md:overflow-visible md:border-b-0 md:border-r"
            >
              {c.roles.map((r, i) => {
                const selected = i === index;
                return (
                  <button
                    key={r.company}
                    ref={(el) => {
                      tabRefs.current[i] = el;
                    }}
                    id={`${uid}-tab-${i}`}
                    role="tab"
                    type="button"
                    aria-selected={selected}
                    aria-controls={`${uid}-panel`}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => setIndex(i)}
                    onKeyDown={onKeyDown}
                    className={`relative shrink-0 rounded-lg px-3 py-2 text-left transition-colors md:w-full ${
                      selected ? 'text-foreground' : 'text-muted-foreground hover:bg-secondary/40 hover:text-foreground'
                    }`}
                  >
                    {selected && (
                      <motion.span
                        layoutId="exp-active"
                        className="absolute inset-0 rounded-lg border border-primary/40 bg-primary/10"
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      />
                    )}
                    <span className="relative block whitespace-nowrap text-sm font-semibold">{r.company}</span>
                    <span className="relative block whitespace-nowrap font-mono text-[10px] uppercase tracking-wider opacity-80">{r.period}</span>
                  </button>
                );
              })}
            </div>

            <div id={`${uid}-panel`} role="tabpanel" aria-labelledby={`${uid}-tab-${index}`} className="relative p-5 sm:p-8" tabIndex={0}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={role.company}
                  initial={reduced ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduced ? undefined : { opacity: 0, y: -8 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="font-display text-xl font-bold sm:text-2xl">{role.role}</h3>
                      <p className="mt-1 font-medium text-primary">
                        {role.company} <span className="text-muted-foreground">· {role.meta}</span>
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-secondary/50 px-3 py-1 font-mono text-xs text-foreground/80">
                      <Briefcase className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                      {role.period}
                    </span>
                  </div>
                  <ul className="space-y-3">
                    {role.points.map((p, i) => (
                      <motion.li
                        key={p}
                        initial={reduced ? false : { opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: reduced ? 0 : 0.05 + i * 0.05 }}
                        className="flex gap-2.5 text-sm leading-relaxed text-foreground/85 sm:text-[0.95rem]"
                      >
                        <span className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                        {p}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.2 }} className="mt-10 flex justify-center md:mt-14">
          <motion.a
            href={profile.resume}
            download
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground shadow-[0_0_30px_hsl(var(--primary)/0.35)] transition-colors hover:bg-primary/90 md:text-base"
          >
            <Download className="h-4 w-4 md:h-5 md:w-5" aria-hidden="true" />
            Download Full Résumé
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}

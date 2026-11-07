import { motion, useReducedMotion } from 'framer-motion';
import { SectionHeader } from '../components/SectionHeader';
import { process as c } from '../content/site';
import { getIcon } from '../lib/icons';

/** Five-step process with springy entrances and numbered badges (reference: "How it works"). */
export function Process() {
  const reduced = useReducedMotion();
  return (
    <section id="process" aria-labelledby="process-title" className="section-padding relative">
      <div className="container-wide relative z-10">
        <SectionHeader id="process-title" label={c.label} title={c.title} accent={c.accent} sub={c.sub} />
        <div className="relative">
          <div className="absolute left-0 right-0 top-[44px] hidden h-px overflow-hidden lg:block" aria-hidden="true">
            <div className="h-full w-full bg-border/60" />
            {!reduced && (
              <motion.div
                className="absolute left-0 top-0 h-full w-1/5"
                style={{ background: 'linear-gradient(to right, transparent, hsl(var(--glow-2)), transparent)' }}
                animate={{ x: ['0%', '500%'] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
              />
            )}
          </div>
          <ol className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6">
            {c.steps.map((step, i) => {
              const Icon = getIcon(step.icon);
              return (
                <motion.li
                  key={step.title}
                  initial={reduced ? false : { opacity: 0, y: 40, scale: 0.92 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ type: 'spring', stiffness: 120, damping: 16, delay: i * 0.14 }}
                  className="group relative flex items-center gap-4 lg:flex-col lg:gap-0 lg:text-center"
                >
                  <div className="relative shrink-0 lg:mb-4">
                    <div className="glow-panel flex h-[88px] w-[88px] items-center justify-center rounded-2xl bg-[hsl(var(--panel-2))] transition-transform duration-300 group-hover:-translate-y-1">
                      <Icon className="h-7 w-7 text-primary" aria-hidden="true" />
                    </div>
                    <motion.span
                      initial={reduced ? false : { scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true, margin: '-60px' }}
                      transition={{ type: 'spring', stiffness: 300, damping: 15, delay: i * 0.14 + 0.25 }}
                      className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary font-mono text-[11px] font-bold text-primary-foreground"
                      aria-hidden="true"
                    >
                      {i + 1}
                    </motion.span>
                  </div>
                  <div className="lg:px-1">
                    <h3 className="mb-1 font-display text-base font-semibold">{step.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground lg:text-xs">{step.desc}</p>
                  </div>
                </motion.li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

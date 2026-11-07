import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDown, Check } from 'lucide-react';
import { SectionHeader } from '../components/SectionHeader';
import { bookingLink, klaviyo as c } from '../content/site';
import { getIcon } from '../lib/icons';
import { scrollToId } from '../lib/scroll';
import { FlowMap } from './FlowMap';

/** Klaviyo expertise (reference: "Flagship product" section — chips row, feature list, product fragment). */
export function Klaviyo() {
  const reduced = useReducedMotion();
  return (
    <section id="klaviyo" aria-labelledby="klaviyo-title" className="section-padding relative">
      <div className="container-wide relative z-10">
        <SectionHeader id="klaviyo-title" label={c.label} title={c.title} accent={c.accent} sub={c.sub}>
          <ul className="mt-7 flex flex-wrap items-center justify-center gap-2" aria-label={c.chipsLabel}>
            <li className="mr-1 text-xs uppercase tracking-widest text-muted-foreground" aria-hidden="true">
              {c.chipsLabel}
            </li>
            {c.chips.map((chip, i) =>
              i === 0 ? (
                <motion.li
                  key={chip}
                  initial={{ opacity: 0, scale: 0.85 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                  className="inline-flex items-center gap-1.5 rounded-full border border-primary/50 bg-primary/15 px-3 py-1.5 text-xs font-semibold text-primary md:text-sm"
                  style={{ animation: 'chip-glow 2.4s ease-in-out infinite' }}
                >
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                  {chip}
                </motion.li>
              ) : (
                <motion.li
                  key={chip}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.07 }}
                  whileHover={{ y: -2 }}
                  className="relative cursor-default overflow-hidden rounded-full border border-border/60 bg-secondary/60 px-3 py-1.5 text-xs font-medium text-foreground/80 transition-colors hover:border-primary/50 hover:text-foreground md:text-sm"
                >
                  {!reduced && (
                    <motion.span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 rounded-full"
                      style={{ background: 'linear-gradient(120deg, transparent, hsl(var(--primary)/0.16), transparent)' }}
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 1.6, repeat: Infinity, repeatDelay: (c.chips.length - 2) * 1.6, delay: (i - 1) * 1.6, ease: 'easeInOut' }}
                    />
                  )}
                  <span className="relative">{chip}</span>
                </motion.li>
              ),
            )}
            <motion.li
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 + c.chips.length * 0.07 }}
            >
              <motion.a
                {...bookingLink}
                whileHover={{ y: -2, scale: 1.03 }}
                className="inline-block rounded-full border border-dashed border-primary/50 px-3 py-1.5 text-xs font-medium text-primary/90 transition-colors hover:bg-primary/10 hover:text-primary md:text-sm"
              >
                {c.chipsCta}
              </motion.a>
            </motion.li>
          </ul>
        </SectionHeader>

        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-14">
          <motion.div
            initial={reduced ? false : { opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="order-2 lg:order-1"
          >
            <ul className="space-y-5">
              {c.points.map(({ icon, title, desc }) => {
                const Icon = getIcon(icon);
                return (
                  <motion.li
                    key={title}
                    initial={reduced ? false : { opacity: 0, y: 60, rotateX: -15 }}
                    whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                    style={{ transformPerspective: 1000 }}
                    className="flex items-start gap-4"
                  >
                    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10">
                      <motion.div animate={reduced ? undefined : { y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
                        <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                      </motion.div>
                    </div>
                    <div>
                      <h3 className="mb-1 font-display text-base font-semibold md:text-lg">{title}</h3>
                      <p className="text-sm leading-relaxed text-muted-foreground md:text-base">{desc}</p>
                    </div>
                  </motion.li>
                );
              })}
            </ul>
            <motion.a
              href="#projects"
              onClick={(e) => {
                e.preventDefault();
                scrollToId('projects');
              }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-[0_0_30px_hsl(var(--primary)/0.35)] transition-colors hover:bg-primary/90 md:text-base"
            >
              {c.cta}
              <ArrowDown className="h-4 w-4" aria-hidden="true" />
            </motion.a>
          </motion.div>
          <motion.div
            initial={reduced ? false : { opacity: 0, x: 30, scale: 0.96 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="order-1 mx-auto w-full max-w-xl lg:order-2"
          >
            <FlowMap />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

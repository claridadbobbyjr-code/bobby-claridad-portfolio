import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, MessageSquareQuote } from 'lucide-react';
import { SectionHeader } from '../components/SectionHeader';
import { profile, testimonials as c } from '../content/site';
import { gridContainer, gridItem } from '../lib/motion';

const referenceMailto = `mailto:${profile.email}?subject=${encodeURIComponent('Reference request')}&body=${encodeURIComponent(
  'Hi Bobby,\n\nCould you share a reference from a recent Klaviyo or Shopify role?\n\n- Our store:\n- What we’d like to work on:\n\nThanks!',
)}`;

/**
 * Testimonials. Quote cards come only from `testimonials.items` in content/site.ts.
 * Each card shows the person's photo, name, company and their words. While the list is empty
 * the section shows a "references on request" card instead.
 */
export function Testimonials() {
  const reduced = useReducedMotion();
  const hasItems = c.items.length > 0;
  return (
    <section id="testimonials" aria-labelledby="testimonials-title" className="section-padding relative">
      <div className="container-tight relative z-10">
        <SectionHeader id="testimonials-title" label={c.label} title={c.title} accent={c.accent} sub={hasItems ? c.sub : undefined} />

        {hasItems ? (
          <motion.ul
            variants={gridContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className={`grid gap-5 md:grid-cols-2 ${c.items.length % 3 === 0 ? 'lg:grid-cols-3' : 'mx-auto max-w-5xl lg:gap-6'}`}
          >
            {c.items.map((t) => (
              <motion.li key={`${t.name}-${t.quote.slice(0, 20)}`} variants={gridItem}>
                <motion.figure whileHover={{ y: -6 }} className="glow-panel card-hover relative flex h-full flex-col p-6 sm:p-7">
                  <figcaption className="mb-4 flex items-center gap-3.5">
                    {t.photo ? (
                      <img
                        src={t.photo}
                        alt=""
                        width={56}
                        height={56}
                        loading="lazy"
                        decoding="async"
                        className="h-14 w-14 shrink-0 rounded-full object-cover ring-2 ring-primary/40 ring-offset-2 ring-offset-background"
                      />
                    ) : (
                      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 font-display font-bold text-primary" aria-hidden="true">
                        {t.name
                          .split(' ')
                          .map((w) => w[0])
                          .join('')}
                      </span>
                    )}
                    <span className="min-w-0">
                      <span className="block font-display text-[1.05rem] font-semibold leading-tight">{t.name}</span>
                      <span className="block text-sm text-muted-foreground">
                        {t.role}
                        {t.company && `, ${t.company}`}
                      </span>
                    </span>
                  </figcaption>
                  <blockquote className="flex-1 text-[0.95rem] leading-relaxed text-foreground/90">“{t.quote}”</blockquote>
                </motion.figure>
              </motion.li>
            ))}
          </motion.ul>
        ) : (
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 30, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glow-panel mx-auto flex max-w-2xl flex-col items-center p-8 text-center sm:p-10"
            data-testid="testimonials-empty"
          >
            <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <MessageSquareQuote className="h-7 w-7 text-primary" aria-hidden="true" />
            </span>
            <h3 className="mb-2 font-display text-xl font-bold sm:text-2xl">{c.empty.title}</h3>
            <p className="mb-6 max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base">{c.empty.desc}</p>
            <motion.a
              href={referenceMailto}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 rounded-xl border border-primary/50 px-6 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
            >
              {c.empty.cta}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </motion.a>
          </motion.div>
        )}
      </div>
    </section>
  );
}

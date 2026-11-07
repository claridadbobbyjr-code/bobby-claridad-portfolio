import { motion } from 'framer-motion';
import { partners } from '../content/site';
import { gridContainer, gridItem } from '../lib/motion';

/**
 * "Previous partners" logo strip under the hero. At rest each logo is a one-colour PNG (black on transparent);
 * CSS turns them white in night mode. On hover the brand's original-colour logo fades in on a tile (index.css).
 */
export function Partners() {
  return (
    <div role="region" aria-labelledby="partners-title" data-testid="partners" className="relative px-5 md:px-12">
      <div className="container-wide border-y border-border/50 py-9 md:py-11">
        <p id="partners-title" className="mb-7 text-center font-mono text-[11px] uppercase tracking-[0.24em] text-muted-foreground md:mb-9">
          {partners.label}
        </p>
        <motion.ul
          variants={gridContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="flex flex-wrap items-center justify-center gap-x-8 gap-y-8 [--logo-scale:0.72] sm:gap-x-10 sm:[--logo-scale:0.85] md:grid md:grid-cols-5 md:justify-items-center md:gap-x-6 md:gap-y-10 md:[--logo-scale:1]"
        >
          {partners.items.map((p) => (
            <motion.li key={p.name} variants={gridItem} className="partner relative flex h-14 max-w-full items-center" data-testid="partner">
              <span
                aria-hidden="true"
                className={`partner-tile pointer-events-none absolute -inset-x-3 -inset-y-2 rounded-2xl border md:-inset-x-4 md:-inset-y-2.5 ${p.tile ? 'border-white/15' : 'border-black/[0.06]'}`}
                style={{ background: p.tile ?? '#ffffff' }}
              />
              <span className="relative grid max-w-full">
                <img
                  src={p.logo}
                  alt={p.name}
                  width={p.width}
                  height={p.height}
                  loading="lazy"
                  decoding="async"
                  style={{ height: `calc(${p.h}px * var(--logo-scale))` }}
                  className="partner-logo w-auto max-w-full [grid-area:1/1]"
                />
                <img
                  src={p.colour}
                  alt=""
                  aria-hidden="true"
                  width={p.width}
                  height={p.height}
                  loading="lazy"
                  decoding="async"
                  style={{ height: `calc(${p.h}px * var(--logo-scale))` }}
                  className="partner-colour w-auto max-w-full [grid-area:1/1]"
                />
              </span>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </div>
  );
}

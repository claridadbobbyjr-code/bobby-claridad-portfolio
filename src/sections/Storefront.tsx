import { motion, useInView, useReducedMotion } from 'framer-motion';
import { ArrowRight, Crown, FileCode2 } from 'lucide-react';
import { Fragment, useRef } from 'react';
import { SectionHeader } from '../components/SectionHeader';
import { bookingLink, storefront as c } from '../content/site';
import { getIcon } from '../lib/icons';
import { EASE_OUT_EXPO } from '../lib/motion';

const TOKEN = /(\{%-?|-?%\}|\{\{|\}\}|'[^']*'|"[^"]*"|\b(?:liquid|assign|if|elsif|endif|render|schema|endschema|contains)\b|<\/?[a-z]+|>)/g;

/** Minimal Liquid/HTML highlighter: delimiters, keywords, strings and tags get their own colour. */
function highlight(line: string) {
  return line.split(TOKEN).map((part, i) => {
    if (!part) return null;
    let cls = 'text-foreground/80';
    if (/^(\{%-?|-?%\}|\{\{|\}\})$/.test(part)) cls = 'text-primary';
    else if (/^['"]/.test(part)) cls = 'text-emerald-300';
    else if (/^(liquid|assign|if|elsif|endif|render|schema|endschema|contains)$/.test(part)) cls = 'text-amber-300';
    else if (/^(<\/?[a-z]+|>)$/.test(part)) cls = 'text-sky-300';
    return (
      <span key={i} className={cls}>
        {part}
      </span>
    );
  });
}

/** Editor-style panel whose lines type in one after another once it scrolls into view. */
function CodePanel() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const reduced = useReducedMotion();
  const show = inView || !!reduced;
  const lines = c.code.lines;

  return (
    <div ref={ref} className="relative">
      <div
        aria-hidden="true"
        className="absolute -inset-6 blur-3xl"
        style={{ background: 'radial-gradient(circle at 40% 40%, hsl(var(--primary)/0.22), transparent 70%)' }}
      />
      <figure className="force-dark relative overflow-hidden rounded-2xl border border-hairline/[0.08] bg-[hsl(0_0%_5%/0.94)] shadow-[0_30px_80px_-10px_hsl(var(--drop)/0.8),0_0_40px_hsl(var(--primary)/0.15)]">
        <div className="flex items-center gap-2 border-b border-hairline/[0.06] px-4 py-2.5">
          <span className="flex gap-1.5" aria-hidden="true">
            <i className="h-2.5 w-2.5 rounded-full bg-hairline/15" />
            <i className="h-2.5 w-2.5 rounded-full bg-hairline/15" />
            <i className="h-2.5 w-2.5 rounded-full bg-hairline/15" />
          </span>
          <FileCode2 className="ml-2 h-3.5 w-3.5 text-primary" aria-hidden="true" />
          <span className="truncate font-mono text-[11px] text-muted-foreground">{c.code.file}</span>
        </div>
        <pre className="overflow-x-auto px-4 py-4 font-mono text-[11px] leading-[1.7] sm:text-[12px]" data-testid="liquid-code">
          <code>
            {lines.map((line, i) => (
              <Fragment key={i}>
                <motion.span
                  className="block whitespace-pre"
                  initial={reduced ? false : { opacity: 0, x: -8 }}
                  animate={show ? { opacity: 1, x: 0 } : undefined}
                  transition={{ duration: 0.3, delay: reduced ? 0 : 0.2 + i * 0.07, ease: EASE_OUT_EXPO }}
                >
                  <span className="mr-4 inline-block w-5 select-none text-right text-muted-foreground/40" aria-hidden="true">
                    {i + 1}
                  </span>
                  {highlight(line)}
                  {i === lines.length - 1 && !reduced && (
                    <span className="ml-0.5 inline-block h-3.5 w-1.5 translate-y-0.5 bg-primary" style={{ animation: 'caret-blink 1s steps(1) infinite' }} aria-hidden="true" />
                  )}
                </motion.span>
              </Fragment>
            ))}
          </code>
        </pre>
        <figcaption className="border-t border-hairline/[0.06] px-4 py-2.5 text-[11px] text-muted-foreground">{c.code.caption}</figcaption>
      </figure>
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 12, scale: 0.95 }}
        animate={show ? { opacity: 1, y: 0, scale: 1 } : undefined}
        transition={{ duration: 0.5, delay: reduced ? 0 : 0.3 + lines.length * 0.07, ease: EASE_OUT_EXPO }}
        className="glass-card absolute -bottom-6 -right-2 flex items-center gap-2.5 rounded-xl px-3 py-2 sm:-right-5"
        aria-hidden="true"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-400/10 text-amber-300 ring-1 ring-amber-300/30">
          <Crown className="h-4 w-4" />
        </span>
        <span>
          <span className="block text-[11px] font-bold text-foreground">Rewards banner</span>
          <span className="block text-[10px] text-muted-foreground">Renders: Gold Leaf</span>
        </span>
      </motion.div>
    </div>
  );
}

/** Shopify customization: Liquid, GemPages and other page builders. */
export function Storefront() {
  const reduced = useReducedMotion();
  return (
    <section id="shopify" aria-labelledby="shopify-title" className="section-padding relative">
      <div className="container-wide relative z-10">
        <SectionHeader id="shopify-title" label={c.label} title={c.title} accent={c.accent} sub={c.sub}>
          <ul className="mt-7 flex flex-wrap items-center justify-center gap-2" aria-label={c.buildersLabel}>
            <li className="mr-1 text-xs uppercase tracking-widest text-muted-foreground" aria-hidden="true">
              {c.buildersLabel}
            </li>
            {c.builders.map((b, i) => (
              <motion.li
                key={b}
                initial={reduced ? false : { opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 + i * 0.07 }}
                whileHover={{ y: -2 }}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium md:text-sm ${
                  i === 0
                    ? 'border-primary/50 bg-primary/15 font-semibold text-primary'
                    : 'border-border/60 bg-secondary/60 text-foreground/80 transition-colors hover:border-primary/50 hover:text-foreground'
                }`}
                style={i === 0 ? { animation: 'chip-glow 2.4s ease-in-out infinite' } : undefined}
              >
                {b}
              </motion.li>
            ))}
          </ul>
        </SectionHeader>

        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-14">
          <motion.div
            initial={reduced ? false : { opacity: 0, x: -30, scale: 0.96 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
            className="mx-auto w-full min-w-0 max-w-xl"
          >
            <CodePanel />
          </motion.div>

          <div>
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
                      <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
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
              {...bookingLink}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-[0_0_30px_hsl(var(--primary)/0.35)] transition-colors hover:bg-primary/90 md:text-base"
            >
              {c.cta}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </motion.a>
          </div>
        </div>
      </div>
    </section>
  );
}

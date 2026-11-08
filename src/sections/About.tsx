import { motion, useReducedMotion } from 'framer-motion';
import { Download } from 'lucide-react';
import { SectionHeader } from '../components/SectionHeader';
import { about as c, asset, profile } from '../content/site';

/**
 * Portrait slot: the headshot in /public (4:5 WebP). Set `photo` to null to
 * fall back to the designed monogram.
 */
const photo: string | null = asset('/bobby-claridad.webp');

function Portrait() {
  if (photo) {
    return <img src={photo} alt={`Portrait of ${profile.name}`} className="aspect-[4/5] h-auto w-full rounded-xl object-cover" loading="lazy" decoding="async" width={640} height={800} />;
  }
  return (
    <div
      className="force-dark relative flex aspect-[4/5] w-full items-center justify-center overflow-hidden rounded-xl"
      style={{ background: 'radial-gradient(80% 60% at 50% 35%, hsl(13.2 93.3% 53.1% / 0.3), hsl(0 0% 6%) 70%)' }}
      role="img"
      aria-label={`${profile.name} monogram`}
    >
      <svg viewBox="0 0 200 250" className="absolute inset-0 h-full w-full opacity-40" aria-hidden="true">
        {[...Array(6)].map((_, i) => (
          <circle key={i} cx={30 + ((i * 37) % 150)} cy={40 + ((i * 53) % 180)} r={i % 3 === 0 ? 3 : 1.6} fill="hsl(var(--primary))" />
        ))}
        <path d="M30 40 L67 93 L104 146 M67 93 L141 199 M178 85 L104 146" stroke="hsl(var(--primary))" strokeOpacity=".35" strokeWidth=".8" fill="none" />
      </svg>
      <span className="relative font-display text-[7rem] font-bold leading-none tracking-tighter text-gradient">{profile.initials}</span>
    </div>
  );
}

/** About (reference: "The builder" — portrait, name, role line, checks, story quote, profile link). */
export function About() {
  const reduced = useReducedMotion();
  return (
    <section id="about" aria-labelledby="about-title" className="section-padding relative">
      <div className="container-tight relative z-10">
        <SectionHeader id="about-title" label={c.label} title={c.title} accent={c.accent} sub={c.sub} className="mb-10 md:mb-14" />

        <motion.div
          initial={reduced ? false : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid items-center gap-8 md:grid-cols-[0.8fr_1.2fr] md:gap-10"
        >
          <div className="relative mx-auto w-full max-w-xs md:mx-0">
            <div
              className="absolute inset-0 opacity-40 blur-3xl"
              style={{ background: 'radial-gradient(circle at 50% 40%, hsl(var(--primary)/0.4), transparent 70%)' }}
              aria-hidden="true"
            />
            <div className="glass-card relative overflow-hidden rounded-2xl p-2">
              <Portrait />
            </div>
          </div>

          <div className="text-center md:text-left">
            <h3 className="mb-1 font-display text-2xl font-bold sm:text-3xl">{profile.name}</h3>
            <p className="mb-5 font-medium text-primary">{profile.headline}</p>
            <ul className="mx-auto mb-6 max-w-xl space-y-3 text-left md:mx-0">
              {c.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2.5 text-sm text-foreground/85 sm:text-base">
                  <span className="shrink-0 font-bold text-primary" aria-hidden="true">
                    ✓
                  </span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>

            <motion.figure
              initial={reduced ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="relative my-7 overflow-hidden rounded-xl border border-border/40 bg-card/30 p-5 text-left backdrop-blur-sm sm:p-6"
            >
              <motion.span
                aria-hidden="true"
                initial={reduced ? false : { scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                className="absolute left-0 top-0 h-full w-1 origin-top bg-gradient-to-b from-primary to-accent"
              />
              <span aria-hidden="true" className="absolute -top-3 left-4 select-none font-display text-6xl leading-none text-primary/20">
                “
              </span>
              <figcaption className="mb-3 pl-2 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-primary">{c.storyLabel}</figcaption>
              <blockquote className="pl-2 text-sm leading-relaxed text-muted-foreground sm:text-[0.95rem]">
                {c.story}
                <span className="font-medium text-foreground">{c.storyStrong}</span>
              </blockquote>
            </motion.figure>

            <a
              href={profile.resume}
              download
              className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary/60 hover:bg-primary/10"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              {c.cta}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

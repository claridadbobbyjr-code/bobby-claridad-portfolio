import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, EyeOff, FolderOpen, Info } from 'lucide-react';
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { CountUp } from '../components/CountUp';
import { SectionHeader } from '../components/SectionHeader';
import { bookingLink, projects as c, type Metric, type Sample, type Shot } from '../content/site';
import { getIcon } from '../lib/icons';
import { EASE_OUT_EXPO } from '../lib/motion';

const samples: Sample[] = c.samples;
const pad = (n: number) => String(n).padStart(2, '0');
const fmt = (m: Metric) =>
  `${m.prefix ?? ''}${m.value.toLocaleString('en-US', { minimumFractionDigits: m.decimals ?? 0, maximumFractionDigits: m.decimals ?? 0 })}${m.suffix ?? ''}`;

const rise = (reduced: boolean | null, delay = 0) => ({
  initial: reduced ? false : { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6, delay, ease: EASE_OUT_EXPO },
});

/** The big number at the top of each folder page. */
function HeadlineStat({ m }: { m: Sample['headline'] }) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/[0.14] via-background/40 to-transparent p-5 sm:p-6"
      data-testid="headline-stat"
    >
      <span aria-hidden="true" className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/25 blur-3xl" />
      <CountUp
        value={m.value}
        prefix={m.prefix}
        suffix={m.suffix}
        decimals={m.decimals}
        duration={1.8}
        className="relative block bg-gradient-to-br from-foreground via-foreground to-primary bg-clip-text font-display text-5xl font-bold tabular-nums leading-none text-transparent drop-shadow-[0_0_24px_hsl(var(--primary)/0.45)] sm:text-6xl"
      />
      <p className="relative mt-3 font-display text-base font-semibold text-foreground sm:text-lg">{m.label}</p>
      <p className="relative mt-1 text-xs text-muted-foreground sm:text-sm">{m.note}</p>
    </div>
  );
}

function StatGrid({ stats }: { stats: Metric[] }) {
  const reduced = useReducedMotion();
  return (
    <dl className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={reduced ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 + i * 0.06 }}
          className="rounded-xl border border-hairline/[0.07] bg-[hsl(var(--panel)/0.8)] px-3 py-2.5"
        >
          <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">{s.label}</dt>
          <dd>
            <CountUp
              value={s.value}
              prefix={s.prefix}
              suffix={s.suffix}
              decimals={s.decimals}
              className="font-display text-lg font-bold tabular-nums text-foreground sm:text-xl"
            />
          </dd>
        </motion.div>
      ))}
    </dl>
  );
}

/** Browser-framed screenshot (client text and figures blurred in the file); two shots get a view switch. */
function ShotFrame({ sample, shots, wide }: { sample: Sample; shots: Shot[]; wide?: boolean }) {
  const [view, setView] = useState(0);
  const shot = shots[view];
  const narrow = shot.width / shot.height < 0.6;
  return (
    <div className="overflow-hidden rounded-2xl border border-hairline/[0.08] bg-[hsl(var(--panel))] p-2.5 shadow-[0_30px_70px_-20px_hsl(var(--drop)/0.8)]">
      <div className="flex items-center gap-2 px-1.5 pb-2.5 pt-1">
        <span className="flex gap-1.5" aria-hidden="true">
          <i className="h-2.5 w-2.5 rounded-full bg-hairline/15" />
          <i className="h-2.5 w-2.5 rounded-full bg-hairline/15" />
          <i className="h-2.5 w-2.5 rounded-full bg-hairline/15" />
        </span>
        <span className="ml-1.5 min-w-0 flex-1 truncate font-mono text-[10.5px] text-muted-foreground">{sample.kicker}</span>
        {shots.length > 1 && (
          <div role="group" aria-label="Screenshot view" className="flex shrink-0 rounded-lg border border-hairline/10 p-0.5">
            {shots.map((s, i) => (
              <button
                key={s.label}
                type="button"
                aria-pressed={view === i}
                onClick={() => setView(i)}
                className={`rounded-md px-2 py-0.5 text-[10.5px] font-medium transition-colors ${
                  view === i ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="relative overflow-hidden rounded-lg bg-[#f4f4f5]">
        <img
          key={shot.src}
          src={shot.src}
          alt={shot.alt}
          width={shot.width}
          height={shot.height}
          loading="lazy"
          decoding="async"
          className={`aspect-[16/11] w-full ${narrow ? 'object-contain' : wide ? 'object-cover object-left-top' : 'object-cover object-top'}`}
        />
        <span className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 rounded-lg bg-black/75 px-2.5 py-1.5 text-[11px] font-medium text-white">
          <EyeOff className="h-3.5 w-3.5" aria-hidden="true" /> {c.privacyNote}
        </span>
      </div>
    </div>
  );
}

function RevenueBars() {
  const reduced = useReducedMotion();
  const k = c.checkoutBars;
  const max = Math.max(...k.bars.map((b) => b.value));
  return (
    <figure className="rounded-2xl border border-hairline/[0.08] bg-[hsl(var(--panel))] p-5 sm:p-6" aria-labelledby="checkout-bars-title">
      <figcaption id="checkout-bars-title" className="mb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-foreground/80">
        {k.title}
      </figcaption>
      <ul className="flex flex-col gap-2.5" data-testid="checkout-bars">
        {k.bars.map((b, i) => (
          <li
            key={b.label}
            className="grid grid-cols-[minmax(0,8.5rem)_minmax(0,1fr)_3.75rem] items-center gap-2.5 text-[12.5px] sm:grid-cols-[minmax(0,10rem)_minmax(0,1fr)_4rem]"
          >
            <span className="truncate text-foreground/85">{b.label}</span>
            <span className="h-2.5 overflow-hidden rounded-full bg-hairline/[0.06]" aria-hidden="true">
              <motion.span
                className="block h-full rounded-full"
                style={{
                  background: b.offer
                    ? 'linear-gradient(90deg, hsl(32 70% 25%), hsl(36 100% 64%))'
                    : 'linear-gradient(90deg, hsl(355 65% 30%), hsl(var(--primary)))',
                  boxShadow: b.offer ? '0 0 10px hsl(36 100% 64% / 0.3)' : '0 0 10px hsl(var(--primary) / 0.35)',
                }}
                initial={reduced ? false : { width: 0 }}
                animate={{ width: `${(b.value / max) * 100}%` }}
                transition={{ duration: 1.2, delay: reduced ? 0 : 0.25 + i * 0.08, ease: [0.2, 0.7, 0.2, 1] }}
              />
            </span>
            <span className="text-right tabular-nums text-foreground">${b.value.toLocaleString('en-US')}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 flex gap-4 font-mono text-[10.5px] text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <i className="h-2.5 w-2.5 rounded-sm bg-primary" aria-hidden="true" /> No discount
        </span>
        <span className="flex items-center gap-1.5">
          <i className="h-2.5 w-2.5 rounded-sm bg-amber-400" aria-hidden="true" /> 20% offer
        </span>
      </p>
    </figure>
  );
}

/** Table of contents on the case-study page: every other sample with its headline number. */
function FolderIndex({ onPick }: { onPick: (i: number) => void }) {
  return (
    <nav aria-label="Samples in this folder" className="rounded-2xl border border-hairline/[0.08] bg-[hsl(var(--panel))] p-3 sm:p-4">
      <p className="px-2 pb-2 pt-1 font-mono text-[11px] uppercase tracking-[0.18em] text-foreground/80">Inside this folder</p>
      <ul className="flex flex-col gap-1.5">
        {samples.slice(1).map((s, i) => {
          const Icon = getIcon(s.icon);
          return (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => onPick(i + 1)}
                className="group flex w-full items-center gap-3 rounded-xl border border-transparent px-2.5 py-2.5 text-left transition-colors hover:border-primary/30 hover:bg-primary/[0.06]"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-foreground">{s.tab}</span>
                  <span className="block truncate text-xs text-muted-foreground">{s.headline.label}</span>
                </span>
                <span className="shrink-0 font-display text-base font-bold tabular-nums text-primary sm:text-lg">{fmt(s.headline)}</span>
                <ArrowRight className="hidden h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary sm:block" aria-hidden="true" />
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function Page({ sample, onPick }: { sample: Sample; onPick: (i: number) => void }) {
  const v = sample.visual;
  return (
    <div className="grid gap-8 p-5 sm:p-8 lg:grid-cols-[1fr_1.05fr] lg:gap-10">
      <div className="flex min-w-0 flex-col gap-5">
        <div>
          <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.18em] text-primary">{sample.kicker}</p>
          <h3 className="font-display text-2xl font-bold leading-tight sm:text-3xl">{sample.title}</h3>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">{sample.desc}</p>
        {sample.tags && (
          <ul className="flex flex-wrap gap-2" aria-label="Scope">
            {sample.tags.map((t) => (
              <li key={t} className="rounded-full border border-primary/30 bg-background/40 px-3 py-1 font-mono text-[11px] tracking-wide text-foreground/85">
                {t}
              </li>
            ))}
          </ul>
        )}
        {sample.insight && <p className="border-l-2 border-primary pl-3.5 text-sm leading-relaxed text-foreground/85">{sample.insight}</p>}
        <HeadlineStat m={sample.headline} />
      </div>
      <div className="flex min-w-0 flex-col gap-4">
        <StatGrid stats={sample.stats} />
        {v.kind === 'index' && <FolderIndex onPick={onPick} />}
        {v.kind === 'bars' && <RevenueBars />}
        {v.kind === 'shots' && <ShotFrame sample={sample} shots={v.shots} wide={v.wide} />}
      </div>
    </div>
  );
}

/**
 * Project folder: tabs along the top like a file folder; picking one flips the page.
 * WAI-ARIA tabs pattern (arrow keys, Home/End, roving tabindex) plus previous/next buttons.
 */
function ProjectFolder() {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const [dir, setDir] = useState(1);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const strip = useRef<HTMLDivElement>(null);
  const sample = samples[active];

  const go = (i: number, focus = false) => {
    const next = (i + samples.length) % samples.length;
    setDir(next >= active ? 1 : -1);
    setActive(next);
    if (focus) tabs.current[next]?.focus();
  };

  // Keep the selected tab visible in the horizontally scrolling strip (phones).
  useEffect(() => {
    const el = tabs.current[active];
    const s = strip.current;
    if (el && s && typeof s.scrollTo === 'function') s.scrollTo({ left: el.offsetLeft - 12, behavior: reduced ? 'auto' : 'smooth' });
  }, [active, reduced]);

  const onKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const map: Record<string, number> = { ArrowRight: active + 1, ArrowLeft: active - 1, Home: 0, End: samples.length - 1 };
    if (e.key in map) {
      e.preventDefault();
      go(map[e.key], true);
    }
  };

  return (
    <motion.div {...rise(reduced)} data-testid="project-folder">
      <div
        ref={strip}
        role="tablist"
        aria-label={c.folderLabel}
        className="relative z-10 -mb-px flex gap-1 overflow-x-auto px-1 pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {samples.map((s, i) => {
          const Icon = getIcon(s.icon);
          const selected = i === active;
          return (
            <button
              key={s.id}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`sample-tab-${s.id}`}
              aria-selected={selected}
              aria-controls="sample-panel"
              tabIndex={selected ? 0 : -1}
              onClick={() => go(i)}
              onKeyDown={onKey}
              className={`relative flex shrink-0 items-center gap-2 rounded-t-xl px-3.5 py-2.5 text-sm font-medium transition-colors sm:px-4 ${
                selected ? 'text-foreground' : 'bg-hairline/[0.03] text-muted-foreground hover:bg-hairline/[0.06] hover:text-foreground'
              }`}
            >
              {selected && (
                <motion.span
                  layoutId="folder-tab"
                  className="absolute inset-0 rounded-t-xl border border-b-0 border-primary/40 bg-[hsl(var(--panel-2))] shadow-[0_-8px_24px_-12px_hsl(var(--primary)/0.6)]"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
              <span className={`relative font-mono text-[10px] ${selected ? 'text-primary' : 'text-muted-foreground/60'}`}>{pad(i + 1)}</span>
              <Icon className={`relative h-4 w-4 ${selected ? 'text-primary' : ''}`} aria-hidden="true" />
              <span className="relative whitespace-nowrap">{s.tab}</span>
            </button>
          );
        })}
      </div>

      <div
        id="sample-panel"
        role="tabpanel"
        aria-labelledby={`sample-tab-${sample.id}`}
        className="relative overflow-hidden rounded-b-2xl rounded-tr-2xl border border-primary/40 bg-[hsl(var(--panel-2))] shadow-[0_30px_80px_-20px_hsl(var(--drop)/0.8),0_0_40px_hsl(var(--primary)/0.12)]"
      >
        <div className="flex items-center gap-3 border-b border-hairline/[0.06] px-5 py-3 sm:px-8">
          <FolderOpen className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
          <span className="min-w-0 flex-1 truncate font-mono text-[11px] text-muted-foreground">
            projects / <span className="text-foreground/85">{sample.tab.toLowerCase().replace(/\s+/g, '-')}</span>
          </span>
          <span className="hidden shrink-0 items-center gap-1.5 rounded-full border border-hairline/10 px-2.5 py-1 font-mono text-[10.5px] text-muted-foreground sm:inline-flex">
            <Info className="h-3 w-3" aria-hidden="true" /> {c.figuresBadge}
          </span>
          <span className="font-mono text-[11px] tabular-nums text-muted-foreground" aria-hidden="true">
            {pad(active + 1)} / {pad(samples.length)}
          </span>
          <span className="flex gap-1">
            <button
              type="button"
              onClick={() => go(active - 1)}
              aria-label="Previous sample"
              className="rounded-lg border border-hairline/10 p-1.5 text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => go(active + 1)}
              aria-label="Next sample"
              className="rounded-lg border border-hairline/10 p-1.5 text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
            >
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </span>
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={sample.id}
            initial={reduced ? { opacity: 0 } : { opacity: 0, x: dir * 48, filter: 'blur(6px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, x: dir * -32, filter: 'blur(4px)' }}
            transition={{ duration: reduced ? 0.15 : 0.35, ease: EASE_OUT_EXPO }}
          >
            <Page sample={sample} onPick={(i) => go(i)} />
          </motion.div>
        </AnimatePresence>
      </div>
      <p className="mt-4 text-xs leading-relaxed text-muted-foreground/80">{c.footnote}</p>
    </motion.div>
  );
}

/** Projects: a tabbed folder of real samples (blurred screenshots, real numbers) and the tools panel. */
export function Projects() {
  const reduced = useReducedMotion();
  return (
    <section id="projects" aria-labelledby="projects-title" className="section-padding relative">
      <div className="container-wide relative z-10">
        <SectionHeader id="projects-title" label={c.label} title={c.title} accent={c.accent} sub={c.sub} />

        <ProjectFolder />

        <motion.div {...rise(reduced)} className="glass-card mt-20 rounded-2xl p-7 sm:p-9" aria-labelledby="tools-title" role="region">
          <h3 id="tools-title" className="mb-7 text-center font-display text-xl font-bold sm:text-2xl">
            {c.toolsTitle}
          </h3>
          <div className="grid gap-8 md:grid-cols-3">
            {c.toolGroups.map((g, gi) => (
              <div key={g.name}>
                <h4 className="mb-3 font-sans text-sm font-semibold text-foreground">{g.name}</h4>
                <ul className="flex flex-wrap gap-2">
                  {g.tools.map((t, ti) => (
                    <motion.li
                      key={t}
                      initial={reduced ? false : { opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.35, delay: gi * 0.1 + ti * 0.03 }}
                      className="rounded-full border border-border/60 bg-secondary/50 px-3 py-1 text-sm text-foreground/85 transition-colors hover:border-primary/50 hover:text-foreground"
                    >
                      {t}
                    </motion.li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.a
          {...rise(reduced)}
          {...bookingLink}
          whileHover={{ y: -4 }}
          className="group mt-8 flex flex-col items-start justify-between gap-4 rounded-2xl border border-dashed border-primary/50 p-6 transition-colors hover:bg-primary/[0.06] sm:flex-row sm:items-center sm:p-7"
        >
          <span>
            <span className="mb-1 block font-display text-lg font-semibold">{c.openCard.title}</span>
            <span className="block text-[0.95rem] leading-relaxed text-muted-foreground">{c.openCard.desc}</span>
          </span>
          <span className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-primary">
            {c.openCard.cta}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </span>
        </motion.a>
      </div>
    </section>
  );
}

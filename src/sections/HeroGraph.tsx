import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Activity } from 'lucide-react';
import { useRef } from 'react';
import { CountUp } from '../components/CountUp';
import { NodeCard } from '../components/NodeCard';
import { hero, heroEdges, heroNodes } from '../content/site';
import { getIcon } from '../lib/icons';
import { nodeContainer, nodeItem } from '../lib/motion';

const VW = 540;
const VH = 600;
const HALF_H = 43;
const pct = (x: number, y: number) => ({ left: `${(x / VW) * 100}%`, top: `${(y / VH) * 100}%` });

type Pt = { x: number; y: number };
const nodeById = (id: string) => heroNodes.find((n) => n.id === id)!;

/** Orthogonal connector with rounded elbows from the bottom of one node to the top of the next. */
function route(a: Pt, b: Pt): { d: string; start: Pt; end: Pt } {
  const start = { x: a.x, y: a.y + HALF_H };
  const end = { x: b.x, y: b.y - HALF_H };
  if (a.x === b.x) return { d: `M ${start.x} ${start.y} L ${end.x} ${end.y}`, start, end };
  const midY = (start.y + end.y) / 2;
  const dir = Math.sign(end.x - start.x);
  const r = 12;
  const d = [
    `M ${start.x} ${start.y}`,
    `L ${start.x} ${midY - r}`,
    `Q ${start.x} ${midY} ${start.x + dir * r} ${midY}`,
    `L ${end.x - dir * r} ${midY}`,
    `Q ${end.x} ${midY} ${end.x} ${midY + r}`,
    `L ${end.x} ${end.y}`,
  ].join(' ');
  return { d, start, end };
}

const statPositions = [
  { x: 78, y: 58, float: 4.8 },
  { x: 460, y: 72, float: 6.1 },
  { x: 92, y: 545, float: 5.2 },
];

/** Hero illustration: a live-looking Shopify → Klaviyo system map, from first order to repeat order. */
export function HeroGraph() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [30, -40]);
  const edges = heroEdges.map((e) => ({ ...e, ...route(nodeById(e.from), nodeById(e.to)) }));

  return (
    <motion.div ref={ref} style={{ y }} className="force-dark relative w-full max-w-[460px] lg:max-w-[560px]" data-testid="hero-graph">
      <motion.div
        variants={nodeContainer}
        initial="hidden"
        animate="visible"
        className="relative aspect-[540/600] w-full"
        style={{ transform: 'perspective(1300px) rotateX(10deg) rotateY(-8deg)', transformStyle: 'preserve-3d' }}
        role="img"
        aria-label={hero.graphLabel}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-[12%] z-0"
          style={{ background: 'radial-gradient(55% 45% at 50% 45%, hsl(var(--primary) / 0.16), transparent 70%)' }}
        />
        <svg viewBox={`0 0 ${VW} ${VH}`} className="absolute inset-0 h-full w-full overflow-visible" fill="none" aria-hidden="true">
          <defs>
            <linearGradient id="wf-line" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={VW} y2={VH}>
              <stop offset="0%" stopColor="hsl(0 84% 58%)" />
              <stop offset="50%" stopColor="hsl(0 92% 68%)" />
              <stop offset="100%" stopColor="hsl(350 80% 56%)" />
            </linearGradient>
            <filter id="wf-bloom" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="5" />
            </filter>
            <filter id="wf-softbloom" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="2.2" />
            </filter>
          </defs>
          {edges.map((e, i) => {
            const t = { duration: reduced ? 0 : 1, delay: reduced ? 0 : 0.35 + i * 0.12, ease: 'easeInOut' as const };
            const draw = { initial: { pathLength: 0 }, animate: { pathLength: 1 }, transition: t };
            return (
              <g key={`${e.from}-${e.to}`}>
                <motion.path d={e.d} stroke="hsl(0 84% 58%)" strokeWidth="12" strokeLinecap="round" opacity="0.18" filter="url(#wf-bloom)" {...draw} />
                <motion.path d={e.d} stroke="hsl(0 0% 3%)" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" {...draw} />
                <motion.path d={e.d} stroke="url(#wf-line)" strokeWidth="4.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.95" {...draw} />
                <motion.path d={e.d} stroke="#fff" strokeWidth="1.1" strokeLinecap="round" opacity="0.5" transform="translate(0,-1)" {...draw} />
                {!reduced && (
                  <>
                    <path d={e.d} stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeDasharray="5 26" opacity="0.35">
                      <animate attributeName="stroke-dashoffset" from="62" to="0" dur={`${e.dur * 1.6}s`} begin={`${1.4 + e.begin}s`} repeatCount="indefinite" />
                    </path>
                    <circle r="7.5" fill="hsl(0 84% 58%)" opacity="0.16" filter="url(#wf-softbloom)">
                      <animateMotion dur={`${e.dur}s`} begin={`${1.5 + e.begin}s`} repeatCount="indefinite" path={e.d} />
                    </circle>
                    <circle r="2.4" fill="#fff" opacity="0.95">
                      <animateMotion dur={`${e.dur}s`} begin={`${1.6 + e.begin}s`} repeatCount="indefinite" path={e.d} calcMode="spline" keyPoints="0;1" keyTimes="0;1" keySplines="0.45 0 0.55 1" />
                    </circle>
                  </>
                )}
                {[e.start, e.end].map((p, k) => (
                  <motion.g
                    key={k}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: reduced ? 0 : 1.3 + i * 0.12 }}
                    style={{ transformOrigin: `${p.x}px ${p.y}px` }}
                  >
                    <circle cx={p.x} cy={p.y} r="8.5" fill="hsl(350 80% 56%)" opacity="0.22" filter="url(#wf-softbloom)" />
                    <circle cx={p.x} cy={p.y} r="5.4" fill="hsl(0 0% 3%)" stroke="hsl(350 80% 56% / 0.7)" strokeWidth="0.9" />
                    <circle cx={p.x} cy={p.y} r="3.1" fill="hsl(350 80% 56%)" />
                    <circle cx={p.x - 1} cy={p.y - 1} r="1.05" fill="#fff" opacity="0.9" />
                  </motion.g>
                ))}
              </g>
            );
          })}
        </svg>

        {heroNodes.map((n, i) => {
          const Icon = getIcon(n.icon);
          return (
            <div key={n.id} className="absolute z-10 w-[30%] sm:w-[28%]" style={{ ...pct(n.x, n.y), transform: 'translate(-50%, -50%)' }}>
              <motion.div variants={nodeItem}>
                <motion.div
                  animate={reduced ? undefined : { y: [0, -3, 0] }}
                  transition={{ duration: 4.5 + (i % 4) * 0.8, repeat: Infinity, ease: 'easeInOut', delay: i * 0.35 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <NodeCard>
                    <div className="p-1.5 sm:p-2">
                      <div className="mb-0.5 flex items-center gap-1.5 sm:mb-1 sm:gap-2">
                        <span
                          className="hidden h-5 w-5 shrink-0 items-center justify-center rounded-md ring-1 min-[360px]:flex sm:h-6 sm:w-6 sm:rounded-lg"
                          style={{
                            background: 'linear-gradient(160deg, hsl(0 0% 12% / 0.95), hsl(0 0% 5% / 0.9))',
                            boxShadow: `0 0 16px hsl(${n.hue} / 0.6), 0 0 5px hsl(${n.hue} / 0.5), inset 0 1px 0 hsl(0 0% 100% / 0.15)`,
                            ['--tw-ring-color' as string]: `hsl(${n.hue} / 0.75)`,
                          }}
                        >
                          <Icon
                            className="h-3 w-3 sm:h-4 sm:w-4"
                            strokeWidth={2.4}
                            style={{ color: `hsl(${n.hue})`, filter: `drop-shadow(0 0 6px hsl(${n.hue}))` }}
                          />
                        </span>
                        <p className="font-display text-[11px] font-bold leading-tight tracking-tight text-foreground sm:text-[14px]">{n.title}</p>
                      </div>
                      <p className="mb-1 hidden whitespace-nowrap text-[9px] leading-snug tracking-tight text-foreground/80 sm:block">{n.sub}</p>
                      <span className="inline-flex items-center gap-0.5 rounded-full border border-emerald-400/25 bg-black/70 px-1 py-px sm:gap-1 sm:px-1.5 sm:py-0.5">
                        <span className="h-[3px] w-[3px] animate-pulse rounded-full bg-emerald-400 shadow-[0_0_6px_hsl(160_84%_50%/0.9)] sm:h-1 sm:w-1" />
                        <span className="font-mono text-[5.5px] font-semibold uppercase tracking-[0.14em] text-emerald-300 sm:text-[7px]">Active</span>
                      </span>
                    </div>
                  </NodeCard>
                </motion.div>
              </motion.div>
            </div>
          );
        })}

        {hero.stats.map((s, i) => {
          const p = statPositions[i];
          return (
            <div key={s.label} className="absolute z-10" style={{ ...pct(p.x, p.y), transform: 'translate(-50%, -50%)' }}>
              <motion.div variants={nodeItem}>
                <motion.div
                  animate={reduced ? undefined : { y: [0, -4, 0] }}
                  transition={{ duration: p.float, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <NodeCard>
                    <div className="px-2.5 py-2 sm:px-3.5 sm:py-2.5">
                      <div className="mb-0.5 flex items-center gap-1 sm:gap-1.5">
                        <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded bg-[hsl(0_0%_8%/0.92)] ring-1 ring-primary/70 shadow-[0_0_12px_hsl(var(--primary)/0.55)] sm:h-5 sm:w-5 sm:rounded-md">
                          <Activity className="h-2.5 w-2.5 text-primary sm:h-3 sm:w-3" aria-hidden="true" />
                        </span>
                        <span className="whitespace-nowrap font-mono text-[7.5px] font-semibold uppercase tracking-[0.16em] text-foreground/75 sm:text-[9.5px]">
                          {s.label}
                        </span>
                      </div>
                      <CountUp
                        value={s.value}
                        suffix={s.suffix}
                        className="block bg-gradient-to-br from-foreground via-foreground to-primary/90 bg-clip-text font-display text-2xl font-bold leading-none text-transparent sm:text-3xl"
                      />
                      <svg viewBox="0 0 60 12" className="mt-1 h-2.5 w-12 sm:h-3 sm:w-14" aria-hidden="true">
                        <path d="M1 9 C 10 9, 12 4, 20 6 S 32 11, 40 6 S 52 2, 59 3" stroke="hsl(var(--primary))" strokeWidth="1.6" fill="none" strokeLinecap="round" />
                      </svg>
                    </div>
                  </NodeCard>
                </motion.div>
              </motion.div>
            </div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}

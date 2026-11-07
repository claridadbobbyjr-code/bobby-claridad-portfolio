import type { ReactNode } from 'react';

/**
 * Raised "glass slab" card used by the hero graph: a tinted offset back-plate,
 * a 1px gradient rim and a dark face (reference component Y5).
 */
export function NodeCard({ children }: { children: ReactNode }) {
  return (
    <div className="group relative rounded-xl shadow-[0_0_16px_hsl(var(--primary)/0.16),0_16px_26px_hsl(var(--drop)/0.6)] transition-shadow duration-300 hover:shadow-[0_0_34px_hsl(var(--primary)/0.45),0_18px_30px_hsl(var(--drop)/0.65)]">
      <div
        aria-hidden="true"
        className="absolute inset-0 translate-x-[6px] translate-y-[7px] rounded-xl border border-hairline/5"
        style={{
          background: 'linear-gradient(135deg, hsl(var(--primary) / 0.22), hsl(0 60% 14% / 0.35))',
          boxShadow: 'inset 0 -1px 0 hsl(var(--accent) / 0.5), 0 6px 18px hsl(var(--primary) / 0.18)',
        }}
      />
      <div
        className="relative rounded-xl p-px"
        style={{
          background:
            'linear-gradient(135deg, hsl(0 0% 100% / 0.42), hsl(var(--primary) / 0.75) 28%, hsl(var(--primary) / 0.12) 62%, hsl(var(--accent) / 0.6))',
        }}
      >
        <div
          className="relative overflow-hidden rounded-[11px]"
          style={{ background: 'linear-gradient(160deg, hsl(var(--panel-2) / 0.96), hsl(var(--panel) / 0.96))' }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-1/2"
            style={{ background: 'linear-gradient(180deg, hsl(0 0% 100% / 0.06), transparent)' }}
          />
          <div className="relative">{children}</div>
        </div>
      </div>
    </div>
  );
}

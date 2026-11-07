import { motion, useReducedMotion } from 'framer-motion';
import { Filter, GitBranch, LayoutGrid, Mail, MessageSquare, Percent, Settings, ShoppingCart, Users, Zap } from 'lucide-react';
import type { ReactNode } from 'react';

type StepProps = { icon: ReactNode; kind: string; title: string; detail: string; tone?: 'trigger' | 'logic' | 'message' };

const toneRing: Record<NonNullable<StepProps['tone']>, string> = {
  trigger: 'ring-primary/60 text-primary',
  logic: 'ring-amber-400/50 text-amber-300',
  message: 'ring-emerald-400/50 text-emerald-300',
};

function Step({ icon, kind, title, detail, tone = 'logic' }: StepProps) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-hairline/[0.07] bg-[hsl(0_0%_9%)] px-3 py-2.5 shadow-[0_8px_20px_hsl(var(--drop)/0.35)]">
      <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-black/60 ring-1 ${toneRing[tone]}`}>{icon}</span>
      <div className="min-w-0">
        <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{kind}</p>
        <p className="truncate text-[12px] font-semibold text-foreground">{title}</p>
        <p className="truncate text-[10px] text-muted-foreground">{detail}</p>
      </div>
    </div>
  );
}

const reveal = (i: number, reduced: boolean | null) => ({
  initial: reduced ? false : { opacity: 0, y: 12, scale: 0.97 },
  whileInView: { opacity: 1, y: 0, scale: 1 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.45, delay: reduced ? 0 : 0.3 + i * 0.12, ease: [0.22, 1, 0.36, 1] as const },
});

function Connector({ i, reduced }: { i: number; reduced: boolean | null }) {
  return (
    <div className="relative mx-auto h-5 w-px overflow-hidden bg-border/70" aria-hidden="true">
      {!reduced && (
        <motion.span
          className="absolute left-0 top-0 h-2 w-px bg-primary shadow-[0_0_6px_hsl(var(--primary))]"
          animate={{ y: [-8, 20] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'linear', delay: i * 0.2 }}
        />
      )}
    </div>
  );
}

/**
 * An interface fragment in the style of an email-flow builder, showing the structure of the
 * buyer-aware abandoned checkout flow from the Infuse case study (discount saved for last).
 */
export function FlowMap() {
  const reduced = useReducedMotion();
  const sidebar = [LayoutGrid, Zap, Users, Mail, Settings];
  return (
    <div className="relative" data-ui>
      <div
        aria-hidden="true"
        className="absolute -inset-6 blur-3xl"
        style={{ background: 'radial-gradient(circle at 60% 40%, hsl(var(--primary)/0.25), transparent 70%)' }}
      />
      <figure
        className="force-dark relative overflow-hidden rounded-2xl border border-hairline/[0.08] bg-[hsl(0_0%_5%/0.92)] shadow-[0_30px_80px_-10px_hsl(var(--drop)/0.8),0_0_40px_hsl(var(--primary)/0.15)]"
        aria-label="Buyer-aware abandoned checkout flow: started checkout trigger, placed-order filter, a no-discount reminder email, a split on purchase history into a check-in email for returning customers or an objections email for first-time shoppers, and a 20% offer only at the end."
      >
        <div className="flex">
          <div className="hidden w-12 flex-col items-center gap-3 border-r border-hairline/[0.06] py-4 sm:flex" aria-hidden="true">
            <span className="mb-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">BC</span>
            {sidebar.map((I, i) => (
              <span key={i} className={`flex h-7 w-7 items-center justify-center rounded-lg ${i === 1 ? 'bg-primary/15 text-primary ring-1 ring-primary/40' : 'text-muted-foreground'}`}>
                <I className="h-3.5 w-3.5" />
              </span>
            ))}
          </div>
          <div className="min-w-0 flex-1 p-4 sm:p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate font-display text-sm font-bold text-foreground">Abandoned Checkout</p>
                <p className="text-[10px] text-muted-foreground">Buyer-aware · Klaviyo + Shopify</p>
              </div>
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-hairline/10 bg-black/50 px-2 py-0.5 text-[10px] text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Draft → QA → Live
              </span>
            </div>

            <motion.div {...reveal(0, reduced)}>
              <Step tone="trigger" icon={<ShoppingCart className="h-3.5 w-3.5" />} kind="Trigger" title="Started Checkout" detail="Synced from Shopify" />
            </motion.div>
            <Connector i={0} reduced={reduced} />
            <motion.div {...reveal(1, reduced)}>
              <Step icon={<Filter className="h-3.5 w-3.5" />} kind="Flow filter" title="Placed Order zero times" detail="since starting this flow" />
            </motion.div>
            <Connector i={1} reduced={reduced} />
            <motion.div {...reveal(2, reduced)}>
              <Step tone="message" icon={<Mail className="h-3.5 w-3.5" />} kind="Email 1" title="Reminder, no discount" detail="Dynamic product block" />
            </motion.div>
            <Connector i={2} reduced={reduced} />
            <motion.div {...reveal(3, reduced)}>
              <Step icon={<GitBranch className="h-3.5 w-3.5" />} kind="Conditional split" title="Placed an order before?" detail="Purchase history check" />
            </motion.div>
            <div className="relative mx-auto h-5 w-1/2 border-x border-t border-border/70" aria-hidden="true">
              <span className="absolute -left-3 top-0.5 text-[9px] font-semibold text-emerald-300">Yes</span>
              <span className="absolute -right-3 top-0.5 text-[9px] font-semibold text-muted-foreground">No</span>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <motion.div {...reveal(4, reduced)}>
                <Step tone="message" icon={<Mail className="h-3.5 w-3.5" />} kind="Returning" title="Check-in email" detail="Reorder reminder" />
              </motion.div>
              <motion.div {...reveal(5, reduced)}>
                <Step tone="message" icon={<MessageSquare className="h-3.5 w-3.5" />} kind="First-time" title="Objections email" detail="Answers before an offer" />
              </motion.div>
            </div>
            <Connector i={3} reduced={reduced} />
            <motion.div {...reveal(6, reduced)}>
              <Step tone="trigger" icon={<Percent className="h-3.5 w-3.5" />} kind="Last touch" title="20% offer, only if still no order" detail="The discount comes last" />
            </motion.div>
          </div>
        </div>
      </figure>
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 1 }}
        className="glass-card absolute -bottom-5 -left-3 flex items-center gap-2 rounded-xl px-3 py-2 sm:-left-5"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-400/10 text-emerald-300">
          <Zap className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
        <span>
          <span className="block text-[11px] font-bold text-foreground">QA before launch</span>
          <span className="block text-[9px] text-muted-foreground">Logic · links · rendering · timing</span>
        </span>
      </motion.div>
    </div>
  );
}

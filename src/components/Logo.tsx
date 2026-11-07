/** Wordmark: a linked-nodes glyph plus the name, echoing the reference mark in Bobby's own form. */
export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-2">
      <svg viewBox="0 0 40 20" className={compact ? 'h-3.5 w-7' : 'h-4 w-8'} aria-hidden="true">
        <circle cx="8" cy="10" r="5" fill="none" stroke="hsl(var(--primary))" strokeWidth="2.6" />
        <path d="M13 10h9" stroke="hsl(var(--primary))" strokeWidth="2.6" />
        <circle cx="29" cy="10" r="6" fill="hsl(var(--primary))" />
        <circle cx="27.6" cy="8.6" r="1.6" fill="#fff" opacity=".85" />
      </svg>
      <span className={`font-display font-bold tracking-tight text-foreground ${compact ? 'text-sm' : 'text-lg sm:text-xl'}`}>
        Bobby<span className="text-primary">.</span>
      </span>
    </span>
  );
}

import { Check, Copy, Mail } from 'lucide-react';
import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { emailCompose, profile } from '../content/site';

/** Copy text to the clipboard; resolves false when the API is unavailable or denied. */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (!navigator.clipboard?.writeText) return false;
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

const GmailIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
    <path fill="#4285F4" d="M2 6.5V18a1.5 1.5 0 0 0 1.5 1.5H6V10l-4-3.5Z" />
    <path fill="#34A853" d="M18 19.5h2.5A1.5 1.5 0 0 0 22 18V6.5L18 10v9.5Z" />
    <path fill="#FBBC04" d="M18 5.5V10l4-3.5V5.6c0-1.6-1.8-2.5-3-1.5l-1 .9Z" />
    <path fill="#EA4335" d="M6 10V5.5l6 4.7 6-4.7V10l-6 4.7L6 10Z" />
    <path fill="#C5221F" d="M2 5.6v.9L6 10V5.5l-1-.9c-1.2-1-3-.1-3 1Z" />
  </svg>
);
const OutlookIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
    <rect x="8" y="4" width="14" height="16" rx="2" fill="#0F78D4" />
    <path d="M8 9l7 4.5L22 9" stroke="#fff" strokeOpacity=".7" strokeWidth="1.2" fill="none" />
    <rect x="2" y="7" width="11" height="10" rx="1.5" fill="#0364B8" />
    <ellipse cx="7.5" cy="12" rx="2.4" ry="2.9" fill="none" stroke="#fff" strokeWidth="1.5" />
  </svg>
);
const icons: Record<string, ReactNode> = { gmail: <GmailIcon />, outlook: <OutlookIcon />, app: <Mail className="h-4 w-4" aria-hidden="true" /> };

/**
 * Email button that opens a small list: write in Gmail, Outlook or the visitor's mail app (each opens a
 * new message to Bobby with the subject and brief filled in), or copy the address.
 */
export function EmailMenu({
  className,
  children,
  label = `Email ${profile.email}`,
  placement = 'below',
  align = 'start',
}: {
  className: string;
  children: ReactNode;
  label?: string;
  placement?: 'below' | 'above';
  /** 'center' keeps the list on screen when the trigger sits near a page edge (footer). */
  align?: 'start' | 'center';
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        button.current?.focus();
      }
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    wrap.current?.querySelector<HTMLElement>('[data-email-option]')?.focus();
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(false), 2500);
    return () => window.clearTimeout(t);
  }, [copied]);

  const item =
    'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-foreground transition-colors hover:bg-primary/10 focus-visible:bg-primary/10 focus-visible:outline-none';

  return (
    <div ref={wrap} className="relative min-w-0">
      <button
        ref={button}
        type="button"
        aria-label={label}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
        className={className}
      >
        {children}
      </button>
      {open && (
        <div
          id={panelId}
          role="group"
          aria-label="Write an email with"
          className={`absolute z-30 ${align === 'center' ? 'left-1/2 -translate-x-1/2' : 'left-0'} w-60 max-w-[calc(100vw-2rem)] rounded-xl border border-border bg-card p-1.5 text-left shadow-2xl shadow-black/40 ${
            placement === 'above' ? 'bottom-full mb-2' : 'top-full mt-2'
          }`}
          data-testid="email-menu"
        >
          <p className="px-3 pb-1 pt-1.5 font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground">Write with</p>
          {emailCompose.map((o) => (
            <a
              key={o.id}
              href={o.href}
              data-email-option
              {...(o.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              onClick={() => setOpen(false)}
              className={item}
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">{icons[o.id]}</span>
              {o.label}
            </a>
          ))}
          <div className="my-1 h-px bg-border" />
          <button
            type="button"
            data-email-option
            onClick={async () => setCopied(await copyText(profile.email))}
            className={item}
            aria-label={`Copy email address ${profile.email}`}
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-secondary text-muted-foreground">
              {copied ? <Check className="h-4 w-4 text-success" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
            </span>
            <span className="min-w-0 truncate">{copied ? 'Copied!' : profile.email}</span>
          </button>
          <p className="sr-only" role="status" aria-live="polite">
            {copied ? 'Email address copied to clipboard' : ''}
          </p>
        </div>
      )}
    </div>
  );
}

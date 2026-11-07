import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, CalendarDays, Check, Mail, MessageCircle, MessagesSquare, Phone } from 'lucide-react';
import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { SectionHeader } from '../components/SectionHeader';
import { EmailMenu, copyText } from '../components/EmailMenu';
import { bookingLink, contact as c, profile } from '../content/site';

export { copyText };

type CopyState = 'idle' | 'copied' | 'failed';

/** Copy-to-clipboard with a status that resets itself after a moment. */
function useCopy(): [CopyState, (text: string) => Promise<boolean>] {
  const [state, setState] = useState<CopyState>('idle');
  useEffect(() => {
    if (state === 'idle') return;
    const t = window.setTimeout(() => setState('idle'), 2500);
    return () => window.clearTimeout(t);
  }, [state]);
  const copy = useCallback(async (text: string) => {
    const ok = await copyText(text);
    setState(ok ? 'copied' : 'failed');
    return ok;
  }, []);
  return [state, copy];
}

const tileClass =
  'group flex min-w-0 items-center gap-3 rounded-xl border border-border bg-secondary/70 px-3.5 py-3 text-left transition-colors hover:border-primary/50 sm:px-4 sm:py-3.5';

function TileBody({ icon, iconClass, label, value }: { icon: ReactNode; iconClass: string; label: string; value: ReactNode }) {
  return (
    <>
      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg sm:h-10 sm:w-10 ${iconClass}`}>{icon}</span>
      <span className="min-w-0">
        <span className="block font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground">{label}</span>
        <span className="block truncate text-[13px] font-semibold text-foreground sm:text-sm">{value}</span>
      </span>
    </>
  );
}

export function Contact() {
  const reduced = useReducedMotion();
  const [discordCopy, copyDiscord] = useCopy();

  const status =
    discordCopy === 'copied' ? 'Discord username copied to clipboard' : discordCopy === 'failed' ? `Copy failed. Discord username: ${profile.discord}` : '';

  const icon = 'h-[18px] w-[18px]';

  return (
    <section id="contact" aria-labelledby="contact-title" className="section-padding relative">
      <div className="container-tight relative z-10 mx-auto max-w-3xl">
        <SectionHeader id="contact-title" label={c.label} title={c.title} accent={c.accent} sub={c.sub} className="mb-8 md:mb-10" />
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto flex w-full max-w-lg flex-col items-stretch gap-3"
          data-testid="contact-actions"
        >
          <motion.a
            {...bookingLink}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            aria-label={`${c.bookCta} (opens Calendly in a new tab)`}
            className="btn-sheen glow-pulse flex w-full items-center gap-3 rounded-2xl px-5 py-4 text-left text-primary-foreground sm:gap-4 sm:px-6 sm:py-5"
            style={{ background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%)' }}
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15 sm:h-12 sm:w-12">
              <CalendarDays className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-display text-base font-bold sm:text-lg">{c.bookCta}</span>
              <span className="block text-xs text-primary-foreground/80 sm:text-sm">{c.bookNote}</span>
            </span>
            <ArrowUpRight className="h-5 w-5 shrink-0" aria-hidden="true" />
          </motion.a>

          <div className="grid grid-cols-1 gap-2.5 min-[480px]:grid-cols-2 sm:gap-3">
            <a
              href={profile.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`WhatsApp ${profile.whatsapp} (opens in a new tab)`}
              className={tileClass}
            >
              <TileBody icon={<MessageCircle className={icon} aria-hidden="true" />} iconClass="bg-[#25D366]/15 text-[#1fb855]" label="WhatsApp" value={profile.whatsapp} />
            </a>
            <button type="button" onClick={() => copyDiscord(profile.discord)} aria-label={`Copy Discord username ${profile.discord}`} className={tileClass}>
              <TileBody
                icon={discordCopy === 'copied' ? <Check className={`${icon} text-success`} aria-hidden="true" /> : <MessagesSquare className={icon} aria-hidden="true" />}
                iconClass="bg-[#5865F2]/15 text-[#7983f5]"
                label="Discord"
                value={discordCopy === 'copied' ? 'Username copied!' : profile.discord}
              />
            </button>
            <EmailMenu className={`${tileClass} w-full`} label={`Email me at ${profile.email}`}>
              <TileBody icon={<Mail className={icon} aria-hidden="true" />} iconClass="bg-primary/10 text-primary" label="Email" value="Write me an email" />
            </EmailMenu>
            <a href={profile.phoneHref} aria-label={`Call ${profile.phone}`} className={tileClass}>
              <TileBody icon={<Phone className={icon} aria-hidden="true" />} iconClass="bg-primary/10 text-primary" label="Call" value={profile.phone} />
            </a>
          </div>

          <p className="sr-only" role="status" aria-live="polite">
            {status}
          </p>
        </motion.div>
        <p className="mt-6 text-center text-xs text-muted-foreground sm:text-sm">{c.note}</p>
      </div>
    </section>
  );
}

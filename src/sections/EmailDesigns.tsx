import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState, type FocusEvent, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { createPortal } from 'react-dom';
import { SectionHeader } from '../components/SectionHeader';
import { emailDesigns as c, type EmailDesign } from '../content/site';
import { EASE_OUT_EXPO } from '../lib/motion';

/** Seconds for the open panel to pan from the top of the email to the bottom: longer emails pan for longer. */
const panSeconds = (e: EmailDesign) => Math.round(Math.min(26, Math.max(14, (e.height / e.width) * 2.1)));

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * One panel of the expanding gallery. Collapsed: a slim slice of the design with its title running
 * vertically. Open: wide, the email pans slowly from top to bottom, and a click opens the reader.
 */
function Panel({ email, index, active, onActivate, onOpen }: { email: EmailDesign; index: number; active: boolean; onActivate: () => void; onOpen: () => void }) {
  const [fullReady, setFullReady] = useState(false);

  // Keyboard focus previews a panel; mouse focus is left to hover and click so a click never opens two things at once.
  const onFocus = (e: FocusEvent<HTMLButtonElement>) => {
    let keyboard = false;
    try {
      keyboard = e.currentTarget.matches(':focus-visible');
    } catch {
      keyboard = false;
    }
    if (keyboard) onActivate();
  };

  return (
    <li
      className="relative min-h-0 min-w-0 basis-0 transition-[flex-grow] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
      style={{ flexGrow: active ? 7 : 1 }}
      data-active={active ? 'true' : 'false'}
    >
      <button
        type="button"
        onClick={() => (active ? onOpen() : onActivate())}
        onPointerEnter={(e) => e.pointerType === 'mouse' && onActivate()}
        onFocus={onFocus}
        aria-label={active ? `Read the full email: ${email.title}` : `Show email ${index + 1}: ${email.title}`}
        aria-expanded={active}
        className={`group absolute inset-0 overflow-hidden rounded-[1.35rem] border text-left shadow-[0_24px_60px_-30px_hsl(var(--drop)/0.75)] transition-[border-color,box-shadow] duration-500 ${
          active ? 'border-primary/40 shadow-[0_30px_80px_-30px_hsl(var(--drop)/0.8),0_0_40px_hsl(var(--primary)/0.16)]' : 'border-border/60'
        }`}
      >
        <img
          src={email.thumb}
          alt=""
          width={640}
          height={Math.round(email.height * (640 / email.width))}
          loading="lazy"
          decoding="async"
          className={`absolute inset-0 h-full w-full object-cover transition-[filter,transform] duration-700 ${active ? 'object-top' : 'scale-105 object-[50%_30%] brightness-[0.55] saturate-[0.85] group-hover:brightness-75 lg:object-top'}`}
        />
        {active && (
          <img
            src={email.src}
            alt=""
            width={email.width}
            height={email.height}
            decoding="async"
            onLoad={() => setFullReady(true)}
            style={{ ['--pan' as string]: `${panSeconds(email)}s` }}
            className={`email-pan absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-500 ${fullReady ? 'opacity-100' : 'opacity-0'}`}
          />
        )}

        {/* collapsed: index + title, vertical on desktop, horizontal on phones */}
        <span
          className={`pointer-events-none absolute inset-0 flex items-center gap-3 bg-gradient-to-r from-black/90 via-black/70 to-black/35 px-4 lg:via-black/40 lg:to-transparent text-white transition-opacity duration-300 lg:flex-col-reverse lg:items-start lg:justify-start lg:bg-gradient-to-t lg:px-0 lg:pb-6 lg:pl-[calc(50%-0.7rem)] ${
            active ? 'opacity-0' : 'opacity-100 delay-200'
          }`}
          aria-hidden="true"
        >
          <span className="font-mono text-[11px] text-white/60">{pad(index + 1)}</span>
          <span className="truncate whitespace-nowrap font-display text-[15px] font-bold tracking-tight lg:rotate-180 lg:text-lg lg:[writing-mode:vertical-rl]">
            {email.title}
          </span>
        </span>

        {/* open: details over the bottom of the design */}
        <span
          className={`pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-3 bg-gradient-to-t from-black/90 via-black/55 to-transparent p-5 pt-24 text-white transition-[opacity,transform] duration-500 sm:p-7 sm:pt-28 ${
            active ? 'translate-y-0 opacity-100 delay-300' : 'translate-y-4 opacity-0'
          }`}
          aria-hidden="true"
        >
          <span className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-white/70">
            {pad(index + 1)} · {email.type}
          </span>
          <span className="font-display text-2xl font-bold leading-tight sm:text-3xl">{email.title}</span>
          <span className="hidden max-w-md text-sm leading-relaxed text-white/80 sm:block">{email.desc}</span>
          <span className="mt-1 inline-flex w-fit items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition-colors group-hover:bg-primary group-hover:text-white">
            Read full email <ArrowUpRight className="h-4 w-4" />
          </span>
        </span>
      </button>
    </li>
  );
}

/** Full-length reader: a modal dialog with its own scroll area (Lenis is paused while it is open). */
function EmailViewer({ list, index, onClose, onIndex }: { list: EmailDesign[]; index: number; onClose: () => void; onIndex: (i: number) => void }) {
  const reduced = useReducedMotion();
  const email = list[index];
  const dialog = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const step = useCallback((d: number) => onIndex((index + d + list.length) % list.length), [index, list.length, onIndex]);

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const root = document.documentElement;
    const prevOverflow = root.style.overflow;
    root.style.overflow = 'hidden';
    window.__lenis?.stop();
    closeBtn.current?.focus();
    return () => {
      root.style.overflow = prevOverflow;
      window.__lenis?.start();
      opener?.focus?.();
    };
  }, []);

  useEffect(() => {
    setLoaded(false);
    setProgress(0);
    if (scroller.current) scroller.current.scrollTop = 0;
  }, [email.id]);

  const onKeyDown = (e: ReactKeyboardEvent) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      onClose();
    } else if (e.key === 'ArrowRight') step(1);
    else if (e.key === 'ArrowLeft') step(-1);
    else if (e.key === 'Tab') {
      // keep focus inside the dialog
      const f = Array.from(dialog.current?.querySelectorAll<HTMLElement>('button, [href], [tabindex]:not([tabindex="-1"])') ?? []);
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  const navBtn = 'flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition-colors hover:border-primary hover:bg-primary';

  return createPortal(
    <motion.div
      className="force-dark fixed inset-0 z-[100] flex items-stretch justify-center bg-black/85 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
    >
      <motion.div
        ref={dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="email-viewer-title"
        aria-describedby="email-viewer-desc"
        data-testid="email-viewer"
        onKeyDown={onKeyDown}
        onClick={(e) => e.stopPropagation()}
        initial={reduced ? { opacity: 0 } : { opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={reduced ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.98 }}
        transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
        className="flex w-full max-w-6xl flex-col gap-0 text-foreground lg:flex-row lg:justify-center lg:gap-10 lg:p-6"
      >
        {/* Details: top bar on phones, side panel on desktop */}
        <div className="flex shrink-0 items-start gap-3 border-b border-white/10 bg-black/60 px-4 py-3 lg:order-2 lg:w-80 lg:flex-col lg:border-0 lg:bg-transparent lg:px-0 lg:py-2">
          <div className="min-w-0 flex-1">
            <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-primary">
              {email.type}
            </p>
            <h3 id="email-viewer-title" className="mt-1 truncate font-display text-base font-bold lg:whitespace-normal lg:text-2xl">
              {email.title}
            </h3>
            <p id="email-viewer-desc" className="mt-3 hidden text-sm leading-relaxed text-muted-foreground lg:block">
              {email.desc}
            </p>
            <p className="mt-5 hidden font-mono text-[11px] text-muted-foreground lg:block">
              {String(index + 1).padStart(2, '0')} / {String(list.length).padStart(2, '0')} · {Math.round(progress * 100)}% read
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2 lg:order-first lg:mb-6 lg:w-full lg:justify-between">
            <span className="hidden gap-2 lg:flex">
              <button type="button" onClick={() => step(-1)} aria-label="Previous email" className={navBtn}>
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              <button type="button" onClick={() => step(1)} aria-label="Next email" className={navBtn}>
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </span>
            <button ref={closeBtn} type="button" onClick={onClose} aria-label="Close email viewer" className={navBtn}>
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* The email itself */}
        <div className="relative min-h-0 flex-1 lg:order-1 lg:max-w-[600px]">
          <div className="absolute inset-x-0 top-0 z-10 h-0.5 bg-white/10 lg:rounded-t-2xl" aria-hidden="true">
            <div className="h-full bg-gradient-to-r from-primary to-accent" style={{ width: `${progress * 100}%` }} />
          </div>
          <div
            ref={scroller}
            data-lenis-prevent
            tabIndex={0}
            aria-label={`${email.title}, full email`}
            onScroll={(e) => {
              const el = e.currentTarget;
              setProgress(el.scrollHeight > el.clientHeight ? el.scrollTop / (el.scrollHeight - el.clientHeight) : 1);
            }}
            className="h-full overflow-y-auto overscroll-contain bg-[hsl(0_0%_8%)] lg:rounded-2xl lg:border lg:border-white/10"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.img
                key={email.id}
                src={email.src}
                alt={`${email.title}: full email design. ${email.desc}`}
                width={email.width}
                height={email.height}
                onLoad={() => setLoaded(true)}
                initial={{ opacity: 0 }}
                animate={{ opacity: loaded ? 1 : 0.35 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="mx-auto block h-auto w-full max-w-[600px]"
              />
            </AnimatePresence>
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center gap-3 pb-4 lg:hidden">
            <button type="button" onClick={() => step(-1)} aria-label="Previous email" className={`${navBtn} pointer-events-auto bg-black/70`}>
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button type="button" onClick={() => step(1)} aria-label="Next email" className={`${navBtn} pointer-events-auto bg-black/70`}>
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>,
    document.body,
  );
}

/**
 * Email design gallery: an expanding row of panels (a stack on phones). Hover or tap a panel to open it;
 * click the open panel to read the email in full.
 */
export function EmailDesigns() {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="emails" aria-labelledby="emails-title" className="section-padding relative">
      <div className="container-wide relative z-10">
        <SectionHeader id="emails-title" label={c.label} title={c.title} accent={c.accent} sub={c.sub} className="mb-8 md:mb-12" />

        <motion.ul
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
          className="flex h-[740px] flex-col gap-2 sm:h-[780px] lg:h-[600px] lg:flex-row lg:gap-3"
          data-testid="email-grid"
        >
          {c.items.map((email, i) => (
            <Panel key={email.id} email={email} index={i} active={i === active} onActivate={() => setActive(i)} onOpen={() => setOpen(i)} />
          ))}
        </motion.ul>
      </div>

      <AnimatePresence>
        {open !== null && (
          <EmailViewer
            list={c.items}
            index={open}
            onIndex={(i) => {
              setOpen(i);
              setActive(i);
            }}
            onClose={() => setOpen(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

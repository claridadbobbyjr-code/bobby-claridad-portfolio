import { AnimatePresence, motion } from 'framer-motion';
import { CalendarDays, Menu, Send, X } from 'lucide-react';
import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { bookingLink, navItems } from '../content/site';
import { useActiveSection } from '../hooks/useActiveSection';
import { navSpring } from '../lib/motion';
import { scrollToId } from '../lib/scroll';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';

/** 'home' is tracked so no link is highlighted while the hero is on screen. */
const sectionIds = ['home', ...navItems.map((n) => n.id)];

function HireButton({ compact = false }: { compact?: boolean }) {
  return (
    <motion.a
      {...bookingLink}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`btn-sheen glow-pulse inline-flex items-center gap-1.5 whitespace-nowrap rounded-full font-semibold text-primary-foreground ${
        compact ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm'
      }`}
      style={{ background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%)' }}
    >
      <span className="flex items-center gap-1.5">
        <Send className={compact ? 'h-3 w-3' : 'h-4 w-4'} aria-hidden="true" />
        Hire Me
      </span>
    </motion.a>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const active = useActiveSection(sectionIds);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Not sticky: the bar slides away while scrolling down and comes back on any scroll up.
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 20);
      if (y < 80) setHidden(false);
      else if (Math.abs(y - lastY) > 6) setHidden(y > lastY);
      if (Math.abs(y - lastY) > 6 || y < 80) lastY = y;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    const onResize = () => window.innerWidth >= 1024 && setOpen(false);
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, [open]);

  const go = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setOpen(false);
    scrollToId(id);
  };

  const linkClass = (isActive: boolean) =>
    `relative rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-300 ${
      isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
    }`;

  const Underline = () => (
    <motion.span
      layoutId="nav-underline"
      className="absolute -bottom-0.5 left-2 right-2 h-0.5 rounded-full bg-gradient-to-r from-primary to-accent"
      transition={navSpring}
    />
  );

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: hidden && !open ? '-120%' : 0 }}
      transition={{ duration: hidden ? 0.35 : 0.45, ease: [0.22, 1, 0.36, 1] }}
      onFocusCapture={() => setHidden(false)}
      data-hidden={hidden && !open ? 'true' : 'false'}
      className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5"
    >
      <nav
        aria-label="Primary"
        className={`container-wide rounded-2xl border backdrop-blur-xl transition-[background-color,border-color,box-shadow] duration-300 ${
          scrolled || open
            ? 'border-border/60 bg-background/70 shadow-[0_8px_40px_hsl(var(--drop)/0.4)]'
            : 'border-hairline/5 bg-background/30'
        }`}
      >
        <div className="flex h-16 items-center justify-between px-4 md:px-6">
          <motion.a
            href="#home"
            onClick={(e) => go(e, 'home')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-shrink-0 rounded-lg transition-[filter] duration-300 hover:drop-shadow-[0_0_12px_hsl(var(--primary)/0.6)]"
            aria-label="Bobby Claridad — back to top"
          >
            <Logo />
          </motion.a>

          <div className="hidden items-center gap-3 lg:flex">
            <ul className="flex items-center gap-0.5">
              {navItems.map((item) => {
                const isActive = active === item.id;
                return (
                  <li key={item.id}>
                    <motion.a
                      href={`#${item.id}`}
                      onClick={(e) => go(e, item.id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={linkClass(isActive)}
                      aria-current={isActive ? 'true' : undefined}
                    >
                      {item.label}
                      {isActive && <Underline />}
                    </motion.a>
                  </li>
                );
              })}
            </ul>
            <span className="h-6 w-px bg-border/50" aria-hidden="true" />
            <ThemeToggle />
            <HireButton />
          </div>

          <div className="flex items-center gap-1.5 lg:hidden">
            <ThemeToggle />
            <HireButton compact />
            <button
              ref={toggleRef}
              type="button"
              onClick={() => setOpen((o) => !o)}
              className="rounded-lg p-2 text-foreground transition-colors hover:bg-secondary/60"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="max-h-[calc(100dvh-6rem)] overflow-y-auto border-t border-border/60 px-2 pb-3 lg:hidden"
            >
              <ul className="flex flex-col py-2">
                {navItems.map((item) => {
                  const isActive = active === item.id;
                  return (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        onClick={(e) => go(e, item.id)}
                        className={`block rounded-lg px-4 py-2.5 text-sm transition-colors ${
                          isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
                        }`}
                        aria-current={isActive ? 'true' : undefined}
                      >
                        {item.label}
                      </a>
                    </li>
                  );
                })}
                <li>
                  <a
                    {...bookingLink}
                    className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-primary hover:bg-primary/10"
                  >
                    <CalendarDays className="h-4 w-4" aria-hidden="true" /> Book a 30-min call
                  </a>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
}

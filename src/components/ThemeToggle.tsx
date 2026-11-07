import { AnimatePresence, motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

/** Day / night switch. The icon shows the mode you get by pressing it. */
export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const toDay = theme === 'dark';
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={toDay ? 'Switch to day mode' : 'Switch to night mode'}
      title={toDay ? 'Day mode' : 'Night mode'}
      data-testid="theme-toggle"
      className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-border/70 text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ y: 14, rotate: -60, opacity: 0 }}
          animate={{ y: 0, rotate: 0, opacity: 1 }}
          exit={{ y: -14, rotate: 60, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="flex"
        >
          {toDay ? <Sun className="h-4 w-4" aria-hidden="true" /> : <Moon className="h-4 w-4" aria-hidden="true" />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

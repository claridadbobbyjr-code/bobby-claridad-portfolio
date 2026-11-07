import { useCallback, useEffect, useState } from 'react';

export type Theme = 'dark' | 'light';

export const THEME_KEY = 'theme';
const THEME_COLOR: Record<Theme, string> = { dark: '#000000', light: '#fafafa' };

/** The theme index.html applied before first paint (night by default). */
export function currentTheme(): Theme {
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
}

export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === 'light') root.dataset.theme = 'light';
  else delete root.dataset.theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLOR[theme]);
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // Private mode or blocked storage: the toggle still works for this visit.
  }
}

/** Day/night toggle state shared by every toggle on the page (kept in sync through an event). */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(currentTheme);

  useEffect(() => {
    const sync = () => setTheme(currentTheme());
    window.addEventListener('themechange', sync);
    return () => window.removeEventListener('themechange', sync);
  }, []);

  const toggle = useCallback(() => {
    applyTheme(currentTheme() === 'light' ? 'dark' : 'light');
    window.dispatchEvent(new Event('themechange'));
  }, []);

  return { theme, toggle };
}

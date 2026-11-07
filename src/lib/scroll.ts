import type Lenis from 'lenis';

declare global {
  interface Window { __lenis?: Lenis }
}

/** Smoothly scroll to a section by id, offset for the fixed nav. Falls back to native scrolling. */
export function scrollToId(id: string, offset = -90): void {
  const el = document.getElementById(id);
  if (!el) return;
  const lenis = window.__lenis;
  if (lenis) {
    lenis.scrollTo(el, { offset });
  } else {
    const top = el.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }
  if (history.replaceState) history.replaceState(null, '', id === 'home' ? '#' : `#${id}`);
  // Move focus for keyboard / screen-reader users without a second scroll jump.
  el.setAttribute('tabindex', '-1');
  el.focus({ preventScroll: true });
}

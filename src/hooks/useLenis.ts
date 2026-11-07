import { useEffect } from 'react';
import Lenis from 'lenis';

/** Smooth inertial scrolling like the reference. Disabled for reduced motion and touch devices. */
export function useLenis(enabled: boolean): void {
  useEffect(() => {
    if (!enabled) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    window.__lenis = lenis;
    let raf = 0;
    const loop = (t: number) => { lenis.raf(t); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      delete window.__lenis;
    };
  }, [enabled]);
}

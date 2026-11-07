import { useEffect, useState } from 'react';

/**
 * Returns the id of the section currently in view: the last section whose top
 * is above 35% of the viewport (same rule as the reference). At the very
 * bottom of the page the last id wins.
 */
export function useActiveSection(ids: string[]): string {
  const [active, setActive] = useState(ids[0]);
  const key = ids.join('|');
  useEffect(() => {
    const list = key.split('|');
    let raf = 0;
    const compute = () => {
      raf = 0;
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 2) {
        setActive(list[list.length - 1]);
        return;
      }
      const probe = window.innerHeight * 0.35;
      let current = list[0];
      for (const id of list) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= probe) current = id;
      }
      setActive(current);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(compute); };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    compute();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [key]);
  return active;
}

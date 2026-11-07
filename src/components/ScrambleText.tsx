import { useInView, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const GLYPHS = '!<>-_/[]{}=+*^?#ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

/**
 * Section label that decodes from random glyphs into its text when scrolled into view
 * (reference: 32ms ticks over max(len*2, 16) frames). Width is reserved by an invisible
 * copy so nothing shifts. Assistive tech reads the final text via the sr-only copy.
 */
export function ScrambleText({ text, className = '' }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState<string | null>(null);

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setDisplay(text);
      return;
    }
    const frames = Math.max(text.length * 2, 16);
    let tick = 0;
    const id = window.setInterval(() => {
      tick += 1;
      const revealed = Math.floor((tick / frames) * text.length);
      let out = '';
      for (let i = 0; i < text.length; i++) {
        out += i < revealed || text[i] === ' ' ? text[i] : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
      if (tick >= frames) {
        setDisplay(text);
        window.clearInterval(id);
      } else setDisplay(out);
    }, 32);
    return () => window.clearInterval(id);
  }, [inView, reduced, text]);

  return (
    <span ref={ref} className={`relative inline-block ${className}`}>
      <span className="sr-only">{text}</span>
      <span className="invisible whitespace-pre" aria-hidden="true">{text}</span>
      <span className="absolute inset-0 whitespace-pre" aria-hidden="true" data-testid="scramble-display">
        {display ?? ' '}
      </span>
    </span>
  );
}

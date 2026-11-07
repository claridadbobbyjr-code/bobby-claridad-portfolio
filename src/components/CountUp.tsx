import { useInView, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const format = (n: number, decimals: number) =>
  n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

/** Counts from 0 to `value` with cubic ease-out once visible (reference: 1.6s). */
export function CountUp({
  value,
  prefix = '',
  suffix = '',
  decimals = 0,
  duration = 1.6,
  className = '',
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const reduced = useReducedMotion();
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setN(value);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const factor = 10 ** decimals;
    const step = (now: number) => {
      const t = Math.min((now - start) / (duration * 1000), 1);
      setN(Math.round(value * (1 - Math.pow(1 - t, 3)) * factor) / factor);
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduced, value, duration, decimals]);

  const final = `${prefix}${format(value, decimals)}${suffix}`;
  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{final}</span>
      <span aria-hidden="true">
        {prefix}
        {format(n, decimals)}
        {suffix}
      </span>
    </span>
  );
}

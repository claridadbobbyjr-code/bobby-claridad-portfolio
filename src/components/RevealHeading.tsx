import { motion, useReducedMotion } from 'framer-motion';
import { headingContainer, headingWord } from '../lib/motion';

type Props = {
  lead: string;
  accent?: string;
  trail?: string;
  className?: string;
  as?: 'h2' | 'h3';
  id?: string;
};

/**
 * Heading whose words rise out of a clipping mask one after another
 * (reference: y 115% -> 0, 0.55s expo-out, 55ms stagger). Accent words get the
 * aurora gradient. Renders a plain heading for reduced motion.
 */
export function RevealHeading({ lead, accent, trail, className = '', as = 'h2', id }: Props) {
  const reduced = useReducedMotion();
  const Tag = as;
  const label = `${lead}${accent ?? ''}${trail ?? ''}`.replace(/\s+/g, ' ').trim();

  if (reduced) {
    return (
      <Tag id={id} className={className}>
        {lead}
        {accent && <span className="text-gradient">{accent}</span>}
        {trail}
      </Tag>
    );
  }

  const MotionTag = as === 'h2' ? motion.h2 : motion.h3;
  const parts: { word: string; accent: boolean }[] = [];
  const push = (s: string | undefined, isAccent: boolean) =>
    s?.split(/\s+/).filter(Boolean).forEach((word) => parts.push({ word, accent: isAccent }));
  push(lead, false);
  push(accent, true);
  push(trail, false);

  return (
    <MotionTag
      id={id}
      className={className}
      variants={headingContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
    >
      <span className="sr-only">{label}</span>
      {parts.map((p, i) => (
        <span key={i} aria-hidden="true">
          <span className="-mb-[0.12em] inline-block overflow-hidden pb-[0.12em] align-bottom">
            <motion.span variants={headingWord} className={`inline-block ${p.accent ? 'text-gradient' : ''}`}>
              {p.word}
            </motion.span>
          </span>
          {i < parts.length - 1 ? ' ' : ''}
        </span>
      ))}
    </MotionTag>
  );
}

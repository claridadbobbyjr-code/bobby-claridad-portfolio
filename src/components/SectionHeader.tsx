import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { fadeUp } from '../lib/motion';
import { RevealHeading } from './RevealHeading';
import { ScrambleText } from './ScrambleText';

type Props = {
  label: string;
  title: string;
  accent?: string;
  trail?: string;
  sub?: ReactNode;
  id?: string;
  children?: ReactNode;
  className?: string;
};

/** Centered "// label" + word-reveal heading + supporting line, as used by every reference section. */
export function SectionHeader({ label, title, accent, trail, sub, id, children, className = 'mb-12 md:mb-16' }: Props) {
  return (
    <motion.div {...fadeUp} className={`text-center ${className}`}>
      <ScrambleText text={label} className="section-label" />
      <RevealHeading id={id} lead={title} accent={accent} trail={trail} className="section-title mb-4 mt-3" />
      {sub && <p className="section-sub">{sub}</p>}
      {children}
    </motion.div>
  );
}

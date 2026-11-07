import { motion } from 'framer-motion';
import { getIcon } from '../lib/icons';

/** Icon + title + text card with gradient rim, lift on hover and an icon wiggle (reference: glow-panel cards). */
export function FeatureCard({ icon, title, desc, className = '' }: { icon: string; title: string; desc: string; className?: string }) {
  const Icon = getIcon(icon);
  return (
    <motion.article whileHover={{ y: -6 }} className={`glow-panel card-hover group h-full p-5 md:p-6 ${className}`}>
      <motion.div
        className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20"
        whileHover={{ rotate: [0, -8, 8, 0], scale: 1.08 }}
        transition={{ duration: 0.4 }}
      >
        <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
      </motion.div>
      <h3 className="mb-2 font-display text-lg font-semibold transition-colors group-hover:text-primary">{title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">{desc}</p>
    </motion.article>
  );
}

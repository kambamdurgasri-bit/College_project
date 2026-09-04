import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';

export default function StatsCard({ label, value, icon, tint, index = 0 }) {
  const Icon = Icons[icon] || Icons.Circle;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05 * index, ease: 'easeOut' }}
      whileHover={{ y: -4 }}
      className="rounded-card border border-borderPurple dark:border-dark-border bg-white dark:bg-dark-card p-5 shadow-soft dark:shadow-softDark hover:shadow-softHover dark:hover:shadow-softHoverDark transition-shadow duration-300"
    >
      <div
        className="flex h-10 w-10 items-center justify-center rounded-xl mb-3"
        style={{ backgroundColor: `${tint}1A`, color: tint }}
      >
        <Icon size={18} strokeWidth={2.2} />
      </div>
      <p className="font-heading text-xl font-bold text-textPrimary dark:text-dark-text">{value}</p>
      <p className="text-xs text-textSecondary dark:text-dark-textMuted mt-1">{label}</p>
    </motion.div>
  );
}

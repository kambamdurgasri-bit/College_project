import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import SectionTitle from '../profile-ui/SectionTitle';

export default function TimelineCard({ items }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="rounded-card border border-borderPurple dark:border-dark-border bg-white dark:bg-dark-card p-6 shadow-soft dark:shadow-softDark"
    >
      <SectionTitle title="Recent Activity" subtitle="Updates, quiz attempts & logins" />

      <div className="relative pl-2">
        <div className="absolute left-[19px] top-1 bottom-1 w-px bg-borderPurple dark:bg-dark-border" />
        <div className="space-y-5">
          {items.map((item, i) => {
            const Icon = Icons[item.icon] || Icons.Circle;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: 0.05 * i }}
                className="relative flex items-start gap-4"
              >
                <div className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-lightPurple dark:bg-dark-surface text-primary dark:text-dark-accent ring-4 ring-white dark:ring-dark-card">
                  <Icon size={15} strokeWidth={2.2} />
                </div>
                <div className="pt-1">
                  <p className="text-sm font-medium text-textPrimary dark:text-dark-text">{item.title}</p>
                  <p className="text-xs text-textSecondary dark:text-dark-textMuted mt-0.5">{item.time}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

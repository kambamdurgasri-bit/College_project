import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { GraduationCap, Flag } from 'lucide-react';
import SectionTitle from '../profile-ui/SectionTitle';

export default function AchievementCard({ data }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-card border border-borderPurple dark:border-dark-border bg-white dark:bg-dark-card p-6 shadow-soft dark:shadow-softDark"
    >
      <SectionTitle title="Achievements" subtitle="Badges, certificates & milestones earned" />

      <p className="text-xs font-semibold text-textSecondary dark:text-dark-textMuted mb-3">Badges</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {data.badges.map((badge) => {
          const Icon = Icons[badge.icon] || Icons.Award;
          return (
            <motion.div
              key={badge.name}
              whileHover={{ scale: 1.04, y: -2 }}
              transition={{ type: 'spring', stiffness: 350, damping: 20 }}
              className="flex flex-col items-center text-center gap-2 rounded-2xl border border-borderPurple dark:border-dark-border bg-lightPurple/40 dark:bg-dark-surface p-4"
            >
              <div
                className="flex h-11 w-11 items-center justify-center rounded-2xl"
                style={{ backgroundColor: `${badge.tint}1A`, color: badge.tint }}
              >
                <Icon size={20} strokeWidth={2.2} />
              </div>
              <p className="text-xs font-semibold text-textPrimary dark:text-dark-text">{badge.name}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <p className="text-xs font-semibold text-textSecondary dark:text-dark-textMuted mb-3 flex items-center gap-1.5">
            <GraduationCap size={14} /> Certificates
          </p>
          <div className="space-y-2">
            {data.certificates.map((c) => (
              <div
                key={c.name}
                className="flex items-center justify-between rounded-xl border border-borderPurple dark:border-dark-border px-3.5 py-2.5"
              >
                <span className="text-sm font-medium text-textPrimary dark:text-dark-text">{c.name}</span>
                <span className="text-xs text-textSecondary dark:text-dark-textMuted">{c.date}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-textSecondary dark:text-dark-textMuted mb-3 flex items-center gap-1.5">
            <Flag size={14} /> Milestones
          </p>
          <div className="space-y-2">
            {data.milestones.map((m) => (
              <div
                key={m.name}
                className="flex items-center justify-between rounded-xl border border-borderPurple dark:border-dark-border px-3.5 py-2.5"
              >
                <span className="text-sm font-medium text-textPrimary dark:text-dark-text">{m.name}</span>
                <span className="text-xs text-textSecondary dark:text-dark-textMuted">{m.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

import { motion } from 'framer-motion';

export default function SettingsCard({ icon: Icon, title, subtitle, children, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.06 * index, ease: 'easeOut' }}
      className="rounded-card border border-borderPurple dark:border-dark-border bg-white dark:bg-dark-card p-6 shadow-soft dark:shadow-softDark hover:shadow-softHover dark:hover:shadow-softHoverDark transition-shadow duration-300"
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lightPurple dark:bg-dark-surface text-primary dark:text-dark-accent">
          <Icon size={18} strokeWidth={2.2} />
        </div>
        <div>
          <h3 className="font-heading text-sm font-semibold text-textPrimary dark:text-dark-text">{title}</h3>
          {subtitle && <p className="text-xs text-textSecondary dark:text-dark-textMuted mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <div className="divide-y divide-borderPurple dark:divide-dark-border">{children}</div>
    </motion.div>
  );
}

export function SettingsRow({ label, description, control, onClick }) {
  const Wrapper = onClick ? 'button' : 'div';
  return (
    <Wrapper
      onClick={onClick}
      type={onClick ? 'button' : undefined}
      className={`w-full flex items-center justify-between gap-4 py-3.5 text-left ${
        onClick ? 'group' : ''
      }`}
    >
      <div>
        <p
          className={`text-sm font-medium ${
            onClick
              ? 'text-textPrimary group-hover:text-primary dark:text-dark-text dark:group-hover:text-dark-accent transition-colors'
              : 'text-textPrimary dark:text-dark-text'
          }`}
        >
          {label}
        </p>
        {description && <p className="text-xs text-textSecondary dark:text-dark-textMuted mt-0.5">{description}</p>}
      </div>
      {control}
    </Wrapper>
  );
}

import { motion } from 'framer-motion';

const variants = {
  primary:
    'bg-primary-gradient text-white shadow-glow hover:shadow-[0_10px_28px_rgba(124,58,237,0.38)] dark:bg-primary-gradient-dark dark:shadow-glowDark dark:hover:shadow-[0_10px_28px_rgba(139,92,246,0.45)]',
  secondary:
    'bg-lightPurple text-primary hover:bg-[#DDD6FE] dark:bg-dark-surface dark:text-dark-accent dark:hover:bg-dark-border',
  ghost:
    'bg-transparent text-textSecondary hover:bg-lightPurple hover:text-textPrimary dark:text-dark-textMuted dark:hover:bg-dark-surface dark:hover:text-dark-text',
  danger:
    'bg-danger/10 text-danger hover:bg-danger/15 dark:bg-dark-danger/15 dark:text-dark-danger dark:hover:bg-dark-danger/25',
  dangerSolid:
    'bg-danger text-white hover:bg-[#E11D48] shadow-[0_8px_20px_rgba(244,63,94,0.25)] dark:bg-dark-danger dark:hover:bg-[#E11D48] dark:shadow-[0_8px_20px_rgba(244,63,94,0.35)]',
};

export default function AnimatedButton({
  children,
  variant = 'primary',
  icon: Icon,
  className = '',
  type = 'button',
  ...props
}) {
  return (
    <motion.button
      type={type}
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className={`relative inline-flex items-center justify-center gap-2 rounded-pill px-5 py-2.5 text-sm font-semibold overflow-hidden transition-colors duration-200 ${variants[variant]} ${className}`}
      {...props}
    >
      {Icon && <Icon size={16} strokeWidth={2.4} />}
      {children}
    </motion.button>
  );
}

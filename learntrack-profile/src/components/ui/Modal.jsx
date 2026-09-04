import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

export default function Modal({ open, onClose, title, subtitle, icon: Icon, children, maxWidth = 'max-w-md' }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-[#0F172A]/40 dark:bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className={`relative w-full ${maxWidth} rounded-card bg-white dark:bg-dark-card shadow-softHover dark:shadow-softHoverDark border border-borderPurple dark:border-dark-border p-6`}
          >
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-3">
                {Icon && (
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-lightPurple dark:bg-dark-surface text-primary dark:text-dark-accent">
                    <Icon size={20} strokeWidth={2.2} />
                  </div>
                )}
                <div>
                  <h3 className="font-heading text-base font-semibold text-textPrimary dark:text-dark-text">{title}</h3>
                  {subtitle && <p className="text-xs text-textSecondary dark:text-dark-textMuted mt-0.5">{subtitle}</p>}
                </div>
              </div>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-full text-textSecondary hover:bg-lightPurple hover:text-textPrimary dark:text-dark-textMuted dark:hover:bg-dark-surface dark:hover:text-dark-text transition-colors"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

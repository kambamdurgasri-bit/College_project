import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useId, useRef } from 'react';
import { X } from 'lucide-react';

export default function Modal({ open, onClose, title, subtitle, icon: Icon, children, maxWidth = 'max-w-md' }) {
  const closeButtonRef = useRef(null);
  const previouslyFocusedRef = useRef(null);
  const onCloseRef = useRef(onClose);
  const titleId = useId();
  const descriptionId = `${titleId}-description`;

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return undefined;
    previouslyFocusedRef.current = document.activeElement;
    closeButtonRef.current?.focus();
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onCloseRef.current();
        return;
      }
      if (event.key !== 'Tab') return;
      const dialog = closeButtonRef.current?.closest('[role="dialog"]');
      if (!dialog) return;
      const focusable = dialog.querySelectorAll('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [href], [tabindex]:not([tabindex="-1"])');
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocusedRef.current?.focus?.();
    };
  }, [open]);

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
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={subtitle ? descriptionId : undefined}
          >
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-3">
                {Icon && (
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-lightPurple dark:bg-dark-surface text-primary dark:text-dark-accent">
                    <Icon size={20} strokeWidth={2.2} />
                  </div>
                )}
                <div>
                  <h3 id={titleId} className="font-heading text-base font-semibold text-textPrimary dark:text-dark-text">{title}</h3>
                  {subtitle && <p id={descriptionId} className="text-xs text-textSecondary dark:text-dark-textMuted mt-0.5">{subtitle}</p>}
                </div>
              </div>
              <button
                ref={closeButtonRef}
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

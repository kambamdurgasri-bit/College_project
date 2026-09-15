import { useEffect, useId, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

export default function Modal({
  open,
  onClose,
  title,
  subtitle,
  icon: Icon,
  children,
  maxWidth = "max-w-md",
}) {
  const closeRef = useRef(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return undefined;
    closeRef.current?.focus();
    const handler = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12 }}
            className={`relative w-full ${maxWidth} rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800/80 dark:bg-slate-800`}
          >
            <div className="mb-5 flex items-start justify-between">
              <div className="flex items-center gap-3">
                {Icon && (
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300">
                    <Icon size={18} />
                  </div>
                )}
                <div>
                  <h3
                    id={titleId}
                    className="font-semibold text-slate-900 dark:text-white"
                  >
                    {title}
                  </h3>
                  {subtitle && (
                    <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">
                      {subtitle}
                    </p>
                  )}
                </div>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/5"
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

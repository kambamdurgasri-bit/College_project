import { motion } from "framer-motion";

const variants = {
  primary:
    "bg-brand-600 text-white shadow-sm hover:bg-brand-700 dark:bg-brand-600 dark:hover:bg-brand-700",
  secondary:
    "bg-brand-50 text-brand-700 hover:bg-brand-100 dark:bg-brand-500/15 dark:text-brand-300 dark:hover:bg-brand-500/25",
  ghost:
    "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white",
  danger: "bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-500/15 dark:text-red-300 dark:hover:bg-red-500/25",
  dangerSolid:
    "bg-red-600 text-white hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700",
};

export default function AnimatedButton({
  children,
  variant = "primary",
  icon: Icon,
  className = "",
  type = "button",
  ...props
}) {
  return (
    <motion.button
      type={type}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${variants[variant]} ${className}`}
      {...props}
    >
      {Icon && <Icon size={16} />}
      {children}
    </motion.button>
  );
}

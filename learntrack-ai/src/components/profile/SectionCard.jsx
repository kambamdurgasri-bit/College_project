import { motion } from "framer-motion";

export default function SectionCard({ children, className = "", index = 0 }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800/80 dark:bg-slate-800 ${className}`}
    >
      {children}
    </motion.section>
  );
}

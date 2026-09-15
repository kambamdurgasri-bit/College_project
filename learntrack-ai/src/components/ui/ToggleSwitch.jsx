import { motion } from "framer-motion";

export default function ToggleSwitch({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
        checked
          ? "bg-brand-600 dark:bg-brand-600"
          : "bg-slate-300 dark:bg-slate-600"
      }`}
    >
      <motion.span
        layout
        className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm dark:bg-white"
        style={{ left: checked ? 22 : 2 }}
      />
    </button>
  );
}

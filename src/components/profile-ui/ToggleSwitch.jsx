import { motion } from 'framer-motion';

export default function ToggleSwitch({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-pill transition-colors duration-200 ${
        checked ? 'bg-primary-gradient dark:bg-primary-gradient-dark' : 'bg-[#EDE9FE] dark:bg-dark-border'
      }`}
    >
      <motion.span
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm"
        style={{ left: checked ? 22 : 2 }}
      />
    </button>
  );
}

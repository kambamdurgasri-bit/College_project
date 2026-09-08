import { motion } from "framer-motion";

export default function SettingsCard({
  icon: Icon,
  title,
  subtitle,
  children,
  index = 0,
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800/80 dark:bg-slate-800"
    >
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300">
          <Icon size={18} />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            {title}
          </h3>
          <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">
            {subtitle}
          </p>
        </div>
      </div>
      <div className="divide-y divide-slate-200 dark:divide-slate-700">{children}</div>
    </motion.section>
  );
}

export function SettingsRow({ label, description, control, onClick }) {
  const Wrapper = onClick ? "button" : "div";
  return (
    <Wrapper
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={`flex w-full items-center justify-between gap-4 py-3.5 text-left ${
        onClick ? "group hover:bg-slate-50 dark:hover:bg-slate-700/50" : ""
      }`}
    >
      <div>
        <p
          className={`text-sm font-medium ${
            onClick
              ? "text-slate-900 group-hover:text-brand-600 dark:text-white dark:group-hover:text-brand-400"
              : "text-slate-900 dark:text-white"
          }`}
        >
          {label}
        </p>
        {description && (
          <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">
            {description}
          </p>
        )}
      </div>
      {control}
    </Wrapper>
  );
}

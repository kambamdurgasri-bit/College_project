import { useId } from "react";

export function InfoField({ label, value, icon: Icon }) {
  return (
    <div className="flex items-start gap-3 py-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300">
        {Icon && <Icon size={16} />}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {label}
        </p>
        <p className="mt-0.5 break-words text-sm font-medium text-slate-900 dark:text-white">
          {value}
        </p>
      </div>
    </div>
  );
}

export function InputField({ label, icon: Icon, ...props }) {
  const id = useId();
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-400">
        {label}
      </span>
      <div className="relative">
        {Icon && (
          <Icon
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-500"
          />
        )}
        <input
          id={id}
          className={`w-full rounded-xl border border-slate-200 bg-white py-2.5 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-brand-500 dark:focus:ring-brand-500/20 ${
            Icon ? "pl-10" : "pl-3.5"
          } pr-3.5`}
          {...props}
        />
      </div>
    </label>
  );
}

export function SelectField({ label, children, ...props }) {
  const id = useId();
  return (
    <label className="block">
      {label && (
        <span className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-400">
          {label}
        </span>
      )}
      <select
        id={id}
        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-brand-500 dark:focus:ring-brand-500/20"
        {...props}
      >
        {children}
      </select>
    </label>
  );
}

export function TextareaField({ label, ...props }) {
  const id = useId();
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-400">
        {label}
      </span>
      <textarea
        id={id}
        className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-brand-500 dark:focus:ring-brand-500/20"
        {...props}
      />
    </label>
  );
}

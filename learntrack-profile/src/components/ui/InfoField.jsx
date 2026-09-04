export function InfoField({ label, value, icon: Icon }) {
  return (
    <div className="flex items-start gap-3 py-3">
      {Icon && (
        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-lightPurple text-primary dark:bg-dark-surface dark:text-dark-accent">
          <Icon size={16} strokeWidth={2.2} />
        </div>
      )}
      <div className="min-w-0">
        <p className="text-xs font-medium text-textSecondary dark:text-dark-textMuted">{label}</p>
        <p className="text-sm font-medium text-textPrimary dark:text-dark-text mt-0.5 break-words">{value}</p>
      </div>
    </div>
  );
}

export function InputField({ label, icon: Icon, ...props }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-textSecondary dark:text-dark-textMuted mb-1.5 block">{label}</span>
      <div className="relative">
        {Icon && (
          <Icon
            size={16}
            strokeWidth={2.2}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-textSecondary dark:text-dark-textMuted"
          />
        )}
        <input
          className={`w-full rounded-xl border border-borderPurple dark:border-dark-border bg-white dark:bg-dark-surface text-sm text-textPrimary dark:text-dark-text placeholder:text-textSecondary/70 dark:placeholder:text-dark-textMuted/70 py-2.5 ${
            Icon ? 'pl-10' : 'pl-3.5'
          } pr-3.5 outline-none transition-all duration-200 focus:border-primary dark:focus:border-dark-primary focus:ring-4 focus:ring-primary/10 dark:focus:ring-dark-primary/20`}
          {...props}
        />
      </div>
    </label>
  );
}

export function SelectField({ label, icon: Icon, children, ...props }) {
  return (
    <label className="block">
      {label && <span className="text-xs font-semibold text-textSecondary dark:text-dark-textMuted mb-1.5 block">{label}</span>}
      <div className="relative">
        {Icon && (
          <Icon
            size={16}
            strokeWidth={2.2}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-textSecondary dark:text-dark-textMuted"
          />
        )}
        <select
          className={`w-full appearance-none rounded-xl border border-borderPurple dark:border-dark-border bg-white dark:bg-dark-surface text-sm text-textPrimary dark:text-dark-text py-2.5 ${
            Icon ? 'pl-10' : 'pl-3.5'
          } pr-8 outline-none transition-all duration-200 focus:border-primary dark:focus:border-dark-primary focus:ring-4 focus:ring-primary/10 dark:focus:ring-dark-primary/20`}
          {...props}
        >
          {children}
        </select>
      </div>
    </label>
  );
}

export function TextareaField({ label, ...props }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-textSecondary dark:text-dark-textMuted mb-1.5 block">{label}</span>
      <textarea
        className="w-full rounded-xl border border-borderPurple dark:border-dark-border bg-white dark:bg-dark-surface text-sm text-textPrimary dark:text-dark-text placeholder:text-textSecondary/70 dark:placeholder:text-dark-textMuted/70 py-2.5 px-3.5 outline-none transition-all duration-200 focus:border-primary dark:focus:border-dark-primary focus:ring-4 focus:ring-primary/10 dark:focus:ring-dark-primary/20 resize-none"
        {...props}
      />
    </label>
  );
}

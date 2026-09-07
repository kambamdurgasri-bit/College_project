import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export function SampleBadge({ text = "Frontend only \u00b7 backend not connected yet" }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2.5 py-1 text-[11px] font-medium text-orange-600 dark:bg-orange-500/15 dark:text-orange-400">
      {text}
    </span>
  );
}

export function AuthCard({ children, className = "" }) {
  return (
    <div
      className={`rounded-2xl bg-white p-5 shadow-card dark:border dark:border-slate-800/80 dark:bg-surface-dark-card dark:shadow-card-dark ${className}`}
    >
      {children}
    </div>
  );
}

export function FieldLabel({ children }) {
  return (
    <label className="mb-1.5 block text-xs font-semibold text-slate-900 dark:text-white">
      {children}
    </label>
  );
}

export function TextField({ icon: Icon, error, ...props }) {
  return (
    <div className="mb-4">
      <div
        className={`flex items-center gap-2 rounded-xl border bg-white px-3.5 py-3 dark:bg-surface-dark-card ${
          error
            ? "border-rose-400 dark:border-rose-500/60"
            : "border-slate-200 dark:border-slate-800/80"
        }`}
      >
        <Icon
          size={16}
          className={error ? "text-rose-500" : "text-slate-400 dark:text-slate-500"}
        />
        <input
          {...props}
          className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
        />
      </div>
      {error && (
        <p className="mt-1 text-[11px] font-medium text-rose-500">{error}</p>
      )}
    </div>
  );
}

export function PasswordField({ label, value, onChange, placeholder, error }) {
  const [show, setShow] = useState(false);
  return (
    <div className="mb-4">
      <FieldLabel>{label}</FieldLabel>
      <div
        className={`flex items-center gap-2 rounded-xl border bg-white px-3.5 py-3 dark:bg-surface-dark-card ${
          error
            ? "border-rose-400 dark:border-rose-500/60"
            : "border-slate-200 dark:border-slate-800/80"
        }`}
      >
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? "Hide password" : "Show password"}
          className="shrink-0 text-slate-400 dark:text-slate-500"
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      {error && (
        <p className="mt-1 text-[11px] font-medium text-rose-500">{error}</p>
      )}
    </div>
  );
}

export function PrimaryButton({ children, ...props }) {
  return (
    <button
      {...props}
      className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
    >
      {children}
    </button>
  );
}

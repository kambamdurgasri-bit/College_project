import { Construction } from "lucide-react";

export default function ComingSoonPage({ title }) {
  return (
    <div className="flex h-[70vh] flex-col items-center justify-center text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-100 dark:bg-brand-500/15">
        <Construction className="h-7 w-7 text-brand-600 dark:text-brand-400" />
      </div>
      <h1 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h1>
      <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
        This module is outside the current build scope (Module 3: Learning
        Spaces &amp; Timetable) and will be implemented in a future pass.
      </p>
    </div>
  );
}

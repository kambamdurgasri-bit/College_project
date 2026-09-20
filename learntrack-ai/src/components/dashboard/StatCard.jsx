import React from "react";

export default function StatCard({ icon: Icon, value, label, sublabel, tintBg = "bg-purple-100 dark:bg-purple-950/40", tintText = "text-purple-600 dark:text-purple-400" }) {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800/80 dark:bg-surface-dark-card dark:shadow-card-dark">
      <div className="flex items-center justify-between mb-3">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${tintBg}`}>
          {typeof Icon === "string" ? (
            <span className="text-xl">{Icon}</span>
          ) : (
            <Icon className={`h-5 w-5 ${tintText}`} />
          )}
        </div>
      </div>
      <div>
        <p className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {value}
        </p>
        <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-200">
          {label}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {sublabel}
        </p>
      </div>
    </div>
  );
}

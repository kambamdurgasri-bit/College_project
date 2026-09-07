import { ChevronDown } from "lucide-react";

export default function FilterBar({
  tabs,
  activeTab,
  onTabChange,
  sortOptions,
  sortValue,
  onSortChange,
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex w-fit items-center gap-1 rounded-xl bg-slate-100 p-1 dark:bg-white/5">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => onTabChange(tab.value)}
            className={`rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors ${
              activeTab === tab.value
                ? "bg-white text-slate-900 shadow-sm dark:bg-surface-dark-card dark:text-white"
                : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {sortOptions && (
        <div className="relative w-fit">
          <select
            value={sortValue}
            onChange={(e) => onSortChange(e.target.value)}
            className="appearance-none rounded-xl border border-slate-200 bg-white py-2 pl-3 pr-9 text-sm font-medium text-slate-700 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-white/5 dark:text-slate-200"
          >
            {sortOptions.map((opt) => (
              <option key={opt} value={opt}>
                Sort by: {opt}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        </div>
      )}
    </div>
  );
}

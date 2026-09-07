import { getTheme } from "../../utils/theme";

export default function StatisticCard({ icon: Icon, label, value, colorId = "purple" }) {
  const theme = getTheme(colorId);
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-card dark:border-slate-800/80 dark:bg-surface-dark-card dark:shadow-card-dark">
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${theme.softBg}`}>
        <Icon className={`h-5 w-5 ${theme.text}`} strokeWidth={2} />
      </div>
      <div>
        <p className="text-xl font-bold text-slate-900 dark:text-white">{value}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
      </div>
    </div>
  );
}

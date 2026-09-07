import { getTheme } from "../../utils/theme";

export default function ProgressBar({ value, colorId = "purple", className = "" }) {
  const theme = getTheme(colorId);
  return (
    <div
      className={`h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/10 ${className}`}
    >
      <div
        className={`h-full rounded-full ${theme.bar} transition-all duration-500`}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

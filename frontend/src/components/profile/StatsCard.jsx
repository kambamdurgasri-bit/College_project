import * as Icons from "lucide-react";
import SectionCard from "./SectionCard.jsx";

export default function StatsCard({ label, value, icon, tint, index }) {
  const Icon = Icons[icon] || Icons.Circle;
  return (
    <SectionCard index={index} className="p-4">
      <div
        className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl"
        style={{ backgroundColor: `${tint}1A`, color: tint }}
      >
        <Icon size={18} />
      </div>
      <p className="text-xl font-bold text-slate-900 dark:text-white">{value}</p>
      <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">{label}</p>
    </SectionCard>
  );
}

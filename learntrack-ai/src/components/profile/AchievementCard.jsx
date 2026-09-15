import * as Icons from "lucide-react";
import { Flag, GraduationCap } from "lucide-react";
import SectionTitle from "../ui/SectionTitle.jsx";
import SectionCard from "./SectionCard.jsx";

export default function AchievementCard({ data }) {
  return (
    <SectionCard>
      <SectionTitle
        title="Achievements"
        subtitle="Badges, certificates and milestones earned"
      />
      <p className="mb-3 text-xs font-semibold text-slate-600 dark:text-slate-400">
        Badges
      </p>
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {data.badges.map((badge) => {
          const Icon = Icons[badge.icon] || Icons.Award;
          return (
            <div
              key={badge.name}
              className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-700 dark:bg-slate-900/50"
            >
              <div
                className="flex h-11 w-11 items-center justify-center rounded-xl"
                style={{ backgroundColor: `${badge.tint}1A`, color: badge.tint }}
              >
                <Icon size={20} />
              </div>
              <p className="text-xs font-semibold text-slate-900 dark:text-white">
                {badge.name}
              </p>
            </div>
          );
        })}
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <List title="Certificates" icon={GraduationCap} items={data.certificates} />
        <List title="Milestones" icon={Flag} items={data.milestones} />
      </div>
    </SectionCard>
  );
}

function List({ title, icon: Icon, items }) {
  return (
    <div>
      <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400">
        <Icon size={14} />
        {title}
      </p>
      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 px-3.5 py-2.5 dark:border-slate-700"
          >
            <span className="text-sm font-medium text-slate-900 dark:text-white">
              {item.name}
            </span>
            <span className="shrink-0 text-xs text-slate-600 dark:text-slate-400">
              {item.date}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

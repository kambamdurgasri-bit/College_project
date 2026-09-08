import * as Icons from "lucide-react";
import SectionTitle from "../ui/SectionTitle.jsx";
import SectionCard from "./SectionCard.jsx";

export default function TimelineCard({ items }) {
  return (
    <SectionCard>
      <SectionTitle
        title="Recent Activity"
        subtitle="Updates, quiz attempts and logins"
      />
      <div className="relative pl-2">
        <div className="absolute bottom-1 left-6 top-1 w-px bg-slate-200 dark:bg-slate-700" />
        <div className="space-y-5">
          {items.map((item, index) => {
            const Icon = Icons[item.icon] || Icons.Circle;
            return (
              <div
                key={`${item.title}-${index}`}
                className="relative flex items-start gap-4"
              >
                <div className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600 ring-4 ring-white dark:bg-brand-500/15 dark:text-brand-300 dark:ring-slate-800">
                  <Icon size={15} />
                </div>
                <div className="pt-1">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    {item.title}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">
                    {item.time}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </SectionCard>
  );
}

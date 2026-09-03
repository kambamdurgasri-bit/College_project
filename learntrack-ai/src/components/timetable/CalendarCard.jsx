import { Coffee } from "lucide-react";
import ScheduleCard, { HOUR_HEIGHT } from "./ScheduleCard";
import { getSubjectColorId } from "../../mock-data/timetable";

// 2-hour repeating gridline pattern, height-linked to HOUR_HEIGHT so it always
// lines up with the time axis labels in WeekView.
const gridLineStyle = {
  backgroundImage:
    "repeating-linear-gradient(to bottom, transparent, transparent " +
    `${HOUR_HEIGHT * 2 - 1}px, rgba(148,163,184,0.15) ${HOUR_HEIGHT * 2 - 1}px, ` +
    `rgba(148,163,184,0.15) ${HOUR_HEIGHT * 2}px)`,
};

export default function CalendarCard({ day, events, isToday = false, onEventClick }) {
  const hasEvents = events.length > 0;
  const isRestDay = !hasEvents;

  return (
    <div className="flex min-w-[130px] flex-1 flex-col border-l border-slate-100 first:border-l-0 dark:border-white/5">
      <div
        className={`sticky top-0 z-10 border-b border-slate-100 bg-white py-3 text-center dark:border-white/5 dark:bg-surface-dark-card ${
          isToday ? "text-brand-600 dark:text-brand-400" : "text-slate-700 dark:text-slate-200"
        }`}
      >
        <p className="text-xs font-semibold">
          {day.label} {day.date}
        </p>
      </div>

      <div className="relative flex-1" style={gridLineStyle}>
        {isRestDay ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 px-3 py-10 text-center">
            <Coffee className="h-6 w-6 text-slate-300 dark:text-slate-600" />
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Take a break and relax!
            </p>
          </div>
        ) : (
          events.map((event) => (
            <ScheduleCard
              key={event.id}
              event={event}
              colorId={getSubjectColorId(event.subjectId)}
              onClick={() => onEventClick?.(event)}
            />
          ))
        )}
      </div>
    </div>
  );
}

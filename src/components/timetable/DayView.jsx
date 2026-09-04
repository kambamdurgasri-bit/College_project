import { Coffee } from "lucide-react";
import { getTheme } from "../../utils/theme";
import { getSubjectColorId } from "../../mock-data/timetable";

const formatTime = (hour, minute) => {
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour}:${minute.toString().padStart(2, "0")} ${period}`;
};

export default function DayView({ day, events, onEventClick }) {
  const sorted = [...events].sort(
    (a, b) => a.hour * 60 + a.minute - (b.hour * 60 + b.minute)
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card dark:border-slate-800/80 dark:bg-surface-dark-card dark:shadow-card-dark">
      <h3 className="mb-4 text-sm font-semibold text-slate-700 dark:text-slate-200">
        {day.label} {day.date}
      </h3>

      {sorted.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
          <Coffee className="h-6 w-6 text-slate-300 dark:text-slate-600" />
          <p className="text-sm text-slate-400 dark:text-slate-500">
            Take a break and relax!
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {sorted.map((event) => {
            const theme = getTheme(getSubjectColorId(event.subjectId));
            return (
              <li key={event.id}>
                <button
                  type="button"
                  onClick={() => onEventClick?.(event)}
                  className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-transform hover:-translate-y-0.5 ${theme.eventBg} ${theme.eventBorder}`}
                >
                  <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${theme.dot}`} />
                  <div>
                    <p className={`text-sm font-semibold ${theme.eventText}`}>
                      {formatTime(event.hour, event.minute)}
                    </p>
                    <p className={`text-xs ${theme.eventText}`}>{event.label}</p>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

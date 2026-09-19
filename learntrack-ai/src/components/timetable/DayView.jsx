import { Coffee } from "lucide-react";
import { getTheme } from "../../utils/theme";
import {
  getColorIdBySubject,
  formatTime12Hour,
  timeToMinutes,
} from "../../utils/timetableHelpers";

export default function DayView({ day, events, onEventClick }) {
  if (!day) return null;

  // Sort by start time
  const sorted = [...events].sort((a, b) =>
    timeToMinutes(a.startTime) - timeToMinutes(b.startTime)
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-surface-light p-5 shadow-card dark:border-slate-800/80 dark:bg-surface-dark-card dark:shadow-card-dark">
      <h3 className="mb-4 text-sm font-semibold text-slate-700 dark:text-slate-200">
        {day}
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
            const colorId = getColorIdBySubject(event.subject);
            const theme = getTheme(colorId);
            return (
              <li key={event.id}>
                <button
                  type="button"
                  onClick={() => onEventClick?.(event)}
                  className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-transform hover:-translate-y-0.5 ${theme.eventBg} ${theme.eventBorder}`}
                >
                  <span
                    className={`h-2.5 w-2.5 shrink-0 rounded-full ${theme.dot}`}
                  />
                  <div>
                    <p className={`text-sm font-semibold ${theme.eventText}`}>
                      {formatTime12Hour(event.startTime)} –{" "}
                      {formatTime12Hour(event.endTime)}
                    </p>
                    <p className={`text-xs ${theme.eventText}`}>
                      {event.subject}
                    </p>
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
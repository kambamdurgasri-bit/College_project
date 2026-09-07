import CalendarCard from "./CalendarCard";
import { HOUR_HEIGHT, START_HOUR, END_HOUR } from "./ScheduleCard";

const TIME_LABELS = Array.from(
  { length: (END_HOUR - START_HOUR) / 2 + 1 },
  (_, i) => START_HOUR + i * 2
);

const formatLabel = (hour) => {
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour} ${period}`;
};

export default function WeekView({ weekDays, eventsByDay, todayIndex, onEventClick }) {
  const gridHeight = (END_HOUR - START_HOUR) * HOUR_HEIGHT;

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-card dark:border-slate-800/80 dark:bg-surface-dark-card dark:shadow-card-dark">
      <div className="flex min-w-[820px]">
        {/* Time axis */}
        <div className="w-16 shrink-0 border-r border-slate-100 dark:border-white/5">
          <div className="h-[45px] border-b border-slate-100 dark:border-white/5" />
          <div className="relative" style={{ height: gridHeight }}>
            {TIME_LABELS.map((hour, i) => (
              <span
                key={hour}
                style={{ top: i * 2 * HOUR_HEIGHT - 7 }}
                className="absolute right-2 text-[11px] text-slate-400 dark:text-slate-500"
              >
                {formatLabel(hour)}
              </span>
            ))}
          </div>
        </div>

        {/* Day columns */}
        <div className="flex flex-1">
          {weekDays.map((day, index) => (
            <div key={day.dayIndex} style={{ minHeight: gridHeight + 45 }} className="flex flex-1 flex-col">
              <CalendarCard
                day={day}
                events={eventsByDay[day.dayIndex] || []}
                isToday={index === todayIndex}
                onEventClick={onEventClick}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

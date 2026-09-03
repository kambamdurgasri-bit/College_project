import { getTheme } from "../../utils/theme";

const HOUR_HEIGHT = 56; // px per hour, keep in sync with WeekView/DayView
const START_HOUR = 6;
const END_HOUR = 22;

const formatTime = (hour, minute) => {
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour}:${minute.toString().padStart(2, "0")} ${period}`;
};

export default function ScheduleCard({ event, colorId, style, onClick }) {
  const theme = getTheme(colorId);
  const top = (event.hour + event.minute / 60 - START_HOUR) * HOUR_HEIGHT;
  const height = event.duration * HOUR_HEIGHT;

  return (
    <button
      type="button"
      onClick={onClick}
      style={{ top, height, ...style }}
      className={`absolute left-1 right-1 overflow-hidden rounded-lg border px-2 py-1.5 text-left transition-transform hover:-translate-y-0.5 hover:shadow-sm ${theme.eventBg} ${theme.eventBorder}`}
    >
      <p className={`text-[11px] font-semibold leading-tight ${theme.eventText}`}>
        {formatTime(event.hour, event.minute)}
      </p>
      <p className={`truncate text-[11px] leading-tight ${theme.eventText}`}>
        {event.label}
      </p>
    </button>
  );
}

export { HOUR_HEIGHT, START_HOUR, END_HOUR };

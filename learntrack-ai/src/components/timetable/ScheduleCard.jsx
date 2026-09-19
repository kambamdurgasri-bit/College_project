import { getTheme } from "../../utils/theme";
import { timeToMinutes, formatTime12Hour, getColorIdBySubject } from "../../utils/timetableHelpers";

const HOUR_HEIGHT = 56; // px per hour, keep in sync with WeekView/DayView
const START_HOUR = 6;
const END_HOUR = 22;

export default function ScheduleCard({ event, style, onClick }) {
  // Parse startTime and endTime to calculate position and height
  const startMinutes = timeToMinutes(event.startTime);
  const endMinutes = timeToMinutes(event.endTime);
  const durationMinutes = endMinutes - startMinutes;

  // Position on the grid
  const top = (startMinutes / 60 - START_HOUR) * HOUR_HEIGHT;
  const height = (durationMinutes / 60) * HOUR_HEIGHT;

  // Get color based on subject name
  const colorId = getColorIdBySubject(event.subject);
  const theme = getTheme(colorId);

  return (
    <button
      type="button"
      onClick={onClick}
      style={{ top, height, ...style }}
      className={`absolute left-1 right-1 overflow-hidden rounded-lg border px-2 py-1.5 text-left transition-transform hover:-translate-y-0.5 hover:shadow-sm ${theme.eventBg} ${theme.eventBorder}`}
    >
      <p className={`text-[11px] font-semibold leading-tight ${theme.eventText}`}>
        {formatTime12Hour(event.startTime)} – {formatTime12Hour(event.endTime)}
      </p>
      <p className={`truncate text-[11px] leading-tight ${theme.eventText}`}>
        {event.subject}
      </p>
    </button>
  );
}

export { HOUR_HEIGHT, START_HOUR, END_HOUR };
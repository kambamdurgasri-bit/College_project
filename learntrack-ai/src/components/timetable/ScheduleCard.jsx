import { useState, useRef, useEffect } from "react";
import { MoreVertical, Edit2, Trash2 } from "lucide-react";
import { getTheme } from "../../utils/theme";
import { timeToMinutes, formatTime12Hour, getColorIdBySubject } from "../../utils/timetableHelpers";

const HOUR_HEIGHT = 56; // px per hour
const START_HOUR = 6;
const END_HOUR = 22;

export default function ScheduleCard({ event, style, onEdit, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu on click outside
  useEffect(() => {
    if (!menuOpen) return;
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  // Parse startTime and endTime to calculate position and height
  const startMinutes = timeToMinutes(event.startTime);
  const endMinutes = timeToMinutes(event.endTime);
  const durationMinutes = endMinutes - startMinutes;

  // Position on the grid
  const top = (startMinutes / 60 - START_HOUR) * HOUR_HEIGHT;
  const height = (durationMinutes / 60) * HOUR_HEIGHT;

  // Use Learning Space's color or fallback
  const colorId = event.learningSpace?.colorId || getColorIdBySubject(event.subject);
  const theme = getTheme(colorId);

  return (
    <div
      ref={menuRef}
      style={{ top, height, ...style }}
      className={`group absolute left-1 right-1 rounded-lg border px-2 py-1 text-left transition-colors ${
        menuOpen ? "z-40 shadow-md" : "z-10 hover:shadow-sm"
      } ${theme.eventBg} ${theme.eventBorder}`}
    >
      <div className="flex items-start justify-between gap-1 h-full">
        {/* Card content click -> edit */}
        <div
          className="min-w-0 flex-1 cursor-pointer overflow-hidden"
          onClick={() => onEdit?.(event)}
        >
          <p className={`text-[11px] font-semibold leading-tight ${theme.eventText}`}>
            {formatTime12Hour(event.startTime)} – {formatTime12Hour(event.endTime)}
          </p>
          <p className={`truncate text-[11px] font-medium leading-tight ${theme.eventText}`}>
            {event.subject}
          </p>
        </div>

        {/* Upper-right edit/delete options button */}
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setMenuOpen((prev) => !prev);
            }}
            className="rounded p-0.5 text-slate-500 hover:bg-black/10 hover:text-slate-800 dark:hover:bg-white/20"
            title="Options"
          >
            <MoreVertical className="h-3.5 w-3.5" />
          </button>

          {menuOpen && (
            <div
              className="absolute right-0 top-full mt-1 z-50 min-w-[110px] overflow-hidden rounded-lg border border-slate-200 bg-white p-1 shadow-xl dark:border-slate-700 dark:bg-slate-800"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(false);
                  onEdit?.(event);
                }}
                className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                <Edit2 className="h-3.5 w-3.5" /> Edit
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(false);
                  onDelete?.(event);
                }}
                className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export { HOUR_HEIGHT, START_HOUR, END_HOUR };
import { useState, useRef, useEffect } from "react";
import { Coffee, MoreVertical, Edit2, Trash2 } from "lucide-react";
import { getTheme } from "../../utils/theme";
import {
  getColorIdBySubject,
  formatTime12Hour,
  timeToMinutes,
} from "../../utils/timetableHelpers";

function DayEventItem({ event, onEventClick, onDeleteClick }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

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

  const colorId =
    event.learningSpace?.colorId || getColorIdBySubject(event.subject);
  const theme = getTheme(colorId);

  return (
    <li className="relative">
      <div
        ref={menuRef}
        className={`flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${
          menuOpen ? "z-40 shadow-md" : ""
        } ${theme.eventBg} ${theme.eventBorder}`}
      >
        <div
          className="flex flex-1 items-center gap-3 cursor-pointer"
          onClick={() => onEventClick?.(event)}
        >
          <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${theme.dot}`} />
          <div>
            <p className={`text-sm font-semibold ${theme.eventText}`}>
              {formatTime12Hour(event.startTime)} – {formatTime12Hour(event.endTime)}
            </p>
            <p className={`text-xs ${theme.eventText}`}>{event.subject}</p>
          </div>
        </div>

        {/* Upper-right options button */}
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setMenuOpen((prev) => !prev);
            }}
            className="rounded-lg p-1 text-slate-500 hover:bg-black/10 hover:text-slate-800 dark:hover:bg-white/20"
            title="Options"
          >
            <MoreVertical className="h-4 w-4" />
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
                  onEventClick?.(event);
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
                  onDeleteClick?.(event);
                }}
                className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </li>
  );
}

export default function DayView({ day, events, onEventClick, onDeleteClick }) {
  if (!day) return null;

  const sorted = [...events].sort(
    (a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime)
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
          {sorted.map((event) => (
            <DayEventItem
              key={event.id}
              event={event}
              onEventClick={onEventClick}
              onDeleteClick={onDeleteClick}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
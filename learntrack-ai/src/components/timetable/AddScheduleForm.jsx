import { useState, useEffect } from "react";
import { learningSpaceService } from "../../services/learningSpaceService";
import { WEEKDAYS } from "../../utils/timetableHelpers";

export default function AddScheduleForm({ onSubmit, onCancel, submitting }) {
  const [learningSpaces, setLearningSpaces] = useState([]);
  const [subject, setSubject] = useState("");
  const [day, setDay] = useState("Monday");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [loadingSpaces, setLoadingSpaces] = useState(true);

  // Load learning spaces on mount
  useEffect(() => {
    let cancelled = false;
    learningSpaceService
      .list()
      .then((spaces) => {
        if (!cancelled) {
          setLearningSpaces(spaces || []);
          if (spaces && spaces.length > 0) {
            setSubject(spaces[0].name);
          }
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingSpaces(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.({
      day,
      subject,
      startTime,
      endTime,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Learning Space
        </label>
        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          disabled={loadingSpaces}
          className="w-full rounded-xl border border-slate-200 bg-surface-input px-3.5 py-2.5 text-sm text-slate-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:opacity-50 dark:border-slate-700 dark:bg-white/5 dark:text-slate-100"
        >
          {loadingSpaces ? (
            <option>Loading...</option>
          ) : learningSpaces.length === 0 ? (
            <option>No learning spaces available</option>
          ) : (
            learningSpaces.map((space) => (
              <option key={space.id} value={space.name}>
                {space.name}
              </option>
            ))
          )}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Day
          </label>
          <select
            value={day}
            onChange={(e) => setDay(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-surface-input px-3.5 py-2.5 text-sm text-slate-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-white/5 dark:text-slate-100"
          >
            {WEEKDAYS.map((weekday) => (
              <option key={weekday} value={weekday}>
                {weekday}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Start Time
          </label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-surface-input px-3.5 py-2.5 text-sm text-slate-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-white/5 dark:text-slate-100"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
          End Time
        </label>
        <input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-surface-input px-3.5 py-2.5 text-sm text-slate-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-white/5 dark:text-slate-100"
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-white/5"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting || loadingSpaces}
          className="rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {submitting ? "Adding..." : "Add Schedule"}
        </button>
      </div>
    </form>
  );
}
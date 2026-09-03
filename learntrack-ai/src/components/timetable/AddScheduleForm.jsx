import { useState } from "react";
import { learningSpaces } from "../../mock-data/learningSpaces";
import { weekDays } from "../../mock-data/timetable";

export default function AddScheduleForm({ onSubmit, onCancel, submitting }) {
  const [subjectId, setSubjectId] = useState(learningSpaces[0]?.id || "");
  const [dayIndex, setDayIndex] = useState(0);
  const [time, setTime] = useState("09:00");
  const [duration, setDuration] = useState("1");

  const handleSubmit = (e) => {
    e.preventDefault();
    const [hour, minute] = time.split(":").map(Number);
    const subject = learningSpaces.find((s) => s.id === subjectId);
    onSubmit?.({
      subjectId,
      label: subject?.name || "Study Session",
      dayIndex: Number(dayIndex),
      hour,
      minute,
      duration: Number(duration),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Learning Space
        </label>
        <select
          value={subjectId}
          onChange={(e) => setSubjectId(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-white/5 dark:text-slate-100"
        >
          {learningSpaces.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Day
          </label>
          <select
            value={dayIndex}
            onChange={(e) => setDayIndex(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-white/5 dark:text-slate-100"
          >
            {weekDays.map((d) => (
              <option key={d.dayIndex} value={d.dayIndex}>
                {d.label} {d.date}
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
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-white/5 dark:text-slate-100"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Duration
        </label>
        <select
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-white/5 dark:text-slate-100"
        >
          <option value="0.5">30 minutes</option>
          <option value="1">1 hour</option>
          <option value="1.5">1.5 hours</option>
          <option value="2">2 hours</option>
        </select>
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
          disabled={submitting}
          className="rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {submitting ? "Adding..." : "Add Schedule"}
        </button>
      </div>
    </form>
  );
}

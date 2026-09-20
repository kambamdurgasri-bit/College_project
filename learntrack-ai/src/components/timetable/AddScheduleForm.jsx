import { useState, useEffect } from "react";
import { BookOpen } from "lucide-react";
import { learningSpaceService } from "../../services/learningSpaceService";
import { WEEKDAYS } from "../../utils/timetableHelpers";

// ── Inline AM/PM time picker ─────────────────────────────────────────────────
function TimePicker({ value, onChange, disabled }) {
  function parse(hhmm) {
    const [hStr, mStr] = (hhmm || "09:00").split(":");
    let h = parseInt(hStr, 10);
    const m = parseInt(mStr, 10);
    const period = h >= 12 ? "PM" : "AM";
    if (h === 0) h = 12;
    else if (h > 12) h -= 12;
    return { hour: String(h), minute: String(m).padStart(2, "0"), period };
  }

  const [hour, setHour] = useState(() => parse(value).hour);
  const [minute, setMinute] = useState(() => parse(value).minute);
  const [period, setPeriod] = useState(() => parse(value).period);

  useEffect(() => {
    const p = parse(value);
    setHour(p.hour);
    setMinute(p.minute);
    setPeriod(p.period);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  function emit(h, m, p) {
    let h24 = parseInt(h, 10);
    if (p === "AM" && h24 === 12) h24 = 0;
    else if (p === "PM" && h24 !== 12) h24 += 12;
    onChange(`${String(h24).padStart(2, "0")}:${m}`);
  }

  const sel =
    "rounded-lg border border-slate-200 bg-surface-input px-2 py-2 text-sm text-slate-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:opacity-50 dark:border-slate-700 dark:bg-white/5 dark:text-slate-100";

  return (
    <div className="flex items-center gap-1">
      <select value={hour} disabled={disabled} onChange={(e) => { setHour(e.target.value); emit(e.target.value, minute, period); }} className={`${sel} w-16`}>
        {Array.from({ length: 12 }, (_, i) => String(i + 1)).map((h) => <option key={h} value={h}>{h}</option>)}
      </select>
      <span className="text-slate-500 dark:text-slate-400">:</span>
      <select value={minute} disabled={disabled} onChange={(e) => { setMinute(e.target.value); emit(hour, e.target.value, period); }} className={`${sel} w-16`}>
        {["00","05","10","15","20","25","30","35","40","45","50","55"].map((m) => <option key={m} value={m}>{m}</option>)}
      </select>
      <div className="flex overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
        {["AM","PM"].map((p) => (
          <button key={p} type="button" disabled={disabled}
            onClick={() => { setPeriod(p); emit(hour, minute, p); }}
            className={`px-2.5 py-2 text-xs font-semibold transition-colors disabled:opacity-50 ${period === p ? "bg-brand-600 text-white" : "bg-surface-input text-slate-500 hover:bg-slate-100 dark:bg-white/5 dark:text-slate-400 dark:hover:bg-white/10"}`}>
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── AddScheduleForm ──────────────────────────────────────────────────────────
export default function AddScheduleForm({ onSubmit, onCancel, submitting, error }) {
  const [spaces, setSpaces] = useState([]);
  const [loadingSpaces, setLoadingSpaces] = useState(true);
  const [learningSpaceId, setLearningSpaceId] = useState("");
  const [day, setDay] = useState("Monday");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");

  useEffect(() => {
    let cancelled = false;
    learningSpaceService
      .list()
      .then((data) => {
        if (!cancelled) {
          setSpaces(data || []);
          if (data && data.length > 0) setLearningSpaceId(String(data[0].id));
        }
      })
      .finally(() => { if (!cancelled) setLoadingSpaces(false); });
    return () => { cancelled = true; };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!learningSpaceId) return;
    onSubmit?.({
      learningSpaceId: Number(learningSpaceId),
      day,
      startTime,
      endTime,
    });
  };

  const noSpaces = !loadingSpaces && spaces.length === 0;
  const canSubmit = !submitting && !loadingSpaces && !!learningSpaceId;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Learning Space selector */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Learning Space
        </label>

        {noSpaces ? (
          <div className="flex items-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-white/5">
            <BookOpen className="h-4 w-4 shrink-0 text-slate-400" />
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No Learning Spaces yet.{" "}
              <a href="/learning-spaces/new" className="font-medium text-brand-600 underline underline-offset-2 hover:text-brand-700 dark:text-brand-400">
                Create one first
              </a>
              , then come back.
            </p>
          </div>
        ) : (
          <select
            value={learningSpaceId}
            onChange={(e) => setLearningSpaceId(e.target.value)}
            disabled={loadingSpaces || submitting}
            className="w-full rounded-xl border border-slate-200 bg-surface-input px-3.5 py-2.5 text-sm text-slate-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:opacity-50 dark:border-slate-700 dark:bg-white/5 dark:text-slate-100"
          >
            {loadingSpaces ? (
              <option>Loading spaces…</option>
            ) : (
              spaces.map((s) => (
                <option key={s.id} value={String(s.id)}>
                  {s.name}
                </option>
              ))
            )}
          </select>
        )}
      </div>

      {/* Day */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Day
        </label>
        <select
          value={day}
          onChange={(e) => setDay(e.target.value)}
          disabled={submitting}
          className="w-full rounded-xl border border-slate-200 bg-surface-input px-3.5 py-2.5 text-sm text-slate-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-white/5 dark:text-slate-100"
        >
          {WEEKDAYS.map((w) => <option key={w} value={w}>{w}</option>)}
        </select>
      </div>

      {/* Start & End Time */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Start Time</label>
          <TimePicker value={startTime} onChange={setStartTime} disabled={submitting} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">End Time</label>
          <TimePicker value={endTime} onChange={setEndTime} disabled={submitting} />
        </div>
      </div>

      {/* Server error */}
      {error && (
        <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600 dark:bg-rose-900/20 dark:text-rose-400">
          {error}
        </p>
      )}

      <div className="flex items-center justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-white/5">
          Cancel
        </button>
        <button type="submit" disabled={!canSubmit}
          className="rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60">
          {submitting ? "Adding…" : "Add Schedule"}
        </button>
      </div>
    </form>
  );
}
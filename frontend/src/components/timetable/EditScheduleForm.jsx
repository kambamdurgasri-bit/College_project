import { useState, useEffect } from "react";
import { Trash2, BookOpen } from "lucide-react";
import { learningSpaceService } from "../../services/learningSpaceService";
import { WEEKDAYS } from "../../utils/timetableHelpers";

// ── Inline AM/PM time picker (Compact layout) ────────────────────────────────
function TimePicker({ value, onChange, disabled, "aria-label": ariaLabel }) {
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
    "rounded-lg border border-slate-200 bg-surface-input px-1.5 py-1.5 text-xs text-slate-800 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/20 disabled:opacity-50 dark:border-slate-700 dark:bg-white/5 dark:text-slate-100 cursor-pointer";

  return (
    <div className="flex items-center gap-1 shrink-0" aria-label={ariaLabel}>
      <select
        value={hour}
        disabled={disabled}
        onChange={(e) => {
          setHour(e.target.value);
          emit(e.target.value, minute, period);
        }}
        className={`${sel} w-[46px] pr-1 text-center`}
        aria-label="Hour"
      >
        {Array.from({ length: 12 }, (_, i) => String(i + 1)).map((h) => (
          <option key={h} value={h}>
            {h}
          </option>
        ))}
      </select>
      <span className="text-xs text-slate-500 dark:text-slate-400">:</span>
      <select
        value={minute}
        disabled={disabled}
        onChange={(e) => {
          setMinute(e.target.value);
          emit(hour, e.target.value, period);
        }}
        className={`${sel} w-[48px] pr-1 text-center`}
        aria-label="Minute"
      >
        {["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"].map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>
      <div className="flex overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700 shrink-0">
        {["AM", "PM"].map((p) => (
          <button
            key={p}
            type="button"
            disabled={disabled}
            onClick={() => {
              setPeriod(p);
              emit(hour, minute, p);
            }}
            className={`px-1.5 py-1.5 text-xs font-semibold transition-colors disabled:opacity-50 ${
              period === p
                ? "bg-brand-600 text-white"
                : "bg-surface-input text-slate-500 hover:bg-slate-100 dark:bg-white/5 dark:text-slate-400 dark:hover:bg-white/10"
            }`}
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── EditScheduleForm ─────────────────────────────────────────────────────────
/**
 * Compact, pre-populated edit form linked to an existing Learning Space.
 *
 * Props:
 *   initialValues  – { id, day, startTime, endTime, learningSpaceId, learningSpace }
 *   onSubmit({ learningSpaceId, day, startTime, endTime })
 *   onDelete()
 *   onCancel()
 *   submitting, deleting – booleans
 *   error – string | null
 */
export default function EditScheduleForm({
  initialValues,
  onSubmit,
  onCancel,
  onDelete,
  submitting,
  deleting,
  error,
}) {
  const [spaces, setSpaces] = useState([]);
  const [loadingSpaces, setLoadingSpaces] = useState(true);
  const [learningSpaceId, setLearningSpaceId] = useState(
    initialValues?.learningSpaceId ? String(initialValues.learningSpaceId) : ""
  );
  const [day, setDay] = useState(initialValues?.day || "Monday");
  const [startTime, setStartTime] = useState(initialValues?.startTime || "09:00");
  const [endTime, setEndTime] = useState(initialValues?.endTime || "10:00");

  // Re-sync form state when a different event opens in the same dialog instance.
  useEffect(() => {
    setLearningSpaceId(
      initialValues?.learningSpaceId ? String(initialValues.learningSpaceId) : ""
    );
    setDay(initialValues?.day || "Monday");
    setStartTime(initialValues?.startTime || "09:00");
    setEndTime(initialValues?.endTime || "10:00");
  }, [initialValues]);

  // Load all learning spaces for the dropdown.
  useEffect(() => {
    let cancelled = false;
    learningSpaceService
      .list()
      .then((data) => {
        if (!cancelled) {
          setSpaces(data || []);
          // If the current entry has no linked space, default to first available.
          if (!initialValues?.learningSpaceId && data && data.length > 0) {
            setLearningSpaceId(String(data[0].id));
          }
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingSpaces(false);
      });
    return () => {
      cancelled = true;
    };
  }, [initialValues?.learningSpaceId]);

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

  const busy = submitting || deleting;
  const noSpaces = !loadingSpaces && spaces.length === 0;
  const canSubmit = !busy && !loadingSpaces && !!learningSpaceId;

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5">
      {/* Learning Space selector */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Learning Space
        </label>

        {noSpaces ? (
          <div className="flex items-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-2.5 dark:border-slate-700 dark:bg-white/5">
            <BookOpen className="h-4 w-4 shrink-0 text-slate-400" />
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No Learning Spaces available.
            </p>
          </div>
        ) : (
          <select
            value={learningSpaceId}
            onChange={(e) => setLearningSpaceId(e.target.value)}
            disabled={loadingSpaces || busy}
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
          disabled={busy}
          className="w-full rounded-xl border border-slate-200 bg-surface-input px-3.5 py-2.5 text-sm text-slate-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-white/5 dark:text-slate-100"
        >
          {WEEKDAYS.map((w) => (
            <option key={w} value={w}>
              {w}
            </option>
          ))}
        </select>
      </div>

      {/* Time (Start & End Time side-by-side) */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Time
        </label>
        <div className="flex items-center justify-between gap-1 sm:gap-2">
          <TimePicker
            value={startTime}
            onChange={setStartTime}
            disabled={busy}
            aria-label="Start time"
          />
          <span className="shrink-0 text-xs font-semibold text-slate-400 dark:text-slate-500">—</span>
          <TimePicker
            value={endTime}
            onChange={setEndTime}
            disabled={busy}
            aria-label="End time"
          />
        </div>
      </div>

      {/* Server error */}
      {error && (
        <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600 dark:bg-rose-900/20 dark:text-rose-400">
          {error}
        </p>
      )}

      {/* Action buttons */}
      <div className="flex items-center justify-between gap-3 pt-2">
        {/* Delete – destructive, left-aligned */}
        <button
          type="button"
          onClick={onDelete}
          disabled={busy}
          className="flex items-center gap-1.5 rounded-xl border border-rose-200 px-4 py-2.5 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50 disabled:opacity-60 dark:border-rose-800/60 dark:text-rose-400 dark:hover:bg-rose-900/20"
        >
          <Trash2 className="h-3.5 w-3.5" />
          {deleting ? "Deleting…" : "Delete Schedule"}
        </button>

        {/* Cancel + Save – right-aligned */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-60 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!canSubmit}
            className="rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60"
          >
            {submitting ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </form>
  );
}

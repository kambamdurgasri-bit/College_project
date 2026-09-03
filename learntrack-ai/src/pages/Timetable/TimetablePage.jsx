import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Plus, AlertTriangle } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import Dialog from "../../components/common/Dialog";
import WeekView from "../../components/timetable/WeekView";
import DayView from "../../components/timetable/DayView";
import AddScheduleForm from "../../components/timetable/AddScheduleForm";
import { timetableService } from "../../services/timetableService";
import { getTheme } from "../../utils/theme";
import { timetableLegend } from "../../mock-data/timetable";

export default function TimetablePage() {
  const [status, setStatus] = useState("loading");
  const [weekLabel, setWeekLabel] = useState("");
  const [weekDays, setWeekDays] = useState([]);
  const [events, setEvents] = useState([]);
  const [view, setView] = useState("Day"); // Week | Day
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    timetableService
      .getWeek()
      .then((data) => {
        if (cancelled) return;
        setWeekLabel(data.weekLabel);
        setWeekDays(data.weekDays);
        setEvents(data.events);
        setStatus("success");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const eventsByDay = useMemo(() => {
    const map = {};
    events.forEach((e) => {
      map[e.dayIndex] = map[e.dayIndex] || [];
      map[e.dayIndex].push(e);
    });
    return map;
  }, [events]);

  const handleAddSchedule = async (values) => {
    setSubmitting(true);
    try {
      // TODO: once the backend is ready, timetableService.createEvent will
      // POST to /api/timetable instead of resolving mock data.
      const created = await timetableService.createEvent(values);
      setEvents((prev) => [...prev, created]);
      setDialogOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Timetable"
        subtitle="Plan your study schedule and stay consistent."
        actions={
          <>
            <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 dark:bg-white/5">
              {["Day", "Week"].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setView(v)}
                  className={`rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors ${
                    view === v
                      ? "bg-brand-600 text-white shadow-sm"
                      : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                  }`}
                >
                  {v} View
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setDialogOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-700"
            >
              <Plus className="h-4 w-4" /> Add Schedule
            </button>
          </>
        }
      />

      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rounded-lg border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-white/5"
            aria-label="Previous week"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            {weekLabel}
          </p>
          <button
            type="button"
            className="rounded-lg border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-white/5"
            aria-label="Next week"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <button
          type="button"
          className="rounded-xl border border-slate-200 px-3.5 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-white/5"
        >
          Today
        </button>
      </div>

      {status === "loading" && (
        <div className="h-[640px] animate-pulse rounded-2xl bg-slate-200 dark:bg-white/10" />
      )}

      {status === "error" && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center dark:border-slate-700 dark:bg-surface-dark-card">
          <AlertTriangle className="mb-3 h-8 w-8 text-rose-500" />
          <p className="font-medium text-slate-700 dark:text-slate-200">
            Couldn't load your timetable
          </p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Something went wrong. Please try again.
          </p>
        </div>
      )}

      {status === "success" && view === "Week" && (
        <WeekView weekDays={weekDays} eventsByDay={eventsByDay} todayIndex={-1} />
      )}

      {status === "success" && view === "Day" && (
        <div>
          <div className="mb-4 flex flex-wrap gap-2">
            {weekDays.map((d) => (
              <button
                key={d.dayIndex}
                type="button"
                onClick={() => setActiveDayIndex(d.dayIndex)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  activeDayIndex === d.dayIndex
                    ? "bg-brand-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10"
                }`}
              >
                {d.label} {d.date}
              </button>
            ))}
          </div>
          <DayView
            day={weekDays.find((d) => d.dayIndex === activeDayIndex)}
            events={eventsByDay[activeDayIndex] || []}
          />
        </div>
      )}

      {status === "success" && (
        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2">
          {timetableLegend.map((item) => {
            const theme = getTheme(item.colorId);
            return (
              <div key={item.subjectId} className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${theme.dot}`} />
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      )}

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title="Add Schedule"
        description="Plan a new study session on your timetable."
      >
        <AddScheduleForm
          submitting={submitting}
          onSubmit={handleAddSchedule}
          onCancel={() => setDialogOpen(false)}
        />
      </Dialog>
    </div>
  );
}

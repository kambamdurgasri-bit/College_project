import { useMemo, useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  BookMarked,
  GraduationCap,
  Percent,
  Target,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  trendData,
  subjectPerformance,
  recentActivity,
} from "../../mock-data/analytics";

const TREND_RANGES = ["Daily", "Weekly", "Monthly"];

function Card({ children, className = "" }) {
  return (
    <section
      className={`rounded-2xl border border-slate-200 bg-white shadow-card dark:border-slate-800/80 dark:bg-surface-dark-card dark:shadow-card-dark ${className}`}
    >
      {children}
    </section>
  );
}

function SectionHeading({ title, right }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-4">
      <h2 className="text-base font-semibold text-slate-900 dark:text-white">
        {title}
      </h2>
      {right}
    </div>
  );
}

function MiniStat({ icon: Icon, label, value, iconClassName = "text-purple-600" }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-white/5">
        <Icon className={`h-5 w-5 ${iconClassName}`} />
      </div>
      <div>
        <p className="text-lg font-bold text-slate-900 dark:text-white">{value}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
      </div>
    </div>
  );
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg dark:border-slate-700 dark:bg-slate-900">
      <p className="font-semibold text-slate-900 dark:text-white">{label}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey} className="mt-1 text-slate-600 dark:text-slate-300">
          {entry.name}: {entry.value}%
        </p>
      ))}
    </div>
  );
}

export default function AnalyticsPage() {
  const [range, setRange] = useState("Weekly");

  const data = trendData[range];

  const averageScore = useMemo(() => {
    if (!data.length) return 0;
    return Math.round(
      data.reduce((total, item) => total + item.score, 0) / data.length,
    );
  }, [data]);

  const averageAccuracy = useMemo(() => {
    if (!data.length) return 0;
    return Math.round(
      data.reduce((total, item) => total + item.accuracy, 0) / data.length,
    );
  }, [data]);

  const strongestSubject = useMemo(
    () =>
      subjectPerformance.reduce((best, current) =>
        current.score > best.score ? current : best,
      ),
    [],
  );

  const weakestSubject = useMemo(
    () =>
      subjectPerformance.reduce((weakest, current) =>
        current.score < weakest.score ? current : weakest,
      ),
    [],
  );

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-purple-600" />
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Analytics
          </h1>
        </div>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Track your learning performance over time.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Card className="p-4">
          <MiniStat
            icon={Target}
            label="Average score"
            value={`${averageScore}%`}
          />
        </Card>

        <Card className="p-4">
          <MiniStat
            icon={Percent}
            label="Average accuracy"
            value={`${averageAccuracy}%`}
            iconClassName="text-blue-600"
          />
        </Card>

        <Card className="p-4">
          <MiniStat
            icon={GraduationCap}
            label="Strongest subject"
            value={strongestSubject.subject}
            iconClassName="text-emerald-600"
          />
        </Card>
      </div>

      <Card className="p-5">
        <SectionHeading
          title="Performance Trend"
          right={
            <div className="flex rounded-xl bg-slate-100 p-1 dark:bg-white/5">
              {TREND_RANGES.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setRange(item)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                    range === item
                      ? "bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white"
                      : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          }
        />

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopOpacity={0.25} />
                  <stop offset="100%" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Area
                type="monotone"
                dataKey="score"
                name="Score"
                stroke="currentColor"
                fill="url(#scoreGradient)"
                className="text-purple-600"
                strokeWidth={2.5}
              />
              <Area
                type="monotone"
                dataKey="accuracy"
                name="Accuracy"
                stroke="currentColor"
                fill="none"
                className="text-blue-500"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div>
        <Card className="p-5">
          <SectionHeading title="Subject Performance" />

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={subjectPerformance}
                layout="vertical"
                margin={{ top: 0, right: 20, left: 20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis
                  type="number"
                  domain={[0, 100]}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="subject"
                  width={90}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="score" name="Score" radius={[0, 6, 6, 0]}>
                  {subjectPerformance.map((item) => (
                    <Cell
                      key={item.subject}
                      fill={
                        item.score < 50
                          ? "#ef4444"
                          : item.score < 70
                            ? "#f59e0b"
                            : "#8b5cf6"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <span>
              Weakest subject:{" "}
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {weakestSubject.subject}
              </span>{" "}
              ({weakestSubject.score}%)
            </span>
          </div>
        </Card>

        <Card className="p-5">
          <SectionHeading title="Recent Quiz Activity" />

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {recentActivity.map((activity) => (
              <div
                key={`${activity.time}-${activity.title}`}
                className="flex gap-4 py-4 first:pt-0 last:pb-0"
              >
                <div className="flex w-14 shrink-0 flex-col items-center">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                    {activity.time}
                  </span>
                  <span className="mt-1 text-[10px] text-slate-400">
                    {activity.day}
                  </span>
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                    {activity.title}
                  </p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {activity.meta}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="flex items-start gap-3 p-4">
        <BookMarked className="mt-0.5 h-5 w-5 shrink-0 text-purple-600" />
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">
            Analytics is currently using mock data
          </p>
          <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
            The data layer is isolated so the future analytics API can replace
            this source without changing the page structure.
          </p>
        </div>
      </Card>
    </div>
  );
}

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  BarChart3,
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

import { apiRequest } from "../../services/api";

function Card({ children, className = "" }) {
  return (
    <section
      className={`rounded-2xl border border-slate-200 bg-surface-light shadow-card dark:border-slate-800/80 dark:bg-surface-dark-card dark:shadow-card-dark ${className}`}
    >
      {children}
    </section>
  );
}

function SectionHeading({ title }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-4">
      <h2 className="text-base font-semibold text-slate-900 dark:text-white">
        {title}
      </h2>
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
    <div className="rounded-xl border border-slate-200 bg-surface-light px-3 py-2 text-xs shadow-lg dark:border-slate-700 dark:bg-slate-900">
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
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        setLoading(true);
        const res = await apiRequest("/analytics");
        setAnalytics(res);
      } catch (err) {
        console.error("Failed to fetch analytics:", err);
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, []);

  const totalAttempts = analytics?.quizStatistics?.totalAttempts ?? 0;
  const avgScore = analytics?.quizStatistics?.averageScore ?? 0;

  const subjectPerformance = (analytics?.subjectPerformance || []).map((sp) => ({
    subject: sp.learningSpaceName,
    score: sp.averageScore,
    quizzesTaken: sp.quizzesTaken,
  }));

  const trendData = (analytics?.performanceTrend || []).map((t, idx) => ({
    label: new Date(t.attemptedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    score: t.score,
    topic: t.topic,
  }));

  const strongestSubject = subjectPerformance.length > 0
    ? subjectPerformance.reduce((best, cur) => (cur.score > best.score ? cur : best))
    : { subject: "N/A", score: 0 };

  const weakestSubject = subjectPerformance.length > 0
    ? subjectPerformance.reduce((worst, cur) => (cur.score < worst.score ? cur : worst))
    : { subject: "N/A", score: 0 };

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-7xl p-8 text-center text-slate-500">
        Loading analytics from database...
      </div>
    );
  }

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
          Track your real database learning performance over time.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Card className="p-4">
          <MiniStat
            icon={Target}
            label="Average score"
            value={`${avgScore}%`}
          />
        </Card>

        <Card className="p-4">
          <MiniStat
            icon={Percent}
            label="Total Quiz Attempts"
            value={totalAttempts}
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
        <SectionHeading title="Performance Trend" />
        {trendData.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">
            No quiz attempts recorded yet. Attempt a quiz to build your performance trend!
          </div>
        ) : (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>

      <Card className="p-5">
        <SectionHeading title="Subject Performance" />
        {subjectPerformance.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">
            No learning space scores recorded yet. Create a Learning Space and take a quiz!
          </div>
        ) : (
          <>
            <div className="h-72 w-full">
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
                    width={110}
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
                Focus Area:{" "}
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  {weakestSubject.subject}
                </span>{" "}
                ({weakestSubject.score}% average)
              </span>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}

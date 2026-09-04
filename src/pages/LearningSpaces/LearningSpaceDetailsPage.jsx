import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Layers,
  CheckCircle2,
  Clock,
  Circle,
  CheckCircle,
  Flame,
  Percent,
  BookOpen,
  ClipboardCheck,
  CalendarDays,
  AlertTriangle,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import SubjectIcon from "../../components/common/SubjectIcon";
import ProgressRing from "../../components/common/ProgressRing";
import StatisticCard from "../../components/common/StatisticCard";
import { learningSpaceService } from "../../services/learningSpaceService";
import { progressOverview, recentActivity } from "../../mock-data/activity";
import { getTheme } from "../../utils/theme";

const TABS = ["Overview", "Topics", "Resources", "Activity", "Quizzes", "Notes"];

const ACTIVITY_ICON = {
  completed: CheckCircle,
  streak: Flame,
  quiz: Percent,
};

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs shadow-md dark:border-slate-700 dark:bg-surface-dark-card">
      <p className="font-medium text-slate-700 dark:text-slate-200">{label}</p>
      <p className="text-brand-600 dark:text-brand-400">{payload[0].value}%</p>
    </div>
  );
}

export default function LearningSpaceDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");
  const [space, setSpace] = useState(null);
  const [activeTab, setActiveTab] = useState("Overview");

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    learningSpaceService
      .getById(id)
      .then((data) => {
        if (cancelled) return;
        if (!data) setStatus("not-found");
        else {
          setSpace(data);
          setStatus("success");
        }
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (status === "loading") {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-32 w-full rounded-2xl bg-slate-200 dark:bg-white/10" />
        <div className="h-10 w-full rounded-xl bg-slate-200 dark:bg-white/10" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 rounded-2xl bg-slate-200 dark:bg-white/10" />
          ))}
        </div>
      </div>
    );
  }

  if (status === "error" || status === "not-found") {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center dark:border-slate-700 dark:bg-surface-dark-card">
        <AlertTriangle className="mb-3 h-8 w-8 text-rose-500" />
        <p className="font-medium text-slate-700 dark:text-slate-200">
          {status === "not-found"
            ? "This learning space could not be found."
            : "Couldn't load this learning space."}
        </p>
        <button
          type="button"
          onClick={() => navigate("/learning-spaces")}
          className="mt-4 rounded-xl bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
        >
          Back to Learning Spaces
        </button>
      </div>
    );
  }

  const theme = getTheme(space.colorId);

  return (
    <div>
      <button
        type="button"
        onClick={() => navigate("/learning-spaces")}
        className="mb-4 flex items-center gap-2 rounded-lg p-1.5 text-sm font-medium text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/5"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      {/* Banner */}
      <div className={`mb-6 flex flex-col gap-6 rounded-2xl ${theme.solidBg} p-6 sm:flex-row sm:items-center sm:justify-between`}>
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/20">
            <SubjectIcon icon={space.icon} className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">{space.name}</h1>
            <p className="mt-1 max-w-md text-sm text-white/80">{space.description}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white">
                {space.topicsTotal} Topics
              </span>
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white">
                {space.status}
              </span>
            </div>
          </div>
        </div>
        <div className="flex justify-center sm:justify-end">
          <ProgressRing value={space.progress} label="Overall Progress" />
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-6 overflow-x-auto border-b border-slate-200 no-scrollbar dark:border-slate-800/80">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`shrink-0 border-b-2 pb-3 text-sm font-medium transition-colors ${
              activeTab === tab
                ? "border-brand-600 text-brand-600 dark:text-brand-400"
                : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Overview" ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatisticCard icon={Layers} label="Total Topics" value={space.topicsTotal} colorId="blue" />
            <StatisticCard icon={CheckCircle2} label="Completed" value={space.topicsCompleted} colorId="green" />
            <StatisticCard icon={Clock} label="In Progress" value={space.topicsInProgress} colorId="purple" />
            <StatisticCard icon={Circle} label="Not Started" value={space.topicsNotStarted} colorId="red" />
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card dark:border-slate-800/80 dark:bg-surface-dark-card dark:shadow-card-dark lg:col-span-2">
              <h3 className="mb-4 text-sm font-semibold text-slate-700 dark:text-slate-200">
                Progress Overview
              </h3>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={progressOverview} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-slate-100 dark:stroke-white/10" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 11, fill: "#94a3b8" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      domain={[0, 100]}
                      tick={{ fontSize: 11, fill: "#94a3b8" }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => `${v}%`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="progress"
                      stroke="#7C3AED"
                      strokeWidth={2.5}
                      dot={{ r: 3, fill: "#7C3AED" }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card dark:border-slate-800/80 dark:bg-surface-dark-card dark:shadow-card-dark">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Recent Activity
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveTab("Activity")}
                  className="text-xs font-medium text-brand-600 hover:underline dark:text-brand-400"
                >
                  View All
                </button>
              </div>
              <ul className="space-y-3.5">
                {recentActivity.map((item) => {
                  const Icon = ACTIVITY_ICON[item.type] || CheckCircle;
                  return (
                    <li key={item.id} className="flex items-start gap-3">
                      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
                      <div>
                        <p className="text-sm text-slate-700 dark:text-slate-200">{item.label}</p>
                        <p className="text-xs text-slate-400">{item.time}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <button
                type="button"
                onClick={() => setActiveTab("Topics")}
                className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-card transition-colors hover:bg-slate-50 dark:border-slate-800/80 dark:bg-surface-dark-card dark:shadow-card-dark dark:hover:bg-white/5"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 dark:bg-brand-500/15">
                  <BookOpen className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-100">Study Topics</p>
                  <p className="text-xs text-slate-400">Continue Learning</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("Quizzes")}
                className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-card transition-colors hover:bg-slate-50 dark:border-slate-800/80 dark:bg-surface-dark-card dark:shadow-card-dark dark:hover:bg-white/5"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-500/15">
                  <ClipboardCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-100">Take Quiz</p>
                  <p className="text-xs text-slate-400">Test Your Knowledge</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => navigate("/timetable")}
                className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-card transition-colors hover:bg-slate-50 dark:border-slate-800/80 dark:bg-surface-dark-card dark:shadow-card-dark dark:hover:bg-white/5"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-500/15">
                  <CalendarDays className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-100">View Timetable</p>
                  <p className="text-xs text-slate-400">Today's Schedule</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center dark:border-slate-700 dark:bg-surface-dark-card">
          <p className="font-medium text-slate-700 dark:text-slate-200">{activeTab} coming soon</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            This section is outside Module 3's current scope.
          </p>
        </div>
      )}
    </div>
  );
}

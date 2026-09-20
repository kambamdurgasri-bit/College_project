import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  Star,
  AlertTriangle,
} from "lucide-react";
import { dashboardService } from "../../services/dashboardService";
import { useProfile } from "../../services/profileService";
import StatCard from "../../components/dashboard/StatCard";
import ContinueLearningCard from "../../components/dashboard/ContinueLearningCard";
import LearningProgressDonut from "../../components/dashboard/LearningProgressDonut";
import WeeklyProgressChart from "../../components/dashboard/WeeklyProgressChart";

// Helper for dynamic greeting from current time
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

// Map recent quiz results or progress entries to weekly data points
function computeWeeklyData(recentResults = []) {
  if (!recentResults || recentResults.length === 0) return [];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const map = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };
  const counts = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };

  let hasData = false;
  recentResults.forEach((r) => {
    if (r.attemptedAt) {
      hasData = true;
      const d = new Date(r.attemptedAt);
      const dayName = days[(d.getDay() + 6) % 7];
      map[dayName] += r.accuracy || r.score || 0;
      counts[dayName] += 1;
    }
  });

  if (!hasData) return [];

  return days.map((day) => ({
    day,
    progress: counts[day] > 0 ? Math.round(map[day] / counts[day]) : 0,
  }));
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { data: userProfile } = useProfile();
  const username = userProfile?.fullName || "Student";

  useEffect(() => {
    let cancelled = false;
    const loadDashboard = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await dashboardService.getSummary();
        if (!cancelled) {
          setData(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Failed to load dashboard.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };
    loadDashboard();
    return () => {
      cancelled = true;
    };
  }, []);

  const greeting = getGreeting();

  const currentSession = useMemo(() => {
    if (data?.todaySchedule && data.todaySchedule.length > 0) {
      return data.todaySchedule[0];
    }
    if (data?.recentQuizResults && data.recentQuizResults.length > 0) {
      return {
        subject: data.recentQuizResults[0].learningSpaceName || data.recentQuizResults[0].topic,
        topic: data.recentQuizResults[0].topic,
      };
    }
    return null;
  }, [data]);

  const tasksCompletedCount = useMemo(() => {
    if (data?.progress?.completedTopics !== undefined) {
      return data.progress.completedTopics;
    }
    if (data?.progress?.topicsCompleted !== undefined) {
      return data.progress.topicsCompleted;
    }
    return data?.recentQuizResults?.length || 0;
  }, [data]);

  const weeklyChartData = useMemo(() => {
    return computeWeeklyData(data?.recentQuizResults);
  }, [data]);

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-[#F8F9FD] p-6 sm:p-8 dark:bg-slate-950 space-y-6">
        <div className="space-y-2">
          <div className="h-4 w-32 animate-pulse rounded bg-slate-200 dark:bg-white/10" />
          <div className="h-8 w-64 animate-pulse rounded bg-slate-200 dark:bg-white/10" />
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl bg-slate-200 dark:bg-white/10" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="h-72 animate-pulse rounded-3xl bg-slate-200 dark:bg-white/10 lg:col-span-8" />
          <div className="h-72 animate-pulse rounded-2xl bg-slate-200 dark:bg-white/10 lg:col-span-4" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen bg-[#F8F9FD] p-6 sm:p-8 dark:bg-slate-950">
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-800 dark:bg-surface-dark-card">
          <AlertTriangle className="mb-3 h-10 w-10 text-rose-500" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Couldn't load your dashboard
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {error}
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-4 rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#F8F9FD] p-6 sm:p-8 dark:bg-slate-950 space-y-6">
      {/* ── HEADER ─────────────────────────────────────────────────── */}
      <div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          {greeting},
        </p>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          {username}
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Continue your learning journey and make progress today.
        </p>
      </div>

      {/* ── STAT CARDS (4 equal-width cards across the page) ─────────── */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={BookOpen}
          value={data?.totalLearningSpaces ?? 0}
          label="Learning Spaces"
          sublabel="Active study spaces"
          tintBg="bg-purple-100 dark:bg-purple-950/40"
          tintText="text-purple-600 dark:text-purple-400"
        />
        <StatCard
          icon={CheckCircle2}
          value={tasksCompletedCount}
          label="Tasks Completed"
          sublabel="This week"
          tintBg="bg-emerald-100 dark:bg-emerald-950/40"
          tintText="text-emerald-600 dark:text-emerald-400"
        />
        <StatCard
          icon={ClipboardCheck}
          value={data?.totalQuizzes ?? 0}
          label="Quizzes Taken"
          sublabel="This week"
          tintBg="bg-blue-100 dark:bg-blue-950/40"
          tintText="text-blue-600 dark:text-blue-400"
        />
        <StatCard
          icon={Star}
          value={`${data?.averageScore ?? 0}%`}
          label="Average Score"
          sublabel="Across all quizzes"
          tintBg="bg-amber-100 dark:bg-amber-950/40"
          tintText="text-amber-600 dark:text-amber-400"
        />
      </div>

      {/* ── MAIN TWO-COLUMN SECTION (Left 68% / Right 32%) ───────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <ContinueLearningCard
            currentSession={currentSession}
            progressPercentage={data?.progressPercentage ?? data?.averageScore ?? 0}
          />
        </div>
        <div className="lg:col-span-4">
          <LearningProgressDonut
            progressPercentage={data?.progressPercentage ?? data?.averageScore ?? 0}
          />
        </div>
      </div>

      {/* ── WEEKLY LEARNING PROGRESS (Full-Width Chart Card) ─────────── */}
      <WeeklyProgressChart weeklyData={weeklyChartData} />
    </div>
  );
}

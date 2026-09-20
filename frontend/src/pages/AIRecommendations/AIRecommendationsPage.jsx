import { useEffect, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Clock3,
  Flame,
  Lightbulb,
  Sparkles,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import ProgressRing from "../../components/common/ProgressRing";
import { apiRequest } from "../../services/api";

function Card({ children, className = "" }) {
  return (
    <section
      className={`rounded-2xl border border-slate-200 bg-surface-light p-5 shadow-card dark:border-slate-800/80 dark:bg-surface-dark-card dark:shadow-card-dark ${className}`}
    >
      {children}
    </section>
  );
}

export default function AIRecommendationsPage() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRecommendations() {
      try {
        setLoading(true);
        const res = await apiRequest("/recommendations");
        setData(res);
      } catch (err) {
        console.error("Failed to load recommendations:", err);
      } finally {
        setLoading(false);
      }
    }
    loadRecommendations();
  }, []);

  const weakTopics = data?.weakTopics || [];
  const strongTopics = data?.strongTopics || [];
  const suggestions = data?.suggestions || [];

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-600" />
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            AI Recommendations
          </h1>
        </div>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Personalized next steps based on your real learning activity and quiz results.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 dark:bg-orange-500/10">
            <Flame className="h-5 w-5 text-orange-500" />
          </div>
          <div>
            <p className="text-lg font-bold text-slate-900 dark:text-white">
              {data?.totalAttempts ?? 0}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Quizzes Attempted
            </p>
          </div>
        </Card>

        <Card className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-500/10">
            <BookOpen className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <p className="text-lg font-bold text-slate-900 dark:text-white">
              {weakTopics.length}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Weak topics identified
            </p>
          </div>
        </Card>
      </div>

      <Card>
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            Recommended Actions
          </h2>
          <span className="text-xs text-slate-400">Live AI Suggestions</span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-sm text-slate-500">
            Analyzing quiz attempts & schedule...
          </div>
        ) : suggestions.length === 0 ? (
          <p className="text-sm text-slate-500">No suggestions available yet. Take a quiz to get recommendations!</p>
        ) : (
          <div className="space-y-4">
            {suggestions.map((item, idx) => (
              <article
                key={idx}
                className="rounded-xl border border-purple-200 bg-purple-50/50 p-4 dark:border-purple-500/20 dark:bg-purple-500/10"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-purple-600 dark:text-purple-400">
                  {item.priority} PRIORITY
                </p>
                <h3 className="mt-1 text-base font-semibold text-slate-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  {item.description}
                </p>
                <button
                  type="button"
                  onClick={() => navigate("/learning-spaces")}
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-purple-700 hover:underline dark:text-purple-300"
                >
                  Go to Learning Spaces
                  <ArrowRight className="h-4 w-4" />
                </button>
              </article>
            ))}
          </div>
        )}
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              Weak Topics (&lt; 70% Avg)
            </h2>
            <span className="text-xs text-slate-400">Needs attention</span>
          </div>

          {weakTopics.length === 0 ? (
            <div className="flex items-center gap-2 p-4 text-sm text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-5 w-5" />
              <span>No weak topics detected! Great performance.</span>
            </div>
          ) : (
            <div className="space-y-3">
              {weakTopics.map((topic, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 dark:bg-white/5"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-500/10">
                    <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-100">
                      {topic.topic}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {topic.spaceName} • {topic.attemptsCount} attempt(s)
                    </p>
                  </div>
                  <ProgressRing
                    value={topic.avgScore}
                    size={48}
                    strokeWidth={5}
                    trackClassName="text-slate-200 dark:text-slate-700"
                    progressClassName="text-amber-500"
                    label=""
                  />
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <div className="mb-4 flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              Strong Topics (&ge; 70% Avg)
            </h2>
          </div>
          {strongTopics.length === 0 ? (
            <p className="p-4 text-sm text-slate-500">Take more quizzes to build your strong topics list.</p>
          ) : (
            <div className="space-y-3">
              {strongTopics.map((topic, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 rounded-xl bg-emerald-50 p-3 dark:bg-emerald-500/10"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-500/20">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-100">
                      {topic.topic}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {topic.spaceName} • {topic.attemptsCount} attempt(s)
                    </p>
                  </div>
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    {topic.avgScore}%
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

    </div>
  );
}
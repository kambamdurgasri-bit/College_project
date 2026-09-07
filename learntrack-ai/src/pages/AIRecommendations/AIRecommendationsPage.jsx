import {
  ArrowRight,
  BookOpen,
  Clock3,
  Flame,
  Lightbulb,
  Sparkles,
} from "lucide-react";

import ProgressRing from "../../components/common/ProgressRing";
import {
  learningTips,
  recommendations,
  suggestedResources,
  weakTopics,
} from "../../mock-data/analytics";

const toneStyles = {
  urgent: "border-red-200 bg-red-50 dark:border-red-500/20 dark:bg-red-500/10",
  practice: "border-blue-200 bg-blue-50 dark:border-blue-500/20 dark:bg-blue-500/10",
  progress:
    "border-emerald-200 bg-emerald-50 dark:border-emerald-500/20 dark:bg-emerald-500/10",
};

function Card({ children, className = "" }) {
  return (
    <section
      className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-card dark:border-slate-800/80 dark:bg-surface-dark-card dark:shadow-card-dark ${className}`}
    >
      {children}
    </section>
  );
}

export default function AIRecommendationsPage() {
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
          Personalized next steps based on your recent learning activity.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 dark:bg-orange-500/10">
            <Flame className="h-5 w-5 text-orange-500" />
          </div>
          <div>
            <p className="text-lg font-bold text-slate-900 dark:text-white">7 days</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Study streak</p>
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
            Recommended actions
          </h2>
          <span className="text-xs text-slate-400">Prioritized for you</span>
        </div>

        <div className="space-y-4">
          {recommendations.map((recommendation) => (
            <article
              key={recommendation.title}
              className={`rounded-xl border p-4 ${toneStyles[recommendation.tone]}`}
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {recommendation.subject}
              </p>
              <h3 className="mt-2 text-base font-semibold text-slate-900 dark:text-white">
                {recommendation.title}
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                {recommendation.reason}
              </p>
              <button
                type="button"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-purple-700 dark:text-purple-300"
              >
                {recommendation.action}
                <ArrowRight className="h-4 w-4" />
              </button>
            </article>
          ))}
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              Weak topics identified
            </h2>
            <span className="text-xs text-slate-400">Needs attention</span>
          </div>

          <div className="space-y-3">
            {weakTopics.map((topic) => {
              const Icon = topic.icon;

              return (
                <div
                  key={topic.topic}
                  className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 dark:bg-white/5"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-500/10">
                    <Icon className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-100">
                      {topic.topic}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {topic.subject}
                    </p>
                  </div>
                  <ProgressRing
                    value={topic.accuracy}
                    size={48}
                    strokeWidth={5}
                    trackClassName="text-slate-200 dark:text-slate-700"
                    progressClassName="text-amber-500"
                    label=""
                  />
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <div className="mb-4 flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              Learning tips
            </h2>
          </div>
          <div className="space-y-3">
            {learningTips.map((tip) => (
              <div
                key={tip}
                className="rounded-xl bg-purple-50 p-3 text-sm leading-5 text-slate-700 dark:bg-purple-500/10 dark:text-slate-200"
              >
                {tip}
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Clock3 className="h-4 w-4" />
            <span>Tips refresh as your quiz history changes.</span>
          </div>
        </Card>
      </div>

      <Card>
        <div className="mb-4 flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            Suggested resources
          </h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {suggestedResources.map((resource) => (
            <button
              key={resource}
              type="button"
              className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 p-3 text-left text-sm font-medium text-slate-700 transition hover:border-purple-300 hover:text-purple-700 dark:border-slate-700 dark:text-slate-200 dark:hover:border-purple-500 dark:hover:text-purple-300"
            >
              <span>{resource}</span>
              <ArrowRight className="h-4 w-4 shrink-0" />
            </button>
          ))}
        </div>
      </Card>

    </div>
  );
}
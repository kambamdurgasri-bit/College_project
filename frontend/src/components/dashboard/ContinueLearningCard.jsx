import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

export default function ContinueLearningCard({ currentSession, progressPercentage = 0 }) {
  const navigate = useNavigate();

  const title = currentSession?.subject || currentSession?.learningSpace?.name || currentSession?.topic || "No Session Scheduled";
  const subtitle = currentSession?.startTime && currentSession?.endTime
    ? `${currentSession.startTime} – ${currentSession.endTime} (${currentSession.day || "Today"})`
    : currentSession?.subject
    ? "Scheduled study session"
    : "Select a learning space or schedule to begin studying.";

  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, progressPercentage)) / 100) * circumference;

  return (
    <div className="relative flex min-h-[270px] flex-col justify-center overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 p-6 sm:p-8 text-white shadow-xl shadow-purple-500/10 dark:shadow-none">
      {/* Decorative background shapes */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-16 right-32 h-48 w-48 rounded-full bg-indigo-400/20 blur-xl" />

      <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
        {/* Left Column: Text & CTA */}
        <div className="max-w-md space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-purple-200">
            <Sparkles className="h-3.5 w-3.5 text-purple-200" />
            <span>Current Learning Space</span>
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {currentSession ? `Continue: ${title}` : "No Active Learning Session"}
          </h2>

          <p className="text-sm text-purple-100/90 leading-relaxed">
            {subtitle}
          </p>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => navigate(currentSession ? "/timetable" : "/learning-spaces")}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-purple-700 shadow-md transition-all hover:bg-purple-50 hover:shadow-lg active:scale-[0.98]"
            >
              <span>Continue Learning</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Right Column: Circular Progress Ring */}
        <div className="flex shrink-0 items-center justify-center pt-2 md:pt-0">
          <div className="relative flex h-32 w-32 items-center justify-center">
            <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 96 96">
              {/* Background ring */}
              <circle
                cx="48"
                cy="48"
                r={radius}
                className="stroke-white/20"
                strokeWidth="8"
                fill="transparent"
              />
              {/* Progress ring */}
              <circle
                cx="48"
                cy="48"
                r={radius}
                className="stroke-white transition-all duration-1000 ease-out"
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-extrabold text-white">
                {Math.round(progressPercentage)}%
              </span>
              <span className="text-[10px] font-medium text-purple-200 uppercase tracking-wider">
                Overall
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

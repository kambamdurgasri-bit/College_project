import { GraduationCap, ShieldCheck } from "lucide-react";

function BrandPanel() {
  return (
    <div className="relative hidden overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-800 p-8 text-white md:flex md:flex-col md:justify-between">
      <div className="flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
          <GraduationCap className="h-6 w-6 text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight">LearnTrack AI</span>
      </div>

      <div className="my-auto space-y-4 py-8">
        <h2 className="text-3xl font-extrabold leading-tight">
          Learn Smarter.<br />Track Progress.<br />Improve Daily.
        </h2>
        <div className="space-y-3 pt-2">
          {[
            "AI-generated quizzes from topics or study materials",
            "Detailed performance & accuracy analytics",
            "Personalized AI recommendations based on your goals",
          ].map((point, index) => (
            <div key={index} className="flex items-start gap-2.5 text-sm text-purple-100/90">
              <ShieldCheck className="h-5 w-5 shrink-0 text-purple-300" />
              <span>{point}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-purple-200/70">
        © 2026 LearnTrack AI. Built for better learning.
      </p>
    </div>
  );
}

export default function AuthShell({ children }) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-surface p-4 dark:bg-surface-dark">
      <div className="grid w-full max-w-4xl grid-cols-1 gap-4 rounded-3xl bg-surface-light p-4 shadow-card dark:border dark:border-slate-800/80 dark:bg-surface-dark-card dark:shadow-card-dark md:grid-cols-2 md:p-5">
        <BrandPanel />
        <div className="flex flex-col justify-center px-2 py-6 sm:px-6">
          {children}
        </div>
      </div>
    </div>
  );
}

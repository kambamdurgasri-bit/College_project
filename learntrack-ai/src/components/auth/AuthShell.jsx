import { CheckCircle2, GraduationCap, ShieldCheck } from "lucide-react";

const BRAND_POINTS = [
  "AI-generated quizzes from topics or PDFs",
  "Progress analytics across every subject",
  "Personalized, performance-based recommendations",
];

function BrandPanel() {
  return (
    <div className="relative hidden overflow-hidden rounded-3xl md:flex">
      <img
        src="/brand-art.png"
        alt="LearnTrack AI"
        className="h-full w-full object-cover"
      />
    </div>
  );
}

export default function AuthShell({ children }) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-surface p-4 dark:bg-surface-dark">
      <div className="grid w-full max-w-4xl grid-cols-1 gap-4 rounded-3xl bg-white p-4 shadow-card dark:border dark:border-slate-800/80 dark:bg-surface-dark-card dark:shadow-card-dark md:grid-cols-2 md:p-5">
        <BrandPanel />
        <div className="flex flex-col justify-center px-2 py-6 sm:px-6">
          {children}
        </div>
      </div>
    </div>
  );
}

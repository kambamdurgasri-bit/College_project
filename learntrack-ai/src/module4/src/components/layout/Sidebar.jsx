import { NavLink } from "react-router-dom";
import {
  GraduationCap,
  LayoutDashboard,
  BookOpen,
  Calendar,
  HelpCircle,
  History,
  BarChart3,
  Sparkles,
  User,
  Settings,
  LogOut,
} from "lucide-react";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/learning-spaces", label: "Learning Spaces", icon: BookOpen },
  { to: "/timetable", label: "Timetable", icon: Calendar },
  { to: "/topic-quiz", label: "Topic Quiz", icon: HelpCircle },
  { to: "/quiz-history", label: "Quiz History", icon: History },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/ai-recommendations", label: "AI Recommendations", icon: Sparkles },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar({ onNavigate }) {
  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-slate-200 bg-white dark:border-slate-800/80 dark:bg-surface-dark">
      <div className="flex items-center gap-2 px-6 py-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600">
          <GraduationCap className="h-5 w-5 text-white" />
        </div>
        <span className="text-lg font-bold text-slate-900 dark:text-white">
          LearnTrack AI
        </span>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 scrollbar-thin">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white"
              }`
            }
          >
            <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={2} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-slate-200 px-3 py-4 dark:border-slate-800/80">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white"
        >
          <LogOut className="h-[18px] w-[18px]" strokeWidth={2} />
          Logout
        </button>
      </div>
    </aside>
  );
}

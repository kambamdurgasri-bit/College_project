import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  BookOpen,
  CalendarDays,
  Brain,
  BarChart3,
  Sparkles,
  UserRound,
  GraduationCap,
  Settings as SettingsIcon,
} from 'lucide-react';
import ThemeToggle from '../ui/ThemeToggle';

// NOTE: This shell exists only to give the Profile Module the same
// surrounding context as the reference dashboard. Only the User Profile
// items are functional routes — the rest are static, non-interactive
// placeholders that visually anchor the module in the app shell.

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'Learning Spaces', icon: BookOpen },
  { label: 'Timetable', icon: CalendarDays },
  { label: 'Quizzes', icon: Brain },
  { label: 'Analytics', icon: BarChart3 },
  { label: 'Recommendations', icon: Sparkles },
];

export default function DashboardShell({ user, children }) {
  return (
    <div className="min-h-screen bg-bg dark:bg-dark-bg flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-borderPurple dark:border-dark-border bg-white dark:bg-dark-card px-5 py-6">
        <div className="flex items-center gap-2.5 px-2 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-gradient dark:bg-primary-gradient-dark text-white shadow-glow dark:shadow-glowDark">
            <GraduationCap size={20} />
          </div>
          <div>
            <p className="font-heading text-sm font-bold text-textPrimary dark:text-dark-text leading-tight">LearnTrack AI</p>
            <p className="text-[11px] text-textSecondary dark:text-dark-textMuted">Progress Engine</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-textSecondary dark:text-dark-textMuted cursor-default select-none"
              title="Outside Profile Module scope"
            >
              <item.icon size={17} strokeWidth={2} />
              {item.label}
            </div>
          ))}

          <div className="pt-2 mt-2 border-t border-borderPurple dark:border-dark-border space-y-1">
            <SidebarLink to="/profile" icon={UserRound} label="Profile" />
            <SidebarLink to="/settings" icon={SettingsIcon} label="Settings" />
          </div>
        </nav>

        <NavLink
          to="/profile"
          className="flex items-center gap-3 rounded-xl px-3 py-3 bg-lightPurple/60 dark:bg-dark-surface"
        >
          <img
            src={user.avatar}
            alt={user.fullName}
            className="h-9 w-9 rounded-full object-cover border border-white dark:border-dark-border"
          />
          <div className="min-w-0">
            <p className="text-xs font-semibold text-textPrimary dark:text-dark-text truncate">{user.fullName}</p>
            <p className="text-[11px] text-textSecondary dark:text-dark-textMuted truncate">{user.department}</p>
          </div>
        </NavLink>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <TopBar user={user} />
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="px-4 sm:px-6 lg:px-10 py-6 sm:py-8 max-w-6xl mx-auto"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}

function SidebarLink({ to, icon: Icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors duration-200 ${
          isActive
            ? 'bg-lightPurple text-primary dark:bg-dark-surface dark:text-dark-accent'
            : 'text-textSecondary hover:bg-lightPurple/60 hover:text-textPrimary dark:text-dark-textMuted dark:hover:bg-dark-surface dark:hover:text-dark-text'
        }`
      }
    >
      <Icon size={17} strokeWidth={2.2} />
      {label}
    </NavLink>
  );
}

function TopBar({ user }) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-borderPurple dark:border-dark-border bg-white/80 dark:bg-dark-card/80 backdrop-blur-md px-4 sm:px-6 lg:px-10 py-4">
      <div>
        <p className="text-xs text-textSecondary dark:text-dark-textMuted">User Profile</p>
        <h1 className="font-heading text-lg font-semibold text-textPrimary dark:text-dark-text">
          Welcome back, {user.fullName.split(' ')[0]}
        </h1>
      </div>
      <div className="flex items-center gap-3">
        <ThemeToggle size="sm" />
        <img
          src={user.avatar}
          alt={user.fullName}
          className="h-9 w-9 rounded-full object-cover border border-borderPurple dark:border-dark-border lg:hidden"
        />
      </div>
    </header>
  );
}

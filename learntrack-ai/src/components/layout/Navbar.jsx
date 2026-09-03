import { Menu, Bell, Sun, Moon } from "lucide-react";
import { useThemeStore } from "../../store/themeStore";
import { currentUser } from "../../mock-data/user";

export default function Navbar({ onMenuClick }) {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 dark:border-slate-800/80 dark:bg-surface-dark md:justify-end md:border-none md:bg-transparent md:px-0 md:py-6">
      <button
        type="button"
        onClick={onMenuClick}
        className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5 md:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={toggleTheme}
          className="rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white"
          aria-label="Toggle dark mode"
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </button>

        <button
          type="button"
          className="relative rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          {currentUser.notificationCount > 0 && (
            <span className="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-surface-dark" />
          )}
        </button>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700 dark:bg-brand-500/20 dark:text-brand-300">
          {currentUser.avatarInitials}
        </div>
      </div>
    </header>
  );
}

import { Menu, Bell, Sun, Moon, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useThemeStore } from "../../store/themeStore";
import { useProfile } from "../../services/profileService";

export default function Navbar({ onMenuClick }) {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useThemeStore();
  const { data: userProfile } = useProfile();

  const avatarUrl = userProfile?.avatar;
  const fullName = userProfile?.fullName || userProfile?.name || "User";
  const initials = fullName
    ? fullName
        .split(" ")
        .filter(Boolean)
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "LT";

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-surface-light px-4 dark:border-slate-800/80 dark:bg-surface-dark md:justify-end md:border-none md:bg-transparent md:px-0 md:py-6">
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
        </button>

        <button
          type="button"
          onClick={() => navigate("/profile")}
          className="group relative flex h-9 w-9 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-brand-100 ring-2 ring-brand-500/20 transition-all hover:scale-105 hover:ring-brand-500 dark:bg-brand-500/20 text-sm font-semibold text-brand-700 dark:text-brand-300"
          title="View Profile"
          aria-label="View Profile"
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={fullName}
              className="h-full w-full object-cover"
            />
          ) : initials ? (
            <span>{initials}</span>
          ) : (
            <User className="h-4 w-4" />
          )}
        </button>
      </div>
    </header>
  );
}

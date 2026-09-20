import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Menu, Settings, Sun, Moon, User } from "lucide-react";
import { useThemeStore } from "../../store/themeStore";
import { useAuthStore } from "../../store/authStore";
import { useProfile } from "../../services/profileService";

export default function Navbar({ onMenuClick }) {
  const { theme, toggleTheme } = useThemeStore();
  const logout = useAuthStore((s) => s.logout);
  const { data: profile } = useProfile();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    const handleEscape = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const initials = profile?.fullName
    ? profile.fullName
        .split(" ")
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "?";

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
    navigate("/splash");
  };

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

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700 transition-opacity hover:opacity-90 dark:bg-brand-500/20 dark:text-brand-300"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            aria-label="Open profile menu"
          >
            {initials}
          </button>

          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 top-11 z-20 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-surface-dark-card"
            >
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/profile");
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/5"
              >
                <User className="h-3.5 w-3.5" /> Profile
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/settings");
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/5"
              >
                <Settings className="h-3.5 w-3.5" /> Settings
              </button>
              <div className="my-1 h-px bg-slate-100 dark:bg-slate-800" />
              <button
                type="button"
                role="menuitem"
                onClick={handleLogout}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10"
              >
                <LogOut className="h-3.5 w-3.5" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
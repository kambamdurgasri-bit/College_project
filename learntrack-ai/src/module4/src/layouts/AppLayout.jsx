import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { X } from "lucide-react";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import { useThemeStore } from "../store/themeStore";

export default function AppLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const initTheme = useThemeStore((s) => s.initTheme);

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  return (
    <div className="flex h-screen overflow-hidden bg-surface dark:bg-surface-dark">
      {/* Desktop / tablet sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile drawer sidebar */}
      {drawerOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-slate-900/50"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 z-50">
            <div className="relative h-full">
              <Sidebar onNavigate={() => setDrawerOpen(false)} />
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="absolute right-3 top-6 rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/5"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <div className="md:px-8">
          <Navbar onMenuClick={() => setDrawerOpen(true)} />
        </div>
        <main className="flex-1 overflow-y-auto px-4 pb-10 pt-4 scrollbar-thin md:px-8 md:pt-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

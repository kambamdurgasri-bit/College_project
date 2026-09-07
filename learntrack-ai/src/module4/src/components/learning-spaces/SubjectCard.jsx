import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import SubjectIcon from "../common/SubjectIcon";
import ProgressBar from "../common/ProgressBar";
import { getTheme } from "../../utils/theme";

export default function SubjectCard({ space, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const theme = getTheme(space.colorId);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      onClick={() => navigate(`/learning-spaces/${space.id}`)}
      className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800/80 dark:bg-surface-dark-card dark:shadow-card-dark"
    >
      <div className="mb-4 flex items-start justify-between">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${theme.softBg}`}>
          <SubjectIcon icon={space.icon} className={`h-5 w-5 ${theme.text}`} />
        </div>

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((v) => !v);
            }}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-white/5 dark:hover:text-slate-300"
            aria-label="Space options"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-9 z-10 w-36 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-surface-dark-card">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(false);
                  navigate(`/learning-spaces/${space.id}/edit`);
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/5"
              >
                <Pencil className="h-3.5 w-3.5" /> Edit
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(false);
                  onDelete?.(space.id);
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <h3 className="mb-0.5 font-semibold text-slate-900 dark:text-white">
        {space.name}
      </h3>
      <p className="mb-4 text-xs text-slate-500 dark:text-slate-400">
        {space.topicsTotal} Topics
      </p>

      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>Progress</span>
        <span className="font-semibold text-slate-700 dark:text-slate-200">
          {space.progress}%
        </span>
      </div>
      <ProgressBar value={space.progress} colorId={space.colorId} className="mt-1.5" />
    </div>
  );
}

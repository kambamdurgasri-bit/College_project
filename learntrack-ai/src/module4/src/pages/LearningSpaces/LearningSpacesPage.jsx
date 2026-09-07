import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, AlertTriangle, FolderPlus } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import SearchBar from "../../components/common/SearchBar";
import FilterBar from "../../components/common/FilterBar";
import SubjectCard from "../../components/learning-spaces/SubjectCard";
import { learningSpaceService } from "../../services/learningSpaceService";
import { SORT_OPTIONS } from "../../utils/constants";

const TABS = [
  { value: "All", label: "All" },
  { value: "In Progress", label: "In Progress" },
  { value: "Completed", label: "Completed" },
];

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800/80 dark:bg-surface-dark-card">
      <div className="mb-4 flex items-start justify-between">
        <div className="h-11 w-11 rounded-xl bg-slate-200 dark:bg-white/10" />
        <div className="h-4 w-4 rounded bg-slate-200 dark:bg-white/10" />
      </div>
      <div className="mb-2 h-4 w-2/3 rounded bg-slate-200 dark:bg-white/10" />
      <div className="mb-4 h-3 w-1/3 rounded bg-slate-200 dark:bg-white/10" />
      <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-white/10" />
    </div>
  );
}

export default function LearningSpacesPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [spaces, setSpaces] = useState([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [sort, setSort] = useState(SORT_OPTIONS[0]);

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    learningSpaceService
      .list()
      .then((data) => {
        if (!cancelled) {
          setSpaces(data);
          setStatus("success");
        }
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleDelete = (id) => {
    setSpaces((prev) => prev.filter((s) => s.id !== id));
  };

  const counts = useMemo(
    () => ({
      All: spaces.length,
      "In Progress": spaces.filter((s) => s.status === "In Progress").length,
      Completed: spaces.filter((s) => s.status === "Completed").length,
    }),
    [spaces]
  );

  const filteredSpaces = useMemo(() => {
    let result = spaces;
    if (activeTab !== "All") {
      result = result.filter((s) => s.status === activeTab);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((s) => s.name.toLowerCase().includes(q));
    }
    if (sort === "Name (A-Z)") {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === "Progress (High-Low)") {
      result = [...result].sort((a, b) => b.progress - a.progress);
    }
    return result;
  }, [spaces, activeTab, search, sort]);

  return (
    <div>
      <PageHeader
        title="Learning Spaces"
        subtitle="Manage your subjects and track your progress."
        actions={
          <button
            type="button"
            onClick={() => navigate("/learning-spaces/new")}
            className="flex items-center gap-1.5 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-700"
          >
            <Plus className="h-4 w-4" /> Create Learning Space
          </button>
        }
      />

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <FilterBar
          tabs={TABS.map((t) => ({ ...t, label: `${t.label} (${counts[t.value]})` }))}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          sortOptions={SORT_OPTIONS}
          sortValue={sort}
          onSortChange={setSort}
        />
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search learning spaces..."
          className="sm:w-72"
        />
      </div>

      {status === "loading" && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {status === "error" && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center dark:border-slate-700 dark:bg-surface-dark-card">
          <AlertTriangle className="mb-3 h-8 w-8 text-rose-500" />
          <p className="font-medium text-slate-700 dark:text-slate-200">
            Couldn't load your learning spaces
          </p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Something went wrong. Please try again.
          </p>
        </div>
      )}

      {status === "success" && filteredSpaces.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center dark:border-slate-700 dark:bg-surface-dark-card">
          <FolderPlus className="mb-3 h-8 w-8 text-slate-400" />
          <p className="font-medium text-slate-700 dark:text-slate-200">
            No learning spaces found
          </p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Try a different search, or create a new learning space to get started.
          </p>
        </div>
      )}

      {status === "success" && filteredSpaces.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredSpaces.map((space) => (
            <SubjectCard key={space.id} space={space} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}

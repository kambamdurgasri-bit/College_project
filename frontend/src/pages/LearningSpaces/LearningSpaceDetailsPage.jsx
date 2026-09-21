import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Layers,
  CheckCircle2,
  Clock,
  Circle,
  CheckCircle,
  Flame,
  Percent,
  BookOpen,
  ClipboardCheck,
  CalendarDays,
  AlertTriangle,
  Plus,
  Play,
  Sparkles,
  Loader2,
  FileText,
  Link2,
  ExternalLink,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import SubjectIcon from "../../components/common/SubjectIcon";
import ProgressRing from "../../components/common/ProgressRing";
import StatisticCard from "../../components/common/StatisticCard";
import Dialog from "../../components/common/Dialog";
import { learningSpaceService } from "../../services/learningSpaceService";
import { quizService } from "../../services/quizService";
import { getTheme } from "../../utils/theme";

const TABS = ["Overview", "Topics", "Resources", "Quiz History", "Activity"];

const ACTIVITY_ICON = {
  completed: CheckCircle,
  streak: Flame,
  quiz: Percent,
};

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-slate-200 bg-surface-light px-3 py-1.5 text-xs shadow-md dark:border-slate-700 dark:bg-surface-dark-card">
      <p className="font-medium text-slate-700 dark:text-slate-200">{label}</p>
      <p className="text-brand-600 dark:text-brand-400">{payload[0].value}%</p>
    </div>
  );
}

export default function LearningSpaceDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");
  const [space, setSpace] = useState(null);
  const [activeTab, setActiveTab] = useState("Overview");

  // Add-topic state (pure topic record — no quiz is created here)
  const [showAddModal, setShowAddModal] = useState(false);
  const [topicName, setTopicName] = useState("");
  const [topicDescription, setTopicDescription] = useState("");
  const [creatingTopic, setCreatingTopic] = useState(false);
  const [createError, setCreateError] = useState(null);

  // Generate-quiz state (pick an existing topic + options, then call AI)
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [quizTopicId, setQuizTopicId] = useState("");
  const [difficulty, setDifficulty] = useState("MEDIUM");
  const [questionCount, setQuestionCount] = useState(5);
  const [generating, setGenerating] = useState(false);
  const [quizError, setQuizError] = useState(null);

  // Quiz history for THIS space (real attempt rows, newest first)
  const [quizHistory, setQuizHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState(null);

  // Resource Modal State
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [resourceTitle, setResourceTitle] = useState("");
  const [resourceType, setResourceType] = useState("URL"); // URL | NOTES
  const [resourceContent, setResourceContent] = useState("");
  const [resources, setResources] = useState([]);

  const fetchSpaceDetails = async () => {
    try {
      const data = await learningSpaceService.getById(id);
      if (!data) {
        setStatus("not-found");
      } else {
        setSpace(data);
        const storedRes = localStorage.getItem(`resources_space_${id}`);
        let localRes = [];
        if (storedRes) {
          try {
            localRes = JSON.parse(storedRes);
          } catch {}
        }
        const apiRes = data.resources || [];
        const merged = [...apiRes];
        for (const item of localRes) {
          if (!merged.some((r) => r.id === item.id)) {
            merged.push(item);
          }
        }
        setResources(merged);
        setStatus("success");
      }
    } catch {
      setStatus("error");
    }
  };

  useEffect(() => {
    fetchSpaceDetails();
  }, [id]);

  const handleCreateTopicQuiz = async (e) => {
    e.preventDefault();
    if (!topicName.trim()) {
      setCreateError("Please enter a topic name.");
      return;
    }
    try {
      setGenerating(true);
      setCreateError(null);
      await quizService.generate({
        learningSpaceId: Number(id),
        topic: topicName.trim(),
        difficulty,
        questionCount: Number(questionCount),
      });
      setShowAddModal(false);
      setTopicName("");
      await fetchSpaceDetails();
      setActiveTab("Topics");
    } catch (err) {
      setCreateError(err.message || "Failed to generate AI quiz.");
    } finally {
      setGenerating(false);
    }
  };

  const handleAddResource = (e) => {
    e.preventDefault();
    if (!resourceTitle.trim()) return;
    const newRes = {
      id: Date.now(),
      title: resourceTitle.trim(),
      type: resourceType,
      content: resourceContent.trim(),
      createdAt: new Date().toLocaleDateString(),
    };
    const updated = [newRes, ...resources];
    setResources(updated);
    localStorage.setItem(`resources_space_${id}`, JSON.stringify(updated));
    setShowResourceModal(false);
    setResourceTitle("");
    setResourceContent("");
    setActiveTab("Resources");
  };

  const handleGenerateFromResource = async (resItem) => {
    try {
      setGenerating(true);
      await quizService.generate({
        learningSpaceId: Number(id),
        topic: resItem.title,
        difficulty: "MEDIUM",
        notes: resItem.content,
        questionCount: 5,
      });
      await fetchSpaceDetails();
      setActiveTab("Topics");
    } catch (err) {
      alert("Failed to generate AI quiz from resource: " + err.message);
    } finally {
      setGenerating(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-32 w-full rounded-2xl bg-slate-200 dark:bg-white/10" />
        <div className="h-10 w-full rounded-xl bg-slate-200 dark:bg-white/10" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 rounded-2xl bg-slate-200 dark:bg-white/10" />
          ))}
        </div>
      </div>
    );
  }

  if (status === "error" || status === "not-found") {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center dark:border-slate-700 dark:bg-surface-dark-card">
        <AlertTriangle className="mb-3 h-8 w-8 text-rose-500" />
        <p className="font-medium text-slate-700 dark:text-slate-200">
          {status === "not-found"
            ? "This learning space could not be found."
            : "Couldn't load this learning space."}
        </p>
        <button
          type="button"
          onClick={() => navigate("/learning-spaces")}
          className="mt-4 rounded-xl bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
        >
          Back to Learning Spaces
        </button>
      </div>
    );
  }

  const theme = getTheme(space.colorId);
  const quizzes = space.quizzes || [];
  const progressOverview = [
    { date: "Start", progress: 0 },
    { date: "Current", progress: space.progress || 0 },
  ];

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate("/learning-spaces")}
          className="flex items-center gap-2 rounded-lg p-1.5 text-sm font-medium text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/5"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Learning Spaces
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowResourceModal(true)}
            className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-surface-dark-card dark:text-slate-200"
          >
            <Plus className="h-3.5 w-3.5" /> Add Resource
          </button>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-brand-700"
          >
            <Plus className="h-3.5 w-3.5" /> Add Topic & AI Quiz
          </button>
        </div>
      </div>

      {/* Banner */}
      <div className={`mb-6 flex flex-col gap-6 rounded-2xl ${theme.solidBg} p-6 sm:flex-row sm:items-center sm:justify-between`}>
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/20">
            <SubjectIcon icon={space.icon} className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">{space.name}</h1>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white">
                {space.topicsTotal} Topics
              </span>
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white">
                {space.status}
              </span>
            </div>
          </div>
        </div>
        <div className="flex justify-center sm:justify-end">
          <ProgressRing value={space.progress} label="Overall Progress" />
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-6 overflow-x-auto border-b border-slate-200 no-scrollbar dark:border-slate-800/80">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`shrink-0 border-b-2 pb-3 text-sm font-medium transition-colors ${
              activeTab === tab
                ? "border-brand-600 text-brand-600 dark:text-brand-400"
                : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            {tab} {tab === "Topics" || tab === "Quizzes" ? `(${quizzes.length})` : tab === "Resources" ? `(${resources.length})` : ""}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "Overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatisticCard icon={Layers} label="Total Topics" value={space.topicsTotal} colorId="blue" />
            <StatisticCard icon={CheckCircle2} label="Completed" value={space.topicsCompleted} colorId="green" />
            <StatisticCard icon={Clock} label="In Progress" value={space.topicsInProgress} colorId="purple" />
            <StatisticCard icon={Circle} label="Not Started" value={space.topicsNotStarted || 0} colorId="red" />
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-surface-light p-5 shadow-card dark:border-slate-800/80 dark:bg-surface-dark-card dark:shadow-card-dark lg:col-span-2">
              <h3 className="mb-4 text-sm font-semibold text-slate-700 dark:text-slate-200">
                Progress Overview
              </h3>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={progressOverview} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-slate-100 dark:stroke-white/10" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 11, fill: "#94a3b8" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      domain={[0, 100]}
                      tick={{ fontSize: 11, fill: "#94a3b8" }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => `${v}%`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="progress"
                      stroke="#7C3AED"
                      strokeWidth={2.5}
                      dot={{ r: 3, fill: "#7C3AED" }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card dark:border-slate-800/80 dark:bg-surface-dark-card dark:shadow-card-dark">
              <h3 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
                Topics Summary
              </h3>
              {quizzes.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-400">
                  No topics added yet. Click "+ Add Topic & AI Quiz" above to add your first topic!
                </div>
              ) : (
                <ul className="space-y-3">
                  {quizzes.slice(0, 5).map((q) => (
                    <li key={q.id} className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-700 dark:text-slate-200 truncate max-w-[150px]">
                        {q.topic}
                      </span>
                      <span className="text-slate-500">
                        {q.latestScore !== null ? `${q.latestScore}% Avg` : "Not Attempted"}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Topics Tab / Quizzes Tab */}
      {(activeTab === "Topics" || activeTab === "Quizzes") && (
        <div>
          {quizzes.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center dark:border-slate-700 dark:bg-surface-dark-card">
              <BookOpen className="mb-3 h-10 w-10 text-brand-500" />
              <p className="font-medium text-slate-700 dark:text-slate-200">
                No topics or quizzes in this space yet
              </p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Add your first topic to generate an AI quiz and start tracking your progress!
              </p>
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="mt-4 flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
              >
                <Plus className="h-4 w-4" /> Add Topic & AI Quiz
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {quizzes.map((q) => (
                <div
                  key={q.id}
                  className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-card dark:border-slate-800/80 dark:bg-surface-dark-card"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="rounded-lg bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700 dark:bg-brand-500/10 dark:text-brand-300">
                        {q.difficulty}
                      </span>
                      {q.latestScore !== null && (
                        <span className={`text-xs font-bold ${q.latestScore >= 70 ? "text-emerald-600" : "text-amber-600"}`}>
                          {q.latestScore}% Score
                        </span>
                      )}
                    </div>
                    <h3 className="mt-3 text-base font-bold text-slate-900 dark:text-white">
                      {q.topic}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {q.questionsCount} Questions • {q.attemptsCount} Attempt(s)
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      navigate("/topic-quiz", {
                        state: {
                          quizId: q.id,
                          topic: q.topic,
                          difficulty: q.difficulty,
                        },
                      })
                    }
                    className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-brand-600 dark:bg-white/10 dark:hover:bg-brand-600"
                  >
                    <Play className="h-3.5 w-3.5" /> Take Quiz
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Resources Tab */}
      {activeTab === "Resources" && (
        <div>
          {resources.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center dark:border-slate-700 dark:bg-surface-dark-card">
              <Link2 className="mb-3 h-10 w-10 text-brand-500" />
              <p className="font-medium text-slate-700 dark:text-slate-200">
                No study resources added yet
              </p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Attach YouTube video links, web documents, or notes to generate quizzes directly from your material!
              </p>
              <button
                type="button"
                onClick={() => setShowResourceModal(true)}
                className="mt-4 flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
              >
                <Plus className="h-4 w-4" /> Add Resource
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {resources.map((resItem) => (
                <div
                  key={resItem.id}
                  className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-card dark:border-slate-800/80 dark:bg-surface-dark-card"
                >
                  <div>
                    <div className="flex items-center gap-2 text-brand-600">
                      {resItem.type === "URL" ? <Link2 className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                      <span className="text-xs font-semibold uppercase">{resItem.type}</span>
                    </div>
                    <h3 className="mt-2 text-base font-bold text-slate-900 dark:text-white">
                      {resItem.title}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">
                      {resItem.content}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    {resItem.type === "URL" && (
                      <a
                        href={resItem.content.startsWith("http") ? resItem.content : `https://${resItem.content}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
                      >
                        Open <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => handleGenerateFromResource(resItem)}
                      disabled={generating}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-purple-600 py-2 text-xs font-semibold text-white transition hover:bg-purple-700 disabled:opacity-50"
                    >
                      <Sparkles className="h-3 w-3" /> Quiz AI
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Activity / Quiz History Tab */}
      {(activeTab === "Activity" || activeTab === "Quiz History") && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card dark:border-slate-800/80 dark:bg-surface-dark-card">
          <h3 className="mb-4 text-base font-semibold text-slate-900 dark:text-white">
            Quiz Attempt Activity
          </h3>
          {quizzes.filter((q) => q.attemptsCount > 0).length === 0 ? (
            <p className="p-8 text-center text-sm text-slate-500">
              No quiz attempts recorded yet. Click "Take Quiz" on any topic to start practicing!
            </p>
          ) : (
            <div className="space-y-3">
              {quizzes
                .filter((q) => q.attemptsCount > 0)
                .map((q) => (
                  <div key={q.id} className="flex items-center justify-between rounded-xl bg-slate-50 p-3 dark:bg-white/5">
                    <div>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{q.topic}</p>
                      <p className="text-xs text-slate-500">{q.attemptsCount} attempt(s) total</p>
                    </div>
                    <span className="text-sm font-bold text-brand-600 dark:text-brand-400">
                      {q.latestScore}% Latest
                    </span>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* Dialog for Adding Topic & AI Quiz */}
      <Dialog
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Topic & AI Quiz"
        description="Generate an AI-powered quiz topic for this Learning Space."
      >
        <form onSubmit={handleCreateTopicQuiz} className="space-y-4">
          {createError && (
            <div className="rounded-xl bg-rose-50 p-3 text-xs text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
              {createError}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Topic Name
            </label>
            <input
              type="text"
              placeholder="e.g. Recursion & Trees, Binary Search, Deadlocks"
              value={topicName}
              onChange={(e) => setTopicName(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-900 outline-none focus:border-brand-500 dark:border-slate-700 dark:bg-surface-dark-card dark:text-white"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-900 outline-none focus:border-brand-500 dark:border-slate-700 dark:bg-surface-dark-card dark:text-white"
              >
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Questions
              </label>
              <select
                value={questionCount}
                onChange={(e) => setQuestionCount(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-900 outline-none focus:border-brand-500 dark:border-slate-700 dark:bg-surface-dark-card dark:text-white"
              >
                <option value={3}>3 Questions</option>
                <option value={5}>5 Questions</option>
                <option value={10}>10 Questions</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={generating}
              className="flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-brand-700 disabled:opacity-50"
            >
              {generating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Generating AI Quiz...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" /> Create AI Topic Quiz
                </>
              )}
            </button>
          </div>
        </form>
      </Dialog>

      {/* Dialog for Adding Resource */}
      <Dialog
        open={showResourceModal}
        onClose={() => setShowResourceModal(false)}
        title="Add Study Resource"
        description="Attach web links, YouTube videos, or notes to this Learning Space."
      >
        <form onSubmit={handleAddResource} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Resource Title
            </label>
            <input
              type="text"
              placeholder="e.g. Chapter 4 Lecture Video, Operating Systems PDF Notes"
              value={resourceTitle}
              onChange={(e) => setResourceTitle(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-900 outline-none focus:border-brand-500 dark:border-slate-700 dark:bg-surface-dark-card dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Type
            </label>
            <select
              value={resourceType}
              onChange={(e) => setResourceType(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-900 outline-none focus:border-brand-500 dark:border-slate-700 dark:bg-surface-dark-card dark:text-white"
            >
              <option value="URL">Web / YouTube Link</option>
              <option value="NOTES">Text Notes / Study Content</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              URL or Content Notes
            </label>
            <textarea
              rows={3}
              placeholder={resourceType === "URL" ? "https://youtube.com/watch?v=..." : "Paste study text or summary here..."}
              value={resourceContent}
              onChange={(e) => setResourceContent(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-900 outline-none focus:border-brand-500 dark:border-slate-700 dark:bg-surface-dark-card dark:text-white"
              required
            />
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowResourceModal(false)}
              className="rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-brand-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-brand-700"
            >
              Add Resource
            </button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}

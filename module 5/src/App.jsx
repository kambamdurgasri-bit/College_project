import { useMemo, useState } from "react";
import {
  LayoutDashboard,
  BookOpen,
  CalendarDays,
  ClipboardList,
  BarChart3,
  Sparkles,
  UserCircle2,
  Search,
  Bell,
  ChevronLeft,
  ChevronRight,
  Target,
  Percent,
  Flame,
  AlertTriangle,
  BookMarked,
  Lightbulb,
  ArrowRight,
  GraduationCap,
  Clock3,
  CheckCircle2,
  Hammer,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Cell,
} from "recharts";

/* -------------------------------------------------------------------- */
/*  Design tokens (matching the reference: soft lavender + white cards) */
/* -------------------------------------------------------------------- */
const COLORS = {
  bg: "#F3F1FC",
  card: "#FFFFFF",
  purple: "#7B6EF6",
  purpleDark: "#5B4CE0",
  purpleSoft: "#EDE9FE",
  purpleFaint: "#F6F4FE",
  orange: "#F2994A",
  orangeSoft: "#FDEEE0",
  ink: "#20213B",
  sub: "#8D8FA6",
  line: "#ECEAFA",
  green: "#33C77E",
  red: "#F2685E",
};

/* -------------------------------------------------------------------- */
/*  Mock data — clearly labeled as sample data (Rule 15)                */
/* -------------------------------------------------------------------- */
const trendData = {
  Daily: [
    { label: "Mon", score: 62, accuracy: 58 },
    { label: "Tue", score: 68, accuracy: 64 },
    { label: "Wed", score: 55, accuracy: 60 },
    { label: "Thu", score: 71, accuracy: 69 },
    { label: "Fri", score: 76, accuracy: 74 },
    { label: "Sat", score: 82, accuracy: 79 },
    { label: "Sun", score: 88, accuracy: 84 },
  ],
  Weekly: [
    { label: "W1", score: 58, accuracy: 55 },
    { label: "W2", score: 64, accuracy: 61 },
    { label: "W3", score: 70, accuracy: 66 },
    { label: "W4", score: 67, accuracy: 63 },
    { label: "W5", score: 75, accuracy: 72 },
    { label: "W6", score: 81, accuracy: 78 },
    { label: "W7", score: 86, accuracy: 83 },
  ],
  Monthly: [
    { label: "Mar", score: 54, accuracy: 51 },
    { label: "Apr", score: 60, accuracy: 57 },
    { label: "May", score: 66, accuracy: 63 },
    { label: "Jun", score: 71, accuracy: 68 },
    { label: "Jul", score: 79, accuracy: 75 },
    { label: "Aug", score: 84, accuracy: 81 },
  ],
};

const subjectPerformance = [
  { subject: "Nursery Intro", score: 28 },
  { subject: "Python", score: 74 },
  { subject: "DBMS", score: 91 },
  { subject: "Mach. Learning", score: 96 },
  { subject: "OS", score: 61 },
  { subject: "Networks", score: 88 },
  { subject: "Data Struct.", score: 34 },
  { subject: "DSA Adv.", score: 79 },
  { subject: "Statistics", score: 55 },
  { subject: "Aptitude", score: 90 },
];

const recentActivity = [
  { time: "08:00", day: "Today", title: "Attempted DBMS — Normalization quiz", meta: "Score 18/20 · Accuracy 90%" },
  { time: "12:00", day: "Today", title: "Completed Python — Loops revision", meta: "Score 14/20 · Accuracy 70%" },
  { time: "12:30", day: "Yesterday", title: "Generated quiz from OS notes.pdf", meta: "12 questions · Medium" },
  { time: "16:30", day: "Yesterday", title: "Weak topic flagged: Data Structures", meta: "Accuracy dropped to 34%" },
];

const weakTopics = [
  { topic: "Recursion & Backtracking", subject: "Data Structures", accuracy: 34, icon: BookMarked },
  { topic: "Deadlock Handling", subject: "Operating Systems", accuracy: 41, icon: BookMarked },
  { topic: "Normal Forms", subject: "DBMS", accuracy: 48, icon: BookMarked },
  { topic: "Bayesian Inference", subject: "Machine Learning", accuracy: 52, icon: BookMarked },
];

const recommendations = [
  {
    title: "Revise Recursion & Backtracking",
    subject: "Data Structures",
    reason: "Your last 3 attempts averaged 34% accuracy on this topic.",
    action: "View revision plan",
    tone: "urgent",
  },
  {
    title: "Practice quiz: Deadlock Handling",
    subject: "Operating Systems",
    reason: "10 AI-generated questions focused on your weak areas.",
    action: "Start practice quiz",
    tone: "practice",
  },
  {
    title: "Review DBMS Normal Forms",
    subject: "DBMS",
    reason: "Accuracy improved from 30% to 48% — close to mastery.",
    action: "Continue revision",
    tone: "progress",
  },
];

const learningTips = [
  "Revisit a weak topic within 48 hours of a quiz for better retention.",
  "Short, frequent quizzes beat long infrequent study sessions.",
  "Review incorrect answers before starting a new practice quiz.",
];

/* -------------------------------------------------------------------- */
/*  Small reusable primitives                                           */
/* -------------------------------------------------------------------- */
function SampleBadge() {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium"
      style={{ background: COLORS.orangeSoft, color: COLORS.orange }}
    >
      Sample data
    </span>
  );
}

function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-2xl bg-white p-5 shadow-[0_2px_16px_rgba(91,76,224,0.06)] ${className}`}
      style={{ background: COLORS.card }}
    >
      {children}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, tint }) {
  return (
    <Card className="flex flex-1 items-center gap-4 min-w-[150px]">
      <div
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
        style={{ background: tint === "orange" ? COLORS.orangeSoft : COLORS.purpleSoft }}
      >
        <Icon size={20} color={tint === "orange" ? COLORS.orange : COLORS.purple} />
      </div>
      <div className="min-w-0">
        <div className="text-2xl font-bold tracking-tight" style={{ color: COLORS.ink }}>
          {value}
        </div>
        <div className="truncate text-xs" style={{ color: COLORS.sub }}>
          {label}
        </div>
      </div>
    </Card>
  );
}

function ProgressRing({ value, size = 46, stroke = 5, color = COLORS.purple }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <svg width={size} height={size} className="shrink-0">
      <circle cx={size / 2} cy={size / 2} r={r} stroke={COLORS.line} strokeWidth={stroke} fill="none" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke={color}
        strokeWidth={stroke}
        fill="none"
        strokeDasharray={c}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize={size * 0.28}
        fontWeight="700"
        fill={COLORS.ink}
      >
        {value}%
      </text>
    </svg>
  );
}

function SectionHeading({ title, right }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h3 className="text-[15px] font-semibold" style={{ color: COLORS.ink }}>
        {title}
      </h3>
      {right}
    </div>
  );
}

/* -------------------------------------------------------------------- */
/*  Mini calendar (matches the reference's right-rail calendar)         */
/* -------------------------------------------------------------------- */
function MiniCalendar() {
  const [cursor, setCursor] = useState(new Date());
  const today = new Date();

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstDay = new Date(year, month, 1);
  const startOffset = (firstDay.getDay() + 6) % 7; // Monday-first
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthLabel = cursor.toLocaleString("default", { month: "long", year: "numeric" });

  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const isToday = (d) =>
    d === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  return (
    <Card>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-[15px] font-semibold" style={{ color: COLORS.ink }}>
          Calendar
        </h3>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCursor(new Date(year, month - 1, 1))}
            className="rounded-md p-1 hover:bg-[#F6F4FE]"
            aria-label="Previous month"
          >
            <ChevronLeft size={14} color={COLORS.sub} />
          </button>
          <span className="text-[11px] font-medium" style={{ color: COLORS.sub }}>
            {monthLabel}
          </span>
          <button
            onClick={() => setCursor(new Date(year, month + 1, 1))}
            className="rounded-md p-1 hover:bg-[#F6F4FE]"
            aria-label="Next month"
          >
            <ChevronRight size={14} color={COLORS.sub} />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-y-2 text-center">
        {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
          <span key={d} className="text-[10px] font-medium" style={{ color: COLORS.sub }}>
            {d}
          </span>
        ))}
        {cells.map((d, i) =>
          d === null ? (
            <span key={i} />
          ) : (
            <span
              key={i}
              className="mx-auto flex h-6 w-6 items-center justify-center rounded-full text-[11px]"
              style={
                isToday(d)
                  ? { background: COLORS.purple, color: "#fff", fontWeight: 700 }
                  : { color: COLORS.ink }
              }
            >
              {d}
            </span>
          )
        )}
      </div>
    </Card>
  );
}

/* -------------------------------------------------------------------- */
/*  Layout chrome: Sidebar / Topbar / Right rail                        */
/* -------------------------------------------------------------------- */
const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, ready: false },
  { id: "learning", label: "Learning Spaces", icon: BookOpen, ready: false },
  { id: "timetable", label: "Timetable", icon: CalendarDays, ready: false },
  { id: "quiz", label: "Quiz & Assessment", icon: ClipboardList, ready: false },
  { id: "analytics", label: "Analytics", icon: BarChart3, ready: true },
  { id: "recommendations", label: "AI Recommendations", icon: Sparkles, ready: true },
  { id: "profile", label: "Profile", icon: UserCircle2, ready: false },
];

const PAGE_META = {
  dashboard: { title: "Dashboard", subtitle: "Your learning activity at a glance" },
  learning: { title: "Learning Spaces", subtitle: "Organize subjects and study material" },
  timetable: { title: "Timetable", subtitle: "Plan your weekly study schedule" },
  quiz: { title: "Quiz & Assessment", subtitle: "Generate and attempt quizzes" },
  analytics: { title: "Analytics", subtitle: "Track your learning performance over time" },
  recommendations: { title: "AI Recommendations", subtitle: "Personalized suggestions based on your quiz performance" },
  profile: { title: "Profile", subtitle: "Manage your account and preferences" },
};

function Sidebar({ active, setActive }) {
  return (
    <aside className="hidden w-[220px] shrink-0 flex-col bg-white px-4 py-6 md:flex" style={{ background: COLORS.card }}>
      <div className="mb-8 flex items-center gap-2 px-2">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-xl"
          style={{ background: COLORS.purpleSoft }}
        >
          <GraduationCap size={18} color={COLORS.purple} />
        </div>
        <div>
          <div className="text-sm font-bold leading-tight" style={{ color: COLORS.ink }}>
            LearnTrack AI
          </div>
          <div className="text-[10px] leading-tight" style={{ color: COLORS.sub }}>
            AI Progress Engine
          </div>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive = active === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className="group flex items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition-colors"
              style={{
                background: isActive ? COLORS.purpleSoft : "transparent",
                color: isActive ? COLORS.purpleDark : COLORS.sub,
                fontWeight: isActive ? 600 : 500,
              }}
            >
              <span className="flex items-center gap-3">
                <Icon size={17} color={isActive ? COLORS.purpleDark : COLORS.sub} />
                {item.label}
              </span>
              {!item.ready && (
                <span
                  className="rounded-full px-1.5 py-0.5 text-[9px] font-semibold"
                  style={{ background: "#F1F1F6", color: COLORS.sub }}
                >
                  SOON
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="mt-4 flex items-center gap-3 rounded-xl px-2 py-2" style={{ background: COLORS.purpleFaint }}>
        <div
          className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white"
          style={{ background: COLORS.purple }}
        >
          AS
        </div>
        <div className="min-w-0">
          <div className="truncate text-xs font-semibold" style={{ color: COLORS.ink }}>
            Aarav Sharma
          </div>
          <div className="truncate text-[10px]" style={{ color: COLORS.sub }}>
            Student
          </div>
        </div>
      </div>
    </aside>
  );
}

function Topbar({ page }) {
  const meta = PAGE_META[page];
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="mb-1 flex items-center gap-2">
          <span className="text-xs font-medium" style={{ color: COLORS.sub }}>
            LearnTrack AI
          </span>
          <SampleBadge />
        </div>
        <h1 className="text-[26px] font-bold tracking-tight" style={{ color: COLORS.ink }}>
          {meta.title}
        </h1>
        <p className="text-sm" style={{ color: COLORS.sub }}>
          {meta.subtitle}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-xl bg-white px-3 py-2.5 shadow-sm" style={{ minWidth: 220 }}>
          <Search size={16} color={COLORS.sub} />
          <input
            placeholder="Search topics, quizzes..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-[#B4B6C6]"
          />
        </div>
        <button
          className="flex h-10 w-10 items-center justify-center rounded-xl"
          style={{ background: COLORS.orange }}
          aria-label="Notifications"
        >
          <Bell size={17} color="#fff" />
        </button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------- */
/*  Analytics page                                                      */
/* -------------------------------------------------------------------- */
function AnalyticsPage() {
  const [range, setRange] = useState("Weekly");
  const data = trendData[range];
  const maxScore = Math.max(...subjectPerformance.map((s) => s.score));

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_300px]">
      <div className="flex flex-col gap-6">
        {/* Stat cards */}
        <div className="flex flex-wrap gap-4">
          <StatCard icon={ClipboardList} label="Quizzes Attempted" value="128" />
          <StatCard icon={Target} label="Average Score" value="76%" tint="orange" />
          <StatCard icon={Percent} label="Overall Accuracy" value="81%" />
          <StatCard icon={Flame} label="Progress This Month" value="+14%" tint="orange" />
        </div>

        {/* Trend chart */}
        <Card>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-[15px] font-semibold" style={{ color: COLORS.ink }}>
                Performance Trend
              </h3>
              <p className="text-xs" style={{ color: COLORS.sub }}>
                Score vs. accuracy over time
              </p>
            </div>
            <div className="flex gap-1 rounded-xl p-1" style={{ background: COLORS.purpleFaint }}>
              {["Daily", "Weekly", "Monthly"].map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className="rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
                  style={{
                    background: range === r ? "#fff" : "transparent",
                    color: range === r ? COLORS.purpleDark : COLORS.sub,
                    boxShadow: range === r ? "0 1px 6px rgba(91,76,224,0.15)" : "none",
                  }}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          <div style={{ width: "100%", height: 240 }}>
            <ResponsiveContainer>
              <AreaChart data={data} margin={{ left: -20, right: 10, top: 10 }}>
                <defs>
                  <linearGradient id="scoreFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={COLORS.purple} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={COLORS.purple} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke={COLORS.line} />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: COLORS.sub }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: COLORS.sub }} axisLine={false} tickLine={false} width={30} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke={COLORS.purple}
                  strokeWidth={2.5}
                  fill="url(#scoreFill)"
                  name="Score %"
                />
                <Area
                  type="monotone"
                  dataKey="accuracy"
                  stroke={COLORS.orange}
                  strokeWidth={2}
                  fill="transparent"
                  strokeDasharray="4 3"
                  name="Accuracy %"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex gap-4 text-xs" style={{ color: COLORS.sub }}>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ background: COLORS.purple }} /> Score
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ background: COLORS.orange }} /> Accuracy
            </span>
          </div>
        </Card>

        {/* Subject-wise performance */}
        <Card>
          <SectionHeading title="Subject-wise Performance" right={<span className="text-xs" style={{ color: COLORS.sub }}>Avg. score by subject</span>} />
          <div style={{ width: "100%", height: 220 }}>
            <ResponsiveContainer>
              <BarChart data={subjectPerformance} margin={{ left: -20, right: 10 }}>
                <CartesianGrid vertical={false} stroke={COLORS.line} />
                <XAxis
                  dataKey="subject"
                  tick={{ fontSize: 10, fill: COLORS.sub }}
                  axisLine={false}
                  tickLine={false}
                  interval={0}
                  angle={-20}
                  textAnchor="end"
                  height={50}
                />
                <YAxis tick={{ fontSize: 11, fill: COLORS.sub }} axisLine={false} tickLine={false} width={30} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
                  cursor={{ fill: COLORS.purpleFaint }}
                />
                <Bar dataKey="score" radius={[8, 8, 8, 8]}>
                  {subjectPerformance.map((s, i) => (
                    <Cell key={i} fill={s.score === maxScore ? COLORS.purpleDark : COLORS.purpleSoft} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Right rail */}
      <div className="flex flex-col gap-6">
        <MiniCalendar />

        <Card>
          <SectionHeading title="Recent Quiz Activity" />
          <div className="flex flex-col gap-4">
            {recentActivity.map((a, i) => (
              <div key={i} className="flex gap-3">
                <div className="flex w-12 shrink-0 flex-col items-start">
                  <span className="text-xs font-semibold" style={{ color: COLORS.ink }}>
                    {a.time}
                  </span>
                  <span className="text-[10px]" style={{ color: COLORS.sub }}>
                    {a.day}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium leading-snug" style={{ color: COLORS.ink }}>
                    {a.title}
                  </p>
                  <p className="text-[11px]" style={{ color: COLORS.sub }}>
                    {a.meta}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionHeading title="Weak Topics" />
          <div className="grid grid-cols-2 gap-3">
            {weakTopics.map((w, i) => (
              <div key={i} className="rounded-xl p-3" style={{ background: COLORS.purpleFaint }}>
                <ProgressRing value={w.accuracy} size={40} stroke={4} color={w.accuracy < 45 ? COLORS.red : COLORS.orange} />
                <p className="mt-2 text-[11px] font-medium leading-tight" style={{ color: COLORS.ink }}>
                  {w.topic}
                </p>
                <p className="text-[10px]" style={{ color: COLORS.sub }}>
                  {w.subject}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------- */
/*  AI Recommendations page                                             */
/* -------------------------------------------------------------------- */
const TONE_STYLE = {
  urgent: { bg: "#FDEEEE", accent: COLORS.red, label: "Needs attention" },
  practice: { bg: COLORS.purpleSoft, accent: COLORS.purpleDark, label: "Recommended practice" },
  progress: { bg: "#E9FBF1", accent: COLORS.green, label: "Improving" },
};

function RecommendationsPage() {
  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_300px]">
      <div className="flex flex-col gap-6">
        {/* AI insight banner */}
        <Card className="relative overflow-hidden">
          <div
            className="absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-40"
            style={{ background: COLORS.purpleSoft }}
          />
          <div className="relative flex items-start gap-4">
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
              style={{ background: COLORS.purpleDark }}
            >
              <Sparkles size={20} color="#fff" />
            </div>
            <div>
              <h3 className="text-[15px] font-semibold" style={{ color: COLORS.ink }}>
                AI-generated insight
              </h3>
              <p className="mt-1 max-w-xl text-sm" style={{ color: COLORS.sub }}>
                Based on your last 12 quiz attempts, understanding is strongest in{" "}
                <b style={{ color: COLORS.ink }}>Machine Learning</b> and needs the most work in{" "}
                <b style={{ color: COLORS.ink }}>Data Structures</b> — specifically recursion and backtracking
                questions.
              </p>
              <span className="mt-2 inline-block text-[11px] font-medium" style={{ color: COLORS.purpleDark }}>
                Generated by Google Gemini · based on stored quiz results
              </span>
            </div>
          </div>
        </Card>

        {/* Weak topics identified */}
        <Card>
          <SectionHeading
            title="Weak Topics Identified"
            right={
              <span className="flex items-center gap-1 text-xs" style={{ color: COLORS.sub }}>
                <AlertTriangle size={13} /> From your quiz history
              </span>
            }
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {weakTopics.map((w, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-xl p-3"
                style={{ background: COLORS.purpleFaint }}
              >
                <ProgressRing value={w.accuracy} size={44} stroke={4} color={w.accuracy < 45 ? COLORS.red : COLORS.orange} />
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold" style={{ color: COLORS.ink }}>
                    {w.topic}
                  </p>
                  <p className="text-[11px]" style={{ color: COLORS.sub }}>
                    {w.subject}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recommended actions */}
        <Card>
          <SectionHeading title="Recommended Actions" />
          <div className="flex flex-col gap-3">
            {recommendations.map((r, i) => {
              const tone = TONE_STYLE[r.tone];
              return (
                <div
                  key={i}
                  className="flex flex-col gap-3 rounded-xl p-4 sm:flex-row sm:items-center sm:justify-between"
                  style={{ background: tone.bg }}
                >
                  <div>
                    <span
                      className="mb-1.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold"
                      style={{ background: "#fff", color: tone.accent }}
                    >
                      {tone.label}
                    </span>
                    <p className="text-sm font-semibold" style={{ color: COLORS.ink }}>
                      {r.title}
                    </p>
                    <p className="text-xs" style={{ color: COLORS.sub }}>
                      {r.subject} · {r.reason}
                    </p>
                  </div>
                  <button
                    className="flex shrink-0 items-center justify-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold text-white"
                    style={{ background: tone.accent }}
                  >
                    {r.action} <ArrowRight size={13} />
                  </button>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Right rail */}
      <div className="flex flex-col gap-6">
        <Card>
          <SectionHeading title="Study Streak" />
          <div className="flex items-center gap-4">
            <ProgressRing value={70} size={64} stroke={6} color={COLORS.orange} />
            <div>
              <p className="text-sm font-semibold" style={{ color: COLORS.ink }}>
                5-day streak
              </p>
              <p className="text-xs" style={{ color: COLORS.sub }}>
                Keep it going — 2 more days to beat your record.
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <SectionHeading title="Learning Tips" right={<Lightbulb size={15} color={COLORS.orange} />} />
          <ul className="flex flex-col gap-3">
            {learningTips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-xs" style={{ color: COLORS.ink }}>
                <CheckCircle2 size={14} className="mt-0.5 shrink-0" color={COLORS.green} />
                {tip}
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <SectionHeading title="Suggested Resources" />
          <div className="flex flex-col gap-2">
            {["Recursion visualized — practice set", "OS Deadlocks — quick notes", "DBMS Normalization cheat sheet"].map(
              (res, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg px-3 py-2 text-xs"
                  style={{ background: COLORS.purpleFaint, color: COLORS.ink }}
                >
                  {res}
                  <ArrowRight size={13} color={COLORS.purple} />
                </div>
              )
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------- */
/*  Placeholder page for not-yet-built modules                          */
/* -------------------------------------------------------------------- */
const PLACEHOLDER_DETAIL = {
  dashboard: "Will summarize Learning Spaces, today's schedule, quiz stats and an AI recommendation preview.",
  learning: "Create, edit, and categorize Learning Spaces to organize subjects and study material.",
  timetable: "Build a weekly study timetable with today's plan surfaced on the dashboard.",
  quiz: "Select a subject, topic and difficulty to generate an AI quiz, then attempt, review and track it.",
  profile: "Manage personal info, password, profile picture and learning statistics.",
};

function PlaceholderPage({ page }) {
  const item = NAV_ITEMS.find((n) => n.id === page);
  const Icon = item.icon;
  return (
    <Card className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl" style={{ background: COLORS.purpleSoft }}>
        <Icon size={28} color={COLORS.purple} />
      </div>
      <div>
        <div className="mb-2 flex items-center justify-center gap-2">
          <h3 className="text-lg font-bold" style={{ color: COLORS.ink }}>
            {PAGE_META[page].title}
          </h3>
          <span
            className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold"
            style={{ background: "#F1F1F6", color: COLORS.sub }}
          >
            <Hammer size={11} /> Coming soon
          </span>
        </div>
        <p className="mx-auto max-w-sm text-sm" style={{ color: COLORS.sub }}>
          {PLACEHOLDER_DETAIL[page]}
        </p>
      </div>
      <span className="flex items-center gap-1.5 text-[11px]" style={{ color: COLORS.sub }}>
        <Clock3 size={12} /> Scheduled in a later development phase — see project phases doc
      </span>
    </Card>
  );
}

/* -------------------------------------------------------------------- */
/*  App shell                                                            */
/* -------------------------------------------------------------------- */
export default function LearnTrackAI() {
  const [active, setActive] = useState("analytics");

  const content = useMemo(() => {
    if (active === "analytics") return <AnalyticsPage />;
    if (active === "recommendations") return <RecommendationsPage />;
    return <PlaceholderPage page={active} />;
  }, [active]);

  return (
    <div className="flex min-h-screen w-full" style={{ background: COLORS.bg }}>
      <Sidebar active={active} setActive={setActive} />

      {/* Mobile nav */}
      <div className="fixed bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1 rounded-2xl bg-white p-1.5 shadow-lg md:hidden">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className="flex h-9 w-9 items-center justify-center rounded-xl"
              style={{ background: isActive ? COLORS.purpleSoft : "transparent" }}
            >
              <Icon size={16} color={isActive ? COLORS.purpleDark : COLORS.sub} />
            </button>
          );
        })}
      </div>

      <main className="flex-1 overflow-x-hidden px-5 py-6 pb-24 sm:px-8 md:pb-6">
        <Topbar page={active} />
        {content}
      </main>
    </div>
  );
}

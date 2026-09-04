import React, { useState } from "react";
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
  GraduationCap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  ArrowRight,
  ArrowLeft,
  LogOut,
  Hammer,
  Clock3,
  MailCheck,
} from "lucide-react";

/* -------------------------------------------------------------------- */
/*  Design tokens — same palette used across the LearnTrack AI frontend */
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
/*  Shared primitives                                                   */
/* -------------------------------------------------------------------- */
function SampleBadge({ text = "Frontend only · no backend yet" }) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium"
      style={{ background: COLORS.orangeSoft, color: COLORS.orange }}
    >
      {text}
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

function FieldLabel({ children }) {
  return (
    <label className="mb-1.5 block text-xs font-semibold" style={{ color: COLORS.ink }}>
      {children}
    </label>
  );
}

function TextField({ icon: Icon, error, ...props }) {
  return (
    <div className="mb-4">
      <div
        className="flex items-center gap-2 rounded-xl border bg-white px-3.5 py-3"
        style={{ borderColor: error ? COLORS.red : COLORS.line }}
      >
        <Icon size={16} color={error ? COLORS.red : COLORS.sub} />
        <input
          {...props}
          className="w-full bg-transparent text-sm outline-none placeholder:text-[#B4B6C6]"
          style={{ color: COLORS.ink }}
        />
      </div>
      {error && (
        <p className="mt-1 text-[11px] font-medium" style={{ color: COLORS.red }}>
          {error}
        </p>
      )}
    </div>
  );
}

function PasswordField({ label, value, onChange, placeholder, error, show, setShow }) {
  return (
    <div className="mb-4">
      <FieldLabel>{label}</FieldLabel>
      <div
        className="flex items-center gap-2 rounded-xl border bg-white px-3.5 py-3"
        style={{ borderColor: error ? COLORS.red : COLORS.line }}
      >
        <Lock size={16} color={error ? COLORS.red : COLORS.sub} />
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm outline-none placeholder:text-[#B4B6C6]"
          style={{ color: COLORS.ink }}
        />
        <button type="button" onClick={() => setShow(!show)} aria-label={show ? "Hide password" : "Show password"}>
          {show ? <EyeOff size={16} color={COLORS.sub} /> : <Eye size={16} color={COLORS.sub} />}
        </button>
      </div>
      {error && (
        <p className="mt-1 text-[11px] font-medium" style={{ color: COLORS.red }}>
          {error}
        </p>
      )}
    </div>
  );
}

function PrimaryButton({ children, ...props }) {
  return (
    <button
      {...props}
      className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
      style={{ background: COLORS.purple }}
    >
      {children}
    </button>
  );
}

/* -------------------------------------------------------------------- */
/*  Brand panel — reused on every auth screen                           */
/* -------------------------------------------------------------------- */
function BrandPanel() {
  return (
    <div
      className="relative hidden h-full flex-col justify-center overflow-hidden rounded-3xl p-10 text-white md:flex"
      style={{ background: `linear-gradient(160deg, ${COLORS.purple}, ${COLORS.purpleDark})` }}
    >
      <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10" />
      <div className="absolute -bottom-24 -left-10 h-64 w-64 rounded-full bg-white/10" />

      <div className="relative flex flex-col items-center text-center">
        <div className="mb-5 flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
          <GraduationCap size={18} />
        </div>

        <h2 className="max-w-sm text-3xl font-bold leading-tight">
          Measure what you understand — not just what you do.
        </h2>
      </div>
    </div>
  );
}

function AuthShell({ children }) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4" style={{ background: COLORS.bg }}>
      <div className="grid w-full max-w-4xl grid-cols-1 gap-4 rounded-3xl bg-white p-4 shadow-[0_8px_40px_rgba(91,76,224,0.12)] md:grid-cols-2 md:p-5">
        <BrandPanel />
        <div className="flex flex-col justify-center px-2 py-6 sm:px-6">{children}</div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------- */
/*  Splash screen                                                       */
/* -------------------------------------------------------------------- */
function SplashPage({ goTo }) {
  return (
    <div
      className="flex min-h-screen w-full flex-col items-center justify-center gap-6 p-4 text-center"
      style={{ background: `linear-gradient(160deg, ${COLORS.purple}, ${COLORS.purpleDark})` }}
    >
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white/15">
        <GraduationCap size={36} color="#fff" />
      </div>
      <div>
        <h1 className="text-3xl font-bold text-white">LearnTrack AI</h1>
        <p className="mt-2 text-sm text-white/80">Your AI-powered study and progress companion</p>
      </div>
      <button
        onClick={() => goTo("login")}
        className="mt-4 flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold"
        style={{ color: COLORS.purpleDark }}
      >
        Get Started <ArrowRight size={16} />
      </button>
      <span className="mt-2 text-[11px] text-white/60">Sample onboarding screen · frontend preview</span>
    </div>
  );
}

/* -------------------------------------------------------------------- */
/*  Login page                                                          */
/* -------------------------------------------------------------------- */
function LoginPage({ goTo, onAuthenticated }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const next = {};
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Enter a valid email address.";
    if (password.length < 6) next.password = "Password must be at least 6 characters.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) onAuthenticated();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-1 flex items-center gap-2">
        <span className="text-xs font-medium" style={{ color: COLORS.sub }}>
          Welcome back
        </span>
        <SampleBadge />
      </div>
      <h1 className="mb-1 text-2xl font-bold tracking-tight" style={{ color: COLORS.ink }}>
        Log in to your account
      </h1>
      <p className="mb-6 text-sm" style={{ color: COLORS.sub }}>
        Continue your learning progress on LearnTrack AI.
      </p>

      <FieldLabel>Email</FieldLabel>
      <TextField
        icon={Mail}
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
      />

      <PasswordField
        label="Password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
        show={showPassword}
        setShow={setShowPassword}
      />

      <div className="mb-6 flex items-center justify-between text-xs">
        <label className="flex items-center gap-2" style={{ color: COLORS.sub }}>
          <input type="checkbox" className="h-3.5 w-3.5 accent-[#7B6EF6]" />
          Remember me
        </label>
        <button
          type="button"
          onClick={() => goTo("forgot")}
          className="font-semibold"
          style={{ color: COLORS.purpleDark }}
        >
          Forgot password?
        </button>
      </div>

      <PrimaryButton type="submit">
        Log In <ArrowRight size={15} />
      </PrimaryButton>

      <p className="mt-5 text-center text-xs" style={{ color: COLORS.sub }}>
        Don't have an account?{" "}
        <button type="button" onClick={() => goTo("register")} className="font-semibold" style={{ color: COLORS.purpleDark }}>
          Register
        </button>
      </p>
    </form>
  );
}

/* -------------------------------------------------------------------- */
/*  Register page                                                       */
/* -------------------------------------------------------------------- */
function RegisterPage({ goTo, onAuthenticated }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const next = {};
    if (name.trim().length < 2) next.name = "Enter your full name.";
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Enter a valid email address.";
    if (password.length < 6) next.password = "Password must be at least 6 characters.";
    if (confirm !== password) next.confirm = "Passwords do not match.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) onAuthenticated();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-1 flex items-center gap-2">
        <span className="text-xs font-medium" style={{ color: COLORS.sub }}>
          Get started
        </span>
        <SampleBadge />
      </div>
      <h1 className="mb-1 text-2xl font-bold tracking-tight" style={{ color: COLORS.ink }}>
        Create your account
      </h1>
      <p className="mb-6 text-sm" style={{ color: COLORS.sub }}>
        Start tracking what you actually understand.
      </p>

      <FieldLabel>Full name</FieldLabel>
      <TextField
        icon={User}
        type="text"
        placeholder="Aarav Sharma"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={errors.name}
      />

      <FieldLabel>Email</FieldLabel>
      <TextField
        icon={Mail}
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
      />

      <PasswordField
        label="Password"
        placeholder="Create a password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
        show={showPassword}
        setShow={setShowPassword}
      />

      <PasswordField
        label="Confirm password"
        placeholder="Re-enter your password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        error={errors.confirm}
        show={showConfirm}
        setShow={setShowConfirm}
      />

      <PrimaryButton type="submit">
        Create Account <ArrowRight size={15} />
      </PrimaryButton>

      <p className="mt-5 text-center text-xs" style={{ color: COLORS.sub }}>
        Already have an account?{" "}
        <button type="button" onClick={() => goTo("login")} className="font-semibold" style={{ color: COLORS.purpleDark }}>
          Log in
        </button>
      </p>
    </form>
  );
}

/* -------------------------------------------------------------------- */
/*  Forgot password page                                                */
/* -------------------------------------------------------------------- */
function ForgotPasswordPage({ goTo }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }
    setError("");
    setSent(true);
  };

  if (sent) {
    return (
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl" style={{ background: COLORS.purpleSoft }}>
          <MailCheck size={26} color={COLORS.purple} />
        </div>
        <h1 className="mb-1 text-xl font-bold" style={{ color: COLORS.ink }}>
          Check your email
        </h1>
        <p className="mb-6 max-w-xs text-sm" style={{ color: COLORS.sub }}>
          If an account exists for <b style={{ color: COLORS.ink }}>{email}</b>, a password reset link has been sent.
        </p>
        <button
          onClick={() => goTo("login")}
          className="flex items-center gap-1.5 text-xs font-semibold"
          style={{ color: COLORS.purpleDark }}
        >
          <ArrowLeft size={13} /> Back to log in
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <button
        type="button"
        onClick={() => goTo("login")}
        className="mb-4 flex items-center gap-1.5 text-xs font-semibold"
        style={{ color: COLORS.sub }}
      >
        <ArrowLeft size={13} /> Back to log in
      </button>

      <div className="mb-1 flex items-center gap-2">
        <span className="text-xs font-medium" style={{ color: COLORS.sub }}>
          Reset password
        </span>
        <SampleBadge />
      </div>
      <h1 className="mb-1 text-2xl font-bold tracking-tight" style={{ color: COLORS.ink }}>
        Forgot your password?
      </h1>
      <p className="mb-6 text-sm" style={{ color: COLORS.sub }}>
        Enter the email linked to your account and we'll send a reset link.
      </p>

      <FieldLabel>Email</FieldLabel>
      <TextField
        icon={Mail}
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={error}
      />

      <PrimaryButton type="submit">
        Send Reset Link <ArrowRight size={15} />
      </PrimaryButton>
    </form>
  );
}

/* -------------------------------------------------------------------- */
/*  Post-login app shell — all modules wired in, shown as placeholders  */
/* -------------------------------------------------------------------- */
const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "learning", label: "Learning Spaces", icon: BookOpen },
  { id: "timetable", label: "Timetable", icon: CalendarDays },
  { id: "quiz", label: "Quiz & Assessment", icon: ClipboardList },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "recommendations", label: "AI Recommendations", icon: Sparkles },
  { id: "profile", label: "Profile", icon: UserCircle2 },
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

const PLACEHOLDER_DETAIL = {
  dashboard: "Will summarize Learning Spaces, today's schedule, quiz stats and an AI recommendation preview.",
  learning: "Create, edit, and categorize Learning Spaces to organize subjects and study material.",
  timetable: "Build a weekly study timetable with today's plan surfaced on the dashboard.",
  quiz: "Select a subject, topic and difficulty to generate an AI quiz, then attempt, review and track it.",
  analytics: "Full analytics dashboard with performance trend and subject-wise charts (designed separately).",
  recommendations: "AI-generated weak-topic detection and personalized study recommendations (designed separately).",
  profile: "Manage personal info, password, profile picture and learning statistics.",
};

function Sidebar({ active, setActive, onLogout }) {
  return (
    <aside className="hidden w-[220px] shrink-0 flex-col bg-white px-4 py-6 md:flex" style={{ background: COLORS.card }}>
      <div className="mb-8 flex items-center gap-2 px-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: COLORS.purpleSoft }}>
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
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors"
              style={{
                background: isActive ? COLORS.purpleSoft : "transparent",
                color: isActive ? COLORS.purpleDark : COLORS.sub,
                fontWeight: isActive ? 600 : 500,
              }}
            >
              <Icon size={17} color={isActive ? COLORS.purpleDark : COLORS.sub} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <button
        onClick={onLogout}
        className="mt-4 flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium"
        style={{ color: COLORS.red }}
      >
        <LogOut size={17} />
        Log out
      </button>
    </aside>
  );
}

function Topbar({ page }) {
  const meta = PAGE_META[page];
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
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
        <button className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: COLORS.orange }} aria-label="Notifications">
          <Bell size={17} color="#fff" />
        </button>
      </div>
    </div>
  );
}

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
          <span className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold" style={{ background: "#F1F1F6", color: COLORS.sub }}>
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

function AppShell({ onLogout }) {
  const [active, setActive] = useState("dashboard");
  return (
    <div className="flex min-h-screen w-full" style={{ background: COLORS.bg }}>
      <Sidebar active={active} setActive={setActive} onLogout={onLogout} />
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
        <PlaceholderPage page={active} />
      </main>
    </div>
  );
}

/* -------------------------------------------------------------------- */
/*  Root app — controls which top-level screen is shown                 */
/* -------------------------------------------------------------------- */
export default function LearnTrackAIAuth() {
  const [screen, setScreen] = useState("splash"); // splash | login | register | forgot | app

  if (screen === "splash") return <SplashPage goTo={setScreen} />;
  if (screen === "app") return <AppShell onLogout={() => setScreen("login")} />;

  return (
    <AuthShell>
      {screen === "login" && <LoginPage goTo={setScreen} onAuthenticated={() => setScreen("app")} />}
      {screen === "register" && <RegisterPage goTo={setScreen} onAuthenticated={() => setScreen("app")} />}
      {screen === "forgot" && <ForgotPasswordPage goTo={setScreen} />}
    </AuthShell>
  );
}
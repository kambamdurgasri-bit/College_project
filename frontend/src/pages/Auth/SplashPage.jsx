import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowDownRight, ArrowRight, BarChart3, BookOpen, BrainCircuit, CalendarDays,
  Check, ChevronRight, Clock3, Flame, GraduationCap, Lightbulb, Menu,
  NotebookTabs, Search, Sparkles, Target, X,
} from "lucide-react";
import { motion, useInView, useReducedMotion, useSpring } from "framer-motion";
import { useAuthStore } from "../../store/authStore";
import "./SplashPage.css";

const features = [
  { icon: BookOpen, accent: "blue", title: "Learning Spaces", text: "Organize your subjects, manage materials, and keep everything in one place." },
  { icon: BrainCircuit, accent: "purple", title: "AI-Powered Quizzes", text: "Generate quizzes from topics or your own study materials (PDF, notes, etc.)." },
  { icon: BarChart3, accent: "green", title: "Progress Analytics", text: "Track your performance with detailed analytics and visual insights." },
  { icon: Lightbulb, accent: "amber", title: "Smart Recommendations", text: "Get personalized suggestions based on your weak topics and learning patterns." },
];

const steps = [
  ["01", "Plan Your Learning", "Create learning spaces and set your study timetable."],
  ["02", "Study Your Topics", "Learn using your materials and resources."],
  ["03", "Test Your Understanding", "Generate and attempt AI-powered quizzes."],
  ["04", "Improve with Insights", "Review results, track progress, and get personalized recommendations."],
];
const schedule = [
  ["09:00 AM", "Data Structures", "1 hour"],
  ["11:00 AM", "DBMS Revision", "1 hour"],
  ["02:00 PM", "AI Quiz Practice", "30 mins"],
  ["04:00 PM", "Read Research Paper", "1 hour"],
];
const baseBars = [38, 62, 50, 92, 64, 100, 56];
const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function CountUp({ value, suffix = "", active, reduced }) {
  const [count, setCount] = useState(reduced ? value : 0);
  useEffect(() => {
    if (!active) return undefined;
    if (reduced) {
      const frame = requestAnimationFrame(() => setCount(value));
      return () => cancelAnimationFrame(frame);
    }
    let frame;
    const startedAt = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - startedAt) / 1400, 1);
      setCount(Math.round(value * (1 - (1 - progress) ** 3)));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, reduced, value]);
  return <>{count}{suffix}</>;
}

function DashboardPreview({ compact = false, hero = false, tilt = false }) {
  const rootRef = useRef(null);
  const inView = useInView(rootRef, { once: true, amount: 0.25 });
  const reduced = Boolean(useReducedMotion());
  const [bars, setBars] = useState(() => baseBars.map(() => 0));
  const [activeSchedule, setActiveSchedule] = useState(0);
  const rotateX = useSpring(0, { stiffness: 180, damping: 22 });
  const rotateY = useSpring(0, { stiffness: 180, damping: 22 });

  useEffect(() => {
    if (!inView) return undefined;
    const barReveal = window.setTimeout(() => setBars(baseBars), reduced ? 0 : 250);
    if (reduced) return () => window.clearTimeout(barReveal);
    const barTimer = window.setInterval(() => {
      setBars(baseBars.map((height) => Math.max(24, Math.min(100, height + (Math.random() * 36 - 18)))));
    }, 4200);
    const scheduleTimer = window.setInterval(() => setActiveSchedule((current) => (current + 1) % schedule.length), 1700);
    return () => {
      window.clearTimeout(barReveal);
      window.clearInterval(barTimer);
      window.clearInterval(scheduleTimer);
    };
  }, [inView, reduced]);

  const handleTilt = (event) => {
    if (!tilt || reduced) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    rotateY.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 14);
    rotateX.set(((event.clientY - bounds.top) / bounds.height - 0.5) * -10);
  };
  const resetTilt = () => { rotateX.set(0); rotateY.set(0); };

  return (
    <div className={`dashboard-stage ${hero ? "dashboard-stage-hero" : ""}`}>
      {hero && <>
        <motion.div className="float-chip chip-quiz" animate={reduced ? undefined : { y: [0, -10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
          <span className="chip-icon chip-green"><Check size={17} /></span><span>Quiz completed<small>Score: 90%</small></span>
        </motion.div>
        <motion.div className="float-chip chip-streak" animate={reduced ? undefined : { y: [0, -12, 0] }} transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}>
          <span className="chip-icon chip-amber"><Flame size={17} /></span><span>7-day streak<small>Keep it going</small></span>
        </motion.div>
      </>}
      <motion.div
        ref={rootRef}
        className={`dashboard-preview ${compact ? "dashboard-preview-compact" : ""}`}
        initial={reduced ? false : { opacity: 0, x: hero ? 44 : 0, y: 18 }}
        animate={{ opacity: 1, x: 0, y: hero && !reduced ? [0, -10, 0] : 0 }}
        transition={{ opacity: { duration: 0.8, delay: hero ? 0.2 : 0 }, x: { duration: 0.8 }, y: hero && !reduced ? { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 } : { duration: 0.7 } }}
        style={tilt ? { rotateX, rotateY, transformPerspective: 1200 } : undefined}
        onMouseMove={handleTilt}
        onMouseLeave={resetTilt}
        onPointerMove={handleTilt}
        onPointerLeave={resetTilt}
      >
        <aside className="preview-sidebar">
          <div className="preview-brand"><span className="brand-mark"><GraduationCap size={14} /></span>LearnTrack <b>AI</b></div>
          {[["Dashboard", BarChart3], ["Learning Spaces", BookOpen], ["Timetable", CalendarDays], ["Quizzes", BrainCircuit], ["Analytics", BarChart3], ["Recommendations", Sparkles], ["Profile", Target]].map(([label, Icon], index) => (
            <div className={`preview-nav-item ${index === 0 ? "active" : ""}`} key={label}><Icon size={12} />{label}</div>
          ))}
        </aside>
        <div className="preview-main">
          <div className="preview-topbar"><span className="preview-search"><Search size={11} />Search anything...</span><span className="preview-notification"><span /><Clock3 size={14} /></span><span className="preview-user">S</span></div>
          <div className="preview-greeting"><b>Good morning, Student! <span className="wave">👋</span></b><small>Stay consistent. Small steps make big progress.</small></div>
          <div className="preview-stat-grid">
            <div className="preview-stat blue"><small>Learning Spaces</small><strong><CountUp value={6} active={inView} reduced={reduced} /></strong><em>Active subjects</em></div>
            <div className="preview-stat green"><small>Quizzes Taken</small><strong><CountUp value={24} active={inView} reduced={reduced} /></strong><em>This month</em></div>
            <div className="preview-stat purple"><small>Average Score</small><strong><CountUp value={84} suffix="%" active={inView} reduced={reduced} /></strong><em>↑ 12% from last month</em></div>
            <div className="preview-stat amber"><small>Study Streak</small><strong><CountUp value={7} active={inView} reduced={reduced} /></strong><em>Days in a row</em></div>
          </div>
          <div className="preview-content-grid">
            <div className="preview-panel progress-panel"><div className="panel-heading"><b>Weekly Progress</b><span>This Week</span></div><div className="chart">
              {bars.map((height, index) => <div className="chart-bar" key={weekdays[index]}><i style={{ height: `${height}%` }} /><small>{weekdays[index]}</small></div>)}
            </div></div>
            <div className="preview-panel schedule-panel"><div className="panel-heading"><b>Today's Schedule</b><a href="#preview">View All</a></div><div className="schedule-list">
              {schedule.map(([time, label, duration], index) => <div className={`schedule-row ${activeSchedule === index && inView ? "highlight" : ""}`} key={label}><span>{time}</span><b>{label}</b><small>{duration}</small></div>)}
            </div></div>
          </div>
          <div className="preview-bottom-grid">
            <div className="preview-panel recommendation"><div className="panel-heading"><b>AI Recommendation</b><Sparkles size={13} /></div><div className="recommendation-body"><span className="bulb"><Lightbulb size={15} /></span><p><b>Focus on Tree Traversal</b><small>You scored 60% in your last quiz. Practice more questions on tree traversal to improve.</small></p></div><span className="practice-button">Generate Practice Quiz <ArrowRight size={11} /></span></div>
            <div className="preview-panel recent"><div className="panel-heading"><b>Recent Quizzes</b><a href="#preview">View All</a></div>{[["Arrays - Easy", "90%"], ["DBMS - Medium", "70%"], ["OOP Concepts", "80%"]].map(([label, score]) => <div className="recent-row" key={label}><Check size={11} /><span>{label}</span><b>{score}</b></div>)}</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function AnimatedSection({ children, className = "", delay = 0 }) {
  const reduced = Boolean(useReducedMotion());
  return <motion.div className={className} initial={reduced ? false : { opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.18 }} transition={{ duration: reduced ? 0.01 : 0.65, delay: reduced ? 0 : delay, ease: [0.2, 0.8, 0.2, 1] }}>{children}</motion.div>;
}

export default function SplashPage() {
  const navigate = useNavigate();
  const token = useAuthStore((s) => s.token);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const updateNav = () => setScrolled(window.scrollY > 8);
    updateNav();
    window.addEventListener("scroll", updateNav, { passive: true });
    return () => window.removeEventListener("scroll", updateNav);
  }, []);

  const goTo = (path) => { setMenuOpen(false); navigate(path); };
  const scrollTo = (id) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
  };
  const handleRipple = (event) => {
    const button = event.target.closest("[data-ripple]");
    if (!button) return;
    const bounds = button.getBoundingClientRect();
    const size = Math.max(bounds.width, bounds.height) / 2;
    const ripple = document.createElement("span");
    ripple.className = "landing-ripple";
    Object.assign(ripple.style, { width: `${size}px`, height: `${size}px`, left: `${event.clientX - bounds.left - size / 2}px`, top: `${event.clientY - bounds.top - size / 2}px` });
    button.appendChild(ripple);
    window.setTimeout(() => ripple.remove(), 650);
  };

  return (
    <div className="landing-page" onClick={handleRipple}>
      <header className={`landing-nav ${scrolled ? "scrolled" : ""}`}><div className="nav-inner">
        <button className="landing-logo" onClick={() => scrollTo("top")} aria-label="Go to top" data-ripple><span className="logo-icon"><GraduationCap size={22} /></span><span>LearnTrack <b>AI</b></span></button>
        <nav className={menuOpen ? "open" : ""}>
          <button onClick={() => scrollTo("features")}>Features</button><button onClick={() => scrollTo("how-it-works")}>How It Works</button><button onClick={() => scrollTo("preview")}>Preview</button><button onClick={() => scrollTo("about")}>About</button>
          {token ? <motion.button className="nav-cta" onClick={() => goTo("/dashboard")} whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }} data-ripple>Go to Dashboard <ArrowRight size={15} /></motion.button> : <><motion.button className="nav-login" onClick={() => goTo("/login")} whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }} data-ripple>Login</motion.button><motion.button className="nav-cta" onClick={() => goTo("/register")} whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }} data-ripple>Get Started <ArrowRight size={15} /></motion.button></>}
        </nav>
        <button className="menu-toggle" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen}>{menuOpen ? <X size={21} /> : <Menu size={21} />}</button>
      </div></header>

      <main id="top">
        <section className="hero-section"><div className="hero-inner">
          <div className="hero-copy">
            <span className="eyebrow"><Sparkles size={14} />AI-Powered Learning Platform</span>
            <h1><span className="headline-line"><motion.span initial={reducedMotion ? false : { y: "110%" }} animate={{ y: 0 }} transition={{ duration: 0.8, delay: 0.05 }}>Learn Smarter.</motion.span></span><span className="headline-line"><motion.span initial={reducedMotion ? false : { y: "110%" }} animate={{ y: 0 }} transition={{ duration: 0.8, delay: 0.16 }}>Track Your Progress.</motion.span></span><span className="headline-line gradient-line"><motion.span initial={reducedMotion ? false : { y: "110%" }} animate={{ y: 0 }} transition={{ duration: 0.8, delay: 0.27 }}>Improve Every Day.</motion.span></span></h1>
            <p className="hero-lead">Organize your subjects, plan your study schedule, generate AI-powered quizzes, and get personalized recommendations to truly understand what you learn.</p>
            <div className="hero-actions"><motion.button className="button-primary" onClick={() => goTo(token ? "/dashboard" : "/register")} whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }} data-ripple>{token ? "Go to Dashboard" : "Get Started — Free"}<ArrowRight size={17} /></motion.button><motion.button className="button-secondary" onClick={() => scrollTo("features")} whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }} data-ripple>Explore Features <ArrowDownRight size={17} /></motion.button></div>
            <div className="hero-highlights"><div><span className="highlight-icon blue"><BookOpen size={20} /></span>Plan<br />Your Study</div><div><span className="highlight-icon purple"><BrainCircuit size={20} /></span>Practice<br />with AI</div><div><span className="highlight-icon green"><BarChart3 size={20} /></span>Track<br />Progress</div><div><span className="highlight-icon amber"><Lightbulb size={20} /></span>Improve<br />with Insights</div></div>
          </div>
          <div className="hero-visual"><DashboardPreview hero /></div>
        </div></section>

        <section className="features-section section-shell" id="features"><AnimatedSection className="section-heading"><h2>Powerful Features for Better Learning</h2><p>Everything you need to plan, practice, and progress — powered by AI.</p></AnimatedSection>
          <motion.div className="feature-grid" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={{ hidden: {}, visible: { transition: { staggerChildren: reducedMotion ? 0 : 0.12 } } }}>
            {features.map(({ icon: Icon, accent, title, text }) => <motion.article className="feature-card" key={title} variants={{ hidden: { opacity: 0, y: reducedMotion ? 0 : 24 }, visible: { opacity: 1, y: 0, transition: { duration: reducedMotion ? 0.01 : 0.55 } } }} onMouseMove={(event) => { const bounds = event.currentTarget.getBoundingClientRect(); event.currentTarget.style.setProperty("--mx", `${event.clientX - bounds.left}px`); event.currentTarget.style.setProperty("--my", `${event.clientY - bounds.top}px`); }}><span className={`feature-icon ${accent}`}><Icon size={22} /></span><h3>{title}</h3><p>{text}</p><button onClick={() => scrollTo("preview")} data-ripple>Learn more <ChevronRight size={15} /></button></motion.article>)}
          </motion.div>
        </section>

        <section className="steps-section section-shell" id="how-it-works"><AnimatedSection className="section-heading"><h2>How It Works</h2><p>A simple process to a better you.</p></AnimatedSection><div className="steps-wrap"><div className="step-connector" />
          <motion.div className="steps-grid" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={{ hidden: {}, visible: { transition: { staggerChildren: reducedMotion ? 0 : 0.15 } } }}>
            {steps.map(([number, title, text], index) => <motion.article className="step" key={number} variants={{ hidden: { opacity: 0, y: reducedMotion ? 0 : 20 }, visible: { opacity: 1, y: 0, transition: { duration: reducedMotion ? 0.01 : 0.55 } } }}><div className={`step-orb orb-${index + 1}`}>{index === 0 && <BookOpen size={30} />}{index === 1 && <NotebookTabs size={30} />}{index === 2 && <BrainCircuit size={30} />}{index === 3 && <BarChart3 size={30} />}<span className="step-number">{number}</span></div><h3>{title}</h3><p>{text}</p></motion.article>)}
          </motion.div>
        </div></section>

        <section className="preview-section section-shell" id="preview"><div className="preview-copy"><AnimatedSection className="section-heading"><h2>See LearnTrack AI in Action</h2><p>A glimpse of your learning journey.</p></AnimatedSection>
          <div className="preview-benefits"><AnimatedSection className="benefit-row"><span className="benefit-icon blue"><BookOpen size={21} /></span><span>Your complete learning overview in one place.</span></AnimatedSection><AnimatedSection className="benefit-row" delay={0.1}><span className="benefit-icon green"><BarChart3 size={21} /></span><span>Track progress, view schedules, and get AI recommendations.</span></AnimatedSection><AnimatedSection className="benefit-row" delay={0.2}><span className="benefit-icon purple"><Target size={21} /></span><span>Stay organized and consistent with your goals.</span></AnimatedSection></div>
        </div><div className="preview-tilt-stage"><DashboardPreview compact tilt /></div></section>

        <section className="about-section section-shell" id="about"><div className="cta-banner"><div className="cta-copy"><h2>Ready to Start Your Learning Journey?</h2><p>Join LearnTrack AI and take control of your learning today.</p></div><div className="cta-action"><motion.button className="button-light" onClick={() => goTo(token ? "/dashboard" : "/register")} whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }} data-ripple>{token ? "Go to Dashboard" : "Get Started — Free"}<ArrowRight size={17} /></motion.button>{!token && <small>No credit card required. Just your curiosity.</small>}</div></div></section>
      </main>

      <footer className="landing-footer"><div className="footer-main"><div className="footer-brand"><button className="landing-logo" onClick={() => scrollTo("top")}><span className="logo-icon"><GraduationCap size={22} /></span><span>LearnTrack <b>AI</b></span></button><p>Learn Smarter. Progress Further.</p></div><div className="footer-links"><div><b>Product</b><button onClick={() => scrollTo("features")}>Features</button><button onClick={() => scrollTo("how-it-works")}>How It Works</button><button onClick={() => scrollTo("preview")}>Preview</button><button onClick={() => scrollTo("about")}>About</button></div><div><b>Resources</b><button onClick={() => scrollTo("how-it-works")}>Study Tips</button><button onClick={() => scrollTo("features")}>Learning Guides</button><button onClick={() => goTo("/login")}>Support</button><button onClick={() => goTo("/login")}>Contact</button></div><div><b>Get Started</b><button onClick={() => goTo(token ? "/dashboard" : "/login")}>{token ? "Dashboard" : "Login"}</button><button onClick={() => goTo(token ? "/dashboard" : "/register")}>{token ? "Dashboard" : "Register"}</button></div></div></div><div className="footer-bottom"><span>© 2026 LearnTrack AI. All rights reserved.</span><span>Built for better learning.</span></div></footer>
    </div>
  );
}
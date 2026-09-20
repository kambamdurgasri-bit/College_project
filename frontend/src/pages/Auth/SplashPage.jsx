import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowDownRight,
  ArrowRight,
  BarChart3,
  BookOpen,
  BrainCircuit,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  GraduationCap,
  Lightbulb,
  Menu,
  NotebookTabs,
  Sparkles,
  Target,
  X,
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import "./SplashPage.css";

// (features and steps arrays...)


const features = [
  {
    icon: BookOpen,
    accent: "blue",
    title: "Learning Spaces",
    text: "Organize your subjects, manage materials, and keep your learning journey in one place.",
  },
  {
    icon: BrainCircuit,
    accent: "violet",
    title: "AI-Powered Quizzes",
    text: "Generate quizzes from topics or your own study materials.",
  },
  {
    icon: BarChart3,
    accent: "green",
    title: "Progress Analytics",
    text: "Track your performance with detailed analytics and visual insights.",
  },
  {
    icon: Lightbulb,
    accent: "orange",
    title: "Smart Recommendations",
    text: "Get personalized suggestions based on your weak topics and learning patterns.",
  },
];

const steps = [
  ["01", "Plan Your Learning", "Create Learning Spaces and set your study timetable."],
  ["02", "Study Your Topics", "Learn from your study materials and resources."],
  ["03", "Test Your Understanding", "Generate and attempt AI-powered quizzes."],
  ["04", "Improve with Insights", "Review scores, track progress, and get recommendations."],
];

const previewTabs = ["Dashboard", "Learning Spaces", "Quiz Interface", "Analytics"];

function DashboardPreview({ compact = false }) {
  return (
    <div className={`dashboard-preview ${compact ? "dashboard-preview-compact" : ""}`}>
      <div className="preview-sidebar">
        <div className="preview-brand">
          <span className="brand-mark"><GraduationCap size={14} /></span>
          <span>LearnTrack <b>AI</b></span>
        </div>
        {[
          "Dashboard",
          "Learning Spaces",
          "Timetable",
          "Quizzes",
          "Analytics",
          "Recommendations",
          "Profile",
        ].map((item, index) => (
          <div className={`preview-nav-item ${index === 0 ? "active" : ""}`} key={item}>
            {index === 0 && <BarChart3 size={11} />}
            {index === 1 && <BookOpen size={11} />}
            {index === 2 && <CalendarDays size={11} />}
            {index === 3 && <BrainCircuit size={11} />}
            {index === 4 && <BarChart3 size={11} />}
            {index === 5 && <Sparkles size={11} />}
            {index === 6 && <Target size={11} />}
            {item}
          </div>
        ))}
      </div>
      <div className="preview-main">
        <div className="preview-topbar">
          <span className="preview-search">⌕&nbsp; Search anything...</span>
          <span className="preview-user">S</span>
        </div>
        <div className="preview-greeting">
          <div>
            <span>Good morning, Student! 👋</span>
            <small>Stay consistent. Small steps make big progress.</small>
          </div>
          <small>Mon, 26 May 2025</small>
        </div>
        <div className="preview-stat-grid">
          <div className="preview-stat blue"><BookOpen size={14} /><small>Learning Spaces</small><strong>06</strong><em>Active subjects</em></div>
          <div className="preview-stat green"><Check size={14} /><small>Quizzes Taken</small><strong>24</strong><em>This month</em></div>
          <div className="preview-stat violet"><Target size={14} /><small>Average Score</small><strong>84%</strong><em>+8% this month</em></div>
          <div className="preview-stat orange"><Clock3 size={14} /><small>Study Streak</small><strong>7</strong><em>Days in a row</em></div>
        </div>
        <div className="preview-content-grid">
          <div className="preview-panel progress-panel">
            <div className="panel-heading">
              <b>Weekly Progress</b>
              <span>This Week⌄</span>
            </div>
            <div className="chart">
              <i style={{ height: "38%" }} />
              <i style={{ height: "56%" }} />
              <i style={{ height: "47%" }} />
              <i style={{ height: "78%" }} />
              <i style={{ height: "62%" }} />
              <i style={{ height: "89%" }} />
              <i style={{ height: "68%" }} />
            </div>
            <div className="chart-labels">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </div>
          <div className="preview-panel schedule-panel">
            <div className="panel-heading">
              <b>Today's Schedule</b>
              <a href="#preview">View All</a>
            </div>
            {[
              ["09:00 AM", "Data Structures"],
              ["11:00 AM", "DBMS Revision"],
              ["02:00 PM", "AI Quiz Practice"],
              ["04:00 PM", "Read Research Paper"],
            ].map(([time, label]) => (
              <div className="schedule-row" key={label}>
                <span>{time}</span>
                <b>{label}</b>
                <small>1 hour</small>
              </div>
            ))}
          </div>
        </div>
        <div className="preview-bottom-grid">
          <div className="preview-panel recommendation">
            <div className="panel-heading">
              <b>AI Recommendation</b>
              <Sparkles size={13} />
            </div>
            <div className="recommendation-body">
              <span className="bulb"><Lightbulb size={15} /></span>
              <p>
                <b>Focus on Tree Traversal</b>
                <small>Your recent scores show room for improvement in this topic.</small>
              </p>
            </div>
            <button>Generate Practice Quiz <ArrowRight size={11} /></button>
          </div>
          <div className="preview-panel recent">
            <div className="panel-heading">
              <b>Recent Quizzes</b>
              <a href="#preview">View All</a>
            </div>
            {[
              ["Arrays - Easy", "90%"],
              ["DBMS - Medium", "70%"],
              ["OOP Concepts", "86%"],
            ].map(([label, score]) => (
              <div className="recent-row" key={label}>
                <Check size={11} />
                <span>{label}</span>
                <b>{score}</b>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SplashPage() {
  const navigate = useNavigate();
  const token = useAuthStore((s) => s.token);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activePreview, setActivePreview] = useState("Dashboard");

  const goTo = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  const scrollTo = (id) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="landing-page">
      <header className="landing-nav">
        <button className="landing-logo" onClick={() => scrollTo("top")} aria-label="Go to top">
          <span className="logo-icon"><GraduationCap size={19} /></span>
          <span>LearnTrack <b>AI</b></span>
        </button>

        <nav className={menuOpen ? "open" : ""}>
          <button onClick={() => scrollTo("features")}>Features</button>
          <button onClick={() => scrollTo("how-it-works")}>How It Works</button>
          <button onClick={() => scrollTo("preview")}>Preview</button>
          <button onClick={() => scrollTo("about")}>About</button>
          {token ? (
            <button className="nav-cta" onClick={() => goTo("/dashboard")}>
              Go to Dashboard <ArrowRight size={14} />
            </button>
          ) : (
            <>
              <button className="nav-login" onClick={() => goTo("/login")}>Login</button>
              <button className="nav-cta" onClick={() => goTo("/register")}>
                Get Started <ArrowRight size={14} />
              </button>
            </>
          )}
        </nav>

        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </header>

      <main id="top">
        <section className="hero-section">
          <div className="hero-copy">
            <span className="eyebrow"><Sparkles size={12} /> AI-Powered Learning Platform</span>
            <h1>
              Learn Smarter.<br />
              Track Your Progress.<br />
              <span>Improve Every Day.</span>
            </h1>
            <p>
              Organize your subjects, plan your study schedule, generate AI-powered quizzes,
              and get personalized recommendations to truly understand what you learn.
            </p>
            <div className="hero-actions">
              {token ? (
                <button className="button-primary" onClick={() => goTo("/dashboard")}>
                  Go to Dashboard <ArrowRight size={16} />
                </button>
              ) : (
                <button className="button-primary" onClick={() => goTo("/register")}>
                  Get Started — Free <ArrowRight size={16} />
                </button>
              )}
              <button className="button-secondary" onClick={() => scrollTo("features")}>
                Explore Features <ArrowDownRight size={16} />
              </button>
            </div>
            <div className="hero-highlights">
              <span><Target size={16} /><b>Plan<br />Your Study</b></span>
              <span><BrainCircuit size={16} /><b>Practice<br />with AI</b></span>
              <span><BarChart3 size={16} /><b>Track<br />Progress</b></span>
              <span><Lightbulb size={16} /><b>Improve<br />with Insights</b></span>
            </div>
          </div>

          <div className="hero-visual">
            <DashboardPreview />
          </div>
        </section>

        <section className="features-section section-shell" id="features">
          <div className="section-heading">
            <h2>Powerful Features for Better Learning</h2>
            <p>Everything you need to plan, practice, and progress — powered by AI.</p>
          </div>

          <div className="feature-grid">
            {features.map(({ icon: Icon, accent, title, text }) => (
              <article className="feature-card" key={title}>
                <span className={`feature-icon ${accent}`}><Icon size={22} /></span>
                <h3>{title}</h3>
                <p>{text}</p>
                <button onClick={() => scrollTo("preview")}>Learn more <ChevronRight size={13} /></button>
              </article>
            ))}
          </div>
        </section>

        <section className="steps-section section-shell" id="how-it-works">
          <div className="section-heading">
            <h2>How It Works</h2>
            <p>A simple process to a better you.</p>
          </div>

          <div className="steps-grid">
            {steps.map(([number, title, text], index) => (
              <article className="step" key={number}>
                <div className="step-number">{number}</div>
                <span className="step-icon">
                  {index === 0 && <CalendarDays />}
                  {index === 1 && <NotebookTabs />}
                  {index === 2 && <BrainCircuit />}
                  {index === 3 && <BarChart3 />}
                </span>
                <h3>{title}</h3>
                <p>{text}</p>
                {index < 3 && <ArrowRight className="step-arrow" size={20} />}
              </article>
            ))}
          </div>
        </section>

        <section className="preview-section section-shell" id="preview">
          <div className="preview-copy">
            <div className="section-heading">
              <h2>See LearnTrack AI in Action</h2>
              <p>A glimpse of your learning journey.</p>
            </div>

            <div className="preview-benefits">
              <span>
                <BookOpen size={18} />
                <b>Your complete learning overview<br /><small>in one place.</small></b>
              </span>
              <span>
                <CalendarDays size={18} />
                <b>Track progress, view schedules,<br /><small>and get AI recommendations.</small></b>
              </span>
              <span>
                <Target size={18} />
                <b>Stay organized and consistent<br /><small>with your goals.</small></b>
              </span>
            </div>
          </div>

          <div className="product-preview">
            <div className="preview-tabs">
              {previewTabs.map((tab) => (
                <button
                  className={activePreview === tab ? "active" : ""}
                  onClick={() => setActivePreview(tab)}
                  key={tab}
                >
                  {tab}
                </button>
              ))}
            </div>
            <DashboardPreview compact />
            <span className="preview-callout">
              Plan<br />Practice<br />Progress<br />Repeat! <ArrowDownRight size={19} />
            </span>
          </div>
        </section>

        <section className="cta-section section-shell" id="about">
          <div>
            <h2>Ready to Start Your Learning Journey?</h2>
            <p>Join LearnTrack AI and take control of your learning today.</p>
          </div>
          <button className="button-light" onClick={() => goTo("/register")}>
            Get Started — Free <ArrowRight size={16} />
          </button>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="footer-brand">
          <button className="landing-logo" onClick={() => scrollTo("top")}>
            <span className="logo-icon"><GraduationCap size={19} /></span>
            <span>LearnTrack <b>AI</b></span>
          </button>
          <p>Learn Smarter. Progress Further.</p>
        </div>

        <div className="footer-links">
          <div>
            <b>Product</b>
            <button onClick={() => scrollTo("features")}>Features</button>
            <button onClick={() => scrollTo("how-it-works")}>How It Works</button>
            <button onClick={() => scrollTo("preview")}>Preview</button>
          </div>
          <div>
            <b>Resources</b>
            <button onClick={() => scrollTo("how-it-works")}>Study Tips</button>
            <button onClick={() => scrollTo("about")}>Learning Guide</button>
            <button onClick={() => goTo("/login")}>Support</button>
          </div>
          <div>
            <b>Get Started</b>
            <button onClick={() => goTo("/login")}>Login</button>
            <button onClick={() => goTo("/register")}>Register</button>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2025 LearnTrack AI. All rights reserved.</span>
          <span>Built for better learning.</span>
        </div>
      </footer>
    </div>
  );
}

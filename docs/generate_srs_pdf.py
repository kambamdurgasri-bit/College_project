"""Generate Software Requirements Specification PDF for LearnTrack AI."""

from fpdf import FPDF
from pathlib import Path

OUT = Path(__file__).resolve().parent / "SRS_LearnTrack_AI.pdf"


def ascii_safe(text: str) -> str:
    replacements = {
        "\u2014": "-",
        "\u2013": "-",
        "\u2022": "-",
        "\u2018": "'",
        "\u2019": "'",
        "\u201c": '"',
        "\u201d": '"',
    }
    for src, dst in replacements.items():
        text = text.replace(src, dst)
    return text.encode("ascii", "replace").decode("ascii")


class SRS(FPDF):
    def cell(self, w, h=0, text="", *args, **kwargs):
        if isinstance(text, str):
            text = ascii_safe(text)
        return super().cell(w, h, text, *args, **kwargs)

    def multi_cell(self, w, h=0, text="", *args, **kwargs):
        if isinstance(text, str):
            text = ascii_safe(text)
        return super().multi_cell(w, h, text, *args, **kwargs)

    def header(self):
        if self.page_no() > 1:
            self.set_font("Helvetica", "I", 9)
            self.cell(0, 8, "Software Requirements Specification for LearnTrack AI", align="C")
            self.ln(10)

    def footer(self):
        self.set_y(-15)
        self.set_font("Helvetica", "I", 9)
        self.cell(0, 10, f"Page {self.page_no()}", align="C")

    def _full_width_cell(self, h: float, text: str, style: tuple[str, str, int]):
        self.set_x(self.l_margin)
        self.set_font(*style)
        self.multi_cell(self.epw, h, text)

    def section_title(self, num: str, title: str):
        self._full_width_cell(8, ascii_safe(f"{num} {title}"), ("Helvetica", "B", 14))
        self.ln(2)

    def sub_title(self, num: str, title: str):
        self._full_width_cell(7, ascii_safe(f"{num} {title}"), ("Helvetica", "B", 12))
        self.ln(1)

    def body(self, text: str):
        self._full_width_cell(6, ascii_safe(text), ("Helvetica", "", 11))
        self.ln(2)

    def bullet(self, text: str):
        self._full_width_cell(6, ascii_safe(f"- {text}"), ("Helvetica", "", 11))


def build():
    pdf = SRS()
    pdf.set_auto_page_break(auto=True, margin=20)
    pdf.add_page()

    # Title page
    pdf.ln(40)
    pdf.set_font("Helvetica", "B", 22)
    pdf.multi_cell(0, 12, "Software Requirements\nSpecification", align="C")
    pdf.ln(8)
    pdf.set_font("Helvetica", "B", 16)
    pdf.multi_cell(0, 10, "For\nLearnTrack AI", align="C")
    pdf.ln(12)
    pdf.set_font("Helvetica", "", 12)
    pdf.cell(0, 8, "Version 1.0 approved", align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(8)
    pdf.cell(0, 8, "Prepared by", align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.cell(0, 8, "College Project Development Team", align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(4)
    pdf.cell(0, 8, "Software Engineering - College Project", align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(8)
    pdf.cell(0, 8, "28 September, 2026", align="C")

    # TOC
    pdf.add_page()
    pdf.set_font("Helvetica", "B", 14)
    pdf.cell(0, 10, "Table of Contents", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(4)
    toc = [
        "1. Introduction",
        "1.1 Purpose",
        "1.2 Document Conventions",
        "1.3 Intended Audience and Reading Suggestions",
        "1.4 Product Scope",
        "1.5 References",
        "2. Overall Description",
        "2.1 Product Perspective",
        "2.2 Product Functions",
        "2.3 User Classes and Characteristics",
        "2.4 Operating Environment",
        "2.5 Design and Implementation Constraints",
        "2.6 User Documentation",
        "2.7 Assumptions and Dependencies",
        "3. External Interface Requirements",
        "4. System Features",
        "5. Other Nonfunctional Requirements",
        "6. Other Requirements",
        "Appendix A: Glossary",
        "Appendix B: Analysis Models",
        "Appendix C: To Be Determined List",
        "Revision History",
    ]
    pdf.set_font("Helvetica", "", 11)
    for line in toc:
        pdf.cell(0, 6, line, new_x="LMARGIN", new_y="NEXT")

    pdf.add_page()
    pdf.set_font("Helvetica", "B", 12)
    pdf.cell(0, 8, "Revision History", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(2)
    pdf.set_font("Helvetica", "", 10)
    pdf.cell(40, 7, "Name", border=1)
    pdf.cell(35, 7, "Date", border=1)
    pdf.cell(70, 7, "Reason For Changes", border=1)
    pdf.cell(25, 7, "Version", border=1, new_x="LMARGIN", new_y="NEXT")
    pdf.cell(40, 7, "Team", border=1)
    pdf.cell(35, 7, "28-Sep-2026", border=1)
    pdf.cell(70, 7, "Initial SRS release", border=1)
    pdf.cell(25, 7, "1.0", border=1, new_x="LMARGIN", new_y="NEXT")

    # Section 1
    pdf.add_page()
    pdf.section_title("1.", "Introduction")
    pdf.sub_title("1.1", "Purpose")
    pdf.body(
        "The purpose of this document is to specify the software requirements for LearnTrack AI, "
        "an intelligent web-based learning management and assessment platform for college students. "
        "LearnTrack AI helps learners organize subjects into Learning Spaces, schedule study time, "
        "upload study materials, generate AI-powered quizzes, track performance through analytics, "
        "and receive personalized study recommendations. This Software Requirements Specification (SRS) "
        "covers revision 1.0 of the complete product delivered as part of the College_project repository."
    )
    pdf.sub_title("1.2", "Document Conventions")
    pdf.body(
        "Section and subsection headings are shown in bold for emphasis. Functional requirements are "
        "labeled REQ-n within each system feature. Priority levels (High, Medium, Low) indicate "
        "implementation and testing order. Design constraints use the prefix CO-, assumptions AS-, "
        "and dependencies DE-. User interface requirements use UI-."
    )
    pdf.sub_title("1.3", "Intended Audience and Reading Suggestions")
    pdf.body(
        "This SRS is intended for developers implementing the React frontend and Node.js/Express backend, "
        "quality assurance engineers writing test cases, project evaluators, and maintainers extending "
        "the platform. Readers should begin with Sections 1 and 2 for context, then Section 4 for "
        "detailed functional behavior, and Section 5 for nonfunctional constraints."
    )
    pdf.sub_title("1.4", "Product Scope")
    pdf.body(
        "LearnTrack AI is a responsive web application that centralizes a student's learning workflow. "
        "Students create Learning Spaces per subject or course, add topics and file resources (including PDFs), "
        "maintain a weekly timetable, generate multiple-choice quizzes from topics or uploaded materials using "
        "external AI services, attempt quizzes, review history and scores, view dashboard and analytics charts, "
        "and receive AI-driven recommendations for weak topics. Authentication uses secure registration, login, "
        "JWT sessions, and email-based password reset. Future enhancements may include native mobile apps, "
        "collaborative spaces, and institutional admin roles."
    )
    pdf.sub_title("1.5", "References")
    pdf.bullet("React Documentation: https://react.dev/")
    pdf.bullet("Vite Documentation: https://vite.dev/")
    pdf.bullet("Express.js Documentation: https://expressjs.com/")
    pdf.bullet("Prisma ORM Documentation: https://www.prisma.io/docs")
    pdf.bullet("PostgreSQL Documentation: https://www.postgresql.org/docs/")
    pdf.bullet("OpenRouter API: https://openrouter.ai/docs")
    pdf.bullet("IEEE SRS Template (Karl Wiegers): http://www.frontiernet.net/~kwiegers/process_assets/srs_template.doc")
    pdf.ln(2)

    # Section 2
    pdf.add_page()
    pdf.section_title("2.", "Overall Description")
    pdf.sub_title("2.1", "Product Perspective")
    pdf.body(
        "LearnTrack AI is a new, self-contained product composed of a single-page application frontend "
        "(learntrack-ai) and a REST API backend deployed separately (e.g., Vercel for frontend, Render for backend). "
        "It replaces fragmented tools—paper timetables, ad hoc quiz apps, and unstructured file folders—with one "
        "integrated system. The product connects to PostgreSQL for persistence, Resend for transactional email, "
        "and OpenRouter or Google Gemini for quiz generation. Users interact only through the browser; all business "
        "logic and data access reside on the server."
    )
    pdf.sub_title("2.2", "Product Functions")
    pdf.bullet("User registration, login, logout, and password recovery.")
    pdf.bullet("Profile and account settings management.")
    pdf.bullet("Create, view, edit, and delete Learning Spaces with topics and resources.")
    pdf.bullet("Weekly study timetable creation and editing.")
    pdf.bullet("AI-generated topic quizzes and PDF-based quizzes with configurable difficulty.")
    pdf.bullet("Quiz attempts, scoring, and quiz history.")
    pdf.bullet("Dashboard summaries and progress analytics with charts.")
    pdf.bullet("Personalized AI recommendations based on quiz performance and schedule.")
    pdf.ln(2)
    pdf.sub_title("2.3", "User Classes and Characteristics")
    pdf.body(
        "Primary user class: Student — enrolled in college courses, moderate computer literacy, uses the product "
        "daily or weekly to organize study and self-assess. All authenticated students have equal access to product "
        "functions; there is no separate administrator role in version 1.0. Secondary audience: instructors or "
        "evaluators who may review demo accounts during project assessment."
    )
    pdf.sub_title("2.4", "Operating Environment")
    pdf.bullet("Device: Desktop, laptop, tablet, or smartphone with a modern web browser.")
    pdf.bullet("Operating System: Windows 10+, macOS, Linux, Android, iOS (browser).")
    pdf.bullet("RAM: 256 MB or more for client; server requires scalable cloud hosting.")
    pdf.bullet("Browsers: Google Chrome 100+, Mozilla Firefox 100+, Microsoft Edge 100+.")
    pdf.bullet("Network: Stable internet connection (minimum 1 Mbps recommended for AI quiz generation).")
    pdf.ln(2)
    pdf.sub_title("2.5", "Design and Implementation Constraints")
    pdf.bullet("CO-1: Project delivery follows the academic semester timeline for the College_project course.")
    pdf.bullet("CO-2: Frontend shall use React 19, Vite, Tailwind CSS, React Router, and Zustand.")
    pdf.bullet("CO-3: Backend shall use Node.js, Express 5, Prisma ORM, and PostgreSQL.")
    pdf.bullet("CO-4: Authentication shall use JWT bearer tokens and bcrypt password hashing.")
    pdf.bullet("CO-5: AI features depend on configured OPENROUTERAI_API and/or GEMINI_API_KEY environment variables.")
    pdf.bullet("CO-6: The user interface shall be in English.")
    pdf.ln(2)
    pdf.sub_title("2.6", "User Documentation")
    pdf.body(
        "The splash landing page describes product features and workflow steps. In-app labels, form placeholders, "
        "validation messages, and settings help users complete tasks without a separate printed manual. Error responses "
        "from the API are surfaced in the UI where applicable."
    )
    pdf.sub_title("2.7", "Assumptions and Dependencies")
    pdf.bullet("AS-1: Users read and write English.")
    pdf.bullet("AS-2: Users have valid email addresses for registration and password reset.")
    pdf.bullet("AS-3: Users upload study materials they are permitted to use.")
    pdf.bullet("DE-1: PostgreSQL database is available in development and production.")
    pdf.bullet("DE-2: Resend (or equivalent) is configured for password-reset emails.")
    pdf.bullet("DE-3: OpenRouter or Gemini API is reachable for AI quiz generation.")
    pdf.ln(2)

    # Section 3
    pdf.add_page()
    pdf.section_title("3.", "External Interface Requirements")
    pdf.sub_title("3.1", "User Interfaces")
    pdf.bullet("UI-1: Splash/landing page with product overview, feature highlights, and links to login/register.")
    pdf.bullet("UI-2: Authentication pages for login, registration, and forgot-password flow.")
    pdf.bullet("UI-3: Application shell with sidebar navigation to Dashboard, Learning Spaces, Timetable, Quizzes, Analytics, Recommendations, Profile, and Settings.")
    pdf.bullet("UI-4: Forms for Learning Spaces, topics, resources, timetable entries, and quiz configuration.")
    pdf.bullet("UI-5: Quiz interface for answering multiple-choice questions and viewing results.")
    pdf.bullet("UI-6: Analytics and dashboard views using charts (Recharts) for progress visualization.")
    pdf.bullet("UI-7: Responsive layout supporting light/dark theme from Settings.")
    pdf.bullet("UI-8: Modal dialogs and inline validation for errors and confirmations.")
    pdf.ln(2)
    pdf.sub_title("3.2", "Hardware Interfaces")
    pdf.body("Not applicable. The product is a web application; no direct hardware device integration is required.")
    pdf.sub_title("3.3", "Software Interfaces")
    pdf.bullet("Client: React SPA served via Vite; communicates with backend REST API over HTTPS.")
    pdf.bullet("Server: Express application exposing /api/* routes and static /uploads for resource files.")
    pdf.bullet("Database: PostgreSQL accessed through Prisma Client.")
    pdf.bullet("Email: Resend API for password reset messages.")
    pdf.bullet("AI: OpenRouter chat completions API (primary) and optional Google Gemini API.")
    pdf.ln(2)
    pdf.sub_title("3.4", "Communication Interfaces")
    pdf.body(
        "All client-server communication uses HTTP/HTTPS with JSON request and response bodies. "
        "Authenticated requests include Authorization: Bearer <JWT>. CORS is restricted to configured "
        "client origins. File uploads use multipart form data to resource endpoints."
    )

    # Section 4 - features (split across pages)
    pdf.add_page()
    pdf.section_title("4.", "System Features")

    features = [
        (
            "4.1",
            "Authentication and Authorization",
            "High",
            "Users register with name, email, password, and optional phone number. Passwords are hashed with bcrypt. "
            "Login returns a JWT valid for seven days. Protected routes require a valid token. Logout clears client session. "
            "Forgot-password sends a time-limited reset link via email.",
            "User submits registration form; system validates input, creates account, and prompts login. "
            "User logs in with email/password; system returns token and redirects to dashboard. "
            "User requests password reset; system emails link if account exists.",
            [
                "REQ-1: System shall reject duplicate email addresses on registration.",
                "REQ-2: System shall verify passwords using bcrypt before issuing JWT.",
                "REQ-3: System shall expire password reset tokens after one hour.",
                "REQ-4: System shall return HTTP 401 for missing or invalid JWT on protected API routes.",
            ],
        ),
        (
            "4.2",
            "User Profile and Settings",
            "Medium",
            "Authenticated users view and edit profile details (name, university, bio, etc.), change password, "
            "toggle application theme, and delete their account with confirmation.",
            "User opens Profile or Settings; edits fields and saves; system persists changes via profile API.",
            [
                "REQ-1: Profile updates shall apply only to the authenticated user.",
                "REQ-2: Password change shall require current password verification.",
                "REQ-3: Theme preference shall persist in client storage for subsequent sessions.",
            ],
        ),
        (
            "4.3",
            "Learning Spaces Management",
            "High",
            "Users create Learning Spaces to represent subjects or courses. Each space supports custom name, icon, and color. "
            "Users list, open, edit, and delete their spaces. Space details show topic progress, quizzes, resources, and activity.",
            "User creates a space from the Learning Spaces page; system stores record linked to userId. "
            "User opens a space to manage topics and resources or view progress metrics.",
            [
                "REQ-1: Users shall only access Learning Spaces they own.",
                "REQ-2: Deleting a space shall remove or cascade related topics, resources, and quizzes per database rules.",
                "REQ-3: Progress percentage shall derive from quiz attempt scores within the space.",
            ],
        ),
        (
            "4.4",
            "Topics and Study Resources",
            "High",
            "Within a Learning Space, users add topics with name and description and track topic status. "
            "Users upload study resources (e.g., PDF) attached to topics for use in AI quiz generation.",
            "User adds topic or uploads file; system validates ownership of space and stores metadata and file in uploads storage.",
            [
                "REQ-1: Resource files shall be stored on server filesystem under configured UPLOAD_DIR.",
                "REQ-2: PDF text may be extracted server-side to enrich AI quiz prompts.",
                "REQ-3: Users shall not attach resources to spaces owned by other users.",
            ],
        ),
        (
            "4.5",
            "Study Timetable",
            "Medium",
            "Users maintain a weekly timetable with day, subject, start time, and end time entries for planning study sessions.",
            "User adds or edits schedule rows; timetable view displays week grid; changes persist per user.",
            [
                "REQ-1: Timetable entries shall be scoped to the authenticated user.",
                "REQ-2: System shall validate that end time is after start time.",
                "REQ-3: Recommendations may reference timetable gaps for scheduling suggestions.",
            ],
        ),
        (
            "4.6",
            "AI Quiz Generation and Attempts",
            "High",
            "Users generate quizzes by topic, difficulty (EASY/MEDIUM/HARD), and optional linked topic/resources. "
            "The backend calls AI providers to produce multiple-choice questions with four options. "
            "Users submit answers; system scores attempts, stores history, and shows results.",
            "User selects learning space and quiz parameters; system requests AI generation, saves quiz and questions, "
            "presents quiz UI; on submit, system records QuizAttempt and AttemptAnswers.",
            [
                "REQ-1: If AI provider is unavailable, system shall return a clear error without storing fake questions.",
                "REQ-2: Each question shall include question text, options array, and correct answer.",
                "REQ-3: Score shall reflect number of correct answers relative to total questions.",
                "REQ-4: Quiz history shall list past attempts with scores and timestamps.",
            ],
        ),
        (
            "4.7",
            "Dashboard and Progress Analytics",
            "Medium",
            "Dashboard summarizes learning activity. Analytics page shows aggregate quiz statistics, performance trends, "
            "and per-learning-space breakdown using chart components.",
            "User navigates to Dashboard or Analytics; client fetches /api/dashboard and /api/analytics; charts render aggregated data.",
            [
                "REQ-1: Analytics data shall include only the current user's attempts.",
                "REQ-2: Weekly progress charts shall reflect recent quiz activity.",
            ],
        ),
        (
            "4.8",
            "AI Recommendations",
            "Medium",
            "System analyzes quiz attempt averages by topic, timetable, and learning spaces to produce actionable suggestions "
            "such as revising weak topics or maintaining strong performance.",
            "User opens AI Recommendations page; system computes weak topics (average score below 70%) and displays prioritized suggestions.",
            [
                "REQ-1: Recommendations shall update based on latest quiz attempts.",
                "REQ-2: Users with no attempts shall receive onboarding guidance to create spaces and quizzes.",
            ],
        ),
    ]

    for num, name, priority, desc, stimulus, reqs in features:
        pdf.sub_title(num, name)
        pdf.set_font("Helvetica", "B", 11)
        pdf.cell(0, 6, f"{num}.1 Description and Priority", new_x="LMARGIN", new_y="NEXT")
        pdf.set_font("Helvetica", "", 11)
        pdf.multi_cell(0, 6, f"Priority: {priority}. {desc}")
        pdf.ln(1)
        pdf.set_font("Helvetica", "B", 11)
        pdf.cell(0, 6, f"{num}.2 Stimulus/Response Sequences", new_x="LMARGIN", new_y="NEXT")
        pdf.set_font("Helvetica", "", 11)
        pdf.multi_cell(0, 6, stimulus)
        pdf.ln(1)
        pdf.set_font("Helvetica", "B", 11)
        pdf.cell(0, 6, f"{num}.3 Functional Requirements", new_x="LMARGIN", new_y="NEXT")
        for r in reqs:
            pdf.bullet(r)
        pdf.ln(2)
        if pdf.get_y() > 250:
            pdf.add_page()

    # Section 5
    pdf.add_page()
    pdf.section_title("5.", "Other Nonfunctional Requirements")
    pdf.sub_title("5.1", "Performance Requirements")
    pdf.body(
        "Standard CRUD operations should complete within 2 seconds under normal load. AI quiz generation may take "
        "up to 60 seconds due to external API latency; the UI shall indicate loading state. The application should "
        "support concurrent student users on cloud-hosted infrastructure with horizontal scaling of the API tier."
    )
    pdf.sub_title("5.2", "Safety Requirements")
    pdf.bullet("Production database backups shall be performed by the hosting provider or scheduled jobs.")
    pdf.bullet("API keys (JWT_SECRET, AI keys, email keys) shall not be committed to source control.")
    pdf.bullet("Uploaded files shall be scanned for size limits to prevent storage abuse.")
    pdf.ln(2)
    pdf.sub_title("5.3", "Security Requirements")
    pdf.bullet("Passwords stored only as bcrypt hashes.")
    pdf.bullet("HTTPS enforced in production deployments.")
    pdf.bullet("JWT secret required in environment; tokens expire after seven days.")
    pdf.bullet("CORS limited to known frontend origins.")
    pdf.bullet("Password reset tokens are single-use and time-limited.")
    pdf.ln(2)
    pdf.sub_title("5.4", "Software Quality Attributes")
    pdf.bullet("Usability: Clean sidebar navigation and consistent Tailwind-based UI components.")
    pdf.bullet("Availability: Target 99% uptime for demo/production deployments excluding planned maintenance.")
    pdf.bullet("Maintainability: Modular backend routes/services and separated frontend pages/components.")
    pdf.bullet("Testability: API health endpoints and seed script for demo data.")
    pdf.ln(2)
    pdf.sub_title("5.5", "Business Rules")
    pdf.body(
        "Each user owns their Learning Spaces, timetables, quiz attempts, and recommendations. "
        "Users may not view or modify another user's data. Deletion of an account removes associated personal data per implementation policy."
    )

    pdf.section_title("6.", "Other Requirements")
    pdf.body(
        "Deployment configuration includes render.yaml for backend services and vercel.json for frontend API proxying. "
        "Environment variables must be documented in .env.example files for local development."
    )

    pdf.add_page()
    pdf.section_title("Appendix A:", "Glossary")
    glossary = [
        ("API", "Application Programming Interface"),
        ("JWT", "JSON Web Token used for authentication"),
        ("Learning Space", "A user-defined container for a subject, its topics, resources, and quizzes"),
        ("ORM", "Object-Relational Mapping (Prisma)"),
        ("REST", "Representational State Transfer architectural style for the backend API"),
        ("SPA", "Single Page Application (React frontend)"),
        ("SRS", "Software Requirements Specification"),
    ]
    for term, definition in glossary:
        pdf.body(f"{term}: {definition}")

    pdf.ln(4)
    pdf.section_title("Appendix B:", "Analysis Models")
    pdf.body(
        "Entity relationships (conceptual): Users own LearningSpaces, Timetables, QuizAttempts, and Recommendations. "
        "LearningSpaces contain Topics, Resources, and Quizzes. Quizzes contain Questions. QuizAttempts link Users to Quizzes "
        "and store AttemptAnswers per Question. PasswordResets link temporary tokens to Users."
    )
    pdf.body(
        "Primary use cases: Register/Login, Manage Learning Space, Upload Resource, Schedule Timetable, Generate AI Quiz, "
        "Attempt Quiz, View Analytics, View Recommendations, Update Profile."
    )

    pdf.section_title("Appendix C:", "To Be Determined List")
    pdf.bullet("TBD-1: Formal password complexity rules for registration (beyond minimum length).")
    pdf.bullet("TBD-2: Maximum upload file size and allowed MIME types policy document.")
    pdf.bullet("TBD-3: Institutional admin and multi-tenant deployment requirements.")
    pdf.bullet("TBD-4: Offline or mobile-native client support timeline.")

    pdf.output(str(OUT))
    print(f"Wrote {OUT}")


if __name__ == "__main__":
    build()

import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  ArrowRight,
  ArrowLeft,
  ListChecks,
  FileUp,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Radio,
  Loader2,
} from "lucide-react";
import { DIFFICULTIES, QUESTION_COUNTS } from "../../quizData";
import { learningSpaceService } from "../../services/learningSpaceService";
import { quizService } from "../../services/quizService";

// ============================================================================
// COLORS & STYLING
// ============================================================================

const COLORS = {
  ink: "#1E293B",
  sub: "#64748B",
  line: "#E4E4EC",
  purple: "#7C3AED",
  purpleSoft: "#F5F3FF",
  purpleDark: "#6D28D9",
  orange: "#F97316",
  orangeSoft: "#FFF7ED",
  green: "#10B981",
  greenSoft: "#F0FDF4",
  red: "#EF4444",
  redSoft: "#FEF2F2",
  white: "#FCFCFE",
};

// ============================================================================
// REUSABLE COMPONENTS
// ============================================================================

function Card({ children, className = "" }) {
  return (
    <section
      className={`rounded-2xl border p-6 shadow-sm ${className}`}
      style={{ borderColor: COLORS.line, backgroundColor: COLORS.white }}
    >
      {children}
    </section>
  );
}

function PrimaryButton({ children, className = "", ...props }) {
  return (
    <button
      {...props}
      className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60 ${className}`}
      style={{ backgroundColor: COLORS.purple }}
    >
      {children}
    </button>
  );
}

function SecondaryButton({ children, className = "", ...props }) {
  return (
    <button
      {...props}
      className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition-colors hover:bg-slate-50 ${className}`}
      style={{ borderColor: COLORS.line, color: COLORS.ink }}
    >
      {children}
    </button>
  );
}

function DifficultyBadge({ level }) {
  const difficulties = {
    Easy: { bg: COLORS.greenSoft, color: COLORS.green, border: "#D1FAE5" },
    Medium: { bg: COLORS.orangeSoft, color: COLORS.orange, border: "#FFEDD5" },
    Hard: { bg: COLORS.redSoft, color: COLORS.red, border: "#FEE2E2" },
  };

  const style = difficulties[level] || difficulties.Medium;

  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold"
      style={{ backgroundColor: style.bg, color: style.color, borderColor: style.border }}
    >
      {level}
    </span>
  );
}

function formatDate(isoString) {
  if (!isoString) return "";
  const d = new Date(isoString);
  return d.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" });
}

// ============================================================================
// QUIZ HOME SCREEN
// ============================================================================

function QuizHome({ goTo }) {
  const [recentAttempts, setRecentAttempts] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    let cancelled = false;
    quizService
      .history(3)
      .then((data) => {
        if (!cancelled) setRecentAttempts(Array.isArray(data) ? data : []);
      })
      .finally(() => {
        if (!cancelled) setLoadingHistory(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <p
          className="mb-1 text-xs font-semibold uppercase tracking-wide"
          style={{ color: COLORS.purple }}
        >
          Quiz & Assessment
        </p>

        <h1
          className="text-2xl font-bold"
          style={{ color: COLORS.ink }}
        >
          Test your knowledge
        </h1>

        <p
          className="mt-1 text-sm"
          style={{ color: COLORS.sub }}
        >
          Create a quiz from a topic or your study material.
        </p>
      </div>

      {/* Quiz generation cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card className="group border border-transparent transition-all hover:-translate-y-0.5 hover:border-purple-100">
          <div
            className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl"
            style={{ background: COLORS.purpleSoft }}
          >
            <ListChecks size={22} color={COLORS.purple} />
          </div>

          <h3
            className="mb-1 text-base font-bold"
            style={{ color: COLORS.ink }}
          >
            From a Topic
          </h3>

          <p
            className="mb-5 text-sm leading-6"
            style={{ color: COLORS.sub }}
          >
            Choose a learning space and topic, then customize the difficulty
            before starting your quiz.
          </p>

          <PrimaryButton
            onClick={() => goTo("generate", { source: "topic" })}
            className="w-full"
          >
            Create Topic Quiz
            <ArrowRight size={15} />
          </PrimaryButton>
        </Card>

        <Card className="group border border-transparent transition-all hover:-translate-y-0.5 hover:border-orange-100">
          <div
            className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl"
            style={{ background: COLORS.orangeSoft }}
          >
            <FileUp size={22} color={COLORS.orange} />
          </div>

          <h3
            className="mb-1 text-base font-bold"
            style={{ color: COLORS.ink }}
          >
            From a PDF
          </h3>

          <p
            className="mb-5 text-sm leading-6"
            style={{ color: COLORS.sub }}
          >
            Upload your study material and generate a quiz based on
            the content.
          </p>

          <SecondaryButton
            onClick={() => goTo("generate", { source: "pdf" })}
            className="w-full"
          >
            Upload Study Material
            <ArrowRight size={15} />
          </SecondaryButton>
        </Card>
      </div>

      {/* Recent attempts */}
      <Card>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3
              className="text-base font-bold"
              style={{ color: COLORS.ink }}
            >
              Recent Quiz Attempts
            </h3>

            <p
              className="mt-1 text-xs"
              style={{ color: COLORS.sub }}
            >
              Your latest quiz performance
            </p>
          </div>

          <button
            onClick={() => goTo("history")}
            className="flex items-center gap-1 text-xs font-semibold transition-opacity hover:opacity-70"
            style={{ color: COLORS.purpleDark }}
          >
            View history
            <ArrowRight size={13} />
          </button>
        </div>

        {loadingHistory ? (
          <p className="py-8 text-center text-sm" style={{ color: COLORS.sub }}>
            Loading...
          </p>
        ) : recentAttempts.length === 0 ? (
          <p className="py-8 text-center text-sm" style={{ color: COLORS.sub }}>
            No quiz attempts yet. Create your first quiz above!
          </p>
        ) : (
          <div
            className="overflow-hidden rounded-xl border"
            style={{ borderColor: COLORS.line }}
          >
            {recentAttempts.map((q, index) => (
              <div
                key={q.quizAttemptId}
                className={`flex flex-wrap items-center justify-between gap-3 px-4 py-4 ${
                  index !== 0 ? "border-t" : ""
                }`}
                style={{
                  borderColor: COLORS.line,
                }}
              >
                <div className="min-w-0">
                  <p
                    className="truncate text-sm font-semibold"
                    style={{ color: COLORS.ink }}
                  >
                    {q.subject} — {q.topic}
                  </p>

                  <p
                    className="mt-1 text-[11px]"
                    style={{ color: COLORS.sub }}
                  >
                    {formatDate(q.attemptedAt)} · {q.totalQuestions} questions
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <DifficultyBadge level={q.difficulty} />

                  <span
                    className="text-sm font-bold"
                    style={{
                      color:
                        q.accuracy >= 70
                          ? COLORS.green
                          : q.accuracy >= 50
                          ? COLORS.orange
                          : COLORS.red,
                    }}
                  >
                    {q.accuracy}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

// ============================================================================
// GENERATE QUIZ SCREEN
// ============================================================================

function GenerateQuiz({ goTo, source, onGenerate }) {
  const [learningSpaces, setLearningSpaces] = useState([]);
  const [loadingSpaces, setLoadingSpaces] = useState(true);
  const [selectedSpace, setSelectedSpace] = useState(null);
  const [topicText, setTopicText] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [selectedCount, setSelectedCount] = useState("");
  const [file, setFile] = useState(null);
  const [showSubjectMenu, setShowSubjectMenu] = useState(false);
  const [showDifficultyMenu, setShowDifficultyMenu] = useState(false);
  const [showCountMenu, setShowCountMenu] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    learningSpaceService.list().then((data) => {
      if (!cancelled) {
        setLearningSpaces(Array.isArray(data) ? data : []);
        setLoadingSpaces(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const isComplete =
    source === "topic"
      ? selectedSpace && topicText.trim() && selectedDifficulty && selectedCount
      : selectedSpace && !!file && selectedDifficulty && selectedCount;

  const handleGenerate = async () => {
    if (!isComplete || submitting) return;
    setError("");
    setSubmitting(true);

    try {
      let createdQuiz;
      if (source === "topic") {
        createdQuiz = await quizService.generate({
          learningSpaceId: selectedSpace.id,
          topic: topicText.trim(),
          difficulty: selectedDifficulty,
          questionCount: parseInt(selectedCount),
        });
      } else {
        createdQuiz = await quizService.generateFromPdf({
          learningSpaceId: selectedSpace.id,
          difficulty: selectedDifficulty,
          questionCount: parseInt(selectedCount),
          file,
        });
      }

      // The creation response includes correct answers — fetch the
      // sanitized attempt version before letting the user take it.
      const attemptQuiz = await quizService.getForAttempt(createdQuiz.id);

      onGenerate({
        id: createdQuiz.id,
        subject: selectedSpace.name,
        topic: createdQuiz.topic,
        difficulty: createdQuiz.difficulty,
        count: attemptQuiz.questions.length,
        questions: attemptQuiz.questions,
      });
    } catch (err) {
      setError(err.message || "Something went wrong generating your quiz. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) setFile(selected);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Back Button at Top */}
      <SecondaryButton onClick={() => goTo("home")} className="w-fit">
        <ArrowLeft size={16} />
        Back to Quiz
      </SecondaryButton>

      {/* Header */}
      <div>
        <p
          className="mb-1 text-xs font-semibold uppercase tracking-wide"
          style={{ color: COLORS.purple }}
        >
          Quiz Setup
        </p>

        <h1
          className="text-2xl font-bold"
          style={{ color: COLORS.ink }}
        >
          {source === "topic" ? "Generate a Topic Quiz" : "Generate a Quiz from PDF"}
        </h1>

        <p
          className="mt-1 text-sm"
          style={{ color: COLORS.sub }}
        >
          {source === "topic"
            ? "Configure your topic quiz before you begin."
            : "Upload your study material and configure your quiz."}
        </p>
      </div>

      {/* Form */}
      <Card>
        <div className="space-y-4">
          {/* Learning Space Dropdown */}
          <div className="relative">
            <label
              className="mb-2 block text-xs font-semibold"
              style={{ color: COLORS.ink }}
            >
              Learning Space
            </label>
            <button
              onClick={() => setShowSubjectMenu(!showSubjectMenu)}
              disabled={loadingSpaces}
              className="w-full rounded-xl border px-4 py-3 text-left text-sm"
              style={{
                borderColor: COLORS.line,
                color: selectedSpace ? COLORS.ink : COLORS.sub,
              }}
            >
              <div className="flex items-center justify-between">
                <span>
                  {loadingSpaces
                    ? "Loading learning spaces..."
                    : selectedSpace?.name || "Select a learning space"}
                </span>
                <ChevronDown
                  size={16}
                  className={`transition-transform ${showSubjectMenu ? "rotate-180" : ""}`}
                />
              </div>
            </button>
            {showSubjectMenu && !loadingSpaces && (
              <div
                className="absolute z-50 mt-2 w-[calc(100%-3rem)] max-w-sm rounded-xl border shadow-lg"
                style={{ borderColor: COLORS.line, backgroundColor: COLORS.white }}
              >
                {learningSpaces.length === 0 ? (
                  <p className="px-4 py-3 text-sm" style={{ color: COLORS.sub }}>
                    No learning spaces yet. Create one first.
                  </p>
                ) : (
                  learningSpaces.map((space) => (
                    <button
                      key={space.id}
                      onClick={() => {
                        setSelectedSpace(space);
                        setShowSubjectMenu(false);
                      }}
                      className="w-full border-b px-4 py-3 text-left text-sm hover:bg-slate-50 last:border-b-0"
                      style={{
                        borderColor: COLORS.line,
                        color: selectedSpace?.id === space.id ? COLORS.purple : COLORS.ink,
                        fontWeight: selectedSpace?.id === space.id ? "600" : "400",
                      }}
                    >
                      {space.name}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {source === "topic" ? (
            <div>
              <label
                className="mb-2 block text-xs font-semibold"
                style={{ color: COLORS.ink }}
              >
                Topic
              </label>
              <input
                type="text"
                value={topicText}
                onChange={(e) => setTopicText(e.target.value)}
                placeholder="e.g. Neural Networks, SQL Joins, Deadlocks..."
                className="w-full rounded-xl border px-4 py-3 text-sm"
                style={{ borderColor: COLORS.line, color: COLORS.ink }}
              />
            </div>
          ) : (
            <div>
              <label
                className="mb-2 block text-xs font-semibold"
                style={{ color: COLORS.ink }}
              >
                Study Material (PDF)
              </label>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="w-full rounded-xl border px-4 py-3 text-sm"
                style={{ borderColor: COLORS.line }}
              />
              {file && (
                <p
                  className="mt-2 text-xs"
                  style={{ color: COLORS.green }}
                >
                  ✓ {file.name}
                </p>
              )}
            </div>
          )}

          {/* Difficulty Dropdown */}
          <div className="relative">
            <label
              className="mb-2 block text-xs font-semibold"
              style={{ color: COLORS.ink }}
            >
              Difficulty
            </label>
            <button
              onClick={() => setShowDifficultyMenu(!showDifficultyMenu)}
              className="w-full rounded-xl border px-4 py-3 text-left text-sm"
              style={{
                borderColor: COLORS.line,
                color: selectedDifficulty ? COLORS.ink : COLORS.sub,
              }}
            >
              <div className="flex items-center justify-between">
                <span>{selectedDifficulty || "Select difficulty"}</span>
                <ChevronDown
                  size={16}
                  className={`transition-transform ${showDifficultyMenu ? "rotate-180" : ""}`}
                />
              </div>
            </button>
            {showDifficultyMenu && (
              <div
                className="absolute z-50 mt-2 w-[calc(100%-3rem)] max-w-sm rounded-xl border shadow-lg"
                style={{ borderColor: COLORS.line, backgroundColor: COLORS.white }}
              >
                {DIFFICULTIES.map((diff) => (
                  <button
                    key={diff}
                    onClick={() => {
                      setSelectedDifficulty(diff);
                      setShowDifficultyMenu(false);
                    }}
                    className="w-full border-b px-4 py-3 text-left text-sm hover:bg-slate-50 last:border-b-0"
                    style={{
                      borderColor: COLORS.line,
                      color: selectedDifficulty === diff ? COLORS.purple : COLORS.ink,
                      fontWeight: selectedDifficulty === diff ? "600" : "400",
                    }}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Question Count Dropdown */}
          <div className="relative">
            <label
              className="mb-2 block text-xs font-semibold"
              style={{ color: COLORS.ink }}
            >
              Number of Questions
            </label>
            <p
              className="mb-2 text-xs"
              style={{ color: COLORS.sub }}
            >
              Choose how many questions you want in your quiz.
            </p>
            <button
              onClick={() => setShowCountMenu(!showCountMenu)}
              className="w-full rounded-xl border px-4 py-3 text-left text-sm"
              style={{
                borderColor: COLORS.line,
                color: selectedCount ? COLORS.ink : COLORS.sub,
              }}
            >
              <div className="flex items-center justify-between">
                <span>{selectedCount ? `${selectedCount} questions` : "Select count"}</span>
                <ChevronDown
                  size={16}
                  className={`transition-transform ${showCountMenu ? "rotate-180" : ""}`}
                />
              </div>
            </button>
            {showCountMenu && (
              <div
                className="absolute z-50 mt-2 w-[calc(100%-3rem)] max-w-sm rounded-xl border shadow-lg"
                style={{ borderColor: COLORS.line, backgroundColor: COLORS.white }}
              >
                {QUESTION_COUNTS.map((count) => (
                  <button
                    key={count}
                    onClick={() => {
                      setSelectedCount(String(count));
                      setShowCountMenu(false);
                    }}
                    className="w-full border-b px-4 py-3 text-left text-sm hover:bg-slate-50 last:border-b-0"
                    style={{
                      borderColor: COLORS.line,
                      color: selectedCount === String(count) ? COLORS.purple : COLORS.ink,
                      fontWeight: selectedCount === String(count) ? "600" : "400",
                    }}
                  >
                    {count} questions
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </Card>

      {error && (
        <div
          className="flex items-center gap-2 rounded-xl border p-4 text-sm"
          style={{ borderColor: "#FEE2E2", backgroundColor: COLORS.redSoft, color: COLORS.red }}
        >
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* Actions */}
      <PrimaryButton
        onClick={handleGenerate}
        disabled={!isComplete || submitting}
        className="w-full"
      >
        {submitting ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Generating Quiz...
          </>
        ) : (
          <>
            Generate Quiz
            <ArrowRight size={16} />
          </>
        )}
      </PrimaryButton>
    </div>
  );
}

// ============================================================================
// QUIZ INSTRUCTIONS SCREEN
// ============================================================================

function QuizInstructions({ goTo, quizConfig, onStart }) {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <p
          className="mb-1 text-xs font-semibold uppercase tracking-wide"
          style={{ color: COLORS.purple }}
        >
          Quiz Setup
        </p>

        <h1
          className="text-2xl font-bold"
          style={{ color: COLORS.ink }}
        >
          Before you start
        </h1>

        <p
          className="mt-1 text-sm"
          style={{ color: COLORS.sub }}
        >
          {quizConfig.subject} — {quizConfig.topic}
        </p>
      </div>

      {/* Quiz Summary */}
      <Card>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-wide"
              style={{ color: COLORS.sub }}
            >
              Questions
            </p>
            <p
              className="mt-2 text-2xl font-bold"
              style={{ color: COLORS.ink }}
            >
              {quizConfig.count}
            </p>
          </div>
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-wide"
              style={{ color: COLORS.sub }}
            >
              Difficulty
            </p>
            <div className="mt-2">
              <DifficultyBadge level={quizConfig.difficulty} />
            </div>
          </div>
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-wide"
              style={{ color: COLORS.sub }}
            >
              Time Limit
            </p>
            <p
              className="mt-2 text-2xl font-bold"
              style={{ color: COLORS.ink }}
            >
              {quizConfig.count}m
            </p>
          </div>
        </div>
      </Card>

      {/* Instructions */}
      <Card>
        <h3
          className="mb-4 text-base font-bold"
          style={{ color: COLORS.ink }}
        >
          Instructions
        </h3>

        <ul className="space-y-3">
          {[
            "Each question has 4 options. Select the correct answer.",
            "You can navigate between questions using the Previous/Next buttons.",
            "Mark questions for review if you want to revisit them later.",
            "Your progress is tracked at the bottom of the screen.",
            "Once you submit your quiz, you cannot change your answers.",
          ].map((instruction, idx) => (
            <li key={idx} className="flex gap-3">
              <CheckCircle size={20} color={COLORS.green} className="mt-0.5 flex-shrink-0" />
              <span style={{ color: COLORS.sub }} className="text-sm">
                {instruction}
              </span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <SecondaryButton onClick={() => goTo("generate", { source: "topic" })} className="flex-1">
          <ArrowLeft size={16} />
          Back
        </SecondaryButton>
        <PrimaryButton onClick={onStart} className="flex-1">
          Start Quiz
          <ArrowRight size={16} />
        </PrimaryButton>
      </div>
    </div>
  );
}

// ============================================================================
// QUIZ ATTEMPT SCREEN
// ============================================================================

function QuizAttempt({ goTo, quizConfig, onSubmit }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState(new Set());
  const [timeLeft, setTimeLeft] = useState(quizConfig.count * 60);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const questions = quizConfig.questions;
  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAnswer = (optionText) => {
    setAnswers({
      ...answers,
      [currentQuestion.questionId]: optionText,
    });
  };

  const handleMarkForReview = () => {
    const newSet = new Set(markedForReview);
    if (newSet.has(currentQuestion.questionId)) {
      newSet.delete(currentQuestion.questionId);
    } else {
      newSet.add(currentQuestion.questionId);
    }
    setMarkedForReview(newSet);
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    setError("");
    try {
      const answerPayload = Object.entries(answers).map(([questionId, selectedAnswer]) => ({
        questionId: Number(questionId),
        selectedAnswer,
      }));
      const result = await quizService.submitAttempt(quizConfig.id, answerPayload);
      onSubmit(result);
    } catch (err) {
      setError(err.message || "Couldn't submit your quiz. Please try again.");
      setSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const answeredCount = Object.keys(answers).length;

  return (
    <div className="flex flex-col gap-4">
      {/* Header with Timer */}
      <div className="flex items-center justify-between gap-4 rounded-xl border bg-white p-4" style={{ borderColor: COLORS.line }}>
        <div>
          <p
            className="text-xs font-semibold uppercase tracking-wide"
            style={{ color: COLORS.purple }}
          >
            {quizConfig.subject} — {quizConfig.topic}
          </p>
          <p
            className="mt-1 text-sm"
            style={{ color: COLORS.sub }}
          >
            Question {currentIndex + 1} of {questions.length}
          </p>
        </div>
        <div
          className="flex items-center gap-2 rounded-lg px-4 py-2"
          style={{ backgroundColor: timeLeft > 60 ? COLORS.greenSoft : COLORS.redSoft }}
        >
          <Clock size={16} color={timeLeft > 60 ? COLORS.green : COLORS.red} />
          <span
            className="text-sm font-bold"
            style={{ color: timeLeft > 60 ? COLORS.green : COLORS.red }}
          >
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      {error && (
        <div
          className="flex items-center gap-2 rounded-xl border p-4 text-sm"
          style={{ borderColor: "#FEE2E2", backgroundColor: COLORS.redSoft, color: COLORS.red }}
        >
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Question */}
        <div className="lg:col-span-2">
          <Card>
            <h2
              className="mb-6 text-lg font-bold"
              style={{ color: COLORS.ink }}
            >
              {currentQuestion.questionText}
            </h2>

            <div className="space-y-3">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = answers[currentQuestion.questionId] === option;
                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(option)}
                    className="flex w-full items-center gap-3 rounded-lg border p-4 text-left transition-all"
                    style={{
                      borderColor: isSelected ? COLORS.purple : COLORS.line,
                      backgroundColor: isSelected ? COLORS.purpleSoft : "white",
                    }}
                  >
                    <Radio
                      size={20}
                      color={isSelected ? COLORS.purple : COLORS.line}
                      fill={isSelected ? COLORS.purple : "none"}
                    />
                    <span
                      style={{
                        color: isSelected ? COLORS.purple : COLORS.ink,
                        fontWeight: isSelected ? "600" : "400",
                      }}
                    >
                      {option}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Mark for Review Button */}
            <button
              onClick={handleMarkForReview}
              className="mt-6 flex items-center gap-2 text-sm font-semibold"
              style={{
                color: markedForReview.has(currentQuestion.questionId) ? COLORS.orange : COLORS.sub,
              }}
            >
              {markedForReview.has(currentQuestion.questionId) ? "★" : "☆"} Mark for review
            </button>
          </Card>

          {/* Navigation */}
          <div className="mt-4 flex gap-3">
            <SecondaryButton
              onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
              disabled={currentIndex === 0}
              className="flex-1"
            >
              <ArrowLeft size={16} />
              Previous
            </SecondaryButton>
            <SecondaryButton
              onClick={() =>
                setCurrentIndex(Math.min(questions.length - 1, currentIndex + 1))
              }
              disabled={currentIndex === questions.length - 1}
              className="flex-1"
            >
              Next
              <ArrowRight size={16} />
            </SecondaryButton>
          </div>

          {/* Submit */}
          <div className="mt-4 flex gap-3">
            <SecondaryButton onClick={() => goTo("home")} className="flex-1">
              <ArrowLeft size={16} />
              Quit Quiz
            </SecondaryButton>
            <PrimaryButton onClick={handleSubmit} disabled={submitting} className="flex-1">
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit Quiz
                  <ArrowRight size={16} />
                </>
              )}
            </PrimaryButton>
          </div>
        </div>

        {/* Question Palette */}
        <div>
          <Card>
            <h3
              className="mb-3 text-sm font-bold"
              style={{ color: COLORS.ink }}
            >
              Questions
            </h3>
            <p
              className="mb-3 text-xs"
              style={{ color: COLORS.sub }}
            >
              {answeredCount} of {questions.length} answered
            </p>
            <div className="grid grid-cols-5 gap-2">
              {questions.map((q, idx) => (
                <button
                  key={q.questionId}
                  onClick={() => setCurrentIndex(idx)}
                  className={`flex h-10 w-10 items-center justify-center rounded-lg text-xs font-bold transition-all ${
                    idx === currentIndex ? "ring-2" : ""
                  }`}
                  style={{
                    backgroundColor:
                      idx === currentIndex
                        ? COLORS.purple
                        : answers[q.questionId] !== undefined
                        ? COLORS.greenSoft
                        : COLORS.line,
                    color:
                      idx === currentIndex || answers[q.questionId] !== undefined
                        ? COLORS.ink
                        : COLORS.sub,
                    ringColor: COLORS.purple,
                  }}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// QUIZ RESULT SCREEN
// ============================================================================

function QuizResult({ goTo, quizConfig, result, onReview }) {
  const accuracy = result.accuracy;
  const performanceColor =
    accuracy >= 70 ? COLORS.green : accuracy >= 50 ? COLORS.orange : COLORS.red;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <p
          className="mb-1 text-xs font-semibold uppercase tracking-wide"
          style={{ color: COLORS.purple }}
        >
          Quiz Complete
        </p>

        <h1
          className="text-2xl font-bold"
          style={{ color: COLORS.ink }}
        >
          Results
        </h1>

        <p
          className="mt-1 text-sm"
          style={{ color: COLORS.sub }}
        >
          {quizConfig.subject} — {quizConfig.topic}
        </p>
      </div>

      {/* Score Card */}
      <Card className="border-2" style={{ borderColor: performanceColor }}>
        <div className="flex flex-col items-center gap-4 text-center">
          <div
            className="flex h-24 w-24 items-center justify-center rounded-full"
            style={{ backgroundColor: performanceColor + "20" }}
          >
            <span
              className="text-4xl font-bold"
              style={{ color: performanceColor }}
            >
              {accuracy}%
            </span>
          </div>

          <div>
            <h2
              className="text-xl font-bold"
              style={{ color: performanceColor }}
            >
              {accuracy >= 70
                ? "Excellent!"
                : accuracy >= 50
                ? "Good Effort!"
                : "Keep Practicing!"}
            </h2>
            <p className="mt-1 text-sm" style={{ color: COLORS.sub }}>
              You scored {result.score} out of {result.totalQuestions} correct
            </p>
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <p
            className="text-xs font-semibold uppercase tracking-wide"
            style={{ color: COLORS.sub }}
          >
            Correct Answers
          </p>
          <p
            className="mt-3 text-3xl font-bold"
            style={{ color: COLORS.green }}
          >
            {result.score}
          </p>
        </Card>

        <Card>
          <p
            className="text-xs font-semibold uppercase tracking-wide"
            style={{ color: COLORS.sub }}
          >
            Incorrect Answers
          </p>
          <p
            className="mt-3 text-3xl font-bold"
            style={{ color: COLORS.red }}
          >
            {result.totalQuestions - result.score}
          </p>
        </Card>

        <Card>
          <p
            className="text-xs font-semibold uppercase tracking-wide"
            style={{ color: COLORS.sub }}
          >
            Difficulty
          </p>
          <div className="mt-3">
            <DifficultyBadge level={quizConfig.difficulty} />
          </div>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <SecondaryButton onClick={() => goTo("home")} className="flex-1">
          <ArrowLeft size={16} />
          Back to Home
        </SecondaryButton>
        <PrimaryButton onClick={onReview} className="flex-1">
          Review Answers
          <ArrowRight size={16} />
        </PrimaryButton>
      </div>
    </div>
  );
}

// ============================================================================
// QUIZ REVIEW SCREEN
// ============================================================================

function QuizReview({ goTo, quizConfig, result }) {
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <p
          className="mb-1 text-xs font-semibold uppercase tracking-wide"
          style={{ color: COLORS.purple }}
        >
          Review Quiz
        </p>

        <h1
          className="text-2xl font-bold"
          style={{ color: COLORS.ink }}
        >
          Your Answers
        </h1>

        <p
          className="mt-1 text-sm"
          style={{ color: COLORS.sub }}
        >
          {quizConfig.subject} — {quizConfig.topic}
        </p>
      </div>

      {/* Questions */}
      <div className="space-y-3">
        {result.review.map((item, idx) => {
          const isExpanded = expandedQuestion === item.questionId;

          return (
            <Card
              key={item.questionId}
              className={`transition-all ${
                item.isCorrect ? "border-green-200" : "border-red-200"
              }`}
            >
              <button
                onClick={() =>
                  setExpandedQuestion(isExpanded ? null : item.questionId)
                }
                className="w-full text-left"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className="text-sm font-bold"
                        style={{ color: COLORS.ink }}
                      >
                        Q{idx + 1}.
                      </span>
                      <span
                        className="text-sm font-semibold"
                        style={{ color: COLORS.ink }}
                      >
                        {item.questionText}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      {item.isCorrect ? (
                        <CheckCircle size={16} color={COLORS.green} />
                      ) : (
                        <AlertCircle size={16} color={COLORS.red} />
                      )}
                      <span
                        className="text-xs font-semibold"
                        style={{ color: item.isCorrect ? COLORS.green : COLORS.red }}
                      >
                        {item.isCorrect ? "Correct" : "Incorrect"}
                      </span>
                    </div>
                  </div>
                  <div>
                    {isExpanded ? (
                      <ChevronUp size={20} color={COLORS.sub} />
                    ) : (
                      <ChevronDown size={20} color={COLORS.sub} />
                    )}
                  </div>
                </div>
              </button>

              {isExpanded && (
                <div className="mt-4 border-t pt-4" style={{ borderColor: COLORS.line }}>
                  <div className="space-y-2">
                    {item.options.map((option, optIdx) => {
                      const isUserSelected = item.selectedAnswer === option;
                      const isCorrectAnswer = option === item.correctAnswer;

                      return (
                        <div
                          key={optIdx}
                          className="flex items-start gap-3 rounded-lg p-3"
                          style={{
                            backgroundColor: isCorrectAnswer
                              ? COLORS.greenSoft
                              : isUserSelected && !isCorrectAnswer
                              ? COLORS.redSoft
                              : "transparent",
                          }}
                        >
                          <span
                            className="mt-0.5 text-sm font-bold"
                            style={{
                              color: isCorrectAnswer
                                ? COLORS.green
                                : isUserSelected && !isCorrectAnswer
                                ? COLORS.red
                                : COLORS.sub,
                            }}
                          >
                            {String.fromCharCode(65 + optIdx)}.
                          </span>
                          <div>
                            <p
                              className="text-sm"
                              style={{
                                color: isCorrectAnswer
                                  ? COLORS.green
                                  : isUserSelected && !isCorrectAnswer
                                  ? COLORS.red
                                  : COLORS.ink,
                                fontWeight: isCorrectAnswer || isUserSelected ? "600" : "400",
                              }}
                            >
                              {option}
                            </p>
                            {isCorrectAnswer && (
                              <p className="mt-1 text-xs" style={{ color: COLORS.green }}>
                                ✓ Correct Answer
                              </p>
                            )}
                            {isUserSelected && !isCorrectAnswer && (
                              <p className="mt-1 text-xs" style={{ color: COLORS.red }}>
                                ✗ Your Answer
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <SecondaryButton onClick={() => goTo("home")} className="flex-1">
          <ArrowLeft size={16} />
          Back to Home
        </SecondaryButton>
      </div>
    </div>
  );
}

// ============================================================================
// QUIZ HISTORY PAGE
// ============================================================================

function QuizHistoryPage({ goTo }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    quizService.history().then((data) => {
      if (!cancelled) {
        setHistory(Array.isArray(data) ? data : []);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const totalAttempts = history.length;
  const avgAccuracy =
    totalAttempts > 0
      ? Math.round(history.reduce((sum, q) => sum + q.accuracy, 0) / totalAttempts)
      : 0;
  const bestAccuracy = totalAttempts > 0 ? Math.max(...history.map((q) => q.accuracy)) : 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <p
          className="mb-1 text-xs font-semibold uppercase tracking-wide"
          style={{ color: COLORS.purple }}
        >
          Quiz & Assessment
        </p>

        <h1
          className="text-2xl font-bold"
          style={{ color: COLORS.ink }}
        >
          Quiz History
        </h1>

        <p
          className="mt-1 text-sm"
          style={{ color: COLORS.sub }}
        >
          Review your previous quiz attempts and performance.
        </p>
      </div>

      {loading ? (
        <Card>
          <p className="py-8 text-center text-sm" style={{ color: COLORS.sub }}>
            Loading...
          </p>
        </Card>
      ) : history.length === 0 ? (
        <Card>
          <p className="py-8 text-center text-sm" style={{ color: COLORS.sub }}>
            No quiz attempts yet.
          </p>
        </Card>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Card>
              <p
                className="text-xs font-semibold uppercase tracking-wide"
                style={{ color: COLORS.sub }}
              >
                Total Attempts
              </p>
              <p
                className="mt-3 text-3xl font-bold"
                style={{ color: COLORS.purple }}
              >
                {totalAttempts}
              </p>
            </Card>

            <Card>
              <p
                className="text-xs font-semibold uppercase tracking-wide"
                style={{ color: COLORS.sub }}
              >
                Average Accuracy
              </p>
              <p
                className="mt-3 text-3xl font-bold"
                style={{ color: "#3B82F6" }}
              >
                {avgAccuracy}%
              </p>
            </Card>

            <Card>
              <p
                className="text-xs font-semibold uppercase tracking-wide"
                style={{ color: COLORS.sub }}
              >
                Best Accuracy
              </p>
              <p
                className="mt-3 text-3xl font-bold"
                style={{ color: COLORS.green }}
              >
                {bestAccuracy}%
              </p>
            </Card>
          </div>

          {/* History Table */}
          <Card>
            <h3
              className="mb-4 text-base font-bold"
              style={{ color: COLORS.ink }}
            >
              Previous Attempts
            </h3>

            <p
              className="mb-4 text-xs"
              style={{ color: COLORS.sub }}
            >
              Track your scores across different subjects and topics.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottomColor: COLORS.line }} className="border-b">
                    <th
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide"
                      style={{ color: COLORS.sub }}
                    >
                      Quiz
                    </th>
                    <th
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide"
                      style={{ color: COLORS.sub }}
                    >
                      Date
                    </th>
                    <th
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide"
                      style={{ color: COLORS.sub }}
                    >
                      Difficulty
                    </th>
                    <th
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide"
                      style={{ color: COLORS.sub }}
                    >
                      Score
                    </th>
                    <th
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide"
                      style={{ color: COLORS.sub }}
                    >
                      Accuracy
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((q) => (
                    <tr
                      key={q.quizAttemptId}
                      style={{ borderBottomColor: COLORS.line }}
                      className="border-b hover:bg-slate-50"
                    >
                      <td className="px-4 py-3">
                        <p
                          className="text-sm font-semibold"
                          style={{ color: COLORS.ink }}
                        >
                          {q.subject}
                        </p>
                        <p className="text-xs" style={{ color: COLORS.sub }}>
                          {q.topic}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm" style={{ color: COLORS.ink }}>
                          {formatDate(q.attemptedAt)}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <DifficultyBadge level={q.difficulty} />
                      </td>
                      <td className="px-4 py-3">
                        <p
                          className="text-sm font-semibold"
                          style={{ color: COLORS.ink }}
                        >
                          {q.score}/{q.totalQuestions}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <p
                          className="text-sm font-bold"
                          style={{
                            color:
                              q.accuracy >= 70
                                ? COLORS.green
                                : q.accuracy >= 50
                                ? COLORS.orange
                                : COLORS.red,
                          }}
                        >
                          {q.accuracy}%
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      {/* Back Button */}
      <SecondaryButton onClick={() => goTo("home")} className="w-full">
        <ArrowLeft size={16} />
        Back to Quiz Home
      </SecondaryButton>
    </div>
  );
}

// ============================================================================
// MAIN QUIZ PAGE COMPONENT
// ============================================================================

export default function QuizPage({ initialScreen = "home" }) {
  const location = useLocation();
  const [screen, setScreen] = useState(initialScreen);
  const [screenParams, setScreenParams] = useState({});
  const [quizConfig, setQuizConfig] = useState(null);
  const [quizResult, setQuizResult] = useState(null);
  const [loadingDirectQuiz, setLoadingDirectQuiz] = useState(false);

  useEffect(() => {
    const directQuizId = location.state?.quizId;
    if (directQuizId) {
      setLoadingDirectQuiz(true);
      quizService
        .getForAttempt(directQuizId)
        .then((q) => {
          if (q) {
            setQuizConfig({
              id: q.id,
              subject: location.state?.topic || q.topic,
              topic: q.topic,
              difficulty: q.difficulty,
              count: q.questions.length,
              questions: q.questions,
            });
            setScreen("instructions");
          }
        })
        .finally(() => setLoadingDirectQuiz(false));
    }
  }, [location.state?.quizId]);

  const goTo = (newScreen, params = {}) => {
    setScreen(newScreen);
    setScreenParams(params);
  };

  const handleGenerateQuiz = (config) => {
    setQuizConfig(config);
    goTo("instructions");
  };

  const handleStartQuiz = () => {
    goTo("attempt");
  };

  const handleSubmitQuiz = (result) => {
    setQuizResult(result);
    goTo("result");
  };

  const handleReviewAnswers = () => {
    goTo("review");
  };

  if (loadingDirectQuiz) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 size={32} className="animate-spin text-purple-600 mb-3" />
        <p className="text-sm font-medium text-slate-600">Loading AI Quiz...</p>
      </div>
    );
  }

  if (screen === "home") {
    return <QuizHome goTo={goTo} />;
  }

  if (screen === "generate") {
    return (
      <GenerateQuiz
        goTo={goTo}
        source={screenParams.source}
        onGenerate={handleGenerateQuiz}
      />
    );
  }

  if (screen === "instructions") {
    return (
      <QuizInstructions
        goTo={goTo}
        quizConfig={quizConfig}
        onStart={handleStartQuiz}
      />
    );
  }

  if (screen === "attempt") {
    return (
      <QuizAttempt
        goTo={goTo}
        quizConfig={quizConfig}
        onSubmit={handleSubmitQuiz}
      />
    );
  }

  if (screen === "result") {
    return (
      <QuizResult
        goTo={goTo}
        quizConfig={quizConfig}
        result={quizResult}
        onReview={handleReviewAnswers}
      />
    );
  }

  if (screen === "review") {
    return (
      <QuizReview
        goTo={goTo}
        quizConfig={quizConfig}
        result={quizResult}
      />
    );
  }

  if (screen === "history") {
    return <QuizHistoryPage goTo={goTo} />;
  }

  return <QuizHome goTo={goTo} />;
}

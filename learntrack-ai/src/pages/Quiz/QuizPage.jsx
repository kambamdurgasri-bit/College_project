import React, { useEffect, useRef, useState } from "react";
import {
  BookOpen,
  ClipboardList,
  Layers,
  Gauge,
  FileUp,
  FileText,
  Timer,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Play,
  Trophy,
  ArrowRight,
  ArrowLeft,
  ListChecks,
  AlertCircle,
} from "lucide-react";
import {
  DEMO_QUESTION_COUNT,
  DEMO_TIME_LIMIT_MINUTES,
  DIFFICULTIES,
  QUESTION_COUNTS,
  QUIZ_HISTORY,
  SAMPLE_QUESTIONS,
  SUBJECTS,
} from "../../quizData";

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
  greenSoft: "#E9FBF1",
  red: "#F2685E",
  redSoft: "#FDEEEE",
};

/* -------------------------------------------------------------------- */
/*  Shared primitives                                                   */
/* -------------------------------------------------------------------- */
function SampleBadge({ text = "Sample data" }) {
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

function PrimaryButton({ children, className = "", ...props }) {
  return (
    <button
      {...props}
      className={`flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40 ${className}`}
      style={{ background: COLORS.purple }}
    >
      {children}
    </button>
  );
}

function SecondaryButton({ children, className = "", ...props }) {
  return (
    <button
      {...props}
      className={`flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-colors ${className}`}
      style={{ background: COLORS.purpleFaint, color: COLORS.purpleDark }}
    >
      {children}
    </button>
  );
}

function DifficultyBadge({ level }) {
  const map = {
    Easy: { bg: COLORS.greenSoft, color: COLORS.green },
    Medium: { bg: COLORS.orangeSoft, color: COLORS.orange },
    Hard: { bg: COLORS.redSoft, color: COLORS.red },
  };
  const s = map[level] || map.Medium;
  return (
    <span className="rounded-full px-2.5 py-1 text-[11px] font-semibold" style={{ background: s.bg, color: s.color }}>
      {level}
    </span>
  );
}

/* -------------------------------------------------------------------- */
/*  Quiz Home                                                            */
/* -------------------------------------------------------------------- */
function QuizHome({ goTo }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card className="flex flex-col gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: COLORS.purpleSoft }}>
            <ListChecks size={20} color={COLORS.purple} />
          </div>
          <div>
            <h3 className="text-[15px] font-semibold" style={{ color: COLORS.ink }}>
              Generate from Topic
            </h3>
            <p className="text-xs" style={{ color: COLORS.sub }}>
              Pick a subject, topic, and difficulty for the sample quiz.
            </p>
          </div>
          <SecondaryButton onClick={() => goTo("generate", { source: "topic" })} className="mt-1 self-start">
            Start <ArrowRight size={14} />
          </SecondaryButton>
        </Card>

        <Card className="flex flex-col gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: COLORS.orangeSoft }}>
            <FileUp size={20} color={COLORS.orange} />
          </div>
          <div>
            <h3 className="text-[15px] font-semibold" style={{ color: COLORS.ink }}>
              Generate from PDF
            </h3>
            <p className="text-xs" style={{ color: COLORS.sub }}>
              Select a PDF for the frontend demo; processing is not connected yet.
            </p>
          </div>
          <SecondaryButton onClick={() => goTo("generate", { source: "pdf" })} className="mt-1 self-start">
            Upload <ArrowRight size={14} />
          </SecondaryButton>
        </Card>
      </div>

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-[15px] font-semibold" style={{ color: COLORS.ink }}>
            Recent Quiz Attempts
          </h3>
          <button onClick={() => goTo("history")} className="flex items-center gap-1 text-xs font-semibold" style={{ color: COLORS.purpleDark }}>
            View all <ArrowRight size={12} />
          </button>
        </div>
        <div className="flex flex-col divide-y" style={{ borderColor: COLORS.line }}>
          {QUIZ_HISTORY.slice(0, 3).map((q) => (
            <div key={q.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium" style={{ color: COLORS.ink }}>
                  {q.subject} — {q.topic}
                </p>
                <p className="text-[11px]" style={{ color: COLORS.sub }}>
                  {q.date} · {q.total} questions
                </p>
              </div>
              <div className="flex items-center gap-3">
                <DifficultyBadge level={q.difficulty} />
                <span className="text-sm font-bold" style={{ color: COLORS.ink }}>
                  {q.accuracy}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* -------------------------------------------------------------------- */
/*  Generate Quiz                                                        */
/* -------------------------------------------------------------------- */
function GenerateQuiz({ initial, goTo }) {
  const [source, setSource] = useState(initial?.source || "topic");
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("Medium");
  const [count, setCount] = useState(DEMO_QUESTION_COUNT);
  const [fileName, setFileName] = useState("");

  const topics = subject ? SUBJECTS[subject] : [];
  const canGenerate = source === "topic" ? subject && topic : !!fileName;

  return (
    <Card className="mx-auto max-w-2xl">
      <div className="mb-1 flex items-center gap-2">
        <span className="text-xs font-medium" style={{ color: COLORS.sub }}>
          Quiz & Assessment
        </span>
        <SampleBadge text="Frontend only · Gemini not connected yet" />
      </div>
      <h2 className="mb-5 text-xl font-bold" style={{ color: COLORS.ink }}>
        Generate a Quiz
      </h2>
      <p className="mb-4 text-xs" style={{ color: COLORS.sub }}>
        AI-powered quiz generation — backend/Gemini integration coming later.
      </p>

      <div className="mb-6 flex gap-1 rounded-xl p-1" style={{ background: COLORS.purpleFaint }}>
        {[
          { id: "topic", label: "From Topic", icon: ListChecks },
          { id: "pdf", label: "From PDF", icon: FileText },
        ].map((t) => {
          const Icon = t.icon;
          const isActive = source === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setSource(t.id)}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold"
              style={{
                background: isActive ? "#fff" : "transparent",
                color: isActive ? COLORS.purpleDark : COLORS.sub,
                boxShadow: isActive ? "0 1px 6px rgba(91,76,224,0.15)" : "none",
              }}
            >
              <Icon size={14} /> {t.label}
            </button>
          );
        })}
      </div>

      {source === "topic" ? (
        <>
          <label className="mb-1.5 block text-xs font-semibold" style={{ color: COLORS.ink }}>
            Subject
          </label>
          <div className="mb-4 flex flex-wrap gap-2">
            {Object.keys(SUBJECTS).map((s) => (
              <button
                key={s}
                onClick={() => {
                  setSubject(s);
                  setTopic("");
                }}
                className="flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-medium"
                style={{
                  borderColor: subject === s ? COLORS.purple : COLORS.line,
                  background: subject === s ? COLORS.purpleSoft : "#fff",
                  color: subject === s ? COLORS.purpleDark : COLORS.sub,
                }}
              >
                <BookOpen size={13} /> {s}
              </button>
            ))}
          </div>

          <label className="mb-1.5 block text-xs font-semibold" style={{ color: COLORS.ink }}>
            Topic
          </label>
          <div className="mb-4 flex flex-wrap gap-2">
            {topics.length === 0 && (
              <span className="text-xs" style={{ color: COLORS.sub }}>
                Select a subject first
              </span>
            )}
            {topics.map((t) => (
              <button
                key={t}
                onClick={() => setTopic(t)}
                className="flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-medium"
                style={{
                  borderColor: topic === t ? COLORS.purple : COLORS.line,
                  background: topic === t ? COLORS.purpleSoft : "#fff",
                  color: topic === t ? COLORS.purpleDark : COLORS.sub,
                }}
              >
                <Layers size={13} /> {t}
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="mb-4">
          <label className="mb-1.5 block text-xs font-semibold" style={{ color: COLORS.ink }}>
            Study Material (PDF)
          </label>
          <label
            className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed py-8 text-center"
            style={{ borderColor: COLORS.line, background: COLORS.purpleFaint }}
          >
            <FileUp size={22} color={COLORS.purple} />
            <span className="text-xs font-medium" style={{ color: COLORS.ink }}>
              {fileName || "Click to upload a PDF, or drag it here"}
            </span>
            <span className="text-[11px]" style={{ color: COLORS.sub }}>
              Frontend-only demo · PDF processing is not connected to the backend yet
            </span>
            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => setFileName(e.target.files?.[0]?.name || "")}
            />
          </label>
        </div>
      )}

      <label className="mb-1.5 block text-xs font-semibold" style={{ color: COLORS.ink }}>
        Difficulty
      </label>
      <div className="mb-4 flex gap-2">
        {DIFFICULTIES.map((d) => (
          <button
            key={d}
            onClick={() => setDifficulty(d)}
            className="flex-1 rounded-xl border py-2 text-xs font-semibold"
            style={{
              borderColor: difficulty === d ? COLORS.purple : COLORS.line,
              background: difficulty === d ? COLORS.purpleSoft : "#fff",
              color: difficulty === d ? COLORS.purpleDark : COLORS.sub,
            }}
          >
            <span className="flex items-center justify-center gap-1.5">
              <Gauge size={13} /> {d}
            </span>
          </button>
        ))}
      </div>

      <label className="mb-1.5 block text-xs font-semibold" style={{ color: COLORS.ink }}>
        Requested Generation Count (future setting)
      </label>
      <div className="mb-6 flex gap-2">
        {QUESTION_COUNTS.map((c) => (
          <button
            key={c}
            onClick={() => setCount(c)}
            className="flex-1 rounded-xl border py-2 text-xs font-semibold"
            style={{
              borderColor: count === c ? COLORS.purple : COLORS.line,
              background: count === c ? COLORS.purpleSoft : "#fff",
              color: count === c ? COLORS.purpleDark : COLORS.sub,
            }}
          >
            {c}
          </button>
        ))}
      </div>
      <p className="mb-6 text-[11px]" style={{ color: COLORS.sub }}>
        This frontend demo always uses {DEMO_QUESTION_COUNT} sample questions, regardless of the requested count.
      </p>

      <div className="flex gap-3">
        <SecondaryButton onClick={() => goTo("home")} className="flex-1">
          <ArrowLeft size={14} /> Back
        </SecondaryButton>
        <PrimaryButton
          disabled={!canGenerate}
          onClick={() =>
            goTo("instructions", {
              subject: source === "topic" ? subject : "Study Material",
              topic: source === "topic" ? topic : fileName,
              difficulty,
              count,
              source,
            })
          }
          className="flex-1"
        >
          Generate Quiz <ArrowRight size={14} />
        </PrimaryButton>
      </div>
    </Card>
  );
}

/* -------------------------------------------------------------------- */
/*  Quiz Instructions                                                    */
/* -------------------------------------------------------------------- */
function QuizInstructions({ config, goTo }) {
  const rules = [
    `This frontend demo has ${DEMO_QUESTION_COUNT} sample questions and a ${DEMO_TIME_LIMIT_MINUTES}-minute timer.`,
    `Requested generation count: ${config.count} (used later when backend generation is connected).`,
    "Each question has exactly one correct answer.",
    "You can move between questions freely before submitting.",
    "The quiz auto-submits when the timer reaches zero.",
    "Once submitted, answers cannot be changed.",
  ];
  return (
    <Card className="mx-auto max-w-2xl">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: COLORS.purpleSoft }}>
          <ClipboardList size={20} color={COLORS.purple} />
        </div>
        <div>
          <h2 className="text-lg font-bold" style={{ color: COLORS.ink }}>
            {config.subject} — {config.topic}
          </h2>
          <div className="mt-1 flex items-center gap-2">
            <DifficultyBadge level={config.difficulty} />
            <span className="text-[11px]" style={{ color: COLORS.sub }}>
              {DEMO_QUESTION_COUNT} sample questions · {DEMO_TIME_LIMIT_MINUTES} min
            </span>
          </div>
        </div>
      </div>

      <div className="mb-5 rounded-xl p-4" style={{ background: COLORS.purpleFaint }}>
        <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold" style={{ color: COLORS.ink }}>
          <AlertCircle size={13} /> Before you start
        </p>
        <ul className="flex flex-col gap-1.5">
          {rules.map((r, i) => (
            <li key={i} className="flex items-start gap-2 text-xs" style={{ color: COLORS.sub }}>
              <CheckCircle2 size={13} className="mt-0.5 shrink-0" color={COLORS.green} />
              {r}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex gap-3">
        <SecondaryButton onClick={() => goTo("generate")} className="flex-1">
          <ArrowLeft size={14} /> Edit setup
        </SecondaryButton>
        <PrimaryButton onClick={() => goTo("attempt")} className="flex-1">
          <Play size={14} /> Start Quiz
        </PrimaryButton>
      </div>
    </Card>
  );
}

/* -------------------------------------------------------------------- */
/*  Quiz Attempt (interactive)                                           */
/* -------------------------------------------------------------------- */
function QuizAttempt({ config, goTo, onSubmit }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [secondsLeft, setSecondsLeft] = useState(DEMO_TIME_LIMIT_MINUTES * 60);
  const answersRef = useRef(answers);
  const onSubmitRef = useRef(onSubmit);
  const goToRef = useRef(goTo);

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  useEffect(() => {
    onSubmitRef.current = onSubmit;
    goToRef.current = goTo;
  }, [onSubmit, goTo]);

  useEffect(() => {
    if (secondsLeft <= 0) {
      onSubmitRef.current(answersRef.current);
      goToRef.current("result");
      return;
    }
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secondsLeft]);

  const q = SAMPLE_QUESTIONS[current];
  const answeredCount = Object.keys(answers).length;
  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  const selectOption = (optIndex) => setAnswers((a) => ({ ...a, [q.id]: optIndex }));

  const handleSubmit = () => {
    onSubmit(answers);
    goTo("result");
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_240px]">
      <Card>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium" style={{ color: COLORS.sub }}>
              Question {current + 1} of {SAMPLE_QUESTIONS.length}
            </span>
            <div className="mt-1">
              <DifficultyBadge level={config.difficulty} />
            </div>
          </div>
          <div
            className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-bold"
            style={{ background: secondsLeft < 60 ? COLORS.redSoft : COLORS.purpleFaint, color: secondsLeft < 60 ? COLORS.red : COLORS.purpleDark }}
          >
            <Timer size={15} /> {mm}:{ss}
          </div>
        </div>

        <p className="mb-5 text-base font-semibold leading-snug" style={{ color: COLORS.ink }}>
          {q.text}
        </p>

        <div className="mb-6 flex flex-col gap-3">
          {q.options.map((opt, i) => {
            const isSelected = answers[q.id] === i;
            return (
              <button
                key={i}
                onClick={() => selectOption(i)}
                aria-pressed={isSelected}
                className="flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm"
                style={{
                  borderColor: isSelected ? COLORS.purple : COLORS.line,
                  background: isSelected ? COLORS.purpleSoft : "#fff",
                  color: COLORS.ink,
                }}
              >
                <span
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold"
                  style={{
                    borderColor: isSelected ? COLORS.purple : COLORS.line,
                    background: isSelected ? COLORS.purple : "transparent",
                    color: isSelected ? "#fff" : COLORS.sub,
                  }}
                >
                  {String.fromCharCode(65 + i)}
                </span>
                {opt}
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between">
          <SecondaryButton onClick={() => setCurrent((c) => Math.max(0, c - 1))} disabled={current === 0}>
            <ChevronLeft size={14} /> Previous
          </SecondaryButton>
          {current === SAMPLE_QUESTIONS.length - 1 ? (
            <PrimaryButton onClick={handleSubmit}>
              Submit Quiz <CheckCircle2 size={14} />
            </PrimaryButton>
          ) : (
            <PrimaryButton onClick={() => setCurrent((c) => Math.min(SAMPLE_QUESTIONS.length - 1, c + 1))}>
              Next <ChevronRight size={14} />
            </PrimaryButton>
          )}
        </div>
      </Card>

      <Card>
        <h3 className="mb-3 text-sm font-semibold" style={{ color: COLORS.ink }}>
          Question Palette
        </h3>
        <div className="mb-4 grid grid-cols-5 gap-2">
          {SAMPLE_QUESTIONS.map((sq, i) => {
            const isAnswered = answers[sq.id] !== undefined;
            const isCurrent = i === current;
            return (
              <button
                key={sq.id}
                onClick={() => setCurrent(i)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-xs font-semibold"
                style={{
                  background: isCurrent ? COLORS.purple : isAnswered ? COLORS.purpleSoft : COLORS.purpleFaint,
                  color: isCurrent ? "#fff" : isAnswered ? COLORS.purpleDark : COLORS.sub,
                  border: isCurrent ? `2px solid ${COLORS.purpleDark}` : "none",
                }}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
        <div className="flex flex-col gap-2 text-xs" style={{ color: COLORS.sub }}>
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ background: COLORS.purpleSoft }} /> Answered ({answeredCount})
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ background: COLORS.purpleFaint }} /> Unanswered ({SAMPLE_QUESTIONS.length - answeredCount})
          </span>
        </div>
      </Card>
    </div>
  );
}

/* -------------------------------------------------------------------- */
/*  Quiz Result                                                          */
/* -------------------------------------------------------------------- */
function QuizResult({ config, answers, goTo }) {
  const correctCount = SAMPLE_QUESTIONS.filter((q) => answers[q.id] === q.correct).length;
  const accuracy = Math.round((correctCount / SAMPLE_QUESTIONS.length) * 100);

  return (
    <Card className="mx-auto max-w-2xl text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl" style={{ background: COLORS.purpleSoft }}>
        <Trophy size={28} color={COLORS.purple} />
      </div>
      <h2 className="mb-1 text-xl font-bold" style={{ color: COLORS.ink }}>
        Quiz Completed
      </h2>
      <p className="mb-6 text-sm" style={{ color: COLORS.sub }}>
        {config.subject} — {config.topic}
      </p>

      <div className="mb-6 grid grid-cols-3 gap-3">
        <div className="rounded-xl p-4" style={{ background: COLORS.purpleFaint }}>
          <div className="text-2xl font-bold" style={{ color: COLORS.ink }}>
            {correctCount}/{SAMPLE_QUESTIONS.length}
          </div>
          <div className="text-[11px]" style={{ color: COLORS.sub }}>
            Score
          </div>
        </div>
        <div className="rounded-xl p-4" style={{ background: COLORS.purpleFaint }}>
          <div className="text-2xl font-bold" style={{ color: COLORS.ink }}>
            {accuracy}%
          </div>
          <div className="text-[11px]" style={{ color: COLORS.sub }}>
            Accuracy
          </div>
        </div>
        <div className="rounded-xl p-4" style={{ background: COLORS.purpleFaint }}>
          <div className="text-2xl font-bold" style={{ color: COLORS.ink }}>
            {config.difficulty}
          </div>
          <div className="text-[11px]" style={{ color: COLORS.sub }}>
            Difficulty
          </div>
        </div>
      </div>

      <div className="mb-6 flex items-center justify-center gap-4 text-xs" style={{ color: COLORS.sub }}>
        <span className="flex items-center gap-1.5">
          <CheckCircle2 size={13} color={COLORS.green} /> {correctCount} correct
        </span>
        <span className="flex items-center gap-1.5">
          <XCircle size={13} color={COLORS.red} /> {SAMPLE_QUESTIONS.length - correctCount} incorrect
        </span>
      </div>

      <div className="flex gap-3">
        <SecondaryButton onClick={() => goTo("review")} className="flex-1">
          Review Answers
        </SecondaryButton>
        <PrimaryButton onClick={() => goTo("home")} className="flex-1">
          <RotateCcw size={14} /> Back to Quiz Home
        </PrimaryButton>
      </div>
    </Card>
  );
}

/* -------------------------------------------------------------------- */
/*  Quiz Review                                                          */
/* -------------------------------------------------------------------- */
function QuizReview({ answers, goTo }) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold" style={{ color: COLORS.ink }}>
          Quiz Review
        </h2>
        <SecondaryButton onClick={() => goTo("result")}>
          <ArrowLeft size={14} /> Back to result
        </SecondaryButton>
      </div>

      {SAMPLE_QUESTIONS.map((q, idx) => {
        const selected = answers[q.id];
        const isCorrect = selected === q.correct;
        return (
          <Card key={q.id}>
            <div className="mb-3 flex items-start justify-between gap-3">
              <p className="text-sm font-semibold leading-snug" style={{ color: COLORS.ink }}>
                {idx + 1}. {q.text}
              </p>
              <span
                className="flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold"
                style={{ background: isCorrect ? COLORS.greenSoft : COLORS.redSoft, color: isCorrect ? COLORS.green : COLORS.red }}
              >
                {isCorrect ? <CheckCircle2 size={11} /> : <XCircle size={11} />}
                {isCorrect ? "Correct" : "Incorrect"}
              </span>
            </div>
            <div className="mb-3 flex flex-col gap-2">
              {q.options.map((opt, i) => {
                const isCorrectOpt = i === q.correct;
                const isSelectedOpt = i === selected;
                let style = { borderColor: COLORS.line, background: "#fff", color: COLORS.ink };
                if (isCorrectOpt) style = { borderColor: COLORS.green, background: COLORS.greenSoft, color: COLORS.ink };
                else if (isSelectedOpt && !isCorrectOpt) style = { borderColor: COLORS.red, background: COLORS.redSoft, color: COLORS.ink };
                return (
                  <div key={i} className="flex items-center gap-2 rounded-xl border px-3 py-2 text-xs" style={style}>
                    <span className="font-bold">{String.fromCharCode(65 + i)}.</span> {opt}
                    {isCorrectOpt && <CheckCircle2 size={13} className="ml-auto" color={COLORS.green} />}
                    {isSelectedOpt && !isCorrectOpt && <XCircle size={13} className="ml-auto" color={COLORS.red} />}
                  </div>
                );
              })}
            </div>
            <p className="rounded-lg p-3 text-xs" style={{ background: COLORS.purpleFaint, color: COLORS.sub }}>
              <b style={{ color: COLORS.ink }}>Explanation: </b>
              {q.explanation}
            </p>
          </Card>
        );
      })}
    </div>
  );
}

/* -------------------------------------------------------------------- */
/*  Quiz History                                                         */
/* -------------------------------------------------------------------- */
function QuizHistoryPage({ goTo }) {
  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold" style={{ color: COLORS.ink }}>
          Quiz History
        </h2>
        <SecondaryButton onClick={() => goTo("home")}>
          <ArrowLeft size={14} /> Back
        </SecondaryButton>
      </div>
      <div className="flex flex-col divide-y" style={{ borderColor: COLORS.line }}>
        {QUIZ_HISTORY.map((q) => (
          <div key={q.id} className="flex flex-wrap items-center justify-between gap-3 py-4 first:pt-0 last:pb-0">
            <div className="min-w-0">
              <p className="text-sm font-semibold" style={{ color: COLORS.ink }}>
                {q.subject} — {q.topic}
              </p>
              <p className="text-[11px]" style={{ color: COLORS.sub }}>
                {q.date}
              </p>
            </div>
            <DifficultyBadge level={q.difficulty} />
            <span className="text-sm font-medium" style={{ color: COLORS.ink }}>
              {q.score}/{q.total}
            </span>
            <span className="text-sm font-bold" style={{ color: q.accuracy < 50 ? COLORS.red : COLORS.green }}>
              {q.accuracy}%
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* -------------------------------------------------------------------- */
/*  Quiz module controller                                               */
/* -------------------------------------------------------------------- */
function QuizModule({ initialScreen = "home" }) {
  const [screen, setScreen] = useState(initialScreen);
  const [config, setConfig] = useState({ subject: "DBMS", topic: "Normalization", difficulty: "Medium", count: DEMO_QUESTION_COUNT, source: "topic" });
  const [answers, setAnswers] = useState({});

  const goTo = (next, payload) => {
    if (payload) setConfig((c) => ({ ...c, ...payload }));
    setScreen(next);
  };

  if (screen === "generate") return <GenerateQuiz initial={config} goTo={goTo} />;
  if (screen === "instructions") return <QuizInstructions config={config} goTo={goTo} />;
  if (screen === "attempt") return <QuizAttempt config={config} goTo={goTo} onSubmit={setAnswers} />;
  if (screen === "result") return <QuizResult config={config} answers={answers} goTo={goTo} />;
  if (screen === "review") return <QuizReview answers={answers} goTo={goTo} />;
  if (screen === "history") return <QuizHistoryPage goTo={goTo} />;
  return <QuizHome goTo={goTo} />;
}

export default function QuizPage({ initialScreen }) {
  return <QuizModule initialScreen={initialScreen} />;
}


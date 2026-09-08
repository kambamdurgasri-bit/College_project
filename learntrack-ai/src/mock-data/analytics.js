import { BookMarked } from "lucide-react";

export const trendData = {
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

export const subjectPerformance = [
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

export const recentActivity = [
  {
    time: "08:00",
    day: "Today",
    title: "Attempted DBMS — Normalization quiz",
    meta: "Score 18/20 · Accuracy 90%",
  },
  {
    time: "12:00",
    day: "Today",
    title: "Completed Python — Loops revision",
    meta: "Score 14/20 · Accuracy 70%",
  },
  {
    time: "12:30",
    day: "Yesterday",
    title: "Generated quiz from OS notes.pdf",
    meta: "12 questions · Medium",
  },
  {
    time: "16:30",
    day: "Yesterday",
    title: "Weak topic flagged: Data Structures",
    meta: "Accuracy dropped to 34%",
  },
];

export const weakTopics = [
  {
    topic: "Recursion & Backtracking",
    subject: "Data Structures",
    accuracy: 34,
    icon: BookMarked,
  },
  {
    topic: "Deadlock Handling",
    subject: "Operating Systems",
    accuracy: 41,
    icon: BookMarked,
  },
  {
    topic: "Normal Forms",
    subject: "DBMS",
    accuracy: 48,
    icon: BookMarked,
  },
  {
    topic: "Bayesian Inference",
    subject: "Machine Learning",
    accuracy: 52,
    icon: BookMarked,
  },
];

export const recommendations = [
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

export const learningTips = [
  "Revisit a weak topic within 48 hours of a quiz for better retention.",
  "Short, frequent quizzes beat long infrequent study sessions.",
  "Review incorrect answers before starting a new practice quiz.",
];

export const suggestedResources = [
  "Recursion visualized — practice set",
  "OS Deadlocks — quick notes",
  "DBMS Normalization cheat sheet",
];

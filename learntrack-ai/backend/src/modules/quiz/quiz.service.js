import prisma from "../../lib/prisma.js";
import * as learningSpaces from "../learning-spaces/learningSpaces.service.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// --- Quiz creation -----------------------------------------------------

export async function createQuiz(userId, { learningSpaceId, topic, difficulty, questions }) {
  const space = await learningSpaces.getOwned(userId, learningSpaceId);
  if (!space) return null;

  return prisma.quizzes.create({
    data: {
      learningSpaceId,
      topic,
      difficulty,
      quizType: "TOPIC",
      questions: {
        create: questions.map((q) => ({
          questionText: q.questionText,
          correctAnswer: q.correctAnswer,
        })),
      },
    },
    include: { questions: true },
  });
}

// --- AI (Gemini) quiz generation — Phase 8 --------------------------------

async function generateQuestionsWithGemini({ topic, difficulty, notes, questionCount = 5 }) {
  const source = notes
    ? `Base the questions strictly on this content:\n"""${notes}"""`
    : `Base the questions on the topic: "${topic}"`;

  const prompt = `You are a quiz generator for a study app.
${source}
Difficulty level: ${difficulty}.

Generate exactly ${questionCount} short-answer questions (one correct answer each, a few words long).
Respond with ONLY valid JSON (no markdown, no backticks, no extra text), in this exact shape:

[
  { "questionText": "string", "correctAnswer": "string" }
]`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  const cleaned = text.replace(/```json|```/g, "").trim();

  let questions;
  try {
    questions = JSON.parse(cleaned);
  } catch (err) {
    throw new Error("Gemini returned invalid JSON: " + text.slice(0, 200));
  }
  if (!Array.isArray(questions) || questions.length === 0) {
    throw new Error("Gemini returned no questions.");
  }
  return questions;
}

export async function createAIQuiz(userId, { learningSpaceId, topic, difficulty, notes, questionCount }) {
  const questions = await generateQuestionsWithGemini({ topic, difficulty, notes, questionCount });
  return createQuiz(userId, { learningSpaceId, topic, difficulty, questions });
}

export async function listForLearningSpace(userId, learningSpaceId) {
  const space = await learningSpaces.getOwned(userId, learningSpaceId);
  if (!space) return null;
  return prisma.quizzes.findMany({
    where: { learningSpaceId },
    include: { _count: { select: { questions: true, quizAttempts: true } } },
    orderBy: { id: "desc" },
  });
}

// Fetch a quiz for *attempting* — correct answers are stripped so they
// never reach the client before submission.
export async function getQuizForAttempt(userId, quizId) {
  const quiz = await prisma.quizzes.findUnique({
    where: { id: quizId },
    include: { questions: true, learningSpace: true },
  });
  if (!quiz || quiz.learningSpace.userId !== userId) return null;
  return {
    id: quiz.id,
    topic: quiz.topic,
    difficulty: quiz.difficulty,
    quizType: quiz.quizType,
    questions: quiz.questions.map((q) => ({
      questionId: q.questionId,
      questionText: q.questionText,
    })),
  };
}

// --- Attempts & scoring --------------------------------------------------

export async function submitAttempt(userId, quizId, answers) {
  const quiz = await prisma.quizzes.findUnique({
    where: { id: quizId },
    include: { questions: true, learningSpace: true },
  });
  if (!quiz || quiz.learningSpace.userId !== userId) return null;

  const answerMap = new Map(answers.map((a) => [a.questionId, a.selectedAnswer]));
  let correctCount = 0;

  const gradedAnswers = quiz.questions.map((q) => {
    const selected = answerMap.get(q.questionId) ?? "";
    const isCorrect =
      selected.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();
    if (isCorrect) correctCount += 1;
    return { questionId: q.questionId, selectedAnswer: selected, isCorrect };
  });

  const totalQuestions = quiz.questions.length;
  const score = correctCount;
  const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  const attempt = await prisma.quizAttempts.create({
    data: {
      quizId,
      userId,
      score,
      attemptAnswers: {
        create: gradedAnswers.map((a) => ({
          questionId: a.questionId,
          selectedAnswer: a.selectedAnswer,
        })),
      },
    },
  });

  return {
    quizAttemptId: attempt.quizAttemptId,
    score,
    totalQuestions,
    accuracy,
    attemptedAt: attempt.attemptedAt,
    review: gradedAnswers.map((a) => ({
      questionId: a.questionId,
      questionText: quiz.questions.find((q) => q.questionId === a.questionId).questionText,
      correctAnswer: quiz.questions.find((q) => q.questionId === a.questionId).correctAnswer,
      selectedAnswer: a.selectedAnswer,
      isCorrect: a.isCorrect,
    })),
  };
}

export async function getAttemptReview(userId, quizAttemptId) {
  const attempt = await prisma.quizAttempts.findUnique({
    where: { quizAttemptId },
    include: {
      quiz: true,
      attemptAnswers: { include: { question: true } },
    },
  });
  if (!attempt || attempt.userId !== userId) return null;

  const totalQuestions = attempt.attemptAnswers.length;
  return {
    quizAttemptId: attempt.quizAttemptId,
    topic: attempt.quiz.topic,
    difficulty: attempt.quiz.difficulty,
    score: attempt.score,
    totalQuestions,
    accuracy: totalQuestions > 0 ? Math.round((attempt.score / totalQuestions) * 100) : 0,
    attemptedAt: attempt.attemptedAt,
    review: attempt.attemptAnswers.map((a) => ({
      questionId: a.questionId,
      questionText: a.question.questionText,
      correctAnswer: a.question.correctAnswer,
      selectedAnswer: a.selectedAnswer,
      isCorrect:
        a.selectedAnswer.trim().toLowerCase() === a.question.correctAnswer.trim().toLowerCase(),
    })),
  };
}

// --- History -------------------------------------------------------------

export async function historyForUser(userId, { limit = 20 } = {}) {
  const attempts = await prisma.quizAttempts.findMany({
    where: { userId },
    include: { quiz: true, attemptAnswers: true },
    orderBy: { attemptedAt: "desc" },
    take: limit,
  });

  return attempts.map((a) => {
    const totalQuestions = a.attemptAnswers.length;
    return {
      quizAttemptId: a.quizAttemptId,
      topic: a.quiz.topic,
      difficulty: a.quiz.difficulty,
      score: a.score,
      totalQuestions,
      accuracy: totalQuestions > 0 ? Math.round((a.score / totalQuestions) * 100) : 0,
      attemptedAt: a.attemptedAt,
    };
  });
}
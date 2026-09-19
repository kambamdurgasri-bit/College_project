import prisma from "../../lib/prisma.js";
import * as learningSpaces from "../learning-spaces/learningSpaces.service.js";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

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
          options: q.options ?? [],
        })),
      },
    },
    include: { questions: true },
  });
}

// --- AI (Gemini) quiz generation — Phase 8 --------------------------------

async function callGeminiWithRetry(prompt) {
  const models = ["gemini-3.8-flash", "gemini-2.5-flash"];
  const maxAttemptsPerModel = 3;

  for (const model of models) {
    for (let attempt = 1; attempt <= maxAttemptsPerModel; attempt++) {
      try {
        const result = await ai.models.generateContent({ model, contents: prompt });
        return result.text;
      } catch (err) {
        const isRetryable = err?.status === 503 || err?.status === 429;
        const isLastAttempt = attempt === maxAttemptsPerModel;

        if (!isRetryable || isLastAttempt) {
          if (isRetryable) break;
          throw err;
        }

        const delayMs = attempt * 1000 + Math.random() * 500;
        console.log(`Gemini ${model} overloaded, retrying in ${Math.round(delayMs)}ms (attempt ${attempt}/${maxAttemptsPerModel})`);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }

  throw new Error("Gemini is currently overloaded on all models. Please try again in a minute.");
}

async function generateQuestionsWithGemini({ topic, difficulty, notes, questionCount = 5 }) {
  const source = notes
    ? `Base the questions strictly on this content:\n"""${notes}"""`
    : `Base the questions on the topic: "${topic}"`;

  const prompt = `You are a quiz generator for a study app.
${source}
Difficulty level: ${difficulty}.

Generate exactly ${questionCount} multiple-choice questions. Each question must have
exactly 4 options, with exactly one correct answer that matches one of the options
EXACTLY (same text, same casing).

Respond with ONLY valid JSON (no markdown, no backticks, no extra text), in this exact shape:

[
  {
    "questionText": "string",
    "options": ["string", "string", "string", "string"],
    "correctAnswer": "string (must exactly match one of the options)"
  }
]`;

  const text = await callGeminiWithRetry(prompt);
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

  for (const q of questions) {
    if (!Array.isArray(q.options) || q.options.length !== 4) {
      throw new Error("Gemini returned a question without exactly 4 options.");
    }
    if (!q.options.includes(q.correctAnswer)) {
      throw new Error("Gemini's correctAnswer didn't match any of its own options.");
    }
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
      options: q.options,
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
    review: gradedAnswers.map((a) => {
      const question = quiz.questions.find((q) => q.questionId === a.questionId);
      return {
        questionId: a.questionId,
        questionText: question.questionText,
        options: question.options,
        correctAnswer: question.correctAnswer,
        selectedAnswer: a.selectedAnswer,
        isCorrect: a.isCorrect,
      };
    }),
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
      options: a.question.options,
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
    include: {
      quiz: { include: { learningSpace: true } },
      attemptAnswers: true,
    },
    orderBy: { attemptedAt: "desc" },
    take: limit,
  });

  return attempts.map((a) => {
    const totalQuestions = a.attemptAnswers.length;
    return {
      quizAttemptId: a.quizAttemptId,
      subject: a.quiz.learningSpace.name,
      topic: a.quiz.topic,
      difficulty: a.quiz.difficulty,
      score: a.score,
      totalQuestions,
      accuracy: totalQuestions > 0 ? Math.round((a.score / totalQuestions) * 100) : 0,
      attemptedAt: a.attemptedAt,
    };
  });
}
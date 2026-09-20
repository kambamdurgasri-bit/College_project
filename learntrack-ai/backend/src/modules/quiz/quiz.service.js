import prisma from "../../lib/prisma.js";
import * as learningSpaces from "../learning-spaces/learningSpaces.service.js";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY });

// --- Quiz creation

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

async function callGeminiWithRetry(prompt) {
  const models = ["gemini-3.6-flash", "gemini-1.5-flash"];
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
      }
    }
  }

  throw new Error("All Gemini models exhausted");
}

export async function createAIQuiz(userId, { learningSpaceId, topic, difficulty, notes, questionCount = 5 }) {
  const space = await learningSpaces.getOwned(userId, learningSpaceId);
  if (!space) return null;

  const prompt = `Generate ${questionCount} multiple choice quiz questions for the topic: "${topic}" at ${difficulty} difficulty level. ${notes ? `Additional context: ${notes}` : ""}
  Return ONLY valid JSON (no markdown, no code blocks):
  {
    "questions": [
      {
        "questionText": "...",
        "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
        "correctAnswer": "A) ..."
      }
    ]
  }`;

  const responseText = await callGeminiWithRetry(prompt);
  const cleaned = responseText.replace(/```json|```/g, "").trim();
  const { questions } = JSON.parse(cleaned);

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

export async function createAIQuizFromPdf(userId, { learningSpaceId, topic, difficulty, file }) {
  const space = await learningSpaces.getOwned(userId, learningSpaceId);
  if (!space) return null;

  const prompt = `Generate 5 multiple choice questions based on the provided content. Topic: "${topic}", Difficulty: ${difficulty}.
  Return ONLY valid JSON:
  {
    "questions": [
      {
        "questionText": "...",
        "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
        "correctAnswer": "A) ..."
      }
    ]
  }`;

  const responseText = await callGeminiWithRetry(prompt);
  const cleaned = responseText.replace(/```json|```/g, "").trim();
  const { questions } = JSON.parse(cleaned);

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

export async function listForLearningSpace(userId, learningSpaceId) {
  return prisma.quizzes.findMany({
    where: {
      learningSpaceId: Number(learningSpaceId),
      learningSpace: { userId },
    },
    include: { questions: true, quizAttempts: true },
  });
}

export async function getForAttempt(userId, quizId) {
  return prisma.quizzes.findFirst({
    where: {
      id: Number(quizId),
      learningSpace: { userId },
    },
    include: { questions: true },
  });
}

export async function submitAttempt(userId, quizId, answers) {
  const quiz = await getForAttempt(userId, quizId);
  if (!quiz) return null;

  let score = 0;
  for (const answer of answers) {
    const question = quiz.questions.find((q) => q.questionId === answer.questionId);
    if (question && question.correctAnswer === answer.selectedAnswer) score++;
  }

  const attempt = await prisma.quizAttempts.create({
    data: {
      quizId: Number(quizId),
      userId,
      score,
      attemptAnswers: {
        create: answers.map((a) => ({
          questionId: a.questionId,
          selectedAnswer: a.selectedAnswer,
        })),
      },
    },
    include: { attemptAnswers: true },
  });

  return attempt;
}

export async function getAttemptReview(userId, attemptId) {
  return prisma.quizAttempts.findFirst({
    where: { id: Number(attemptId), userId },
    include: {
      quiz: { include: { questions: true } },
      attemptAnswers: true,
    },
  });
}

export async function getHistory(userId, limit = 10) {
  return prisma.quizAttempts.findMany({
    where: { userId },
    orderBy: { attemptedAt: 'desc' },
    take: limit,
    include: { quiz: true },
  });
}

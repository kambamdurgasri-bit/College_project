import prisma from "../../lib/prisma.js";
import * as learningSpaces from "../learning-spaces/learningSpaces.service.js";
import * as topicsService from "../topics/topics.service.js";
import * as resourcesService from "../resources/resources.service.js";
import { generateText, parseJsonLoosely, AIUnavailableError } from "../../lib/ai.js";

// --- Quiz creation -------------------------------------------------------

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

// --- AI quiz generation (OpenRouter primary, topic/resource aware) --------

async function generateAIQuestions({ topicName, topicDescription, difficulty, questionCount, resourceTexts = [] }) {
  const resourceContext = resourceTexts.length > 0
    ? "\n\nREFERENCE MATERIAL FROM ATTACHED RESOURCES:\n" + resourceTexts.map((t, i) => "[Resource " + (i + 1) + "]\n" + t).join("\n\n---\n\n")
    : "";

  const prompt = "You are an expert quiz creator for an educational platform called LearnTrack AI.\n\n"
    + "Create exactly " + questionCount + " multiple-choice questions about \"" + topicName + "\""
    + (topicDescription ? " (" + topicDescription + ")" : "") + " at " + difficulty + " difficulty level."
    + resourceContext + "\n\n"
    + "Requirements:\n"
    + "- Each question must have exactly 4 options\n"
    + "- Mark the correct answer clearly in correctAnswer field\n"
    + "- Questions should test understanding, not just memorization\n"
    + "- Difficulty level: " + difficulty + " (EASY/MEDIUM/HARD)\n"
    + "- Base questions on the topic AND any reference material provided\n"
    + "- Output ONLY valid JSON, no markdown fences, no prose, no explanations\n\n"
    + "JSON format (exact):\n"
    + "{" + '"' + "questions" + '"' + ": [{" + '"' + "questionText" + '"' + ": " + '"' + "Question here?" + '"' + ", " + '"' + "options" + '"' + ": [" + '"' + "Option A" + '"' + ", " + '"' + "Option B" + '"' + ", " + '"' + "Option C" + '"' + ", " + '"' + "Option D" + '"' + "], " + '"' + "correctAnswer" + '"' + ": " + '"' + "Correct option text" + '"' + "}]}";

  const result = await generateText(prompt, { temperature: 0.5 });
  return parseQuizJson(result.text, topicName, difficulty);
}

function parseQuizJson(text, topicName, difficulty) {
  let questions;
  try {
    const parsed = parseJsonLoosely(text);
    if (parsed && Array.isArray(parsed)) {
      questions = parsed;
    } else if (parsed && parsed.questions && Array.isArray(parsed.questions)) {
      questions = parsed.questions;
    } else {
      questions = null;
    }
  } catch {
    questions = null;
  }

  if (!questions || questions.length === 0) {
    throw new AIUnavailableError(
      "AI returned no usable questions for \"" + topicName + "\". Try again or use a different topic."
    );
  }

  return questions.map((q) => ({
    questionText: String(q.questionText || q.questionText || "").trim(),
    options: Array.isArray(q.options) ? q.options.slice(0, 4) : [],
    correctAnswer: String(q.correctAnswer || q.correctAnswer || "").trim(),
  })).filter((q) => q.questionText && q.correctAnswer && q.options.length >= 2);
}

export async function createAIQuizRecord(userId, { learningSpaceId, topic, difficulty, notes, questionCount, topicId, resourceIds }) {
  const space = await learningSpaces.getOwned(userId, learningSpaceId);
  if (!space) return null;

  let topicName = topic;
  let topicDescription = notes || "";
  let resourceTexts = [];

  if (topicId) {
    const topicRecord = await topicsService.getOne(userId, topicId);
    if (topicRecord) {
      topicName = topicRecord.name;
      topicDescription = topicRecord.description || topicDescription;
    }
  }

  if (resourceIds && Array.isArray(resourceIds) && resourceIds.length > 0) {
    const resources = await resourcesService.getMany(userId, resourceIds);
    resourceTexts = resources
      .filter((r) => r.extractedText)
      .map((r) => r.extractedText);
  }

  const questions = await generateAIQuestions({
    topicName,
    topicDescription,
    difficulty,
    questionCount: questionCount || 5,
    resourceTexts,
  });

  return prisma.quizzes.create({
    data: {
      learningSpaceId,
      topic: topicName,
      difficulty,
      quizType: topicId ? "TOPIC" : "RESOURCE",
      topicId: topicId || null,
      resourceId: (resourceIds && resourceIds.length === 1) ? resourceIds[0] : null,
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

// --- Reads ---------------------------------------------------------------

export async function listForLearningSpace(userId, learningSpaceId) {
  const space = await learningSpaces.getOwned(userId, learningSpaceId);
  if (!space) return null;

  const quizzes = await prisma.quizzes.findMany({
    where: { learningSpaceId },
    include: { questions: true, topicRef: true, resource: true },
    orderBy: { id: "desc" },
  });

  return quizzes.map((q) => ({
    id: q.id,
    topic: q.topic,
    difficulty: q.difficulty,
    quizType: q.quizType,
    topicId: q.topicId,
    resourceId: q.resourceId,
    questionsCount: q.questions.length,
    attemptsCount: 0,
    latestScore: null,
    bestScore: null,
    lastAttemptAt: null,
  }));
}

// --- Attempts & scoring --------------------------------------------------

export async function getQuizForAttempt(userId, quizId) {
  const quiz = await prisma.quizzes.findUnique({
    where: { id: quizId },
    include: { questions: true, learningSpace: true, topicRef: true, resource: true },
  });
  if (!quiz || quiz.learningSpace.userId !== userId) return null;
  return {
    id: quiz.id,
    topic: quiz.topic,
    difficulty: quiz.difficulty,
    quizType: quiz.quizType,
    learningSpaceId: quiz.learningSpaceId,
    learningSpaceName: quiz.learningSpace.name,
    topicId: quiz.topicId,
    resourceId: quiz.resourceId,
    questions: quiz.questions.map((q) => ({
      questionId: q.questionId,
      questionText: q.questionText,
      options: q.options,
    })),
  };
}

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
    accuracy: totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0,
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

export async function historyForUser(userId, { limit = 20, learningSpaceId } = {}) {
  const attempts = await prisma.quizAttempts.findMany({
    where: {
      userId,
      ...(learningSpaceId ? { quiz: { learningSpaceId: Number(learningSpaceId) } } : {}),
    },
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

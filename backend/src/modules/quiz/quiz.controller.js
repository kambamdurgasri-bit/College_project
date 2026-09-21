import * as service from "./quiz.service.js";
import { AIUnavailableError } from "../../lib/ai.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
let pdfParse = null;
async function loadPdfParse() {
  if (!pdfParse) pdfParse = require("pdf-parse");
  return pdfParse;
}

export async function create(req, res, next) {
  try {
    const { learningSpaceId, topic, difficulty, questions } = req.body;
    if (!learningSpaceId || !topic || !difficulty) {
      return res.status(400).json({ error: "learningSpaceId, topic and difficulty are required." });
    }
    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ error: "questions must be a non-empty array." });
    }
    for (const q of questions) {
      if (!q.questionText || !q.correctAnswer) {
        return res.status(400).json({ error: "Each question needs questionText and correctAnswer." });
      }
    }

    const quiz = await service.createQuiz(req.user.id, {
      learningSpaceId: Number(learningSpaceId),
      topic,
      difficulty,
      questions,
    });
    if (!quiz) return res.status(404).json({ error: "Learning space not found." });
    res.status(201).json(quiz);
  } catch (err) {
    next(err);
  }
}

export async function createAI(req, res, next) {
  try {
    const { learningSpaceId, topic, difficulty, notes, questionCount, topicId, resourceIds } = req.body;
    if (!learningSpaceId || !difficulty) {
      return res.status(400).json({ error: "learningSpaceId and difficulty are required." });
    }

    const quiz = await service.createAIQuizRecord(req.user.id, {
      learningSpaceId: Number(learningSpaceId),
      topic: topic || "",
      difficulty,
      notes,
      questionCount,
      topicId: topicId ? Number(topicId) : undefined,
      resourceIds: resourceIds || undefined,
    });
    if (!quiz) return res.status(404).json({ error: "Learning space not found." });
    res.status(201).json(quiz);
  } catch (err) {
    if (err instanceof AIUnavailableError) {
      return res.status(503).json({ error: err.message });
    }
    next(err);
  }
}

export async function createAIFromPdf(req, res, next) {
  try {
    const { learningSpaceId, topic, difficulty, questionCount, topicId } = req.body;
    if (!learningSpaceId || !difficulty) {
      return res.status(400).json({ error: "learningSpaceId and difficulty are required." });
    }
    if (!req.file) {
      return res.status(400).json({ error: "A PDF file is required." });
    }

    const pdfModule = await loadPdfParse();
    const parsed = await pdfModule(req.file.buffer);
    const extractedText = parsed.text?.trim();

    if (!extractedText) {
      return res.status(400).json({ error: "Couldn't extract any text from that PDF." });
    }

    const quiz = await service.createAIQuizRecord(req.user.id, {
      learningSpaceId: Number(learningSpaceId),
      topic: topic || req.file.originalname.replace(/\.pdf$/i, ""),
      difficulty,
      notes: extractedText,
      questionCount,
      topicId: topicId ? Number(topicId) : undefined,
    });
    if (!quiz) return res.status(404).json({ error: "Learning space not found." });
    res.status(201).json(quiz);
  } catch (err) {
    if (err instanceof AIUnavailableError) {
      return res.status(503).json({ error: err.message });
    }
    next(err);
  }
}

export async function listForLearningSpace(req, res, next) {
  try {
    const learningSpaceId = Number(req.query.learningSpaceId);
    if (!learningSpaceId) {
      return res.status(400).json({ error: "learningSpaceId query param is required." });
    }
    const quizzes = await service.listForLearningSpace(req.user.id, learningSpaceId);
    if (quizzes === null) return res.status(404).json({ error: "Learning space not found." });
    res.json(quizzes);
  } catch (err) {
    next(err);
  }
}

export async function getForAttempt(req, res, next) {
  try {
    const quiz = await service.getQuizForAttempt(req.user.id, Number(req.params.id));
    if (!quiz) return res.status(404).json({ error: "Quiz not found." });
    res.json(quiz);
  } catch (err) {
    next(err);
  }
}

export async function submitAttempt(req, res, next) {
  try {
    const { answers } = req.body;
    if (!Array.isArray(answers)) {
      return res.status(400).json({ error: "answers must be an array of { questionId, selectedAnswer }." });
    }
    const result = await service.submitAttempt(req.user.id, Number(req.params.id), answers);
    if (!result) return res.status(404).json({ error: "Quiz not found." });
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function history(req, res, next) {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const learningSpaceId = req.query.learningSpaceId ? Number(req.query.learningSpaceId) : undefined;
    res.json(await service.historyForUser(req.user.id, { limit, learningSpaceId }));
  } catch (err) {
    next(err);
  }
}

export async function attemptReview(req, res, next) {
  try {
    const review = await service.getAttemptReview(req.user.id, Number(req.params.attemptId));
    if (!review) return res.status(404).json({ error: "Attempt not found." });
    res.json(review);
  } catch (err) {
    next(err);
  }
}

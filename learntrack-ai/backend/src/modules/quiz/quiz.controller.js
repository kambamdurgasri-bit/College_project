import * as service from "./quiz.service.js";

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
    res.json(await service.historyForUser(req.user.id, { limit }));
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

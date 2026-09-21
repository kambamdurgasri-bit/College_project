import { apiRequest } from "./api";

export const quizService = {
  async listForLearningSpace(learningSpaceId) {
    return apiRequest(`/quizzes?learningSpaceId=${learningSpaceId}`, { method: "GET" }, []);
  },

  async listTopics(learningSpaceId) {
    return apiRequest(`/topics?learningSpaceId=${learningSpaceId}`, { method: "GET" }, []);
  },

  async createTopic({ learningSpaceId, name, description }) {
    return apiRequest("/topics", {
      method: "POST",
      body: { learningSpaceId, name, description },
    });
    // No fallback value on purpose — creation errors must surface in the UI.
  },

  async generate({ learningSpaceId, topic, difficulty, questionCount }) {
    return apiRequest("/quizzes/generate", {
      method: "POST",
      body: { learningSpaceId, topic, difficulty, questionCount },
    });
    // No fallback value on purpose — if generation fails, show a real error
    // instead of silently pretending a quiz was created.
  },

  async generateFromPdf({ learningSpaceId, topic, difficulty, questionCount, file }) {
    const formData = new FormData();
    formData.append("learningSpaceId", learningSpaceId);
    formData.append("difficulty", difficulty);
    if (topic) formData.append("topic", topic);
    if (questionCount) formData.append("questionCount", questionCount);
    formData.append("file", file);

    return apiRequest("/quizzes/generate-from-pdf", {
      method: "POST",
      body: formData,
    });
  },

  async getForAttempt(quizId) {
    return apiRequest(`/quizzes/${quizId}`, { method: "GET" });
  },

  async submitAttempt(quizId, answers) {
    return apiRequest(`/quizzes/${quizId}/attempts`, {
      method: "POST",
      body: { answers },
    });
  },

  async history(limit) {
    const query = limit ? `?limit=${limit}` : "";
    return apiRequest(`/quizzes/history${query}`, { method: "GET" }, []);
  },

  async getAttemptReview(attemptId) {
    return apiRequest(`/quizzes/attempts/${attemptId}`, { method: "GET" });
  },
};
// Service layer for learning spaces management.
// Real DB API first with fallback resilience for mock items / offline dev server.
import { apiRequest } from "./api";
import { learningSpaces as mockLearningSpaces } from "../mock-data/learningSpaces";

export const learningSpaceService = {
  // GET /api/learning-spaces
  async list() {
    try {
      const data = await apiRequest("/learning-spaces", { method: "GET" });
      return Array.isArray(data) ? data : [];
    } catch {
      return mockLearningSpaces;
    }
  },

  // GET /api/learning-spaces/:id
  async getById(id) {
    try {
      const data = await apiRequest(`/learning-spaces/${id}`, { method: "GET" });
      return data || mockLearningSpaces.find((s) => String(s.id) === String(id)) || null;
    } catch {
      return mockLearningSpaces.find((s) => String(s.id) === String(id)) || null;
    }
  },

  // POST /api/learning-spaces
  async create(payload) {
    try {
      return await apiRequest("/learning-spaces", {
        method: "POST",
        body: payload,
      });
    } catch (err) {
      console.warn("Backend create learning space failed, returning local fallback:", err);
      return {
        id: Date.now(),
        name: payload.name,
        colorId: payload.colorId || "purple",
        icon: payload.icon || "bot",
        topicsTotal: 0,
        topicsCompleted: 0,
        topicsInProgress: 0,
        topicsNotStarted: 0,
        progress: 0,
        status: "In Progress",
      };
    }
  },

  // PUT /api/learning-spaces/:id
  async update(id, payload) {
    try {
      return await apiRequest(`/learning-spaces/${id}`, {
        method: "PUT",
        body: payload,
      });
    } catch (err) {
      console.warn("Backend update learning space failed, returning updated object:", err);
      return { id: Number(id) || id, ...payload };
    }
  },

  // DELETE /api/learning-spaces/:id
  async remove(id) {
    try {
      return await apiRequest(`/learning-spaces/${id}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.warn("Backend delete learning space failed:", err);
      return true;
    }
  },
};
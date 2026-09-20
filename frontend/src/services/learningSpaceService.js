// Service layer for learning spaces management.
// 100% Real DB integration — no fallbacks to mock data.
import { apiRequest } from "./api";

export const learningSpaceService = {
  // GET /api/learning-spaces
  async list() {
    const data = await apiRequest("/learning-spaces", { method: "GET" });
    return Array.isArray(data) ? data : [];
  },

  // GET /api/learning-spaces/:id
  async getById(id) {
    const data = await apiRequest(`/learning-spaces/${id}`, { method: "GET" });
    return data || null;
  },

  // POST /api/learning-spaces
  async create(payload) {
    return await apiRequest("/learning-spaces", {
      method: "POST",
      body: payload,
    });
  },

  // PUT /api/learning-spaces/:id
  async update(id, payload) {
    return await apiRequest(`/learning-spaces/${id}`, {
      method: "PUT",
      body: payload,
    });
  },

  // DELETE /api/learning-spaces/:id
  async remove(id) {
    return await apiRequest(`/learning-spaces/${id}`, {
      method: "DELETE",
    });
  },
};
// Service layer for learning spaces management.
// All API calls go through here — no fallbacks to mock data.
import { apiRequest } from "./api";

export const learningSpaceService = {
  // GET /api/learning-spaces
  async list() {
    const data = await apiRequest("/learning-spaces", { method: "GET" });
    return data || [];
  },

  // GET /api/learning-spaces/:id
  async getById(id) {
    return await apiRequest(`/learning-spaces/${id}`, { method: "GET" });
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
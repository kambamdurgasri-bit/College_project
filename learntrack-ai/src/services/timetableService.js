// Service layer for timetable management.
// All API calls go through here — no fallbacks to mock data.
import { apiRequest } from "./api";

export const timetableService = {
  // GET /api/timetable (apiRequest adds /api/ prefix)
  async list() {
    const data = await apiRequest("/timetable", { method: "GET" });
    return data || [];
  },

  // POST /api/timetable
  async create(payload) {
    return await apiRequest("/timetable", {
      method: "POST",
      body: payload,
    });
  },

  // PUT /api/timetable/:id
  async update(id, payload) {
    return await apiRequest(`/timetable/${id}`, {
      method: "PUT",
      body: payload,
    });
  },

  // DELETE /api/timetable/:id
  async delete(id) {
    return await apiRequest(`/timetable/${id}`, {
      method: "DELETE",
    });
  },
};
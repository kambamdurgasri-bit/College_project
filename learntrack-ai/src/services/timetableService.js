// Service layer for timetable management.
import { apiRequest } from "./api";

export const timetableService = {
  // GET /api/timetable
  // Returns events with nested learningSpace: { id, name, colorId } | null
  async list() {
    const data = await apiRequest("/timetable", {
      method: "GET",
    });
    return Array.isArray(data) ? data : [];
  },

  // POST /api/timetable
  // payload: { learningSpaceId, day, startTime, endTime }
  async create(payload) {
    return await apiRequest("/timetable", {
      method: "POST",
      body: payload,
    });
  },

  // PUT /api/timetable/:id
  // payload: { learningSpaceId?, day?, startTime?, endTime? }
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

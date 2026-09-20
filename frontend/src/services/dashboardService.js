// Service layer for the dashboard summary.
// All API calls go through here — no fallbacks to mock data.
import { apiRequest } from "./api";

export const dashboardService = {
  // GET /api/dashboard -> dashboard.controller.js#summary
  async getSummary() {
    return await apiRequest("/dashboard", { method: "GET" });
  },
};
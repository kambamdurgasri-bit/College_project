// Service layer placeholder. Keep all future API/network logic isolated
// here so pages and components never call fetch/axios directly.
//
// TODO: replace mock-data import with a real API client (e.g. axios instance)
import {
  scheduleEvents,
  weekDays,
  timetableWeekLabel,
} from "../mock-data/timetable";
import { apiRequest } from "./api";

export const timetableService = {
  // TODO: GET /api/timetable?week=:weekStart
  async getWeek() {
    return apiRequest(
      "/timetable",
      { method: "GET" },
      {
        weekLabel: timetableWeekLabel,
        weekDays,
        events: scheduleEvents,
      },
    );
  },

  // TODO: POST /api/timetable
  async createEvent(payload) {
    const created = await apiRequest(
      "/timetable",
      {
        method: "POST",
        body: payload,
      },
      {
        id: `event-${Date.now()}`,
        ...payload,
      },
    );

    return created;
  },
};

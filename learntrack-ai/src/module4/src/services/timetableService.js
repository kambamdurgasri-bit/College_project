// Service layer placeholder. Keep all future API/network logic isolated
// here so pages and components never call fetch/axios directly.
//
// TODO: replace mock-data import with a real API client (e.g. axios instance)
import {
  scheduleEvents,
  weekDays,
  timetableWeekLabel,
} from "../mock-data/timetable";

const SIMULATED_DELAY_MS = 400;

const delay = (value) =>
  new Promise((resolve) => setTimeout(() => resolve(value), SIMULATED_DELAY_MS));

export const timetableService = {
  // TODO: GET /api/timetable?week=:weekStart
  async getWeek() {
    return delay({ weekLabel: timetableWeekLabel, weekDays, events: scheduleEvents });
  },

  // TODO: POST /api/timetable
  async createEvent(payload) {
    return delay({ id: `event-${Date.now()}`, ...payload });
  },
};

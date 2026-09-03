// Service layer placeholder. Keep all future API/network logic isolated
// here so pages and components never call fetch/axios directly.
//
// TODO: replace mock-data import with a real API client (e.g. axios instance)
// TODO: add auth headers / interceptors once the auth module is ready
import { learningSpaces, getLearningSpaceById } from "../mock-data/learningSpaces";

const SIMULATED_DELAY_MS = 400;

const delay = (value) =>
  new Promise((resolve) => setTimeout(() => resolve(value), SIMULATED_DELAY_MS));

export const learningSpaceService = {
  // TODO: GET /api/learning-spaces
  async list() {
    return delay(learningSpaces);
  },

  // TODO: GET /api/learning-spaces/:id
  async getById(id) {
    return delay(getLearningSpaceById(id) ?? null);
  },

  // TODO: POST /api/learning-spaces
  async create(payload) {
    return delay({ id: `new-${Date.now()}`, ...payload });
  },

  // TODO: PUT /api/learning-spaces/:id
  async update(id, payload) {
    return delay({ id, ...payload });
  },

  // TODO: DELETE /api/learning-spaces/:id
  async remove(id) {
    return delay({ id, deleted: true });
  },
};

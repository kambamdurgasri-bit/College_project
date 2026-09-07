// Service layer placeholder. Keep all future API/network logic isolated
// here so pages and components never call fetch/axios directly.
//
// TODO: replace mock-data import with a real API client (e.g. axios instance)
// TODO: add auth headers / interceptors once the auth module is ready
import {
  learningSpaces,
  getLearningSpaceById,
} from "../mock-data/learningSpaces";
import { apiRequest } from "./api";

export const learningSpaceService = {
  async list() {
    return apiRequest("/learning-spaces", { method: "GET" }, learningSpaces);
  },

  async getById(id) {
    return apiRequest(
      `/learning-spaces/${id}`,
      { method: "GET" },
      getLearningSpaceById(id) ?? null,
    );
  },

  async create(payload) {
    const created = await apiRequest("/learning-spaces", {
      method: "POST",
      body: payload,
    }, {
      id: `new-${Date.now()}`,
      ...payload,
    });

    return created;
  },

  async update(id, payload) {
    const updated = await apiRequest(
      `/learning-spaces/${id}`,
      {
        method: "PUT",
        body: payload,
      },
      { id, ...payload },
    );

    return updated;
  },

  async remove(id) {
    const removed = await apiRequest(
      `/learning-spaces/${id}`,
      { method: "DELETE" },
      { id, deleted: true },
    );

    return removed;
  },
};

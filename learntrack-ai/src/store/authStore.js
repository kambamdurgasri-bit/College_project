import { create } from "zustand";
import { apiRequest } from "../services/api";

const getStoredToken = () => {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("learntrack-token");
};

const getStoredUser = () => {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem("learntrack-user");
  return raw ? JSON.parse(raw) : null;
};

export const useAuthStore = create((set) => ({
  user: getStoredUser(),
  token: getStoredToken(),
  isLoading: false,

  login: async ({ email, password }) => {
    set({ isLoading: true });
    try {
      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: { email, password },
      });
      window.localStorage.setItem("learntrack-token", data.token);
      window.localStorage.setItem("learntrack-user", JSON.stringify(data.user));
      set({ user: data.user, token: data.token, isLoading: false });
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return { success: false, error: error.message };
    }
  },

  register: async ({ name, email, password, phoneNumber }) => {
    set({ isLoading: true });
    try {
      const data = await apiRequest("/auth/register", {
        method: "POST",
        body: { name, email, password, phoneNumber },
      });
      window.localStorage.setItem("learntrack-token", data.token);
      window.localStorage.setItem("learntrack-user", JSON.stringify(data.user));
      set({ user: data.user, token: data.token, isLoading: false });
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return { success: false, error: error.message };
    }
  },

  logout: () => {
    window.localStorage.removeItem("learntrack-token");
    window.localStorage.removeItem("learntrack-user");
    set({ user: null, token: null });
  },
}));

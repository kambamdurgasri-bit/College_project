import { create } from "zustand";
import { apiRequest } from "../services/api";

const getStoredToken = () => {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("learntrack-token");
};

const getStoredUser = () => {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem("learntrack-user");
  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const useAuthStore = create((set, get) => ({
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
      if (data?.token) {
        window.localStorage.setItem("learntrack-token", data.token);
      }
      if (data?.user) {
        window.localStorage.setItem("learntrack-user", JSON.stringify(data.user));
      }
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
      if (data?.token) {
        window.localStorage.setItem("learntrack-token", data.token);
      }
      if (data?.user) {
        window.localStorage.setItem("learntrack-user", JSON.stringify(data.user));
      }
      set({ user: data.user, token: data.token, isLoading: false });
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return { success: false, error: error.message };
    }
  },

  checkAuth: async () => {
    const token = get().token || getStoredToken();
    if (!token) return null;
    try {
      const data = await apiRequest("/auth/me", { method: "GET" });
      if (data?.user) {
        window.localStorage.setItem("learntrack-user", JSON.stringify(data.user));
        set({ user: data.user });
        return data.user;
      }
    } catch {
      // If token is invalid or expired, do not throw, keep stored state or fallback safely
    }
    return get().user;
  },

  logout: () => {
    window.localStorage.removeItem("learntrack-token");
    window.localStorage.removeItem("learntrack-user");
    set({ user: null, token: null });
  },
}));

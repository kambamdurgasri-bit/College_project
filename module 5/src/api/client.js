const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
const REQUEST_TIMEOUT_MS = 10000;

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function apiRequest(path, options = {}) {
  if (!API_BASE_URL) {
    throw new ApiError("VITE_API_BASE_URL is not configured", 0);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...options.headers,
      },
      credentials: "include",
      signal: controller.signal,
    });

    const body = await response.json().catch(() => null);
    if (!response.ok) {
      throw new ApiError(body?.message || `Request failed with status ${response.status}`, response.status);
    }

    return body;
  } catch (error) {
    if (error.name === "AbortError") {
      throw new ApiError("The backend request timed out", 408);
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export const analyticsApi = {
  get: () => apiRequest("/api/analytics"),
};

export const recommendationsApi = {
  get: () => apiRequest("/api/recommendations"),
};
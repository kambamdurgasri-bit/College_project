const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "/api").replace(/\/$/, "");

const buildUrl = (path) => {
  if (!path) return API_BASE_URL;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};

export async function apiRequest(path, options = {}, fallbackValue = undefined) {
  const url = path.startsWith("http") ? path : buildUrl(path);

  const headers = {
    Accept: "application/json",
    ...(options.headers || {}),
  };

  const token = typeof window !== "undefined" ? window.localStorage.getItem("learntrack-token") : null;
  if (token && !headers.Authorization && !headers.authorization) {
    headers.Authorization = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  if (config.body && typeof config.body !== "string" && !(config.body instanceof FormData)) {
    config.headers["Content-Type"] = "application/json";
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(url, config);

    if (response.status === 204) {
      return null;
    }

    const contentType = response.headers.get("content-type") || "";
    const payload = contentType.includes("application/json")
      ? await response.json()
      : await response.text();

    if (!response.ok) {
      const message =
        typeof payload === "string"
          ? payload
          : payload?.message || payload?.error || `Request failed with status ${response.status}`;
      throw new Error(message);
    }

    return payload;
  } catch (error) {
    if (fallbackValue !== undefined) {
      return fallbackValue;
    }
    throw error;
  }
}

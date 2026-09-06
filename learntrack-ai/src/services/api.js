const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

const buildUrl = (path) => {
  if (!path) return API_BASE_URL;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};

const isNetworkError = (error) =>
  error instanceof TypeError ||
  String(error?.message || "").includes("Failed to fetch") ||
  String(error?.message || "").includes("NetworkError");

export async function apiRequest(path, options = {}, fallbackValue = undefined) {
  const url = path.startsWith("http") ? path : buildUrl(path);
  const config = {
    headers: {
      Accept: "application/json",
      ...(options.headers || {}),
    },
    ...options,
  };

  if (config.body && typeof config.body !== "string" && !(config.body instanceof FormData)) {
    config.headers = {
      ...config.headers,
      "Content-Type": "application/json",
    };
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(url, config);

    if (response.status === 204 || response.headers.get("content-length") === "0") {
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
    if (fallbackValue !== undefined && isNetworkError(error)) {
      return fallbackValue;
    }
    throw error;
  }
}

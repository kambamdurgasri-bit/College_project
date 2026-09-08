import { useEffect, useState } from "react";
import { mockUser } from "../mock-data/mockUser.js";

const PROFILE_STORAGE_KEY = "learntrack-profile";
const PREFERENCES_STORAGE_KEY = "learntrack-preferences";

const defaultPreferences = {
  notifications: {
    email: true,
    quizAlerts: true,
    weeklyReports: false,
    reminders: true,
  },
  visibility: "Learning Spaces Only",
  dataSharing: false,
  language: "English (India)",
};

const listeners = new Set();
let profile = readStoredProfile();

function readStoredProfile() {
  if (typeof window === "undefined") return { ...mockUser };
  try {
    const stored = window.localStorage.getItem(PROFILE_STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : {};
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? { ...mockUser, ...parsed }
      : { ...mockUser };
  } catch {
    return { ...mockUser };
  }
}

function notify() {
  listeners.forEach((listener) => listener({ ...profile }));
}

export async function getProfile() {
  return { ...profile };
}

export async function updateProfile(updates) {
  const nextProfile = { ...profile, ...updates };
  if (
    typeof nextProfile.avatar === "string" &&
    nextProfile.avatar.startsWith("blob:")
  ) {
    throw new Error(
      "That image preview is temporary. Save the selected image file instead."
    );
  }
  const validationError = validateProfile(nextProfile);
  if (validationError) throw new Error(validationError);
  profile = nextProfile;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
  }
  notify();
  return { ...profile };
}

export async function changePassword({ current, next, confirm }) {
  if (!String(current ?? "").trim())
    throw new Error("Current password is required.");
  if (!String(next ?? "").trim())
    throw new Error("New password is required.");
  if (!String(confirm ?? "").trim())
    throw new Error("Please confirm your new password.");
  if (String(next).length < 8)
    throw new Error("New password must be at least 8 characters.");
  if (next !== confirm)
    throw new Error("New password and confirmation must match.");
  return { success: true, demo: true };
}

export async function deleteAccount() {
  return { success: true, demo: true };
}

export function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    if (!file)
      return reject(new Error("Choose an image before saving."));
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () =>
      reject(
        new Error("We could not read that image. Please try again.")
      );
    reader.readAsDataURL(file);
  });
}

export function subscribeToProfile(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function validateProfile(values) {
  const requiredFields = [
    ["fullName", "Full name"],
    ["email", "Email"],
    ["gender", "Gender"],
    ["university", "College / University"],
    ["branch", "Branch"],
    ["department", "Department / Year"],
    ["about", "Bio"],
  ];
  for (const [field, label] of requiredFields) {
    if (!String(values[field] ?? "").trim())
      return `${label} is required.`;
  }
  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(values.email).trim())
  ) {
    return "Enter a valid email address.";
  }
  for (const [field, label] of [
    ["fullName", "Full name"],
    ["email", "Email"],
    ["phone", "Phone"],
    ["university", "College / University"],
    ["branch", "Branch"],
    ["department", "Department / Year"],
  ]) {
    if (String(values[field] ?? "").trim().length > 160)
      return `${label} must be 160 characters or fewer.`;
  }
  if (String(values.about ?? "").trim().length > 500)
    return "Bio must be 500 characters or fewer.";
  return "";
}

export function getPreferences() {
  if (typeof window === "undefined")
    return structuredPreferences(defaultPreferences);
  try {
    const stored = window.localStorage.getItem(PREFERENCES_STORAGE_KEY);
    return structuredPreferences(stored ? JSON.parse(stored) : {});
  } catch {
    return structuredPreferences(defaultPreferences);
  }
}

function structuredPreferences(value) {
  const parsed =
    value && typeof value === "object" && !Array.isArray(value) ? value : {};
  return {
    ...defaultPreferences,
    ...parsed,
    notifications: {
      ...defaultPreferences.notifications,
      ...(parsed.notifications || {}),
    },
  };
}

export function updatePreferences(updates) {
  const preferences = { ...getPreferences(), ...updates };
  if (typeof window !== "undefined") {
    window.localStorage.setItem(
      PREFERENCES_STORAGE_KEY,
      JSON.stringify(preferences)
    );
  }
  return preferences;
}

export function useProfile() {
  const [state, setState] = useState({
    data: null,
    loading: true,
    error: null,
  });

  const load = async () => {
    setState((current) => ({
      ...current,
      loading: true,
      error: null,
    }));
    try {
      setState({
        data: await getProfile(),
        loading: false,
        error: null,
      });
    } catch (error) {
      setState((current) => ({
        ...current,
        loading: false,
        error,
      }));
    }
  };

  useEffect(() => {
    load();
    return subscribeToProfile((data) =>
      setState({ data, loading: false, error: null })
    );
  }, []);

  return { ...state, reload: load };
}

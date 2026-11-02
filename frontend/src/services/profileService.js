import { useEffect, useState } from "react";
import { apiRequest } from "./api.js";

const PROFILE_STORAGE_KEY = "learntrack-profile";
const PREFERENCES_STORAGE_KEY = "learntrack-preferences";

const defaultProfile = {
  fullName: "User",
  email: "user@example.com",
  phone: "Not provided",
  dob: "2000-01-01",
  gender: "Not Specified",
  university: "State University",
  branch: "Computer Science",
  department: "Computer Science & Engineering",
  learningLevel: "Intermediate",
  about: "Active learner tracking progress on LearnTrack AI.",
  avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=User&backgroundColor=F4F2FF",
};

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

function getProfileStorageKey() {
  if (typeof window === "undefined") return PROFILE_STORAGE_KEY;
  try {
    const rawUser = window.localStorage.getItem("learntrack-user");
    const user = rawUser ? JSON.parse(rawUser) : null;
    return user?.id ? `${PROFILE_STORAGE_KEY}-${user.id}` : PROFILE_STORAGE_KEY;
  } catch {
    return PROFILE_STORAGE_KEY;
  }
}

const listeners = new Set();
let profile = readStoredProfile();

function readStoredProfile() {
  if (typeof window === "undefined") return { ...defaultProfile };
  try {
    const key = getProfileStorageKey();
    const stored = window.localStorage.getItem(key) || window.localStorage.getItem(PROFILE_STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : {};
    
    // Also cross-reference with stored auth user if available
    let authUser = {};
    try {
      const rawUser = window.localStorage.getItem("learntrack-user");
      if (rawUser) authUser = JSON.parse(rawUser);
    } catch {}

    const merged = {
      ...defaultProfile,
      ...(authUser?.name ? { fullName: authUser.name } : {}),
      ...(authUser?.email ? { email: authUser.email } : {}),
      ...(authUser?.phoneNumber ? { phone: authUser.phoneNumber } : {}),
      ...parsed,
    };
    return merged;
  } catch {
    return { ...defaultProfile };
  }
}

function notify() {
  listeners.forEach((listener) => listener({ ...profile }));
}

export async function getProfile() {
  const currentStored = readStoredProfile();
  try {
    const serverProfile = await apiRequest("/profile");
    if (serverProfile) {
      profile = {
        ...defaultProfile,
        ...serverProfile,
        fullName: serverProfile.fullName || serverProfile.name || defaultProfile.fullName,
        email: serverProfile.email || defaultProfile.email,
        phone: serverProfile.phoneNumber || serverProfile.phone || defaultProfile.phone,
        dob: serverProfile.dob !== undefined ? serverProfile.dob : defaultProfile.dob,
        gender: serverProfile.gender || defaultProfile.gender,
        university: serverProfile.university !== undefined ? serverProfile.university : defaultProfile.university,
        branch: serverProfile.branch !== undefined ? serverProfile.branch : defaultProfile.branch,
        department: serverProfile.department !== undefined ? serverProfile.department : defaultProfile.department,
        about: serverProfile.about !== undefined ? serverProfile.about : defaultProfile.about,
        avatar: serverProfile.avatar || defaultProfile.avatar,
        quickStats: serverProfile.quickStats || [],
        achievements: serverProfile.achievements || { badges: [], certificates: [], milestones: [] },
        activityTimeline: serverProfile.activityTimeline || [],
      };

      if (typeof window !== "undefined") {
        window.localStorage.setItem(getProfileStorageKey(), JSON.stringify(profile));
        window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
      }
      notify();
      return { ...profile };
    }
  } catch (err) {
    console.warn("Could not fetch profile from server, using cached profile.", err);
  }
  profile = currentStored;
  notify();
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

  try {
    const updatedServer = await apiRequest("/profile", {
      method: "PUT",
      body: updates,
    });
    if (updatedServer) {
      profile = {
        ...defaultProfile,
        ...updatedServer,
      };
    } else {
      profile = nextProfile;
    }
  } catch (err) {
    console.warn("Server profile update failed, using local profile:", err);
    profile = nextProfile;
  }

  if (typeof window !== "undefined") {
    window.localStorage.setItem(getProfileStorageKey(), JSON.stringify(profile));
    window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));

    // Sync with auth user store so navbar, sidebar, and headers update immediately
    try {
      const rawUser = window.localStorage.getItem("learntrack-user");
      if (rawUser) {
        const authUser = JSON.parse(rawUser);
        const updatedAuthUser = {
          ...authUser,
          name: profile.fullName || profile.name || authUser.name,
          email: profile.email || authUser.email,
          phoneNumber: profile.phone || profile.phoneNumber || authUser.phoneNumber,
        };
        window.localStorage.setItem("learntrack-user", JSON.stringify(updatedAuthUser));
      }
    } catch (e) {
      console.warn("Failed to sync auth user storage:", e);
    }
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

  return await apiRequest("/profile/change-password", {
    method: "POST",
    body: { currentPassword: current, newPassword: next },
  });
}

export async function deleteAccount() {
  try {
    await apiRequest("/profile", { method: "DELETE" });
  } catch (err) {
    console.warn("Could not delete account on server, proceeding with local cleanup:", err);
  }
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(getProfileStorageKey());
    window.localStorage.removeItem(PROFILE_STORAGE_KEY);
    window.localStorage.removeItem(PREFERENCES_STORAGE_KEY);
    window.localStorage.removeItem("learntrack-token");
    window.localStorage.removeItem("learntrack-user");
  }
  return { success: true };
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
  const [state, setState] = useState(() => {
    const cached = readStoredProfile();
    return {
      data: cached,
      loading: false,
      error: null,
    };
  });

  const load = async () => {
    try {
      const data = await getProfile();
      setState({
        data,
        loading: false,
        error: null,
      });
    } catch (error) {
      setState((current) => ({
        ...current,
        loading: false,
        error: current.data ? null : error,
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


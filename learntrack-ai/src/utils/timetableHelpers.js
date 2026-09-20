// Helpers for timetable display
import { timetableLegend } from "../mock-data/timetable";

// Map subject name to a color ID consistently (using string hash)
export function getColorIdBySubject(subjectName) {
  if (!subjectName || typeof subjectName !== "string") {
    return "purple";
  }
  const clean = subjectName.trim().toLowerCase();
  const legendItem = timetableLegend.find(
    (item) => item.label.toLowerCase() === clean
  );
  if (legendItem) return legendItem.colorId;

  // Fallback: generate a consistent hash-based color ID
  let hash = 0;
  for (let i = 0; i < subjectName.length; i++) {
    hash = ((hash << 5) - hash) + subjectName.charCodeAt(i);
    hash = hash & hash; // Convert to 32-bit integer
  }
  const colors = ["purple", "blue", "green", "orange", "pink", "indigo"];
  return colors[Math.abs(hash) % colors.length];
}

// Parse time string "HH:mm" to minutes since midnight
export function timeToMinutes(timeStr) {
  if (!timeStr || typeof timeStr !== "string") return 0;
  const [hours, minutes] = timeStr.split(":").map(Number);
  return (hours || 0) * 60 + (minutes || 0);
}

// Format "HH:mm" string to 12-hour display "h:mm AM/PM"
export function formatTime12Hour(timeStr) {
  if (!timeStr || typeof timeStr !== "string") return "12:00 AM";
  const [hours, minutes] = timeStr.split(":").map(Number);
  const h = hours || 0;
  const m = minutes || 0;
  const period = h >= 12 ? "PM" : "AM";
  const displayHour = h % 12 === 0 ? 12 : h % 12;
  return `${displayHour}:${m.toString().padStart(2, "0")} ${period}`;
}

// Parse weekday name to index (0=Monday, 6=Sunday) for sorting
export const WEEKDAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export function dayNameToIndex(dayName) {
  return WEEKDAYS.indexOf(dayName);
}
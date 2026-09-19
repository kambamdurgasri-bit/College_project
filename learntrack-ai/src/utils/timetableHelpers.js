// Helpers for timetable display
import { timetableLegend } from "../mock-data/timetable";

// Map subject name to a color ID consistently (using string hash)
export function getColorIdBySubject(subjectName) {
  // Try to find it in the legend first
  const legendItem = timetableLegend.find(
    (item) => item.label.toLowerCase() === subjectName.toLowerCase()
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
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
}

// Format "HH:mm" string to 12-hour display "h:mm AM/PM"
export function formatTime12Hour(timeStr) {
  const [hours, minutes] = timeStr.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const displayHour = hours % 12 === 0 ? 12 : hours % 12;
  return `${displayHour}:${minutes.toString().padStart(2, "0")} ${period}`;
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
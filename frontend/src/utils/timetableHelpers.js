// Helpers for timetable display

export const timetableLegend = [
  { colorId: "purple", label: "General Study" },
  { colorId: "blue", label: "Core Subjects" },
  { colorId: "green", label: "Practice & Revision" },
  { colorId: "orange", label: "Labs & Projects" },
];

export function getColorIdBySubject(subjectName) {
  if (!subjectName || typeof subjectName !== "string") {
    return "purple";
  }
  let hash = 0;
  for (let i = 0; i < subjectName.length; i++) {
    hash = ((hash << 5) - hash) + subjectName.charCodeAt(i);
    hash = hash & hash;
  }
  const colors = ["purple", "blue", "green", "orange", "pink", "indigo"];
  return colors[Math.abs(hash) % colors.length];
}

export function timeToMinutes(timeStr) {
  if (!timeStr || typeof timeStr !== "string") return 0;
  const [hours, minutes] = timeStr.split(":").map(Number);
  return (hours || 0) * 60 + (minutes || 0);
}

export function formatTime12Hour(timeStr) {
  if (!timeStr || typeof timeStr !== "string") return "12:00 AM";
  const [hours, minutes] = timeStr.split(":").map(Number);
  const h = hours || 0;
  const m = minutes || 0;
  const period = h >= 12 ? "PM" : "AM";
  const displayHour = h % 12 === 0 ? 12 : h % 12;
  return `${displayHour}:${m.toString().padStart(2, "0")} ${period}`;
}

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
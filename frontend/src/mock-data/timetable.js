// Dummy data only. Replace with API data once the backend is ready.
// dayIndex: 0 = Monday ... 6 = Sunday (matches the displayed week header)

export const timetableWeekLabel = "Week of May 26 – Jun 1, 2025";

export const weekDays = [
  { dayIndex: 0, label: "Mon", date: 26 },
  { dayIndex: 1, label: "Tue", date: 27 },
  { dayIndex: 2, label: "Wed", date: 28 },
  { dayIndex: 3, label: "Thu", date: 29 },
  { dayIndex: 4, label: "Fri", date: 30 },
  { dayIndex: 5, label: "Sat", date: 31 },
  { dayIndex: 6, label: "Sun", date: 1 },
];

// hour is in 24h time for easy vertical positioning
export const scheduleEvents = [
  { id: 1, dayIndex: 0, hour: 8, minute: 0, duration: 1, subjectId: "data-structures", label: "Data Structures" },
  { id: 2, dayIndex: 0, hour: 14, minute: 0, duration: 1.5, subjectId: "ml", label: "Machine Learning" },

  { id: 3, dayIndex: 1, hour: 9, minute: 0, duration: 1, subjectId: "database-systems", label: "DBMS" },
  { id: 4, dayIndex: 1, hour: 14, minute: 0, duration: 1, subjectId: "computer-networks", label: "Computer Networks" },
  { id: 5, dayIndex: 1, hour: 19, minute: 30, duration: 1, subjectId: "web-development", label: "Web Dev" },

  { id: 6, dayIndex: 2, hour: 8, minute: 0, duration: 1.5, subjectId: "ml", label: "Machine Learning" },
  { id: 7, dayIndex: 2, hour: 13, minute: 0, duration: 1, subjectId: "data-structures", label: "Data Structures" },
  { id: 8, dayIndex: 2, hour: 19, minute: 0, duration: 1, subjectId: "database-systems", label: "DBMS" },

  { id: 9, dayIndex: 3, hour: 9, minute: 0, duration: 1.5, subjectId: "operating-systems", label: "OS Concepts" },
  { id: 10, dayIndex: 3, hour: 19, minute: 30, duration: 1, subjectId: "computer-networks", label: "Computer Networks" },

  { id: 11, dayIndex: 4, hour: 8, minute: 0, duration: 1, subjectId: "data-structures", label: "Data Structures" },
  { id: 12, dayIndex: 4, hour: 15, minute: 0, duration: 1, subjectId: "web-development", label: "Web Dev" },

  { id: 13, dayIndex: 5, hour: 10, minute: 0, duration: 1, subjectId: "database-systems", label: "DBMS" },
  { id: 14, dayIndex: 5, hour: 14, minute: 30, duration: 1.5, subjectId: "ml", label: "Machine Learning" },
  { id: 15, dayIndex: 5, hour: 19, minute: 30, duration: 1, subjectId: "computer-networks", label: "Computer Networks" },
];

export const timetableLegend = [
  { subjectId: "ml", label: "Machine Learning", colorId: "purple" },
  { subjectId: "data-structures", label: "Data Structures", colorId: "green" },
  { subjectId: "database-systems", label: "DBMS", colorId: "blue" },
  { subjectId: "operating-systems", label: "Operating Systems", colorId: "orange" },
  { subjectId: "computer-networks", label: "Computer Networks", colorId: "red" },
  { subjectId: "web-development", label: "Web Development", colorId: "amber" },
];

export const getSubjectColorId = (subjectId) =>
  timetableLegend.find((s) => s.subjectId === subjectId)?.colorId || "purple";

// Central design tokens shared across Module 3 components.
// Keeping these in one place makes it trivial to re-theme subjects
// without hunting through every component.

export const COLOR_OPTIONS = [
  { id: "purple", value: "#7C3AED" },
  { id: "green", value: "#10B981" },
  { id: "blue", value: "#3B82F6" },
  { id: "red", value: "#F43F5E" },
  { id: "orange", value: "#F97316" },
  { id: "teal", value: "#14B8A6" },
  { id: "gray", value: "#94A3B8" },
];

// Icon keys map to lucide-react components in <IconPicker /> / <SubjectIcon />
export const ICON_OPTIONS = [
  "bot",
  "code2",
  "database",
  "settings",
  "globe",
  "monitor",
  "bar-chart",
  "flask",
  "gamepad",
  "lightbulb",
  "image",
  "layout-grid",
];

export const CATEGORY_OPTIONS = [
  "Computer Science",
  "Mathematics",
  "Data Science",
  "Engineering",
  "Design",
  "Business",
];

export const STATUS_FILTERS = ["All", "In Progress", "Completed"];

export const SORT_OPTIONS = ["Recent", "Name (A-Z)", "Progress (High-Low)"];

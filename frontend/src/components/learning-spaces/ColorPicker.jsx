import { Check } from "lucide-react";
import { COLOR_IDS, getTheme } from "../../utils/theme";

const SWATCH_IDS = ["purple", "green", "blue", "red", "orange", "teal", "gray"];

export default function ColorPicker({ value, onChange }) {
  return (
    <div className="flex flex-wrap gap-3">
      {SWATCH_IDS.filter((id) => COLOR_IDS.includes(id)).map((colorId) => {
        const theme = getTheme(colorId);
        const isSelected = value === colorId;
        return (
          <button
            key={colorId}
            type="button"
            onClick={() => onChange(colorId)}
            aria-label={colorId}
            className={`flex h-9 w-9 items-center justify-center rounded-full ${theme.solidBg} transition-transform hover:scale-105 ${
              isSelected ? "ring-2 ring-offset-2 ring-offset-white dark:ring-offset-surface-dark-card" : ""
            } ${isSelected ? theme.ring : ""}`}
          >
            {isSelected && <Check className="h-4 w-4 text-white" strokeWidth={3} />}
          </button>
        );
      })}
    </div>
  );
}

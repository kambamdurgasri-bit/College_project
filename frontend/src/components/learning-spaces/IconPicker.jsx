import SubjectIcon from "../common/SubjectIcon";
import { ICON_OPTIONS } from "../../utils/constants";
import { getTheme } from "../../utils/theme";

export default function IconPicker({ value, onChange, colorId = "purple" }) {
  const theme = getTheme(colorId);

  return (
    <div className="grid grid-cols-6 gap-2.5">
      {ICON_OPTIONS.map((icon) => {
        const isSelected = value === icon;
        return (
          <button
            key={icon}
            type="button"
            onClick={() => onChange(icon)}
            aria-label={icon}
            className={`flex h-11 items-center justify-center rounded-xl border transition-colors ${
              isSelected
                ? `${theme.softBg} ${theme.border} border-2`
                : "border-slate-200 text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-white/5"
            }`}
          >
            <SubjectIcon
              icon={icon}
              className={`h-4 w-4 ${isSelected ? theme.text : ""}`}
            />
          </button>
        );
      })}
    </div>
  );
}

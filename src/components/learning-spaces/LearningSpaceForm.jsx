import { useState } from "react";
import { ChevronDown } from "lucide-react";
import ColorPicker from "./ColorPicker";
import IconPicker from "./IconPicker";
import { CATEGORY_OPTIONS } from "../../utils/constants";

const DESCRIPTION_MAX = 200;

const DEFAULT_VALUES = {
  name: "",
  category: "",
  description: "",
  colorId: "purple",
  icon: "bot",
};

export default function LearningSpaceForm({
  initialValues,
  submitLabel = "Create Space",
  onSubmit,
  onCancel,
  submitting = false,
}) {
  const [values, setValues] = useState({ ...DEFAULT_VALUES, ...initialValues });
  const [errors, setErrors] = useState({});

  const update = (field, val) => setValues((prev) => ({ ...prev, [field]: val }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const nextErrors = {};
    if (!values.name.trim()) nextErrors.name = "Learning space name is required.";
    if (!values.category) nextErrors.category = "Please select a category.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      onSubmit?.(values);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Learning Space Name
        </label>
        <input
          type="text"
          value={values.name}
          onChange={(e) => update("name", e.target.value)}
          placeholder="e.g. Artificial Intelligence"
          className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-white/5 dark:text-slate-100 dark:placeholder:text-slate-500"
        />
        {errors.name && <p className="mt-1 text-xs text-rose-500">{errors.name}</p>}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Category
        </label>
        <div className="relative">
          <select
            value={values.category}
            onChange={(e) => update("category", e.target.value)}
            className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-white/5 dark:text-slate-100"
          >
            <option value="">Select Category</option>
            {CATEGORY_OPTIONS.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        </div>
        {errors.category && (
          <p className="mt-1 text-xs text-rose-500">{errors.category}</p>
        )}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Description
        </label>
        <textarea
          value={values.description}
          onChange={(e) =>
            update("description", e.target.value.slice(0, DESCRIPTION_MAX))
          }
          placeholder="Describe what you will learn in this space..."
          rows={3}
          className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-white/5 dark:text-slate-100 dark:placeholder:text-slate-500"
        />
        <p className="mt-1 text-right text-xs text-slate-400">
          {values.description.length}/{DESCRIPTION_MAX}
        </p>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Choose Color
        </label>
        <ColorPicker value={values.colorId} onChange={(v) => update("colorId", v)} />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Icon
        </label>
        <IconPicker
          value={values.icon}
          colorId={values.colorId}
          onChange={(v) => update("icon", v)}
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-white/5"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-700 disabled:opacity-60"
        >
          {submitting ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}

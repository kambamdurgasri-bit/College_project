import { useEffect, useRef, useState } from "react";
import { Camera, Upload } from "lucide-react";

export default function AvatarUploader({
  preview,
  onFileSelect,
  size = 96,
  compact = false,
}) {
  const inputRef = useRef(null);
  const [error, setError] = useState("");
  const [objectUrl, setObjectUrl] = useState("");

  useEffect(
    () => () => objectUrl && URL.revokeObjectURL(objectUrl),
    [objectUrl]
  );

  const handleChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (
      !["image/png", "image/jpeg"].includes(file.type) ||
      file.size > 5 * 1024 * 1024
    ) {
      setError("Please select a PNG or JPG image smaller than 5 MB.");
      event.target.value = "";
      return;
    }

    setError("");
    const url = URL.createObjectURL(file);
    setObjectUrl(url);
    onFileSelect(file, url);
  };

  return (
    <div className={`flex ${compact ? "flex-col items-center" : "items-center gap-5"}`}>
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <div className="h-full w-full rounded-full bg-brand-400 p-1">
          <img
            src={preview}
            alt="Avatar preview"
            className="h-full w-full rounded-full bg-white object-cover dark:bg-slate-700"
          />
        </div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          aria-label="Change photo"
          className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-white shadow-md"
        >
          <Camera size={14} />
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg"
          onChange={handleChange}
          className="hidden"
        />
      </div>
      <div className={compact ? "mt-4 text-center" : ""}>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
        >
          <Upload size={14} />
          Upload new photo
        </button>
        <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
          PNG or JPG, up to 5MB
        </p>
        {error && (
          <p role="alert" className="mt-2 max-w-xs text-xs font-medium text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

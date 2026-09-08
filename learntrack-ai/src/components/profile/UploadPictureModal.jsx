import { useEffect, useState } from "react";
import { ImagePlus, Trash2 } from "lucide-react";
import Modal from "../ui/Modal.jsx";
import AnimatedButton from "../ui/AnimatedButton.jsx";
import AvatarUploader from "./AvatarUploader.jsx";

export default function UploadPictureModal({
  open,
  onClose,
  currentAvatar,
  onSave,
}) {
  const [preview, setPreview] = useState(currentAvatar);
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setPreview(currentAvatar);
      setFile(null);
      setError("");
    }
  }, [open, currentAvatar]);

  const handleSave = async () => {
    if (!file || saving) return;
    setSaving(true);
    try {
      await onSave(file);
      onClose();
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Update Profile Picture"
      subtitle="A clear, friendly photo works best"
      icon={ImagePlus}
    >
      <div className="flex flex-col items-center py-2">
        <AvatarUploader
          preview={preview}
          size={112}
          compact
          onFileSelect={(selected, url) => {
            setFile(selected);
            setPreview(url);
          }}
        />
        {file && (
          <button
            type="button"
            onClick={() => {
              setFile(null);
              setPreview(currentAvatar);
            }}
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-red-600 hover:underline dark:text-red-400"
          >
            <Trash2 size={12} />
            Remove selected photo
          </button>
        )}
      </div>
      {error && (
        <p role="alert" className="mt-3 text-sm font-medium text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
      <div className="flex gap-3 pt-4">
        <AnimatedButton
          variant="ghost"
          onClick={onClose}
          className="flex-1"
        >
          Cancel
        </AnimatedButton>
        <AnimatedButton
          onClick={handleSave}
          className="flex-1"
          disabled={!file || saving}
        >
          {saving ? "Saving..." : "Save Photo"}
        </AnimatedButton>
      </div>
    </Modal>
  );
}

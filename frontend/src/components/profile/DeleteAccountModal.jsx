import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, Check, Trash2 } from "lucide-react";
import Modal from "../ui/Modal.jsx";
import AnimatedButton from "../ui/AnimatedButton.jsx";
import { deleteAccount } from "../../services/profileService.js";
import { useAuthStore } from "../../store/authStore.js";

export default function DeleteAccountModal({ open, onClose }) {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const [state, setState] = useState("idle");
  const [error, setError] = useState("");

  const handleDelete = async () => {
    setState("saving");
    setError("");
    try {
      await deleteAccount();
      setState("success");
      setTimeout(() => {
        logout();
        onClose();
        navigate("/login");
      }, 1200);
    } catch (deleteError) {
      setState("error");
      setError(deleteError.message || "Failed to delete account. Please try again.");
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Delete Account?"
      subtitle="Permanently remove your account and all associated data"
      icon={Trash2}
      maxWidth="max-w-sm"
    >
      {state === "success" ? (
        <div className="py-4 text-center">
          <Check className="mx-auto text-emerald-600" />
          <p className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">
            Account deleted successfully
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Redirecting to login...
          </p>
        </div>
      ) : (
        <>
          <p className="flex items-start gap-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            <AlertTriangle
              size={17}
              className="shrink-0 text-red-600 dark:text-red-400"
            />
            Warning: This action is permanent and cannot be undone. All your learning spaces, quizzes, analytics, and personal data will be completely erased.
          </p>
          {error && (
            <p role="alert" className="mt-4 text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          )}
          <div className="flex gap-3 pt-6">
            <AnimatedButton
              variant="ghost"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </AnimatedButton>
            <AnimatedButton
              variant="dangerSolid"
              onClick={handleDelete}
              className="flex-1"
              disabled={state === "saving"}
            >
              {state === "saving" ? "Deleting..." : "Delete Account"}
            </AnimatedButton>
          </div>
        </>
      )}
    </Modal>
  );
}

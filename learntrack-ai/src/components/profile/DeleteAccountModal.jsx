import { useState } from "react";
import { AlertTriangle, Check, Trash2 } from "lucide-react";
import Modal from "../ui/Modal.jsx";
import AnimatedButton from "../ui/AnimatedButton.jsx";
import { deleteAccount } from "../../services/profileService.js";

export default function DeleteAccountModal({ open, onClose }) {
  const [state, setState] = useState("idle");
  const [error, setError] = useState("");

  const handleDelete = async () => {
    setState("saving");
    try {
      await deleteAccount();
      setState("success");
    } catch (deleteError) {
      setState("error");
      setError(deleteError.message);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Delete account?"
      subtitle="Frontend demo only; no backend account will be deleted"
      icon={Trash2}
      maxWidth="max-w-sm"
    >
      {state === "success" ? (
        <div className="py-4 text-center">
          <Check className="mx-auto text-emerald-600" />
          <p className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">
            Account deletion requested
          </p>
          <AnimatedButton
            variant="ghost"
            onClick={onClose}
            className="mt-5"
          >
            Close
          </AnimatedButton>
        </div>
      ) : (
        <>
          <p className="flex items-start gap-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            <AlertTriangle
              size={17}
              className="shrink-0 text-red-600 dark:text-red-400"
            />
            This demo does not remove backend account data.
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

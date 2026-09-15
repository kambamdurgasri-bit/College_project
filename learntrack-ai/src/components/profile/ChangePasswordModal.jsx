import { useState } from "react";
import { Check, KeyRound, Lock } from "lucide-react";
import Modal from "../ui/Modal.jsx";
import { InputField } from "../ui/InfoField.jsx";
import AnimatedButton from "../ui/AnimatedButton.jsx";
import { changePassword } from "../../services/profileService.js";

export default function ChangePasswordModal({ open, onClose }) {
  const [form, setForm] = useState({ current: "", next: "", confirm: "" });
  const [state, setState] = useState("idle");
  const [error, setError] = useState("");

  const close = () => {
    if (state !== "saving") {
      setForm({ current: "", next: "", confirm: "" });
      setState("idle");
      setError("");
      onClose();
    }
  };

  const submit = async (event) => {
    event.preventDefault();
    setState("saving");
    setError("");
    try {
      await changePassword(form);
      setState("success");
      window.setTimeout(close, 1000);
    } catch (saveError) {
      setState("error");
      setError(saveError.message);
    }
  };

  return (
    <Modal
      open={open}
      onClose={close}
      title="Change Password"
      subtitle="Demo validation; no password is stored"
      icon={KeyRound}
    >
      {state === "success" ? (
        <div className="py-6 text-center">
          <Check className="mx-auto text-emerald-600" />
          <p className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">
            Password updated
          </p>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <InputField
            label="Current Password"
            type="password"
            icon={Lock}
            required
            value={form.current}
            onChange={(event) =>
              setForm({ ...form, current: event.target.value })
            }
          />
          <InputField
            label="New Password"
            type="password"
            icon={KeyRound}
            required
            value={form.next}
            onChange={(event) =>
              setForm({ ...form, next: event.target.value })
            }
          />
          <InputField
            label="Confirm New Password"
            type="password"
            icon={KeyRound}
            required
            value={form.confirm}
            onChange={(event) =>
              setForm({ ...form, confirm: event.target.value })
            }
          />
          {error && (
            <p role="alert" className="text-sm font-medium text-red-600 dark:text-red-400">
              {error}
            </p>
          )}
          <div className="flex gap-3">
            <AnimatedButton
              variant="ghost"
              onClick={close}
              className="flex-1"
            >
              Cancel
            </AnimatedButton>
            <AnimatedButton
              type="submit"
              className="flex-1"
              disabled={state === "saving"}
            >
              {state === "saving" ? "Updating..." : "Update Password"}
            </AnimatedButton>
          </div>
        </form>
      )}
    </Modal>
  );
}

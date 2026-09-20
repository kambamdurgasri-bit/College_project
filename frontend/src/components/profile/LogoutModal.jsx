import { LogOut } from "lucide-react";
import Modal from "../ui/Modal.jsx";
import AnimatedButton from "../ui/AnimatedButton.jsx";

export default function LogoutModal({ open, onClose, onConfirm }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Log Out"
      icon={LogOut}
      maxWidth="max-w-sm"
    >
      <p className="mb-6 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
        You will need to sign in again on this device. Continue?
      </p>
      <div className="flex gap-3">
        <AnimatedButton
          variant="ghost"
          onClick={onClose}
          className="flex-1"
        >
          Cancel
        </AnimatedButton>
        <AnimatedButton
          variant="dangerSolid"
          onClick={onConfirm}
          className="flex-1"
        >
          Log Out
        </AnimatedButton>
      </div>
    </Modal>
  );
}

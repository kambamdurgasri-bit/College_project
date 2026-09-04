import { LogOut } from 'lucide-react';
import Modal from '../ui/Modal';
import AnimatedButton from '../ui/AnimatedButton';

export default function LogoutModal({ open, onClose, onConfirm }) {
  return (
    <Modal open={open} onClose={onClose} title="Log Out" icon={LogOut} maxWidth="max-w-sm">
      <p className="text-sm text-textSecondary dark:text-dark-textMuted leading-relaxed mb-6">
        You'll need to sign in again to access your Learning Spaces, quizzes, and progress.
        Are you sure you want to log out?
      </p>
      <div className="flex gap-3">
        <AnimatedButton variant="ghost" onClick={onClose} className="flex-1">
          Cancel
        </AnimatedButton>
        <AnimatedButton variant="dangerSolid" onClick={onConfirm} className="flex-1">
          Log Out
        </AnimatedButton>
      </div>
    </Modal>
  );
}

import { LogOut } from 'lucide-react';
import Modal from '../profile-ui/Modal';
import AnimatedButton from '../profile-ui/AnimatedButton';

export default function LogoutModal({ open, onClose, onConfirm }) {
  return (
    <Modal open={open} onClose={onClose} title="Log Out" icon={LogOut} maxWidth="max-w-sm">
      <p className="text-sm text-textSecondary dark:text-dark-textMuted leading-relaxed mb-6">
        Authentication is not connected in this frontend module, so this action only closes the demo dialog.
        A future authenticated app will clear the session here. Continue?
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

import { useState } from 'react';
import { AlertTriangle, Check, Trash2 } from 'lucide-react';
import Modal from '../profile-ui/Modal';
import AnimatedButton from '../profile-ui/AnimatedButton';
import { deleteAccount } from '../../services/profileService';

export default function DeleteAccountModal({ open, onClose }) {
  const [state, setState] = useState('idle');
  const [error, setError] = useState('');

  const handleClose = () => {
    if (state !== 'saving') {
      setState('idle');
      setError('');
      onClose();
    }
  };

  const handleDelete = async () => {
    if (state === 'saving') return;
    setState('saving');
    setError('');
    try {
      await deleteAccount();
      setState('success');
    } catch (deleteError) {
      setState('error');
      setError(deleteError.message || 'We couldn’t delete your account. Try again.');
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Delete account?"
      subtitle="Frontend demo only; no backend account will be deleted"
      icon={Trash2}
      maxWidth="max-w-sm"
    >
      {state === 'success' ? (
        <div className="flex flex-col items-center justify-center py-4 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/10 dark:bg-dark-success/15 text-success dark:text-dark-success mb-3">
            <Check size={22} strokeWidth={2.6} />
          </div>
          <p className="text-sm font-semibold text-textPrimary dark:text-dark-text">Account deletion unavailable</p>
          <p className="mt-1 text-xs text-textSecondary dark:text-dark-textMuted">Connect the authenticated backend API before deleting account data.</p>
          <AnimatedButton variant="ghost" onClick={onClose} className="mt-5">Close</AnimatedButton>
        </div>
      ) : (
        <>
          <p className="flex items-start gap-2 text-sm text-textSecondary dark:text-dark-textMuted leading-relaxed">
            <AlertTriangle size={17} className="mt-0.5 shrink-0 text-danger dark:text-dark-danger" aria-hidden="true" />
            This demo can only show the confirmation flow. It does not remove a real account or backend data.
          </p>
          {error && <p role="alert" className="mt-4 text-sm font-medium text-danger dark:text-dark-danger">{error}</p>}
          <div className="flex gap-3 pt-6">
            <AnimatedButton variant="ghost" onClick={handleClose} className="flex-1" disabled={state === 'saving'}>
              Cancel
            </AnimatedButton>
            <AnimatedButton variant="dangerSolid" onClick={handleDelete} className="flex-1" disabled={state === 'saving'}>
              {state === 'saving' ? 'Deleting...' : 'Delete Account'}
            </AnimatedButton>
          </div>
        </>
      )}
    </Modal>
  );
}

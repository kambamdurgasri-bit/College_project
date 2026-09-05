import { useState } from 'react';
import { KeyRound, Lock, Check } from 'lucide-react';
import Modal from '../profile-ui/Modal';
import { InputField } from '../profile-ui/InfoField';
import AnimatedButton from '../profile-ui/AnimatedButton';
import { changePassword } from '../../services/profileService';

export default function ChangePasswordModal({ open, onClose }) {
  const [form, setForm] = useState({ current: '', next: '', confirm: '' });
  const [state, setState] = useState('idle');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (state === 'saving') return;
    setState('saving');
    setError('');
    try {
      await changePassword(form);
      setState('success');
      window.setTimeout(() => {
        setState('idle');
        setForm({ current: '', next: '', confirm: '' });
        setError('');
        onClose();
      }, 1200);
    } catch (saveError) {
      setState('error');
      setError(saveError.message || 'We couldn’t update your password. Try again.');
    }
  };

  const handleClose = () => {
    if (state !== 'saving') {
      setState('idle');
      setError('');
      setForm({ current: '', next: '', confirm: '' });
      onClose();
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Change Password"
      subtitle="Frontend demo only; no password is stored or changed"
      icon={KeyRound}
    >
      {state === 'success' ? (
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/10 dark:bg-dark-success/15 text-success dark:text-dark-success mb-3">
            <Check size={22} strokeWidth={2.6} />
          </div>
          <p className="text-sm font-semibold text-textPrimary dark:text-dark-text">Password change unavailable</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="Current Password"
            type="password"
            icon={Lock}
            placeholder="••••••••"
            required
            value={form.current}
            onChange={(e) => setForm({ ...form, current: e.target.value })}
          />
          <InputField
            label="New Password"
            type="password"
            icon={KeyRound}
            placeholder="••••••••"
            required
            value={form.next}
            onChange={(e) => setForm({ ...form, next: e.target.value })}
          />
          <InputField
            label="Confirm New Password"
            type="password"
            icon={KeyRound}
            placeholder="••••••••"
            required
            value={form.confirm}
            onChange={(e) => setForm({ ...form, confirm: e.target.value })}
          />
          <div className="flex gap-3 pt-2">
            <AnimatedButton variant="ghost" type="button" onClick={handleClose} className="flex-1">
              Cancel
            </AnimatedButton>
            <AnimatedButton type="submit" className="flex-1" disabled={state === 'saving'}>
              {state === 'saving' ? 'Updating...' : 'Update Password'}
            </AnimatedButton>
          </div>
          {error && <p role="alert" className="text-sm font-medium text-danger dark:text-dark-danger">{error}</p>}
        </form>
      )}
    </Modal>
  );
}

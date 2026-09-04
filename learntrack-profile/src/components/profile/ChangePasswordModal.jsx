import { useState } from 'react';
import { KeyRound, Lock, Check } from 'lucide-react';
import Modal from '../ui/Modal';
import { InputField } from '../ui/InfoField';
import AnimatedButton from '../ui/AnimatedButton';

export default function ChangePasswordModal({ open, onClose }) {
  const [form, setForm] = useState({ current: '', next: '', confirm: '' });
  const [done, setDone] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setDone(true);
    setTimeout(() => {
      setDone(false);
      setForm({ current: '', next: '', confirm: '' });
      onClose();
    }, 1200);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Change Password"
      subtitle="Use a strong password you don't use elsewhere"
      icon={KeyRound}
    >
      {done ? (
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/10 dark:bg-dark-success/15 text-success dark:text-dark-success mb-3">
            <Check size={22} strokeWidth={2.6} />
          </div>
          <p className="text-sm font-semibold text-textPrimary dark:text-dark-text">Password updated</p>
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
            <AnimatedButton variant="ghost" type="button" onClick={onClose} className="flex-1">
              Cancel
            </AnimatedButton>
            <AnimatedButton type="submit" className="flex-1">
              Update Password
            </AnimatedButton>
          </div>
        </form>
      )}
    </Modal>
  );
}

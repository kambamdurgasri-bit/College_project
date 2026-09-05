import { useEffect, useState } from 'react';
import { ImagePlus, Trash2 } from 'lucide-react';
import Modal from '../profile-ui/Modal';
import AnimatedButton from '../profile-ui/AnimatedButton';
import AvatarUploader from './AvatarUploader';

export default function UploadPictureModal({ open, onClose, currentAvatar, onSave }) {
  const [preview, setPreview] = useState(currentAvatar);
  const [file, setFile] = useState(null);
  const [state, setState] = useState('idle');
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setPreview(currentAvatar);
      setFile(null);
      setState('idle');
      setError('');
    }
  }, [open, currentAvatar]);

  const handleClose = () => {
    setPreview(currentAvatar);
    setFile(null);
    setState('idle');
    setError('');
    onClose();
  };

  const handleSave = async () => {
    if (!file || state === 'saving') return;
    setState('saving');
    setError('');
    try {
      await onSave(file);
      setState('success');
      onClose();
    } catch (saveError) {
      setState('error');
      setError(saveError.message || 'We could not save your photo. Please try again.');
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Update Profile Picture"
      subtitle="A clear, friendly photo works best"
      icon={ImagePlus}
    >
      <div className="flex flex-col items-center py-2">
        <AvatarUploader
          preview={preview}
          size={112}
          compact
          onFileSelect={(f, url) => {
            setFile(f);
            setPreview(url);
          }}
        />

        {file && (
          <button
            type="button"
            onClick={() => {
              setPreview(currentAvatar);
              setFile(null);
            }}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-danger dark:text-dark-danger mt-3 hover:underline"
          >
            <Trash2 size={12} /> Remove selected photo
          </button>
        )}
      </div>

      <div className="flex gap-3 pt-4">
        <AnimatedButton variant="ghost" onClick={handleClose} className="flex-1">
          Cancel
        </AnimatedButton>
          <AnimatedButton onClick={handleSave} className="flex-1" disabled={!file || state === 'saving'}>
          {state === 'saving' ? 'Saving...' : 'Save Photo'}
        </AnimatedButton>
      </div>
      {error && <p role="alert" className="mt-3 text-sm font-medium text-danger dark:text-dark-danger">{error}</p>}
    </Modal>
  );
}

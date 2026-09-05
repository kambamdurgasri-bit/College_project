import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, User, Mail, Phone, Cake, Building2, GraduationCap, Check, AlertCircle, LoaderCircle } from 'lucide-react';
import SectionTitle from '../../components/profile-ui/SectionTitle';
import { InputField, SelectField, TextareaField } from '../../components/profile-ui/InfoField';
import AnimatedButton from '../../components/profile-ui/AnimatedButton';
import AvatarUploader from '../../components/profile/AvatarUploader';
import { ROUTES } from '../../profileRoutes';
import { fileToDataUrl, updateProfile, useProfile, validateProfile } from '../../services/profileService';

export default function EditProfile() {
  const navigate = useNavigate();
  const { data: profile, loading, error: loadError, reload } = useProfile();
  const [form, setForm] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [saveState, setSaveState] = useState('idle');
  const [error, setError] = useState('');

  useEffect(() => {
    if (profile) {
      setForm({ ...profile });
      setAvatarPreview(profile.avatar);
      setSelectedAvatar(null);
    }
  }, [profile]);

  const update = (key) => (e) => setForm((current) => ({ ...current, [key]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    if (saveState === 'saving' || !form) return;

    const validationError = validateProfile(form);
    if (validationError) {
      setError(validationError);
      setSaveState('error');
      return;
    }

    setSaveState('saving');
    setError('');
    try {
      const avatar = selectedAvatar ? await fileToDataUrl(selectedAvatar) : profile.avatar;
      await updateProfile({ ...form, avatar });
      setSaveState('success');
      window.setTimeout(() => navigate(ROUTES.profile), 700);
    } catch (saveError) {
      setSaveState('error');
      setError(saveError.message || 'We couldn’t save your profile. Try again.');
    }
  };

  if (loading || !form) return <EditState label="Loading profile..." loading />;
  if (loadError) return <EditState label="We couldn’t load your profile." onRetry={reload} />;

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate(ROUTES.profile)}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-textSecondary dark:text-dark-textMuted hover:text-primary dark:hover:text-dark-accent transition-colors"
      >
        <ArrowLeft size={16} /> Back to Profile
      </button>

      <motion.form
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        onSubmit={handleSave}
        className="rounded-card border border-borderPurple dark:border-dark-border bg-white dark:bg-dark-card p-6 sm:p-8 shadow-soft dark:shadow-softDark"
      >
        <SectionTitle title="Edit Profile" subtitle="Keep your academic details up to date" />

        <div className="pb-6 mb-6 border-b border-borderPurple dark:border-dark-border">
          <AvatarUploader
            preview={avatarPreview}
            onFileSelect={(file, url) => {
              setSelectedAvatar(file);
              setAvatarPreview(url);
            }}
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-x-5 gap-y-5">
          <InputField required label="Full Name" icon={User} value={form.fullName} onChange={update('fullName')} />
          <InputField required label="Email" icon={Mail} type="email" value={form.email} onChange={update('email')} />
          <InputField label="Phone" icon={Phone} value={form.phone} onChange={update('phone')} />
          <InputField label="Date of Birth" icon={Cake} type="date" value={form.dob} onChange={update('dob')} />

          <SelectField required label="Gender" value={form.gender} onChange={update('gender')}>
            <option>Female</option>
            <option>Male</option>
            <option>Non-binary</option>
            <option>Prefer not to say</option>
          </SelectField>

          <InputField
            required label="College / University"
            icon={Building2}
            value={form.university}
            onChange={update('university')}
          />
          <InputField
            required label="Branch"
            icon={GraduationCap}
            value={form.branch}
            onChange={update('branch')}
          />
          <InputField
            required label="Department / Year"
            icon={GraduationCap}
            value={form.department}
            onChange={update('department')}
          />
        </div>

        <div className="mt-5">
          <TextareaField
            required label="Bio"
            rows={4}
            value={form.about}
            onChange={update('about')}
            placeholder="Tell us a bit about your learning goals..."
          />
        </div>

        {error && (
          <p role="alert" className="mt-5 flex items-center gap-2 text-sm font-medium text-danger dark:text-dark-danger">
            <AlertCircle size={16} aria-hidden="true" /> {error}
          </p>
        )}

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-8 pt-6 border-t border-borderPurple dark:border-dark-border">
          <AnimatedButton
            type="button"
            variant="ghost"
            onClick={() => navigate(ROUTES.profile)}
            disabled={saveState === 'saving'}
          >
            Cancel
          </AnimatedButton>
          <AnimatedButton type="submit" disabled={saveState === 'saving'} icon={saveState === 'saving' ? LoaderCircle : saveState === 'success' ? Check : undefined}>
            {saveState === 'saving' ? 'Saving...' : saveState === 'success' ? 'Saved!' : 'Save Changes'}
          </AnimatedButton>
        </div>
      </motion.form>

      <AnimatePresence>
        {saveState === 'success' && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="fixed bottom-6 right-6 flex items-center gap-2 rounded-pill bg-primary-gradient dark:bg-primary-gradient-dark text-white text-sm font-semibold px-5 py-3 shadow-glow dark:shadow-glowDark"
          >
            <Check size={16} /> Profile updated successfully
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function EditState({ label, loading = false, onRetry }) {
  return (
    <div role={loading ? undefined : 'alert'} className="rounded-card border border-borderPurple dark:border-dark-border bg-white dark:bg-dark-card p-8 text-center shadow-soft dark:shadow-softDark">
      {loading ? <LoaderCircle className="mx-auto animate-spin text-primary" aria-hidden="true" /> : <AlertCircle className="mx-auto text-danger dark:text-dark-danger" aria-hidden="true" />}
      <p className="mt-3 text-sm font-semibold text-textPrimary dark:text-dark-text">{label}</p>
      {!loading && <button type="button" onClick={onRetry} className="mt-3 text-sm font-semibold text-primary underline dark:text-dark-accent">Try again</button>}
    </div>
  );
}

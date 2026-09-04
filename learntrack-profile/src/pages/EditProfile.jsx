import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, User, Mail, Phone, Cake, Building2, GraduationCap, Check } from 'lucide-react';
import SectionTitle from '../components/ui/SectionTitle';
import { InputField, SelectField, TextareaField } from '../components/ui/InfoField';
import AnimatedButton from '../components/ui/AnimatedButton';
import AvatarUploader from '../components/profile/AvatarUploader';
import { mockUser } from '../data/mockUser';

export default function EditProfile() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ ...mockUser });
  const [avatarPreview, setAvatarPreview] = useState(mockUser.avatar);
  const [saved, setSaved] = useState(false);

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => {
      navigate('/profile');
    }, 900);
  };

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/profile')}
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
            onFileSelect={(file, url) => setAvatarPreview(url)}
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-x-5 gap-y-5">
          <InputField label="Full Name" icon={User} value={form.fullName} onChange={update('fullName')} />
          <InputField label="Email" icon={Mail} type="email" value={form.email} onChange={update('email')} />
          <InputField label="Phone" icon={Phone} value={form.phone} onChange={update('phone')} />
          <InputField label="Date of Birth" icon={Cake} type="date" value={form.dob} onChange={update('dob')} />

          <SelectField label="Gender" value={form.gender} onChange={update('gender')}>
            <option>Female</option>
            <option>Male</option>
            <option>Non-binary</option>
            <option>Prefer not to say</option>
          </SelectField>

          <InputField
            label="College / University"
            icon={Building2}
            value={form.university}
            onChange={update('university')}
          />
          <InputField
            label="Branch"
            icon={GraduationCap}
            value={form.branch}
            onChange={update('branch')}
          />
          <InputField
            label="Department / Year"
            icon={GraduationCap}
            value={form.department}
            onChange={update('department')}
          />
        </div>

        <div className="mt-5">
          <TextareaField
            label="Bio"
            rows={4}
            value={form.about}
            onChange={update('about')}
            placeholder="Tell us a bit about your learning goals..."
          />
        </div>

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-8 pt-6 border-t border-borderPurple dark:border-dark-border">
          <AnimatedButton
            type="button"
            variant="ghost"
            onClick={() => navigate('/profile')}
          >
            Cancel
          </AnimatedButton>
          <AnimatedButton type="submit" icon={saved ? Check : undefined}>
            {saved ? 'Saved!' : 'Save Changes'}
          </AnimatedButton>
        </div>
      </motion.form>

      <AnimatePresence>
        {saved && (
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

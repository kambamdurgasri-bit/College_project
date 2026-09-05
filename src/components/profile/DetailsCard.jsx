import { motion } from 'framer-motion';
import { User, Mail, Phone, Cake, VenetianMask, Building2, GraduationCap } from 'lucide-react';
import SectionTitle from '../profile-ui/SectionTitle';
import { InfoField } from '../profile-ui/InfoField';

export default function DetailsCard({ user }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05 }}
      className="rounded-card border border-borderPurple dark:border-dark-border bg-white dark:bg-dark-card p-6 shadow-soft dark:shadow-softDark"
    >
      <SectionTitle title="Profile Details" subtitle="Personal & academic information" />

      <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 divide-borderPurple dark:divide-dark-border">
        <InfoField label="Full Name" value={user.fullName} icon={User} />
        <InfoField label="Email" value={user.email} icon={Mail} />
        <InfoField label="Phone" value={user.phone} icon={Phone} />
        <InfoField
          label="Date of Birth"
          value={new Date(user.dob).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
          icon={Cake}
        />
        <InfoField label="Gender" value={user.gender} icon={VenetianMask} />
        <InfoField label="University" value={user.university} icon={Building2} />
        <InfoField label="Branch" value={user.branch} icon={GraduationCap} />
        <InfoField label="Department" value={user.department} icon={GraduationCap} />
      </div>

      <div className="mt-3 pt-4 border-t border-borderPurple dark:border-dark-border">
        <p className="text-xs font-semibold text-textSecondary dark:text-dark-textMuted mb-2">About Me</p>
        <p className="text-sm text-textPrimary dark:text-dark-text leading-relaxed">{user.about}</p>
      </div>
    </motion.div>
  );
}

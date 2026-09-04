import { motion } from 'framer-motion';
import { Pencil, GraduationCap, Building2, BarChart2, Mail, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AnimatedButton from '../ui/AnimatedButton';

export default function ProfileCard({ user, onAvatarClick }) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="relative overflow-hidden rounded-card border border-borderPurple dark:border-dark-border bg-hero-gradient dark:bg-hero-gradient-dark p-6 sm:p-8 shadow-soft dark:shadow-softDark"
    >
      <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary/10 dark:bg-dark-primary/20 blur-3xl" />
      <div className="absolute -left-10 -bottom-16 h-48 w-48 rounded-full bg-secondary/10 dark:bg-dark-accent/10 blur-3xl" />

      <div className="relative flex flex-col sm:flex-row sm:items-center gap-6">
        <div className="relative shrink-0 mx-auto sm:mx-0">
          <div className="h-28 w-28 rounded-full bg-primary-gradient dark:bg-primary-gradient-dark p-1 shadow-glow dark:shadow-glowDark">
            <img
              src={user.avatar}
              alt={user.fullName}
              className="h-full w-full rounded-full object-cover bg-white dark:bg-dark-card"
            />
          </div>
          <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full bg-success ring-2 ring-white dark:ring-dark-card" />
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            onClick={onAvatarClick}
            className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-white dark:bg-dark-surface text-primary dark:text-dark-accent shadow-softHover dark:shadow-softHoverDark ring-2 ring-white dark:ring-dark-card border border-borderPurple dark:border-dark-border"
            aria-label="Update profile picture"
          >
            <Camera size={14} strokeWidth={2.4} />
          </motion.button>
        </div>

        <div className="flex-1 text-center sm:text-left">
          <h1 className="font-heading text-2xl font-bold text-textPrimary dark:text-dark-text">{user.fullName}</h1>
          <p className="flex items-center justify-center sm:justify-start gap-1.5 text-sm text-textSecondary dark:text-dark-textMuted mt-1">
            <Mail size={14} /> {user.email}
          </p>

          <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-4">
            <Chip icon={Building2} label={user.university} />
            <Chip icon={GraduationCap} label={user.branch} />
            <Chip icon={BarChart2} label={`Level: ${user.learningLevel}`} />
          </div>
        </div>

        <div className="shrink-0">
          <AnimatedButton icon={Pencil} onClick={() => navigate('/profile/edit')}>
            Edit Profile
          </AnimatedButton>
        </div>
      </div>
    </motion.div>
  );
}

function Chip({ icon: Icon, label }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-pill bg-white/70 dark:bg-dark-surface/70 border border-borderPurple dark:border-dark-border px-3 py-1.5 text-xs font-medium text-textPrimary dark:text-dark-text backdrop-blur-sm">
      <Icon size={13} className="text-primary dark:text-dark-accent" />
      {label}
    </span>
  );
}

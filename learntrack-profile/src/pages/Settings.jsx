import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Bell,
  Palette,
  Lock,
  LogOut,
  KeyRound,
  Mail,
  Trash2,
  Moon,
  Sun,
  Globe,
  Eye,
  Share2,
  ChevronRight,
} from 'lucide-react';
import SectionTitle from '../components/ui/SectionTitle';
import SettingsCard, { SettingsRow } from '../components/profile/SettingsCard';
import ToggleSwitch from '../components/ui/ToggleSwitch';
import AnimatedButton from '../components/ui/AnimatedButton';
import ChangePasswordModal from '../components/profile/ChangePasswordModal';
import LogoutModal from '../components/profile/LogoutModal';
import { SelectField } from '../components/ui/InfoField';
import ThemeToggle from '../components/ui/ThemeToggle';
import { useTheme } from '../context/ThemeContext';

export default function Settings() {
  const { theme, isDark } = useTheme();
  const [notifications, setNotifications] = useState({
    email: true,
    quizAlerts: true,
    weeklyReports: false,
    reminders: true,
  });
  const [visibility, setVisibility] = useState('Learning Spaces Only');
  const [dataSharing, setDataSharing] = useState(false);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const toggleNotif = (key) => (val) => setNotifications({ ...notifications, [key]: val });

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <SectionTitle
          title="Settings"
          subtitle="Manage your account, notifications, appearance, and privacy"
        />
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Account */}
        <SettingsCard icon={ShieldCheck} title="Account" subtitle="Login & account security" index={0}>
          <SettingsRow
            label="Change Password"
            description="Update your account password"
            onClick={() => setShowPasswordModal(true)}
            control={<ChevronRight size={16} className="text-textSecondary dark:text-dark-textMuted" />}
          />
          <SettingsRow
            label="Email Address"
            description="ananya.rao@nitw.ac.in"
            control={
              <span className="inline-flex items-center gap-1 text-xs font-medium text-primary dark:text-dark-accent">
                <Mail size={13} /> Verified
              </span>
            }
          />
          <SettingsRow
            label="Delete Account"
            description="Permanently remove your account and data"
            control={
              <button className="inline-flex items-center gap-1.5 text-xs font-semibold text-danger dark:text-dark-danger hover:underline">
                <Trash2 size={13} /> Delete
              </button>
            }
          />
        </SettingsCard>

        {/* Notifications */}
        <SettingsCard icon={Bell} title="Notifications" subtitle="Choose what you hear about" index={1}>
          <SettingsRow
            label="Email Notifications"
            description="Get updates sent to your inbox"
            control={<ToggleSwitch checked={notifications.email} onChange={toggleNotif('email')} />}
          />
          <SettingsRow
            label="Quiz Alerts"
            description="Notify me about new AI-generated quizzes"
            control={
              <ToggleSwitch checked={notifications.quizAlerts} onChange={toggleNotif('quizAlerts')} />
            }
          />
          <SettingsRow
            label="Weekly Reports"
            description="A summary of your learning progress"
            control={
              <ToggleSwitch
                checked={notifications.weeklyReports}
                onChange={toggleNotif('weeklyReports')}
              />
            }
          />
          <SettingsRow
            label="Reminder Notifications"
            description="Nudges for upcoming study sessions"
            control={<ToggleSwitch checked={notifications.reminders} onChange={toggleNotif('reminders')} />}
          />
        </SettingsCard>

        {/* Appearance */}
        <SettingsCard icon={Palette} title="Appearance" subtitle="Personalize how LearnTrack looks" index={2}>
          <SettingsRow
            label="Theme"
            description={
              isDark
                ? 'Dark mode is on — easier on the eyes in low light'
                : 'Light mode is on — bright and crisp for daytime use'
            }
            control={
              <div className="flex items-center gap-2">
                <Sun size={14} className={isDark ? 'text-textSecondary dark:text-dark-textMuted' : 'text-warning'} />
                <ThemeToggle size="sm" />
                <Moon size={14} className={isDark ? 'text-primary dark:text-dark-accent' : 'text-textSecondary dark:text-dark-textMuted'} />
              </div>
            }
          />
          <div className="py-3.5 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-textPrimary dark:text-dark-text">Current Theme</p>
              <p className="text-xs text-textSecondary dark:text-dark-textMuted mt-0.5">
                Matches your device unless you override it here
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-pill bg-lightPurple dark:bg-dark-surface text-primary dark:text-dark-accent text-xs font-semibold px-3 py-1.5 capitalize">
              {isDark ? <Moon size={13} /> : <Sun size={13} />}
              {theme}
            </span>
          </div>
          <div className="py-3.5">
            <SelectField label="" icon={Globe} defaultValue="English (India)">
              <option>English (India)</option>
              <option>Hindi</option>
              <option>Telugu</option>
              <option>Tamil</option>
            </SelectField>
          </div>
        </SettingsCard>

        {/* Privacy */}
        <SettingsCard icon={Lock} title="Privacy" subtitle="Control who sees your activity" index={3}>
          <div className="py-3.5">
            <SelectField
              label="Profile Visibility"
              icon={Eye}
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
            >
              <option>Public</option>
              <option>Learning Spaces Only</option>
              <option>Private</option>
            </SelectField>
          </div>
          <SettingsRow
            label="Data Sharing"
            description="Share anonymized progress for platform insights"
            control={<ToggleSwitch checked={dataSharing} onChange={setDataSharing} />}
          />
        </SettingsCard>
      </div>

      {/* Security / Logout */}
      <SettingsCard icon={KeyRound} title="Security" subtitle="Session management" index={4}>
        <SettingsRow
          label="Log out of LearnTrack AI"
          description="You'll need to sign in again on this device"
          control={
            <AnimatedButton
              variant="danger"
              icon={LogOut}
              onClick={() => setShowLogoutModal(true)}
            >
              Log Out
            </AnimatedButton>
          }
        />
      </SettingsCard>

      <ChangePasswordModal open={showPasswordModal} onClose={() => setShowPasswordModal(false)} />
      <LogoutModal
        open={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={() => setShowLogoutModal(false)}
      />
    </div>
  );
}

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
  ChevronRight,
} from 'lucide-react';
import SectionTitle from '../../components/profile-ui/SectionTitle';
import SettingsCard, { SettingsRow } from '../../components/profile/SettingsCard';
import ToggleSwitch from '../../components/profile-ui/ToggleSwitch';
import AnimatedButton from '../../components/profile-ui/AnimatedButton';
import ChangePasswordModal from '../../components/profile/ChangePasswordModal';
import LogoutModal from '../../components/profile/LogoutModal';
import DeleteAccountModal from '../../components/profile/DeleteAccountModal';
import { SelectField } from '../../components/profile-ui/InfoField';
import ThemeToggle from '../../components/profile-ui/ThemeToggle';
import { useThemeStore } from '../../store/themeStore';
import { getPreferences, updatePreferences, useProfile } from '../../services/profileService';

export default function Settings() {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const { data: profile, loading: profileLoading } = useProfile();
  const preferences = getPreferences();
  const [notifications, setNotifications] = useState(preferences.notifications);
  const [visibility, setVisibility] = useState(preferences.visibility);
  const [dataSharing, setDataSharing] = useState(preferences.dataSharing);
  const [language, setLanguage] = useState(preferences.language);
  const [preferenceNotice, setPreferenceNotice] = useState('');

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const savePreference = (updates) => {
    updatePreferences(updates);
    setPreferenceNotice('Preferences saved.');
    window.setTimeout(() => setPreferenceNotice(''), 1800);
  };

  const toggleNotif = (key) => (val) => {
    const next = { ...notifications, [key]: val };
    setNotifications(next);
    savePreference({ notifications: next });
  };

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
            description={profileLoading ? 'Loading email...' : profile?.email || 'No email available'}
            control={
                <span className="inline-flex items-center gap-1 text-xs font-medium text-primary dark:text-dark-accent">
                <Mail size={13} /> Demo email
              </span>
            }
          />
          <SettingsRow
            label="Delete Account"
            description="Permanently remove your account and data"
            control={
              <button type="button" onClick={() => setShowDeleteModal(true)} className="inline-flex items-center gap-1.5 text-xs font-semibold text-danger dark:text-dark-danger hover:underline">
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
            control={<ToggleSwitch label="Email notifications" checked={notifications.email} onChange={toggleNotif('email')} />}
          />
          <SettingsRow
            label="Quiz Alerts"
            description="Notify me about new AI-generated quizzes"
            control={
              <ToggleSwitch label="Quiz alerts" checked={notifications.quizAlerts} onChange={toggleNotif('quizAlerts')} />
            }
          />
          <SettingsRow
            label="Weekly Reports"
            description="A summary of your learning progress"
            control={
              <ToggleSwitch
                label="Weekly reports"
                checked={notifications.weeklyReports}
                onChange={toggleNotif('weeklyReports')}
              />
            }
          />
          <SettingsRow
            label="Reminder Notifications"
            description="Nudges for upcoming study sessions"
            control={<ToggleSwitch label="Reminder notifications" checked={notifications.reminders} onChange={toggleNotif('reminders')} />}
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
            <SelectField
              label="Language"
              icon={Globe}
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value);
                savePreference({ language: e.target.value });
              }}
            >
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
              onChange={(e) => {
                setVisibility(e.target.value);
                savePreference({ visibility: e.target.value });
              }}
            >
              <option>Public</option>
              <option>Learning Spaces Only</option>
              <option>Private</option>
            </SelectField>
          </div>
          <SettingsRow
            label="Data Sharing"
            description="Share anonymized progress for platform insights"
            control={<ToggleSwitch label="Data sharing" checked={dataSharing} onChange={(value) => { setDataSharing(value); savePreference({ dataSharing: value }); }} />}
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

      {preferenceNotice && <p role="status" className="text-sm font-medium text-success dark:text-dark-success">{preferenceNotice}</p>}

      <ChangePasswordModal open={showPasswordModal} onClose={() => setShowPasswordModal(false)} />
      <DeleteAccountModal open={showDeleteModal} onClose={() => setShowDeleteModal(false)} />
      <LogoutModal
        open={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={() => setShowLogoutModal(false)}
      />
    </div>
  );
}

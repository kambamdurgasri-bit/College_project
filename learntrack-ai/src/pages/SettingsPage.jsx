import { useState } from "react";
import {
  Bell,
  KeyRound,
  Lock,
  LogOut,
  Mail,
  Palette,
  ShieldCheck,
  Trash2,
  Sun,
} from "lucide-react";
import SectionTitle from "../components/ui/SectionTitle.jsx";
import { SelectField } from "../components/ui/InfoField.jsx";
import ToggleSwitch from "../components/ui/ToggleSwitch.jsx";
import AnimatedButton from "../components/ui/AnimatedButton.jsx";
import SettingsCard, { SettingsRow } from "../components/profile/SettingsCard.jsx";
import ChangePasswordModal from "../components/profile/ChangePasswordModal.jsx";
import LogoutModal from "../components/profile/LogoutModal.jsx";
import DeleteAccountModal from "../components/profile/DeleteAccountModal.jsx";
import {
  getPreferences,
  updatePreferences,
  useProfile,
} from "../services/profileService.js";

export default function SettingsPage() {
  const { data: profile, loading } = useProfile();
  const preferences = getPreferences();

  const [notifications, setNotifications] = useState(preferences.notifications);
  const [visibility, setVisibility] = useState(preferences.visibility);
  const [dataSharing, setDataSharing] = useState(preferences.dataSharing);
  const [language, setLanguage] = useState(preferences.language);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const savePreference = (updates) => updatePreferences(updates);

  const toggle = (key) => (value) => {
    const next = { ...notifications, [key]: value };
    setNotifications(next);
    savePreference({ notifications: next });
  };

  const handleLogout = () => {
    // Demo: just close the modal
    setLogoutOpen(false);
  };

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Settings"
        subtitle="Manage your account, notifications, appearance and privacy"
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <SettingsCard
          icon={ShieldCheck}
          title="Account"
          subtitle="Login and account security"
          index={0}
        >
          <SettingsRow
            label="Change Password"
            description="Update your account password"
            onClick={() => setPasswordOpen(true)}
            control={<KeyRound size={16} className="text-slate-500 dark:text-slate-500" />}
          />
          <SettingsRow
            label="Email Address"
            description={loading ? "Loading email..." : profile?.email}
            control={
              <span className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 dark:text-brand-400">
                <Mail size={13} />
                Verified
              </span>
            }
          />
          <SettingsRow
            label="Delete Account"
            description="Permanently remove your account and data"
            control={
              <button
                type="button"
                onClick={() => setDeleteOpen(true)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 dark:text-red-400"
              >
                <Trash2 size={13} />
                Delete
              </button>
            }
          />
        </SettingsCard>

        <SettingsCard
          icon={Bell}
          title="Notifications"
          subtitle="Choose what you hear about"
          index={1}
        >
          <SettingsRow
            label="Email Notifications"
            description="Get updates sent to your inbox"
            control={
              <ToggleSwitch
                label="Email notifications"
                checked={notifications.email}
                onChange={toggle("email")}
              />
            }
          />
          <SettingsRow
            label="Quiz Alerts"
            description="Notify me about new AI-generated quizzes"
            control={
              <ToggleSwitch
                label="Quiz alerts"
                checked={notifications.quizAlerts}
                onChange={toggle("quizAlerts")}
              />
            }
          />
          <SettingsRow
            label="Weekly Reports"
            description="A summary of your learning progress"
            control={
              <ToggleSwitch
                label="Weekly reports"
                checked={notifications.weeklyReports}
                onChange={toggle("weeklyReports")}
              />
            }
          />
          <SettingsRow
            label="Reminder Notifications"
            description="Nudges for upcoming study sessions"
            control={
              <ToggleSwitch
                label="Reminder notifications"
                checked={notifications.reminders}
                onChange={toggle("reminders")}
              />
            }
          />
        </SettingsCard>

        <SettingsCard
          icon={Palette}
          title="Appearance"
          subtitle="Use the LearnTrack light interface"
          index={2}
        >
          <SettingsRow
            label="Theme"
            description="The team application currently uses its shared light theme"
            control={<Sun size={16} className="text-brand-600 dark:text-brand-400" />}
          />
          <div className="py-3.5">
            <SelectField
              label="Language"
              value={language}
              onChange={(event) => {
                setLanguage(event.target.value);
                savePreference({ language: event.target.value });
              }}
            >
              <option>English (India)</option>
              <option>Hindi</option>
              <option>Telugu</option>
              <option>Tamil</option>
            </SelectField>
          </div>
        </SettingsCard>

        <SettingsCard
          icon={Lock}
          title="Privacy"
          subtitle="Control who sees your activity"
          index={3}
        >
          <div className="py-3.5">
            <SelectField
              label="Profile Visibility"
              value={visibility}
              onChange={(event) => {
                setVisibility(event.target.value);
                savePreference({ visibility: event.target.value });
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
            control={
              <ToggleSwitch
                label="Data sharing"
                checked={dataSharing}
                onChange={(value) => {
                  setDataSharing(value);
                  savePreference({ dataSharing: value });
                }}
              />
            }
          />
        </SettingsCard>
      </div>

      <SettingsCard
        icon={KeyRound}
        title="Security"
        subtitle="Session management"
        index={4}
      >
        <SettingsRow
          label="Log out of LearnTrack AI"
          description="You will need to sign in again on this device"
          control={
            <AnimatedButton
              variant="danger"
              icon={LogOut}
              onClick={() => setLogoutOpen(true)}
            >
              Log Out
            </AnimatedButton>
          }
        />
      </SettingsCard>

      <ChangePasswordModal open={passwordOpen} onClose={() => setPasswordOpen(false)} />
      <DeleteAccountModal open={deleteOpen} onClose={() => setDeleteOpen(false)} />
      <LogoutModal
        open={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
}

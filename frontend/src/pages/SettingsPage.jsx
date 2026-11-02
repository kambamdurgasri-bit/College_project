import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  CheckCircle2,
  KeyRound,
  Lock,
  LogOut,
  Mail,
  Moon,
  Palette,
  Pencil,
  ShieldCheck,
  Sun,
  Trash2,
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
import { useAuthStore } from "../store/authStore.js";
import { useThemeStore } from "../store/themeStore.js";

export default function SettingsPage() {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const { theme, toggleTheme } = useThemeStore();
  const { data: profile, loading } = useProfile();
  const preferences = getPreferences();

  const [notifications, setNotifications] = useState(preferences.notifications);
  const [visibility, setVisibility] = useState(preferences.visibility);
  const [dataSharing, setDataSharing] = useState(preferences.dataSharing);
  const [language, setLanguage] = useState(preferences.language);
  const [toastMessage, setToastMessage] = useState("");
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((curr) => (curr === message ? "" : curr));
    }, 2500);
  };

  const savePreference = (updates, message = "Preferences saved") => {
    updatePreferences(updates);
    showToast(message);
  };

  const toggleNotification = (key, label) => (value) => {
    const next = { ...notifications, [key]: value };
    setNotifications(next);
    savePreference({ notifications: next }, `${label} ${value ? "enabled" : "disabled"}`);
  };

  const handleLogout = () => {
    setLogoutOpen(false);
    logout();
    navigate("/login");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <SectionTitle
          title="Settings"
          subtitle="Manage your account, notifications, appearance and privacy"
        />
        {toastMessage && (
          <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 text-xs font-semibold text-emerald-800 shadow-sm transition-all dark:border-emerald-800/60 dark:bg-emerald-950/60 dark:text-emerald-300">
            <CheckCircle2 size={14} className="text-emerald-600 dark:text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Account Section */}
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
            control={<KeyRound size={16} className="text-slate-500 hover:text-brand-600 dark:text-slate-400" />}
          />
          <SettingsRow
            label="Email Address"
            description={loading ? "Loading email..." : (profile?.email || "Not provided")}
            control={
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  <Mail size={13} />
                  Active
                </span>
                <button
                  type="button"
                  onClick={() => navigate("/profile/edit")}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-xs font-medium text-slate-600 transition hover:bg-slate-100 hover:text-brand-600 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
                  title="Edit profile & email"
                >
                  <Pencil size={11} />
                  Edit
                </button>
              </div>
            }
          />
          <SettingsRow
            label="Delete Account"
            description="Permanently remove your account and data"
            control={
              <button
                type="button"
                onClick={() => setDeleteOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50/50 px-2.5 py-1 text-xs font-semibold text-red-600 transition hover:bg-red-100 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-900/50"
              >
                <Trash2 size={13} />
                Delete
              </button>
            }
          />
        </SettingsCard>

        {/* Notifications Section */}
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
                onChange={toggleNotification("email", "Email notifications")}
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
                onChange={toggleNotification("quizAlerts", "Quiz alerts")}
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
                onChange={toggleNotification("weeklyReports", "Weekly reports")}
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
                onChange={toggleNotification("reminders", "Study reminders")}
              />
            }
          />
        </SettingsCard>

        {/* Appearance Section */}
        <SettingsCard
          icon={Palette}
          title="Appearance"
          subtitle="Customize interface theme and language"
          index={2}
        >
          <SettingsRow
            label="Theme"
            description={theme === "dark" ? "Currently using Dark Mode" : "Currently using Light Mode"}
            control={
              <button
                type="button"
                onClick={() => {
                  toggleTheme();
                  showToast(`Switched to ${theme === "dark" ? "Light" : "Dark"} mode`);
                }}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
                aria-label="Toggle application theme"
              >
                {theme === "dark" ? (
                  <>
                    <Moon size={14} className="text-brand-400" />
                    <span>Dark</span>
                  </>
                ) : (
                  <>
                    <Sun size={14} className="text-amber-500" />
                    <span>Light</span>
                  </>
                )}
              </button>
            }
          />
          <div className="py-3.5">
            <SelectField
              label="Language"
              value={language}
              onChange={(event) => {
                const newLang = event.target.value;
                setLanguage(newLang);
                savePreference({ language: newLang }, `Language updated to ${newLang}`);
              }}
            >
              <option>English (India)</option>
              <option>English (US)</option>
              <option>Hindi</option>
              <option>Telugu</option>
              <option>Tamil</option>
              <option>Spanish</option>
              <option>French</option>
            </SelectField>
          </div>
        </SettingsCard>

        {/* Privacy Section */}
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
                const nextVis = event.target.value;
                setVisibility(nextVis);
                savePreference({ visibility: nextVis }, `Profile visibility set to ${nextVis}`);
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
                  savePreference({ dataSharing: value }, `Data sharing ${value ? "enabled" : "disabled"}`);
                }}
              />
            }
          />
        </SettingsCard>
      </div>

      {/* Security & Sessions Section */}
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

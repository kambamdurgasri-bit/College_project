import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  Cake,
  Check,
  GraduationCap,
  Mail,
  User,
  Phone,
  AlertCircle,
  LoaderCircle,
} from "lucide-react";
import SectionTitle from "../../components/ui/SectionTitle.jsx";
import {
  InputField,
  SelectField,
  TextareaField,
} from "../../components/ui/InfoField.jsx";
import AnimatedButton from "../../components/ui/AnimatedButton.jsx";
import AvatarUploader from "../../components/profile/AvatarUploader.jsx";
import {
  fileToDataUrl,
  updateProfile,
  useProfile,
  validateProfile,
} from "../../services/profileService.js";

export default function EditProfilePage() {
  const navigate = useNavigate();
  const { data: profile, loading, error: loadError, reload } = useProfile();
  const [form, setForm] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [state, setState] = useState("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    if (profile) {
      setForm({ ...profile });
      setAvatarPreview(profile.avatar);
      setSelectedAvatar(null);
    }
  }, [profile]);

  const update = (key) => (event) =>
    setForm((current) => ({ ...current, [key]: event.target.value }));

  const save = async (event) => {
    event.preventDefault();
    if (!form || state === "saving") return;

    const validationError = validateProfile(form);
    if (validationError) {
      setError(validationError);
      setState("error");
      return;
    }

    setState("saving");
    setError("");
    try {
      await updateProfile({
        ...form,
        avatar: selectedAvatar
          ? await fileToDataUrl(selectedAvatar)
          : profile.avatar,
      });
      setState("success");
      window.setTimeout(() => navigate("/profile"), 700);
    } catch (saveError) {
      setState("error");
      setError(saveError.message);
    }
  };

  if (loading || !form) {
    return (
      <div role="status" className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800/80 dark:bg-slate-800">
        <LoaderCircle className="mx-auto animate-spin text-brand-600" />
        <p className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">
          Loading profile...
        </p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div role="alert" className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800/80 dark:bg-slate-800">
        <AlertCircle className="mx-auto text-red-600 dark:text-red-400" />
        <p className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">
          We could not load your profile.
        </p>
        <button
          type="button"
          onClick={reload}
          className="mt-3 text-sm font-semibold text-brand-600 underline dark:text-brand-400"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={() => navigate("/profile")}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400"
      >
        <ArrowLeft size={16} />
        Back to Profile
      </button>
      <form
        onSubmit={save}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800/80 dark:bg-slate-800 sm:p-8"
      >
        <SectionTitle
          title="Edit Profile"
          subtitle="Keep your academic details up to date"
        />
        <div className="mb-6 border-b border-slate-200 pb-6 dark:border-slate-700">
          <AvatarUploader
            preview={avatarPreview}
            onFileSelect={(file, url) => {
              setSelectedAvatar(file);
              setAvatarPreview(url);
            }}
          />
        </div>
        <div className="grid gap-x-5 gap-y-5 sm:grid-cols-2">
          <InputField
            required
            label="Full Name"
            icon={User}
            value={form.fullName}
            onChange={update("fullName")}
          />
          <InputField
            required
            label="Email"
            icon={Mail}
            type="email"
            value={form.email}
            onChange={update("email")}
          />
          <InputField
            label="Phone"
            icon={Phone}
            value={form.phone}
            onChange={update("phone")}
          />
          <InputField
            label="Date of Birth"
            icon={Cake}
            type="date"
            value={form.dob}
            onChange={update("dob")}
          />
          <SelectField
            required
            label="Gender"
            value={form.gender}
            onChange={update("gender")}
          >
            <option>Female</option>
            <option>Male</option>
            <option>Non-binary</option>
            <option>Prefer not to say</option>
          </SelectField>
          <InputField
            required
            label="College / University"
            icon={Building2}
            value={form.university}
            onChange={update("university")}
          />
          <InputField
            required
            label="Branch"
            icon={GraduationCap}
            value={form.branch}
            onChange={update("branch")}
          />
          <InputField
            required
            label="Department / Year"
            icon={GraduationCap}
            value={form.department}
            onChange={update("department")}
          />
        </div>
        <div className="mt-5">
          <TextareaField
            required
            label="Bio"
            rows={4}
            value={form.about}
            onChange={update("about")}
          />
        </div>
        {error && (
          <p
            role="alert"
            className="mt-5 flex items-center gap-2 text-sm font-medium text-red-600 dark:text-red-400"
          >
            <AlertCircle size={16} />
            {error}
          </p>
        )}
        <div className="mt-8 flex flex-col-reverse justify-end gap-3 border-t border-slate-200 pt-6 dark:border-slate-700 sm:flex-row">
          <AnimatedButton
            variant="ghost"
            type="button"
            onClick={() => navigate("/profile")}
            disabled={state === "saving"}
          >
            Cancel
          </AnimatedButton>
          <AnimatedButton
            type="submit"
            disabled={state === "saving"}
            icon={
              state === "saving"
                ? LoaderCircle
                : state === "success"
                  ? Check
                  : undefined
            }
          >
            {state === "saving"
              ? "Saving..."
              : state === "success"
                ? "Saved!"
                : "Save Changes"}
          </AnimatedButton>
        </div>
      </form>
    </div>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Mail, User } from "lucide-react";
import AuthShell from "../../components/auth/AuthShell";
import { useAuthStore } from "../../store/authStore";
import {
  SampleBadge,
  FieldLabel,
  TextField,
  PasswordField,
  PrimaryButton,
} from "../../components/auth/FormFields";

export default function RegisterPage() {
  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const next = {};
    if (name.trim().length < 2) next.name = "Enter your full name.";
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Enter a valid email address.";
    if (password.length < 6) next.password = "Password must be at least 6 characters.";
    if (confirm !== password) next.confirm = "Passwords do not match.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    const result = await register({ name, email, password });
    setSubmitting(false);
    if (result.success) {
      navigate("/dashboard");
    } else {
      setErrors((prev) => ({ ...prev, email: result.error }));
    }
  };

  return (
    <AuthShell>
      <form onSubmit={handleSubmit}>
        <div className="mb-1 flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Get started
          </span>
          <SampleBadge />
        </div>
        <h1 className="mb-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Create your account
        </h1>
        <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
          Start tracking what you actually understand.
        </p>

        <FieldLabel>Full name</FieldLabel>
        <TextField
          icon={User}
          type="text"
          placeholder="Aarav Sharma"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
        />

        <FieldLabel>Email</FieldLabel>
        <TextField
          icon={Mail}
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />

        <PasswordField
          label="Password"
          placeholder="Create a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />

        <PasswordField
          label="Confirm password"
          placeholder="Re-enter your password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          error={errors.confirm}
        />

        <PrimaryButton type="submit" disabled={submitting}>
          Create Account <ArrowRight size={15} />
        </PrimaryButton>

        <p className="mt-5 text-center text-xs text-slate-500 dark:text-slate-400">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="font-semibold text-brand-600 dark:text-brand-400"
          >
            Log in
          </button>
        </p>
      </form>
    </AuthShell>
  );
}

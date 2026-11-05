import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Mail, AlertCircle } from "lucide-react";
import AuthShell from "../../components/auth/AuthShell";
import { useAuthStore } from "../../store/authStore";
import {
  SampleBadge,
  FieldLabel,
  TextField,
  PasswordField,
  PrimaryButton,
} from "../../components/auth/FormFields";

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const next = {};
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Enter a valid email address.";
    if (password.length < 8) next.password = "Password must be at least 8 characters.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;
    setSubmitting(true);
    const result = await login({ email, password });
    setSubmitting(false);
    if (result.success) {
      navigate("/dashboard");
    } else {
      setServerError(result.error || "Login failed. Please check your credentials.");
    }
  };

  return (
    <AuthShell>
      <form onSubmit={handleSubmit}>
        <div className="mb-1 flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Welcome back
          </span>
          <SampleBadge />
        </div>
        <h1 className="mb-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Log in to your account
        </h1>
        <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
          Continue your learning progress on LearnTrack AI.
        </p>

        {serverError && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300">
            <AlertCircle size={16} className="shrink-0 text-rose-500" />
            <span>{serverError}</span>
          </div>
        )}

        <FieldLabel>Email</FieldLabel>
        <TextField
          icon={Mail}
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setServerError(""); setErrors({}); }}
          error={errors.email}
        />

        <PasswordField
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => { setPassword(e.target.value); setServerError(""); setErrors({}); }}
          error={errors.password}
        />

        <div className="mb-6 flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <input type="checkbox" className="h-3.5 w-3.5 accent-brand-600" />
            Remember me
          </label>
          <button
            type="button"
            onClick={() => navigate("/forgot-password")}
            className="font-semibold text-brand-600 dark:text-brand-400"
          >
            Forgot password?
          </button>
        </div>

        <PrimaryButton type="submit" disabled={submitting}>
          {submitting ? "Logging in..." : <> Log In <ArrowRight size={15} /></>}
        </PrimaryButton>

        <p className="mt-5 text-center text-xs text-slate-500 dark:text-slate-400">
          Don&apos;t have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="font-semibold text-brand-600 dark:text-brand-400"
          >
            Register
          </button>
        </p>
      </form>
    </AuthShell>
  );
}

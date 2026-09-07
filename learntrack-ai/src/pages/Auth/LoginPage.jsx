import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Mail } from "lucide-react";
import AuthShell from "../../components/auth/AuthShell";
import {
  SampleBadge,
  FieldLabel,
  TextField,
  PasswordField,
  PrimaryButton,
} from "../../components/auth/FormFields";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const next = {};
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Enter a valid email address.";
    if (password.length < 6) next.password = "Password must be at least 6 characters.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // TODO(backend): replace with real POST /api/auth/login once Phase 2 lands.
      navigate("/learning-spaces");
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
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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

        <PrimaryButton type="submit">
          Log In <ArrowRight size={15} />
        </PrimaryButton>

        <p className="mt-5 text-center text-xs text-slate-500 dark:text-slate-400">
          Don't have an account?{" "}
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

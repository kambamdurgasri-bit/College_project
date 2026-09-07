import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Mail, MailCheck } from "lucide-react";
import AuthShell from "../../components/auth/AuthShell";
import {
  SampleBadge,
  FieldLabel,
  TextField,
  PrimaryButton,
} from "../../components/auth/FormFields";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }
    setError("");
    // TODO(backend): replace with real POST /api/auth/forgot-password once Phase 2 lands.
    setSent(true);
  };

  return (
    <AuthShell>
      {sent ? (
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-100 dark:bg-brand-500/15">
            <MailCheck size={26} className="text-brand-600 dark:text-brand-400" />
          </div>
          <h1 className="mb-1 text-xl font-bold text-slate-900 dark:text-white">
            Check your email
          </h1>
          <p className="mb-6 max-w-xs text-sm text-slate-500 dark:text-slate-400">
            If an account exists for{" "}
            <b className="text-slate-900 dark:text-white">{email}</b>, a
            password reset link has been sent.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-1.5 text-xs font-semibold text-brand-600 dark:text-brand-400"
          >
            <ArrowLeft size={13} /> Back to log in
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="mb-4 flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400"
          >
            <ArrowLeft size={13} /> Back to log in
          </button>

          <div className="mb-1 flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Reset password
            </span>
            <SampleBadge />
          </div>
          <h1 className="mb-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Forgot your password?
          </h1>
          <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
            Enter the email linked to your account and we'll send a reset
            link.
          </p>

          <FieldLabel>Email</FieldLabel>
          <TextField
            icon={Mail}
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={error}
          />

          <PrimaryButton type="submit">
            Send Reset Link <ArrowRight size={15} />
          </PrimaryButton>
        </form>
      )}
    </AuthShell>
  );
}

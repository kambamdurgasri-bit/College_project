import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Mail, MailCheck, Key, Lock } from "lucide-react";
import AuthShell from "../../components/auth/AuthShell";
import { apiRequest } from "../../services/api";
import {
  SampleBadge,
  FieldLabel,
  TextField,
  PrimaryButton,
} from "../../components/auth/FormFields";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  
  // 'email', 'otp', 'success'
  const [step, setStep] = useState("email"); 
  const [submitting, setSubmitting] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      await apiRequest("/auth/forgot-password", {
        method: "POST",
        body: { email },
      });
      setStep("otp");
    } catch (err) {
      setError(err.message || "Failed to send OTP.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!otp) {
      setError("Enter the OTP.");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      await apiRequest("/auth/reset-password", {
        method: "POST",
        body: { token: otp, password: newPassword },
      });
      setStep("success");
    } catch (err) {
      setError(err.message || "Failed to reset password.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell>
      {step === "success" && (
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-100 dark:bg-brand-500/15">
            <MailCheck size={26} className="text-brand-600 dark:text-brand-400" />
          </div>
          <h1 className="mb-1 text-xl font-bold text-slate-900 dark:text-white">
            Password reset successful
          </h1>
          <p className="mb-6 max-w-xs text-sm text-slate-500 dark:text-slate-400">
            Your password has been successfully updated. You can now log in with your new password.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-1.5 text-xs font-semibold text-brand-600 dark:text-brand-400"
          >
            <ArrowLeft size={13} /> Back to log in
          </button>
        </div>
      )}
      
      {step === "otp" && (
        <form onSubmit={handleResetPassword}>
          <button
            type="button"
            onClick={() => setStep("email")}
            className="mb-4 flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400"
          >
            <ArrowLeft size={13} /> Back
          </button>

          <h1 className="mb-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Enter OTP & New Password
          </h1>
          <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
            We sent a 6-digit OTP to <b className="text-slate-900 dark:text-white">{email}</b>.
          </p>

          <FieldLabel>OTP</FieldLabel>
          <TextField
            icon={Key}
            type="text"
            placeholder="123456"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            error={error && error.toLowerCase().includes("otp") ? error : ""}
          />
          
          <div className="mt-4"></div>
          <FieldLabel>New Password</FieldLabel>
          <TextField
            icon={Lock}
            type="password"
            placeholder="••••••••"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            error={error && error.toLowerCase().includes("password") ? error : (!error.toLowerCase().includes("otp") && error ? error : "")}
          />

          <PrimaryButton type="submit" disabled={submitting}>
            Reset Password <ArrowRight size={15} />
          </PrimaryButton>
        </form>
      )}
      
      {step === "email" && (
        <form onSubmit={handleSendOtp}>
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
            Enter the email linked to your account and we'll send a 6-digit OTP.
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

          <PrimaryButton type="submit" disabled={submitting}>
            Send OTP <ArrowRight size={15} />
          </PrimaryButton>
        </form>
      )}
    </AuthShell>
  );
}

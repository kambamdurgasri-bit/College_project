import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Mail,
  KeyRound,
  CheckCircle2,
  Clock,
  RotateCw,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";
import AuthShell from "../../components/auth/AuthShell";
import { apiRequest } from "../../services/api";
import {
  SampleBadge,
  FieldLabel,
  TextField,
  PasswordField,
  PrimaryButton,
} from "../../components/auth/FormFields";

/**
 * Partially masks an email address for privacy.
 * Example: "o211064@rguktong.ac.in" -> "o*****4@rguktong.ac.in"
 */
function maskEmail(email) {
  if (!email || !email.includes("@")) return email;
  const [local, domain] = email.split("@");
  if (local.length <= 2) {
    return `${local[0]}*@${domain}`;
  }
  const maskedLocal = `${local[0]}${"*".repeat(Math.min(local.length - 2, 5))}${local[local.length - 1]}`;
  return `${maskedLocal}@${domain}`;
}

/**
 * Formats seconds into mm:ss
 */
function formatTime(totalSeconds) {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export default function ForgotPasswordPage() {
  const navigate = useNavigate();

  // Workflow steps: 'email' -> 'otp' -> 'reset' -> 'success'
  const [step, setStep] = useState("email");

  // Form states
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Feedback states
  const [error, setError] = useState("");
  const [successInfo, setSuccessInfo] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [slowRequest, setSlowRequest] = useState(false);

  // Timers: 60s resend cooldown & 300s (5m) OTP expiry
  const [resendCooldown, setResendCooldown] = useState(60);
  const [expiryCountdown, setExpiryCountdown] = useState(300);

  const resendTimerRef = useRef(null);
  const expiryTimerRef = useRef(null);

  // Clear timers on unmount
  useEffect(() => {
    return () => {
      clearInterval(resendTimerRef.current);
      clearInterval(expiryTimerRef.current);
    };
  }, []);

  // Manage timers when entering 'otp' step
  useEffect(() => {
    if (step === "otp") {
      setResendCooldown(60);
      setExpiryCountdown(300);

      clearInterval(resendTimerRef.current);
      resendTimerRef.current = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(resendTimerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      clearInterval(expiryTimerRef.current);
      expiryTimerRef.current = setInterval(() => {
        setExpiryCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(expiryTimerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(resendTimerRef.current);
      clearInterval(expiryTimerRef.current);
    }
  }, [step]);

  // Step 1: Send OTP to email
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    const cleanEmail = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");
    setSuccessInfo("");
    setSubmitting(true);
    setSlowRequest(false);
    const slowTimer = setTimeout(() => setSlowRequest(true), 3000);

    try {
      const data = await apiRequest("/auth/forgot-password", {
        method: "POST",
        body: { email: cleanEmail },
      });
      if (data?.devOtp) {
        // Local dev: show OTP directly (email not configured)
        setStep("otp");
        setSuccessInfo(
          `Development OTP: ${data.devOtp}. Email delivery failed: ${data.deliveryError || "check the backend logs."}`
        );
        setOtp(data.devOtp);
      } else {
        // Production (sent: true) or production email-failed (sent: false, no devOtp):
        // Always advance to OTP step — OTP was created in DB and the user may
        // still receive the email asynchronously, or should check spam.
        setStep("otp");
        if (data?.sent === false) {
          setSuccessInfo(
            `A verification code was generated for ${maskEmail(cleanEmail)}. ` +
            `Email delivery encountered an issue — check your inbox & spam, or contact support.`
          );
        } else {
          setSuccessInfo(
            `If an account exists for ${maskEmail(cleanEmail)}, a 6-digit code will arrive shortly. Check spam/junk if you don't see it.`
          );
        }
      }
    } catch (err) {
      // Handle rate-limit (cooldown) gracefully
      if (err.message && err.message.toLowerCase().includes("wait")) {
        setError(err.message);
      } else {
        setError(err.message || "Failed to send OTP. Please try again.");
      }
    } finally {
      clearTimeout(slowTimer);
      setSlowRequest(false);
      setSubmitting(false);
    }
  };

  // Step 2: Resend OTP
  const handleResendOtp = async () => {
    if (resendCooldown > 0 || submitting) return;
    setError("");
    setSuccessInfo("");
    setSubmitting(true);

    try {
      const data = await apiRequest("/auth/resend-otp", {
        method: "POST",
        body: { email: email.trim() },
      });

      setOtp("");
      setExpiryCountdown(300);

      if (data?.devOtp) {
        // Local dev
        setSuccessInfo(
          `Development OTP: ${data.devOtp}. Email delivery failed: ${data.deliveryError || "check the backend logs."}`
        );
        setOtp(data.devOtp);
      } else if (data?.sent === false) {
        // Production email failed — OTP was still re-created in DB
        setSuccessInfo(
          "A new verification code was generated. Email delivery encountered an issue — check your inbox & spam."
        );
      } else {
        setSuccessInfo("If an account exists for that email, a new verification code will arrive shortly.");
      }

      // Restart resend timer (60 s)
      setResendCooldown(60);
      clearInterval(resendTimerRef.current);
      resendTimerRef.current = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(resendTimerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Restart expiry timer (5 min)
      clearInterval(expiryTimerRef.current);
      expiryTimerRef.current = setInterval(() => {
        setExpiryCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(expiryTimerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      // Backend returns 429 with a human-readable cooldown message — surface it directly
      setError(err.message || "Failed to resend OTP. Please wait and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Step 3: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const cleanOtp = otp.trim();

    if (!cleanOtp || cleanOtp.length !== 6 || !/^\d{6}$/.test(cleanOtp)) {
      setError("Please enter the complete 6-digit verification code.");
      return;
    }

    if (expiryCountdown <= 0) {
      setError("Your OTP has expired. Please click 'Resend OTP' to request a new code.");
      return;
    }

    setError("");
    setSuccessInfo("");
    setSubmitting(true);

    try {
      const res = await apiRequest("/auth/verify-otp", {
        method: "POST",
        body: { email: email.trim(), otp: cleanOtp },
      });

      if (res?.resetToken) {
        setResetToken(res.resetToken);
        setStep("reset");
        setSuccessInfo("OTP verified successfully. Now create a new password.");
      } else {
        throw new Error("Missing reset authorization token from server.");
      }
    } catch (err) {
      setError(err.message || "Invalid OTP code. Please check and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Step 4: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    setSuccessInfo("");
    setSubmitting(true);

    try {
      await apiRequest("/auth/reset-password", {
        method: "POST",
        body: {
          email: email.trim(),
          resetToken,
          password: newPassword,
        },
      });
      setStep("success");
    } catch (err) {
      setError(err.message || "Failed to reset password. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell>
      {/* ============================================================== */}
      {/* STEP 4: SUCCESS CONFIRMATION SCREEN                           */}
      {/* ============================================================== */}
      {step === "success" && (
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
            <CheckCircle2 size={36} />
          </div>
          <h1 className="mb-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Password Reset Successful
          </h1>
          <p className="mb-8 max-w-sm text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            Your password has been securely updated. You can now log in with your new credentials.
          </p>
          <PrimaryButton onClick={() => navigate("/login")}>
            Back to Log In <ArrowRight size={15} />
          </PrimaryButton>
        </div>
      )}

      {/* ============================================================== */}
      {/* STEP 3: NEW PASSWORD & CONFIRM PASSWORD SCREEN                */}
      {/* ============================================================== */}
      {step === "reset" && (
        <form onSubmit={handleResetPassword}>
          <button
            type="button"
            onClick={() => setStep("otp")}
            className="mb-4 flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            <ArrowLeft size={13} /> Back
          </button>

          <div className="mb-1 flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Security Step 3 of 3
            </span>
            <SampleBadge text="Verified" />
          </div>
          <h1 className="mb-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Set New Password
          </h1>
          <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
            Create a strong password with at least 8 characters.
          </p>

          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300">
              <AlertCircle size={16} className="shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          <PasswordField
            label="New Password"
            placeholder="At least 8 characters"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <PasswordField
            label="Confirm New Password"
            placeholder="Re-enter your new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <PrimaryButton type="submit" disabled={submitting}>
            {submitting ? "Updating Password..." : <>Reset Password <ArrowRight size={15} /></>}
          </PrimaryButton>
        </form>
      )}

      {/* ============================================================== */}
      {/* STEP 2: 6-DIGIT OTP VERIFICATION SCREEN                       */}
      {/* ============================================================== */}
      {step === "otp" && (
        <form onSubmit={handleVerifyOtp}>
          <button
            type="button"
            onClick={() => setStep("email")}
            className="mb-4 flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            <ArrowLeft size={13} /> Back to email
          </button>

          <div className="mb-1 flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Security Step 2 of 3
            </span>
            <SampleBadge
              text={successInfo.startsWith("Development OTP") ? "Development mode" : "OTP requested"}
            />
          </div>
          <h1 className="mb-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Verify Your Email
          </h1>
          <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
            Enter the 6-digit OTP sent to your email or shown for local development.{" "}
            <strong className="text-slate-900 dark:text-white">{maskEmail(email)}</strong>.
          </p>

          {/* Countdown & Expiry Banner */}
          <div className="mb-5 flex items-center justify-between rounded-xl bg-slate-50 px-3.5 py-2.5 text-xs text-slate-600 dark:bg-surface-dark dark:text-slate-300">
            <div className="flex items-center gap-1.5">
              <Clock size={14} className={expiryCountdown < 60 ? "text-rose-500" : "text-brand-600 dark:text-brand-400"} />
              <span>
                {expiryCountdown > 0 ? (
                  <>Expires in: <strong className="font-mono text-slate-900 dark:text-white">{formatTime(expiryCountdown)}</strong></>
                ) : (
                  <span className="font-semibold text-rose-500">OTP Expired</span>
                )}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              <ShieldCheck size={13} className="text-emerald-500" />
              <span>5 min limit</span>
            </div>
          </div>

          {error && (
            <div className="mb-4 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300">
              <AlertCircle size={16} className="mt-0.5 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          {successInfo && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300">
              <CheckCircle2 size={16} className="shrink-0 text-emerald-500" />
              <span>{successInfo}</span>
            </div>
          )}

          <FieldLabel>6-Digit OTP</FieldLabel>
          <TextField
            icon={KeyRound}
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="• • • • • •"
            value={otp}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "").slice(0, 6);
              setOtp(val);
              if (error) setError("");
            }}
            className="text-center font-mono text-lg tracking-[0.35em]"
          />

          <PrimaryButton type="submit" disabled={submitting || otp.length !== 6 || expiryCountdown <= 0}>
            {submitting ? "Verifying OTP..." : <>Verify OTP <ArrowRight size={15} /></>}
          </PrimaryButton>

          {/* Resend Option with 60s cooldown */}
          <div className="mt-5 text-center text-xs">
            {resendCooldown > 0 ? (
              <span className="text-slate-400">
                Resend OTP in <strong className="font-mono text-slate-600 dark:text-slate-300">{resendCooldown}s</strong>
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={submitting}
                className="inline-flex items-center gap-1.5 font-semibold text-brand-600 hover:underline dark:text-brand-400"
              >
                <RotateCw size={12} className={submitting ? "animate-spin" : ""} />
                Resend OTP
              </button>
            )}
          </div>
        </form>
      )}

      {/* ============================================================== */}
      {/* STEP 1: ENTER EMAIL TO REQUEST OTP                            */}
      {/* ============================================================== */}
      {step === "email" && (
        <form onSubmit={handleSendOtp}>
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="mb-4 flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            <ArrowLeft size={13} /> Back to log in
          </button>

          <div className="mb-1 flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Reset password
            </span>
            <SampleBadge text="Email verification" />
          </div>
          <h1 className="mb-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Forgot your password?
          </h1>
          <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
            Enter your registered email address and we will send a 6-digit OTP code to verify your account.
          </p>

          {error && (
            <div className="mb-4 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300">
              <AlertCircle size={16} className="mt-0.5 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          <FieldLabel>Registered Email</FieldLabel>
          <TextField
            icon={Mail}
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError("");
            }}
          />

          <PrimaryButton type="submit" disabled={submitting}>
            {submitting ? "Sending verification code..." : <>Send OTP <ArrowRight size={15} /></>}
          </PrimaryButton>

          {/* Quick link in case email arrived before network completes */}
          <div className="mt-3 text-center">
            <button
              type="button"
              onClick={() => {
                if (email.trim()) {
                  setStep("otp");
                } else {
                  setError("Please enter your registered email address first.");
                }
              }}
              className="text-xs font-medium text-brand-600 hover:underline dark:text-brand-400"
            >
              Already received your 6-digit code? <b>Enter OTP here &rarr;</b>
            </button>
          </div>

          {slowRequest && (
            <p className="mt-3 text-center text-xs text-slate-400">
              ⏳ Connecting to server, please wait a moment…
            </p>
          )}

          <div className="mt-6 border-t border-slate-100 pt-4 text-center dark:border-slate-800">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Remember your password?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="font-semibold text-brand-600 hover:underline dark:text-brand-400"
              >
                Log In
              </button>
            </p>
          </div>
        </form>
      )}
    </AuthShell>
  );
}

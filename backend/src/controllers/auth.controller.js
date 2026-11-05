import {
  findUserByEmail,
  createUser,
  verifyPassword,
  generateToken,
  createPasswordResetOtp,
  verifyPasswordResetOtp,
  resetUserPassword,
} from '../services/auth.service.js';
import { sendPasswordResetEmail } from '../services/email.service.js';

function isValidEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export async function register(req, res) {
  try {
    const { name, email, password, phoneNumber } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'name, email, and password are required' });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const existing = await findUserByEmail(cleanEmail);
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const user = await createUser({
      name: name.trim(),
      email: cleanEmail,
      password,
      phoneNumber,
    });
    const token = generateToken(user);
    const { passwordHash, ...safeUser } = user;

    return res.status(201).json({ user: safeUser, token });
  } catch (err) {
    console.error('[auth.register]', err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'email and password are required' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await findUserByEmail(cleanEmail);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(user);
    const { passwordHash, ...safeUser } = user;

    return res.status(200).json({ user: safeUser, token });
  } catch (err) {
    console.error('[auth.login]', err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}

export async function me(req, res) {
  try {
    const user = await findUserByEmail(req.user.email);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const { passwordHash, ...safeUser } = user;
    return res.status(200).json({ user: safeUser });
  } catch (err) {
    console.error('[auth.me]', err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}

/**
 * Step 1 & 2: Handles Forgot Password request & generates cryptographically secure OTP.
 * Prevents account enumeration by returning a generic response for non-existent emails.
 * Dispatches OTP through the configured transactional email provider.
 */
export async function forgotPassword(req, res) {
  try {
    const { email } = req.body;

    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ error: 'A valid email address is required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const otpResult = await createPasswordResetOtp(cleanEmail);

    if (otpResult.cooldown) {
      return res.status(429).json({
        error: otpResult.message,
        waitSeconds: otpResult.waitSeconds,
      });
    }

    if (otpResult.userFound && otpResult.otp) {
      let emailResult = { sent: false };
      try {
        emailResult = await sendPasswordResetEmail(otpResult.user.email, otpResult.otp);
      } catch (emailErr) {
        console.error('[auth.forgotPassword] Email dispatch error:', emailErr.message || emailErr);
        emailResult = { sent: false, error: emailErr.message };
      }

      // Treat missing NODE_ENV as production on Render to prevent OTP leakage
      const isProduction = process.env.NODE_ENV === 'production' || !process.env.NODE_ENV;
      const isDev = !isProduction;

      if (emailResult?.sent) {
        // Email delivered successfully — generic response always
        return res.status(200).json({
          message: 'If an account exists for that email, a password reset OTP has been sent.',
          sent: true,
        });
      }

      if (isDev) {
        // Local development only: expose OTP in response for testing
        return res.status(200).json({
          message: 'If an account exists for that email, a password reset OTP has been sent.',
          sent: false,
          devOtp: otpResult.otp,
          deliveryError: emailResult.error || 'Email delivery is not configured.',
        });
      }

      // Production: email failed — log it but still return generic message
      // so the user can retry. Don't block the flow — OTP was created in DB.
      console.error('[auth.forgotPassword] Email delivery failed in production:', emailResult.error);
      return res.status(200).json({
        message: 'If an account exists for that email, a password reset OTP has been sent.',
        sent: false,
        emailError: 'Email delivery failed. Please check server logs or try again.',
      });
    } else {
      console.warn(`[auth.forgotPassword] Request for unverified email: ${cleanEmail}`);
    }

    // Generic response to prevent email enumeration
    return res.status(200).json({
      message: 'If an account exists for that email, a password reset OTP has been sent.',
    });
  } catch (err) {
    console.error('[auth.forgotPassword]', err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}

/**
 * Diagnostic endpoint that reports provider status without exposing credentials or addresses.
 */
export async function emailStatus(req, res) {
  const brevoKey = (process.env.BREVO_API_KEY || process.env.SENDINBLUE_API_KEY || '').trim();
  const smtpUser = (process.env.SMTP_EMAIL || process.env.GMAIL_USER || '').trim();
  const configuredSender = (process.env.BREVO_SENDER_EMAIL || '').trim();

  let apiKeyAccepted = null;
  let activeSenderAvailable = null;
  let configuredSenderVerified = null;
  let brevoStatus = null;
  let requestFailed = false;
  if (brevoKey) {
    try {
      const resp = await fetch('https://api.brevo.com/v3/senders', {
        headers: { 'api-key': brevoKey, accept: 'application/json' },
      });
      const data = await resp.json().catch(() => ({}));
      apiKeyAccepted = resp.ok;
      brevoStatus = resp.ok ? null : resp.status;
      const senders = Array.isArray(data.senders) ? data.senders : [];
      activeSenderAvailable = senders.some((sender) => sender.active && sender.email);
      configuredSenderVerified = configuredSender
        ? senders.some(
            (sender) => sender.active && sender.email?.toLowerCase() === configuredSender.toLowerCase(),
          )
        : null;
    } catch {
      apiKeyAccepted = false;
      requestFailed = true;
    }
  }

  return res.status(200).json({
    timestamp: new Date().toISOString(),
    brevo: {
      configured: Boolean(brevoKey),
      senderConfigured: Boolean(configuredSender),
      apiKeyAccepted,
      status: brevoStatus,
      requestFailed,
      activeSenderAvailable,
      configuredSenderVerified,
    },
    smtp: {
      configured: Boolean(smtpUser && (process.env.SMTP_APP_PASSWORD || process.env.GMAIL_APP_PASSWORD)),
      note: 'Render Free tier blocks outbound SMTP ports 25, 465, 587. Brevo HTTP API is required.',
    },
  });
}

/**
 * Step 4: Verifies the 6-digit OTP against the stored hash.
 * Enforces maximum 5 attempts, validates expiration (5 min), and returns a short-lived resetToken.
 */
export async function verifyOtp(req, res) {
  try {
    const { email, otp } = req.body;

    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ error: 'A valid email address is required.' });
    }
    if (!otp || String(otp).trim().length !== 6) {
      return res.status(400).json({ error: 'Please enter a valid 6-digit OTP code.' });
    }

    const result = await verifyPasswordResetOtp(email, String(otp).trim());
    if (!result.success) {
      return res.status(result.status || 400).json({ error: result.error });
    }

    return res.status(200).json({
      message: 'OTP verified successfully.',
      resetToken: result.resetToken,
    });
  } catch (err) {
    console.error('[auth.verifyOtp]', err);
    return res.status(500).json({ error: 'Verification failed. Please try again.' });
  }
}

/**
 * Step 5: Completes the password reset using the server-verified reset authorization token.
 * Validates token, hashes password using bcrypt, and invalidates all reset records.
 */
export async function resetPassword(req, res) {
  try {
    const { email, resetToken, password } = req.body;

    if (!email || !resetToken || !password) {
      return res.status(400).json({ error: 'Email, reset token, and new password are required.' });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
    }

    const result = await resetUserPassword({
      email,
      resetToken,
      newPassword: password,
    });

    if (!result.success) {
      return res.status(result.status || 400).json({ error: result.error });
    }

    return res.status(200).json({ message: 'Password updated successfully.' });
  } catch (err) {
    console.error('[auth.resetPassword]', err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}

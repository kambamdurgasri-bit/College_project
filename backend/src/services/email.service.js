import nodemailer from "nodemailer";

let cachedTransporter = null;

/**
 * Returns a configured Nodemailer transporter for Gmail SMTP.
 * Note: Render's Free tier blocks outbound SMTP ports 25, 465, and 587.
 * Nodemailer is kept for local development or paid server deployments.
 */
export function getEmailTransporter() {
  if (cachedTransporter) {
    return cachedTransporter;
  }

  const user = (process.env.SMTP_EMAIL || process.env.GMAIL_USER || "").trim();
  const rawPass = (process.env.SMTP_APP_PASSWORD || process.env.GMAIL_APP_PASSWORD || "");
  const pass = rawPass.replace(/["'\s]/g, "");

  if (!user || !pass) {
    return null;
  }

  cachedTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user,
      pass,
    },
  });

  return cachedTransporter;
}

let cachedBrevoSender = null;

async function resolveBrevoSender(apiKey) {
  if (process.env.BREVO_SENDER_EMAIL) {
    return {
      email: process.env.BREVO_SENDER_EMAIL.trim(),
      name: (process.env.BREVO_SENDER_NAME || "LearnTrack AI").trim(),
    };
  }

  if (cachedBrevoSender) {
    return cachedBrevoSender;
  }

  try {
    const resp = await fetch("https://api.brevo.com/v3/senders", {
      headers: { "api-key": apiKey, accept: "application/json" },
    });
    if (resp.ok) {
      const data = await resp.json();
      if (Array.isArray(data.senders) && data.senders.length > 0) {
        const active = data.senders.find((s) => s.active) || data.senders[0];
        if (active?.email) {
          cachedBrevoSender = {
            email: active.email,
            name: process.env.BREVO_SENDER_NAME || active.name || "LearnTrack AI",
          };
          return cachedBrevoSender;
        }
      }
    }
  } catch (err) {
    console.warn("[email] Could not fetch verified Brevo senders:", err.message);
  }

  return {
    email: (process.env.BREVO_SENDER_EMAIL || process.env.SMTP_EMAIL || process.env.GMAIL_USER || "rguktapinfo@gmail.com").trim(),
    name: (process.env.BREVO_SENDER_NAME || "LearnTrack AI").trim(),
  };
}

/**
 * Sends transactional email using Brevo (Sendinblue) HTTP API over HTTPS (Port 443).
 * Port 443 is NEVER blocked by Render or other cloud providers.
 */
async function sendViaBrevo({ to, otp, subject, htmlContent }) {
  const apiKey = (process.env.BREVO_API_KEY || process.env.SENDINBLUE_API_KEY || "").trim();
  if (!apiKey) {
    return null;
  }

  const sender = await resolveBrevoSender(apiKey);

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "accept": "application/json",
      "api-key": apiKey,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      sender: { name: sender.name, email: sender.email },
      to: [{ email: to.trim() }],
      subject,
      htmlContent,
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data?.message || `Brevo API error HTTP ${response.status}`;
    throw new Error(errorMsg);
  }

  console.log(`[email] Password reset OTP sent successfully via Brevo from verified sender <${sender.email}> to: ${to} (MessageId: ${data?.messageId || "ok"})`);
  return { sent: true, provider: "brevo", sender: sender.email, data };
}

/**
 * Builds HTML template for the 6-digit OTP email.
 */
function buildOtpHtml(otp) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset OTP</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f4f4f7; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 520px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 14px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
          <!-- Header with Brand Gradient -->
          <tr>
            <td style="background: linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%); padding: 32px 36px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 26px; font-weight: 800; letter-spacing: -0.5px;">LearnTrack AI</h1>
              <p style="margin: 6px 0 0; color: #DDD6FE; font-size: 13px; font-weight: 500;">Your Intelligent Learning Companion</p>
            </td>
          </tr>
          <!-- Body Content -->
          <tr>
            <td style="padding: 36px 36px 28px;">
              <h2 style="margin: 0 0 12px; color: #0f172a; font-size: 20px; font-weight: 700;">Password Reset Verification</h2>
              <p style="margin: 0 0 20px; color: #475569; font-size: 14px; line-height: 1.6;">
                We received a request to reset your password for your <strong>LearnTrack AI</strong> account. Use the 6-digit One-Time Password (OTP) below to complete your verification:
              </p>
              
              <!-- OTP Box -->
              <div style="background-color: #F5F3FF; border: 2px dashed #8B5CF6; border-radius: 12px; padding: 22px; text-align: center; margin: 24px 0;">
                <span style="font-family: 'Courier New', Courier, monospace; font-size: 38px; font-weight: 800; color: #6D28D9; letter-spacing: 12px; display: inline-block;">
                  ${otp}
                </span>
              </div>

              <!-- Expiry Notice -->
              <p style="margin: 0 0 20px; color: #64748b; font-size: 13px; line-height: 1.5; text-align: center;">
                ⏱️ This code will expire in <strong style="color: #0f172a;">5 minutes</strong>.
              </p>

              <!-- Security Warning -->
              <div style="background-color: #FEF2F2; border-left: 4px solid #EF4444; border-radius: 6px; padding: 14px 16px; margin: 24px 0 16px;">
                <p style="margin: 0; color: #991B1B; font-size: 12px; line-height: 1.5; font-weight: 600;">
                   Security Notice: Never share this OTP with anyone. LearnTrack AI representatives will never ask for your verification code. If you did not make this request, you can safely ignore this email.
                </p>
              </div>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 20px 36px; text-align: center; border-top: 1px solid #f1f5f9;">
              <p style="margin: 0; color: #94a3b8; font-size: 12px;">
                &copy; 2026 LearnTrack AI. Built for smarter learning.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * Sends a secure password reset OTP.
 * Priority 1: Brevo HTTP API (Port 443 — reliable on Render Free tier)
 * Priority 2: Nodemailer Gmail SMTP (Fallback for local dev)
 * Priority 3: Fallback log for demo / evaluation
 *
 * @param {string} to - Recipient email address
 * @param {string} otp - 6-digit verification code
 * @returns {Promise<{ sent: boolean, provider?: string, info?: any, reason?: string, otp?: string }>}
 */
export async function sendPasswordResetEmail(to, otp) {
  const subject = `${otp} is your LearnTrack AI password reset verification code`;
  const htmlContent = buildOtpHtml(otp);

  // 1. Try Brevo HTTP API (Recommended for Render)
  try {
    const brevoResult = await sendViaBrevo({ to, otp, subject, htmlContent });
    if (brevoResult) {
      return brevoResult;
    }
  } catch (brevoErr) {
    console.error(`[email] Brevo API failed: ${brevoErr.message}. Attempting SMTP fallback...`);
  }

  // 2. Try Nodemailer SMTP (Works locally or on paid servers)
  const transporter = getEmailTransporter();
  const senderEmail = (process.env.SMTP_EMAIL || process.env.GMAIL_USER || "").trim();

  if (transporter && senderEmail) {
    try {
      const mailOptions = {
        from: `"LearnTrack AI" <${senderEmail}>`,
        to: to.trim(),
        subject,
        html: htmlContent,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log(`[email] Password reset OTP sent successfully via Gmail SMTP to: ${to}`);
      return { sent: true, provider: "smtp", info };
    } catch (smtpErr) {
      console.error(`[email] Gmail SMTP failed: ${smtpErr.message}`);
      console.warn(
        `\n================================================================\n` +
        `[email] NOTE: Render Free tier blocks outbound SMTP ports (587, 465).\n` +
        `[email] To send real emails from Render, add BREVO_API_KEY to Render Environment!\n` +
        `[email] Target Email: ${to}\n` +
        `[email] Generated 6-digit OTP for testing: ${otp}\n` +
        `================================================================\n`
      );
      return { sent: false, reason: "SMTP_FAILED", error: smtpErr.message, otp };
    }
  }

  // 3. Fallback when neither is configured
  console.warn(
    `\n================================================================\n` +
    `[email] WARNING: No email service is configured!\n` +
    `[email] On Render Free tier, add BREVO_API_KEY in the Render Environment tab.\n` +
    `[email] Target Email: ${to}\n` +
    `[email] Generated 6-digit OTP for testing: ${otp}\n` +
    `================================================================\n`
  );

  return { sent: false, reason: "NOT_CONFIGURED", otp };
}

import nodemailer from "nodemailer";

// Create Gmail SMTP transporter using App Password (not your account password)
// Setup: https://myaccount.google.com/apppasswords
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,   // your Gmail address e.g. yourapp@gmail.com
    pass: process.env.GMAIL_APP_PASSWORD, // Gmail App Password (16-char, no spaces)
  },
});

export async function sendPasswordResetEmail(to, otp) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.warn(
      "[email] GMAIL_USER or GMAIL_APP_PASSWORD is not configured; password reset email was not sent. OTP:",
      otp
    );
    return null;
  }

  const mailOptions = {
    from: `"LearnTrack AI" <${process.env.GMAIL_USER}>`,
    to,
    subject: "Reset your LearnTrack AI password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #f9f9f9; border-radius: 8px;">
        <h2 style="color: #4f46e5; margin-bottom: 8px;">LearnTrack AI</h2>
        <h3 style="margin-bottom: 16px;">Password Reset Request</h3>
        <p>We received a request to reset your password. Use the OTP below:</p>
        <div style="background: #4f46e5; color: #fff; font-size: 32px; font-weight: bold; letter-spacing: 8px; text-align: center; padding: 16px 24px; border-radius: 8px; margin: 24px 0;">
          ${otp}
        </div>
        <p style="color: #555;">This OTP expires in <strong>1 hour</strong>.</p>
        <p style="color: #555;">If you didn't request a password reset, you can safely ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
        <p style="font-size: 12px; color: #aaa;">LearnTrack AI &mdash; Your personalised learning companion</p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
}

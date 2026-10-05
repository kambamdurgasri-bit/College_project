import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function sendPasswordResetEmail(to, otp) {
  if (!resend) {
    console.warn(
      "[email] RESEND_API_KEY is not configured; password reset email was not sent. OTP:", otp
    );
    return null;
  }

  return resend.emails.send({
    from: "LearnTrack AI <onboarding@resend.dev>",
    to: [to],
    subject: "Reset your LearnTrack AI password",
    html: `
      <p>We received a request to reset your LearnTrack AI password.</p>
      <p>Your password reset OTP is: <strong>${otp}</strong></p>
      <p>This OTP expires in 1 hour. If you didn't request this, you can safely ignore this email.</p>
    `,
  });
}

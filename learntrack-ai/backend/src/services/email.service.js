import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPasswordResetEmail(to, resetLink) {
  return resend.emails.send({
    from: 'LearnTrack AI <onboarding@resend.dev>',
    to: [to],
    subject: 'Reset your LearnTrack AI password',
    html: `
      <p>We received a request to reset your LearnTrack AI password.</p>
      <p><a href="${resetLink}">Click here to reset your password</a></p>
      <p>This link expires in 1 hour. If you didn't request this, you can safely ignore this email.</p>
    `,
  });
}

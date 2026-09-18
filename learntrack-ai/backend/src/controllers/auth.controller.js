import {
  findUserByEmail,
  createUser,
  verifyPassword,
  generateToken,
  createPasswordResetToken,
  findValidResetToken,
  consumeResetToken,
  updateUserPassword,
} from '../services/auth.service.js';
import { sendPasswordResetEmail } from '../services/email.service.js';

function isValidEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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

    const existing = await findUserByEmail(email);
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const user = await createUser({ name, email, password, phoneNumber });
    const token = generateToken(user);

    return res.status(201).json({ user, token });
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

    const user = await findUserByEmail(email);
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

export async function forgotPassword(req, res) {
  try {
    const { email } = req.body;

    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ error: 'A valid email is required' });
    }

    const user = await findUserByEmail(email);

    // Always return the same response, whether or not the email exists —
    // this prevents attackers from using this endpoint to discover which emails are registered.
    if (user) {
      const token = await createPasswordResetToken(user.id);
      const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
      try {
        await sendPasswordResetEmail(user.email, resetLink);
      } catch (emailErr) {
        console.error('[auth.forgotPassword] email send failed', emailErr);
      }
    }

    return res.status(200).json({
      message: 'If an account exists for that email, a password reset link has been sent.',
    });
  } catch (err) {
    console.error('[auth.forgotPassword]', err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}

export async function resetPassword(req, res) {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ error: 'token and password are required' });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    const record = await findValidResetToken(token);
    if (!record) {
      return res.status(400).json({ error: 'This reset link is invalid or has expired' });
    }

    await updateUserPassword(record.userId, password);
    await consumeResetToken(token);

    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('[auth.resetPassword]', err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}

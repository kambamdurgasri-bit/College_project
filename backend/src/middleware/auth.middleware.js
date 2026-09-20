import { verifyToken } from '../services/auth.service.js';

export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }

  const token = authHeader.slice('Bearer '.length);

  try {
    const payload = verifyToken(token);
    req.user = {
      id: Number(payload.id || payload.sub),
      email: payload.email,
    };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

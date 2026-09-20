// === TEMP_AUTH_DISABLED_START ===
// import { verifyToken } from '../services/auth.service.js';
// === TEMP_AUTH_DISABLED_END ===

export function requireAuth(req, res, next) {
  // === TEMP_AUTH_DISABLED_START ===
  // const authHeader = req.headers.authorization;
  //
  // if (!authHeader || !authHeader.startsWith('Bearer ')) {
  //   return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  // }
  //
  // const token = authHeader.slice('Bearer '.length);
  //
  // try {
  //   req.user = verifyToken(token);
  //   next();
  // } catch (err) {
  //   return res.status(401).json({ error: 'Invalid or expired token' });
  // }
  // === TEMP_AUTH_DISABLED_END ===
  req.user = { id: 1 };
  next();
}

import { Router } from 'express';
import { register, login, me, forgotPassword, resetPassword } from '../controllers/auth.controller.js';
// === TEMP_AUTH_DISABLED_START ===
// import { requireAuth } from '../middleware/auth.middleware.js';
// === TEMP_AUTH_DISABLED_END ===

const router = Router();

router.post('/register', register);
router.post('/login', login);
// === TEMP_AUTH_DISABLED_START === router.get('/me', requireAuth, me) replaced to skip the authentication middleware. === TEMP_AUTH_DISABLED_END ===
router.get('/me', me);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;

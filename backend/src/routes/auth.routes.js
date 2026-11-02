import { Router } from 'express';
import {
  register,
  login,
  me,
  forgotPassword,
  verifyOtp,
  resetPassword,
  emailStatus,
} from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/email-status', emailStatus);
router.post('/register', register);
router.post('/login', login);
router.get('/me', requireAuth, me);
router.post('/forgot-password', forgotPassword);
router.post('/resend-otp', forgotPassword);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);

export default router;

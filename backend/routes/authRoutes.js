import express from 'express';
import { register, login, refreshToken, logout, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';
import { registerValidation, loginValidation } from '../utils/validators.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/register', authLimiter, registerValidation, validate, register);
router.post('/login', authLimiter, loginValidation, validate, login);
router.post('/refresh', refreshToken);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

export default router;
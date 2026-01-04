import express from 'express'
const router = express.Router();

import { getMe, loginUser, logout, refreshToken, registerUser } from '../controllers/authController.js'
import { protect } from '../middleware/auth.js'
import { registerValidation, loginValidation, postValidation } from '../utils/validators.js'
import { createPost } from '../controllers/postController.js';

router.post('/register', registerValidation, registerUser);
router.post('/login', loginValidation, loginUser);
router.post('/refresh', refreshToken);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.post('/', protect, postValidation, createPost)
export default router;
import express from 'express';
import { updateProfile, getUserProfile, searchUsers, getSuggestedUsers } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';
import { profileUpdateValidation } from '../utils/validators.js';

const router = express.Router();

router.use(protect);

router.patch('/me', profileUpdateValidation, validate, updateProfile);
router.get('/search', searchUsers);
router.get('/suggested', getSuggestedUsers);
router.get('/:id', getUserProfile);

export default router;
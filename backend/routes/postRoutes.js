import express from 'express'
const router = express.Router();

import { createPost, deletePost, getPost, updatePost } from '../controllers/postController.js';
import { optionalAuth, protect } from '../middleware/auth.js';
import { mongoIdValidation, postValidation } from '../utils/validators.js';

router
    .route('/')
    .post(protect, postValidation, createPost);

router
    .route('/:id')
    .get(optionalAuth, mongoIdValidation, getPost)
    .patch(protect, mongoIdValidation, postValidation, updatePost)
    .delete(protect, mongoIdValidation, deletePost);

// router.post('/:id/like', protect, mongoIdValidation, validate, toggleLike);

// router
//     .route('/:id/comments')
//     .get(mongoIdValidation, paginationValidation, validate, getPostComments)
//     .post(protect, mongoIdValidation, commentValidation, validate, addComment);
export default router;
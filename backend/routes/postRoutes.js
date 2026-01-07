import express from 'express';
import {
    createPost,
    getPosts,
    getDiscoverPosts,
    getPost,
    updatePost,
    deletePost,
    toggleLike,
    addComment,
    getComments
} from '../controllers/postController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';
import { postValidation, commentValidation } from '../utils/validators.js';

const router = express.Router();

router.use(protect);

router.post('/', postValidation, validate, createPost);
router.get('/', getPosts);
router.get('/discover', getDiscoverPosts);
router.get('/:id', getPost);
router.patch('/:id', postValidation, validate, updatePost);
router.delete('/:id', deletePost);
router.post('/:id/like', toggleLike);
router.post('/:id/comment', commentValidation, validate, addComment);
router.get('/:id/comments', getComments);

export default router;
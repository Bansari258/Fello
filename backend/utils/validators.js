import { body, param, query } from 'express-validator'

export const registerValidation = [
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
    body('username').isLength({ min: 3, max: 30 }).matches(/^[a-zA-Z0-9_]+$/).withMessage('Username must be 3-30 characters and contain only letters, numbers, and underscores'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('fullName').trim().notEmpty().withMessage('Full name is required')
]
export const loginValidation = [
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required')
]
export const postValidation = [
    body().custom((value, { req }) => {
        const content = req.body.content;
        const images = req.body.images;
        const hasContent = typeof content === 'string' && content.trim().length > 0;
        const hasImages = Array.isArray(images) && images.length > 0;
        if (!hasContent && !hasImages) {
            throw new Error('Post content is required or at least one image must be provided');
        }
        if (hasContent && content.length > 5000) {
            throw new Error('Post content cannot exceed 5000 characters');
        }
        return true;
    })
]
export const commentValidation = [
    body('content').trim().notEmpty().withMessage('Comment content is required').isLength({ max: 1000 }).withMessage('Comment cannot exceed 1000 characters')
]
export const updateProfileValidation = [
    body('fullName').optional().trim().notEmpty().withMessage('Full name cannot be empty'),
    body('bio').optional().trim().isLength({ max: 500 }).withMessage('Bio cannot exceed 500 characters'),
    body('username').isLength({ min: 3, max: 30 }).matches(/^[a-zA-Z0-9_]+$/).withMessage('Username must be 3-30 characters and contain only letters, numbers, and underscores'),
]
export const paginationValidation = [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
]
export const mongoIdValidation = [
    param('id').isMongoId().withMessage('Invalid ID format')
];
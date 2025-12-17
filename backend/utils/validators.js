import { body, param, query } from 'express-validator'

exports.registerValidation = [
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
    body('username').isLength({ min: 3, max: 30 }).matches(/^[a-zA-Z0-9_]+$/).withMessage('Username must be 3-30 characters and contain only letters, numbers, and underscores'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('fullName').trim().notEmpty().withMessage('Full name is required')
]
exports.loginValidation = [
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required')
]
exports.postValidation = [
    body('content').trim().notEmpty().withMessage('Post content is required').isLength({ max: 5000 }).withMessage('Post content cannot exceed 5000 characters')
]
exports.commentValidation = [
    body('content').trim().notEmpty().withMessage('Comment content is required').isLength({ max: 1000 }).withMessage('Comment cannot exceed 1000 characters')
]
exports.updateProfileValidation = [
    body('fullName').optional().trim().notEmpty().withMessage('Full name cannot be empty'),
    body('bio').optional().trim().isLength({ max: 500 }).withMessage('Bio cannot exceed 500 characters'),
    body('username').isLength({ min: 3, max: 30 }).matches(/^[a-zA-Z0-9_]+$/).withMessage('Username must be 3-30 characters and contain only letters, numbers, and underscores'),
]
exports.paginationValidation = [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
]
exports.mongoIdValidation = [
    param('id').isMongoId().withMessage('Invalid ID format')
];
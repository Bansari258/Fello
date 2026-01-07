import { body } from 'express-validator';

export const registerValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username must be 3-30 characters, alphanumeric and underscore only'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('fullName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name required (2-100 characters)')
];

export const loginValidation = [
  body('emailOrUsername').trim().notEmpty().withMessage('Email or username required'),
  body('password').notEmpty().withMessage('Password required')
];

export const profileUpdateValidation = [
  body('username')
    .optional()
    .trim()
    .isLength({ min: 3, max: 30 })
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username must be 3-30 characters'),
  body('fullName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }),
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 500 })
];

export const postValidation = [
  body('content')
    .trim()
    .isLength({ min: 1, max: 5000 })
    .withMessage('Content required (1-5000 characters)')
];

export const commentValidation = [
  body('content')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Comment required (1-1000 characters)')
];
import { validationResult } from 'express-validator';
import AppError from '../utils/AppError.js';

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const messages = errors.array().map(err => err.msg).join('. ');
    return next(new AppError(messages, 400));
  }
  
  next();
};
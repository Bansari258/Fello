import { verifyAccessToken } from '../utils/jwt.js';
import AppError from '../utils/AppError.js';
import catchAsync from '../utils/catchAsync.js';
import User from '../models/User.js';

export const protect = catchAsync(async (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return next(new AppError('Not authenticated', 401));
  }

  const decoded = verifyAccessToken(token);
  const user = await User.findById(decoded.id).select('-password -refreshToken');

  if (!user) {
    return next(new AppError('User not found', 401));
  }

  req.user = user;
  next();
});
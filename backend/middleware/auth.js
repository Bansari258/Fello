import  {AppError}  from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";
import { verifyAccessToken } from "../utils/jwt.js";
import User from '../models/userModel.js'
export const protect = catchAsync(async (req, res, next) => {
    
    const token = req.cookies.accessToken;
    if (!token) {
        return next(new AppError('You are not logged in. Please log in to get access.', 401));
    }
    let decoded;
    try {
        decoded = verifyAccessToken(token);
    } catch (err) {
        if (err && err.name === 'TokenExpiredError') {
            return res.status(401).json({ status: 'fail', message: 'Access token expired' });
        }
        return res.status(401).json({ status: 'fail', message: 'Invalid token' });
    }
    const currentUser = await User.findById(decoded.id).select('+password');
    if (!currentUser) {
        return next(new AppError('The user belonging to this token no longer exists.', 401));
    }
    if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(new AppError('User recently changed password. Please log in again.', 401));
    }
    if (!currentUser.isActive) {
        return next(new AppError('Your account has been deactivated.', 403));
    }
    req.user = currentUser;
    next();
})

export const optionalAuth = async (req, res, next) => {
    try {
        const token = req.cookies.accessToken;

        if (token) {
            const decoded = verifyAccessToken(token);
            const currentUser = await User.findById(decoded.id);
            if (currentUser && currentUser.isActive) {
                req.user = currentUser;
            }
        }
    } catch (error) {
    
    }
    next();
};
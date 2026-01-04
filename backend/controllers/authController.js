import { AppError } from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";
import User from '../models/userModel.js'
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.js'

export const registerUser = catchAsync(async (req, res, next) => {
    const { email, username, password, fullName } = req.body;
    const existingUser = await User.findOne({ $or: [{ email }, { username }] }).lean();
    if (existingUser) {
        const field = existingUser.email === email ? 'email' : 'username';
        return next(new AppError(`User with this ${field} already exists`, 400));
    }
    const user = await User.create({ email, username, password, fullName });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 15 * 60 * 1000 // 15 minutes
    });

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    user.password = undefined;
    res.status(201).json({
        status: 'success',
        data: {
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
                fullName: user.fullName,
                avatar: user.avatar
            }
        }
    });
})

export const loginUser = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password')
    if (!user || !(await user.comparePassword(password))) {
        return next(new AppError('Incorrect email or password', 401));
    }
    if (!user.isActive) {
        return next(new AppError('Your account has been deactivated', 403));
    }
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    user.refreshToken = refreshToken;
    user.lastLogin = Date.now();
    await user.save({ validateBeforeSave: false });
    user.password = undefined;
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 15 * 60 * 1000 // 15 minutes
    });

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    res.status(200).json({
        status: 'success',
        data: {
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
                fullName: user.fullName,
                avatar: user.avatar,
                bio: user.bio,
                followersCount: user.followersCount,
                followingCount: user.followingCount,
                postsCount: user.postsCount
            },
            accessToken,
            refreshToken
        }
    });
})

export const refreshToken = catchAsync(async (req, res, next) => {
    // accept refresh token from request body or httpOnly cookie
    const token = req.body?.refreshToken || req.cookies?.refreshToken;
    if (!token) {
        return next(new AppError('Refresh token is required', 400));
    }
    const decoded = verifyRefreshToken(token);
    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== token) {
        return next(new AppError('Invalid refresh token', 401));
    }
    if (!user.isActive) {
        return next(new AppError('Your account has been deactivated', 403));
    }
    const newAccessToken = generateAccessToken(user._id);
    res.cookie('accessToken', newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 15 * 60 * 1000 // 15 minutes
    });
    res.status(200).json({
        status: 'success',
        data: {
            accessToken: newAccessToken
        }
    });
})

export const logout = catchAsync(async (req, res, next) => {
    req.user.refreshToken = undefined;
    await req.user.save({ validateBeforeSave: false });
    res.cookie('accessToken', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        expires: new Date(0)
    });

    res.cookie('refreshToken', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        expires: new Date(0)
    });
    res.status(200).json({
        status: 'success',
        message: 'Logged out successfully'
    });
})

export const getMe = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user._id).select('-refreshToken -passwordChangedAt -passwordResetToken -passwordResetExpires');

    res.status(200).json({
        status: 'success',
        data: { user }
    });
})
import User from '../models/User.js';
import AppError from '../utils/AppError.js';
import catchAsync from '../utils/catchAsync.js';
import { generateAccessToken, generateRefreshToken, setTokenCookies, clearTokenCookies, verifyRefreshToken, setAccessTokenCookie } from '../utils/jwt.js';

export const register = catchAsync(async (req, res, next) => {
  const { email, username, password, fullName } = req.body;

  const existingUser = await User.findOne({
    $or: [{ email }, { username }]
  });

  if (existingUser) {
    return next(new AppError('Email or username already exists', 400));
  }

  const user = await User.create({
    email,
    username,
    password,
    fullName
  });

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  setTokenCookies(res, accessToken, refreshToken);


  res.status(201).json({
    status: 'success',
    data: {
      user: {
        _id: user._id,
        id: user._id,
        email: user.email,
        username: user.username,
        fullName: user.fullName,
        avatar: user.avatar,
        bio: user.bio
      }
    }
  });
});

export const login = catchAsync(async (req, res, next) => {
  const { emailOrUsername, password } = req.body;

  const user = await User.findOne({
    $or: [{ email: emailOrUsername }, { username: emailOrUsername }]
  }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    return next(new AppError('Invalid credentials', 401));
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  setTokenCookies(res, accessToken, refreshToken);


  res.json({
    status: 'success',
    data: {
      user: {
        _id: user._id,
        id: user._id,
        email: user.email,
        username: user.username,
        fullName: user.fullName,
        avatar: user.avatar,
        bio: user.bio
      }
    }
  });
});

export const refreshToken = catchAsync(async (req, res, next) => {
  const oldRefreshToken = req.cookies.refreshToken;


  if (!oldRefreshToken) {
    clearTokenCookies(res);
    return next(new AppError('Session expired. Please login again.', 401));
  }

  let decoded;
  try {
    decoded = verifyRefreshToken(oldRefreshToken);
  } catch (error) {
    clearTokenCookies(res);
    return next(new AppError('Session expired. Please login again.', 401));
  }

  const user = await User.findById(decoded.id).select('+refreshToken');

  if (!user) {
    clearTokenCookies(res);
    return next(new AppError('User not found', 401));
  }

  if (user.refreshToken !== oldRefreshToken) {
    user.refreshToken = undefined;
    await user.save({ validateBeforeSave: false });
    clearTokenCookies(res);
    return next(new AppError('Invalid session. Please login again.', 401));
  }

  const newAccessToken = generateAccessToken(user._id);

  setAccessTokenCookie(res, newAccessToken);


  res.json({
    status: 'success',
    message: 'Access token refreshed'
  });
});

export const logout = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  
  if (user) {
    user.refreshToken = undefined;
    await user.save({ validateBeforeSave: false });
  }

  clearTokenCookies(res);

  res.json({
    status: 'success',
    message: 'Logged out successfully'
  });
});

export const getMe = catchAsync(async (req, res, next) => {
  res.json({
    status: 'success',
    data: {
      user: req.user
    }
  });
});
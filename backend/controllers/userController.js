import User from '../models/User.js';
import AppError from '../utils/AppError.js';
import catchAsync from '../utils/catchAsync.js';

export const updateProfile = catchAsync(async (req, res, next) => {
  const { username, fullName, bio, avatar, coverPhoto } = req.body;

  const updates = {};
  if (username) {
    const existingUser = await User.findOne({ username, _id: { $ne: req.user._id } });
    if (existingUser) {
      return next(new AppError('Username already taken', 400));
    }
    updates.username = username;
  }
  if (fullName) updates.fullName = fullName;
  if (bio !== undefined) updates.bio = bio;
  if (avatar !== undefined) updates.avatar = avatar;
  if (coverPhoto !== undefined) updates.coverPhoto = coverPhoto;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    updates,
    { new: true, runValidators: true }
  );

  res.json({
    status: 'success',
    data: { user }
  });
});

export const getUserProfile = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id).select('-password -refreshToken');

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  res.json({
    status: 'success',
    data: { user }
  });
});

export const searchUsers = catchAsync(async (req, res, next) => {
  const { q, page = 1, limit = 20 } = req.query;

  if (!q) {
    return next(new AppError('Search query required', 400));
  }

  const users = await User.find(
    { $text: { $search: q } },
    { score: { $meta: 'textScore' } }
  )
    .select('username fullName avatar followersCount')
    .sort({ score: { $meta: 'textScore' } })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .lean();

  const total = await User.countDocuments({ $text: { $search: q } });

  res.json({
    status: 'success',
    results: users.length,
    data: {
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
});

export const getSuggestedUsers = catchAsync(async (req, res, next) => {
  const { limit = 10 } = req.query;

  const users = await User.find({ _id: { $ne: req.user._id } })
    .select('username fullName avatar followersCount')
    .sort({ followersCount: -1 })
    .limit(parseInt(limit))
    .lean();

  res.json({
    status: 'success',
    results: users.length,
    data: { users }
  });
});
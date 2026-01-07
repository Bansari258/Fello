import Follow from '../models/Follow.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import AppError from '../utils/AppError.js';
import catchAsync from '../utils/catchAsync.js';

export const sendFollowRequest = catchAsync(async (req, res, next) => {
  const { userId } = req.params;

  if (userId === req.user._id.toString()) {
    return next(new AppError('Cannot follow yourself', 400));
  }

  const targetUser = await User.findById(userId);
  if (!targetUser) {
    return next(new AppError('User not found', 404));
  }

  const existingFollow = await Follow.findOne({
    follower: req.user._id,
    following: userId
  });

  if (existingFollow) {
    return next(new AppError('Follow request already exists', 400));
  }

  const status = targetUser.isPrivate ? 'pending' : 'accepted';

  const follow = await Follow.create({
    follower: req.user._id,
    following: userId,
    status
  });

  if (status === 'accepted') {
    await User.findByIdAndUpdate(req.user._id, { $inc: { followingCount: 1 } });
    await User.findByIdAndUpdate(userId, { $inc: { followersCount: 1 } });

    await Notification.create({
      recipient: userId,
      sender: req.user._id,
      type: 'follow'
    });
  } else {
    await Notification.create({
      recipient: userId,
      sender: req.user._id,
      type: 'follow_request'
    });
  }

  res.status(201).json({
    status: 'success',
    data: { follow }
  });
});

export const acceptFollowRequest = catchAsync(async (req, res, next) => {
  const { requestId } = req.params;

  const follow = await Follow.findOne({
    _id: requestId,
    following: req.user._id,
    status: 'pending'
  });

  if (!follow) {
    return next(new AppError('Follow request not found', 404));
  }

  follow.status = 'accepted';
  await follow.save();

  await User.findByIdAndUpdate(follow.follower, { $inc: { followingCount: 1 } });
  await User.findByIdAndUpdate(follow.following, { $inc: { followersCount: 1 } });

  await Notification.create({
    recipient: follow.follower,
    sender: req.user._id,
    type: 'follow'
  });

  res.json({
    status: 'success',
    data: { follow }
  });
});

export const rejectFollowRequest = catchAsync(async (req, res, next) => {
  const { requestId } = req.params;

  const follow = await Follow.findOne({
    _id: requestId,
    following: req.user._id,
    status: 'pending'
  });

  if (!follow) {
    return next(new AppError('Follow request not found', 404));
  }

  await follow.deleteOne();

  res.json({
    status: 'success',
    message: 'Follow request rejected'
  });
});

export const unfollowUser = catchAsync(async (req, res, next) => {
  const { userId } = req.params;

  const follow = await Follow.findOne({
    follower: req.user._id,
    following: userId,
    status: 'accepted'
  });

  if (!follow) {
    return next(new AppError('Not following this user', 404));
  }

  await follow.deleteOne();

  await User.findByIdAndUpdate(req.user._id, { $inc: { followingCount: -1 } });
  await User.findByIdAndUpdate(userId, { $inc: { followersCount: -1 } });

  res.json({
    status: 'success',
    message: 'Unfollowed successfully'
  });
});

export const getFollowRequests = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 20 } = req.query;

  const requests = await Follow.find({
    following: req.user._id,
    status: 'pending'
  })
    .populate('follower', 'username fullName avatar followersCount')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .lean();

  const total = await Follow.countDocuments({
    following: req.user._id,
    status: 'pending'
  });

  res.json({
    status: 'success',
    results: requests.length,
    data: {
      requests,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
});

export const getFollowers = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  const { page = 1, limit = 20 } = req.query;

  const followers = await Follow.find({
    following: userId,
    status: 'accepted'
  })
    .populate('follower', 'username fullName avatar followersCount')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .lean();

  const total = await Follow.countDocuments({
    following: userId,
    status: 'accepted'
  });

  res.json({
    status: 'success',
    results: followers.length,
    data: {
      followers: followers.map(f => f.follower),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
});

export const getFollowing = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  const { page = 1, limit = 20 } = req.query;

  const following = await Follow.find({
    follower: userId,
    status: 'accepted'
  })
    .populate('following', 'username fullName avatar followersCount')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .lean();

  const total = await Follow.countDocuments({
    follower: userId,
    status: 'accepted'
  });

  res.json({
    status: 'success',
    results: following.length,
    data: {
      following: following.map(f => f.following),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
});
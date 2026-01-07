import Notification from '../models/Notification.js';
import AppError from '../utils/AppError.js';
import catchAsync from '../utils/catchAsync.js';

export const getNotifications = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 20 } = req.query;

  const notifications = await Notification.find({ recipient: req.user._id })
    .populate('sender', 'username fullName avatar')
    .populate('post', 'content')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .lean();

  const total = await Notification.countDocuments({ recipient: req.user._id });
  const unreadCount = await Notification.countDocuments({
    recipient: req.user._id,
    isRead: false
  });

  res.json({
    status: 'success',
    results: notifications.length,
    data: {
      notifications,
      unreadCount,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
});

export const markAsRead = catchAsync(async (req, res, next) => {
  const notification = await Notification.findOne({
    _id: req.params.id,
    recipient: req.user._id
  });

  if (!notification) {
    return next(new AppError('Notification not found', 404));
  }

  notification.isRead = true;
  await notification.save();

  res.json({
    status: 'success',
    data: { notification }
  });
});

export const markAllAsRead = catchAsync(async (req, res, next) => {
  await Notification.updateMany(
    { recipient: req.user._id, isRead: false },
    { isRead: true }
  );

  res.json({
    status: 'success',
    message: 'All notifications marked as read'
  });
});
import Post from '../models/Post.js';
import Like from '../models/Like.js';
import Comment from '../models/Comment.js';
import User from '../models/User.js';
import Follow from '../models/Follow.js';
import Notification from '../models/Notification.js';
import AppError from '../utils/AppError.js';
import catchAsync from '../utils/catchAsync.js';

export const createPost = catchAsync(async (req, res, next) => {
  const { content, images } = req.body;

  const post = await Post.create({
    author: req.user._id,
    content,
    images: images || []
  });

  await User.findByIdAndUpdate(req.user._id, { $inc: { postsCount: 1 } });

  await post.populate('author', 'username fullName');

  res.status(201).json({
    status: 'success',
    data: { post }
  });
});

export const getPosts = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 20 } = req.query;

  const following = await Follow.find({
    follower: req.user._id,
    status: 'accepted'
  }).distinct('following');

  following.push(req.user._id);

  const posts = await Post.find({
    author: { $in: following },
    isDeleted: false
  })
    .populate('author', 'username fullName')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .lean();

  const postsWithLikes = await Promise.all(
    posts.map(async (post) => {
      const isLiked = await Like.exists({ post: post._id, user: req.user._id });
      return { ...post, isLiked: !!isLiked };
    })
  );

  const total = await Post.countDocuments({
    author: { $in: following },
    isDeleted: false
  });

  res.json({
    status: 'success',
    results: postsWithLikes.length,
    data: {
      posts: postsWithLikes,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
});

export const getDiscoverPosts = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 20, sort = 'recent' } = req.query;

  let sortOption = { createdAt: -1 };
  if (sort === 'popular') {
    sortOption = { likesCount: -1, createdAt: -1 };
  }

  const posts = await Post.find({ isDeleted: false })
    .populate('author', 'username fullName ')
    .sort(sortOption)
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .lean();

  const postsWithLikes = await Promise.all(
    posts.map(async (post) => {
      const isLiked = await Like.exists({ post: post._id, user: req.user._id });
      return { ...post, isLiked: !!isLiked };
    })
  );

  const total = await Post.countDocuments({ isDeleted: false });

  res.json({
    status: 'success',
    results: postsWithLikes.length,
    data: {
      posts: postsWithLikes,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
});

export const getPost = catchAsync(async (req, res, next) => {
  const post = await Post.findOne({
    _id: req.params.id,
    isDeleted: false
  }).populate('author', 'username fullName ');

  if (!post) {
    return next(new AppError('Post not found', 404));
  }

  const isLiked = await Like.exists({ post: post._id, user: req.user._id });

  res.json({
    status: 'success',
    data: {
      post: {
        ...post.toObject(),
        isLiked: !!isLiked
      }
    }
  });
});

export const updatePost = catchAsync(async (req, res, next) => {
  const { content } = req.body;

  const post = await Post.findOne({
    _id: req.params.id,
    author: req.user._id,
    isDeleted: false
  });

  if (!post) {
    return next(new AppError('Post not found or unauthorized', 404));
  }

  post.content = content;
  await post.save();

  await post.populate('author', 'username fullName ');

  res.json({
    status: 'success',
    data: { post }
  });
});

export const deletePost = catchAsync(async (req, res, next) => {
  const post = await Post.findOne({
    _id: req.params.id,
    author: req.user._id,
    isDeleted: false
  });

  if (!post) {
    return next(new AppError('Post not found or unauthorized', 404));
  }

  post.isDeleted = true;
  await post.save();

  await User.findByIdAndUpdate(req.user._id, { $inc: { postsCount: -1 } });

  res.json({
    status: 'success',
    message: 'Post deleted successfully'
  });
});

export const toggleLike = catchAsync(async (req, res, next) => {
  const post = await Post.findOne({
    _id: req.params.id,
    isDeleted: false
  });

  if (!post) {
    return next(new AppError('Post not found', 404));
  }

  const existingLike = await Like.findOne({
    post: post._id,
    user: req.user._id
  });

  if (existingLike) {
    await existingLike.deleteOne();
    await Post.findByIdAndUpdate(post._id, { $inc: { likesCount: -1 } });

    res.json({
      status: 'success',
      data: { isLiked: false }
    });
  } else {
    await Like.create({
      post: post._id,
      user: req.user._id
    });
    await Post.findByIdAndUpdate(post._id, { $inc: { likesCount: 1 } });

    if (post.author.toString() !== req.user._id.toString()) {
      await Notification.create({
        recipient: post.author,
        sender: req.user._id,
        type: 'like',
        post: post._id
      });
    }

    res.json({
      status: 'success',
      data: { isLiked: true }
    });
  }
});

export const addComment = catchAsync(async (req, res, next) => {
  const { content, parentComment } = req.body;

  const post = await Post.findOne({
    _id: req.params.id,
    isDeleted: false
  });

  if (!post) {
    return next(new AppError('Post not found', 404));
  }

  const comment = await Comment.create({
    post: post._id,
    author: req.user._id,
    content,
    parentComment: parentComment || null
  });

  await Post.findByIdAndUpdate(post._id, { $inc: { commentsCount: 1 } });

  await comment.populate('author', 'username fullName ');

  if (post.author.toString() !== req.user._id.toString()) {
    await Notification.create({
      recipient: post.author,
      sender: req.user._id,
      type: 'comment',
      post: post._id,
      comment: comment._id
    });
  }

  res.status(201).json({
    status: 'success',
    data: { comment }
  });
});

export const getComments = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 20 } = req.query;

  const comments = await Comment.find({
    post: req.params.id,
    parentComment: null
  })
    .populate('author', 'username fullName ')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .lean();

  const total = await Comment.countDocuments({
    post: req.params.id,
    parentComment: null
  });

  res.json({
    status: 'success',
    results: comments.length,
    data: {
      comments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
});
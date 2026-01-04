import Post from "../models/postModel.js";
import catchAsync from "../utils/catchAsync.js";


export const createPost = catchAsync(async (req, res, next) => {
    const { content, images, isPublic = true } = req.body;
    const post = await Post.create({
        author: req.user._id,
        content,
        images: images || [],
        isPublic
    })
    await post.populate('author', 'username fullName');
    res.status(201).json({
        status: 'success',
        data: { post }
    });
})


export const updatePost = catchAsync(async (req, res, next) => {
    const { content, isPublic } = req.body;
    const post = await Post.findOne({
        _id: req.params.id,
        isDeleted: false
    });

    if (!post) {
        return next(new AppError('Post not found', 404));
    }
    if (post.author.toString() !== req.user._id.toString()) {
        return next(new AppError('You do not have permission to update this post', 403));
    }
    if (content) post.content = content;
    if (isPublic !== undefined) post.isPublic = isPublic;
    await post.save();
    await post.populate('author', 'username fullName');
    res.status(200).json({
        status: 'success',
        data: { post }
    });

})

export const deletePost = catchAsync(async (req, res, next) => {
    const post = await Post.findOne({ _id: req.params.id, isDeleted: false })
    if (!post) {
        return next(new AppError('Post not found', 404));
    }
    if (post.author.toString() !== req.user._id.toString()) {
        return next(new AppError('You do not have permission to delete this post', 403));
    }
    post.isDeleted = true;
    await post.save();
    res.status(204).json({
        status: 'success',
        data: null
    });
})

export const getPost = catchAsync(async (req, res, next) => {
    const post = await Post.findOne({ _id: req.params.id, isDeleted: false }).populate('author', 'username fullName');
    if (!post) {
        return next(new AppError('Post not found', 404));
    }
    let isLiked = false;
    if (req.user) {
        const like = await Like.findOne({
            user: req.user._id,
            post: post._id
        }).lean();
        isLiked = !!like;
    }

    res.status(200).json({
        status: 'success',
        data: {
            post: {
                ...post.toObject(),
                isLiked
            }
        }
    });
})

export const getHomeFeed = catchAsync(async (req, res, next) => {

})

export const getDiscoverFeed = catchAsync(async (req, res, next) => {

})
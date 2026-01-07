import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 5000
  },
  images: [{
    type: String
  }],
  likesCount: {
    type: Number,
    default: 0
  },
  commentsCount: {
    type: Number,
    default: 0
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ createdAt: -1 });
postSchema.index({ likesCount: -1, createdAt: -1 });
postSchema.index({ isDeleted: 1 });

postSchema.virtual('likes', {
  ref: 'Like',
  localField: '_id',
  foreignField: 'post'
});

postSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'post'
});

postSchema.set('toJSON', { virtuals: true });
postSchema.set('toObject', { virtuals: true });

const Post = mongoose.model('Post', postSchema);

export default Post;
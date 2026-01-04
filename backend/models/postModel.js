import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Post must have an author'],
    index: true
  },
  content: {
    type: String,
    required: [true, 'Post content is required'],
    maxlength: [5000, 'Post content cannot exceed 5000 characters']
  },
  images: [{
    type: String
  }],
  likesCount: {
    type: Number,
    default: 0,
    min: 0
  },
  commentsCount: {
    type: Number,
    default: 0,
    min: 0
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  isDeleted: {
    type: Boolean,
    default: false,
    select: false
  }


}, { timestamps: true, })
postSchema.index({ author: 1, createdAt: -1 }); // User's posts timeline
postSchema.index({ createdAt: -1, isPublic: 1 }); // Discover feed
postSchema.index({ likesCount: -1, createdAt: -1 }); // Popular posts
postSchema.index({ isDeleted: 1, createdAt: -1 }); // Active posts


// Virtual populate comments
postSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'post'
});

// Increment author's post count
postSchema.pre('save', async function () {
  if (this.isNew) {
    await mongoose.model('User').findByIdAndUpdate(
      this.author,
      { $inc: { postsCount: 1 } }
    );
  }
});

// Decrement author's post count on delete
postSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await mongoose.model('User').findByIdAndUpdate(
      doc.author,
      { $inc: { postsCount: -1 } }
    );
  }
});

const Post = mongoose.model('Post', postSchema);

export default Post;
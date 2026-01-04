import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    }
}, {
    timestamps: true
});
likeSchema.index({ user: 1, post: 1 }, { unique: true });
likeSchema.index({ post: 1, createdAt: -1 }); // For getting post likes

// Update post likes count
likeSchema.post('save', async function() {
  await mongoose.model('Post').findByIdAndUpdate(
    this.post,
    { $inc: { likesCount: 1 } }
  );
});

likeSchema.post('findOneAndDelete', async function(doc) {
  if (doc) {
    await mongoose.model('Post').findByIdAndUpdate(
      doc.post,
      { $inc: { likesCount: -1 } }
    );
  }
});

export const Like = mongoose.model('Like', likeSchema);
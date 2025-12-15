import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: [true, 'Comment must belong to a post'],
        index: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Comment must have an author']
    },
    content: {
        type: String,
        required: [true, 'Comment content is required'],
        maxlength: [1000, 'Comment cannot exceed 1000 characters']
    },
    parentComment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        default: null
    }
}, {
    timestamps: true
});
export const Comment = mongoose.model('Comment', commentSchema);
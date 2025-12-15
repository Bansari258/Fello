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

},{ timestamps: true,})
export const Post = mongoose.model('Post', postSchema);
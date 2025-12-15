import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters'],
        maxlength: [30, 'Username cannot exceed 30 characters']
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        require: [true, "Email is required"],
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
    },
    fullName: {
        type: String,
        required: [true, 'Full name is required'],
        trim: true
    },
    bio: {
        type: String,
        maxlength: [500, 'Bio cannot exceed 500 characters'],
        default: ''
    },
    coverPhoto: {
        type: String,
        default: ''
    },
    followersCount: {
        type: Number,
        default: 0,
        min: 0
    },
    followingCount: {
        type: Number,
        default: 0,
        min: 0
    },
    postsCount: {
        type: Number,
        default: 0,
        min: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: {
        type: Date,
        default: Date.now
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    refreshToken: String,
}, {
    timestamps: true,
});
export const User = mongoose.model('User',userSchema)
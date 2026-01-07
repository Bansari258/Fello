import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 30
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        select: false
    },
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    bio: {
        type: String,
        maxlength: 500,
        default: ''
    },
    avatar: {
        type: String,
        default: ''
    },
    coverPhoto: {
        type: String,
        default: ''
    },
    followersCount: {
        type: Number,
        default: 0
    },
    followingCount: {
        type: Number,
        default: 0
    },
    postsCount: {
        type: Number,
        default: 0
    },
    isPrivate: {
        type: Boolean,
        default: false
    },
    refreshToken: {
        type: String,
        select: false
    }
}, {
    timestamps: true
});

userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ username: 'text', fullName: 'text' });

userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.virtual('posts', {
    ref: 'Post',
    localField: '_id',
    foreignField: 'author'
});

userSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret) => {
        delete ret.password;
        delete ret.refreshToken;
        delete ret.__v;
        return ret;
    }
});

const User = mongoose.model('User', userSchema);

export default User;
import mongoose from "mongoose";

const followSchema = new mongoose.Schema({
    follower: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    following: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    }
}, {
    timestamps: true
});
followSchema.index({ follower: 1, following: 1 }, { unique: true });
followSchema.index({ following: 1, status: 1 }); // Get user's followers
followSchema.index({ follower: 1, status: 1 }); // Get user's following
followSchema.index({ status: 1, createdAt: -1 }); // Pending requests

// Validation: user cannot follow themselves
followSchema.pre('save', function (next) {
    if (this.follower.equals(this.following)) {
        return next(new Error('User cannot follow themselves'));
    }
    next();
});

// Update followers/following counts when accepted
followSchema.post('save', async function () {
    if (this.status === 'accepted') {
        await Promise.all([
            mongoose.model('User').findByIdAndUpdate(
                this.follower,
                { $inc: { followingCount: 1 } }
            ),
            mongoose.model('User').findByIdAndUpdate(
                this.following,
                { $inc: { followersCount: 1 } }
            )
        ]);
    }
});

// Update counts on status change
followSchema.pre('findOneAndUpdate', async function (next) {
    this._update = this.getUpdate();
    const doc = await this.model.findOne(this.getQuery());
    this._doc = doc;
    next();
});

followSchema.post('findOneAndUpdate', async function (doc) {
    if (doc && this._doc) {
        const oldStatus = this._doc.status;
        const newStatus = doc.status;

        if (oldStatus === 'pending' && newStatus === 'accepted') {
            await Promise.all([
                mongoose.model('User').findByIdAndUpdate(
                    doc.follower,
                    { $inc: { followingCount: 1 } }
                ),
                mongoose.model('User').findByIdAndUpdate(
                    doc.following,
                    { $inc: { followersCount: 1 } }
                )
            ]);
        }
    }
});

// Decrement counts on delete
followSchema.post('findOneAndDelete', async function (doc) {
    if (doc && doc.status === 'accepted') {
        await Promise.all([
            mongoose.model('User').findByIdAndUpdate(
                doc.follower,
                { $inc: { followingCount: -1 } }
            ),
            mongoose.model('User').findByIdAndUpdate(
                doc.following,
                { $inc: { followersCount: -1 } }
            )
        ]);
    }
});

export const Follow = mongoose.model('Follow', followSchema);

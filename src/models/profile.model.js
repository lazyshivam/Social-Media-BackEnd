const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
    username: {
        type: String,

    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    displayName: {
        type: String,
    },
    bio: {
        type: String,
        default: ''
    },
    profilePicture: {
        type: String,
        default: ''
    },
    postCount: {
        type: Number,
        default: 0
    },
    followerCount: {
        type: Number,
        default: 0
    },
    followingCount: {
        type: Number,
        default: 0
    },
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
});



// check if username is taken already
userProfileSchema.statics.isUsernameTaken = async function (username, excludeUserId) {
    const user = await this.findOne({ username, _id: { $ne: excludeUserId } });
    return !!user;
};

const UserProfile = mongoose.model('UserProfile', userProfileSchema);


module.exports = UserProfile;

const mongoose = require('mongoose');
const postSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    content: {
        type: String,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserProfile'
    },
    likes: {
        type: Number,
        default: 0
    },
    likedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    commentCount: {
        type: Number,
        default: 0
    },
    image: {
        type: String,
    },

},
    {
        timestamps: true,
    }
);


const Post = mongoose.model('Post', postSchema);

postSchema.methods.toggleLike = function(userId) {
    if (this.likedBy.includes(userId)) {
        // If the user already liked the post, remove the like
        this.likes--;
        this.likedBy.pull(userId);
    } else {
        // If the user hasn't liked the post, add the like
        this.likes++;
        this.likedBy.push(userId);
    }
    return this.save();
};
module.exports = Post;

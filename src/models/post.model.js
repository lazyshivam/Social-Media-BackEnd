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
        ref: 'User'
    },
    likes: {
        type: Number,
        default: 0,
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
    }],
    image: {
        type: String,
    },

},
    {
        timestamps: true,
    }
);


const Post = mongoose.model('Post', postSchema);
module.exports = Post;

const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
    
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserProfile',
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
    },
},
    {
        timestamps: true,
    }
);

const Comment = mongoose.model('Comment', commentSchema);
module.exports=Comment;

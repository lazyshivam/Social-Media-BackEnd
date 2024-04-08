const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserProfile',
    },
    text: {
        type: String,
        default:''
    },
    image: {
        type: String, 
    },
    caption: {
        type: String,
        default: ''
    },

},
    {
        timestamps:true,
    }
);

const Story = mongoose.model('Story', storySchema);

module.exports = Story;

const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    text: {
        type: String,
        default:''
    },
    media: {
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

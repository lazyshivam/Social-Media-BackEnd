const CONSTANT = require('../config/constant');
const ApiError = require('../utils/ApiError');
const { StoryModel, UserProfileModel } = require('../models');

/**
 * Create a new story
 * @param {Object} storyData - Data for creating a new story
 * @returns {Promise<Story>} - Newly created story
 */
const createStory = async (storyData, userId) => {
    const profile = await UserProfileModel.findOne({ user: userId });
    if (!profile) {
        return {data: {},code:CONSTANT.BAD_REQUEST,message:"User profile does not exist"};
    }
        const updateDetails = {
            ...storyData,
            author:profile._id
         }
        const story = await StoryModel.create(updateDetails);
        return { data: story, code: CONSTANT.SUCCESSFUL, message: CONSTANT.STORY_CREATED };
};

const getUserStory = async (userId) => {
    const profile = await UserProfileModel.findOne({ user: userId });
    if (!profile) {
        return {data: {},code:CONSTANT.BAD_REQUEST,message:"User profile does not exist"};
    }
    const allStory=await StoryModel.find({author:profile._id}).populate('author');

        return { data: allStory, code: CONSTANT.SUCCESSFUL, message:"Story List" };
};



/**
 * Get stories created by followed user
 * @param {string} userId - User ID of the viewer
 * @returns {Promise<Story[]>} - Array of stories
 */
const getStoriesByFollowedUsers = async (userId) => {
   
        const followedUsers = await getFollowedUsers(userId);
         console.log(followedUsers)
        // Find stories created by followed users
        const stories = await StoryModel.find({ author: { $in: followedUsers } }).sort({ createdAt: -1 }).populate('author');

        return { data: stories, code: CONSTANT.SUCCESSFUL, message: CONSTANT.STORIES_FETCHED };

};

/**
 * Get followed users by user ID
 * @param {string} userId - User ID
 * @returns {Promise<string[]>} - Array of followed user IDs
 */
const getFollowedUsers = async (userId) => {
    const user = await UserProfileModel.findOne({ user: userId });
    if (!user) {
        return [];
    }
    return user.following;
};

module.exports = {
    createStory,
    getStoriesByFollowedUsers,
    getUserStory
};

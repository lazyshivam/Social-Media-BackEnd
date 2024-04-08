const { UserProfileModel } = require("../models");
const CONSTANT = require("../config/constant");
const mailFunctions = require("../helpers/mailFunctions");
const ApiError = require('../utils/ApiError');
const mongoose=require('mongoose');

/**
 * Create a new profile
 * @param {Object} profileData - Data for creating a new profile
 * @returns {Promise<Profile>} - Newly created profile
 */
const createProfile = async (profileData, userId) => {
    console.log("creating post..", userId);

    // Check if a profile already exists for the user
    const existingProfile = await UserProfileModel.findOne({ user: userId });
    if (existingProfile) {
        return { data: {}, code: CONSTANT.BAD_REQUEST, message: "Profile already exists for this user" };
    }

    const updateDetails = {
        ...profileData,
        user: userId,
    }

    if (await UserProfileModel.isUsernameTaken(profileData.username)) {
        return {data:{},code:CONSTANT.BAD_REQUEST,message:`username ${profileData.username} is already taken`}
    }
    const profile = await UserProfileModel.create(updateDetails);

    return { data: profile, code: CONSTANT.SUCCESSFUL, message: CONSTANT.PROFILE_CREATED };

};



const updateProfile = async (profileData, userId) => {
    console.log("updating profile..", userId);

    const updateDetails = {
        ...profileData
    };
    
    // Check if a profile already exists for the user
    const existingProfile = await UserProfileModel.findOne({ user: userId });
    if (!existingProfile) {
        return { data: {}, code: CONSTANT.BAD_REQUEST, message:"Profile does not exits, Please create a profile" };
    }
    
    // Find the user's profile and update it with the new details
    const updatedProfile = await UserProfileModel.findOneAndUpdate(
        { user: userId }, // Find the profile by user ID
        updateDetails, 
        { new: true,} 
    );

    return { data: updatedProfile, code: CONSTANT.SUCCESSFUL, message: CONSTANT.PROFILE_UPDATED };

};

/**
 * Get all posts
 * @returns {Promise<Post[]>} - Array of posts
 */
const getUserProfile = async (userId) => {
    const profile = await UserProfileModel.findOne({ user: userId }).populate('following');
    
    if (!profile) {
        return {data:{},code:CONSTANT.BAD_REQUEST,message: CONSTANT.NOT_FOUND_MSG}
    }

    return { data: profile, code: CONSTANT.SUCCESSFUL, message: CONSTANT.PROFILE_DETAILS}
};


/**
 * Follow or unfollow a user
 * @param {string} userId - User ID of the user to follow/unfollow
 * @param {string} followerId - User ID of the follower
 * @returns {Promise<void>}
 */
const toggleFollow = async (ToFollow, followerId) => {
    console.log(`User ${followerId} is toggling follow/unfollow for user ${ToFollow}`);

    // Find the user
    const user = await UserProfileModel.findOne({user:ToFollow});
    if (!user) {
        return { data: {}, code: CONSTANT.BAD_REQUEST, message: CONSTANT.NOT_FOUND_MSG };
    }

    // Find the follower's profile
    const followerProfile = await UserProfileModel.findOne({ user: followerId });
    if (!followerProfile) {
        return { data: {}, code: CONSTANT.BAD_REQUEST, message: CONSTANT.NOT_FOUND_MSG };
    }

    if (followerProfile.following.includes(user._id)) {
        // Unfollow the user

        // Remove the user from the follower's following list
        followerProfile.following.pull(user._id);
        
        // Decrement the following count of the follower
        followerProfile.followingCount--;
        
        // Remove the follower from the user's follower list
        user.followers.pull(followerProfile._id);
        
        // Decrement the follower count of the user
        user.followerCount--;
        
        await followerProfile.save();
        await user.save();
        // Return success response
        return { data:user, code: CONSTANT.SUCCESSFUL, message: `User ${followerId} is no longer following user ${ToFollow}` };
    } else {
        // Follow the user

        // Add the user to the follower's following list
        followerProfile.following.push(user._id);
        
        // Increment the following count of the follower
        followerProfile.followingCount++;
        
        // Add the follower to the user's follower list
        user.followers.push(followerProfile._id);
        
        // Increment the follower count of the user
        user.followerCount++;
        
        await followerProfile.save();
        await user.save();
        // Return success response
        return { data:user, code: CONSTANT.SUCCESSFUL, message: `User ${followerId} is now following user ${ToFollow}` };
    }
};




module.exports = {
    createProfile,
    updateProfile,
    getUserProfile,
   toggleFollow
};

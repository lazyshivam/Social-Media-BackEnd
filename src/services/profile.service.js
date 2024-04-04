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
    const profile = await UserProfileModel.findOne({ user: userId });
    
    if (!profile) {
        return {data:{},code:CONSTANT.BAD_REQUEST,message: CONSTANT.NOT_FOUND_MSG}
    }

    return { data: profile, code: CONSTANT.SUCCESSFUL, message: CONSTANT.PROFILE_DETAILS}
};


/**
 * Follow a user
 * @param {string} userId - User ID of the user to follow
 * @param {string} followerId - User ID of the follower
 * @returns {Promise<void>}
 */
const followUser = async (userId, followerId) => {

        console.log(`User ${followerId} is following user ${userId}`);

        // Find the user to follow
        const userToFollow = await UserProfileModel.findOne({user:userId});
        if (!userToFollow) {
          return {data:{},code:CONSTANT.BAD_REQUEST,message:CONSTANT.NOT_FOUND_MSG}
        }

        // Find the follower's profile
        const followerProfile = await UserProfileModel.findOne({ user: followerId });
        if (!followerProfile) {
            return {data:{},code:CONSTANT.BAD_REQUEST,message:CONSTANT.NOT_FOUND_MSG}
        }

        // Check if the follower is already following the user
        if (!followerProfile.following.includes(userId)) {
            // Add the user to the follower's following list
            followerProfile.following.push(userId);
            await followerProfile.save();

            // Increment the following count of the follower
            followerProfile.followingCount++;
        }

        // Add the follower to the user's follower list
        userToFollow.followers.push(followerId);
        await userToFollow.save();

        // Increment the follower count of the user
        userToFollow.followerCount++;

        // Return success response
        return {data:{}, code: CONSTANT.SUCCESSFUL, message: `User ${followerId} is now following user ${userId}` };
};

/**
 * Unfollow a user
 * @param {string} userId - User ID of the user to unfollow
 * @param {string} followerId - User ID of the follower
 * @returns {Promise<void>}
 */
const unfollowUser = async (userId, followerId) => {
        console.log(`User ${followerId} is unfollowing user ${userId}`);

        // Find the user to unfollow
        const userToUnfollow = await UserProfileModel.findById(userId);
        if (!userToUnfollow) {
            return {data:{},code:CONSTANT.BAD_REQUEST,message:CONSTANT.NOT_FOUND_MSG}
        }



      // Find the follower's profile
      const followerProfile = await UserProfileModel.findOne({ user: followerId });
      if (!followerProfile) {
          return {data:{},code:CONSTANT.BAD_REQUEST,message:CONSTANT.NOT_FOUND_MSG}
      }

        // Remove the user from the follower's following list
        followerProfile.following.pull(userId);
        await followerProfile.save();

        // Decrement the following count of the follower
        followerProfile.followingCount--;

        // Remove the follower from the user's follower list
        userToUnfollow.followers.pull(followerId);
        await userToUnfollow.save();

        // Decrement the follower count of the user
        userToUnfollow.followerCount--;

        // Return success response
        return {data:{}, code: CONSTANT.SUCCESSFUL, message: `User ${followerId} is no longer following user ${userId}` };

};



module.exports = {
    createProfile,
    updateProfile,
    getUserProfile,
    followUser,
    unfollowUser,
};

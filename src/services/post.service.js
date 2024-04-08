const { UserModel, CreditAPIHitModel, PostModel, UserProfileModel } = require("../models");
const CONSTANT = require("../config/constant");
const mailFunctions = require("../helpers/mailFunctions");
const ApiError = require('../utils/ApiError');
const mongoose = require('mongoose');

/**
 * Create a new post
 * @param {Object} postData - Data for creating a new post
 * @returns {Promise<Post>} - Newly created post
 */
const createPost = async (postData, user) => {
    console.log("creating post..", user);
    const profile = await UserProfileModel.findOne({ user: user._id });

    if (!profile) {
        return {data: {},code:CONSTANT.BAD_REQUEST,message:'Please create your profile first.'};
    }
    const updateDetails = {
        ...postData,
        author: profile._id,
    }
    const post = await PostModel.create(updateDetails);
    profile.postCount++;
    await profile.save();

    return { data: post, code: CONSTANT.SUCCESSFUL, message: CONSTANT.POST_CREATED };

};

/**
 * Get all posts
 * @returns {Promise<Post[]>} - Array of posts
 */
const getAllPosts = async () => {
    const posts = await PostModel.find().populate('author');

    return { data: posts, code: CONSTANT.SUCCESSFUL, message: CONSTANT.POST_LIST }
};

/**
 * Get post by ID
 * @param {string} postId - ID of the post
 * @returns {Promise<Post>} - Post with the given ID
 */
const getPostById = async (userId) => {
    // console.log(userId, "getPostById");
    const profile = await UserProfileModel.findOne({ user: userId });
    if (!profile) {
        return {data: {}, code: CONSTANT.BAD_REQUEST,message:CONSTANT.NOT_FOUND_MSG}
    }
    // console.log(profile)

    const post = await PostModel.find({ author: profile._id });
    if (!post) {
        return { data: {}, code: CONSTANT.SUCCESSFUL, message: CONSTANT.NOT_FOUND_MSG }
    }
    return { data: post, code: CONSTANT.SUCCESSFUL, message: CONSTANT.POST_DETAILS };
};



const getPostByPostId = async (postId) => {
    console.log(postId, "getPostById");
    const pipeline = [
        {
            $match: { _id: mongoose.Types.ObjectId(postId) }
        },
        {
            $lookup: {
                from: 'comments',
                localField: '_id',
                foreignField: 'post',
                as: 'comments'
            }
        },
        {
            $unwind: '$comments'
        },
        {
            $lookup: {
                from: 'users',
                localField: '-id',
                foreignField: 'author',
                as: 'comments.author'
            }
        },
        {
            $unwind: '$comments.author'
        },
        {
            $group: {
                _id: '$_id',
                title: { $first: '$title' },
                content: { $first: '$content' },
                author: { $first: '$author' },
                likes: { $first: '$likes' },
                comments: { $push: '$comments' }
            }
        }
    ];

    const post = await PostModel.aggregate(pipeline);

    if (!post || post.length === 0) {
        return { data: {}, code: CONSTANT.SUCCESSFUL, message: CONSTANT.NOT_FOUND_MSG };
    }

    return { data: post[0], code: CONSTANT.SUCCESSFUL, message: CONSTANT.POST_DETAILS };
};




/**
 * Update post by ID
 * @param {string} postId - ID of the post
 * @param {Object} updateData - Data to update the post
 * @returns {Promise<Post>} - Updated post
 */
const updatePostById = async (postId, updateData) => {

    const post = await PostModel.findByIdAndUpdate(postId, updateData, { new: true });

    if (!post) {
        return { data: {}, code: CONSTANT.SUCCESSFUL, message: CONSTANT.NOT_FOUND_MSG }
    }

    return { data: post, code: CONSTANT.SUCCESSFUL, message: CONSTANT.POST_UPDATED };

};

/**
 * Delete post by ID
 * @param {string} postId - ID of the post
 * @returns {Promise<void>}
 */
const deletePostById = async (postId) => {

    const post = await PostModel.findByIdAndDelete(postId);
    if (!post) {
        return { data: {}, code: CONSTANT.SUCCESSFUL, message: CONSTANT.NOT_FOUND_MSG }
    }
    return { data: post, code: CONSTANT.SUCCESSFUL, message: CONSTANT.POST_DELETED };
};


const LikeAndDislikePost = async (userId, postId) => {
    const post = await PostModel.findById({ _id: postId });
    if (!post) {
        return { data: {}, code: CONSTANT.BAD_REQUEST, message: CONSTANT.NOT_FOUND_MSG }
    }

    const profile = await UserProfileModel.findOne({ user: userId });
    if (!profile) {
        return { data: {}, code: CONSTANT.BAD_REQUEST, message: CONSTANT.NOT_FOUND_MSG }
    }
   
    // console.log(userId, "and ", postId);
    // console.log(profile);

    if (post.likedBy.includes(userId) && profile.postLiked.includes(postId)) {
        // If the user already liked the post, remove the like
        post.likes--;
        post.likedBy.pull(userId);
        profile.postLiked.pull(postId);
    } else {
        // If the user hasn't liked the post, add the like
        post.likes++;
        post.likedBy.push(userId);
        profile.postLiked.push(postId);
    }

    await post.save();
    await profile.save();
    return { data: post, code: CONSTANT.SUCCESSFUL, message: CONSTANT.POST_LIKED_MSG };
}

module.exports = {
    createPost,
    getAllPosts,
    getPostById,
    updatePostById,
    deletePostById,
    getPostByPostId,
    LikeAndDislikePost
};

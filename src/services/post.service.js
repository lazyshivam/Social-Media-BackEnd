const { UserModel, CreditAPIHitModel, PostModel } = require("../models");
const CONSTANT = require("../config/constant");
const mailFunctions = require("../helpers/mailFunctions");
const ApiError = require('../utils/ApiError');

/**
 * Create a new post
 * @param {Object} postData - Data for creating a new post
 * @returns {Promise<Post>} - Newly created post
 */
const createPost = async (postData, user) => {
    console.log("creating post..", user);
    const updateDetails = {
        ...postData,
        author: user._id,
     }
    const post = await PostModel.create(updateDetails);

    return {data:post ,code:CONSTANT.SUCCESSFUL,message:CONSTANT.POST_CREATED};
 
};

/**
 * Get all posts
 * @returns {Promise<Post[]>} - Array of posts
 */
const getAllPosts = async () => {
    const posts = await PostModel.find();
   
    return {data:posts,code:CONSTANT.SUCCESSFUL,message:CONSTANT.POST_LIST}
};

/**
 * Get post by ID
 * @param {string} postId - ID of the post
 * @returns {Promise<Post>} - Post with the given ID
 */
const getPostById = async (userId) => {
    console.log(userId,"getPostById")
    const post = await PostModel.find({author:userId});
    if (!post) {
     return {data: {},code:CONSTANT.SUCCESSFUL,message:CONSTANT.NOT_FOUND_MSG}
    }
   return {data:post,code:CONSTANT.SUCCESSFUL,message:CONSTANT.POST_DETAILS}
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
        return {data: {},code:CONSTANT.SUCCESSFUL,message:CONSTANT.NOT_FOUND_MSG}
    }

    return {data:post ,code:CONSTANT.SUCCESSFUL,message:CONSTANT.POST_UPDATED};
 
};

/**
 * Delete post by ID
 * @param {string} postId - ID of the post
 * @returns {Promise<void>}
 */
const deletePostById = async (postId) => {
  
    const post = await PostModel.findByIdAndDelete(postId);
    if (!post) {
        return {data: {},code:CONSTANT.SUCCESSFUL,message:CONSTANT.NOT_FOUND_MSG}
    }
    return {data:post ,code:CONSTANT.SUCCESSFUL,message:CONSTANT.POST_DELETED};
};

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePostById,
  deletePostById,
};

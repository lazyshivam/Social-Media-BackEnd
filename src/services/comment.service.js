const ApiError = require('../utils/ApiError');
const CONSTANT = require("../config/constant");
const { CommentModel, PostModel } = require('../models');
const UserProfile = require('../models/profile.model');

/**
 * Create a new comment
 * @param {Object} commentData - Data for creating a new comment
 * @returns {Promise<Comment>} - Newly created comment
 */
const createComment = async (commentData, postId, userId) => {
  const profile = await UserProfile.findOne({ user: userId });

  if (!profile) {
    return { data: {}, code: CONSTANT.BAD_REQUEST, message: CONSTANT.NOT_FOUND_MSG }
  }

  const postData = await PostModel.findOne({ _id: postId });

  if (!postData) {
    return { data: {}, code: CONSTANT.BAD_REQUEST, message: CONSTANT.NOT_FOUND_MSG }
  }

  const commentDetails = {
    ...commentData,
    post: postId,
    author: profile._id
  }

  const comment = await CommentModel.create(commentDetails);
  postData.commentCount++;
  await postData.save();

  return { data: comment, code: CONSTANT.SUCCESSFUL, message: CONSTANT.COMMENT_CREATED };

};


/**
 * Get comment by ID
 * @param {string} commentId - ID of the comment
 * @returns {Promise<Comment>} - Comment with the given ID
 */
const getCommentByPostId = async (postId) => {

  const comment = await CommentModel.find({ post: postId }).populate('author');
  if (!comment) {
    return { data: comment, code: CONSTANT.BAD_REQUEST, message: CONSTANT.NOT_FOUND_MSG }
  }
  return { data: comment, code: CONSTANT.SUCCESSFUL, message: CONSTANT.COMMENT_DETAILS }
};

const getAllComment = async () => {
  const comment = await CommentModel.find().populate('author');
  if (!comment) {
    return { data: comment, code: CONSTANT.BAD_REQUEST, message: CONSTANT.NOT_FOUND_MSG }
  }
  return { data: comment, code: CONSTANT.SUCCESSFUL, message: CONSTANT.COMMENT_DETAILS }
}

/**
 * Update comment by ID
 * @param {string} commentId - ID of the comment
 * @param {Object} updateData - Data to update the comment
 * @returns {Promise<Comment>} - Updated comment
 */
const updateCommentById = async (commentId, updateData) => {

  const comment = await CommentModel.findByIdAndUpdate({ _id: commentId }, updateData, { new: true });
  if (!comment) {
    return { data: comment, code: CONSTANT.BAD_REQUEST, message: CONSTANT.NOT_FOUND_MSG }
  }
  return { data: comment, code: CONSTANT.SUCCESSFUL, message: CONSTANT.COMMENT_UPDATED }
};

/**
 * Delete comment by ID
 * @param {string} commentId - ID of the comment
 * @returns {Promise<void>}
 */
const deleteCommentById = async (commentId) => {

  const comment = await CommentModel.findByIdAndDelete({ _id: commentId });
  if (!comment) {
    return { data: comment, code: CONSTANT.BAD_REQUEST, message: CONSTANT.NOT_FOUND_MSG }
  }
  
  const post = await PostModel.findOne({ _id: comment.post });
  post.commentCount--;
  await post.save();

  return { data: comment, code: CONSTANT.SUCCESSFUL, message: CONSTANT.COMMENT_DELETED }
};

module.exports = {
  createComment,
  getCommentByPostId,
  getAllComment,
  updateCommentById,
  deleteCommentById,
};

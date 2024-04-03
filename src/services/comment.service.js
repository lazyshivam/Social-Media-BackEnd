const ApiError = require('../utils/ApiError');
const CONSTANT = require("../config/constant");
const { CommentModel } = require('../models');

/**
 * Create a new comment
 * @param {Object} commentData - Data for creating a new comment
 * @returns {Promise<Comment>} - Newly created comment
 */
const createComment = async (commentData) => {
 
    const comment = await CommentModel.create(commentData);
    return {data: comment,code:CONSTANT.SUCCESSFUL,message:CONSTANT.COMMENT_CREATED};

};


/**
 * Get comment by ID
 * @param {string} commentId - ID of the comment
 * @returns {Promise<Comment>} - Comment with the given ID
 */
const getCommentByPostId = async (postId) => {
 
    const comment = await CommentModel.findById({post:postId});
    if (!comment) {
        return {data:comment,code:CONSTANT.BAD_REQUEST,message:CONSTANT.NOT_FOUND_MSG}
      }
      return {data:comment,code:CONSTANT.SUCCESSFUL,message:CONSTANT.COMMENT_DETAILS}
};

/**
 * Update comment by ID
 * @param {string} commentId - ID of the comment
 * @param {Object} updateData - Data to update the comment
 * @returns {Promise<Comment>} - Updated comment
 */
const updateCommentById = async (commentId, updateData) => {
  
    const comment = await CommentModel.findByIdAndUpdate({_id:commentId}, updateData, { new: true });
    if (!comment) {
      return {data:comment,code:CONSTANT.BAD_REQUEST,message:CONSTANT.NOT_FOUND_MSG}
    }
    return {data:comment,code:CONSTANT.SUCCESSFUL,message:CONSTANT.COMMENT_UPDATED}
};

/**
 * Delete comment by ID
 * @param {string} commentId - ID of the comment
 * @returns {Promise<void>}
 */
const deleteCommentById = async (commentId) => {

    const comment = await CommentModel.findByIdAndDelete({_id:commentId});
    if (!comment) {
        return {data:comment,code:CONSTANT.BAD_REQUEST,message:CONSTANT.NOT_FOUND_MSG}
      }
      return {data:comment,code:CONSTANT.SUCCESSFUL,message:CONSTANT.COMMENT_DELETED}
};

module.exports = {
  createComment,
//   getAllComments,
getCommentByPostId,
  updateCommentById,
  deleteCommentById,
};

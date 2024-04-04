const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { commentService } = require('../services');
const CONSTANT = require('../config/constant');
const { MailFunction } = require('../helpers');

const createUserComment = catchAsync(async (req, res) => {
    const userId = req.user.id;
    const postId = req.params.postId;
    const result = await commentService.createComment(req.body,postId,userId);

    res.send(result);
});



const deleteUserComment = catchAsync(async (req, res) => {
    const commentId=req.params.commentId;
    const result = await commentService.deleteUserComment(commentId);

    res.send(result);
});


const updateUserCommentById = catchAsync(async (req, res) => {
    const commentId=req.params.commentId;
    const result = await commentService.updateCommentById(commentId,req.body);

    res.send(result);
});

const getCommentForPostById = catchAsync(async (req, res) => {
    const postId=req.params.postId;
    const result = await commentService.getCommentByPostId(postId);

    res.send(result);
});


module.exports = { createUserComment,updateUserCommentById,deleteUserComment,getCommentForPostById };

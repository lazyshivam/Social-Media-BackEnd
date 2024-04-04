const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { userAuthService, tokenService, postService } = require('../services');
const CONSTANT = require('../config/constant');
const { MailFunction } = require('../helpers');

const createUserPost = catchAsync(async (req, res) => {
    const user = req.user;
    const result = await postService.createPost(req.body,user);

    res.send(result);
});

const updateUserPost = catchAsync(async (req, res) => {
    const postId=req.params.postId;
    const result = await postService.updatePostById(postId,req.body);

    res.send(result);
});

const deleteUserPost = catchAsync(async (req, res) => {
    const postId=req.params.postId;
    const result = await postService.deletePostById(postId);

    res.send(result);
});

const getAllUserPost = catchAsync( async(req, res) => {
    const result = await postService.getAllPosts();

    res.send(result);
});

const getUserPostByID = catchAsync( async(req, res) => {
    const result = await postService.getPostById(req.user.id);

    res.send(result);
});

const getPostByPostID = catchAsync(async (req, res) => {
    const postId = req.params.postId;
    const result = await postService.getPostByPostId(postId);

    res.send(result);
});

const toggleLike = catchAsync(async (req, res) => {
    const userId = req.user.id;
    const postId = req.params.postId;
    
    const result = await postService.LikeAndDislikePost(userId, postId);

    res.send(result);
});


module.exports = { createUserPost, updateUserPost, deleteUserPost, getAllUserPost, getUserPostByID,getPostByPostID,toggleLike };

const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { userAuthService, tokenService, postService, profileService } = require('../services');
const CONSTANT = require('../config/constant');
const { MailFunction } = require('../helpers');

const createUserProfile = catchAsync(async (req, res) => {
    const userId = req.user.id;
    const result = await profileService.createProfile(req.body,userId);

    res.send(result);
});

const updateUserProfile = catchAsync(async (req, res) => {
    const userId=req.user.id;
    const result = await profileService.updateProfile(req.body,userId);

    res.send(result);
});

// const deleteUserPost = catchAsync(async (req, res) => {
//     const postId=req.params.postId;
//     const result = await postService.deletePostById(postId);

//     res.send(result);
// });


const getUserProfileById = catchAsync( async(req, res) => {
    const result = await profileService.getUserProfile(req.user.id);

    res.send(result);
});

const toggleFollowAndUnfollow = catchAsync(async (req, res) => {
    const userToFollow=req.params.userId
    const result = await profileService.toggleFollow(userToFollow,req.user.id);

    res.send(result);
});





module.exports = { createUserProfile,updateUserProfile,getUserProfileById,toggleFollowAndUnfollow };

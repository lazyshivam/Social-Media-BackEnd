const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { userAuthService, tokenService, postService, profileService, storyService } = require('../services');
const CONSTANT = require('../config/constant');
const { MailFunction } = require('../helpers');

const createUserStory = catchAsync(async (req, res) => {
    const userId = req.user.id;
    const result = await storyService.createStory(req.body,userId);

    res.send(result);
});

const getStory = catchAsync(async (req, res) => {
    const userId = req.user.id;
    const result = await storyService.getUserStory(userId);

    res.send(result);
});

const getAllUserStory = catchAsync(async (req, res) => {
    const userId = req.user.id;
    const result = await storyService.getStoriesByFollowedUsers(userId);

    res.send(result);
});


module.exports = { createUserStory,getAllUserStory ,getStory};

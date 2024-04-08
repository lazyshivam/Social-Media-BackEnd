const express = require('express');
const {  storyController} = require('../../controllers');
const userAuth = require('../../middlewares/userAuth');
const validate = require('../../middlewares/validate');
const {  storyValidation } = require('../../validations');

const router = express.Router();

router.post('/createStory', userAuth(),validate(storyValidation.validateCreateStory), storyController.createUserStory);
router.get('/getAllStory', userAuth(), storyController.getAllUserStory);
router.get('/getUserStory', userAuth(), storyController.getStory);

// router.get('/getAllComment', userAuth(), commentController.getAllUserComment);


// bellow routes for admin user 
// router.post('/updateComment/:commentId',userAuth(),validate(commentValidation.validateUpdateComment), commentController.updateUserCommentById);
// router.get('/getUserPost', userAuth(),validate(commentValidation.validateGetPost), postController.getUserPostByID);


// router.post('/deleteComment/:commentId',userAuth(),validate(commentValidation.validateDeleteComment), commentController.deleteUserComment); //this route is accessible for admin users ans normal users as well


module.exports = router;

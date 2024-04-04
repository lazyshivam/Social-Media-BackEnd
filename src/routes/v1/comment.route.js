const express = require('express');
const { postController, commentController} = require('../../controllers');
const userAuth = require('../../middlewares/userAuth');
const validate = require('../../middlewares/validate');
const { postValidation, commentValidation } = require('../../validations');

const router = express.Router();

router.post('/postComment/:postId', userAuth(),validate(commentValidation.validateCreateComment), commentController.createUserComment);
// router.get('/getAllUserPost', userAuth(),validate(commentValidation.), postController.getAllUserPost);

// bellow routes for admin user 
router.post('/updateComment/:commentId',userAuth(),validate(commentValidation.validateUpdateComment), commentController.updateUserCommentById);
// router.get('/getUserPost', userAuth(),validate(commentValidation.validateGetPost), postController.getUserPostByID);


router.post('/deletePost/:commentId',userAuth(),validate(commentValidation.validateDeleteComment), commentController.deleteUserComment); //this route is accessible for admin users ans normal users as well


module.exports = router;

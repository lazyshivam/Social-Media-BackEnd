const express = require('express');
const { postController} = require('../../controllers');
const userAuth = require('../../middlewares/userAuth');
const validate = require('../../middlewares/validate');
const { postValidation } = require('../../validations');

const router = express.Router();

router.post('/createPost', userAuth(),validate(postValidation.validateCreatePost), postController.createUserPost);
router.get('/getAllUserPost', userAuth(),validate(postValidation.validateGetAllPosts), postController.getAllUserPost);

// bellow routes for admin user 
router.post('/updatePost/:postId',userAuth(),validate(postValidation.validateUpdatePost), postController.updateUserPost);
router.get('/getUserPost', userAuth(),validate(postValidation.validateGetPost), postController.getUserPostByID);
router.get('/getPostDetails/:postId',userAuth(),validate(postValidation.validateDeletePost), postController.getPostByPostID);


router.post('/deletePost/:postId',userAuth(),validate(postValidation.validateDeletePost), postController.deleteUserPost); //this route is accessible for admin users ans normal users as well
router.post('/toggleLike/:postId',userAuth(),validate(postValidation.validateDeletePost), postController.toggleLike); //this route is accessible for admin users ans normal users as well


module.exports = router;

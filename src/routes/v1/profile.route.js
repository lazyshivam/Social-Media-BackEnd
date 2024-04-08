const express = require('express');
const { postController, profileController} = require('../../controllers');
const userAuth = require('../../middlewares/userAuth');
const validate = require('../../middlewares/validate');
const { postValidation, profileValidation } = require('../../validations');

const router = express.Router();

router.post('/createProfile', userAuth(),validate(profileValidation.validateCreateProfile), profileController.createUserProfile);
router.get('/getProfile', userAuth(), profileController.getUserProfileById);

// bellow routes for admin user 
router.post('/updateProfile', userAuth(), validate(profileValidation.validateUpdateProfile), profileController.updateUserProfile);
router.post('/followUser/:userId',userAuth(),validate(profileValidation.validateFollowUnFollow), profileController.toggleFollowAndUnfollow);



module.exports = router;

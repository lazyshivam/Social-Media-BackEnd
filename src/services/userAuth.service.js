const { UserModel, CreditAPIHitModel } = require("../models");
const CONSTANT = require("../config/constant");
const Token = require("../models/token.model");
const { tokenTypes } = require("../config/tokens");
const tokenService = require("./token.service");
// const {emailVerificationToken}=require('../helpers/emailVerificationToken.js');
const bcrypt = require("bcryptjs");
const mailFunctions = require("../helpers/mailFunctions");
const jwt = require('jsonwebtoken');



/**
 * Create a Company
 * @param {Object} companyBody
 * @returns {Promise<Company>}
 */
const registerUser = async (userBody) => {
  // console.log(companyBody);
  if (await UserModel.isEmailTaken(userBody.email)) {
    return { data: {}, code: CONSTANT.BAD_REQUEST, message: CONSTANT.USER_EMAIL_ALREADY_EXISTS, };
  }
 

  // saving user email verification token in database
  const user = await UserModel.create(userBody);
  // const token = await tokenService.generateEmailVerificationToken(user);
  //   console.log(tokenDoc)
  // await mailFunctions.sendVerificationEmail(user, token);
  return { data: user, code: 200, message: CONSTANT.USER_CREATE };
};


const validateUserWithEmail = async (email) => {
  var details = await UserModel.findOne({email});
  return details;
};

/**
 * Delete company by id
 * @param {ObjectId} userId
 * @returns {Promise<Company>}
 */
// const deleteCompanyById = async (userId) => {
//   const company = await getCompanyById(userId);
//   if (!company) {
//     return { data: {}, code: CONSTANT.NOT_FOUND, message: CONSTANT.COMPANY_NOT_FOUND, };
//   }
//   // company.status = company.status == 0 ? 1 : 0;
//   company.isDelete = 0;
//   await company.save();
//   var message =
//     company.status == 1 ? CONSTANT.COMPANY_STATUS_ACTIVE : CONSTANT.COMPANY_STATUS_INACTIVE;

//   return { data: company, code: CONSTANT.SUCCESSFUL, message: message };
// };



/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (email, password) => {
  var details = await UserModel.findOne({email});
  if (!details || !(await details.isPasswordMatch(password))) {
    return { data: {}, code: CONSTANT.UNAUTHORIZED, message: CONSTANT.UNAUTHORIZED_MSG, };
  }

  // Check if user email is verified
  // if (!details.emailVerificationStatus) {
  //   // Sending verification email reminder
  //   return { data: {}, code: CONSTANT.BAD_REQUEST, message: CONSTANT.VERIFICATION_REQUIRED_MSG, };
  // }
  return { data: details, code: CONSTANT.SUCCESSFUL, message: CONSTANT.USER_DETAILS, };
};

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
const logout = async (refreshToken) => {
  const refreshTokenDoc = await Token.findOne({
    token: refreshToken,
    type: tokenTypes.REFRESH,
    blacklisted: false,
  });

  if (!refreshTokenDoc) {
    return { data: {}, code: CONSTANT.NOT_FOUND, message: CONSTANT.NOT_FOUND_MSG, };
  }
  await refreshTokenDoc.remove();
};


/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  return UserModel.findById(id);
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(refreshToken, tokenTypes.REFRESH);

    const user = await getUserById(refreshTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await refreshTokenDoc.remove();
    return tokenService.generateAuthTokens(user);
  } catch (error) {
    return { data: {}, code: CONSTANT.UNAUTHORIZED, message: CONSTANT.UNAUTHORIZED_MSG, };
  }
};




/**
 * Update company by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<Company>}
 */
const updateUserById = async (userId, updateBody) => {
  try {
    const user = await getUserById(userId);
    // console.log(user)
    if (!user) {
      return { data: {}, code: CONSTANT.NOT_FOUND, message: CONSTANT.USER_NOT_FOUND, };
    }
   
    updateBody.updatedAt = new Date();
    Object.assign(user, updateBody);
    await user.save();
    return { data: user, code: CONSTANT.SUCCESSFUL, message: CONSTANT.USER_UPDATE, };
  } catch (error) {
    console.log(error)
  }
};



/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise}
 */
const resetPassword = async (resetPasswordToken, newPassword) => {
  console.log('reset password', resetPasswordToken,newPassword);
  try {
    const resetPasswordTokenDoc = await tokenService.verifyToken(
      resetPasswordToken,
      tokenTypes.RESET_PASSWORD
    );
    // var user = await UserModel.findOne({
    //   _id: resetPasswordTokenDoc.user,
    // });
    await updateUserById(resetPasswordTokenDoc.user, { password: newPassword });
    await Token.deleteMany({ user: resetPasswordTokenDoc.user, type: tokenTypes.RESET_PASSWORD, });

    return { data: {}, code: CONSTANT.SUCCESSFUL, message: "Password updated successfully", };
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return { data: {}, code: CONSTANT.UNAUTHORIZED, message: "Reset token expired. Please request a new password reset link." };
    } else if (error instanceof jwt.JsonWebTokenError) {
      return { data: {}, code: CONSTANT.UNAUTHORIZED, message: "Invalid reset token. Please make sure you're using the correct link." };
    } else {
      console.error(error);
      return { data: {}, code: CONSTANT.INTERNAL_SERVER_ERROR, message: "Internal server error. Please try again later." };
    }
  }
};



// verification of user email

const verifyUserEmail = async (verifyToken) => {
  try {
    const verificationTokenDoc = await tokenService.verifyToken(
      verifyToken,
      tokenTypes.EMAIL_VERIFICATION
    );
    console.log("🚀 ~ verifyUserEmail ~ verificationTokenDoc:", verificationTokenDoc);
    // const user = await UserModel.findById({ _id: verificationTokenDoc.user });
    // console.log(user,"this is yser")
    // if (user.emailVerificationStatus == true) {

    //   return { data: {}, code: CONSTANT.BAD_REQUEST, message: CONSTANT.USER_ALREADY_VERIFIED, };
    // }
    await tokenService.deleteToken(verifyToken, tokenTypes.EMAIL_VERIFICATION);
    await updateUserById(verificationTokenDoc.user, { emailVerificationStatus: true });
    return { data: {}, code: CONSTANT.SUCCESSFUL, message: "Email verified successfully" };

  } catch (error) {
    return { data: {}, code: CONSTANT.BAD_REQUEST, message: "Email veification failed" };
  }
};
//   again vefication of user email if user email is not verified
const resendUserEmailVerification = async (userEmail) => {
  const user = await UserModel.findOne({ email: userEmail });
  const token = await tokenService.generateEmailVerificationToken(user);
  await mailFunctions.sendVerificationEmail(user, token);
  return { data: [], code: 200, message: CONSTANT.EMAIL_VERIFICATION };
};

module.exports = {
  registerUser,
  loginUserWithEmailAndPassword,
  logout,
  validateUserWithEmail,
  refreshAuth,
  resetPassword,
  verifyUserEmail,

  resendUserEmailVerification,
};

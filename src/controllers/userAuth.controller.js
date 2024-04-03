const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { userAuthService, tokenService } = require('../services');
const CONSTANT = require('../config/constant');
const { MailFunction } = require('../helpers');


const createUser = catchAsync(async (req, res) => {

    const user = await userAuthService.registerUser(req.body);

    res.send(user);
});

const getCompany = catchAsync(async (req, res) => {
    const company = await userAuthService.getCompanyById(req.params.userId);
    if (!company) {
        res.send({ data: {}, code: CONSTANT.NOT_FOUND, message: CONSTANT.COMPANY_NOT_FOUND });
    }
    res.send({ data: company, code: CONSTANT.SUCCESSFUL, message: CONSTANT.COMPANY_DETAILS });
});

const updateUser = catchAsync(async (req, res) => {
    const company = await userAuthService.updateCompanyById(req.params.userId, req.body);
    res.send(company);
});

const deleteUser = catchAsync(async (req, res) => {
    var details = await userAuthService.deleteCompanyById(req.params.userId);
    if (details) {
        res.send(details);
    }
    res.send(details);
});

const login = catchAsync(async (req, res) => {
    var { email, password } = req.body;
    email = email.toLocaleLowerCase()
    const user = await userAuthService.loginUserWithEmailAndPassword(email, password);
    if (user && user.data && user.code == 200) {
        const tokens = await tokenService.generateAuthTokens(user.data);
        if (user && tokens) {
            res.send({ data: { user: user.data, tokens }, code: CONSTANT.SUCCESSFUL, message: CONSTANT.COMPANY_DETAILS });
        } else {
            res.send(user)
        }
    } else {
        res.send(user)
    }
});

const logout = catchAsync(async (req, res) => {
    await userAuthService.logout(req.body.refreshToken);
    // res.status(httpStatus.NO_CONTENT).send();
    res.send({ data: {}, code: CONSTANT.SUCCESSFUL, message: CONSTANT.Logout_MSG })
});

const refreshTokens = catchAsync(async (req, res) => {
    const tokens = await userAuthService.refreshAuth(req.body.refreshToken);
    res.send({ ...tokens });
});

const forgotPassword = catchAsync(async (req, res) => {
    console.log('req.body.email----forgot', req.body.email)
    const user = await userAuthService.validateUserWithEmail(req.body.email);
    if (user) {
        var resetPasswordToken = await tokenService.generateResetPasswordToken(user);
        await MailFunction.sendResetPasswordEmail(req.body.email, resetPasswordToken);
        res.send({ data: {}, code: CONSTANT.SUCCESSFUL, message: CONSTANT.FORGOT_PASSWORD });
    } else {
        res.send({ data: {}, code: CONSTANT.NOT_FOUND, message: CONSTANT.USER_NOT_FOUND });
    }
});

const resetPassword = catchAsync(async (req, res) => {
    var response = await userAuthService.resetPassword(req.query.token, req.body.password);
    res.send(response);
    // res.status(httpStatus.NO_CONTENT).send();
});

// email verification of registered user

const verifyEmail = catchAsync(async (req, res) => {

    var response = await userAuthService.verifyUserEmail(req.query.token);
    res.send(response);

});
const resendEmailVerification = catchAsync(async (req, res) => {
    const email = req.body.email;
    console.log(email);
    const response = await userAuthService.resendUserEmailVerification(email);

    res.send(response);
});


module.exports = {
    createUser,
    getCompany,
    updateUser,
    deleteUser,
    login,
    logout,
    refreshTokens,
    forgotPassword,
    resetPassword,
    verifyEmail,
    resendEmailVerification
};
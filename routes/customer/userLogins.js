var express = require('express');
var router = express.Router();
const controller = require("../../controllers")

//get login page
router.get('/login', controller.customerControllers.loginController.getLoginPage);

//loging in
router.post('/login', controller.customerControllers.loginController.sendUserLoginRequest);

//get signup page
router.get('/signup', controller.customerControllers.signupController.getSignupPage);

//signup
router.post('/signup', controller.customerControllers.signupController.sendUserSignupRequest);

//get otp verification page
router.get('/verify', controller.customerControllers.otpController.getOTPVerificationPage);

//resend otp 
router.get('/resend/otp', controller.customerControllers.otpController.resendOTP)
//verify user
router.post('/verify', controller.customerControllers.otpController.verifyUser);

//forgot password
router.get('/forgotPassword', controller.customerControllers.passwordController.getForgotPasswordPage)

//forgot password checking for email
router.post('/getOtp', controller.customerControllers.otpController.getOTP)

//CHANGE PASSWORD
router.put('/forgotPassword', controller.customerControllers.passwordController.sendForgotPasswordRequest)

//verify otp for changing password
router.post('/verifyOtp', controller.customerControllers.otpController.verifyOTP);

// resend otp forgot password
router.post('/verifyOtp', controller.customerControllers.otpController.verifyOTP);


module.exports = router;
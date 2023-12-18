const userHelpers = require('../../../helpers/user/user-helpers');
const sessionHelpers = require('../../../helpers/user/session-helpers');
const otpHelpers = require('../../../helpers/user/otp-helpers');
const uuidv4 = require('uuid').v4
const signupUtil = require('../../../utils/signupUtil');


const getOTPVerificationPage = (req, res, next) => {
    res.render('customers/logins/userVerify', { layout: 'layout/layout' });
}

const resendOTP = (req, res, next) => {
    let emailId = req.cookies.Useremail 
    const otp = signupUtil.generateOTP();
    otpHelpers.getOtp(emailId, otp).then(result => {
        if (result.status === 'ok') { 
            res.redirect('/user/verify'); 
        } else {
            res.status(400).json({ status: "nok" });
        }
    }) 
}

const verifyUser = (req, res, next) => {
    let sessionId = req.cookies.session
    userHelpers.doVerifyUser(req.body).then((result) => {
        if (result && result.user) {
            const sessionId = uuidv4();
            const userId = result.user._id;

            sessionHelpers.saveSessions(sessionId, userId)
            res.cookie('session', sessionId);
            res.status(200).json({ status: "ok" });
        } else {
            res.status(400).json({ status: "nok" });
        }
    })
}

const getOTP = (req, res, next) => {
    let email = req.body.email;
    const otp = signupUtil.generateOTP();
    otpHelpers.getOtp(email, otp).then(result => {
        if (result.status === 'ok') {
            res.status(200).json({ status: "ok" });
        } else {
            res.status(400).json({ status: "nok" });
        }
    })
}

const verifyOTP = (req, res, next) => {
    let email = req.body.email;
    let otp = req.body.otp
    otpHelpers.verifyOtp(email, otp).then((result) => {
        if (result.status === 'ok') {
            res.status(200).json({ status: "ok" });
        } else {
            res.status(400).json({ status: "nok" });
        }
    })
}

module.exports = {
    getOTPVerificationPage,
    resendOTP,
    verifyUser,
    getOTP,
    verifyOTP
}
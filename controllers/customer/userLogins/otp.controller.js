const userHelpers = require('../../../helpers/user/user-helpers');
const sessionHelpers = require('../../../helpers/user/session-helpers');
const otpHelpers = require('../../../helpers/user/otp-helpers');
const uuidv4 = require('uuid').v4
const signupUtil = require('../../../utils/signupUtil');


const getOTPVerificationPage = (req, res, next) => {
    res.render('customers/logins/userVerify', { layout: 'layout/layout' });
}

const resendOTP = async (req, res, next) => {
    try {
        let emailId = req.cookies.Useremail;
        const otp = signupUtil.generateOTP();
        let result = await otpHelpers.getOtp(emailId, otp);

        if (result.status === 'ok') {
            res.redirect('/user/verify');
        } else {
            res.status(400).json({ status: "nok" });
        }
    } catch (error) {     
        console.error(error);        
    }
};

const verifyUser = async (req, res, next) => {
    try {
        let sessionId = req.cookies.session;
        let result = await userHelpers.doVerifyUser(req.body);

        if (result && result.user) {
            const sessionId = uuidv4();
            const userId = result.user._id;

            await sessionHelpers.saveSessions(sessionId, userId);
            res.cookie('session', sessionId);
            res.status(200).json({ status: "ok" });
        } else {
            res.status(400).json({ status: "nok" });
        }
    } catch (error) {
        console.error(error);
    }
};

const getOTP = async (req, res, next) => {
    try {
        let email = req.body.email;
        const otp = signupUtil.generateOTP();
        let result = await otpHelpers.getOtp(email, otp);

        if (result.status === 'ok') {
            res.status(200).json({ status: "ok" });
        } else {
            res.status(400).json({ status: "nok" });
        }
    } catch (error) {
        console.error(error);
    }
};

const verifyOTP = async (req, res, next) => {
    try {
        let email = req.body.email;
        let otp = req.body.otp;
        let result = await otpHelpers.verifyOtp(email, otp);

        if (result.status === 'ok') {
            res.status(200).json({ status: "ok" });
        } else {
            res.status(400).json({ status: "nok" });
        }
    } catch (error) {
        console.error(error);
    }
};

module.exports = {
    getOTPVerificationPage,
    resendOTP,
    verifyUser,
    getOTP,
    verifyOTP
}
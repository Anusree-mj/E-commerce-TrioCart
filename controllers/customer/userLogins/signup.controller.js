const userHelpers = require('../../../helpers/user/userHelpers/user-helpers');
const uuidv4 = require('uuid').v4
const signupUtil = require('../../../utils/signupUtil');


const getSignupPage = (req, res, next) => {
    res.render('customers/logins/signup', { layout: 'layout/layout' });
}

const sendUserSignupRequest = async (req, res, next) => {
    try {
        const otp = signupUtil.generateOTP();
        const result = await userHelpers.doSignup(req.body, otp);
        if (result.status === 'ok') {
            let email = result.email;
            res.cookie('Useremail', email);
            res.status(200).json({ status: "ok" });
        } else {
            res.status(400).json({ status: "nok" });
        }
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getSignupPage,
    sendUserSignupRequest
}
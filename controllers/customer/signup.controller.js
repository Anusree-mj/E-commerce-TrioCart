const userHelpers = require('../../helpers/user/user-helpers');
const sessionHelpers = require('../../helpers/user/session-helpers'); 
const uuidv4 = require('uuid').v4
const signupUtil = require('../../utils/signupUtil');


const getSignupPage =  (req, res, next) => {
    res.render('customers/logins/signup', { layout: 'layout/layout' });
}

const sendUserSignupRequest =  (req, res, next) => {
    const otp = signupUtil.generateOTP();
  userHelpers.doSignup(req.body, otp).then((result) => {
    if (result.status === 'ok') {
      let email=result.email;
      res.cookie('Useremail', email);
      res.status(200).json({ status: "ok" });
    } else {
      res.status(400).json({ status: "nok" });
    }
  })
}

module.exports = {
    getSignupPage,
    sendUserSignupRequest
}
var express = require('express');
var router = express.Router();

const userHelpers = require('../../helpers/user/user-helpers');
const sessionHelpers = require('../../helpers/user/session-helpers');
const userUpdateHelpers = require('../../helpers/user/userUpdate-helpers');
const otpHelpers = require('../../helpers/user/otp-helpers');

const uuidv4 = require('uuid').v4
const signupUtil = require('../../utils/signupUtil');


//get login page
router.get('/login', function (req, res, next) {
  res.render('users/logins/login', { layout: 'layout/layout' });
});

//loging in
router.post('/login', function (req, res, next) {
  userHelpers.dologin(req.body).then((result) => {
    console.log('result in post ', result)
    if (result.user) {
      const sessionId = uuidv4();
      const userId = result.user._id
      sessionHelpers.saveSessions(sessionId, userId)
      res.cookie('session', sessionId);
      res.status(200).json({ status: "ok" });
    } else if (result.status === 'invalid') {
      res.status(400).json({ status: "invalid" });
    } else {
      res.status(400).json({ status: "blocked" });
    }
  })
});

//get signup page
router.get('/signup', function (req, res, next) {
  res.render('users/logins/signup', { layout: 'layout/layout' });
});

//signup
router.post('/signup', function (req, res, next) {
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
});

//get otp verification page
router.get('/verify', function (req, res, next) {
  res.render('users/logins/userVerify', { layout: 'layout/layout' });
});

//resend otp 
router.get('/resend/otp', async function (req, res, next) {
  let emailId = req.cookies.Useremail  
  const otp = signupUtil.generateOTP();
  otpHelpers.getOtp(emailId, otp).then(result => {
    if (result.status === 'ok') {
      res.redirect('/user/verify');
    } else {
      res.status(400).json({ status: "nok" });
    }
  })
})
//verify user
router.post('/verify', function (req, res, next) {
  let sessionId = req.cookies.session
  userHelpers.doVerifyUser(req.body).then((result) => {
    if (result && result.user) {
      const sessionId = uuidv4();
      const userId = result.user._id;

      console.log('dfsdjfdsjfsdhkj', userId)
      sessionHelpers.saveSessions(sessionId, userId)
      res.cookie('session', sessionId);
      res.status(200).json({ status: "ok" });
    } else {
      res.status(400).json({ status: "nok" });
    }
  })
});

//forgot password
router.get('/forgotPassword', (req, res, nxt) => {
  res.render('users/logins/changePassword', { layout: 'layout/layout' });
})

//forgot password checking for email
router.post('/getOtp', (req, res, next) => {
  let email = req.body.email;
  const otp = signupUtil.generateOTP();
  otpHelpers.getOtp(email, otp).then(result => {
    if (result.status === 'ok') {
      res.status(200).json({ status: "ok" });
    } else {
      res.status(400).json({ status: "nok" });
    }
  })
})

//CHANGE PASSWORD
router.put('/forgotPassword', (req, res, nxt) => {
  let email = req.body.email
  let password = req.body.password
  userUpdateHelpers.updatePassword(email, password).then((result) => {
    if (result.status === 'ok') {
      res.status(200).json({ status: "ok" });
    } else {
      res.status(400).json({ status: "nok" });
    }
  })
})

//verify otp for changing password
router.post('/verifyOtp', function (req, res, next) {
  let email = req.body.email;
  let otp = req.body.otp
  otpHelpers.verifyOtp(email, otp).then((result) => {
    if (result.status === 'ok') {
      res.status(200).json({ status: "ok" });
    } else {
      res.status(400).json({ status: "nok" });
    }
  })
});

module.exports = router;
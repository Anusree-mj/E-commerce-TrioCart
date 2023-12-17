const userHelpers = require('../../../helpers/user/user-helpers');
const sessionHelpers = require('../../../helpers/user/session-helpers'); 
const uuidv4 = require('uuid').v4

const getLoginPage =  (req, res, next) => {
    res.render('customers/logins/login', { layout: 'layout/layout' });
}

const sendUserLoginRequest =  (req, res, next) => {
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
}

const logout =  (req, res, next) => {
  let sessionId = req.cookies.session
  sessionHelpers.deleteSessions(sessionId).then((result) => {
    if (result) {
      req.session.isAuthenticated = false;
      req.session.destroy(function (err) {
        res.clearCookie('session');
        res.redirect('/');
      })
    }
  })
}

module.exports = {
    getLoginPage,
    sendUserLoginRequest,
    logout
}
const userHelpers = require('../../../helpers/user/user-helpers');
const sessionHelpers = require('../../../helpers/user/session-helpers'); 
const uuidv4 = require('uuid').v4

const getLoginPage = (req, res, next) => {
  res.render('customers/logins/login', { layout: 'layout/layout' });
};

const sendUserLoginRequest = async (req, res, next) => {
  try {
      const result = await userHelpers.dologin(req.body);
      console.log('result in post ', result);

      if (result.user) {
          const sessionId = uuidv4();
          const userId = result.user._id;
          await sessionHelpers.saveSessions(sessionId, userId);
          res.cookie('session', sessionId);
          res.status(200).json({ status: "ok" });
      } else if (result.status === 'invalid') {
          res.status(400).json({ status: "invalid" });
      } else {
          res.status(400).json({ status: "blocked" });
      }
  } catch (error) {
      next(error);
  }
};

const logout = async (req, res, next) => {
  try {
      let sessionId = req.cookies.session;
      let result = await sessionHelpers.deleteSessions(sessionId);

      if (result) {
          req.session.isAuthenticated = false;
          req.session.destroy(function (err) {
              res.clearCookie('session');
              res.redirect('/');
          });
      }
  } catch (error) {
      next(error);
  }
};

module.exports = {
    getLoginPage,
    sendUserLoginRequest,
    logout
}
const uuidv4 = require('uuid').v4
const adminLoginHelpers = require('../../../helpers/admin/login/adminLogin-helpers');

const getLoginPage = (req, res, next) => {
  res.render('admin/adminLogin', { layout: 'layout/layout' });
};

const sendAdminLoginRequest = async (req, res, next) => {
  try {
    let admin = await adminLoginHelpers.dologin(req.body);

    if (admin) {
      const sessionId = uuidv4();
      const adminId = admin.email;
      await adminLoginHelpers.saveSessions(sessionId, adminId);
      res.cookie('adminSession', sessionId);
      res.status(200).json({ status: "ok" });
    } else {
      res.status(400).json({ status: "nok" });
    }
  } catch (error) {
   next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    let sessionId = req.cookies.adminSession;
    let result = await adminLoginHelpers.deleteSessions(sessionId);

    if (result) {
      req.session.destroy(function (err) {
        res.clearCookie('connect.sid');
        res.redirect('/admin');
      });
    }
  } catch (error) {
   next(error);
  }
};


module.exports = {
  getLoginPage,
  sendAdminLoginRequest,
  logout
}

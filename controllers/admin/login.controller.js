const uuidv4 = require('uuid').v4
const adminLoginHelpers = require('../../helpers/admin/login/adminLogin-helpers');
const getLoginPage = (req, res, next) => {
    res.render('admin/adminLogin', { layout: 'layout/layout' });
}
const sendAdminLoginRequest = (req, res, next) => {
    adminLoginHelpers.dologin(req.body).then((admin) => {
        if (admin) {
          const sessionId = uuidv4();
          const adminId = admin.email
          adminLoginHelpers.saveSessions(sessionId, adminId)
          res.cookie('adminSession', sessionId);
          res.status(200).json({ status: "ok" });
        } else {
          res.status(400).json({ status: "nok" });
        }
      })
}

module.exports = { getLoginPage, sendAdminLoginRequest }

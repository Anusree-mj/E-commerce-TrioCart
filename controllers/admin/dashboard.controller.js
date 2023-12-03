const adminLoginHelpers = require('../../helpers/admin/login/adminLogin-helpers');

const getDashboardPage = (req, res, next) => {
  let sessionId = req.cookies.adminSession
  console.log('session id of admin: ', sessionId)
  adminLoginHelpers.checkSessions(sessionId).then((result) => {
    if (result.status === 'ok') {
      adminLoginHelpers.getAdmin(result.adminId).then((admin) => {
        res.render('admin/adminDashboard', { layout: 'layout/layout', admin });
      })
    }
    else {
      res.redirect('/admin/login');
    }
  });
}
module.exports = { getDashboardPage }

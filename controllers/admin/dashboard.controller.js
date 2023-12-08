const adminLoginHelpers = require('../../helpers/admin/login/adminLogin-helpers');
const adminorderHelpers = require('../../helpers/admin/orders/adminOrder-helpers');

const getDashboardPage = (req, res, next) => {
  let sessionId = req.cookies.adminSession
  console.log('session id of admin: ', sessionId)

  adminLoginHelpers.checkSessions(sessionId).then((result) => {
    if (result.status === 'ok') {
      adminLoginHelpers.getAdmin(result.adminId).then((admin) => {

        adminorderHelpers.getAllOrders().then(result => {
          const orders = result.orders
          res.render('admin/adminDashboard', {
            layout: 'layout/layout', admin, orders
          });
        })
      })
    }
    else {
      res.redirect('/admin/login');
    }
  });
}

const getOrderGraph = (req, res, next) => {
  adminorderHelpers.getAllOrders().then(result => {
    const orders = result.orders
    if (orders) {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json({ status: "ok", orders });
    }
    else {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json({ status: "nok" });
    }
  })
}
module.exports = {
  getDashboardPage,
  getOrderGraph
}

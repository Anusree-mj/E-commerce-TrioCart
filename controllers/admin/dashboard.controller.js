const adminLoginHelpers = require('../../helpers/admin/login/adminLogin-helpers');
const adminorderHelpers = require('../../helpers/admin/orders/adminOrder-helpers');
const userHelpers = require('../../helpers/admin/manageUser/adminUser-helpers');

const getDashboardPage = async (req, res, next) => {
  let sessionId = req.cookies.adminSession

  adminLoginHelpers.checkSessions(sessionId).then((result) => {
    if (result.status === 'ok') {
      adminLoginHelpers.getAdmin(result.adminId).then((admin) => {

        adminorderHelpers.getTotalCounts().then(result => {
          const ordersYetToBeShipped = result.yetToBeShippedCount;
          const totalOrders = result.totalOrders;
          const ordersDelivered = result.deliveredCount;
          const totalUsers = result.userCounts;
          
          res.render('admin/adminDashboard', {
            layout: 'layout/layout', admin, ordersYetToBeShipped, ordersDelivered,
            totalOrders, totalUsers
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
  adminorderHelpers.getAllOrdersGraph().then(result => {
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

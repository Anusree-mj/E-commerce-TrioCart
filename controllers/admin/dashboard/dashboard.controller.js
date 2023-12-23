const adminLoginHelpers = require('../../../helpers/admin/login/adminLogin-helpers');
const adminorderHelpers = require('../../../helpers/admin/orders/adminOrder-helpers');

const getDashboardPage = async (req, res, next) => {
  try {
    let sessionId = req.cookies.adminSession;
    let result = await adminLoginHelpers.checkSessions(sessionId);

    if (result.status === 'ok') {
      let admin = await adminLoginHelpers.getAdmin(result.adminId);
      let countsResult = await adminorderHelpers.getTotalCounts();

      const ordersYetToBeShipped = countsResult.yetToBeShippedCount;
      const totalOrders = countsResult.totalOrders;
      const ordersDelivered = countsResult.deliveredCount;
      const totalUsers = countsResult.userCounts;

      res.render('admin/adminDashboard/dashboard', {
        layout: 'layout/layout',
        admin,
        ordersYetToBeShipped,
        ordersDelivered,
        totalOrders,
        totalUsers
      });
    } else {
      res.redirect('/admin/login');
    }
  } catch (error) {
    next(error);
  }
};

const getOrderGraph = async (req, res, next) => {
  try {
    let result = await adminorderHelpers.getAllOrdersGraph();
    const orders = result.orders;

    if (orders) {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json({ status: "ok", orders });
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json({ status: "nok" });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardPage,
  getOrderGraph
}

const adminLoginHelpers = require('../../../helpers/admin/login/adminLogin-helpers');
const adminOrderHelpers = require('../../../helpers/admin/orders/adminOrder-helpers');

const getOrderPage = async (req, res, next) => {
    try {
        let sessionId = req.cookies.adminSession;
        let result = await adminLoginHelpers.checkSessions(sessionId);

        if (result.status === 'ok') {
            let results = await adminOrderHelpers.getAllOrders();
            let orders = results.orders;
            res.render('admin/adminOrders/ordersPage', { layout: 'layout/layout', orders });
        } else {
            res.redirect('/admin');
        }
    } catch (error) {
        console.error(error);
    }
};

const editOrderStatus = async (req, res, next) => {
    try {
        let data = req.body;
        let result = await adminOrderHelpers.updateOrderStatus(data);

        if (result.status === 'ok') {
            res.status(200).json({ status: "ok" });
        } else {
            res.status(500).json({ status: "nok" });
        }
    } catch (error) {
        console.error(error);
    }
};

const getOrderDetailPage = async (req, res, next) => {
    try {
        let orderId = req.params.orderId;
        let sessionId = req.cookies.adminSession;
        let result = await adminLoginHelpers.checkSessions(sessionId);

        if (result.status === 'ok') {
            let resultOrder = await adminOrderHelpers.getAnOrder(orderId);
            let order = resultOrder.order;

            res.render('admin/adminOrders/adminOrderDetails', { layout: 'layout/layout', order });
        } else {
            res.redirect('/admin/login');
        }
    } catch (error) {
        console.error(error);
    }
};


module.exports = {
    getOrderPage,
    editOrderStatus,
    getOrderDetailPage
}
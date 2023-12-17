const adminLoginHelpers = require('../../helpers/admin/login/adminLogin-helpers');
const adminOrderHelpers = require('../../helpers/admin/orders/adminOrder-helpers');

const getOrderPage = (req, res, next) => {
    let sessionId = req.cookies.adminSession
    adminLoginHelpers.checkSessions(sessionId).then(result => {

        if (result.status === 'ok') {
            adminOrderHelpers.getAllOrders().then((results) => {
                let orders = results.orders
                res.render('admin/adminOrders/ordersPage', { layout: 'layout/layout', orders });
            })
        }
        else {
            res.redirect('/admin');
        }
    })
}

const editOrderStatus = (req, res, next) => {
    let data = req.body;
    adminOrderHelpers.updateOrderStatus(data).then((result) => {

        if (result.status === 'ok') {
            res.status(200).json({ status: "ok" });
        }
        else {
            res.status(500).json({ status: "nok" });
        }
    })
}

const getOrderDetailPage = (req, res, next) => {
    let orderId = req.params.orderId;
    let sessionId = req.cookies.adminSession
    adminLoginHelpers.checkSessions(sessionId).then((result) => {

        if (result.status === 'ok') {
            adminOrderHelpers.getAnOrder(orderId).then((result) => {
                let order = result.order

                res.render('admin/adminOrders/adminOrderDetails', { layout: 'layout/layout', order });
            })
        }
        else {
            res.redirect('/admin/login')
        }
    })
}

module.exports = {
    getOrderPage,
    editOrderStatus,
    getOrderDetailPage
}
const adminLoginHelpers = require('../../helpers/admin/login/adminLogin-helpers');
const adminReturnHelpers = require('../../helpers/admin/orders/returns-helpers');

const getReturnsPage = (req, res, next) => {
    let sessionId = req.cookies.adminSession
    adminLoginHelpers.checkSessions(sessionId).then((result) => {

        if (result.status === 'ok') {
            adminReturnHelpers.getAllProductReturns().then((result) => {
                const returnDetails = result.returns
                const orderId = returnDetails.orderId;
                console.log('orderid in return',orderId)
                console.log('returns:::', returnDetails)
                res.render('admin/adminOrders/adminReturns', { layout: 'layout/layout', returnDetails,orderId });
            })
        }
        else {
            res.redirect('/admin/login')
        }
    })
}

const editReturnStatus = (req, res, next) => {
    let data = req.body;
    adminReturnHelpers.updateReturnStatus(data).then((result) => {

        if (result.status === 'ok') {
            res.status(200).json({ status: "ok" });
        }
        else {
            res.status(500).json({ status: "nok" });
        }
    })
}

module.exports = {
    getReturnsPage,
    editReturnStatus
}
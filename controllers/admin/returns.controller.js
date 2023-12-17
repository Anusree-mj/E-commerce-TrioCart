const adminLoginHelpers = require('../../helpers/admin/login/adminLogin-helpers');
const adminReturnHelpers = require('../../helpers/admin/orders/returns-helpers');
const razorpayUtil = require('../../utils/razorpayUtil')
const adminUserHelpers = require('../../helpers/admin/manageUser/adminUser-helpers');

const getReturnsPage = (req, res, next) => {
    let sessionId = req.cookies.adminSession
    adminLoginHelpers.checkSessions(sessionId).then((result) => {

        if (result.status === 'ok') {
            adminReturnHelpers.getAllProductReturns().then((result) => {
                const returnDetails = result.returns
                const orderId = returnDetails.orderId;
                console.log('orderid in return', orderId)
                console.log('returns:::', returnDetails)
                res.render('admin/adminOrders/adminReturns', { layout: 'layout/layout', returnDetails, orderId });
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
let userId;
const doRefund = async (req, res, next) => {
    let sessionId = req.cookies.adminSession;
    const { returnId, amount } = req.body
    userId = req.body.userId;
    adminLoginHelpers.checkSessions(sessionId).then(async (result) => {
        if (result.status === 'ok') {
            const order = await razorpayUtil.createRazorpayOrder(returnId, amount);
            console.log('order in route', order)
            if (order) {
                adminUserHelpers.getAUser(userId).then(result => {
                    const user = result.user
                    res.status(200).json({ status: "ok", order, user });
                })
            }
            else {
                res.status(200).json({ status: "ok" });
            }

        }
        else {
            res.redirect('/admin/login')
        }
    })
}

const verifyPayment = async (req, res, next) => {
    console.log('payment details', req.body)
    let sessionId = req.cookies.adminSession;
    let paymentDetails = req.body
    adminLoginHelpers.checkSessions(sessionId).then(async (result) => {
        if (result.status === 'ok') {
            const paymentMatch = razorpayUtil.verifyPayment(paymentDetails)
            if (paymentMatch.status === 'ok') {
                const saveResult = await adminReturnHelpers.savePaymentDetails(paymentDetails, userId);
               
                if (saveResult.status === 'ok') {
                    res.status(200).json({ status: "ok" });
                }

            }
            else {
                console.log('payment doesnt match')
                res.status(400).json({ status: "nok" });
            }
        }
        else {
            res.redirect('/admin/login')
        }
    })
}

module.exports = {
    getReturnsPage,
    editReturnStatus,
    doRefund,
    verifyPayment
}
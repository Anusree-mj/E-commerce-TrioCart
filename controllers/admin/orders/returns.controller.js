const adminLoginHelpers = require('../../../helpers/admin/login/adminLogin-helpers');
const adminReturnHelpers = require('../../../helpers/admin/orders/returns-helpers');
const razorpayUtil = require('../../../utils/razorpayUtil')
const adminUserHelpers = require('../../../helpers/admin/manageUser/adminUser-helpers');

const getReturnsPage = async (req, res, next) => {
    try {
        let sessionId = req.cookies.adminSession;
        let result = await adminLoginHelpers.checkSessions(sessionId);

        if (result.status === 'ok') {
            let resultReturns = await adminReturnHelpers.getAllProductReturns();
            const returnDetails = resultReturns.returns;
            const orderId = returnDetails.orderId;
            res.render('admin/adminOrders/adminReturns', { layout: 'layout/layout', returnDetails, orderId });
        } else {
            res.redirect('/admin/login');
        }
    } catch (error) {
        console.error(error);
    }
};

const editReturnStatus = async (req, res, next) => {
    try {
        let data = req.body;
        let result = await adminReturnHelpers.updateReturnStatus(data);

        if (result.status === 'ok') {
            res.status(200).json({ status: "ok" });
        } else {
            res.status(500).json({ status: "nok" });
        }
    } catch (error) {
        console.error(error);
    }
};

let userId;

const doRefund = async (req, res, next) => {
    try {
        let sessionId = req.cookies.adminSession;
        const { returnId, amount } = req.body;
        userId = req.body.userId;
        let result = await adminLoginHelpers.checkSessions(sessionId);

        if (result.status === 'ok') {
            const order = await razorpayUtil.createRazorpayOrder(returnId, amount);

            if (order) {
                let userResult = await adminUserHelpers.getAUser(userId);
                const user = userResult.user;
                res.status(200).json({ status: "ok", order, user });
            } else {
                res.status(200).json({ status: "ok" });
            }
        } else {
            res.redirect('/admin/login');
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error" });
    }
};

const verifyPayment = async (req, res, next) => {
    let sessionId = req.cookies.adminSession;
    let paymentDetails = req.body;

    try {
        let result = await adminLoginHelpers.checkSessions(sessionId);

        if (result.status === 'ok') {
            const paymentMatch = razorpayUtil.verifyPayment(paymentDetails);

            if (paymentMatch.status === 'ok') {
                const saveResult = await adminReturnHelpers.savePaymentDetails(paymentDetails, userId);

                if (saveResult.status === 'ok') {
                    res.status(200).json({ status: "ok" });
                }
            } else {
                res.status(400).json({ status: "nok" });
            }
        } else {
            res.redirect('/admin/login');
        }
    } catch (error) {
        console.error(error);
    }
};

module.exports = {
    getReturnsPage,
    editReturnStatus,
    doRefund,
    verifyPayment
}
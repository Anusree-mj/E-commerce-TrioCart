const sessionHelpers = require('../../../helpers/user/session-helpers');
const cartHelpers = require('../../../helpers/user/cart-helpers');
const orderHelpers = require('../../../helpers/user/orderHelpers');
const verifyPaymentHelpers = require('../../../helpers/user/verifyPayment-helpers');
const razorpayUtil = require('../../../utils/razorpayUtil');
const couponHelpers = require('../../../helpers/admin/manageUser/coupon-helpers');


const getCheckoutPage = async (req, res, next) => {
    try {
        const sessionId = req.cookies.session;
        const sessionResult = await sessionHelpers.checkSessions(sessionId);

        if (sessionResult.status === 'ok') {
            const user = sessionResult.user;
            const cartResult = await cartHelpers.getMyCartProducts(user);

            if (cartResult.stockAvailability) {
                const { cartId, discount, cartProducts, totalprice, totalCount } = cartResult;
                const coupons = await couponHelpers.getAllCoupons();

                console.log('idtotalprice in checkoutdd', totalprice)
                res.render('customers/c&c/checkout', {
                    layout: 'layout/layout',
                    user,
                    cartProducts,
                    totalCartProduct: totalCount,
                    totalprice,
                    cartId,
                    discount,coupons
                });
            } else {
                res.redirect('/cart');
            }
        } else {
            res.redirect('/user/login');
        }
    } catch (err) {
        next(err);
    }
};

const saveOrderAddress = async (req, res, next) => {
    try {
        let userId = req.params.userId;
        let sessionId = req.cookies.session;

        const sessionResult = await sessionHelpers.checkSessions(sessionId);

        if (sessionResult.status === 'ok') {
            const result = await orderHelpers.saveOrderAddress(userId, req.body);

            if (result.status === 'ok') {
                res.status(200).json({ status: "ok" });
            } else {
                res.status(400).json({ status: "nok" });
            }
        } else {
            res.redirect('/user/login');
        }
    } catch (err) {
        next(err);
    }
};

const submitCheckoutPageDetails = async (req, res, next) => {
    try {
        let orderDetails = req.body;
        let sessionId = req.cookies.session;

        const sessionResult = await sessionHelpers.checkSessions(sessionId);

        if (sessionResult.status === 'ok') {
            const user = sessionResult.user;
            const result = await orderHelpers.saveOrderDetails(orderDetails);

            if (result.status === 'ok') {
                if (orderDetails.paymentMethod === 'onlinePayment') {
                    let orderId = result.orderId;
                    let totalAmount = result.totalAmount;
                    const order = await razorpayUtil.createRazorpayOrder(orderId, totalAmount);
                    console.log('order in route', order);
                    res.status(200).json({ status: "ok", order, user });
                } else {
                    res.status(200).json({ status: "ok" });
                }
            } else {
                res.status(400).json({ status: "nok" });
            }
        }
    } catch (err) {
        next(err);
    }
};

const verifyPayment = async (req, res, next) => {
    try {
        console.log('payment details', req.body);
        let sessionId = req.cookies.session;
        let paymentDetails = req.body;
        const sessionResult = await sessionHelpers.checkSessions(sessionId);
        const user = sessionResult.user;

        const paymentMatch = await razorpayUtil.verifyPayment(paymentDetails);

        if (paymentMatch.status === 'ok') {
            const saveResult = await verifyPaymentHelpers.savePaymentDetails(paymentDetails, user);
            if (saveResult.status === 'ok') {
                res.status(200).json({ status: "ok" });
            }
        } else {
            console.log('payment doesnt match');
            res.status(400).json({ status: "nok" });
        }
    } catch (err) {
        next(err);
    }
};


module.exports = {
    getCheckoutPage,
    saveOrderAddress,
    submitCheckoutPageDetails,
    verifyPayment
}
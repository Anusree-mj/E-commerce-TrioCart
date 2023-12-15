const sessionHelpers = require('../../../helpers/user/session-helpers');
const cartHelpers = require('../../../helpers/user/cart-helpers');
const orderHelpers = require('../../../helpers/user/orderHelpers');
const verifyPaymentHelpers = require('../../../helpers/user/verifyPayment-helpers');
const razorpayUtil = require('../../../utils/razorpayUtil')

const getCheckoutPage = async (req, res, next) => {
    try {
        const sessionId = req.cookies.session;
        const sessionResult = await sessionHelpers.checkSessions(sessionId);

        if (sessionResult.status === 'ok') {
            const user = sessionResult.user;
            const cartResult = await cartHelpers.getMyCartProducts(user);

            if (cartResult.stockAvailability) {
                console.log('dsfdsf',cartResult.stockAvailability)
                const {cartProducts,totalprice,totalCount}=cartResult;               

                res.render('customers/c&c/checkout', {
                    layout: 'layout/layout',
                    user,
                    cartProducts,
                    totalCartProduct:totalCount,
                    totalprice
                });
            } else {
                res.redirect('/cart');
            }
        } else {
            res.redirect('/user/login');
        }
    } catch (err) {
        console.log(err);
    }
};

const saveOrderAddress = (req, res, next) => {
    let userId = req.params.userId;
    let sessionId = req.cookies.session

    sessionHelpers.checkSessions(sessionId).then((result) => {
        if (result.status === 'ok') {

            orderHelpers.saveOrderAddress(userId, req.body).then(result => {
                if (result.status === 'ok') {
                    res.status(200).json({ status: "ok" });
                } else {
                    res.status(400).json({ status: "nok" });
                }
            })
        } else {
            res.redirect('/user/login')
        }
    })
}

const submitCheckoutPageDetails = (req, res, next) => {
    let orderDetails = req.body;
    let sessionId = req.cookies.session

    sessionHelpers.checkSessions(sessionId).then((result) => {
        if (result.status === 'ok') {
            const user = result.user
            orderHelpers.saveOrderDetails(orderDetails).then(async (result) => {
                if (result.status === 'ok') {
                    if (orderDetails.paymentMethod === 'onlinePayment') {
                        let orderId = result.orderId
                        let totalAmount = result.totalAmount
                        const order = await razorpayUtil.createRazorpayOrder(orderId, totalAmount);
                        console.log('order in route', order)
                        res.status(200).json({ status: "ok", order, user });
                    }
                    else {
                        res.status(200).json({ status: "ok" });
                    }
                }
                else {
                    res.status(400).json({ status: "nok" });
                }
            })
        }
    })
}

const verifyPayment = async (req, res, next) => {
    console.log('payment details', req.body)
    let sessionId = req.cookies.session
    let paymentDetails = req.body
    const sessionResult = await sessionHelpers.checkSessions(sessionId);
    const user = sessionResult.user

    const paymentMatch = razorpayUtil.verifyPayment(paymentDetails)
    if (paymentMatch.status === 'ok') {
        const saveResult = await verifyPaymentHelpers.savePaymentDetails(paymentDetails, user);
        if (saveResult.status === 'ok') {
            res.status(200).json({ status: "ok" });
        }

    }
    else {
        console.log('payment doesnt match')
        res.status(400).json({ status: "nok" });
    }

}

module.exports = {
    getCheckoutPage,
    saveOrderAddress,
    submitCheckoutPageDetails,
    verifyPayment
}
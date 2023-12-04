const sessionHelpers = require('../../helpers/user/session-helpers');
const cartHelpers = require('../../helpers/user/cart-helpers');
const orderHelpers = require('../../helpers/user/orderHelpers');

const getCheckoutPage = (req, res, next) => {
    let sessionId = req.cookies.session
    sessionHelpers.checkSessions(sessionId).then((result) => {
        if (result.status === 'ok') {
            let user = result.user;

            cartHelpers.getMyCartProducts(user).then((result) => {
                if (result.cartProducts) {
                    let cartProducts = result.cartProducts;
                    let totalprice = result.totalprice;
                    let totalCartProduct = result.totalCount;
                    res.render('users/checkout', {
                        layout: 'layout/layout', user, cartProducts
                        , totalCartProduct, totalprice
                    })
                }
            });
        }
        else {
            res.redirect('/user/login')
        }
    })
}

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
    let orderDetails = req.body
    orderHelpers.saveOrderDetails(orderDetails).then((result) => {
        if (result.status === 'ok') {
            res.status(200).json({ status: "ok" });
        }
        else {
            res.status(400).json({ status: "nok" });
        }
    })
}

module.exports = {
    getCheckoutPage,
    saveOrderAddress,
    submitCheckoutPageDetails
}
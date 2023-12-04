const productHelpers = require('../../helpers/user/product-helpers')
const sessionHelpers = require('../../helpers/user/session-helpers');
const categoryHelpers = require('../../helpers/user/category-helpers');
const cartHelpers = require('../../helpers/user/cart-helpers');
const orderHelpers = require('../../helpers/user/orderHelpers');

const getOrderSuccessPage = (req, res, next) => {
    let sessionId = req.cookies.session
    sessionHelpers.checkSessions(sessionId).then((result) => {
        if (result.status === 'ok') {
            let userId = result.user._id;
            let userName = result.user.name

            orderHelpers.getAllOrderDetails(userId).then((result) => {
                if (result.status === 'ok') {
                    let estimatedTym = result.estimatedDelivery;
                    let latestOrder = result.latestOrder

                    res.render('users/orderSuccess', { layout: 'layout/layout', estimatedTym, userName, latestOrder });
                }
            })
        }
        else {
            res.redirect('/user/login')
        }
    })
}

const getOrderHistoryPage = async (req, res, next) => {
    let sessionId = req.cookies.session
    let allCategories = await categoryHelpers.getCategoryDetails()
    sessionHelpers.checkSessions(sessionId).then((result) => {
        if (result.status === 'ok') {
            let user = result.user
            let userId = result.user._id;

            cartHelpers.getMyCartProducts(userId).then((result) => {
                if (result) {
                    let totalCartProduct = result.totalCount;

                    orderHelpers.getAllOrderDetails(userId).then((result) => {
                        if (result.status === 'ok') {
                            let orderDetails = result.orderDetails

                            productHelpers.getNewArrivalProducts().then(result => {
                                let viewMoreProducts = [
                                    ...result.category1, ...result.category2, ...result.category3, ...result.category4];
                                res.render('users/orderHistory', { layout: 'layout/layout', user, allCategories, totalCartProduct, orderDetails, viewMoreProducts });
                            })
                        }
                    })
                }
            })
        } else {
            res.redirect('/user/login')
        }
    })
}

const getOrderDetailPage = async (req, res, next) => {
    let orderId = req.params.orderId;
    let sessionId = req.cookies.session
    let allCategories = await categoryHelpers.getCategoryDetails()

    sessionHelpers.checkSessions(sessionId).then((result) => {
        if (result.status === 'ok') {
            let user = result.user
            let userId = result.user._id;

            cartHelpers.getMyCartProducts(userId).then((result) => {
                if (result) {
                    let totalCartProduct = result.totalCount;

                    orderHelpers.getAnOrder(orderId).then((result) => {
                        let order = result.order

                        productHelpers.getNewArrivalProducts().then(result => {
                            let viewMoreProducts = [
                                ...result.category1, ...result.category2, ...result.category3, ...result.category4];
                            res.render('users/orderDetails', { layout: 'layout/layout', user, allCategories, totalCartProduct, order, viewMoreProducts });
                        })
                    })
                }
            })
        } else {
            res.redirect('/user/login')
        }
    })
}

module.exports = {
    getOrderSuccessPage,
    getOrderHistoryPage,
    getOrderDetailPage
}
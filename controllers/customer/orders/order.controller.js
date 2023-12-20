const productHelpers = require('../../../helpers/user/product-helpers')
const sessionHelpers = require('../../../helpers/user/session-helpers');
const categoryHelpers = require('../../../helpers/user/category-helpers');
const cartHelpers = require('../../../helpers/user/cart-helpers');
const orderHelpers = require('../../../helpers/user/orderHelpers');

const getOrderSuccessPage = async (req, res, next) => {
    try {
        let sessionId = req.cookies.session;
        let result = await sessionHelpers.checkSessions(sessionId);

        if (result.status === 'ok') {
            let userId = result.user._id;
            let userName = result.user.name;

            let orderDetails = await orderHelpers.getAllOrderDetails(userId);

            if (orderDetails.status === 'ok') {
                let estimatedTym = orderDetails.estimatedDelivery;
                let latestOrder = orderDetails.latestOrder;

                res.render('customers/orders/orderSuccess', { layout: 'layout/layout', estimatedTym, userName, latestOrder });
            }
        } else {
            res.redirect('/user/login');
        }
    } catch (error) {
        next(error);
    }
};

const getOrderHistoryPage = async (req, res, next) => {
    try {
        let sessionId = req.cookies.session;
        let allCategories = await categoryHelpers.getCategoryDetails();
        let result = await sessionHelpers.checkSessions(sessionId);

        if (result.status === 'ok') {
            let user = result.user;
            let userId = result.user._id;

            let cartResult = await cartHelpers.getMyCartProducts(userId);

            if (cartResult) {
                let totalCartProduct = cartResult.totalCount;

                let orderDetails = await orderHelpers.getAllOrderDetails(userId);

                if (orderDetails.status === 'ok') {
                    let viewMoreProducts = await getProductViewMoreProducts();
                    res.render('customers/orders/orderHistory', {
                        layout: 'layout/layout', user, allCategories, totalCartProduct,
                        orderDetails: orderDetails.orderDetails, viewMoreProducts
                    });
                } else {
                    let viewMoreProducts = await getProductViewMoreProducts();
                    res.render('customers/orders/orderHistory', {
                        layout: 'layout/layout', user, allCategories,
                        totalCartProduct, orderDetails: undefined, viewMoreProducts
                    });
                }
            }
        } else {
            res.redirect('/user/login');
        }
    } catch (error) {
        next(error);
    }
};

const getOrderDetailPage = async (req, res, next) => {
    try {
        let orderId = req.params.orderId;
        let sessionId = req.cookies.session;
        let allCategories = await categoryHelpers.getCategoryDetails();

        let result = await sessionHelpers.checkSessions(sessionId);

        if (result.status === 'ok') {
            let user = result.user;
            let userId = result.user._id;

            let cartResult = await cartHelpers.getMyCartProducts(userId);

            if (cartResult) {
                let totalCartProduct = cartResult.totalCount;

                let orderResult = await orderHelpers.getAnOrder(orderId);

                let order = orderResult.order;
                let userReadableId = orderResult.userReadableOrderId;

                let newArrivalResult = await productHelpers.getNewArrivalProducts();
                let viewMoreProducts = [
                    ...newArrivalResult.category1, ...newArrivalResult.category2, ...newArrivalResult.category3, ...newArrivalResult.category4
                ];

                res.render('customers/orders/orderDetails', {
                    layout: 'layout/layout',
                    user,
                    allCategories,
                    totalCartProduct,
                    order,
                    viewMoreProducts,
                    userReadableId
                });
            }
        } else {
            res.redirect('/user/login');
        }
    } catch (error) {
        console.error(error);
    }
};


const cancelOrder = async (req, res, next) => {
    try {
        let orderId = req.params.orderId;
        let sessionId = req.cookies.session;
        let result = await sessionHelpers.checkSessions(sessionId);

        if (result.status === 'ok') {
            let cancelResult = await orderHelpers.cancelAnOrder(orderId);

            if (cancelResult.status === 'ok') {
                res.status(200).json({ status: "ok" });
            } else {
                res.status(400).json({ status: "nok" });
            }
        }
    } catch (error) {
        next(error);
    }
};

const returnProduct = async (req, res, next) => {
    try {
        let productId = req.params.productId;
        let returnDetails = req.body;
        let sessionId = req.cookies.session;
        let result = await sessionHelpers.checkSessions(sessionId);

        if (result.status === 'ok') {
            let userId = result.user;
            let returnResult = await orderHelpers.returnProduct(productId, returnDetails, userId);

            if (returnResult.status === 'ok') {
                console.log('return data added to db');
                res.status(200).json({ status: "ok" });
            } else {
                res.status(400).json({ status: "nok" });
            }
        }
    } catch (error) {
        next(error);
    }
};

async function getProductViewMoreProducts() {
    let result = await productHelpers.getNewArrivalProducts();
    return [...result.category1, ...result.category2, ...result.category3, ...result.category4];
}


module.exports = {
    getOrderSuccessPage,
    getOrderHistoryPage,
    getOrderDetailPage,
    cancelOrder,
    returnProduct
}
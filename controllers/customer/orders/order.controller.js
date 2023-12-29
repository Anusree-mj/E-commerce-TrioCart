const productHelpers = require('../../../helpers/user/products/product-helpers');
const sessionHelpers = require('../../../helpers/user/userHelpers/session-helpers');
const categoryHelpers = require('../../../helpers/user/products/category-helpers');
const cartHelpers = require('../../../helpers/user/c&c/cart-helpers');
const orderHelpers = require('../../../helpers/user/orders/orderHelpers');

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
                // pagination
                let currentPage = parseInt(req.query.page) || 1;
                const ordersPerPage = 3;
                const skip = (currentPage - 1) * ordersPerPage;
                let orderDetails = await orderHelpers.getAllOrderDetails(userId, skip, ordersPerPage);

                if (orderDetails.status === 'ok') {
                    const totalOrdersResult = await orderHelpers.getTotalOrderCount(userId);
                    const totalOrders = totalOrdersResult.status === 'ok' ? totalOrdersResult.totalOrders : 0;
                    const totalPages = Math.ceil(totalOrders / ordersPerPage);

                    let viewMoreProducts = await getProductViewMoreProducts();
                    res.render('customers/orders/orderHistory', {
                        layout: 'layout/layout', user, allCategories, totalCartProduct,
                        orderDetails: orderDetails.orderDetails, viewMoreProducts,
                        currentPage, totalPages,
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

                let newArrivalResult = await productHelpers.getOthersAlsoBroughtProducts();
                let viewMoreProducts = [
                    ...newArrivalResult.category1, ...newArrivalResult.category2, ...newArrivalResult.category3
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
        next(error);
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
    let result = await productHelpers.getOthersAlsoBroughtProducts();
    return [...result.category1, ...result.category2, ...result.category3];
}


module.exports = {
    getOrderSuccessPage,
    getOrderHistoryPage,
    getOrderDetailPage,
    cancelOrder,
    returnProduct
}
const productHelpers = require('../../../helpers/user/products/product-helpers');
const sessionHelpers = require('../../../helpers/user/userHelpers/session-helpers');
const categoryHelpers = require('../../../helpers/user/products/category-helpers');
const cartHelpers = require('../../../helpers/user/c&c/cart-helpers');

const getCartPage = async (req, res, next) => {
    try {
        let allCategories = await categoryHelpers.getCategoryDetails();
        let result = await productHelpers.getOthersAlsoBroughtProducts();
        let viewMoreProducts = [...result.category1, ...result.category2,
        ...result.category3];
        let sessionId = req.cookies.session;
        let sessionResult = await sessionHelpers.checkSessions(sessionId);

        if (sessionResult.status === 'ok') {
            let user = sessionResult.user;
            let cartResult = await cartHelpers.getMyCartProducts(user);

            if (cartResult) {
                const { cartProducts, totalCount, totalprice } = cartResult;
                res.render('customers/c&c/cart', {
                    layout: 'layout/layout', allCategories, viewMoreProducts, user, cartProducts, totalprice,
                    totalCartProduct: totalCount
                });
            } else {
                res.render('customers/cart', {
                    layout: 'layout/layout', allCategories, viewMoreProducts, user,
                    cartProducts: undefined, totalCartProduct: undefined, totalPrice: undefined
                });
            }
        } else {
            res.redirect('/user/login');
        }
    } catch (error) {
        next(error);
    }
};

const addProductToCart = async (req, res, next) => {
    try {
        let sessionId = req.cookies.session;
        let productId = req.params.product_id;
        let size = req.body.choosedSize;
        let sessionResult = await sessionHelpers.checkSessions(sessionId);

        if (sessionResult.status === 'ok') {
            let user = sessionResult.user;
            let result = await cartHelpers.addToCart(user, productId, size);

            if (result.status === 'ok') {
                res.status(200).json({ status: "ok" });
            } else {
                res.status(200).json({ status: "outofStock" });
            }
        } else {
            res.redirect('/user/login');
        }
    } catch (error) {
        next(error);
    }
};

const removeProductFromCart = async (req, res, next) => {
    try {
        let productId = req.params.product_id;
        let body = req.body;
        let result = await cartHelpers.removeCartProducts(productId, body);

        if (result.status === 'ok') {
            res.status(200).json({ status: "ok" });
        } else {
            res.status(400).json({ status: "nok" });
        }
    } catch (error) {
        next(error);
    }
};

const addProductCount = async (req, res, next) => {
    try {
        let sessionId = req.cookies.session;
        let productId = req.params.product_id;
        let size = req.body.size;
        let sessionResult = await sessionHelpers.checkSessions(sessionId);

        if (sessionResult.status === 'ok') {
            let user = sessionResult.user;
            let result = await cartHelpers.cartProductIncrement(productId, size, user);

            if (result.status === 'ok') {
                res.status(200).json({ status: "ok" });
            } else {
                res.status(400).json({ status: "nok" });
            }
        } else {
            res.redirect('/user/login');
        }
    } catch (error) {
        next(error);
    }
};

const decreaseProductCount = async (req, res, next) => {
    try {
        let sessionId = req.cookies.session;
        let productId = req.params.product_id;
        let size = req.body.size;
        let sessionResult = await sessionHelpers.checkSessions(sessionId);

        if (sessionResult.status === 'ok') {
            let user = sessionResult.user;
            let result = await cartHelpers.cartProductDecremnt(productId, size,user);

            if (result.status === 'ok') {
                res.status(200).json({ status: "ok" });
            } else {
                res.status(400).json({ status: "nok" });
            }
        } else {
            res.redirect('/user/login');
        }
    } catch (error) {
        next(error);
    }
};


module.exports = {
    getCartPage,
    addProductToCart,
    removeProductFromCart,
    addProductCount,
    decreaseProductCount
}

const categoryHelpers = require('../../../helpers/user/products/category-helpers');
const sessionHelpers = require('../../../helpers/user/userHelpers/session-helpers');
const productQueryHelpers = require('../../../helpers/user/products/productQuery-helpers')
const cartHelpers = require('../../../helpers/user/c&c/cart-helpers');

const searchProduct = async (req, res, next) => {
    try {
        let allCategories = await categoryHelpers.getCategoryDetails();
        let query = req.query.q;
        let sessionId = req.cookies.session;

        let sessionResult = await sessionHelpers.checkSessions(sessionId);
        const isAuthenticated = sessionResult.status === 'ok';

        if (isAuthenticated) {
            let user = sessionResult.user;
            let userId = user._id;

            let productQueryResult = await productQueryHelpers.getSearchProduct(query);

            if (productQueryResult.status === 'ok') {
                let searchProducts = productQueryResult.searchProducts;

                let cartResult = await cartHelpers.getMyCartProducts(userId);

                if (cartResult) {
                    let totalCartProduct = cartResult.totalCount;
                    res.render('customers/search', {
                        layout: 'layout/layout',
                        allCategories,
                        user,
                        totalCartProduct,
                        searchProducts
                    });
                } else {
                    res.render('customers/search', {
                        layout: 'layout/layout',
                        allCategories,
                        user,
                        searchProducts: undefined
                    });
                }
            } else {
                res.render('customers/search', {
                    layout: 'layout/layout',
                    allCategories,
                    user,
                    searchProducts: undefined
                });
            }
        } else {
            res.render('customers/search', {
                layout: 'layout/layout',
                allCategories,
                user: undefined,
                searchProducts: undefined
            });
        }
    } catch (error) {
        next(error);
    }
};

module.exports = {
    searchProduct
}
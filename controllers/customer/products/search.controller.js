const categoryHelpers = require('../../../helpers/user/category-helpers');
const sessionHelpers = require('../../../helpers/user/session-helpers');
const productQueryHelpers = require('../../../helpers/user/productQuery-helpers')
const cartHelpers = require('../../../helpers/user/cart-helpers');

const searchProduct = async (req, res, next) => {
    try {
        let allCategories = await categoryHelpers.getCategoryDetails();
        let query = req.query.q;
        console.log("queryyyyyyy", query);
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
        console.error(error);
    }
};

module.exports = {
    searchProduct
}